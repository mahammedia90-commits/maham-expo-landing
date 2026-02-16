import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Layout } from "@/shared/components/Layout";
import { StructuredData } from "@/shared/components/StructuredData";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Maham Expo | تأجير بوثات على خطاه | فعاليات الرياض الكبرى",
  description:
    "منصة مهام إكسبو لتأجير البوثات والمساحات التجارية في فعالية على خطاه - رحلة من مكة إلى المدينة. احجز بوثك في أكبر فعاليات الرياض الموسمية واستثمر في مواقع استراتيجية للمطاعم والتجزئة.",
  keywords:
    "على خطاه, فعالية على خطاه, تأجير بوثات, بوثات على خطاه, فعاليات الرياض, فعاليات الرياض الكبرى, Maham Expo, مهام إكسبو, Ala Khutah, booth rental Riyadh, معارض السعودية, إيجار مساحات تجارية, مساحات فعاليات, استثمار فعاليات, بوثات مطاعم, بوثات تجزئة, رحلة مكة المدينة, موسم الرياض, exhibitions Saudi Arabia, events Riyadh",
  authors: [{ name: "Maham Expo" }],
  creator: "Maham Expo",
  publisher: "Maham Expo",
  applicationName: "Maham Expo",
  category: "events",
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
    title: "Maham Expo | تأجير بوثات على خطاه | فعاليات الرياض الكبرى",
    description:
      "احجز بوثك في فعالية على خطاه - أكبر فعاليات الرياض الموسمية. مساحات تجارية للمطاعم والتجزئة في رحلة من مكة إلى المدينة عبر مهام إكسبو.",
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
        alt: "Maham Expo - تأجير بوثات فعالية على خطاه في الرياض",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maham Expo | تأجير بوثات على خطاه | فعاليات الرياض",
    description:
      "احجز بوثك في فعالية على خطاه - أكبر فعاليات الرياض الموسمية. مساحات تجارية للمطاعم والتجزئة عبر مهام إكسبو.",
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
      <head>
        <StructuredData />
      </head>
      <body className={`${cairo.variable} font-cairo antialiased`}>
        <QueryProvider>
          <Layout>{children}</Layout>
        </QueryProvider>
      </body>
    </html>
  );
}
