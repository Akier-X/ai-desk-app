import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Desk Concierge",
  description: "Your AI-powered desk gadget recommendation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
