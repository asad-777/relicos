import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScrolling } from "@/components/ui/smooth-scrolling";
import { GA_MEASUREMENT_ID, SITE_CONFIG } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";

const primaryFont = localFont({
  src: "../Fonts/primary_font.ttf",
  variable: "--font-primary",
});

const mainFont = localFont({
  src: "../Fonts/main_font.ttf",
  variable: "--font-main",
});

export const metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  icons: {
    icon: "/logo.png?v=2",
    shortcut: "/logo.png?v=2",
    apple: "/logo.png?v=2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {/* Inline script: apply saved theme before first paint to avoid flash. Uses Zustand persist pattern. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme-storage');if(t){var s=JSON.parse(t);if(s&&s.state&&s.state.theme)document.documentElement.setAttribute('data-theme',s.state.theme);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={cn(
        primaryFont.variable, 
        mainFont.variable, 
        "min-h-full h-full flex flex-col font-sans antialiased"
      )}>
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
        <Analytics />
      </body>
    </html>
  );
}
