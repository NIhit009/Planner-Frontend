import { create } from 'zustand';
import {
  clients,
  tasks,
  issues,
  bulkRequests,
  type Client,
  type Task,
  type Issue,
  type BulkRequest
} from './mock-data';

import { apiClient } from './API_Client';
import { resolveNaptr } from 'dns';

interface CalendarFilter {
  id: string;
  name: string;
  emoji: string;
  color: string;
  enabled: boolean;
}

interface AppState {
  // View mode
  viewMode: string;
  setViewMode: (mode: string) => void;

  //Logged In Role
  LoggedInRole: string,
  setLoggedInRole: (mode: string) => void;

  // LoggedIn
  isLoggedIn: boolean,
  setIsLoggedIn: (loggedIn: boolean) => void

  // Selected client (for client view)
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;

  // Calendar view
  calendarView: 'day' | 'week' | 'month';
  setCalendarView: (view: 'day' | 'week' | 'month') => void;

  // Current date
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  // Calendar filters
  calendarFilters: CalendarFilter[];
  toggleCalendarFilter: (id: string) => void;

  // Category filters
  categoryFilters: { id: string; name: string; color: string; enabled: boolean }[];
  toggleCategoryFilter: (id: string) => void;

  // Data
  clients: Client[];
  tasks: Task[];
  issues: Issue[];
  bulkRequests: BulkRequest[];

  // Actions
  fetchInitialData: () => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  addBulkRequest: (request: BulkRequest) => void;
  updateBulkRequest: (id: string, updates: Partial<BulkRequest>) => void;

  // Modal states
  isCreateClientOpen: boolean,
  setIsCreateClientOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  isIssueModalOpen: boolean;
  setIsIssueModalOpen: (open: boolean) => void;
  selectedIssue: Issue | null;
  setSelectedIssue: (issue: Issue | null) => void;

  isBulkRequestModalOpen: boolean;
  setIsBulkRequestModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // View mode
  viewMode: 'admin',
  setViewMode: (mode) => set({ viewMode: mode }),

  //Logged In Role
  LoggedInRole: '',
  setLoggedInRole: (mode) => set({LoggedInRole: mode}),

  isLoggedIn: false,
  setIsLoggedIn: (loggedIn) => set({isLoggedIn: loggedIn}),
  // Selected client
  selectedClientId: '',
  setSelectedClientId: (id) => set({ selectedClientId: id }),

  // Calendar view
  calendarView: 'month',
  setCalendarView: (view) => set({ calendarView: view }),

  // Current date
  currentDate: new Date(2026, 3, 21), // August 9, 2023
  setCurrentDate: (date) => set({ currentDate: date }),

  // Calendar filters (My Calendars)
  calendarFilters: [
    { id: 'client-1', name: 'Esther Howard', emoji: '😊', color: 'bg-yellow-400', enabled: true },
    { id: 'client-2', name: 'Jacob Jones', emoji: '🎯', color: 'bg-red-400', enabled: true },
    { id: 'client-3', name: 'Brooklyn Simmons', emoji: '🔥', color: 'bg-orange-400', enabled: true },
    { id: 'client-4', name: 'Cameron Williamson', emoji: '🎉', color: 'bg-purple-400', enabled: false },
  ],
  toggleCalendarFilter: (id) => set((state) => ({
    calendarFilters: state.calendarFilters.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    )
  })),

  // Category filters
  categoryFilters: [
    { id: 'video', name: 'Video', color: 'bg-blue-500', enabled: true },
    { id: 'banner', name: 'Banner', color: 'bg-orange-500', enabled: true },
    { id: 'image', name: 'Image', color: 'bg-green-500', enabled: true },
    { id: 'website', name: 'Website', color: 'bg-purple-500', enabled: true },
  ],
  toggleCategoryFilter: (id) => set((state) => ({
    categoryFilters: state.categoryFilters.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    )
  })),

  // Data
  clients,
  tasks,
  issues,
  bulkRequests,

  // Actions
  fetchInitialData: async () => {
    try {
      const [taskRes, clientRes] = await Promise.all([
        apiClient.get("/tasks/getTasks"),
        apiClient.get("/clients/clients") 
      ]);

      const taskData = taskRes.data;
      const clientData = clientRes.data;
      console.log(taskData);

      const fetchedClients = clientData.clients || [];

      set({
        tasks: taskData.tasks || [],
        clients: fetchedClients,
        // Map clients to calendar filters dynamically
        calendarFilters: fetchedClients.map((c: any) => ({
          id: c._id,
          name: c.companyName || 'Unknown Client',
          emoji: '👤',
          color: 'bg-primary',
          enabled: true
        }))
      });
    } catch (err) {
      console.error("Error fetching initial data", err);
    }
  },

  addTask: async (task) => {
    try {
      const response = await apiClient.post("/tasks/addTasks", task);
      const result = response.data;
      console.log(result)
      if (response.status !== 200) throw new Error('Add task failed');
      const newTask = result.task;
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    }
    catch (err) {
      console.log("Error adding Tasks", err)
    }
  },
  updateTask: async (id, updates) => {
    try {
      const response = await apiClient.patch(`/tasks/updateTasks/${id}`, updates)
      const result = response.data;
      console.log(result);
      if (response.status !== 200) throw new Error("Update Task failed");
      const updatedTask = result.updatedTask;
      set((state) => ({
      tasks: state.tasks.map(t => t._id === id ? { ...t, ...updatedTask } : t)
    }))
    } catch (error) {
      console.log(error);
    }

  },
  addIssue: (issue) => set((state) => ({ issues: [...state.issues, issue] })),
  updateIssue: (id, updates) => set((state) => ({
    issues: state.issues.map(i => i.id === id ? { ...i, ...updates } : i)
  })),
  addBulkRequest: (request) => set((state) => ({
    bulkRequests: [...state.bulkRequests, request]
  })),
  updateBulkRequest: (id, updates) => set((state) => ({
    bulkRequests: state.bulkRequests.map(r => r.id === id ? { ...r, ...updates } : r)
  })),

  // Modal states
  isCreateClientOpen: false,
  setIsCreateClientOpen : (open) => set({isCreateClientOpen: open}),
  isTaskModalOpen: false,
  setIsTaskModalOpen: (open) => set({ isTaskModalOpen: open }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),

  isIssueModalOpen: false,
  setIsIssueModalOpen: (open) => set({ isIssueModalOpen: open }),
  selectedIssue: null,
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),

  isBulkRequestModalOpen: false,
  setIsBulkRequestModalOpen: (open) => set({ isBulkRequestModalOpen: open }),
}));
