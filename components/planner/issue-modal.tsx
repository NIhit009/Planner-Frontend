'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Issue } from '@/lib/mock-data';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-500' },
];

export function IssueModal() {
  const { 
    isIssueModalOpen, 
    setIsIssueModalOpen,
    selectedIssue,
    setSelectedIssue,
    selectedClientId,
    viewMode,
    tasks,
    addIssue,
    updateIssue
  } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskId: '',
    priority: 'medium' as Issue['priority'],
    status: 'pending' as Issue['status'],
  });
  
  const clientTasks = tasks.filter(t => 
    viewMode === 'client' ? t.clientId === selectedClientId : true
  );
  
  useEffect(() => {
    if (selectedIssue) {
      setFormData({
        title: selectedIssue.title,
        description: selectedIssue.description,
        taskId: selectedIssue.taskId || '',
        priority: selectedIssue.priority,
        status: selectedIssue.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        taskId: '',
        priority: 'medium',
        status: 'pending',
      });
    }
  }, [selectedIssue]);
  
  const handleClose = () => {
    setIsIssueModalOpen(false);
    setSelectedIssue(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIssue) {
      updateIssue(selectedIssue.id, {
        ...formData,
        resolvedAt: formData.status === 'resolved' ? format(new Date(), 'yyyy-MM-dd') : undefined,
      });
    } else {
      const newIssue: Issue = {
        id: `issue-${Date.now()}`,
        clientId: selectedClientId || 'client-1',
        taskId: formData.taskId || undefined,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      };
      addIssue(newIssue);
    }
    
    handleClose();
  };

  return (
    <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedIssue ? 'Edit Issue' : 'Report an Issue'}</DialogTitle>
          <DialogDescription>
            {selectedIssue 
              ? 'Update the issue details below.'
              : 'Describe your issue and we&apos;ll work on resolving it.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
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
              placeholder="Provide more details about the issue..."
              rows={4}
              required
            />
          </div>
          
          {/* Related Task */}
          <div className="space-y-2">
            <Label>Related Task (Optional)</Label>
            <Select 
              value={formData.taskId} 
              onValueChange={(value) => setFormData({ ...formData, taskId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a related task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {clientTasks.map((task) => (
                  <SelectItem key={task._id} value={task._id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Priority & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: Issue['priority']) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
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
            
            {selectedIssue && viewMode === 'admin' && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: Issue['status']) => setFormData({ ...formData, status: value })}
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
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {selectedIssue ? 'Update Issue' : 'Submit Issue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
