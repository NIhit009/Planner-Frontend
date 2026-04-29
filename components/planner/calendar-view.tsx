'use client';

import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  parseISO
} from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import type { Task } from '@/lib/mock-data';

const typeEmojis: Record<string, string> = {
  video: '🎬',
  banner: '🎨',
  image: '📸',
  website: '💻',
};

const statusColors: Record<string, string> = {
  pending: 'border-l-yellow-500 bg-yellow-50',
  'in-progress': 'border-l-blue-500 bg-blue-50',
  completed: 'border-l-green-500 bg-green-50',
  delayed: 'border-l-red-500 bg-red-50',
};

interface CalendarEventProps {
  task: Task;
  onClick: () => void;
}

function CalendarEvent({ task, onClick }: CalendarEventProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-2 py-1 rounded text-xs border-l-2 truncate mb-1 transition-colors hover:opacity-80",
        statusColors[task.status]
      )}
    >
      <span className="font-medium">
        {task.startTime && `${task.startTime} · `}
      </span>
      <span>{typeEmojis[task.type]} </span>
      <span className="text-foreground/80">{task.name}</span>
    </button>
  );
}

export function CalendarView() {
  const currentDate = useAppStore((state) => state.currentDate);
  const tasks = useAppStore((state) => state.tasks);
  const calendarFilters = useAppStore((state) => state.calendarFilters);
  const categoryFilters = useAppStore((state) => state.categoryFilters);
  const viewMode = useAppStore((state) => state.viewMode);
  const selectedClientId = useAppStore((state) => state.selectedClientId);
  const setIsTaskModalOpen = useAppStore((state) => state.setIsTaskModalOpen);
  const setSelectedTask = useAppStore((state) => state.setSelectedTask);
  
  // Get the days to display
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Filter tasks based on enabled filters and view mode
  const filteredTasks = tasks.filter(task => {
    // View mode filter
    if (viewMode === 'client' && task.clientId !== selectedClientId) {
      return false;
    }

    
    // Calendar filter (client filter)
    const calendarFilter = calendarFilters.find(f => f.id === task.clientId);
    if (calendarFilter && !calendarFilter.enabled) {
      return false;
    }
    
    // Category filter (type filter)
    const categoryFilter = categoryFilters.find(f => f.id === task.type);
    if (categoryFilter && !categoryFilter.enabled) {
      return false;
    }
    
    return true;
  });

  console.log(filteredTasks);
  
  const getTasksForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return filteredTasks.filter(task => {
      const taskDateStr = task.deadline.split("T")[0];
      return taskDateStr === dateStr
    });
  };
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };
  
  const today = new Date(2023, 7, 9); // Mock "today" as August 9, 2023

  return (
    <div className="flex-1 overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border bg-card sticky top-0 z-10">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
          <div 
            key={day} 
            className="py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground border-r border-border last:border-r-0"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day, index) => {
          const dayTasks = getTasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, today);
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[60px] sm:min-h-[100px] lg:min-h-[120px] border-r border-b border-border p-1 sm:p-2 transition-colors",
                !isCurrentMonth && "bg-muted/30",
                "hover:bg-muted/20"
              )}
            >
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <span 
                  className={cn(
                    "text-xs sm:text-sm font-medium w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full",
                    !isCurrentMonth && "text-muted-foreground",
                    isToday && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-0.5 sm:space-y-1 max-h-[40px] sm:max-h-[60px] lg:max-h-[80px] overflow-hidden">
                {/* Mobile: show dots only */}
                <div className="sm:hidden flex flex-wrap gap-0.5">
                  {dayTasks.slice(0, 3).map((task) => (
                    <button
                      key={task._id}
                      onClick={() => handleTaskClick(task)}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        task.status === 'completed' ? "bg-green-500" :
                        task.status === 'in-progress' ? "bg-blue-500" :
                        task.status === 'delayed' ? "bg-red-500" :
                        "bg-yellow-500"
                      )}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <span className="text-[8px] text-muted-foreground">+{dayTasks.length - 3}</span>
                  )}
                </div>
                {/* Desktop: show full events */}
                <div className="hidden sm:block">
                  {dayTasks.slice(0, 3).map((task) => (
                    <CalendarEvent 
                      key={task._id} 
                      task={task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <button className="text-xs text-muted-foreground hover:text-primary">
                      +{dayTasks.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
