import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "NexKey — Key Windows Bản Quyền Chính Hãng",
  description:
    "Cung cấp key Windows chính hãng – Kích hoạt online 100% – Hỗ trợ cài đặt từ xa nhanh chóng – Bảo hành uy tín.",
  keywords: "key windows, windows 11 pro, windows 10 pro, key bản quyền, kích hoạt windows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC on theme load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18208568684"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18208568684');
          `}
        </Script>
      </body>
    </html>
  );
}
