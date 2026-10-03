import type { Metadata } from "next";
import "./globals.css";
import RunTracker from "./components/RunTracker";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["400", "500", "600", "700"] });
const ui = DM_Sans({ subsets: ["latin"], variable: "--font-ui", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Gauntlet — the benchmark for browser agents",
  description: "A reproducible, auditable benchmark for computer-use agents.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const content = <body className={`${display.variable} ${ui.variable}`}><RunTracker />{children}</body>;
  return <html lang="en">{hasClerk ? <ClerkProvider>{content}</ClerkProvider> : content}</html>;
}
