'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Phone, MessageCircle, MapPin, Mail, Clock, Camera } from 'lucide-react';

export default function ContactsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    }

    fetchSettings();
  }, []);

  const phone = settings?.phone || '+7 777 111 11 11';
  const whatsapp = settings?.whatsapp || '+77771111111';
  const instagram = settings?.instagram || 'breezy_store';
  const address = settings?.address || 'г. Алматы, ул. Достык, 123';
  const email = settings?.email || 'support@breezy.kz';

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black uppercase tracking-widest">Контакты</h1>
        <p className="text-sm text-neutral-500">
          Свяжитесь с нами любым удобным способом или посетите наш офлайн-магазин
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm font-semibold">Загрузка контактов...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Контактные данные */}
          <div className="bg-white border border-black/10 p-8 rounded space-y-6">
            <h2 className="text-lg font-bold uppercase border-b pb-3">Наши контакты</h2>

            <div className="space-y-4">
              <a 
                href={`tel:${phone}`} 
                className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded transition"
              >
                <div className="p-3 bg-neutral-100 rounded-full">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Телефон</p>
                  <p className="text-sm font-bold">{phone}</p>
                </div>
              </a>

              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded transition"
              >
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">WhatsApp для заказов</p>
                  <p className="text-sm font-bold">{whatsapp}</p>
                </div>
              </a>

              <a 
                href={`https://instagram.com/${instagram}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded transition"
              >
                <div className="p-3 bg-pink-100 text-pink-700 rounded-full">
                  <Camera size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Instagram</p>
                  <p className="text-sm font-bold">@{instagram}</p>
                </div>
              </a>

              <a 
                href={`mailto:${email}`} 
                className="flex items-center space-x-4 p-3 hover:bg-neutral-50 rounded transition"
              >
                <div className="p-3 bg-neutral-100 rounded-full">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Email</p>
                  <p className="text-sm font-bold">{email}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Адрес и время работы */}
          <div className="bg-white border border-black/10 p-8 rounded space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-lg font-bold uppercase border-b pb-3">Магазин</h2>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-neutral-100 rounded-full mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Адрес</p>
                  <p className="text-sm font-bold mt-1">{address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-neutral-100 rounded-full mt-1">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-400">Режим работы</p>
                  <p className="text-sm font-bold mt-1">Ежедневно: с 10:00 до 21:00</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Без перерывов и выходных</p>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Здравствуйте! Хочу уточнить детали о магазине')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-black text-white font-bold py-4 text-xs uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>Написать в WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}