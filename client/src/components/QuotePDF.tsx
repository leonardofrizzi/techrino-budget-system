// components/QuotePDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
  },
  clientInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    color: '#333',
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  tableCol: {
    fontSize: 10,
    padding: 5,
  },
  tableDescCol: {
    width: '60%',
  },
  tableQtyCol: {
    width: '10%',
    textAlign: 'center',
  },
  tablePriceCol: {
    width: '15%',
    textAlign: 'right',
  },
  tableTotalCol: {
    width: '15%',
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  total: {
    marginTop: 10,
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 10,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
  }
});

interface QuotePDFProps {
  quoteData: {
    clientName: string;
    title: string;
    date: string;
    validUntil: string;
    items: {
      description: string;
      quantity: number;
      unitPrice: number;
    }[];
    notes: string;
    terms: string;
  };
  total: number;
}

const QuotePDF = ({ quoteData, total }: QuotePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Quote: {quoteData.title}</Text>
        <Text style={styles.companyName}>Your Company Name</Text>
      </View>
      
      <View style={styles.clientInfo}>
        <Text style={styles.label}>Client</Text>
        <Text style={styles.value}>{quoteData.clientName}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <View>
            <Text style={styles.label}>Quote Date</Text>
            <Text style={styles.value}>{formatDate(quoteData.date)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Valid Until</Text>
            <Text style={styles.value}>{formatDate(quoteData.validUntil)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCol, styles.tableDescCol]}>Description</Text>
          <Text style={[styles.tableCol, styles.tableQtyCol]}>Qty</Text>
          <Text style={[styles.tableCol, styles.tablePriceCol]}>Unit Price</Text>
          <Text style={[styles.tableCol, styles.tableTotalCol]}>Total</Text>
        </View>
        
        {quoteData.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableDescCol]}>{item.description}</Text>
            <Text style={[styles.tableCol, styles.tableQtyCol]}>{item.quantity}</Text>
            <Text style={[styles.tableCol, styles.tablePriceCol]}>${item.unitPrice.toFixed(2)}</Text>
            <Text style={[styles.tableCol, styles.tableTotalCol]}>
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </View>
      
      {quoteData.notes && (
        <View style={styles.notes}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Notes:</Text>
          <Text>{quoteData.notes}</Text>
        </View>
      )}
      
      {quoteData.terms && (
        <View style={styles.notes}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Terms & Conditions:</Text>
          <Text>{quoteData.terms}</Text>
        </View>
      )}
      
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
      </View>
    </Page>
  </Document>
);

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default QuotePDF;
