import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface ReflectionBoxProps {
  prompt: string;
  placeholder?: string;
}

/** Reflective writing box encouraging students to articulate their understanding */
export default function ReflectionBox({ prompt, placeholder }: ReflectionBoxProps) {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (text.trim()) setSaved(true);
  };

  return (
    <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-violet-700 font-semibold">
        <MessageSquare className="w-5 h-5" />
        <span>Your Reflection</span>
      </div>
      <p className="text-sm text-violet-800">{prompt}</p>
      {saved ? (
        <div className="bg-violet-100 rounded-xl p-3 text-sm text-violet-800 italic">
          "{text}"
          <button
            onClick={() => setSaved(false)}
            className="ml-2 text-xs text-violet-500 underline"
          >
            Edit
          </button>
        </div>
      ) : (
        <>
          <textarea
            rows={3}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={placeholder ?? 'Write your thoughts here…'}
            className="w-full px-4 py-3 rounded-xl border border-violet-200 text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none placeholder:text-violet-300"
          />
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold
                       hover:bg-violet-700 disabled:opacity-40 transition-colors"
          >
            Save reflection
          </button>
        </>
      )}
    </div>
  );
}
