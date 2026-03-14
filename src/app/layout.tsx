import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageLoadingOverlay from "@/components/PageLoadingOverlay";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Win/Loss AI - Sales Intelligence Platform",
  description: "AI-powered win/loss analysis and ICP refinement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-900`}
      >
        <Providers>
          <PageLoadingOverlay />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
