'use client';

import { Search, Bell, HelpCircle, Filter, List, Plus, Menu, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/API_Client';
import { BASE_URL } from '@/lib/Base_url';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  // const {
  //   viewMode,
  //   setViewMode,
  //   calendarView,
  //   setCalendarView,
  //   clients,
  //   selectedClientId,
  //   setSelectedClientId,
  //   setIsTaskModalOpen,
  //   LoggedInRole
  // } = useAppStore();

  const viewMode = useAppStore((state) => state.viewMode);
  const setViewMode = useAppStore((state) => state.setViewMode);
  const calendarView = useAppStore((state) => state.calendarView);
  const setCalendarView = useAppStore((state) => state.setCalendarView);
  const clients = useAppStore((state) => state.clients);
  const selectedClientId = useAppStore((state) => state.selectedClientId);
  const setSelectedClientId = useAppStore((state) => state.setSelectedClientId);
  const setIsTaskModalOpen = useAppStore((state) => state.setIsTaskModalOpen);
  const LoggedInRole = useAppStore((state) => state.LoggedInRole);


  const selectedClient = clients.find(c => c.accountId._id === selectedClientId);

  const handleLogout = async () => {
    // Clear any auth state here if needed
    localStorage.removeItem("accessToken")
    const response = await apiClient.get(`${BASE_URL}/auth/logout`);
    const data = response.data;
    console.log(data.message);
    router.push('/login');
  };

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card flex items-center justify-between px-3 sm:px-6">
      {/* Left section - Menu & View Toggle */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="hidden sm:flex bg-muted rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCalendarView(view)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                calendarView === view
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Center section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for anything"
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      {/* Right section - Actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-4">
        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-muted-foreground">
          <Search className="w-5 h-5" />
        </Button>
        {/* Notification & Help */}
        <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground h-9 w-9">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground h-9 w-9">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button className="w-full sm:w-auto bg-red-100 hover:bg-red-200 text-red-700 border border-red-300">
          Report an issue
        </Button>

        {/* User Profile & View Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-muted rounded-lg p-2 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedClient?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedClient?.accountId.fullName?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium">
                  {viewMode === 'admin' ? 'Admin View' : selectedClient?.accountId.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {viewMode === 'admin' ? 'Managing all clients' : selectedClient?.accountId.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          {(LoggedInRole === 'admin') ? <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch View</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setViewMode('admin')}
              className={cn(viewMode === 'admin' && "bg-muted")}
            >
              <span className="font-medium">Admin View</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Client View</DropdownMenuLabel>
            {clients.map((client) => (
              <DropdownMenuItem
                key={client.accountId._id}
                onClick={() => {
                  setViewMode('client');
                  setSelectedClientId(client.accountId._id);
                }}
                className={cn(
                  selectedClientId === client.accountId._id && "bg-muted"
                )}
              >
                {client.accountId.fullName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent> : <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>}

        </DropdownMenu>
      </div>
    </header>
  );
}

export function CalendarHeader() {
  // const { currentDate, setIsTaskModalOpen } = useAppStore();
  const setIsBulkRequestModalOpen = useAppStore((state) => state.setIsBulkRequestModalOpen);
  const currentDate = useAppStore((state) => state.currentDate);
  const setIsTaskModalOpen = useAppStore((state) => state.setIsTaskModalOpen);
  const LoggedInRole = useAppStore((state) => state.LoggedInRole);
  const viewMode = useAppStore((state) => state.viewMode);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-6 border-b border-border bg-card gap-2">
      <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">{monthYear}</h1>

      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3">
          Today
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9">
          <List className="w-4 h-4" />
        </Button>
        <Button
          className="bg-primary text-primary-foreground h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm"
          onClick={(LoggedInRole === 'admin' && viewMode === 'admin') ? () => setIsTaskModalOpen(true) : () => setIsBulkRequestModalOpen(true)}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          {(LoggedInRole === 'admin' && viewMode === 'admin') ? <span className="hidden sm:inline">Add to Schedule</span> : <span className="hidden sm:inline">Request Work</span>}
        </Button>
      </div>
    </div>
  );
}
