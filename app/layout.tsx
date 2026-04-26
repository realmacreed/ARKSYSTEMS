import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { GlobalUI } from "@/components/global-ui";

const syne = Syne({ subsets: ["latin"], weight: ["400","600","700","800"], variable: "--font-syne" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["300","400","500"], variable: "--font-jetbrains" });
const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["300","400","500","600"], style: ["normal","italic"], variable: "--font-chakra" });

export const metadata: Metadata = {
  title: "ARK Systems LLC: Web Design & Development Sterling Heights MI",
  description: "ARK Systems LLC builds high-performance websites, web applications, and online stores for businesses across Sterling Heights, MI and beyond.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${jetbrains.variable} ${chakra.variable}`}>
        <GlobalUI />
        {children}
      </body>
    </html>
  );
}
