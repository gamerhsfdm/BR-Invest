import { Inter, Roboto_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BR Invest",
  description: "O seu radar de investimentos no Brasil.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active-theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  const bodyClass = cn(
    "bg-background overscroll-none font-sans antialiased",
    activeThemeValue ? `theme-${activeThemeValue}` : "",
    isScaled ? "theme-scaled" : ""
  );

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={bodyClass} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}