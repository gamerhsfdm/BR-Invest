"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/" },
  { icon: "📈", label: "Relatórios", href: "/relatorios" },
  { icon: "🤖", label: "Perguntar", href: "/perguntar" },
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
          {menuItems.map(({ icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex justify-center items-center w-12 h-12 rounded-lg hover:bg-indigo-100 transition-colors text-gray-700 cursor-pointer select-none text-3xl"
              aria-label={label}
            >
              {icon}
            </Link>
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
          <svg
            className="w-7 h-7 text-indigo-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
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
          {menuItems.map(({ icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-gray-700 text-lg"
            >
              <span className="text-2xl">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}