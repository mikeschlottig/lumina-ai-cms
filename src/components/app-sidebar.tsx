import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  FileText,
  Settings,
  Plus,
  Sparkles,
  Image,
  BarChart3,
  Layers,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cmsClient } from "@/lib/cms-client";
import { toast } from "sonner";
export function AppSidebar(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: postsRes } = useQuery({
    queryKey: ['posts'],
    queryFn: () => cmsClient.listPosts()
  });
  const recentPosts = postsRes?.data?.slice(0, 3) || [];
  const handleNewPost = async () => {
    try {
      const res = await cmsClient.createPost({
        title: "Untitled Post",
        status: "draft",
        content: ""
      });
      if (res.success && res.data) {
        navigate(`/editor/${res.data.id}`);
        toast.success("New draft initialized");
      }
    } catch (error) {
      toast.error("Failed to initialize session");
    }
  };
  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Content Hub", icon: FileText, path: "/content" },
    { title: "Media Library", icon: Image, path: "/library" },
    { title: "Deep Analytics", icon: BarChart3, path: "/analytics" },
  ];
  return (
    <Sidebar variant="inset" className="border-none">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold tracking-tight text-foreground">Lumina</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest -mt-1">CMS Engine</span>
          </div>
        </div>
        <Button
          onClick={handleNewPost}
          className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/10"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          <span className="font-bold">New Draft</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest">Command Center</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => navigate(item.path)}
                  isActive={location.pathname === item.path}
                  tooltip={item.title}
                  className="rounded-xl h-10 transition-all"
                >
                  <item.icon className={location.pathname === item.path ? "text-indigo-500" : "text-muted-foreground"} />
                  <span className="font-semibold">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="mx-4 opacity-50" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest">Recent Flux</SidebarGroupLabel>
          <SidebarMenu>
            {recentPosts.map((post) => (
              <SidebarMenuItem key={post.id}>
                <SidebarMenuButton 
                  onClick={() => navigate(`/editor/${post.id}`)}
                  className="rounded-xl group"
                >
                  <Layers className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500" />
                  <span className="truncate text-xs font-medium text-foreground/80">{post.title}</span>
                  <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border p-4 space-y-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Tier: Ultra</p>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground relative z-10">Neural capabilities are fully unlocked for this workspace.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}