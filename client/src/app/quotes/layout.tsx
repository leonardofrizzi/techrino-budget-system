// app/quotes/layout.tsx
import Sidebar from "@/components/layout/Sidebar";

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-6 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}

