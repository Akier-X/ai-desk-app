import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canvas - Design Your Perfect Desk Setup",
  description: "AI-powered desk gadget recommendations with a canvas-based interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <AuthProvider>
          <Header />
          <main className="pt-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
