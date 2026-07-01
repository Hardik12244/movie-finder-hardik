import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ToastProvider } from "@/context/ToastContext";
import { MediaTrackingProvider } from "@/context/MediaTrackingContext";
import { ToastContainer } from "@/components/states/ToastContainer";
import { RouteProgressBar } from "@/components/layout/RouteProgressBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CineFolio",
  description: "A fast, focused media tracking platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans">
        <RouteProgressBar />
        <FavoritesProvider>
          <MediaTrackingProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
              <ToastContainer />
            </ToastProvider>
          </MediaTrackingProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}

