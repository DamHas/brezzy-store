'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Package, FolderTree, Settings as SettingsIcon, LogOut, ArrowRight, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prodRes, catRes] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          productsCount: prodRes.count || 0,
          categoriesCount: catRes.count || 0,
        });
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Шапка админки */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Панель управления</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Управляйте товарами, категориями и настройками вашего магазина BREEZY
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="bg-neutral-100 hover:bg-neutral-200 text-black px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center space-x-2"
          >
            <ExternalLink size={14} />
            <span>Открыть сайт</span>
          </Link>
          <Link
            href="/admin/login"
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded text-xs font-bold uppercase transition flex items-center space-x-2"
          >
            <LogOut size={14} />
            <span>Выйти</span>
          </Link>
        </div>
      </div>

      {/* Карточки разделов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Управление товарами */}
        <Link
          href="/admin/products"
          className="bg-white border border-black/10 p-8 rounded-lg hover:border-black transition group flex flex-col justify-between space-y-8 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-neutral-100 rounded-lg group-hover:bg-black group-hover:text-white transition">
              <Package size={24} />
            </div>
            <ArrowRight size={20} className="text-neutral-400 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Товары</h2>
            <p className="text-xs text-neutral-500 mt-1">
              {loading ? 'Загрузка...' : `Всего товаров: ${stats.productsCount}`}
            </p>
          </div>
        </Link>

        {/* Управление категориями */}
        <Link
          href="/admin/categories"
          className="bg-white border border-black/10 p-8 rounded-lg hover:border-black transition group flex flex-col justify-between space-y-8 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-neutral-100 rounded-lg group-hover:bg-black group-hover:text-white transition">
              <FolderTree size={24} />
            </div>
            <ArrowRight size={20} className="text-neutral-400 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Категории</h2>
            <p className="text-xs text-neutral-500 mt-1">
              {loading ? 'Загрузка...' : `Всего категорий: ${stats.categoriesCount}`}
            </p>
          </div>
        </Link>

        {/* Настройки магазина */}
        <Link
          href="/admin/settings"
          className="bg-white border border-black/10 p-8 rounded-lg hover:border-black transition group flex flex-col justify-between space-y-8 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-neutral-100 rounded-lg group-hover:bg-black group-hover:text-white transition">
              <SettingsIcon size={24} />
            </div>
            <ArrowRight size={20} className="text-neutral-400 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Настройки</h2>
            <p className="text-xs text-neutral-500 mt-1">Контакты, телефон, WhatsApp</p>
          </div>
        </Link>
      </div>
    </div>
  );
}