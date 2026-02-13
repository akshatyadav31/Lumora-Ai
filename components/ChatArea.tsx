import React, { useRef, useEffect } from 'react';
import { Message, Dataset } from '../types';
import { User, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { SqlBlock } from './SqlBlock';
import { DataViz } from './DataViz';

interface ChatAreaProps {
  messages: Message[];
  isProcessing: boolean;
  activeDataset?: Dataset | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isProcessing, activeDataset }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 animate-pulse-slow">
          <Sparkles className="text-amber-500 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-light text-warm-100 mb-2">
          What would you like to know?
        </h2>
        <p className="text-warm-600 max-w-md">
          {activeDataset 
            ? `Ask questions about "${activeDataset.name}" or ask for visualization.` 
            : "Upload a CSV or Excel file to get started."}
        </p>
        
        {activeDataset && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
            {["Show top 5 sales by region", "Trend of revenue over time", "Distribution of product categories", "Average order value"].map((suggestion) => (
              <button 
                key={suggestion}
                className="text-sm text-left p-3 rounded-lg border border-warm-700/50 hover:bg-white/5 hover:border-amber-500/30 transition-all text-warm-100/70 hover:text-warm-100"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
        >
          <div className={`flex gap-4 max-w-4xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
              ${msg.role === 'user' ? 'bg-warm-700' : 'bg-amber-500/20'}
            `}>
              {msg.role === 'user' ? (
                <User size={14} className="text-warm-100" />
              ) : (
                <Sparkles size={14} className="text-amber-500" />
              )}
            </div>

            {/* Message Bubble */}
            <div className="flex-1 space-y-4">
              <div className={`
                p-4 rounded-2xl text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-warm-800 text-warm-100 rounded-tr-sm' 
                  : 'bg-transparent text-warm-100 px-0 pt-0'}
              `}>
                {msg.content}
              </div>

              {/* Data & Viz */}
              {(msg.sql || msg.data) && (
                <div className="space-y-4 animate-fade-in">
                  {msg.sql && <SqlBlock sql={msg.sql} />}
                  
                  {msg.data && msg.visualization && (
                    <Card className="p-6 border-amber-500/10">
                      <DataViz data={msg.data} config={msg.visualization} />
                    </Card>
                  )}

                  {msg.data && (
                    <div className="overflow-x-auto rounded-lg border border-warm-800">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-warm-800/50 text-warm-100/60 uppercase text-xs">
                          <tr>
                            {Object.keys(msg.data[0]).map(key => (
                              <th key={key} className="px-4 py-3 font-medium tracking-wider">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-800/50 text-warm-100/80">
                          {msg.data.slice(0, 5).map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="px-4 py-3 font-mono text-xs">
                                  {val.toLocaleString()}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {msg.data.length > 5 && (
                        <div className="px-4 py-2 text-xs text-warm-600 bg-warm-900/50 text-center">
                          Showing first 5 of {msg.data.length} rows
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex gap-4 max-w-4xl animate-pulse">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Sparkles size={14} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-1 h-8">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};