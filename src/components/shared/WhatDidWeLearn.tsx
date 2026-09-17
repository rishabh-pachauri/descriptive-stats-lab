import { Lightbulb } from 'lucide-react';

interface WhatDidWeLearnProps {
  concept: string;
  text: string;
}

/** End-of-concept summary card shown at the bottom of every concept section */
export default function WhatDidWeLearn({ concept, text }: WhatDidWeLearnProps) {
  return (
    <div className="flex items-start gap-4 bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-5 text-white shadow-md">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <Lightbulb className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-brand-200 mb-1">
          What did we learn?
        </div>
        <div className="font-bold text-base text-white">{concept}</div>
        <p className="text-brand-100 text-sm mt-1 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
