'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    CheckCircle2,
    Search,
    Calendar as CalendarIcon,
    ArrowUpDown,
    MoreVertical,
} from 'lucide-react';
import {
    format,
    isWithinInterval,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subDays,
    isSameDay
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/API_Client';
import { BASE_URL } from '@/lib/Base_url';

// Mock Data
// const MOCK_COMPLETED_TASKS = [
//     { id: '1', title: 'Design System Update', category: 'Work', completedAt: new Date(), color: 'bg-blue-500' },
//     { id: '2', title: 'Client Onboarding', category: 'Admin', completedAt: subDays(new Date(), 2), color: 'bg-purple-500' },
//     { id: '3', title: 'Monthly Billing', category: 'Finance', completedAt: subDays(new Date(), 10), color: 'bg-emerald-500' },
//     { id: '4', title: 'Gym Session', category: 'Personal', completedAt: subDays(new Date(), 1), color: 'bg-orange-500' },
// ];

type FilterRange = 'all' | 'today' | 'week' | 'month';

export function CompletedTasks() {
    const [filter, setFilter] = useState<FilterRange>('all');
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterData, setFilterData] = useState<number | undefined>(undefined);
    useEffect(() => {
        const getFilteredTasks = async (date: number | undefined) => {
            try {
                const response = await apiClient.get(`${BASE_URL}/tasks/getFinishedTasks?date=${date}`);
                const result = response.data;
                if (!result.success) {
                    throw new Error("Error Occured..")
                }
                console.log(result)
                console.log(result.tasks);
                setFilteredTasks(result.tasks)
            }
            catch(err){
                console.log(err);
            }

        }
        getFilteredTasks(filterData);
    }, [filter])
    function findFilter(filter: FilterRange) {
        switch (filter) {
            case "all":
                setFilterData(undefined);
                break;
            case "today":
                setFilterData(0);
                break;
            case "week":
                setFilterData(7);
                break;
            case "month":
                setFilterData(30);
                break;
        }
        setFilter(filter);
    }

    return (
        // Changed: removed max-w-5xl, added h-full and flex column to fill screen
        <div className="flex flex-col h-full w-full bg-background">

            {/* HEADER & CONTROLS - Fixed at top */}
            <div className="p-6 space-y-6 border-b border-border bg-card/30 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                            Completed Tasks
                        </h1>
                        <p className="text-muted-foreground text-sm">Review your finished productivity milestones.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-9 bg-background border-border rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl w-fit border border-border">
                    {(['all', 'today', 'week', 'month'] as FilterRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => findFilter(range)}
                            className={cn(
                                "px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                                filter === range
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST SECTION - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm w-full">
                    {filteredTasks.length > 0 ? (
                        <div className="divide-y divide-border">
                            {filteredTasks.map((task: any) => (
                                <div
                                    key={task._id}
                                    className="group flex items-center justify-between p-5 hover:bg-muted/20 transition-colors"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Thicker status bar for desktop */}
                                        <div className={cn("w-2 h-10 rounded-full shadow-sm", task.color)} />
                                        <div>
                                            <h3 className="text-base font-semibold decoration-muted-foreground/40 text-foreground/70">
                                                {task.name}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1.5">
                                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest bg-muted/50 px-2.5 py-1 rounded-md border border-border/50">
                                                    {task.type}
                                                </span>
                                                {/* <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <CalendarIcon className="w-3.5 h-3.5" />
                                                    {format(task?.completedDate, 'MMMM d, yyyy')}
                                                </span> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                            <ArrowUpDown className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                                <CheckCircle2 className="w-8 h-8 text-muted-foreground/20" />
                            </div>
                            <h3 className="text-lg font-medium text-muted-foreground">No tasks found</h3>
                            <p className="text-sm text-muted-foreground/50 max-w-xs mx-auto">
                                We couldn't find any completed tasks for this period. Keep up the good work!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}