import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
import { cn } from "../lib/utils";

import { TRPCReactProvider } from "~/trpc/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "~/components/ui/navigation-menu";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Alex's Portfolio",
  description: "CS student at UNOmaha, focused desktop and web programming.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-gradient-to-b from-primary to-popover-foreground font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <NavigationMenu>
            <NavigationMenuList>
              <div>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={
                        navigationMenuTriggerStyle() +
                        " " +
                        "border-b border-r border-black focus:bg-primary focus:text-accent focus:outline-none"
                      }
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
