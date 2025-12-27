
import React from 'react';
import { GroundingChunk } from '../types';

interface MarkdownRendererProps {
  content: string;
  groundingChunks?: GroundingChunk[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, groundingChunks }) => {
  const renderContent = (text: string) => {
    let html = text
      .replace(/# Match Score: (\d+)%/g, (_, score) => {
        const scoreInt = parseInt(score);
        const colorClass = scoreInt >= 80 ? 'text-emerald-600' : (scoreInt >= 50 ? 'text-amber-600' : 'text-red-600');
        const borderColor = scoreInt >= 80 ? 'border-emerald-100' : (scoreInt >= 50 ? 'border-amber-100' : 'border-red-100');
        return `
          <div class="text-center mb-10 p-10 bg-slate-50/50 border-4 border-dashed ${borderColor} rounded-[2.5rem]">
            <p class="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Compatibility Metric</p>
            <h1 class="text-8xl font-black ${colorClass} tracking-tighter">${score}%</h1>
            <p class="mt-4 text-slate-600 font-bold">${scoreInt >= 80 ? 'Strong Candidate Potential' : 'Room for Optimization'}</p>
          </div>
        `;
      })
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-black text-slate-800 mt-8 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-black text-slate-900 mt-10 mb-6 border-b-2 border-slate-50 pb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-black text-slate-900 mb-10">$1</h1>')
      .replace(/^\* (.*$)/gm, '<li class="list-none flex items-start gap-3 my-3 text-slate-700 font-medium"><span class="text-emerald-500 font-black mt-1">✦</span><span>$1</span></li>')
      .replace(/^- (.*$)/gm, '<li class="list-none flex items-start gap-3 my-3 text-slate-700 font-medium"><span class="text-slate-300 font-black mt-1">○</span><span>$1</span></li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-6 text-slate-600 leading-relaxed font-medium">')
      .replace(/\n/g, '<br/>');

    html = html.replace(/(<li.*<\/li>(\s*<li.*<\/li>)*)/gs, '<ul class="bg-slate-50/30 p-6 rounded-[1.5rem] border border-slate-100 my-6">$1</ul>');
    
    return `<div class="markdown-body"><p class="mb-6 text-slate-600 leading-relaxed font-medium">${html}</p></div>`;
  };

  const sources = groundingChunks?.filter(chunk => chunk.web).map(chunk => chunk.web) || [];

  return (
    <div className="space-y-10">
      <div 
        className="prose prose-slate max-w-none prose-h2:text-slate-900 prose-li:marker:text-emerald-500"
        dangerouslySetInnerHTML={{ __html: renderContent(content) }} 
      />
      
      {sources.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-100">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Information Grounding</h4>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              <a 
                key={idx}
                href={source?.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse" />
                {source?.title || 'Knowledge Source'}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;
