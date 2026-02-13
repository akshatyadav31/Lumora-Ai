import { Message, AppConfig, Dataset, ColumnDefinition } from '../types';

interface LLMResponse {
  sql: string;
  explanation: string;
  visualization?: {
    type: 'bar' | 'line' | 'pie' | 'area';
    xAxisKey: string;
    dataKey: string;
    title: string;
  };
}

export const generateAnalysis = async (
  query: string,
  schema: ColumnDefinition[],
  config: AppConfig
): Promise<LLMResponse> => {
  if (config.provider !== 'openrouter') {
    // Fallback for demo if not using OpenRouter (Mock behavior)
    throw new Error("Only OpenRouter is fully implemented for live queries in this demo. Please select OpenRouter and provide a key.");
  }

  // Format schema for the prompt: "column_name (type)"
  const schemaDescription = schema.map(col => `${col.name} (${col.type})`).join(', ');

  const systemPrompt = `
    You are an expert Data Analyst and SQL Generator.
    Your goal is to translate natural language questions into executable SQL queries for a table named 'uploaded_data'.
    
    The table 'uploaded_data' has the following columns: ${schemaDescription}.
    
    Return a JSON object with the following structure (do NOT return Markdown code blocks, just raw JSON):
    {
      "sql": "The SQL query to answer the user's question. Use standard SQL compatible with SQLite/DuckDB. Always SELECT from 'uploaded_data'. Limit results to 100 if not specified.",
      "explanation": "A brief, friendly explanation of what this data shows.",
      "visualization": {
        "type": "bar | line | pie | area", 
        "xAxisKey": "column_name_for_x_axis",
        "dataKey": "column_name_for_y_axis",
        "title": "Chart title"
      }
    }
    
    If the user asks for a visualization, infer the best type.
    If the question implies a time series, use 'line'.
    If comparing categories, use 'bar' or 'pie'.
    
    IMPORTANT: Return ONLY the valid JSON string. No preamble.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "Lumora"
      },
      body: JSON.stringify({
        model: config.model || "google/gemini-2.0-flash-lite-preview-02-05:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        temperature: 0.1, // Low temperature for consistent SQL
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from OpenRouter");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) throw new Error("No content received from LLM");

    // Clean up potential markdown formatting if the LLM adds it
    const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
    
    try {
      return JSON.parse(cleanContent) as LLMResponse;
    } catch (e) {
      console.error("Failed to parse LLM JSON response:", content);
      throw new Error("The AI returned an invalid response format.");
    }

  } catch (error) {
    console.error("LLM Service Error:", error);
    throw error;
  }
};