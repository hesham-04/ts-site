import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexProvider } from "@/components/providers/convex.provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trojan",
  description: "Trojan is a connected and integrated workspace for developers.",

  icons : {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.png",
        href: "/logo-dark.png",
        type: "image/png"
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-light.png",
        href: "/logo-light.png",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="trojan-theme"
          >
            <Toaster position='bottom-right'/>
            {children}
          </ThemeProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
