import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vocab Game",
  description: "Japanese vocabulary game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0D0B14] text-black antialiased">
        {children}
      </body>
    </html>
  );
}
