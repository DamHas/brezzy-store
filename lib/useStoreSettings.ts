import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { StoreSettings } from '@/types';

const defaultSettings: StoreSettings = {
  store_name: 'BREEZY',
  logo_url: '',
  phone: '+7 777 111 11 11',
  whatsapp: '+77771111111',
  instagram: 'breezy_store',
  address: 'г. Алматы, ул. Достык, 123',
  email: 'support@breezy.kz',
  about_text: 'BREEZY — современный бренд streetwear одежды.',
  delivery_text: 'Экспресс-доставка курьером по городу и почтой по всему миру.',
  payment_text: 'Оплата картой Kaspi/Visa/MasterCard или переводом.',
  return_text: 'Возврат и обмен доступны в течение 14 дней с момента покупки.'
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (data && !error) {
          setSettings(data);
        }
      } catch (e) {
        console.error('Ошибка загрузки настроек:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}