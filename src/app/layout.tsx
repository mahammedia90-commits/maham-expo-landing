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
  title: "مهام إكسبو | منصة إدارة الفعاليات والمعارض",
  description: "مهام إكسبو - منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض. اكتشف المساحات المثالية لنشاطك التجاري.",
  keywords: "فعاليات، معارض، إيجار مساحات، مستثمرين، تجار، السعودية",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "مهام إكسبو | Maham Expo",
    description: "منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض. اكتشف المساحات المثالية لنشاطك التجاري.",
    type: "website",
    url: "https://mahamexpo.sa",
    siteName: "Maham Expo",
    locale: "ar_SA",
    images: [
      {
        url: "/hero-slide-2.png",
        width: 1200,
        height: 630,
        alt: "Maham Expo - منصة الفعاليات والمعارض",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مهام إكسبو | Maham Expo",
    description: "منصة متكاملة تربط بين المستثمرين والتجار في سوق الفعاليات والمعارض",
    images: ["/hero-slide-2.png"],
  },
  metadataBase: new URL("https://mahamexpo.sa"),
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
