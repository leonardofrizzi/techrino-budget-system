// app/products/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Search, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import productService from '../../services/productService';

interface Product {
  id: string;
  name: string;
  category: string;
  specifications: string;
  preferredSuppliers: string[];
  typicalMargin: number;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ name: '', category: '', specifications: '', preferredSuppliers: '', typicalMargin: 0, inStock: true });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState(createData);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch products
  useEffect(() => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const data: Product[] = await productService.getProducts();
        setProducts(data);
        setCategories(Array.from(new Set(data.map((p: Product) => p.category))));
      } catch (e) {
        console.error(e);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filtered list
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || p.category === selectedCategory)
  );

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete.');
    }
  };

  // Create handlers
  const openCreateModal = () => {
    setCreateError(null);
    setCreateData({ name: '', category: '', specifications: '', preferredSuppliers: '', typicalMargin: 0, inStock: true });
    setShowCreate(true);
  };
  const closeCreateModal = () => setShowCreate(false);
  const handleCreateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateData(prev => ({ ...prev, [name]: name === 'typicalMargin' ? Number(value) : value }));
  };
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const suppliers = createData.preferredSuppliers.split(',').map(s => s.trim());
      const newProd = await productService.createProduct({ ...createData, preferredSuppliers: suppliers });
      setProducts(prev => [newProd, ...prev]);
      closeCreateModal();
    } catch {
      setCreateError('Could not create product.');
    } finally {
      setCreating(false);
    }
  };

  // Edit handlers
  const openEditModal = (prod: Product) => {
    setEditError(null);
    setEditId(prod.id);
    setEditData({
      name: prod.name,
      category: prod.category,
      specifications: prod.specifications,
      preferredSuppliers: prod.preferredSuppliers.join(', '),
      typicalMargin: prod.typicalMargin,
      inStock: prod.inStock,
    });
    setShowEdit(true);
  };
  const closeEditModal = () => setShowEdit(false);
  const handleEditChange = handleCreateChange;
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setEditing(true);
    try {
      const suppliers = editData.preferredSuppliers.split(',').map(s => s.trim());
      const updated = await productService.updateProduct(editId, { ...editData, preferredSuppliers: suppliers });
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      closeEditModal();
    } catch {
      setEditError('Could not update product.');
    } finally {
      setEditing(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin" size={48}/></div>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="container mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={16} className="mr-2"/> New Product
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center bg-gray-100 rounded px-3 flex-1">
          <Search size={18} className="text-gray-500"/>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="p-2.5 bg-transparent w-full outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
          className="p-2.5 border border-gray-300 rounded min-w-[180px]"
        >
          <option value="">All categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 border-b text-left">Name</th>
              <th className="py-3 px-4 border-b text-left">Category</th>
              <th className="py-3 px-4 border-b text-left">Specifications</th>
              <th className="py-3 px-4 border-b text-left">Suppliers</th>
              <th className="py-3 px-4 border-b text-left">Margin</th>
              <th className="py-3 px-4 border-b text-center">Stock</th>
              <th className="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-blue-50">
                <td className="py-3 px-4 border-b">{p.name}</td>
                <td className="py-3 px-4 border-b">{p.category}</td>
                <td className="py-3 px-4 border-b max-w-xs truncate">{p.specifications}</td>
                <td className="py-3 px-4 border-b">{p.preferredSuppliers.join(', ')}</td>
                <td className="py-3 px-4 border-b">{p.typicalMargin}%</td>
                <td className="py-3 px-4 border-b text-center">{p.inStock ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4 border-b text-center">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => openEditModal(p)} title="Edit" className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600">
                      <Edit size={18}/>
                    </button>
                    <button onClick={() => handleDelete(p.id)} title="Delete" className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-red-600">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Product</h2>
            {createError && <p className="text-red-600 mb-2">{createError}</p>}
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input name="name" value={createData.name} onChange={handleCreateChange} placeholder="Name" required className="w-full p-2 border rounded"/>
              <input name="category" value={createData.category} onChange={handleCreateChange} placeholder="Category" required className="w-full p-2 border rounded"/>
              <textarea name="specifications" value={createData.specifications} onChange={handleCreateChange} placeholder="Specifications" className="w-full p-2 border rounded"/>
              <input name="preferredSuppliers" value={createData.preferredSuppliers} onChange={handleCreateChange} placeholder="Suppliers (comma-separated)" className="w-full p-2 border rounded"/>
              <input name="typicalMargin" type="number" value={createData.typicalMargin} onChange={handleCreateChange} placeholder="Margin (%)" className="w-full p-2 border rounded"/>
              <div className="flex items-center space-x-2">
                <input name="inStock" type="checkbox" checked={createData.inStock} onChange={(e) => setCreateData(prev => ({ ...prev, inStock: e.target.checked }))} className="mr-2"/>
                <label>In Stock</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeCreateModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">{creating && <Loader2 size={16} className="animate-spin mr-2" />}Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            {editError && <p className="text-red-600 mb-2">{editError}</p>}
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input name="name" value={editData.name} onChange={handleEditChange} placeholder="Name" required className="w-full p-2 border rounded"/>
              <input name="category" value={editData.category} onChange={handleEditChange} placeholder="Category" required className="w-full p-2 border rounded"/>
              <textarea name="specifications" value={editData.specifications} onChange={handleEditChange} placeholder="Specifications" className="w-full p-2 border rounded"/>
              <input name="preferredSuppliers" value={editData.preferredSuppliers} onChange={handleEditChange} placeholder="Suppliers (comma-separated)" className="w-full p-2 border rounded"/>
              <input name="typicalMargin" type="number" value={editData.typicalMargin} onChange={handleEditChange} placeholder="Margin (%)" className="w-full p-2 border rounded"/>
              <div className="flex items-center space-x-2">
                <input name="inStock" type="checkbox" checked={editData.inStock} onChange={(e) => setEditData(prev => ({ ...prev, inStock: e.target.checked }))} className="mr-2"/>
                <label>In Stock</label>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={editing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">{editing && <Loader2 size={16} className="animate-spin mr-2" />}Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
