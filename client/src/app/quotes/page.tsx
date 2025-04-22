'use client'

import { useState } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

type QuoteStatus = 'Draft' | 'Pending' | 'Approved' | 'Rejected';

interface Quote {
  id: number;
  client: string;
  title: string;
  value: string;
  status: QuoteStatus;
  date: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: 1, client: "Acme Inc", title: "Website Redesign", value: "$2,400", status: "Pending", date: "2025-04-12" },
    { id: 2, client: "TechCorp", title: "Software Development", value: "$5,800", status: "Approved", date: "2025-04-10" },
    { id: 3, client: "Global Media", title: "SEO Services", value: "$1,200", status: "Rejected", date: "2025-04-05" },
    { id: 4, client: "Startup Hub", title: "Mobile App", value: "$8,500", status: "Draft", date: "2025-04-01" },
    { id: 5, client: "EcoSolutions", title: "Branding Package", value: "$3,200", status: "Pending", date: "2025-04-15" },
    { id: 6, client: "LocalBiz", title: "E-commerce Setup", value: "$4,700", status: "Draft", date: "2025-04-08" },
  ]);

  const columns: { status: QuoteStatus; title: string; color: string; bgColor: string }[] = [
    { status: 'Draft', title: 'Drafts', color: 'border-slate-200', bgColor: 'bg-slate-100' },
    { status: 'Pending', title: 'Pending', color: 'border-yellow-200', bgColor: 'bg-yellow-50' },
    { status: 'Approved', title: 'Approved', color: 'border-green-200', bgColor: 'bg-green-50' },
    { status: 'Rejected', title: 'Rejected', color: 'border-red-200', bgColor: 'bg-red-50' }
  ];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const quoteId = parseInt(draggableId.split('-')[1]);
    const newStatus = destination.droppableId as QuoteStatus;

    // Update the quote status
    setQuotes(quotes.map(quote => 
      quote.id === quoteId ? { ...quote, status: newStatus } : quote
    ));
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-slate-500">Drag quotes between columns to update their status</p>
        </div>
        <Link
          href="/quotes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span> New Quote
        </Link>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div 
              key={column.status} 
              className={`${column.bgColor} rounded-lg shadow p-4`}
            >
              <h2 className="font-semibold text-lg mb-3 flex items-center justify-between">
                {column.title}
                <span className="bg-white text-slate-600 text-xs py-1 px-2 rounded-full">
                  {quotes.filter(q => q.status === column.status).length}
                </span>
              </h2>
              
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      {quotes
                        .filter(quote => quote.status === column.status)
                        .map((quote, index) => (
                          <Draggable 
                            key={`quote-${quote.id}`} 
                            draggableId={`quote-${quote.id}`} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-3 rounded shadow-sm border ${column.color} ${
                                  snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">{quote.title}</h3>
                                  <span className="text-sm font-bold">{quote.value}</span>
                                </div>
                                <div className="text-sm text-slate-500 mt-1">{quote.client}</div>
                                <div className="text-xs text-slate-400 mt-2">{formatDate(quote.date)}</div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
