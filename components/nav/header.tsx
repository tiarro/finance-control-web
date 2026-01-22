"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserProfileDropdown } from "@/components/nav/user-profile-dropdown";
import { useIncomeCheck } from "@/contexts/income-check-context";
import "@/components/nav/header.css";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
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
  const router = useRouter();
  const { checkIncomeAndNavigate } = useIncomeCheck();
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

  const handleNavigationClick = (href: string) => {
    // Only check income for transactions and budgets
    if (href === "/transactions" || href === "/budgets") {
      checkIncomeAndNavigate(href, () => router.push(href));
    } else {
      router.push(href);
    }
    closeMenu();
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
                  <button
                    onClick={() => handleNavigationClick(item.href)}
                    className={cn(
                      "text-[1rem] md:gap-5 font-medium transition-colors hover:text-primary bg-transparent border-none cursor-pointer",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </button>
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

      {/* Mobile Navigation - Sidebar Style */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex bg">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeMenu}
          />
          
          {/* Sidebar */}
          <div className="relative bg-white w-80 h-screen shadow-xl">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4.5 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              
              {/* Navigation Items */}
              <nav className="flex-1 p-4">
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigationClick(item.href)}
                      className={cn(
                        "w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-3",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {/* Add icon based on route */}
                      {item.href === "/dashboard" && (
                        <div className="h-4 w-4 rounded bg-primary" />
                      )}
                      {item.href === "/transactions" && (
                        <div className="h-4 w-4 rounded bg-blue-500" />
                      )}
                      {item.href === "/budgets" && (
                        <div className="h-4 w-4 rounded bg-green-500" />
                      )}
                      {item.href === "/reports" && (
                        <div className="h-4 w-4 rounded bg-orange-500" />
                      )}
                      {item.title}
                    </button>
                  ))}
                </div>
              </nav>
              
              {/* User Profile Section */}
              <div className="border-t p-4">
                <UserProfileDropdown sessionProfile={sessionProfile} isMobile={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
