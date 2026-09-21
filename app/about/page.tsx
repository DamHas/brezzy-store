'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black uppercase tracking-widest">О бренде BREEZY</h1>
        <p className="text-sm text-neutral-500 max-w-xl mx-auto">
          Мы создаем современную streetwear одежду, объединяющую комфорт, оверсайз крой и уличную культуру.
        </p>
      </div>

      <div className="aspect-video bg-neutral-100 rounded overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200" 
          alt="BREEZY Store" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-center">
        <div className="p-6 border border-black/10 rounded">
          <h3 className="font-bold uppercase text-sm mb-2">Качество</h3>
          <p className="text-xs text-neutral-500">Плотный хлопок и прочные швы для долговременной носки.</p>
        </div>
        <div className="p-6 border border-black/10 rounded">
          <h3 className="font-bold uppercase text-sm mb-2">Дизайн</h3>
          <p className="text-xs text-neutral-500">Актуальный contemporary & streetwear силуэт.</p>
        </div>
        <div className="p-6 border border-black/10 rounded">
          <h3 className="font-bold uppercase text-sm mb-2">Доставка</h3>
          <p className="text-xs text-neutral-500">Быстрая отправка заказов по всему Казахстану.</p>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link href="/catalog" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition">
          Перейти к покупкам
        </Link>
      </div>
    </div>
  );
}