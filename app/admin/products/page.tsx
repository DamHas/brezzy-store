'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product, Category } from '@/types';
import { Plus, Trash2, ArrowLeft, Upload, Loader2, Edit3, X } from 'lucide-react';
import Link from 'next/link';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'One Size'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L']);
  const [sizePrices, setSizePrices] = useState<Record<string, string>>({});
  const [sizeStocks, setSizeStocks] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name', { ascending: true })
    ]);

    if (prodRes.data) setProducts(prodRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            newImages.push(publicUrlData.publicUrl);
          }
        }
      }
      setImages(newImages);
    } catch (err: any) {
      alert('Ошибка загрузки: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addImageUrlManually = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
      const updatedPrices = { ...sizePrices };
      const updatedStocks = { ...sizeStocks };
      delete updatedPrices[size];
      delete updatedStocks[size];
      setSizePrices(updatedPrices);
      setSizeStocks(updatedStocks);
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSizePriceChange = (size: string, val: string) => {
    setSizePrices({ ...sizePrices, [size]: val });
  };

  const handleSizeStockChange = (size: string, val: string) => {
    setSizeStocks({ ...sizeStocks, [size]: val });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Введите название товара');
    if (selectedSizes.length === 0) return alert('Выберите хотя бы один размер');

    const cleanedSizePrices: Record<string, number> = {};
    const cleanedSizeStocks: Record<string, number> = {};
    
    let basePrice = 0;
    let totalStock = 0;

    selectedSizes.forEach(size => {
      const p = sizePrices[size];
      const s = sizeStocks[size];
      
      const priceNum = p ? parseFloat(p) : 0;
      const stockNum = s ? parseInt(s) : 10;

      cleanedSizePrices[size] = priceNum;
      cleanedSizeStocks[size] = stockNum;

      totalStock += stockNum;
      if (basePrice === 0 && priceNum > 0) {
        basePrice = priceNum;
      }
    });

    const productData = {
      name,
      category_id: categoryId || null,
      price: basePrice,
      stock_quantity: totalStock,
      images: images,
      description,
      sizes: selectedSizes,
      size_prices: cleanedSizePrices,
      size_stocks: cleanedSizeStocks,
      is_in_stock: totalStock > 0,
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingId);
      if (error) alert('Ошибка обновления: ' + error.message);
      else {
        cancelEdit();
        fetchData();
      }
    } else {
      const { error } = await supabase.from('products').insert([productData]);
      if (error) alert('Ошибка при добавлении: ' + error.message);
      else {
        resetForm();
        fetchData();
      }
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategoryId(p.category_id || '');
    setImages(p.images || []);
    setDescription(p.description || '');
    setSelectedSizes(p.sizes || ['S', 'M', 'L']);
    
    const loadedPrices: Record<string, string> = {};
    if (p.size_prices) {
      Object.entries(p.size_prices as Record<string, any>).forEach(([s, val]) => {
        loadedPrices[s] = String(val);
      });
    }
    setSizePrices(loadedPrices);

    const loadedStocks: Record<string, string> = {};
    if (p.size_stocks) {
      Object.entries(p.size_stocks as Record<string, any>).forEach(([s, val]) => {
        loadedStocks[s] = String(val);
      });
    }
    setSizeStocks(loadedStocks);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setImages([]);
    setImageUrlInput('');
    setDescription('');
    setSelectedSizes(['S', 'M', 'L']);
    setSizePrices({});
    setSizeStocks({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Ошибка удаления: ' + error.message);
    else fetchData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <Link href="/admin" className="flex items-center space-x-1 text-xs font-bold uppercase text-neutral-400 hover:text-black mb-1">
            <ArrowLeft size={14} />
            <span>Назад в меню</span>
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Управление Товарами</h1>
        </div>
      </div>

      <form onSubmit={handleSaveProduct} className={`bg-white p-6 border rounded space-y-6 ${editingId ? 'border-amber-500 shadow-md' : 'border-black/10'}`}>
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-bold uppercase">
            {editingId ? 'Редактирование товара' : 'Новый товар'}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center space-x-1 text-xs font-bold uppercase text-red-600 hover:text-red-800"
            >
              <X size={14} />
              <span>Отменить</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Название *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border text-sm"
              placeholder="Nike Air Force 1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Категория</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full p-2 border text-sm bg-white"
            >
              <option value="">Без категории</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-bold uppercase">Фотографии товара (несколько штук):</label>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                className="w-full p-2 border text-sm"
                placeholder="Вставьте ссылку на фото или загрузите файлы ниже"
              />
              <button
                type="button"
                onClick={addImageUrlManually}
                className="bg-black text-white px-4 py-2 text-xs font-bold uppercase whitespace-nowrap hover:bg-neutral-800"
              >
                Добавить ссылку
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border px-4 py-3 flex items-center justify-center text-xs font-bold uppercase w-full">
                {uploading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                <span>Загрузить файлы с компьютера (можно выбрать сразу несколько)</span>
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Предпросмотр загруженных фото */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {images.map((url, index) => (
                  <div key={index} className="relative group border rounded bg-neutral-50 aspect-square overflow-hidden">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition"
                      title="Удалить фото"
                    >
                      <X size={12} />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Размеры, индивидуальные цены и остатки */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase">Доступные размеры:</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map(size => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-xs font-bold border transition ${
                    isSelected
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
                  }`}
                >
                  {size} {isSelected ? '✓' : ''}
                </button>
              );
            })}
          </div>

          {selectedSizes.length > 0 && (
            <div className="bg-neutral-50 p-4 border rounded space-y-3 mt-3">
              <p className="text-xs font-bold uppercase text-neutral-500">Цена и количество для каждого выбранного размера:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedSizes.map(size => (
                  <div key={size} className="bg-white p-3 border rounded space-y-2">
                    <span className="text-xs font-bold uppercase block text-black border-b pb-1">Размер: {size}</span>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-0.5">Цена (₸)</label>
                      <input
                        type="number"
                        placeholder="25000"
                        value={sizePrices[size] || ''}
                        onChange={e => handleSizePriceChange(size, e.target.value)}
                        className="w-full p-1.5 border text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-0.5">Количество</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={sizeStocks[size] || ''}
                        onChange={e => handleSizeStockChange(size, e.target.value)}
                        className="w-full p-1.5 border text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1">Описание</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border text-sm"
            rows={3}
            placeholder="Описание товара, состав..."
          />
        </div>

        <button
          type="submit"
          className={`w-full text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 ${
            editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-black hover:bg-neutral-800'
          }`}
        >
          <Plus size={16} />
          <span>{editingId ? 'Сохранить изменения' : 'Добавить товар'}</span>
        </button>
      </form>

      {/* Список товаров */}
      <div className="bg-white border border-black/10 rounded overflow-hidden">
        <h2 className="text-lg font-bold uppercase p-4 border-b">Все товары ({products.length})</h2>

        {loading ? (
          <div className="p-6 text-center text-sm text-neutral-500">Загрузка товаров...</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center text-sm text-neutral-500">Товаров пока нет</div>
        ) : (
          <div className="divide-y">
            {products.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-neutral-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800'}
                    alt={p.name}
                    className="w-12 h-12 object-cover bg-neutral-100 rounded"
                  />
                  <div>
                    <h3 className="font-bold text-sm uppercase">{p.name}</h3>
                    <p className="text-xs text-neutral-400">
                      Фото: {p.images?.length || 0} шт. | Размеры и цены: {p.sizes?.map(s => `${s}: ${p.size_prices?.[s] || 0}₸`).join(' | ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => startEdit(p)} 
                    className="p-2 text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition"
                    title="Редактировать"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 transition"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}