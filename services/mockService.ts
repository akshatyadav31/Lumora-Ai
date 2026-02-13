import { Message, Dataset, DataPoint } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MOCK_DATASETS: Dataset[] = [
  {
    id: '1',
    name: 'sales_q3_2024.csv',
    rowCount: 14500,
    columns: [
      { name: 'date', type: 'date' },
      { name: 'region', type: 'string' },
      { name: 'product_category', type: 'string' },
      { name: 'sales_amount', type: 'number' },
      { name: 'units_sold', type: 'number' },
      { name: 'customer_segment', type: 'string' }
    ]
  },
  {
    id: '2',
    name: 'tech_churn_data.xlsx',
    rowCount: 5200,
    columns: [
      { name: 'customer_id', type: 'string' },
      { name: 'tenure', type: 'number' },
      { name: 'monthly_charges', type: 'number' },
      { name: 'total_charges', type: 'number' },
      { name: 'churn', type: 'boolean' },
      { name: 'contract_type', type: 'string' }
    ]
  }
];

// Mock data generator based on query intent
const generateMockData = (intent: string): { data: DataPoint[], sql: string, vizType: 'bar' | 'line' | 'pie' } => {
  if (intent.includes('trend') || intent.includes('time') || intent.includes('month')) {
    return {
      sql: `SELECT \n  DATE_TRUNC('month', date) as month, \n  SUM(sales_amount) as total_sales \nFROM sales_q3_2024 \nGROUP BY 1 \nORDER BY 1;`,
      vizType: 'line',
      data: [
        { month: 'Jan', total_sales: 45000 },
        { month: 'Feb', total_sales: 52000 },
        { month: 'Mar', total_sales: 49000 },
        { month: 'Apr', total_sales: 61000 },
        { month: 'May', total_sales: 58000 },
        { month: 'Jun', total_sales: 72000 },
      ]
    };
  }
  
  if (intent.includes('region') || intent.includes('where')) {
    return {
      sql: `SELECT \n  region, \n  SUM(sales_amount) as revenue \nFROM sales_q3_2024 \nGROUP BY region \nORDER BY revenue DESC;`,
      vizType: 'bar',
      data: [
        { region: 'North America', revenue: 125000 },
        { region: 'Europe', revenue: 98000 },
        { region: 'Asia Pacific', revenue: 85000 },
        { region: 'Latin America', revenue: 45000 },
      ]
    };
  }

  // Default distribution
  return {
    sql: `SELECT \n  product_category, \n  COUNT(*) as sales_count \nFROM sales_q3_2024 \nGROUP BY product_category;`,
    vizType: 'pie',
    data: [
      { product_category: 'Electronics', sales_count: 450 },
      { product_category: 'Clothing', sales_count: 320 },
      { product_category: 'Home & Garden', sales_count: 210 },
      { product_category: 'Books', sales_count: 150 },
    ]
  };
};

export const processQuery = async (query: string, datasetName: string): Promise<Partial<Message>> => {
  await delay(1500); // Simulate thinking

  const lowerQuery = query.toLowerCase();
  const { data, sql, vizType } = generateMockData(lowerQuery);

  return {
    role: 'assistant',
    content: `I've analyzed the ${datasetName} dataset. Here is the breakdown based on your request.`,
    sql: sql,
    data: data,
    visualization: {
      type: vizType,
      xAxisKey: Object.keys(data[0])[0],
      dataKey: Object.keys(data[0])[1],
      title: 'Analysis Result'
    }
  };
};