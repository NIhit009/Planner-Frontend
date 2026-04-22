'use client';

import { useState } from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { X } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { id: 'calendar', icon: Calendar, label: 'Calendar' },
  { id: 'clients', icon: Users, label: 'Clients', adminOnly: true },
  { id: 'reports', icon: FileText, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeNav, onNavChange, isOpen, onClose }: SidebarProps) {
  const { 
    viewMode, 
    currentDate, 
    setCurrentDate,
    calendarFilters,
    toggleCalendarFilter,
    categoryFilters,
    toggleCategoryFilter
  } = useAppStore();
  
  const [showMyCalendars, setShowMyCalendars] = useState(true);
  const [showOtherCalendars, setShowOtherCalendars] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [showScheduled, setShowScheduled] = useState(false);
  
  // Mini calendar logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  
  // Add padding days for the start of the month
  const paddingDays = Array(startDayOfWeek).fill(null);
  
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <aside className={cn(
      "w-[280px] border-r border-border bg-card flex flex-col h-full",
      "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
          <span className="text-background font-bold text-xl">C</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-8 w-8"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Navigation Icons */}
      <nav className="py-4 px-3 border-b border-border">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && viewMode !== 'admin') return null;
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Mini Calendar */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">{format(currentDate, 'MMMM yyyy')}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="h-7" />
          ))}
          {days.map((day) => {
            const isToday = isSameDay(day, new Date(2023, 7, 9)); // Mock "today"
            const isSelected = isSameDay(day, currentDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setCurrentDate(day)}
                className={cn(
                  "h-7 w-7 flex items-center justify-center text-xs rounded-full transition-colors",
                  isToday && "bg-primary text-primary-foreground font-semibold",
                  isSelected && !isToday && "bg-muted font-semibold",
                  !isCurrentMonth && "text-muted-foreground",
                  !isToday && !isSelected && "hover:bg-muted"
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Scrollable section */}
      <div className="flex-1 overflow-y-auto">
        {/* Scheduled */}
        <div className="p-4 border-b border-border">
          <button 
            onClick={() => setShowScheduled(!showScheduled)}
            className="w-full flex items-center justify-between text-sm font-semibold"
          >
            <span>Scheduled</span>
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* My Calendars */}
        <div className="p-4 border-b border-border">
          <button 
            onClick={() => setShowMyCalendars(!showMyCalendars)}
            className="w-full flex items-center justify-between text-sm font-semibold mb-3"
          >
            <span>My Calendars</span>
            {showMyCalendars ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {showMyCalendars && (
            <ul className="space-y-2">
              {calendarFilters.map((filter) => (
                <li key={filter.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={filter.enabled}
                    onCheckedChange={() => toggleCalendarFilter(filter.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm">{filter.emoji}</span>
                  <span className="text-sm text-foreground">{filter.name}</span>
                </li>
              ))}
              <li>
                <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Plus className="w-4 h-4" />
                  Add other
                </button>
              </li>
            </ul>
          )}
        </div>
        
        {/* Other Calendars */}
        <div className="p-4 border-b border-border">
          <button 
            onClick={() => setShowOtherCalendars(!showOtherCalendars)}
            className="w-full flex items-center justify-between text-sm font-semibold"
          >
            <span>Other Calendars</span>
            {showOtherCalendars ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
        
        {/* Categories */}
        <div className="p-4">
          <button 
            onClick={() => setShowCategories(!showCategories)}
            className="w-full flex items-center justify-between text-sm font-semibold mb-3"
          >
            <span>Categories</span>
            {showCategories ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          
          {showCategories && (
            <ul className="space-y-2">
              {categoryFilters.map((category) => (
                <li key={category.id} className="flex items-center gap-3">
                  <span className={cn("w-2 h-2 rounded-full", category.color)} />
                  <span className="text-sm text-foreground capitalize">{category.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
