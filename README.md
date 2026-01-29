# 🎯 AI Desk Concierge

An AI-powered gadget recommendation platform that suggests the perfect desk setup components based on user preferences and budget.

**Status**: Foundation Complete ✅ | Ready for UI Development

---

## 🌟 Features

- 🤖 **AI-Powered Recommendations**: GPT-4o-mini suggests optimal gadget combinations within budget
- 💰 **Budget-Aware**: Never recommends products exceeding user budget
- 🛍️ **Product Catalog**: 15+ desk gadgets (Amazon/Rakuten integrated)
- 👥 **User Setups**: Share and explore desk environment configurations
- 📍 **Visual Annotations**: Mark product locations on desk photos
- 💾 **Scalable Database**: Mercari-grade architecture for millions of users/products
- 🔗 **Affiliate Integration**: Automatic commission links for Amazon/Rakuten

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router) |
| **UI** | Tailwind CSS + shadcn/ui (ready) |
| **Backend** | Supabase (PostgreSQL) |
| **AI** | OpenAI GPT-4o-mini |
| **Auth** | Supabase Auth |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/              # Next.js pages (landing page)
├── components/       # React components (UI kit)
├── lib/
│   ├── supabase.ts   # Database client + CRUD
│   └── ai-agent.ts   # AI recommendation engine
├── services/
│   └── apiClient.ts  # Amazon/Rakuten API client
└── types/
    └── database.ts   # TypeScript interfaces + Zod schemas

supabase/migrations/  # SQL schema
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your credentials:
# - Supabase URL & Keys
# - OpenAI API Key
# - Affiliate ID
```

### 3. Initialize Database
```bash
# Run in Supabase SQL Editor:
# supabase/migrations/001_initial_schema.sql
```

### 4. Run Development Server
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## 📚 Core APIs

### AI Recommendation
```typescript
import { recommendGadgets } from '@/lib/ai-agent';

const result = await recommendGadgets(
  "3万円で集中できるデスク",  // User request
  30000,                      // Budget in JPY
  ['desk', 'keyboard']        // Optional keywords
);

// Returns: { reasoning, recommendations[], total_price_jpy, budget_remaining_jpy }
```

### Product Search
```typescript
import { searchProducts } from '@/services/apiClient';

const products = await searchProducts(
  'キーボード',   // Keywords
  15000,         // Max price
  20             // Limit
);
```

### Create Setup
```typescript
import { createSetup, addSetupItem } from '@/lib/supabase';

const setup = await createSetup(userId, {
  title: 'My Dream Desk',
  description: 'High-end workstation',
  image_url: 'https://...'
});

await addSetupItem(setup.id, {
  product_id: productId,
  position_x: 50,  // Percentage coordinates
  position_y: 30
});
```

---

## 🗄️ Database Schema

### Tables
- **profiles**: User accounts + bio
- **products**: Gadget catalog (Amazon/Rakuten)
- **setups**: User-generated desk configurations
- **setup_items**: Product assignments with image coordinates
- **interactions**: Likes, bookmarks, follows (unified)

### Key Features
✅ Row-Level Security (RLS) enabled
✅ Automatic timestamp management
✅ Efficient indexing for scale
✅ Foreign key constraints
✅ Support for affiliate URL generation

---

## 🔑 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-key

# Affiliate
NEXT_PUBLIC_AFFILIATE_ID=your-affiliate-id

# APIs (optional - uses mock data in dev)
RAKUTEN_API_KEY=
AMAZON_API_KEY=
```

---

## 🎨 Next Steps

- [ ] Build UI components with shadcn/ui
- [ ] Create recommendation page UI
- [ ] Implement authentication flow
- [ ] Build setup gallery
- [ ] Add image upload + Vision API tagging
- [ ] Create user profile pages
- [ ] Deploy to Vercel

---

## 📝 Documentation

- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Detailed implementation guide
- **[supabase/migrations/001_initial_schema.sql](./supabase/migrations/001_initial_schema.sql)** - Database schema

---

## 🚨 Development Tips

### Mock Data
Products are seeded automatically on first search. No API keys needed for development.

### Type Safety
All database operations are typed with Zod validation.

### Budget Validation
AI engine enforces strict budget constraints - never recommends exceeding user budget.

---

## 📧 Support

For help or feedback:
- Report issues: https://github.com/anthropics/claude-code/issues
- Use `/help` in Claude Code CLI

---

**Built with ❤️ for productivity enthusiasts**
