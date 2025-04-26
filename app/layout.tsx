import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import SupabaseProvider from "@/components/SupabaseProvider";
import { ConvexClientProvider } from "@/context/ConvexClientProvider";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "JobAssistant.ai | AI-Powered Job Application Assistant",
  description: "Get personalized insights for your job applications with our AI-powered assistant. Improve your resume and prepare for interviews with detailed feedback.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      }
    ],
    apple: {
      url: "/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180"
    }
  },
  manifest: "/manifest.json",
  authors: [
    {
      name: "JobAssistant.ai Team",
    }
  ],
  keywords: ["job application", "career advice", "AI assistant", "interview preparation", "resume optimization"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jobassistant.ai",
    title: "JobAssistant.ai | AI-Powered Job Application Assistant",
    description: "Get personalized insights for your job applications with our AI-powered assistant. Improve your resume and prepare for interviews with detailed feedback.",
    siteName: "JobAssistant.ai",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JobAssistant.ai"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "JobAssistant.ai | AI-Powered Job Application Assistant",
    description: "Get personalized insights for your job applications with our AI-powered assistant.",
    images: ["/twitter-image.png"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins`}>
        <SupabaseProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </ConvexClientProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
