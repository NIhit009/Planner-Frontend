'use client';

import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  FileText,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { getTaskStats, getIssueStats } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export function AdminDashboard() {
  const { 
    clients, 
    tasks, 
    issues, 
    bulkRequests,
    setIsTaskModalOpen,
    setIsBulkRequestModalOpen
  } = useAppStore();
  
  const taskStats = getTaskStats();
  const issueStats = getIssueStats();
  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;
  
  const activeClients = clients.filter(c => c.status === 'active').length;
  const pendingRequests = bulkRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage all clients and track progress</p>
        </div>
        <Button onClick={() => setIsTaskModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Clients</p>
                <p className="text-lg sm:text-2xl font-bold">{activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-lg sm:text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-yellow-500/10 rounded-xl">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-lg sm:text-2xl font-bold">{taskStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-500/10 rounded-xl">
                <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Open Issues</p>
                <p className="text-lg sm:text-2xl font-bold">{issueStats.pending + issueStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Client List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Client Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => {
                const clientTasks = tasks.filter(t => t.clientId === client.accountId._id);
                const completed = clientTasks.filter(t => t.status === 'completed').length;
                const progress = clientTasks.length > 0 
                  ? Math.round((completed / clientTasks.length) * 100) 
                  : 0;
                
                return (
                  <div key={client.accountId._id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {client.accountId.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{client.accountId.fullName}</p>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          client.status === 'active' 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        )}>
                          {client.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{client.companyName}</p>
                      <div className="flex items-center gap-3">
                        <Progress value={progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium w-10">{progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Requests & Issues */}
        <div className="space-y-6">
          {/* Bulk Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pending Requests
                </span>
                <span className="text-sm font-normal bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  {pendingRequests}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bulkRequests.filter(r => r.status === 'pending').map((request) => {
                  const client = clients.find(c => c.accountId._id === request.clientId);
                  return (
                    <div key={request.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{client?.accountId.fullName}</p>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                          {request.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {request.quantity} items requested
                      </p>
                    </div>
                  );
                })}
                {pendingRequests === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending requests
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recent Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issues.filter(i => i.status !== 'resolved').slice(0, 3).map((issue) => {
                  const client = clients.find(c => c.accountId._id === issue.clientId);
                  return (
                    <div key={issue.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{issue.title}</p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded capitalize",
                          issue.priority === 'high' ? "bg-red-100 text-red-700" :
                          issue.priority === 'medium' ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {issue.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{client?.accountId.fullName}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function ClientDashboard() {
  const { 
    selectedClientId, 
    clients, 
    tasks, 
    issues,
    setIsTaskModalOpen,
    setIsBulkRequestModalOpen
  } = useAppStore();
  
  const client = clients.find(c => c.accountId._id === selectedClientId);
  const clientTasks = tasks.filter(t => t.clientId === selectedClientId);
  const clientIssues = issues.filter(i => i.clientId === selectedClientId);
  
  const completed = clientTasks.filter(t => t.status === 'completed').length;
  const pending = clientTasks.filter(t => t.status === 'pending').length;
  const inProgress = clientTasks.filter(t => t.status === 'in-progress').length;
  const delayed = clientTasks.filter(t => t.status === 'delayed').length;
  
  const progress = clientTasks.length > 0 
    ? Math.round((completed / clientTasks.length) * 100) 
    : 0;
  
  // Calculate total views
  const totalTargetViews = clientTasks.reduce((sum, t) => sum + t.targetViews, 0);
  const totalAchievedViews = clientTasks.reduce((sum, t) => sum + t.achievedViews, 0);
  const viewProgress = totalTargetViews > 0 
    ? Math.round((totalAchievedViews / totalTargetViews) * 100) 
    : 0;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome, {client?.accountId.fullName}</h1>
          <p className="text-sm text-muted-foreground">{client?.companyName}</p>
        </div>
        <Button onClick={() => setIsBulkRequestModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Request Work
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                <p className="text-lg sm:text-2xl font-bold">{completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">In Progress</p>
                <p className="text-lg sm:text-2xl font-bold">{inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-yellow-500/10 rounded-xl">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                <p className="text-lg sm:text-2xl font-bold">{pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-500/10 rounded-xl">
                <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Delayed</p>
                <p className="text-lg sm:text-2xl font-bold">{delayed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      className="text-muted"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      strokeDasharray={`${progress * 3.52} 352`}
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">{progress}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {completed} of {clientTasks.length} tasks completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Target Views</span>
                  <span className="font-medium">{totalTargetViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Achieved Views</span>
                  <span className="font-medium">{totalAchievedViews.toLocaleString()}</span>
                </div>
                <Progress value={viewProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {viewProgress}% of target reached
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-3">Task Breakdown</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Video', count: clientTasks.filter(t => t.type === 'video').length, color: 'bg-blue-500' },
                    { label: 'Banner', count: clientTasks.filter(t => t.type === 'banner').length, color: 'bg-orange-500' },
                    { label: 'Image', count: clientTasks.filter(t => t.type === 'image').length, color: 'bg-green-500' },
                    { label: 'Website', count: clientTasks.filter(t => t.type === 'website').length, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <span className={cn("w-3 h-3 rounded", item.color)} />
                      <span className="flex-1 text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientTasks.slice(0, 5).map((task) => (
              <div key={task._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    task.status === 'completed' ? "bg-green-500" :
                    task.status === 'in-progress' ? "bg-blue-500" :
                    task.status === 'delayed' ? "bg-red-500" :
                    "bg-yellow-500"
                  )} />
                  <div>
                    <p className="font-medium text-sm">{task.name}</p>
                    <p className="text-xs text-muted-foreground">{task.deadline}</p>
                  </div>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded capitalize",
                  task.status === 'completed' ? "bg-green-100 text-green-700" :
                  task.status === 'in-progress' ? "bg-blue-100 text-blue-700" :
                  task.status === 'delayed' ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                )}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
