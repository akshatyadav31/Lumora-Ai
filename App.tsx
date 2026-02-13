import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Message, Dataset, AppConfig, DataPoint } from './types';
import { processQuery, MOCK_DATASETS } from './services/mockService';
import { parseFile, executeQuery, inferSchema } from './services/dataService';
import { generateAnalysis } from './services/llmService';
import { Send, Menu } from 'lucide-react';

export default function App() {
  // State
  const [config, setConfig] = useState<AppConfig>({
    provider: 'openrouter',
    apiKey: '',
    model: 'google/gemini-2.0-flash-lite-preview-02-05:free'
  });
  
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>(MOCK_DATASETS[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real data store for the uploaded files
  const [activeData, setActiveData] = useState<DataPoint[]>([]);

  const activeDataset = datasets.find(d => d.id === activeDatasetId) || null;

  // Handlers
  const handleSendMessage = async (overrideContent?: string) => {
    const content = overrideContent || inputValue;
    if (!content.trim() || !activeDataset) return;
    
    // Check if we need a key
    if (config.provider === 'openrouter' && !config.apiKey) {
      alert("Please enter your OpenRouter API Key in the sidebar.");
      setMobileMenuOpen(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    try {
      let response;
      
      if (config.provider === 'openrouter' && activeData.length > 0) {
        // REAL PATH: Use OpenRouter + Real Data
        // 1. Get SQL from LLM
        const llmResult = await generateAnalysis(userMsg.content, activeDataset.columns, config);
        
        // 2. Execute SQL
        const queryResult = await executeQuery(llmResult.sql, activeData);
        
        response = {
          content: llmResult.explanation,
          sql: llmResult.sql,
          data: queryResult,
          visualization: llmResult.visualization
        };

      } else {
        // MOCK PATH: Use the mock service (for the default mock datasets)
        response = await processQuery(userMsg.content, activeDataset.name);
      }
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content || '',
        timestamp: Date.now(),
        sql: response.sql,
        data: response.data,
        visualization: response.visualization
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${(error as Error).message}`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const data = await parseFile(file);
      const schema = inferSchema(data);
      
      const newId = Date.now().toString();
      const newDs: Dataset = {
        id: newId,
        name: file.name,
        rowCount: data.length,
        columns: schema
      };

      setDatasets(prev => [...prev, newDs]);
      setActiveDatasetId(newId);
      setActiveData(data); // Store real data in memory
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've successfully loaded ${file.name} with ${data.length} rows. I've analyzed the schema and detected ${schema.length} columns. Check the sidebar for details and suggestions!`,
        timestamp: Date.now()
      }]);

    } catch (error) {
      alert(`Failed to load file: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectDataset = (id: string) => {
    setActiveDatasetId(id);
    const ds = datasets.find(d => d.id === id);
    // If selecting a mock dataset, clear the real active data so we fall back to mock service
    if (ds && (ds.id === '1' || ds.id === '2')) {
      setActiveData([]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#1A1816] text-[#F5F3EF] overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-black/80 z-10 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)} />
      
      {/* Sidebar Wrapper for Mobile */}
      <div className={`fixed inset-y-0 left-0 z-20 transition-transform transform md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          datasets={datasets}
          config={config}
          onConfigChange={setConfig}
          onFileUpload={handleFileUpload}
          activeDatasetId={activeDatasetId}
          onSelectDataset={handleSelectDataset}
          onSuggestionClick={(s) => {
            setMobileMenuOpen(false); // Close menu on mobile
            handleSendMessage(s);
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#1A1816]/80 backdrop-blur-md z-10">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-warm-400 hover:text-white">
            <Menu />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-warm-400 text-sm hidden md:inline">Current Dataset:</span>
            {activeDataset ? (
              <span className="text-amber-500 font-medium text-sm flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {activeDataset.name}
              </span>
            ) : (
              <span className="text-warm-600 text-sm italic">No dataset selected</span>
            )}
          </div>
          <div className="w-8" /> {/* Spacer */}
        </header>

        {/* Chat Area */}
        <ChatArea 
          messages={messages} 
          isProcessing={isProcessing}
          activeDataset={activeDataset}
        />

        {/* Input Area */}
        <div className="p-4 md:p-6 pb-6 max-w-4xl w-full mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-[#262320] border border-warm-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden group-focus-within:border-amber-500/50 group-focus-within:ring-1 group-focus-within:ring-amber-500/20 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
                placeholder={activeDataset ? "Ask a question about your data..." : "Select a dataset to start analysis"}
                disabled={!activeDataset || isProcessing}
                className="w-full bg-transparent border-none px-6 py-4 text-warm-100 placeholder:text-warm-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isProcessing}
                className="p-3 mr-2 rounded-lg bg-amber-500 text-white hover:bg-amber-400 disabled:bg-warm-800 disabled:text-warm-600 transition-all flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-warm-700 mt-3 font-medium tracking-wide uppercase">
            Powered by DuckDB & LLM Agent
          </p>
        </div>
      </main>
    </div>
  );
}