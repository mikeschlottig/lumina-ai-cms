import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Settings, 
  Plus, 
  Sparkles, 
  BookOpen,
  BarChart3
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
  const handleNewPost = async () => {
    try {
      const res = await cmsClient.createPost({
        title: "Untitled Post",
        status: "draft",
        content: ""
      });
      if (res.success && res.data) {
        navigate(`/editor/${res.data.id}`);
        toast.success("New draft created");
      }
    } catch (error) {
      toast.error("Failed to create post");
    }
  };
  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Content Hub", icon: FileText, path: "/content" },
    { title: "Analytics", icon: BarChart3, path: "/analytics" },
    { title: "Library", icon: BookOpen, path: "/library" },
  ];
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">Lumina</span>
        </div>
        <Button 
          onClick={handleNewPost}
          className="w-full justify-start gap-2 shadow-sm" 
          variant="default"
        >
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  onClick={() => navigate(item.path)}
                  isActive={location.pathname === item.path}
                  tooltip={item.title}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-lg bg-accent/50 p-4">
          <p className="text-xs font-medium text-accent-foreground">AI Pro Active</p>
          <p className="text-[10px] text-muted-foreground mt-1">Unlimited generations available for your plan.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}