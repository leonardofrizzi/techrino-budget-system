// app/products/layout.tsx
import Sidebar from "@/components/layout/Sidebar";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
