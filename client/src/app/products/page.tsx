// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, FileText } from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  lastQuote: {
    price: number;
    date: string;
  };
  specifications: string;
  preferredSuppliers: string[];
  typicalMargin: number;
}

// Sample data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'HDMI Cable 2.0 1.8m',
    category: 'Cables',
    lastQuote: {
      price: 35.90,
      date: '2025-03-15',
    },
    specifications: 'Supports 4K, compatible with HDCP 2.2',
    preferredSuppliers: ['Supplier A', 'Supplier B'],
    typicalMargin: 20,
  },
  {
    id: '2',
    name: '8-Port Gigabit Switch',
    category: 'Networking',
    lastQuote: {
      price: 189.50,
      date: '2025-04-02',
    },
    specifications: 'Unmanaged, desktop, 10/100/1000',
    preferredSuppliers: ['Supplier C', 'Supplier D'],
    typicalMargin: 15,
  },
  // More products can be added here
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Extract unique categories from products
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
    setCategories(uniqueCategories);
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span> New Product
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center bg-gray-100 rounded px-3 flex-1">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2.5 bg-transparent border-none w-full outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2.5 border border-gray-300 rounded min-w-[180px]"
        >
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        {filteredProducts.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No products found</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Name</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Category</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Last Quote</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Specifications</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-blue-50">
                    <td className="py-3.5 px-4 border-b border-gray-200">{product.name}</td>
                    <td className="py-3.5 px-4 border-b border-gray-200">{product.category}</td>
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      <div>${product.lastQuote.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(product.lastQuote.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200 max-w-xs truncate">
                      {product.specifications}
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      <div className="flex gap-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-colors"
                          title="Add to quote"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-colors"
                          title="Edit product"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
