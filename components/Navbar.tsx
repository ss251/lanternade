"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <svg
                className="relative w-10 h-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Lantern body */}
                <path
                  d="M7 6h10v12H7V6z"
                  stroke="#FFA500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(255, 165, 0, 0.3)"
                />
                {/* Lantern top */}
                <path
                  d="M6 6h12"
                  stroke="#FFA500"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Lantern bottom */}
                <path
                  d="M8 18h8"
                  stroke="#FFA500"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Flame */}
                <path
                  d="M12 9c0 1.3 0.8 2.4 1.5 3.2C14.3 13 15 14.5 15 15.5c0 1.3-1.3 2.5-3 2.5s-3-1.2-3-2.5c0-1 0.7-2.5 1.5-3.3C11.2 11.4 12 10.3 12 9z"
                  fill="#FF4500"
                >
                  <animate
                    attributeName="d"
                    values="
                    M12 9c0 1.3 0.8 2.4 1.5 3.2C14.3 13 15 14.5 15 15.5c0 1.3-1.3 2.5-3 2.5s-3-1.2-3-2.5c0-1 0.7-2.5 1.5-3.3C11.2 11.4 12 10.3 12 9z;
                    M12 9c0 1.3 1 2.4 1.7 3.2C14.5 13 15 14.5 15 15.5c0 1.3-1.3 2.5-3 2.5s-3-1.2-3-2.5c0-1 0.5-2.5 1.3-3.3C11 11.4 12 10.3 12 9z;
                    M12 9c0 1.3 0.8 2.4 1.5 3.2C14.3 13 15 14.5 15 15.5c0 1.3-1.3 2.5-3 2.5s-3-1.2-3-2.5c0-1 0.7-2.5 1.5-3.3C11.2 11.4 12 10.3 12 9z"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
                {/* Handle */}
                <path
                  d="M9 3c0 1.5 6 1.5 6 0"
                  stroke="#FFA500"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold hidden sm:inline text-foreground">
              Lanternade
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-4">
              <NavLink href="/feed" active={pathname === "/feed"}>Feed</NavLink>
              <NavLink href="/creator" active={pathname === "/creator"}>Creator</NavLink>
              <NavLink href="/profile" active={pathname === "/profile"}>Profile</NavLink>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="outline"
              className="bg-farcaster text-white hover:bg-farcaster/80 transition-colors"
            >
              <Image
                src="https://raw.githubusercontent.com/vrypan/farcaster-brand/refs/heads/main/icons/icon-square/purple-white.png"
                alt="Farcaster logo"
                width={20}
                height={20}
                className="mr-2 rounded-sm"
              />
              <span className="hidden sm:inline">Sign in with Farcaster</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
      <Link
        href={href}
        className={`text-base font-medium transition-colors ${
          active
            ? "text-primary"
            : "text-foreground hover:text-primary"
        }`}
      >
        {children}
      </Link>
    )
  }
  
  export default Navbar
