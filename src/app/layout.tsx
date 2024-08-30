import "@uploadthing/react/styles.css";
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
import { cn } from "../lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import Link from "next/link";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Alex's Portfolio",
  description: "CS student at UNOmaha, focused on desktop and web programming.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const projects = await api.project.getProjects();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-gradient-to-b from-primary to-popover-foreground font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider>
          <NavigationMenu className="sticky top-0 min-h-14 justify-end bg-primary/85 filter backdrop-blur-lg">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul>
                    {projects
                      ? projects.map((project, index) => (
                          <li key={index}>
                            <NavigationMenuLink>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href={`/projects/${project.id}`}
                              >
                                {project.title}
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))
                      : null}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/resume.pdf" target="_blank">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Resume
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
