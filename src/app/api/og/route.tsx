import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

interface QueryParams {
  title?: string;
  budget?: string;
  items?: string;
  username?: string;
  color?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const title = searchParams.get('title') || 'My Perfect Desk Setup';
    const budget = searchParams.get('budget') || '¥150,000';
    const itemsParam = searchParams.get('items');
    const username = searchParams.get('username') || 'Designer';
    const color = searchParams.get('color') || '#3b82f6'; // Blue-600

    // Parse items JSON
    let items = [];
    if (itemsParam) {
      try {
        items = JSON.parse(decodeURIComponent(itemsParam)).slice(0, 3); // Top 3 items
      } catch (e) {
        // Default items if parsing fails
        items = [
          { name: 'Monitor', price: '¥39,800' },
          { name: 'Keyboard', price: '¥9,900' },
          { name: 'Mouse', price: '¥11,900' },
        ];
      }
    }

    const accentColor = color;

    return new ImageResponse(
      (
        <div
          style={{
            background: `linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            fontFamily: 'system-ui, -apple-system, "Segoe UI"',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glassmorphism background elements */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              height: '400px',
              background: `${accentColor}15`,
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '350px',
              height: '350px',
              background: `${accentColor}10`,
              borderRadius: '50%',
              filter: 'blur(60px)',
              opacity: 0.5,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Top Section */}
            <div>
              {/* Logo & Brand */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '40px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: accentColor,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  C
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '500',
                    color: '#1f2937',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Canvas
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: '300',
                  color: '#1f2937',
                  marginBottom: '20px',
                  lineHeight: '1.2',
                  maxWidth: '90%',
                }}
              >
                {title}
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: '24px',
                  color: '#6b7280',
                  marginBottom: '40px',
                }}
              >
                by @{username}
              </div>
            </div>

            {/* Middle Section - Budget & Items */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '40px',
              }}
            >
              {/* Budget Card */}
              <div
                style={{
                  background: `${accentColor}0a`,
                  border: `2px solid ${accentColor}20`,
                  borderRadius: '16px',
                  padding: '24px 32px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}
                >
                  TOTAL BUDGET
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: '300',
                    color: accentColor,
                  }}
                >
                  {budget}
                </div>
              </div>

              {/* Items Count */}
              <div
                style={{
                  background: `${accentColor}0a`,
                  border: `2px solid ${accentColor}20`,
                  borderRadius: '16px',
                  padding: '24px 32px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                  }}
                >
                  COMPONENTS
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: '300',
                    color: accentColor,
                  }}
                >
                  {items.length}
                </div>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '8px',
                  }}
                >
                  Featured Items
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '24px',
                    justifyContent: 'space-between',
                  }}
                >
                  {items.map((item: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        fontSize: '16px',
                        color: '#374151',
                        flex: 1,
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginTop: '4px',
                        }}
                      >
                        {item.price || item.price_jpy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#9ca3af',
            }}
          >
            <div
              style={{
                width: '2px',
                height: '2px',
                background: '#9ca3af',
                borderRadius: '50%',
              }}
            />
            <div>Canvas • Design Your Perfect Desk</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('OGP generation error:', error);
    return new Response('Failed to generate OGP image', { status: 500 });
  }
}
