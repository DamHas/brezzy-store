'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types';
import { ShoppingBag, ArrowLeft, Check, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      setLoading(true);

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (data) {
        setProduct(data);
        setCurrentPrice(data.price);
        if (data.sizes && data.sizes.length > 0) {
          const firstSize = data.sizes[0];
          setSelectedSize(firstSize);
          if (data.size_prices && data.size_prices[firstSize]) {
            setCurrentPrice(data.size_prices[firstSize]);
          }
        }
      }
      setLoading(false);
    }

    fetchProduct();
  }, [productId]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    if (product) {
      if (product.size_prices && product.size_prices[size]) {
        setCurrentPrice(product.size_prices[size]);
      } else {
        setCurrentPrice(product.price);
      }
    }
  };

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem('breezy_cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.id === product.id && item.size === selectedSize);

    const activeImage = product.images?.[activeImageIndex] || product.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800';

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: currentPrice,
        image: activeImage,
        size: selectedSize || 'Без размера',
        quantity: 1,
      });
    }

    localStorage.setItem('breezy_cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const buyNowWhatsApp = () => {
    if (!product) return;
    const text = encodeURIComponent(`Здравствуйте! Хочу купить: ${product.name} ${selectedSize ? `(Размер: ${selectedSize})` : ''} — Цена: ${currentPrice.toLocaleString()} ₸`);
    window.open(`https://wa.me/77771111111?text=${text}`, '_blank');
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-semibold">Загрузка товара...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Товар не найден</h1>
        <Link href="/catalog" className="inline-block bg-black text-white px-6 py-2 text-xs font-bold uppercase">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800'];

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <Link href="/catalog" className="inline-flex items-center space-x-2 text-xs font-bold uppercase text-neutral-500 hover:text-black">
        <ArrowLeft size={16} />
        <span>Назад в каталог</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Галерея изображений */}
        <div className="space-y-4">
          <div className="bg-neutral-100 aspect-square overflow-hidden rounded border">
            <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImageIndex === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-black uppercase tracking-tight">{product.name}</h1>
            
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-black">{currentPrice.toLocaleString()} ₸</span>
              {product.old_price && (
                <span className="text-sm text-neutral-400 line-through">
                  {Number(product.old_price).toLocaleString()} ₸
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description || 'Качественная streetwear одежда премиального кроя BREEZY.'}
            </p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-4">
                <label className="block text-xs font-bold uppercase">Выберите размер:</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const sizePrice = product.size_prices?.[size];
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-3 text-xs font-bold border transition flex flex-col items-center min-w-[70px] ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-300 hover:border-black bg-white text-black'
                        }`}
                      >
                        <span>{size}</span>
                        <span className={`text-[10px] mt-0.5 ${selectedSize === size ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {sizePrice ? `${Number(sizePrice).toLocaleString()} ₸` : `${Number(product.price).toLocaleString()} ₸`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t">
            <button
              onClick={addToCart}
              className="w-full bg-black text-white font-bold py-4 text-xs uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center space-x-2"
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              <span>{added ? 'Добавлено в корзину!' : 'Добавить в корзину'}</span>
            </button>

            <button
              onClick={buyNowWhatsApp}
              className="w-full bg-emerald-600 text-white font-bold py-4 text-xs uppercase tracking-wider hover:bg-emerald-700 transition flex items-center justify-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>Купить в 1 клик через WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}