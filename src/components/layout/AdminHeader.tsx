import { Search, User, ChevronDown, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  activeTab: 'courses' | 'reporting' | 'settings';
  onTabChange: (tab: 'courses' | 'reporting' | 'settings') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AdminHeader({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: AdminHeaderProps) {
  const tabs = [
    { id: 'courses' as const, label: 'Courses' },
    { id: 'reporting' as const, label: 'Reporting' },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Left: Logo & App Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-lg font-semibold text-foreground">LearnHub</span>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeTab === tab.id
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border-transparent focus:border-input focus:bg-background"
          />
        </div>

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Admin</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
