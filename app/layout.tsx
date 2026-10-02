import type { Metadata } from "next";
import "./globals.css";
import RunTracker from "./components/RunTracker";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Gauntlet — the benchmark for browser agents",
  description: "A reproducible, auditable benchmark for computer-use agents.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const content = <body><RunTracker />{children}</body>;
  return <html lang="en">{hasClerk ? <ClerkProvider>{content}</ClerkProvider> : content}</html>;
}
