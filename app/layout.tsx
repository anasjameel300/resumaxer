import type { Metadata } from "next";
import "./globals.css";

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
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet" />
                {/* PDF.js Worker Configuration - handled in components or globally if needed, strictly speaking Next.js handles scripts better via next/script but specific worker config might need client side effect */}
                <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" async></script>
            </head>
            <body className="bg-surface-50 text-surface-900 antialiased selection:bg-primary-100 selection:text-primary-900">
                {children}
            </body>
        </html>
    );
}
