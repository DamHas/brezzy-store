'use client';

import Link from 'next/link';
import { useStoreSettings } from '@/lib/useStoreSettings';

export default function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-black text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-widest">{settings.store_name}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {settings.about_text}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="/catalog" className="hover:text-white transition">Каталог</Link></li>
              <li><Link href="/about" className="hover:text-white transition">О магазине</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition">Доставка и оплата</Link></li>
              <li><Link href="/contacts" className="hover:text-white transition">Контакты</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>Телефон: <a href={`tel:${settings.phone}`} className="hover:underline">{settings.phone}</a></li>
              <li>WhatsApp: <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">{settings.whatsapp}</a></li>
              <li>Instagram: <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="hover:underline">@{settings.instagram}</a></li>
              <li>Email: {settings.email}</li>
            </ul>
          </div>

          {/* Admin link */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Владельцу</h4>
            <Link 
              href="/admin/login" 
              className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider border border-neutral-700 hover:bg-white hover:text-black transition"
            >
              Панель управления
            </Link>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} {settings.store_name}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}