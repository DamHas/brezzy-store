'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const imageUrl =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800';

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem('breezy_cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl,
        size: product.sizes?.[0] || 'M',
        quantity: 1,
      });
    }

    localStorage.setItem('breezy_cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group border border-black/10 bg-white hover:border-black transition flex flex-col justify-between">
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {product.old_price && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
            Скидка
          </span>
        )}
      </Link>

      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-sm uppercase tracking-tight hover:underline line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-400 uppercase mt-0.5">Streetwear</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-sm">{Number(product.price).toLocaleString()} ₸</span>
            {product.old_price && (
              <span className="text-xs text-neutral-400 line-through">
                {Number(product.old_price).toLocaleString()} ₸
              </span>
            )}
          </div>

          <button
            onClick={addToCart}
            className="p-2 bg-black text-white hover:bg-neutral-800 transition rounded-none"
            title="Добавить в корзину"
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}