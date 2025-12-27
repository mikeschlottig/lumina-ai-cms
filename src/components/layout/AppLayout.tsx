import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresenceBar } from "./PresenceBar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
      <SidebarInset className={cn("relative flex min-h-screen flex-col bg-background transition-all duration-500", className)}>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/70 px-6 backdrop-blur-2xl">
          <SidebarTrigger />
          <div className="h-4 w-[1px] bg-border mx-2" />
          <div className="flex-1 overflow-hidden">
             <span className="text-sm font-bold text-foreground truncate block uppercase tracking-widest">Global Workspace / Production</span>
          </div>
          <div className="flex items-center gap-4">
            <PresenceBar />
            <div className="h-4 w-[1px] bg-border mx-1" />
            <ThemeToggle className="static" />
          </div>
        </header>
        <main className="flex flex-1 flex-row overflow-hidden h-[calc(100vh-4rem)]">
          <div className={cn(
            "flex-1 overflow-y-auto scroll-smooth",
            container && "w-full",
            contentClassName
          )}>
            {children}
          </div>
          <AnimatePresence>
            {showRail && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border-l bg-zinc-50/40 dark:bg-zinc-950/40 backdrop-blur-md overflow-hidden shrink-0"
              >
                <div className="w-[360px] h-full flex flex-col">
                  {railContent}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </main>
        <footer className="border-t py-3 px-6 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lumina Intelligence v1.2</p>
            <div className="h-3 w-[1px] bg-border" />
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Syncing with Cloudflare Edge</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Neural Link Synchronized</span>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}