import alasql from 'alasql';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { DataPoint, ColumnDefinition, ColumnType } from '../types';

export const parseFile = (file: File): Promise<DataPoint[]> => {
  return new Promise((resolve, reject) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as DataPoint[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExt || '')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as DataPoint[];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file type. Please upload CSV or Excel.'));
    }
  });
};

export const inferSchema = (data: DataPoint[]): ColumnDefinition[] => {
  if (data.length === 0) return [];
  const sample = data[0];
  
  return Object.keys(sample).map(key => {
    const value = sample[key];
    let type: ColumnType = 'string';
    
    if (typeof value === 'number') {
      type = 'number';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else if ((value as any) instanceof Date) {
      type = 'date';
    } else if (typeof value === 'string') {
      // Simple heuristic for dates in strings (e.g. ISO format or common date strings)
      // Must contain numbers and be reasonably long, and parseable
      if (value.length > 5 && /\d/.test(value) && !isNaN(Date.parse(value))) {
        type = 'date';
      }
    }
    
    return { name: key, type };
  });
};

export const executeQuery = async (sql: string, data: DataPoint[]): Promise<DataPoint[]> => {
  try {
    // Alasql setup for 'in-memory' table
    alasql('CREATE TABLE IF NOT EXISTS uploaded_data');
    alasql('DELETE FROM uploaded_data'); // Clear previous data
    alasql('SELECT * INTO uploaded_data FROM ?', [data]);
    
    const result = alasql(sql);
    return result as DataPoint[];
  } catch (error) {
    console.error("SQL Execution Error:", error);
    throw new Error(`Failed to execute SQL: ${(error as Error).message}`);
  }
};