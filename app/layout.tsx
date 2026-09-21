'use client';

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShoppingBag, Phone, Globe } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Settings } from "@/types";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: "+7 700 512 50 40",
    instagram_url: "@breezy_store",
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) {
        setSettings(data);
      }
    }
    fetchSettings();
  }, []);

  return (
    <html lang="ru">
      <body className={`${inter.className} bg-white text-black antialiased flex flex-col min-h-screen`}>
        {/* Шапка сайта */}
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-black tracking-tighter uppercase">
              BREEZY
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
              <Link href="/" className="hover:text-neutral-500 transition">
                Главная
              </Link>
              <Link href="/catalog" className="hover:text-neutral-500 transition">
                Каталог
              </Link>
              <Link href="/about" className="hover:text-neutral-500 transition">
                О нас
              </Link>
              <Link href="/contacts" className="hover:text-neutral-500 transition">
                Контакты
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/cart"
                className="flex items-center space-x-2 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded transition text-xs font-bold uppercase"
              >
                <ShoppingBag size={16} />
                <span>Корзина</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Контент */}
        <main className="flex-grow">{children}</main>

        {/* Подвал сайта (теперь динамический) */}
        <footer className="bg-neutral-900 text-white py-12 border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-sm">BREEZY STORE</h3>
              <p className="text-neutral-400">Современная streetwear одежда для тех, кто ценит стиль и комфорт.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-neutral-300">Навигация</h4>
              <div className="flex flex-col space-y-1 text-neutral-400">
                <Link href="/" className="hover:text-white">Главная</Link>
                <Link href="/catalog" className="hover:text-white">Каталог</Link>
                <Link href="/contacts" className="hover:text-white">Контакты</Link>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-neutral-300">Контакты</h4>
              <p className="text-neutral-400 flex items-center space-x-2">
                <Phone size={14} />
                <span>{settings.whatsapp_number || '+7 700 512 50 40'}</span>
              </p>
              <p className="text-neutral-400 flex items-center space-x-2">
                <Globe size={14} />
                <span>{settings.instagram_url || '@breezy_store'}</span>
              </p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-[10px] uppercase">
            © 2026 BREEZY. Все права защищены.
          </div>
        </footer>
      </body>
    </html>
  );
}