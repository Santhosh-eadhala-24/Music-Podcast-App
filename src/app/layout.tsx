import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Player } from "@/components/Player";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music App",
  description: "Created by Next.js framework",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="pb-32">{children}</main>
        <Player />
      </body>
    </html>
  );
}