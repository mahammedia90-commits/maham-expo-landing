import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Layout } from "@/shared/components/Layout";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Maham Expo | منصة متكاملة للفعاليات والمعارض",
  description: "منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض. اكتشف المساحات المثالية لنشاطك التجاري في السعودية.",
  keywords: "Maham Expo, مهام إكسبو, فعاليات, معارض, إيجار مساحات, مستثمرين, تجار, السعودية, exhibitions, events, Saudi Arabia",
  authors: [{ name: "Maham Expo" }],
  creator: "Maham Expo",
  publisher: "Maham Expo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Maham Expo | منصة متكاملة",
    description: "منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض. اكتشف المساحات المثالية لنشاطك التجاري.",
    type: "website",
    url: "https://mahamexpo.sa",
    siteName: "Maham Expo",
    locale: "ar_SA",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maham Expo - منصة متكاملة للفعاليات والمعارض",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maham Expo | منصة متكاملة",
    description: "منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض. اكتشف المساحات المثالية لنشاطك التجاري.",
    images: ["/og-image.png"],
    creator: "@mahamexpo",
    site: "@mahamexpo",
  },
  metadataBase: new URL("https://mahamexpo.sa"),
  alternates: {
    canonical: "https://mahamexpo.sa",
    languages: {
      "ar-SA": "https://mahamexpo.sa",
      "en-US": "https://mahamexpo.sa",
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <QueryProvider>
          <Layout>{children}</Layout>
        </QueryProvider>
      </body>
    </html>
  );
}
