
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '../app/providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://linkhub.exemplo.com"), 
  title: {
    default: "LinkHub – Todos os seus links em um só lugar",
    template: "%s | LinkHub",
  },
  description: "Organize e compartilhe todos os seus links importantes em um só lugar com o LinkHub.",
  keywords: [
    "LinkHub",
    "Linktree brasileiro",
    "links personalizados",
    "biolink",
    "redes sociais",
    "landing page pessoal",
    "perfil online",
    "next.js",
    "hub de links"
  ],
  authors: [{ name: "CROW", url: "https://linkhub.exemplo.com" }],
  creator: "CROW",
  publisher: "LinkHub",
  openGraph: {
    title: "LinkHub – Todos os seus links em um só lugar",
    description: "Crie seu próprio hub de links e compartilhe nas redes sociais com estilo.",
    url: "https://linkhub.exemplo.com",
    siteName: "LinkHub",
    images: [
      {
        url: "https://linkhub.exemplo.com/og-image.png", 
        width: 1200,
        height: 630,
        alt: "LinkHub – Seu hub de links personalizado",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkHub – Todos os seus links em um só lugar",
    description: "Organize seus links e compartilhe com estilo nas redes sociais com o LinkHub.",
    site: "@seu_twitter",
    creator: "@seu_twitter",
    images: ["https://linkhub.exemplo.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#000000", 
  category: "technology",
  alternates: {
    canonical: "https://linkhub.vercel.app",
    languages: {
      "en-US": "https://linkhub.vercel.app/en",
      "pt-BR": "https://linkhub.vercel.app/pt",
      "es-ES": "https://linkhub.vercel.app/es",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
