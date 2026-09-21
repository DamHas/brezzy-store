'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, MessageCircle, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('breezy_cart') || '[]');
    setItems(savedCart);
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...items];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setItems(updated);
    localStorage.setItem('breezy_cart', JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    localStorage.setItem('breezy_cart', JSON.stringify(updated));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderWhatsApp = () => {
    if (items.length === 0) return;

    let text = 'Здравствуйте! Хочу оформить заказ из магазина BREEZY:\n\n';
    items.forEach((item, i) => {
      text += `${i + 1}. ${item.name} ${item.size ? `(Размер: ${item.size})` : ''} — ${item.quantity} шт. x ${item.price} ₸\n`;
    });
    text += `\nИтого к оплате: ${totalPrice.toLocaleString()} ₸`;

    window.open(`https://wa.me/77771111111?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <Link href="/catalog" className="flex items-center space-x-1 text-xs font-bold uppercase text-neutral-400 hover:text-black mb-1">
            <ArrowLeft size={14} />
            <span>Вернуться в каталог</span>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Корзина</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-neutral-500 text-sm">Ваша корзина пуста</p>
          <Link href="/catalog" className="inline-block bg-black text-white px-6 py-3 text-xs font-bold uppercase">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="divide-y border-t border-b">
            {items.map((item, index) => (
              <div key={index} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-neutral-100 rounded" />
                  <div>
                    <h3 className="font-bold text-sm uppercase">{item.name}</h3>
                    {item.size && <p className="text-xs text-neutral-400">Размер: {item.size}</p>}
                    <p className="text-xs font-semibold mt-1">{item.price.toLocaleString()} ₸</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center border">
                    <button onClick={() => updateQuantity(index, -1)} className="px-3 py-1 hover:bg-neutral-100">-</button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)} className="px-3 py-1 hover:bg-neutral-100">+</button>
                  </div>

                  <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-neutral-50 p-6 space-y-4 border rounded">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Итого:</span>
              <span>{totalPrice.toLocaleString()} ₸</span>
            </div>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full bg-emerald-600 text-white font-bold py-4 text-xs uppercase tracking-wider hover:bg-emerald-700 transition flex items-center justify-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>Оформить заказ в WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}