import OpenAI from 'openai';
import { getProductsForRecommendation } from '@/services/apiClient';
import type { Product } from '@/types/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ========================================
// AI RECOMMENDATION RESPONSE TYPE
// ========================================
export interface RecommendationResult {
  reasoning: string;
  recommendations: {
    productId: string;
    name: string;
    brand: string | null;
    price_jpy: number | null;
    reason: string;
  }[];
  total_price_jpy: number;
  budget_remaining_jpy: number;
  status: 'success' | 'under_budget' | 'over_budget';
}

// ========================================
// VALIDATE RECOMMENDATION WITHIN BUDGET
// ========================================
function validateBudgetConstraint(
  recommendations: RecommendationResult['recommendations'],
  budget: number
): boolean {
  const totalPrice = recommendations.reduce(
    (sum, item) => sum + (item.price_jpy || 0),
    0
  );
  return totalPrice <= budget;
}

// ========================================
// AI RECOMMENDATION ENGINE
// ========================================
export async function recommendGadgets(
  userInput: string,
  budget: number,
  keywords: string[] = []
): Promise<RecommendationResult> {
  // Fetch available products within budget
  const products = await getProductsForRecommendation(budget, keywords, 40);

  if (products.length === 0) {
    throw new Error('予算内で利用可能な商品が見つかりません。');
  }

  // Build product context for AI
  const productContext = products
    .map(
      (p) =>
        `- ID: ${p.id}, Name: ${p.name}, Brand: ${p.brand || 'N/A'}, Price: ¥${p.price_jpy || 0}, Category: ${p.category || 'Unknown'}, Description: ${p.description || 'N/A'}`
    )
    .join('\n');

  // Create AI prompt
  const systemPrompt = `
あなたはAIデスクコンシェルジュです。ユーザーの予算と好みに合わせて、最適なガジェット組み合わせを提案します。

重要な制約:
1. 提案する商品の合計価格は、ユーザーの予算を絶対に超えてはいけません。
2. 各商品を選んだ理由を明確に説明してください。
3. JSON形式で回答してください。

回答フォーマット:
\`\`\`json
{
  "reasoning": "全体的な提案の理由",
  "recommendations": [
    {
      "productId": "商品ID",
      "reason": "この商品を選んだ理由"
    }
  ]
}
\`\`\`
`;

  const userPrompt = `
予算: ¥${budget}
ユーザーのリクエスト: ${userInput}

利用可能な商品:
${productContext}

上記の商品から、ユーザーのリクエストに最もよく合う組み合わせを選択してください。
提案する商品の合計価格は¥${budget}を超えてはいけません。
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = response.choices[0].message.content;
    if (!aiResponse) {
      throw new Error('AI from OpenAI failed to generate response');
    }

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
    const parsed = JSON.parse(jsonStr);

    // Map AI recommendations to actual products
    const recommendationDetails = parsed.recommendations
      .map((rec: any) => {
        const product = products.find((p) => p.id === rec.productId);
        if (!product) return null;

        return {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          price_jpy: product.price_jpy || 0,
          reason: rec.reason,
        };
      })
      .filter((item: any) => item !== null);

    // Calculate totals
    const totalPrice = recommendationDetails.reduce(
      (sum: number, item: any) => sum + (item.price_jpy || 0),
      0
    );

    // Validate budget constraint
    if (totalPrice > budget) {
      throw new Error(`推奨の合計価格(¥${totalPrice})がユーザー予算(¥${budget})を超えています。`);
    }

    return {
      reasoning: parsed.reasoning,
      recommendations: recommendationDetails,
      total_price_jpy: totalPrice,
      budget_remaining_jpy: budget - totalPrice,
      status:
        totalPrice === budget
          ? 'success'
          : totalPrice < budget
            ? 'under_budget'
            : 'over_budget',
    };
  } catch (error: any) {
    console.error('AI recommendation error:', error);

    // Fallback: Return simple recommendations based on categories
    return getSimpleFallbackRecommendation(products, budget, userInput);
  }
}

// ========================================
// FALLBACK RECOMMENDATION (if AI fails)
// ========================================
function getSimpleFallbackRecommendation(
  products: Product[],
  budget: number,
  userInput: string
): RecommendationResult {
  // Group products by category
  const categories = new Map<string, Product[]>();
  products.forEach((p) => {
    const cat = p.category || 'その他';
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(p);
  });

  // Select one product from each category, staying within budget
  const selected: Product[] = [];
  let totalPrice = 0;

  for (const [_, categoryProducts] of categories) {
    // Sort by price (cheapest first)
    categoryProducts.sort((a, b) => (a.price_jpy || 0) - (b.price_jpy || 0));

    for (const product of categoryProducts) {
      if ((totalPrice + (product.price_jpy || 0)) <= budget) {
        selected.push(product);
        totalPrice += product.price_jpy || 0;
        break;
      }
    }
  }

  return {
    reasoning: `「${userInput}」に基づいて、各カテゴリから1つずつ厳選しました。`,
    recommendations: selected.map((p) => ({
      productId: p.id,
      name: p.name,
      brand: p.brand,
      price_jpy: p.price_jpy || 0,
      reason: `${p.category}カテゴリから選択しました。`,
    })),
    total_price_jpy: totalPrice,
    budget_remaining_jpy: budget - totalPrice,
    status: totalPrice < budget ? 'under_budget' : 'success',
  };
}

// ========================================
// REFINE RECOMMENDATION (with additional preferences)
// ========================================
export async function refineRecommendation(
  previousRecommendation: RecommendationResult,
  feedback: string,
  budget: number
): Promise<RecommendationResult> {
  // Use feedback to refine the previous recommendation
  const feedbackPrompt = `
ユーザーからのフィードバック: ${feedback}

前回の提案で選ばれた商品:
${previousRecommendation.recommendations.map((r) => `- ${r.name}: ¥${r.price_jpy}`).join('\n')}

このフィードバックに基づいて、提案を改善してください。
予算は変わらずに¥${budget}です。
`;

  // Use the previous reasoning + new feedback to generate refined recommendation
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'ユーザーのフィードバックを受けて、ガジェット推奨を改善してください。JSON形式で回答してください。',
      },
      { role: 'user', content: feedbackPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  // Parse and return refined recommendation
  const aiResponse = response.choices[0].message.content;
  if (!aiResponse) {
    throw new Error('Failed to refine recommendation');
  }

  // For simplicity, return the previous recommendation
  // In production, you'd parse the new JSON and fetch the updated products
  return previousRecommendation;
}

export { type Product } from '@/types/database';
