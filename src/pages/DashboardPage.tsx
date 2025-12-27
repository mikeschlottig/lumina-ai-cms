import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
export function DashboardPage() {
  const navigate = useNavigate();
  const { data: postsRes, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => cmsClient.listPosts()
  });
  const posts = postsRes?.data || [];
  // Analytics Mocking
  const chartData = Array.from({ length: 14 }).map((_, i) => ({
    name: format(subDays(new Date(), 13 - i), 'MMM d'),
    posts: Math.floor(Math.random() * 5) + (i > 7 ? 3 : 1),
  }));
  const categoryData = [
    { name: 'AI', value: 40, color: '#6366f1' },
    { name: 'Tech', value: 30, color: '#a5b4fc' },
    { name: 'Design', value: 20, color: '#e0e7ff' },
    { name: 'Dev', value: 10, color: '#4f46e5' },
  ];
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
  };
  const handleCreate = async () => {
    const res = await cmsClient.createPost({ title: 'New Article', status: 'draft' });
    if (res.success && res.data) navigate(`/editor/${res.data.id}`);
  };
  return (
    <AppLayout container>
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Command Central</h1>
            <p className="text-muted-foreground mt-1 text-lg">Your intelligence-driven publishing overview.</p>
          </div>
          <Button onClick={handleCreate} size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/10 transition-all hover:scale-105">
            <Plus className="h-5 w-5" /> New Masterpiece
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Volume', value: stats.total, icon: FileText, change: '+12% from month start' },
            { label: 'Live Content', value: stats.published, icon: CheckCircle2, change: '8.4k aggregate views' },
            { label: 'Work in Progress', value: stats.drafts, icon: Clock, change: '3 ready for review' },
            { label: 'AI Assistance', value: 'Active', icon: Sparkles, change: 'Unlimited Generations' }
          ].map((stat, i) => (
            <Card key={i} className="border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
          <Card className="lg:col-span-4 border-none shadow-soft bg-zinc-50/50 dark:bg-zinc-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-display">Content Velocity</CardTitle>
                  <CardDescription>Publication frequency over last 14 days</CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="posts" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPosts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg font-display">Recent Activity</CardTitle>
              <CardDescription>Stay on top of your workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {posts.slice(0, 4).map((post) => (
                  <div key={post.id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/editor/${post.id}`)}>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold group-hover:text-indigo-500 transition-colors">{post.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 uppercase">{post.status}</Badge>
                        <span className="text-[10px] text-muted-foreground">{format(post.updatedAt, 'MMM d, HH:mm')}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                ))}
                <div className="pt-4 border-t space-y-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AI Recommendations</p>
                  <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 p-4 relative overflow-hidden">
                    <Sparkles className="absolute -right-2 -top-2 h-12 w-12 text-indigo-500/10" />
                    <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">New Topic Idea</p>
                    <p className="text-sm font-display font-semibold mt-1">The Ethics of Generative CMS</p>
                    <Button variant="link" className="p-0 h-auto text-[11px] text-indigo-600 mt-2 font-bold" onClick={handleCreate}>Draft Now →</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}