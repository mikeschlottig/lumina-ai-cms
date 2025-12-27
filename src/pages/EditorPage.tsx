import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Save, 
  Sparkles, 
  Settings2,
  Eye,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data: postRes, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => cmsClient.getPost(id!),
    enabled: !!id && id !== 'new'
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
      toast.success('Saved successfully');
    }
  });
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading Editor...</div>;
  return (
    <AppLayout 
      showRail 
      railContent={
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Content Assistant
            </h3>
            <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
              Type <kbd className="rounded border bg-muted px-1">/</kbd> in the editor to trigger AI commands or ask the assistant for research.
            </div>
            <Button variant="outline" className="w-full">Open Chat Panel</Button>
          </div>
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Document Settings
            </h3>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Slug</label>
              <Input value={title.toLowerCase().replace(/\s+/g, '-')} disabled className="h-8" />
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full bg-background">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden">
              <Button variant="ghost" size="icon" onClick={() => navigate('/content')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="hidden sm:inline-flex">Draft</Badge>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="border-none text-lg font-bold focus-visible:ring-0 px-0 min-w-[200px]"
                placeholder="Post Title"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => saveMutation.mutate({ title, content })}
                disabled={saveMutation.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" /> 
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-4xl mx-auto">
            <TiptapEditor 
              content={content} 
              onChange={setContent} 
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}