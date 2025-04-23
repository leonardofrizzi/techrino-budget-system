"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { v4 as uuidv4 } from "uuid";
import QuotePDF from "@/components/QuotePDF";

interface QuoteFormData {
  clientId: string;
  clientName: string;
  title: string;
  date: string;
  validUntil: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    ncm: string;
  }[];
  notes: string;
  terms: string;
}

const initialFormData: QuoteFormData = {
  clientId: "",
  clientName: "",
  title: "",
  date: new Date().toISOString().split("T")[0],
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  items: [{ description: "", quantity: 1, unitPrice: 0, ncm: "" }],
  notes: "",
  terms:
    "Payment due within 30 days. This quote is valid until the date specified above.",
};

const clients = [
  { id: "1", name: "Acme Inc" },
  { id: "2", name: "TechCorp" },
  { id: "3", name: "Global Media" },
  { id: "4", name: "Startup Hub" },
  { id: "5", name: "EcoSolutions" },
];

export default function NewQuotePage() {
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c.id === clientId);
    setFormData({
      ...formData,
      clientId,
      clientName: client?.name || "",
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, unitPrice: 0, ncm: "" },
      ],
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  };

  const saveQuote = () => {
    // Aqui normalmente salvaríamos no banco de dados
    // Por enquanto, vamos apenas redirecionar para a página de cotações
    alert("Quote saved successfully!");
    router.push("/quotes");
  };

  const preparePdf = () => {
    setIsPdfReady(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Quote</h1>
          <p className="text-slate-500">Add a new quote and generate a PDF</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push("/quotes")}
            className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-lg"
          >
            Cancel
          </button>

          {!isPdfReady ? (
            <button
              onClick={preparePdf}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Generate PDF
            </button>
          ) : (
            <>
              <button
                onClick={saveQuote}
                className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-lg"
              >
                Save Quote
              </button>

              <PDFDownloadLink
                document={
                  <QuotePDF quoteData={formData} total={calculateTotal()} />
                }
                fileName={`quote-${formData.title
                  .replace(/\s+/g, "-")
                  .toLowerCase()}-${uuidv4().slice(0, 8)}.pdf`}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                {({ loading }) =>
                  loading ? "Preparing document..." : "Download PDF"
                }
              </PDFDownloadLink>

              {/* Botão de Email com BlobProvider */}
              <BlobProvider
                document={
                  <QuotePDF quoteData={formData} total={calculateTotal()} />
                }
              >
                {({ url, loading, error }) => (
                  <button
                    onClick={() => {
                      if (url) {
                        // Formatar para o Gmail
                        const emailSubject = encodeURIComponent(
                          `Quote: ${formData.title}`
                        );
                        const emailBody = encodeURIComponent(`
Dear ${formData.clientName},

Attached is the quote "${formData.title}" for your review.
This quote is valid until ${new Date(formData.validUntil).toLocaleDateString()}.
Total amount: $${calculateTotal().toFixed(2)}

If you have any questions, please don't hesitate to contact us.

Best regards,
Your Company Name
          `);

                        // URL específica do Gmail para composição de email
                        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${emailSubject}&body=${emailBody}`;

                        // Abrir apenas o Gmail em uma nova aba
                        window.open(gmailUrl, "_blank");
                      }
                    }}
                    disabled={loading || !!error || !url}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                  >
                    {loading ? "Preparing..." : "Send by Email"}
                  </button>
                )}
              </BlobProvider>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Client
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleClientChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quote Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Project name or description"
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Valid Until
            </label>
            <input
              type="date"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Quote Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add Item
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500 text-sm">
                <th className="py-2 px-4 border-b border-slate-200">
                  Description
                </th>
                <th className="py-2 px-4 border-b border-slate-200">NCM</th>
                <th className="py-2 px-4 border-b border-slate-200">
                  Quantity
                </th>
                <th className="py-2 px-4 border-b border-slate-200">
                  Unit Price
                </th>
                <th className="py-2 px-4 border-b border-slate-200">Total</th>
                <th className="py-2 px-4 border-b border-slate-200"></th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Item description"
                      className="w-full border border-slate-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={item.ncm}
                      onChange={(e) => updateItem(index, "ncm", e.target.value)}
                      placeholder="NCM code"
                      className="w-full border border-slate-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="1"
                      className="w-full border border-slate-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitPrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full border border-slate-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-300">
                <td colSpan={4} className="py-3 px-4 text-right font-semibold">
                  Total:
                </td>
                <td className="py-3 px-4 font-bold">
                  ${calculateTotal().toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Additional notes or information"
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Terms & Conditions
            </label>
            <textarea
              name="terms"
              value={formData.terms}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
