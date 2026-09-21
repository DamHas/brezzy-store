'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Category } from '@/types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (data) setCategories(data);
    setLoading(false);
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Укажите название категории');

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/\s+/g, '-');

    const { error } = await supabase.from('categories').insert([{ name, slug: generatedSlug }]);

    if (error) {
      alert('Ошибка при создании категории: ' + error.message);
    } else {
      setName('');
      setSlug('');
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) alert('Ошибка удаления: ' + error.message);
    else fetchCategories();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <Link href="/admin" className="flex items-center space-x-1 text-xs font-bold uppercase text-neutral-400 hover:text-black mb-1">
            <ArrowLeft size={14} />
            <span>Назад в меню</span>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Управление Категориями</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleCreateCategory} className="bg-white p-6 border border-black/10 rounded space-y-4 h-fit">
          <h2 className="text-lg font-bold uppercase border-b pb-2">Новая категория</h2>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Название *</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-2 border text-sm" 
              placeholder="Худи и Свитшоты" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Slug (URL)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              className="w-full p-2 border text-sm" 
              placeholder="hoodies (необязательно)" 
            />
          </div>

          <button type="submit" className="w-full bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition flex items-center justify-center space-x-2">
            <Plus size={16} />
            <span>Добавить категорию</span>
          </button>
        </form>

        {/* List */}
        <div className="md:col-span-2 bg-white border border-black/10 rounded">
          {loading ? (
            <div className="p-6 text-center text-sm text-neutral-500">Загрузка...</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center text-sm text-neutral-500">Категорий пока нет</div>
          ) : (
            <div className="divide-y">
              {categories.map(c => (
                <div key={c.id} className="p-4 flex justify-between items-center hover:bg-neutral-50">
                  <div>
                    <h3 className="font-bold text-sm">{c.name}</h3>
                    <p className="text-xs text-neutral-400">Slug: {c.slug}</p>
                  </div>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}