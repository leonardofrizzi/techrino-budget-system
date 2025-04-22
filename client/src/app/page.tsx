import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white px-4">
      <div className="w-full max-w-md">
        {/* Logo and company name */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4">
            <svg 
              className="w-16 h-16 text-blue-500" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-blue-400">Tech</span>rino
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Quote Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">Welcome to your workspace</h2>
              <p className="text-slate-300 mt-1">Streamline your business operations</p>
            </div>
            
            {/* Features summary */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <Feature icon="📊" title="Real-time Analytics" />
              <Feature icon="💼" title="Client Management" />
              <Feature icon="📝" title="Quote Builder" />
              <Feature icon="💰" title="Revenue Tracking" />
            </div>
            
            {/* Action button */}
            <Link 
              href="/dashboard" 
              className="block w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-lg text-center font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm">
          © 2025 Techrino. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-xl">{icon}</span>
      <span className="text-sm text-slate-200">{title}</span>
    </div>
  );
}
