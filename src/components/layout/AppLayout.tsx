import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
  showRail?: boolean;
  railContent?: React.ReactNode;
};
export function AppLayout({ 
  children, 
  container = false, 
  className, 
  contentClassName,
  showRail = false,
  railContent
}: AppLayoutProps): JSX.Element {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className={cn("relative flex min-h-screen flex-col bg-background transition-all duration-300", className)}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger />
          <div className="flex-1" />
          <ThemeToggle className="static" />
        </header>
        <main className="flex flex-1 flex-row overflow-hidden">
          <div className={cn(
            "flex-1 overflow-y-auto",
            container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12",
            contentClassName
          )}>
            {children}
          </div>
          {showRail && (
            <aside className="hidden w-80 border-l bg-muted/30 lg:block overflow-y-auto">
              {railContent}
            </aside>
          )}
        </main>
        <footer className="border-t py-4 px-6 text-center text-xs text-muted-foreground">
          <p>Lumina AI CMS • AI usage limits may apply.</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}