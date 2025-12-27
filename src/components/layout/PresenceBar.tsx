import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Users } from 'lucide-react';
const MOCK_USERS = [
  { id: '1', name: 'Alex Rivera', role: 'Editor', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: '2', name: 'Sarah Chen', role: 'Writer', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: '3', name: 'James Wilson', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=james' },
];
export function PresenceBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex -space-x-3">
        {MOCK_USERS.map((user) => (
          <Avatar key={user.id} className="h-8 w-8 border-2 border-background ring-1 ring-zinc-200 dark:ring-zinc-800 transition-transform hover:scale-110 cursor-pointer">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-[10px] font-bold">{user.name.charAt(0)}</AvatarFallback>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </Avatar>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-muted-foreground hover:text-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold">Workspace</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Collaborators</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          {MOCK_USERS.map((user) => (
            <DropdownMenuItem key={user.id} className="gap-3 p-2 rounded-lg cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{user.role}</span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem className="justify-center text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
            Invite Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}