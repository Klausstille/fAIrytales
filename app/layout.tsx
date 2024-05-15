import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProviderComp } from "./components/SessionProvider";
import "./globals.css";

const gruppo = Inter({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
    title: "fAIrytale",
    description:
        "Explore genuine moments captured by Klaus Stille, enhanced with a touch of AI. From vivid photographs to AI-generated narratives and sounds.",
};
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <SessionProviderComp>
                <body className={gruppo.className}>{children}</body>
            </SessionProviderComp>
        </html>
    );
}
