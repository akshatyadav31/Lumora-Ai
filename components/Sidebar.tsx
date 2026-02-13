import React, { useState, useRef, useMemo } from 'react';
import { Dataset, AppConfig, LLMProvider, ColumnDefinition } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  Settings, FileSpreadsheet, Plus, Database, ChevronRight, ChevronDown, 
  Key, Box, Cpu, Hash, Type, Calendar, Lightbulb, BarChart3, List
} from 'lucide-react';

interface SidebarProps {
  datasets: Dataset[];
  config: AppConfig;
  onConfigChange: (config: AppConfig) => void;
  onFileUpload: (file: File) => void;
  activeDatasetId: string | null;
  onSelectDataset: (id: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  datasets,
  config,
  onConfigChange,
  onFileUpload,
  activeDatasetId,
  onSelectDataset,
  onSuggestionClick
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSchemaExpanded, setIsSchemaExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDataset = datasets.find(d => d.id === activeDatasetId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'number': return <Hash size={12} className="text-blue-400" />;
      case 'date': return <Calendar size={12} className="text-green-400" />;
      case 'boolean': return <div className="text-[10px] text-purple-400 font-mono">T/F</div>;
      default: return <Type size={12} className="text-orange-400" />;
    }
  };

  // Generate suggestions based on schema
  const suggestions = useMemo(() => {
    if (!activeDataset) return [];
    const cols = activeDataset.columns;
    const numCols = cols.filter(c => c.type === 'number');
    const dateCols = cols.filter(c => c.type === 'date');
    const strCols = cols.filter(c => c.type === 'string');
    
    const suggs = [];

    if (numCols.length > 0 && strCols.length > 0) {
      suggs.push(`Top 5 ${strCols[0].name} by ${numCols[0].name}`);
      suggs.push(`Average ${numCols[0].name} per ${strCols[0].name}`);
    }
    if (numCols.length > 0 && dateCols.length > 0) {
      suggs.push(`Trend of ${numCols[0].name} over time`);
    }
    if (strCols.length > 0) {
      suggs.push(`Distribution of ${strCols[0].name}`);
    }
    if (numCols.length > 1) {
      suggs.push(`Compare ${numCols[0].name} vs ${numCols[1].name}`);
    }
    
    return suggs.slice(0, 4);
  }, [activeDataset]);

  return (
    <div className={`
      border-r border-white/5 bg-[#1A1816] flex flex-col h-full transition-all duration-300
      ${isOpen ? 'w-80' : 'w-0 opacity-0 overflow-hidden'}
      md:relative absolute z-20
    `}>
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-warm-100">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <Box size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight leading-tight">Lumora</span>
            <span className="text-[10px] text-warm-500 font-medium tracking-wide uppercase">Converse with your data</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
        {/* Active Dataset Schema & Suggestions */}
        {activeDataset && (
          <div className="space-y-6 animate-fade-in">
             {/* Suggestions */}
             {suggestions.length > 0 && (
              <section>
                 <div className="flex items-center gap-2 text-xs font-semibold text-warm-600 uppercase tracking-wider mb-3 px-2">
                  <Lightbulb size={12} className="text-amber-500" />
                  <span>Suggested Analysis</span>
                </div>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => onSuggestionClick && onSuggestionClick(s)}
                      className="w-full text-left p-2.5 rounded-lg bg-warm-800/30 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 text-xs text-warm-200 transition-all flex items-start gap-2 group"
                    >
                      <BarChart3 size={14} className="mt-0.5 text-warm-600 group-hover:text-amber-500 transition-colors" />
                      <span className="line-clamp-2">{s}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Schema */}
            <section>
              <div 
                className="flex items-center justify-between mb-3 px-2 cursor-pointer group"
                onClick={() => setIsSchemaExpanded(!isSchemaExpanded)}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-warm-600 uppercase tracking-wider group-hover:text-warm-400 transition-colors">
                  <List size={12} />
                  <span>Data Schema</span>
                </div>
                {isSchemaExpanded ? <ChevronDown size={14} className="text-warm-600" /> : <ChevronRight size={14} className="text-warm-600" />}
              </div>
              
              {isSchemaExpanded && (
                <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto">
                    {activeDataset.columns.map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <span className="text-xs text-warm-200 font-medium truncate pr-2" title={col.name}>
                          {col.name}
                        </span>
                        <div className="flex items-center gap-1.5 bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-warm-500 font-mono uppercase tracking-wider">
                          {getTypeIcon(col.type)}
                          <span>{col.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Model Config */}
        <section className={activeDataset ? "pt-4 border-t border-white/5" : ""}>
          <div className="flex items-center gap-2 text-xs font-semibold text-warm-600 uppercase tracking-wider mb-4 px-2">
            <Settings size={12} />
            <span>Model Configuration</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {(['gemini', 'openrouter'] as LLMProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => onConfigChange({ ...config, provider: p })}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${config.provider === p 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]' 
                    : 'text-warm-600 hover:text-warm-100 hover:bg-white/5'}
                `}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="relative group">
              <Key className="absolute left-3 top-2.5 text-warm-600 group-focus-within:text-amber-500 transition-colors" size={14} />
              <input
                type="password"
                placeholder={config.provider === 'openrouter' ? "OpenRouter API Key" : "Gemini API Key (Simulated)"}
                value={config.apiKey}
                onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
                className="w-full bg-warm-800/50 border border-warm-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-warm-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 transition-all placeholder:text-warm-700"
              />
            </div>
            
            {config.provider === 'openrouter' && (
              <div className="relative group animate-fade-in">
                <Cpu className="absolute left-3 top-2.5 text-warm-600 group-focus-within:text-amber-500 transition-colors" size={14} />
                <input
                  type="text"
                  placeholder="Model (e.g., google/gemini-2.0-flash-001)"
                  value={config.model}
                  onChange={(e) => onConfigChange({ ...config, model: e.target.value })}
                  className="w-full bg-warm-800/50 border border-warm-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-warm-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500/50 transition-all placeholder:text-warm-700"
                />
                <p className="text-[10px] text-warm-600 mt-1 ml-1">
                  Default: google/gemini-2.0-flash-lite-preview-02-05:free
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Data Sources */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-warm-600 uppercase tracking-wider">
              <Database size={12} />
              <span>Data Sources</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange}
            />
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={triggerFileUpload}>
              <Plus size={14} />
            </Button>
          </div>

          <div className="space-y-2">
            {datasets.map((ds) => (
              <Card 
                key={ds.id}
                onClick={() => onSelectDataset(ds.id)}
                className={`
                  p-3 group transition-all duration-200
                  ${activeDatasetId === ds.id ? 'bg-white/10 border-amber-500/30 ring-1 ring-amber-500/20' : 'bg-transparent border-transparent hover:bg-white/5'}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${activeDatasetId === ds.id ? 'bg-amber-500/20 text-amber-500' : 'bg-warm-800 text-warm-500 group-hover:text-warm-300'}
                  `}>
                    <FileSpreadsheet size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${activeDatasetId === ds.id ? 'text-warm-100' : 'text-warm-400 group-hover:text-warm-200'}`}>
                      {ds.name}
                    </p>
                    <p className="text-xs text-warm-600 truncate mt-0.5">
                      {ds.rowCount.toLocaleString()} rows • {ds.columns.length} cols
                    </p>
                  </div>
                  {activeDatasetId === ds.id && <ChevronRight size={14} className="text-amber-500 mt-1" />}
                </div>
              </Card>
            ))}

            {datasets.length === 0 && (
              <div 
                onClick={triggerFileUpload}
                className="border border-dashed border-warm-700/50 rounded-xl p-6 text-center cursor-pointer hover:bg-white/5 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-warm-800 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={18} className="text-warm-400 group-hover:text-amber-500" />
                </div>
                <p className="text-sm text-warm-400 group-hover:text-warm-200">Upload CSV/Excel</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-warm-700 to-warm-600 border border-white/10" />
          <div className="flex-1">
            <p className="text-sm font-medium text-warm-200">User Account</p>
            <p className="text-xs text-warm-600">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};