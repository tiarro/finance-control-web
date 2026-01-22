"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogIn, LogOut, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type UserMetadataProfile = {
  fullName: string;
  email: string;
};

interface UserProfileDropdownProps {
  sessionProfile: UserMetadataProfile;
  isMobile?: boolean;
}

export function UserProfileDropdown({ sessionProfile, isMobile = false }: UserProfileDropdownProps) {
  const router = useRouter();
  const supabase = createClient();
  const isLoggedIn = !!sessionProfile.fullName;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Mobile version - show profile directly without dropdown
  if (isMobile) {
    if (isLoggedIn) {
      return (
        <div className="space-y-3">
          <div className="flex flex-col p-3 bg-muted rounded-lg gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={sessionProfile.fullName} />
              <AvatarFallback>
                {sessionProfile.fullName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{sessionProfile.fullName}</p>
              <p className="text-xs text-muted-foreground">{sessionProfile.email}</p>
            </div>

            <Button
              variant="outline"
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-accent rounded-md transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Link
          href="/login"
          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Masuk</span>
        </Link>
        <Link
          href="/register"
          className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Daftar</span>
        </Link>
      </div>
    );
  }

  // Desktop version - use dropdown
  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={sessionProfile.fullName} />
              <AvatarFallback>
                {sessionProfile.fullName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <p className="text-sm text-muted-foreground leading-none">
                {sessionProfile.fullName}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuLabel>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <p className="text-sm text-muted-foreground leading-none">
                {sessionProfile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="flex items-center cursor-pointer text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4 mr-2" />
          Akun
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>Menu Akun</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login" className="flex items-center cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            <span>Masuk</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/register" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Daftar</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
