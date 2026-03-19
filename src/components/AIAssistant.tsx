import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2, BookOpen, HelpCircle, Lightbulb } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: HelpCircle, label: 'Explain cardiac cycle', prompt: 'Explain the cardiac cycle in simple terms' },
  { icon: BookOpen, label: 'Drug mechanisms', prompt: 'How do beta-blockers work?' },
  { icon: Lightbulb, label: 'Study tips', prompt: 'Give me tips for memorizing anatomy' },
];

export default function AIAssistant({ isOpen, onClose, isDarkMode }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your MedStudy AI tutor. I can now talk to your backend and, once configured, Google Gemini. Ask me a study question.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiFetch<{ answer: string }>('/api/ai/ask', {
        method: 'POST',
        body: JSON.stringify({ prompt: promptText.trim() })
      });

      setMessages((prev) => [...prev, {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: error instanceof Error ? error.message : 'The AI assistant could not respond right now.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => sendPrompt(input);
  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => sendPrompt(prompt), 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl h-[80vh] sm:h-[600px] rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-med-bg-dark' : 'bg-white'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-med-teal to-med-sky flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
            <div>
              <h3 className="font-heading font-semibold text-med-text dark:text-white">MedStudy AI</h3>
              <p className="text-xs text-med-text-secondary">Backend-connected tutor</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-med-text-secondary" /></button>
        </div>

        {messages.length < 3 && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <p className="text-xs text-med-text-secondary mb-3">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button key={prompt.label} onClick={() => handleQuickPrompt(prompt.prompt)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-med-teal/10 hover:text-med-teal transition-colors text-sm">
                  <prompt.icon className="w-4 h-4" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 h-[calc(100%-180px)] overflow-y-auto">
          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-med-teal/10' : 'bg-gradient-to-br from-med-teal to-med-sky'}`}>
                  {message.role === 'user' ? <User className="w-4 h-4 text-med-teal" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap text-sm leading-6 ${message.role === 'user' ? 'bg-med-teal text-white' : 'bg-gray-50 dark:bg-white/5 text-med-text dark:text-white'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-med-teal to-med-sky"><Bot className="w-4 h-4 text-white" /></div>
                <div className="rounded-2xl px-4 py-3 bg-gray-50 dark:bg-white/5 text-med-text-secondary flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Thinking…</div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-med-bg-dark/95 backdrop-blur-sm border-t border-gray-100 dark:border-white/10">
          <div className="flex gap-3">
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask anything about medicine..." className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-med-teal/30 focus:outline-none focus:ring-2 focus:ring-med-teal/10 text-med-text dark:text-white placeholder:text-med-text-secondary" />
            <button onClick={handleSend} disabled={!input.trim() || isLoading} className="w-11 h-11 rounded-xl bg-med-teal text-white flex items-center justify-center hover:bg-med-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-5 h-5" /></button>
          </div>
          <p className="text-xs text-med-text-secondary text-center mt-2">AI-generated content is for educational purposes. Always verify with official sources.</p>
        </div>
      </div>
    </div>
  );
}
