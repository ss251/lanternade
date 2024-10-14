"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon, ExternalLink, Circle } from "lucide-react";
import { useTheme } from "next-themes";
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logoutUser, isAuthenticated } = useNeynarContext();

  const navItems = [
    { href: "/feed", label: "Feed" },
    { href: "/creator", label: "Creator" },
    {
      href: "/live",
      label: "Live",
      icon: <Circle className="h-2 w-2 fill-red-500" />,
      dropdown: [
        { href: "/live/create", label: "Create Stream" },
        { href: "/live/broadcast", label: "Broadcast" },
      ],
    },
    // { href: "/profile", label: "Profile" },
  ];

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

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

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger className="flex items-center space-x-1">
                  {item.icon}
                    <span className={`text-base font-medium transition-colors ${
                      pathname.startsWith(item.href) ? "text-primary" : "text-foreground hover:text-primary"
                    }`}>
                      {item.label}
                    </span>
                    
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link href={subItem.href}>{subItem.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink key={item.href} href={item.href} active={pathname === item.href}>
                  {item.label}
                </NavLink>
              )
            ))}
          </div>

          <div className="flex items-center space-x-4">
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

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.pfp_url} alt={user.display_name} />
                    <AvatarFallback>{user.display_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="md:hidden">
                    {navItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild className="cursor-pointer">
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="border-b-primary"/>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`https://warpcast.com/${user.username}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Warpcast
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NeynarAuthButton 
                customLogoUrl="https://raw.githubusercontent.com/vrypan/farcaster-brand/refs/heads/main/icons/icon-transparent/transparent-white.png"
                className="!bg-farcaster !text-white !rounded-none !py-1 !h-10"
                modalStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground)) !important',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  borderRadius: '0',
                }}
                modalButtonStyle={{
                  backgroundColor: 'hsl(var(--farcaster))',
                  color: 'hsl(var(--primary-foreground)) !important',
                  padding: '0.5rem 1rem',
                  borderRadius: '0',
                  border: 'none',
                }}
                label="Sign In"
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
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
  );
}

export default Navbar;
