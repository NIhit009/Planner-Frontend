'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { getTaskStats, getIssueStats } from '@/lib/mock-data';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

export function PerformanceOverview() {
  const { tasks, clients, viewMode, selectedClientId } = useAppStore();
  
  // Filter tasks based on view mode
  const filteredTasks = viewMode === 'client' && selectedClientId
    ? tasks.filter(t => t.clientId === selectedClientId)
    : tasks;
  
  // Prepare data for views comparison
  const viewsData = filteredTasks
    .filter(t => t.targetViews > 0)
    .map(t => ({
      name: t.title.length > 15 ? t.title.substring(0, 15) + '...' : t.title,
      target: t.targetViews,
      achieved: t.achievedViews,
    }));
  
  // Task status distribution
  const statusData = [
    { name: 'Completed', value: filteredTasks.filter(t => t.status === 'completed').length },
    { name: 'In Progress', value: filteredTasks.filter(t => t.status === 'in-progress').length },
    { name: 'Pending', value: filteredTasks.filter(t => t.status === 'pending').length },
    { name: 'Delayed', value: filteredTasks.filter(t => t.status === 'delayed').length },
  ];
  
  // Task type distribution
  const typeData = [
    { name: 'Video', value: filteredTasks.filter(t => t.type === 'video').length },
    { name: 'Banner', value: filteredTasks.filter(t => t.type === 'banner').length },
    { name: 'Image', value: filteredTasks.filter(t => t.type === 'image').length },
    { name: 'Website', value: filteredTasks.filter(t => t.type === 'website').length },
  ];
  
  // Client performance (admin only)
  const clientPerformanceData = clients.map(client => {
    const clientTasks = tasks.filter(t => t.clientId === client.id);
    const completed = clientTasks.filter(t => t.status === 'completed').length;
    const total = clientTasks.length;
    
    return {
      name: client.name.split(' ')[0],
      completed,
      total,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Performance Reports</h1>
        <p className="text-sm text-muted-foreground">
          {viewMode === 'admin' ? 'Overview of all client performance' : 'Your performance metrics'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Views Comparison Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Target vs Achieved Views</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={200} className="sm:!h-[300px]">
              <BarChart data={viewsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="target" fill="#3b82f6" name="Target Views" radius={[4, 4, 0, 0]} />
                <Bar dataKey="achieved" fill="#22c55e" name="Achieved Views" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Status Distribution */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={180} className="sm:!h-[250px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-4">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded" 
                    style={{ backgroundColor: COLORS[index] }} 
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Type Distribution */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Task Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={180} className="sm:!h-[250px]">
              <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Client Performance (Admin Only) */}
        {viewMode === 'admin' && (
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Client Completion Rates</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={200} className="sm:!h-[300px]">
                <BarChart data={clientPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'rate') return [`${value}%`, 'Completion Rate'];
                      return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed Tasks" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#e5e7eb" name="Total Tasks" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
