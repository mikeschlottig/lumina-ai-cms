import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
export function DashboardPage() {
  const navigate = useNavigate();
  const { data: postsRes, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => cmsClient.listPosts()
  });
  const posts = postsRes?.data || [];
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
  };
  const handleCreate = async () => {
    const res = await cmsClient.createPost({ title: 'Untitled Post' });
    if (res.success && res.data) navigate(`/editor/${res.data.id}`);
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Good morning</h1>
            <p className="text-muted-foreground">Here is what is happening with your content today.</p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
              <p className="text-xs text-muted-foreground">84% of total volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.drafts}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>You have written {stats.total} posts this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : posts.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">No posts yet.</div>
                ) : (
                  posts.slice(0, 5).map(post => (
                    <div 
                      key={post.id} 
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-md transition-colors cursor-pointer"
                      onClick={() => navigate(`/editor/${post.id}`)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{post.title}</span>
                        <span className="text-xs text-muted-foreground">{format(post.updatedAt, 'MMM d, yyyy')}</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Generated based on your recent activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-primary/5 p-4 space-y-2">
                <p className="text-sm font-medium">Suggested Topic</p>
                <p className="text-xs text-muted-foreground">"The Future of AI-Native CMS Architectures"</p>
                <Button variant="link" className="p-0 h-auto text-xs">Create Draft</Button>
              </div>
              <div className="rounded-lg border p-4 space-y-2">
                <p className="text-sm font-medium">Optimization Tip</p>
                <p className="text-xs text-muted-foreground">Your last 3 posts lack metadata. Add descriptions to improve SEO.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}