import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { Card } from './ui/Card';

interface SqlBlockProps {
  sql: string;
}

export const SqlBlock: React.FC<SqlBlockProps> = ({ sql }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-3 overflow-hidden border-amber-500/20 bg-[#0c0a09]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-500">
          <Terminal size={14} />
          <span>GENERATED SQL</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-warm-600 hover:text-warm-100 transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-warm-100 whitespace-pre-wrap leading-relaxed">
          <code dangerouslySetInnerHTML={{ 
            __html: sql.replace(/(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|JOIN|AND|OR|AS|SUM|COUNT|AVG)/g, 
            '<span class="text-amber-400 font-bold">$1</span>') 
          }} />
        </pre>
      </div>
    </Card>
  );
};