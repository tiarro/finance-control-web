import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "HematKuy - Kontrol Finansial yang Mudah",
  description: "Aplikasi pengelolaan keuangan pribadi untuk membantu Anda menghemat dan mengatur keuangan dengan mudah",
  keywords: ["finance", "budgeting", "expense tracking", "personal finance"],
  authors: [{ name: "HematKuy Team" }],
  creator: "HematKuy",
  publisher: "HematKuy",
  openGraph: {
    title: "HematKuy - Kontrol Finansial yang Mudah",
    description: "Aplikasi pengelolaan keuangan pribadi untuk membantu Anda menghemat dan mengatur keuangan dengan mudah",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
