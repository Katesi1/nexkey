"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/providers/ThemeProvider";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/#products" },
  { label: "Câu hỏi thường gặp", href: "/faq" },
  { label: "Chính sách bảo hành", href: "/bao-hanh" },
  { label: "Liên hệ", href: "/#contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl shadow-lg dark:shadow-[#000]/40 bg-white/95 dark:bg-[#050b1a]/95"
          : "backdrop-blur-md bg-white/80 dark:bg-transparent"
      } border-b border-slate-200/60 dark:border-white/[0.06]`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
            <span className="text-white font-bold text-base leading-none">N</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
              NexKey
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
              Windows License Service
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href="https://zalo.me/0917379181"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            <Image src="/icons/zalo.svg" alt="Zalo" width={20} height={20} className="rounded-sm" />
            <span>Zalo</span>
          </a>

          <a
            href="https://www.facebook.com/nguyen.vu.nam.2001"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877f2] hover:bg-[#1265d8] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Image src="/icons/facebook.svg" alt="Facebook" width={16} height={16} className="brightness-0 invert" />
            <span>Facebook</span>
          </a>

          <button
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#080f22] px-4 py-3 space-y-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm rounded-lg transition-colors text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex gap-2">
            <a
              href="https://zalo.me/0917379181"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Zalo
            </a>
            <a
              href="https://www.facebook.com/nguyen.vu.nam.2001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 bg-[#1877f2] hover:bg-[#1265d8] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
