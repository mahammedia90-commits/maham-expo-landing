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
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "مهام إكسبو | منصة إدارة الفعاليات والمعارض",
    description: "اكتشف المساحات المثالية لنشاطك التجاري في الفعاليات والمعارض",
    type: "website",
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
