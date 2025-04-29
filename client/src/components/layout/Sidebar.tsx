'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Quotes',    href: '/quotes'    },
    { name: 'Products',  href: '/products'  },
    { name: 'Clients',   href: '/clients'   },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-800 text-white p-4">
        <h1 className="text-lg font-bold">
          <span className="text-blue-400">Tech</span>rino
        </h1>
        <button onClick={() => setOpen(o => !o)}>
          {open
            ? <X size={24} className="text-white" />
            : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-800 text-white p-5 z-20
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-auto md:w-64
        `}
      >
        <div className="mb-8 md:block hidden">
          <h1 className="text-xl font-bold">
            <span className="text-blue-400">Tech</span>rino
          </h1>
          <p className="text-xs text-slate-400 mt-1">Quote Management System</p>
        </div>
        <nav>
          {menuItems.map(item => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  block py-2 px-3 mb-1 rounded transition-colors
                  ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-700'}
                `}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
