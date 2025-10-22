import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BIMVerdi - Norsk plattform for BIM-verdiskapning",
  description: "BIMVerdi er den ledende norske plattformen for Building Information Modeling (BIM). Finn medlemsbedrifter, verktøy, caser og arrangementer.",
  keywords: ["BIM", "Building Information Modeling", "Norge", "bygg", "digitalisering"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
