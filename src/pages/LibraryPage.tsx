import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cmsClient } from '@/lib/cms-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, List, Download, Trash2, Filter } from 'lucide-react';
export function LibraryPage() {
  const { data: mediaRes, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => cmsClient.getMediaQuery()
  });
  const assets = mediaRes?.data || [];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground mt-1">Manage your organization's digital assets.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Batch Export
            </Button>
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              Upload Assets
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-zinc-50/50 dark:bg-zinc-950/50 p-4 rounded-2xl border">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search assets by name, tag, or metadata..." className="pl-9 bg-background" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="text-indigo-500 bg-accent"><Grid className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><List className="h-4 w-4" /></Button>
            <div className="h-6 w-[1px] bg-border mx-2" />
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id} className="group overflow-hidden rounded-2xl border-none shadow-soft hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full"><Download className="h-4 w-4" /></Button>
                      <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="p-4 bg-background">
                    <p className="text-sm font-semibold text-foreground truncate">{asset.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{asset.dimensions}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{asset.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}