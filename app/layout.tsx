import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "One Stop Lease",
  description: "Why Buy? OneStopLease It.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Instant theme script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    const theme = localStorage.getItem('theme');
                    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.add('light');
                    }
                  } catch (e) {}
                })();
              `,
            }}
          />
        </head>
        <body className={`${jetbrainsMono.variable} antialiased`}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
