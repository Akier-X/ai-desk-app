/**
 * OGP (Open Graph Protocol) Image Generator
 * Generates dynamic preview images for social media sharing
 */

interface OGPOptions {
  title: string;
  description: string;
  budget: number;
  items: Array<{
    name: string;
    price: number;
    brand: string;
  }>;
  username: string;
  backgroundColor?: string;
  accentColor?: string;
}

/**
 * Generate SVG OGP image for setup sharing
 * Returns data URI that can be used as og:image
 */
export function generateOGPSVG(options: OGPOptions): string {
  const {
    title,
    description,
    budget,
    items,
    username,
    backgroundColor = '#ffffff',
    accentColor = '#3b82f6',
  } = options;

  // Truncate title if too long
  const displayTitle = title.length > 40 ? title.substring(0, 37) + '...' : title;

  // Summary of top 3 items
  const topItems = items.slice(0, 3);
  const itemsText = topItems
    .map((item) => `${item.name} - ¥${item.price.toLocaleString('ja-JP')}`)
    .join('\n');

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1200" height="630" fill="${backgroundColor}"/>

      <!-- Gradient accent -->
      <defs>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${accentColor};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.05" />
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill="url(#accentGradient)"/>

      <!-- Top accent bar -->
      <rect width="1200" height="4" fill="${accentColor}"/>

      <!-- Title -->
      <text
        x="60"
        y="120"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="54"
        font-weight="300"
        fill="#1f2937"
        text-anchor="start"
      >
        ${escapeXml(displayTitle)}
      </text>

      <!-- Description -->
      <text
        x="60"
        y="190"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="24"
        fill="#6b7280"
        text-anchor="start"
        opacity="0.8"
      >
        by @${escapeXml(username)}
      </text>

      <!-- Budget Badge -->
      <rect x="60" y="220" width="280" height="80" rx="12" fill="${accentColor}" opacity="0.1"/>
      <text
        x="80"
        y="250"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="16"
        fill="#6b7280"
        text-anchor="start"
      >
        Total Budget
      </text>
      <text
        x="80"
        y="290"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="36"
        font-weight="300"
        fill="${accentColor}"
        text-anchor="start"
      >
        ¥${budget.toLocaleString('ja-JP')}
      </text>

      <!-- Items count -->
      <rect x="380" y="220" width="280" height="80" rx="12" fill="${accentColor}" opacity="0.1"/>
      <text
        x="400"
        y="250"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="16"
        fill="#6b7280"
        text-anchor="start"
      >
        Components
      </text>
      <text
        x="400"
        y="290"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="36"
        font-weight="300"
        fill="${accentColor}"
        text-anchor="start"
      >
        ${items.length} Items
      </text>

      <!-- Top items preview -->
      <text
        x="60"
        y="350"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="18"
        font-weight="500"
        fill="#1f2937"
      >
        Featured Items:
      </text>

      ${topItems
        .map(
          (item, index) => `
        <text
          x="60"
          y="${400 + index * 50}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="16"
          fill="#374151"
        >
          • ${escapeXml(item.name)}
        </text>
        <text
          x="900"
          y="${400 + index * 50}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="16"
          fill="#6b7280"
          text-anchor="end"
        >
          ¥${item.price.toLocaleString('ja-JP')}
        </text>
      `
        )
        .join('')}

      <!-- Canvas branding -->
      <text
        x="1140"
        y="600"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="14"
        fill="#9ca3af"
        text-anchor="end"
      >
        Canvas • Design Your Perfect Desk
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate OGP meta tags for HTML head
 */
export function generateOGPMetaTags(
  options: OGPOptions & {
    url: string;
  }
): {
  [key: string]: string;
} {
  const ogpImage = generateOGPSVG(options);

  return {
    'og:title': options.title,
    'og:description': options.description,
    'og:image': ogpImage,
    'og:type': 'website',
    'og:url': options.url,
    'twitter:card': 'summary_large_image',
    'twitter:title': options.title,
    'twitter:description': options.description,
    'twitter:image': ogpImage,
  };
}
