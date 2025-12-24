import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter', // optional but recommended
})

export const metadata: Metadata = {
  title: "Alpha Kappa Psi",
  description: "Michigan's Premier Business Fraternity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <RouteTransitionLoader />
        {children}
      </body>
    </html>
  );
}
