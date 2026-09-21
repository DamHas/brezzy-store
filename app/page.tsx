'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(name)')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Ошибка загрузки товаров:', error.message);
        } else if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Ошибка:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Главный баннер */}
      <section className="relative bg-neutral-900 text-white py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600")' }}></div>
        <div className="relative max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded">New Collection 2026</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight">BREEZY</h1>
          <p className="text-sm md:text-base text-neutral-200 max-w-xl mx-auto">
            Минимализм, комфорт и современная эстетика улиц. Коллекция актуальной streetwear одежды.
          </p>
          <div>
            <Link
              href="/catalog"
              className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition"
            >
              <span>Смотреть каталог</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Популярные товары из Supabase */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Популярные товары</h2>
            <p className="text-xs text-neutral-500 mt-1">Новинки и хиты продаж</p>
          </div>
          <Link href="/catalog" className="text-xs font-bold uppercase hover:underline">
            Все товары →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-sm text-neutral-500">Загрузка товаров...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 space-y-3">
            <p className="text-sm">В магазине пока нет товаров.</p>
            <Link href="/admin/products" className="inline-block bg-black text-white px-4 py-2 text-xs font-bold uppercase">
              Добавить первый товар в админке
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800';
              return (
                <Link key={product.id} href={`/product/${product.id}`} className="group bg-white border border-black/10 rounded overflow-hidden flex flex-col justify-between hover:border-black transition">
                  <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.old_price && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1">
                        Скидка
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      {product.categories?.name || 'Streetwear'}
                    </span>
                    <h3 className="font-bold text-sm uppercase truncate">{product.name}</h3>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline space-x-2">
                        <span className="font-black text-sm">{product.price.toLocaleString()} ₸</span>
                        {product.old_price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {Number(product.old_price).toLocaleString()} ₸
                          </span>
                        )}
                      </div>
                      <span className="p-2 bg-neutral-100 group-hover:bg-black group-hover:text-white transition rounded">
                        <ShoppingBag size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Преимущества */}
      <section className="bg-neutral-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 flex flex-col items-center">
            <Truck size={32} />
            <h3 className="font-bold uppercase text-sm">Быстрая доставка</h3>
            <p className="text-xs text-neutral-500 max-w-xs">Доставляем курьером до двери и почтой по всему миру.</p>
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <ShieldCheck size={32} />
            <h3 className="font-bold uppercase text-sm">Гарантия качества</h3>
            <p className="text-xs text-neutral-500 max-w-xs">Используем натуральные материалы и проверенную фурнитуру.</p>
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <RefreshCw size={32} />
            <h3 className="font-bold uppercase text-sm">Удобный возврат</h3>
            <p className="text-xs text-neutral-500 max-w-xs">Легкий возврат и обмен в течение 14 дней с момента покупки.</p>
          </div>
        </div>
      </section>
    </div>
  );
}