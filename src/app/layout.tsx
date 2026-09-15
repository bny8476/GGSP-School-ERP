import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E.A.S. Academy School ERP",
  description: "Comprehensive management system for E.A.S. Academy School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                var storedLang = localStorage.getItem('language');
                if (storedLang) {
                  document.documentElement.lang = storedLang;
                  if (storedLang === 'ar') {
                    document.documentElement.dir = 'rtl';
                  }
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-[#000a1f] text-[#000E28] dark:text-white transition-colors duration-200`}>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow pt-24">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
