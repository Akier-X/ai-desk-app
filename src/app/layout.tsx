import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { BottomTabNavigation } from "@/components/BottomTabNavigation";
import { AppInitializer } from "@/components/AppInitializer";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canvas - Design Your Perfect Desk Setup",
  description: "AI-powered desk gadget recommendations with a canvas-based interface",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Canvas",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* iOS Specific Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Canvas" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <AuthProvider>
          <AppInitializer />
          <Header />
          <main className="pt-20 pb-24">
            {children}
          </main>
          <BottomTabNavigation />
        </AuthProvider>
      </body>
    </html>
  );
}
