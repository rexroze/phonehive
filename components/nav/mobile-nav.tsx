"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Package, Sparkles, Receipt, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/inventory", icon: Package, label: "Inventory" },
  { href: "/ai-tools", icon: Sparkles, label: "AI Tools" },
  { href: "/expenses", icon: Receipt, label: "Expenses" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const adminNavItem = {
  href: "/admin",
  icon: Shield,
  label: "Admin",
};

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === "ADMIN";

  // For mobile, we'll show a subset of items to fit the screen
  // Show Dashboard, Inventory, AI Tools, Expenses, and Admin (if admin) or Settings
  const mobileItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/ai-tools", icon: Sparkles, label: "AI Tools" },
    { href: "/expenses", icon: Receipt, label: "Expenses" },
    ...(isAdmin ? [adminNavItem] : [{ href: "/settings", icon: Settings, label: "Settings" }]),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex justify-around">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 text-xs min-w-0 flex-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

