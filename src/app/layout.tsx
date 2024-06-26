import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "@/authContext/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note taking app",
  description: "note taking app created using next and firebase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-[aliceblue]"}>
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  );
}
