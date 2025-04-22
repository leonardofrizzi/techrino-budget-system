import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Quotes", href: "/quotes" },
    { name: "Products", href: "/products" },
    { name: "Clients", href: "/clients" },
  ];

  return (
    <aside className="bg-slate-800 text-white w-64 min-h-screen p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold">
          <span className="text-blue-400">Tech</span>rino
        </h1>
        <p className="text-xs text-slate-400 mt-1">Quote Management System</p>
      </div>
      
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center py-2 px-3 mb-1 rounded hover:bg-slate-700 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
