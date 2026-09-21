'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('breezy_cart') || '[]');
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-black uppercase tracking-widest">
          BREEZY
        </Link>

        {/* Навигация */}
        <nav className="hidden md:flex space-x-8 text-xs font-bold uppercase tracking-wider">
          <Link href="/catalog" className="hover:text-neutral-500 transition">
            Каталог
          </Link>
          <Link href="/catalog?sort=new" className="hover:text-neutral-500 transition">
            Новинки
          </Link>
          <Link href="/about" className="hover:text-neutral-500 transition">
            О нас
          </Link>
          <Link href="/contacts" className="hover:text-neutral-500 transition">
            Контакты
          </Link>
        </nav>

        {/* Правая часть — только Иконка Корзины */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/cart" 
            className="relative p-2 hover:bg-neutral-100 rounded-full transition"
            title="Перейти в корзину"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}