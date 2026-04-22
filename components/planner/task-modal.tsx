'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Clock, Calendar, User, Link2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/lib/mock-data';

const typeOptions = [
  { value: 'video', label: 'Video', emoji: '🎬' },
  { value: 'banner', label: 'Banner', emoji: '🎨' },
  { value: 'image', label: 'Image', emoji: '📸' },
  { value: 'website', label: 'Website', emoji: '💻' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'delayed', label: 'Delayed', color: 'bg-red-500' },
];

export function TaskModal() {
  const { 
    isTaskModalOpen, 
    setIsTaskModalOpen, 
    selectedTask, 
    setSelectedTask,
    clients,
    viewMode,
    selectedClientId,
    addTask,
    updateTask,
    currentDate
  } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'video' as Task['type'],
    status: 'pending' as Task['status'],
    clientId: selectedClientId || 'client-1',
    deadline: format(currentDate, 'yyyy-MM-dd'),
    startTime: '09:00am',
    driveLink: '',
    targetViews: 0,
    achievedViews: 0,
  });
  
  useEffect(() => {
    if (selectedTask) {
      setFormData({
        name: selectedTask.name,
        description: selectedTask.description,
        type: selectedTask.type,
        status: selectedTask.status,
        clientId: selectedTask.clientId,
        deadline: selectedTask.deadline,
        startTime: selectedTask.startTime || '09:00am',
        driveLink: selectedTask.driveLink || '',
        targetViews: selectedTask.targetViews,
        achievedViews: selectedTask.achievedViews,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'video',
        status: 'pending',
        clientId: viewMode === 'client' ? selectedClientId || 'client-1' : 'client-1',
        deadline: format(currentDate, 'yyyy-MM-dd'),
        startTime: '09:00am',
        driveLink: '',
        targetViews: 0,
        achievedViews: 0,
      });
    }
  }, [selectedTask, currentDate, viewMode, selectedClientId]);
  
  const handleClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedClientId);
    if (selectedTask) {
      updateTask(selectedTask._id, formData);
    } else {
      const newTask: Task = {
        _id: `task-${Date.now()}`,
        ...formData,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addTask(newTask);
    }
    
    handleClose();
  };
  
  const progressPercent = formData.targetViews > 0 
    ? Math.min(100, (formData.achievedViews / formData.targetViews) * 100)
    : 0;

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          {/* Type & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: Task['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: Task['status']) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", option.color)} />
                        <span>{option.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Client (Admin only) */}
          {viewMode === 'admin' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Client
              </Label>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.accountId._id} value={client.accountId._id}>
                      {client.accountId.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Due Date
              </Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </Label>
              <Input
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="e.g., 09:00am"
              />
            </div>
          </div>
          
          {/* Drive Link */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Drive Link
            </Label>
            <Input
              value={formData.driveLink}
              onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
              placeholder="https://drive.google.com/..."
            />
          </div>
          
          {/* Performance Metrics */}
          <div className="space-y-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="w-4 h-4" />
              Performance Tracking
            </Label>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Target Views</Label>
                <Input
                  type="number"
                  value={formData.targetViews}
                  onChange={(e) => setFormData({ ...formData, targetViews: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Achieved Views</Label>
                <Input
                  type="number"
                  value={formData.achievedViews}
                  onChange={(e) => setFormData({ ...formData, achievedViews: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
            
            {formData.targetViews > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progressPercent.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      progressPercent >= 100 ? "bg-green-500" : 
                      progressPercent >= 50 ? "bg-primary" : "bg-yellow-500"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {selectedTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
