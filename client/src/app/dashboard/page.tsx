// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUp, DollarSign, Users, Package, FileText, Loader2 } from 'lucide-react';
import clientService from '../../services/clientService';
import productService from '../../services/productService';
import quoteService from '../../services/quoteService';
import Link from 'next/link';

// Proper type definitions
interface Client {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  status: 'active' | 'inactive';
}

interface Quote {
  _id: string;
  clientId: string;
  clientName?: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardAPIResponse {
  totalClients: number;
  totalProducts: number;
  totalQuotes: number;
  totalRevenue: number;
}

interface DashboardData {
  totalClients: number;
  activeClients: number;
  totalProducts: number;
  totalQuotes: number;
  pendingQuotes: number;
  approvedQuotes: number;
  rejectedQuotes: number;
  totalValue: number;
  recentQuotes: Quote[];
}

interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

interface ErrorDetails {
  clients?: APIError;
  products?: APIError;
  quotes?: APIError;
  stats?: APIError;
  general?: APIError;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalClients: 0,
    activeClients: 0,
    totalProducts: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    rejectedQuotes: 0,
    totalValue: 0,
    recentQuotes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails>({});

  // format currency in BRL
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  // normalize unknown error into APIError
  const processApiError = (err: unknown): APIError => {
    if (err instanceof Error) return { message: err.message };
    if (typeof err === 'string') return { message: err };
    return { message: 'Unknown error occurred' };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      setErrorDetails({});

      let clients: Client[] = [];
      let products: Product[] = [];
      let quotes: Quote[] = [];
      let stats: DashboardAPIResponse | null = null;

      // 1) fetch clients
      try {
        clients = await clientService.getClients();
      } catch (err) {
        setErrorDetails(prev => ({ ...prev, clients: processApiError(err) }));
      }

      // 2) fetch products
      try {
        products = await productService.getProducts();
      } catch (err) {
        setErrorDetails(prev => ({ ...prev, products: processApiError(err) }));
      }

      // 3) fetch quotes
      try {
        quotes = await quoteService.getQuotes();
      } catch (err) {
        setErrorDetails(prev => ({ ...prev, quotes: processApiError(err) }));
      }

      // 4) fetch aggregated stats
      try {
        const res = await axios.get<DashboardAPIResponse>('/api/dashboard');
        stats = res.data;
      } catch (err) {
        setErrorDetails(prev => ({ ...prev, stats: processApiError(err) }));
      }

      // if nothing at all, show general error
      if (!stats && clients.length === 0 && products.length === 0 && quotes.length === 0) {
        setError('Failed to load any data. Please try again later.');
        setLoading(false);
        return;
      }

      // calculate breakdowns
      const totalClients   = stats?.totalClients   ?? clients.length;
      const totalProducts  = stats?.totalProducts  ?? products.length;
      const totalQuotes    = stats?.totalQuotes    ?? quotes.length;
      const totalValue     = stats?.totalRevenue   ?? quotes.reduce((sum, q) => sum + (q.totalValue || 0), 0);
      const activeClients  = clients.filter(c => c.status === 'active').length;
      const pendingQuotes  = quotes.filter(q => q.status === 'pending').length;
      const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
      const rejectedQuotes = quotes.filter(q => q.status === 'rejected').length;
      const recentQuotes   = [...quotes]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setDashboardData({
        totalClients,
        activeClients,
        totalProducts,
        totalQuotes,
        pendingQuotes,
        approvedQuotes,
        rejectedQuotes,
        totalValue,
        recentQuotes,
      });

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center max-w-2xl mx-auto mt-10">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 text-left p-3 bg-red-100 rounded text-xs overflow-auto max-h-48">
            {JSON.stringify(errorDetails, null, 2)}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Clients */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Clients</p>
              <p className="text-2xl font-bold">{dashboardData.totalClients}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowUp size={14} className="mr-1" /> {dashboardData.activeClients} active
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Products</p>
              <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Package className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Total Quotes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Quotes</p>
              <p className="text-2xl font-bold">{dashboardData.totalQuotes}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FileText className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm flex flex-wrap gap-x-4">
            <span className="text-blue-600">{dashboardData.pendingQuotes} pending</span>
            <span className="text-green-600">{dashboardData.approvedQuotes} approved</span>
            <span className="text-red-600">{dashboardData.rejectedQuotes} rejected</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardData.totalValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 flex items-center">
              <ArrowUp size={14} className="mr-1" /> From {dashboardData.approvedQuotes} approved quotes
            </span>
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Quotes</h2>
          <Link href="/quotes" className="text-sm text-blue-600 hover:text-blue-800">
            View all
          </Link>
        </div>

        {dashboardData.recentQuotes.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No quotes found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-2 border-b">Quote ID</th>
                  <th className="pb-2 border-b">Client</th>
                  <th className="pb-2 border-b">Date</th>
                  <th className="pb-2 border-b">Amount</th>
                  <th className="pb-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="py-3 border-b">
                      <Link href={`/quotes/${quote._id}`} className="text-blue-600 hover:text-blue-800">
                        {quote._id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="py-3 border-b">{quote.clientName || 'Unknown'}</td>
                    <td className="py-3 border-b">
                      {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 border-b">{formatCurrency(quote.totalValue)}</td>
                    <td className="py-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quote.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : quote.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {quote.status}
                      </span>
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
