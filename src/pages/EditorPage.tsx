import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { AIChatPanel } from '@/components/editor/AIChatPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  Save,
  Send,
  Settings2,
  Eye,
  MoreVertical,
  BarChart2,
  Clock,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showAssistant, setShowAssistant] = useState(true);
  const { data: postRes, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => cmsClient.getPost(id!),
    enabled: !!id
  });
  useEffect(() => {
    if (postRes?.data) {
      setTitle(postRes.data.title);
      setContent(postRes.data.content);
    }
  }, [postRes]);
  const saveMutation = useMutation({
    mutationFn: (updates: any) => cmsClient.updatePost(id!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      toast.success('Saved draft');
    }
  });
  const publishMutation = useMutation({
    mutationFn: () => cmsClient.updatePost(id!, { status: 'published' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#fafafa', '#09090b']
      });
      toast.success('Successfully published!');
    }
  });
  if (isLoading) return <div className="flex h-screen items-center justify-center font-display">Preparing workspace...</div>;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);
  return (
    <AppLayout
      showRail={showAssistant}
      railContent={<AIChatPanel postId={id!} documentContent={content} />}
    >
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-xl px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate('/content')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col min-w-0">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-none text-xl font-display font-bold focus-visible:ring-0 px-0 h-auto bg-transparent py-0 truncate"
                  placeholder="Post Title"
                />
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px] h-4 uppercase tracking-wider font-semibold opacity-70">
                    {postRes?.data?.status || 'Draft'}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" /> {readTime} min read
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => setShowAssistant(!showAssistant)} className={showAssistant ? "text-indigo-500" : ""}>
                <Layout className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Settings2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="mx-1 h-6 hidden sm:block" />
              <Button
                variant="outline"
                onClick={() => saveMutation.mutate({ title, content })}
                disabled={saveMutation.isPending}
                className="gap-2 border-zinc-200 dark:border-zinc-800"
              >
                <Save className="h-4 w-4" />
                <span className="hidden md:inline">Save</span>
              </Button>
              <Button
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending || postRes?.data?.status === 'published'}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20 shadow-lg"
              >
                <Send className="h-4 w-4" />
                <span>Publish</span>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto pt-8 pb-24 px-6">
          <div className="max-w-3xl mx-auto">
            <TiptapEditor
              content={content}
              onChange={setContent}
            />
            <div className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Words</p>
                <p className="text-xl font-display font-semibold">{wordCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reading Time</p>
                <p className="text-xl font-display font-semibold">{readTime} min</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">SEO Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-display font-semibold">84</p>
                  <BarChart2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}