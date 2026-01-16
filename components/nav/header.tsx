"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfileDropdown } from "@/components/nav/user-profile-dropdown";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Transaksi",
    href: "/transactions",
  },
  {
    title: "Anggaran",
    href: "/budgets",
  },
  {
    title: "Laporan",
    href: "/reports",
  },
];

type UserMetadataProfile = {
  fullName: string;
  email: string;
}

export function Header() {
  const [sessionProfile, setSessionProfile] = useState<UserMetadataProfile>({
    fullName: '',
    email: ''
  })
  const supabase = createClient()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const getSession = async () => {
      // This automatically reads the Supabase cookies for you
      const { data: { session } } = await supabase.auth.getSession()
      setSessionProfile({
        fullName: session?.user.user_metadata?.full_name,
        email: session?.user.user_metadata?.email
      })
    }
    getSession()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link href="#" className="flex items-center">
            <span className="md:text-2xl font-bold">HematKuy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex w-full items-center justify-end md:mx-4">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "text-[0.9rem] md:gap-5 font-medium transition-colors hover:text-primary",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <div className="hidden md:block">
            <UserProfileDropdown sessionProfile={sessionProfile} />
          </div>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 flex flex-col space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={closeMenu}
              >
                {item.title}
              </Link>
            ))}
            <div className="py-2 text-sm">
              <UserProfileDropdown sessionProfile={sessionProfile} isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
