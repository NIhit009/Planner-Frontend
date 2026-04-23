'use client';

import { useState } from 'react';
import {
  LayoutGrid, Calendar, Users, FileText, Settings,
  ChevronLeft, ChevronRight, X, ChevronUp, ChevronDown,
  LogOut, User, Bell, Moon
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/API_Client';
import { BASE_URL } from '@/lib/Base_url';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeNav, onNavChange, isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const {
    viewMode,
    currentDate,
    setCurrentDate,
    calendarFilters,
    toggleCalendarFilter,
    categoryFilters
  } = useAppStore();
  
  const [showMyCalendars, setShowMyCalendars] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  

  // Core navigation items
  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'clients', icon: Users, label: 'Clients', adminOnly: true },
    { id: 'reports', icon: FileText, label: 'Reports' },
  ];

  // Mini Calendar Logic
  const monthStart = startOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: monthStart,
    end: endOfMonth(currentDate)
  });
  const paddingDays = Array(getDay(monthStart)).fill(null);
  const handleLogout = async () => {
    // Clear any auth state here if needed
    localStorage.removeItem("accessToken")
    const response = await apiClient.get(`${BASE_URL}/auth/logout`);
    const data = response.data;
    console.log(data.message);
    router.push('/login');
  };

  return (
    <>
      {/* MOBILE BOTTOM BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-[60] px-2 pb-safe-area-inset-bottom h-16 shadow-lg">
        <div className="flex items-center justify-around h-full">
          {navItems.map((item) => {
            if (item.adminOnly && viewMode !== 'admin') return null;
            const Icon = item.icon;
            const isActive = activeNav === item.id && !isOpen;
            return (
              <button
                key={item.id}
                onClick={() => { onNavChange(item.id); if (isOpen) onClose(); }}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => (isOpen ? onClose() : onNavChange('settings'))}
            className={cn(
              "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
              (isOpen || activeNav === 'settings') ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Settings className={cn("w-5 h-5", (isOpen || activeNav === 'settings') && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      {isOpen && <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* SIDEBAR */}
      <aside className={cn(
        "bg-card flex flex-col z-50 transition-transform duration-300 ease-in-out border-border",
        "fixed inset-x-0 bottom-0 h-[60vh] border-t rounded-t-[2.5rem] translate-y-full lg:relative lg:translate-y-0 lg:h-full lg:w-[280px] lg:border-r lg:rounded-none",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 mb-2 lg:hidden" />

        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="font-bold text-lg">
              Multi Client Manager
            </span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* MOBILE SETTINGS CONTENT (Visible when Drawer is Open) */}
          {isOpen && (
            <div className="lg:hidden p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                <div className="flex items-center gap-3"><User className="w-5 h-5" /> <span>Profile</span></div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                <div className="flex items-center gap-3"><Bell className="w-5 h-5" /> <span>Notifications</span></div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center gap-3 p-4 text-destructive font-bold mt-4" onClick={handleLogout}>
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}

          {/* DESKTOP SIDEBAR CONTENT */}
          <div className="hidden lg:block">
            {/* 1. Primary Navigation */}
            <nav className="py-4 px-3 border-b border-border">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  if (item.adminOnly && viewMode !== 'admin') return null;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavChange(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          activeNav === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="w-4 h-4" /> {item.label}
                      </button>
                    </li>
                  );
                })}
                {/* Desktop Settings Link */}
                <li>
                  <button
                    onClick={() => onNavChange('settings')}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      activeNav === 'settings' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </li>
              </ul>
            </nav>

            {/* 2. Mini Calendar Restored */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4 text-sm font-bold">
                {format(currentDate, 'MMMM yyyy')}
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 font-bold opacity-50 uppercase tracking-tighter">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d[0]}</div>)}
                {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
                {days.map(day => (
                  <button
                    key={day.toString()}
                    onClick={() => setCurrentDate(day)}
                    className={cn(
                      "h-7 w-7 rounded-full text-xs mx-auto flex items-center justify-center transition-all",
                      isSameDay(day, currentDate) ? "bg-primary text-primary-foreground font-bold shadow-md" : "hover:bg-muted"
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Filters Restored */}
            <div className="p-4 space-y-6">
              {/* Calendar Filters */}
              <div>
                <button onClick={() => setShowMyCalendars(!showMyCalendars)} className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  <span>Calendars</span> {showMyCalendars ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showMyCalendars && (
                  <ul className="space-y-3">
                    {calendarFilters.map(f => (
                      <li key={f.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`cal-${f.id}`}
                          checked={f.enabled}
                          onCheckedChange={() => toggleCalendarFilter(f.id)}
                        />
                        <label htmlFor={`cal-${f.id}`} className="text-sm font-medium cursor-pointer">{f.emoji} {f.name}</label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Task Type Filters */}
              <div>
                <button onClick={() => setShowCategories(!showCategories)} className="w-full flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  <span>Task Types</span> {showCategories ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showCategories && (
                  <ul className="space-y-3">
                    {categoryFilters?.map(cat => (
                      <li key={cat.id} className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full shadow-sm", cat.color)} />
                        <span className="text-sm font-medium capitalize text-muted-foreground">{cat.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}