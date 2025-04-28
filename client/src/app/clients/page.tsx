// app/clients/page.tsx
'use client';

import { useState } from 'react';
import { Search, Phone, Mail, Edit, Trash } from 'lucide-react';

// Types
interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  totalQuotes: number;
  totalValue: number;
  status: 'active' | 'inactive';
}

// Sample data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    company: 'TechBrasil Ltda',
    email: 'carlos@techbrasil.com.br',
    phone: '11 98765-4321',
    address: 'Av. Paulista, 1000, São Paulo, SP',
    totalQuotes: 5,
    totalValue: 28500,
    status: 'active',
  },
  {
    id: '2',
    name: 'Ana Costa',
    company: 'Inovação Digital',
    email: 'ana.costa@inovacaodigital.com.br',
    phone: '21 99876-5432',
    address: 'Rua do Ouvidor, 50, Rio de Janeiro, RJ',
    totalQuotes: 3,
    totalValue: 12700,
    status: 'active',
  },
  {
    id: '3',
    name: 'Fernando Mendes',
    company: 'Construtora Horizonte',
    email: 'f.mendes@horizonte.com.br',
    phone: '31 97654-3210',
    address: 'Av. do Contorno, 1500, Belo Horizonte, MG',
    totalQuotes: 2,
    totalValue: 45800,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Juliana Santos',
    company: 'Verde Marketing',
    email: 'juliana@verdemarketing.com',
    phone: '41 98765-0987',
    address: 'Rua Marechal Deodoro, 500, Curitiba, PR',
    totalQuotes: 4,
    totalValue: 18900,
    status: 'active',
  },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span> New Client
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center bg-gray-100 rounded px-3 flex-1">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2.5 bg-transparent border-none w-full outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="p-2.5 border border-gray-300 rounded min-w-[180px]"
        >
          <option value="all">All clients</option>
          <option value="active">Active clients</option>
          <option value="inactive">Inactive clients</option>
        </select>
      </div>

      <div>
        {filteredClients.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No clients found</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Client / Company</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Contact</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Total Quotes</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Total Value</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Status</th>
                  <th className="text-left py-3.5 px-4 border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-blue-50">
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.company}</div>
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Mail size={14} className="mr-2" /> {client.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2" /> {client.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200 text-center">
                      {client.totalQuotes}
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      {formatCurrency(client.totalValue)}
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-b border-gray-200">
                      <div className="flex gap-2">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-colors"
                          title="Edit client"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete client"
                        >
                          <Trash size={18} />
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
