'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState('BREEZY');
  const [phone, setPhone] = useState('+7 777 111 11 11');
  const [whatsapp, setWhatsapp] = useState('+77771111111');
  const [instagram, setInstagram] = useState('breezy_store');
  const [address, setAddress] = useState('г. Алматы, ул. Достык, 123');
  const [email, setEmail] = useState('support@breezy.kz');
  const [aboutText, setAboutText] = useState('BREEZY — современный бренд streetwear одежды.');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (data) {
      setStoreName(data.store_name || 'BREEZY');
      setPhone(data.phone || '');
      setWhatsapp(data.whatsapp || '');
      setInstagram(data.instagram || '');
      setAddress(data.address || '');
      setEmail(data.email || '');
      setAboutText(data.about_text || '');
    }
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('settings').upsert({
      id: 1,
      store_name: storeName,
      phone,
      whatsapp,
      instagram,
      address,
      email,
      about_text: aboutText,
    });

    setSaving(false);
    if (error) {
      alert('Ошибка при сохранении: ' + error.message);
    } else {
      alert('Настройки успешно обновлены!');
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-sm font-semibold">Загрузка настроек...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <Link href="/admin" className="flex items-center space-x-1 text-xs font-bold uppercase text-neutral-400 hover:text-black mb-1">
            <ArrowLeft size={14} />
            <span>Назад в меню</span>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Настройки Магазина</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 border border-black/10 rounded space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Название магазина</label>
            <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full p-2 border text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Email поддержки</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Телефон</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">WhatsApp (номер для заказов)</label>
            <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full p-2 border text-sm" placeholder="+77001112233" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Instagram (@handle)</label>
            <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full p-2 border text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Адрес магазина</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1">О магазине (описание в футере)</label>
          <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} className="w-full p-2 border text-sm" rows={3} />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center space-x-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saving ? 'Сохранение...' : 'Сохранить настройки'}</span>
        </button>
      </form>
    </div>
  );
}