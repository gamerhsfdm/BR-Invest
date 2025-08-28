"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BarChart2, TrendingUp, Bot, Menu } from "lucide-react";

const menuItems = [
  { icon: BarChart2, label: "Dashboard", href: "/" },
  { icon: TrendingUp, label: "Relatórios", href: "/relatorios" },
  { icon: Bot, label: "Perguntar", href: "/perguntar" },
];

interface AsideSidebarProps {
  onChangeDesktop?: (isDesktop: boolean) => void;
}

export default function AsideSidebar({ onChangeDesktop }: AsideSidebarProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    onChangeDesktop?.(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches);
      onChangeDesktop?.(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [onChangeDesktop]);

  if (isDesktop) {
    return (
      <aside className="fixed top-0 left-0 h-full w-20 bg-white border-r border-gray-200 shadow-lg flex flex-col p-6 pt-8 z-50 rounded-r-xl">
        <nav className="flex flex-col space-y-6 items-center justify-center flex-grow">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex justify-center items-center w-12 h-12 rounded-lg hover:bg-indigo-100 transition-colors text-gray-700 cursor-pointer select-none"
              aria-label={label}
            >
              <Icon size={32} />
            </a>
          ))}
        </nav>
      </aside>
    );
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Abrir menu"
          className="fixed top-5 left-4 z-50 p-3 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="w-7 h-7 text-indigo-600" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 h-full bg-white shadow-lg p-6 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col space-y-4 mt-4">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-gray-700 text-lg"
            >
              <Icon size={24} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
