"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  categories: Category[];
  title: string;
  defaultCategory?: string;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  categories,
  title,
  defaultCategory = "all",
  onSearch,
  actions,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || defaultCategory;
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === defaultCategory) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Handle Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("dashboard-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="h-16 flex items-center px-4">
          <div className="font-semibold text-lg">{title}</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton 
                      isActive={currentCategory === category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className="cursor-pointer"
                    >
                      {category.icon}
                      <span>{category.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-muted/10">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-border/40 bg-background/60 backdrop-blur-2xl px-4 sm:px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="dashboard-search"
                type="text"
                placeholder="Search... (Ctrl+K)"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-full border border-border/40 bg-background/50 backdrop-blur-sm py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 text-foreground">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
