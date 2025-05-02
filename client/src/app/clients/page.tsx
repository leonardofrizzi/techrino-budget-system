// app/clients/page.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Search, Phone, Mail, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import clientService from '../../services/clientService';

// Client type as returned by the API
interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({ name: '', company: '', email: '', phone: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editData, setEditData] = useState({ name: '', company: '', email: '', phone: '', status: 'active' as 'active' | 'inactive' });
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Load clients on mount
  useEffect(() => {
    async function loadClients() {
      setLoading(true);
      try {
        const data = await clientService.getClients();
        setClients(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load clients. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadClients();
  }, []);

  // Delete client
  const deleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientService.deleteClient(id);
      setClients(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete client. Please try again.');
    }
  };

  // Toggle active/inactive status
  const toggleStatus = async (client: Client) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    try {
      await clientService.updateClient(client.id, { status: newStatus });
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
    } catch (e) {
      console.error(e);
      alert('Could not update status. Please try again.');
    }
  };

  // Create modal handlers
  const openCreate = () => {
    setCreateError(null);
    setCreateData({ name: '', company: '', email: '', phone: '' });
    setShowCreateModal(true);
  };
  const closeCreate = () => setShowCreateModal(false);
  const handleCreateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateData({ ...createData, [e.target.name]: e.target.value });
  };
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const newClient = await clientService.createClient(createData);
      setClients(prev => [newClient, ...prev]);
      closeCreate();
    } catch (e) {
      console.error(e);
      setCreateError('Failed to create client.');
    } finally {
      setCreating(false);
    }
  };

  // Edit modal handlers
  const openEdit = (client: Client) => {
    setEditError(null);
    setEditClient(client);
    setEditData({ name: client.name, company: client.company, email: client.email, phone: client.phone, status: client.status });
    setShowEditModal(true);
  };
  const closeEdit = () => setShowEditModal(false);
  const handleEditChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editClient) return;
    setEditing(true);
    setEditError(null);
    try {
      const updated = await clientService.updateClient(editClient.id, editData);
      setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
      closeEdit();
    } catch (e) {
      console.error(e);
      setEditError('Failed to update client.');
    } finally {
      setEditing(false);
    }
  };

  // Filter clients by search & status
  const filtered = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.company.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="flex items-center justify-center h-[70vh]"><Loader2 size={48} className="animate-spin text-blue-600"/></div>;
  if (error) return <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 text-red-700 rounded text-center">{error}</div>;

  return (
    <div className="container mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus size={16} className="mr-2"/> New Client
        </button>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center bg-gray-100 rounded px-3 flex-1">
          <Search size={18} className="text-gray-500"/>
          <input type="text" placeholder="Search clients..." value={searchTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} className="p-2.5 bg-transparent w-full outline-none"/>
        </div>
        <select value={statusFilter} onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')} className="p-2.5 border border-gray-300 rounded min-w-[180px]">
          <option value="all">All clients</option>
          <option value="active">Active clients</option>
          <option value="inactive">Inactive clients</option>
        </select>
      </div>

      {/* Clients Table with sticky header */}
      {filtered.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No clients found</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 border-b text-left">Client / Company</th>
                <th className="py-3 px-4 border-b text-left">Contact</th>
                <th className="py-3 px-4 border-b text-center">Status</th>
                <th className="py-3 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-blue-50">
                  <td className="py-3 px-4 border-b"><div className="font-medium">{c.name}</div><div className="text-sm text-gray-500">{c.company}</div></td>
                  <td className="py-3 px-4 border-b"><div className="flex items-center text-sm text-gray-600 mb-1"><Mail size={14} className="mr-2"/> {c.email}</div><div className="flex items-center text-sm text-gray-600"><Phone size={14} className="mr-2"/> {c.phone}</div></td>
                  <td className="py-3 px-4 border-b text-center"><button onClick={() => toggleStatus(c)} className={`px-4 py-1 min-w-[6rem] rounded-full text-xs font-medium transition-colors ${c.status==='active'?'bg-green-100 text-green-800 hover:bg-green-200':'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>{c.status.charAt(0).toUpperCase()+c.status.slice(1)}</button></td>
                  <td className="py-3 px-4 border-b text-center"><div className="flex justify-center gap-4"><button onClick={()=>openEdit(c)} title="Edit" className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600"><Edit size={18}/></button><button onClick={()=>deleteClient(c.id)} title="Delete" className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-red-600"><Trash2 size={18}/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Client</h2>
            {createError && <p className="text-red-600 mb-2">{createError}</p>}
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input name="name" value={createData.name} onChange={handleCreateChange} placeholder="Name" required className="w-full p-2 border rounded"/>
              <input name="company" value={createData.company} onChange={handleCreateChange} placeholder="Company" required className="w-full p-2 border rounded"/>
              <input name="email" type="email" value={createData.email} onChange={handleCreateChange} placeholder="Email" required className="w-full p-2 border rounded"/>
              <input name="phone" value={createData.phone} onChange={handleCreateChange} placeholder="Phone" required className="w-full p-2 border rounded"/>
              <div className="flex justify-end space-x-2"><button type="button" onClick={closeCreate} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button><button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">{creating?<Loader2 size={16} className="animate-spin mr-2"/>:null}Save</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
            {editError && <p className="text-red-600 mb-2">{editError}</p>}
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input name="name" value={editData.name} onChange={handleEditChange} placeholder="Name" required className="w-full p-2 border rounded"/>
              <input name="company" value={editData.company} onChange={handleEditChange} placeholder="Company" required className="w-full p-2 border rounded"/>
              <input name="email" type="email" value={editData.email} onChange={handleEditChange} placeholder="Email" required className="w-full p-2 border rounded"/>
              <input name="phone" value={editData.phone} onChange={handleEditChange} placeholder="Phone" required className="w-full p-2 border rounded"/>
              <select name="status" value={editData.status} onChange={handleEditChange} className="w-full p-2 border rounded"><option value="active">Active</option><option value="inactive">Inactive</option></select>
              <div className="flex justify-end space-x-2"><button type="button" onClick={closeEdit} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button><button type="submit" disabled={editing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">{editing?<Loader2 size={16} className="animate-spin mr-2"/>:null}Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
