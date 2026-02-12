import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
    title: "Resumaxer - AI Career Suite",
    description: "Build, analyze, and optimize your resume with AI.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${syne.variable} font-sans bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary-foreground`}>
                {children}
            </body>
        </html>
    );
}
