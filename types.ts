export type Role = 'user' | 'assistant' | 'system';

export interface DataPoint {
  [key: string]: string | number | boolean | null;
}

export interface VisualizationConfig {
  type: 'bar' | 'line' | 'pie' | 'area';
  xAxisKey: string;
  dataKey: string;
  title: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  sql?: string;
  data?: DataPoint[];
  visualization?: VisualizationConfig;
  isThinking?: boolean;
}

export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'unknown';

export interface ColumnDefinition {
  name: string;
  type: ColumnType;
}

export interface Dataset {
  id: string;
  name: string;
  rowCount: number;
  columns: ColumnDefinition[];
}

export type LLMProvider = 'gemini' | 'openrouter';

export interface AppConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
}