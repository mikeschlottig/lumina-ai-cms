import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, RotateCcw, FileText, Zap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService } from '@/lib/chat';
import { cn } from '@/lib/utils';
import type { Message } from '../../../worker/types';
interface AIChatPanelProps {
  postId: string;
  documentContent: string;
}
export function AIChatPanel({ postId, documentContent }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatService.switchSession(postId);
    loadMessages();
  }, [postId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const loadMessages = async () => {
    const res = await chatService.getMessages();
    if (res.success && res.data) {
      setMessages(res.data.messages);
    }
  };
  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    let streamContent = '';
    const tempId = crypto.randomUUID();
    try {
      await chatService.sendMessage(
        `Document Context:\n${documentContent}\n\nUser Request: ${text}`,
        undefined,
        (chunk) => {
          streamContent += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.id === tempId) {
              return [...prev.slice(0, -1), { ...last, content: streamContent }];
            }
            return [...prev, { id: tempId, role: 'assistant', content: streamContent, timestamp: Date.now() }];
          });
        }
      );
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setIsTyping(false);
    }
  };
  const quickActions = [
    { label: 'Summarize', icon: FileText, prompt: 'Provide a concise summary of this document.' },
    { label: 'Improve Tone', icon: Zap, prompt: 'How can I make the tone of this document more professional and engaging?' },
    { label: 'SEO Ideas', icon: Search, prompt: 'Suggest 5 SEO keywords and a meta description based on this content.' },
  ];
  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <h3 className="text-sm font-semibold">Content Agent</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => chatService.clearMessages().then(() => setMessages([]))}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-indigo-500" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                I'm your Lumina Assistant. I can help you research, write, and refine your content.
              </p>
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {quickActions.map(action => (
                  <Button key={action.label} variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => handleSend(action.prompt)}>
                    <action.icon className="h-3 w-3" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3 text-sm leading-relaxed max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                  msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-background text-indigo-500"
                )}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl shadow-sm border",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-background text-foreground rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="pr-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md"
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}