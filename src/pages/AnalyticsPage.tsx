import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Zap, TrendingUp, Users, Eye, Sparkles, Calendar } from 'lucide-react';
export function AnalyticsPage() {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => cmsClient.getAnalyticsData()
  });
  const categoryData = [
    { name: 'Artificial Intelligence', value: 45, color: '#6366f1' },
    { name: 'Productivity', value: 25, color: '#818cf8' },
    { name: 'Development', value: 20, color: '#a5b4fc' },
    { name: 'Design', value: 10, color: '#e0e7ff' },
  ];
  const engagement = analyticsRes?.data?.engagement || [];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Intelligence Insights</h1>
            <p className="text-muted-foreground mt-1 text-lg">Deep content performance and reader engagement metrics.</p>
          </div>
          <Button variant="outline" className="gap-2 border-zinc-200 dark:border-zinc-800">
            <Calendar className="h-4 w-4" /> Last 30 Days
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <Zap className="absolute -right-4 -top-4 h-24 w-24 text-white/10 group-hover:rotate-12 transition-transform" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-indigo-100">AI Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold">84%</div>
              <p className="text-[10px] text-indigo-100 mt-1">Faster drafting with Neural Link</p>
            </CardContent>
          </Card>
          <Card className="border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">12.4k</div>
              <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +18.2% vs last month
              </p>
            </CardContent>
          </Card>
          <Card className="border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Retention Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display font-bold text-foreground">62%</div>
              <p className="text-[10px] text-indigo-500 font-bold mt-1">Industry leading benchmarks</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-zinc-50/30 dark:bg-zinc-950/30">
            <CardHeader>
              <CardTitle className="text-lg font-display text-foreground">Engagement Flow</CardTitle>
              <CardDescription>Views and clicks over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagement}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                    />
                    <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="clicks" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-zinc-50/30 dark:bg-zinc-950/30">
            <CardHeader>
              <CardTitle className="text-lg font-display text-foreground">Top Categories</CardTitle>
              <CardDescription>Share of content distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 10, fill: 'currentColor' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 p-8 rounded-3xl bg-zinc-950 dark:bg-zinc-900 text-white relative overflow-hidden">
          <Sparkles className="absolute -right-4 -bottom-4 h-32 w-32 text-indigo-500/20" />
          <div className="relative z-10">
            <h3 className="text-2xl font-display font-bold">AI Insight Report</h3>
            <p className="text-zinc-400 mt-2 max-w-2xl text-lg">
              "Articles containing at least 2 AI-generated infographics see 40% higher time-on-page. 
              We recommend drafting a follow-up piece on 'Neural Design' to capitalize on current traffic trends."
            </p>
            <Button className="mt-6 bg-white text-black hover:bg-zinc-200 font-bold">Apply Suggestions</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}