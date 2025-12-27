import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cmsClient, MediaAsset } from '@/lib/cms-client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MediaManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}
export function MediaManager({ open, onOpenChange, onSelect }: MediaManagerProps) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: mediaRes, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: () => cmsClient.getMediaQuery(),
    enabled: open
  });
  const assets = mediaRes?.data || [];
  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  const handleSelect = (asset: MediaAsset) => {
    setSelectedId(asset.id);
    onSelect(asset.url);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-display font-bold">Media Ecosystem</DialogTitle>
          <DialogDescription>Select an asset for your masterpiece or upload new content.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="gallery" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 border-b flex items-center justify-between">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value="gallery" className="data-[state=active]:bg-accent">Gallery</TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-accent">Upload</TabsTrigger>
            </TabsList>
            <div className="relative w-64 my-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter assets..."
                className="pl-9 h-8 bg-muted border-none text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <TabsContent value="gallery" className="flex-1 overflow-hidden m-0">
            <ScrollArea className="h-full p-6">
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => handleSelect(asset)}
                      className={cn(
                        "group relative aspect-video overflow-hidden rounded-xl border bg-muted cursor-pointer transition-all hover:scale-[1.02]",
                        selectedId === asset.id ? "ring-2 ring-indigo-500" : "hover:shadow-lg"
                      )}
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-[10px] font-medium text-white truncate">{asset.name}</span>
                      </div>
                      {selectedId === asset.id && (
                        <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full shadow-lg">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="upload" className="flex-1 m-0">
            <div className="h-full flex flex-col items-center justify-center p-12">
              <div className="w-full max-w-md aspect-video border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-4 bg-zinc-50/50 dark:bg-zinc-950/50 hover:bg-accent transition-colors cursor-pointer group">
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Drop assets here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports PNG, JPG, WEBP (Max 10MB)</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}