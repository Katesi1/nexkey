import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NexKey — Key & Digital Subscriptions",
    template: "%s — NexKey",
  },
  description:
    "NexKey chuyên bán Windows key, Office key, YouTube Premium, Google One và các gói digital subscription. Giao tự động sau thanh toán, hỗ trợ 24/7.",
  metadataBase: new URL("https://nexkey.local"),
  applicationName: "NexKey",
  openGraph: {
    title: "NexKey — Key & Digital Subscriptions",
    description:
      "Giao tự động sau thanh toán, hỗ trợ 24/7. Windows, Office, YouTube Premium, Google One, Combo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-slate-900"
      >
        <AppProviders>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
