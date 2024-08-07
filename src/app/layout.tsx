import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Chrono hub!",
  description: "A time tracking system for your organization",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-auto",
          fontSans.variable
        )}
      >
        {/* <div className="flex justify-end w-full">
          <Navigation />
        </div> */}
        {/* <main className="flex min-h-screen flex-col items-center justify-between md:p-24 p-4"> */}
        {children}
        {/* </main> */}
      </body>
    </html>
  );
}
