import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@jn7dkbdn845kr1g1tgfcjp0k2s7skmcg/components";

export const metadata: Metadata = {
  title: "jn7dkbdn845kr1g1tgfcjp0k2s7skmcg-theme",
  description: "Generated with the Convex Bootstrap Harness",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
