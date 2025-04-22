export default function Dashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Quotes" value="0" />
          <StatCard title="Products" value="0" />
          <StatCard title="Clients" value="0" />
        </div>
      </div>
    );
  }
  
  function StatCard({ title, value }: { title: string; value: string }) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-gray-500">{title}</h2>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
    );
  }
  