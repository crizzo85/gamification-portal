import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portale Gamification",
  description: "Un portale per la gamification a scuola",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Providers>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Portale Gamification</h1>
              <div className="flex space-x-4">
                <Link href="/">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
                    Home
                  </button>
                </Link>
                <Link href="/badges">
                  <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    Gestisci Badge
                  </button>
                </Link>
              </div>
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}