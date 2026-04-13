import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "LinkInBio — Your link in bio, elevated",
    template: "%s | LinkInBio",
  },
  description:
    "Create your personalized link page in seconds. Share all your important links with one beautiful, trackable page.",
  keywords: ["linktree", "link in bio", "link page", "bio link"],
  openGraph: {
    title: "LinkInBio",
    description: "Create your personalized link page in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
