'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true })
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);

      setLoading(false);
    }

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Каталог Одежды</h1>
        <p className="text-xs text-neutral-500 mt-1">Ознакомьтесь с нашей новой коллекцией streetwear</p>
      </div>

      {/* Фильтр по категориям */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-bold uppercase transition ${
            selectedCategory === 'all'
              ? 'bg-black text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Все товары
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-bold uppercase transition ${
              selectedCategory === cat.id
                ? 'bg-black text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Список товаров */}
      {loading ? (
        <div className="text-center py-20 text-sm font-semibold">Загрузка каталога...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-sm text-neutral-500">
          Товары в этой категории пока отсутствуют
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}