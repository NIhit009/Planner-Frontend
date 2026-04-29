'use client';

import { useState } from 'react';
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
import type { BulkRequest } from '@/lib/mock-data';

const typeOptions = [
  { value: 'video', label: 'Video', emoji: '🎬', description: 'Promotional or explainer videos' },
  { value: 'banner', label: 'Banner', emoji: '🎨', description: 'Social media or web banners' },
  { value: 'image', label: 'Image', emoji: '📸', description: 'Product or marketing images' },
  { value: 'website', label: 'Website', emoji: '💻', description: 'Web pages or landing pages' },
];

export function BulkRequestModal() {
  const isBulkRequestModalOpen = useAppStore((state) => state.isBulkRequestModalOpen);
  const setIsBulkRequestModalOpen = useAppStore((state) => state.setIsBulkRequestModalOpen);
  const selectedClientId = useAppStore((state) => state.selectedClientId);
  const addBulkRequest = useAppStore((state) => state.addBulkRequest);
  
  const [formData, setFormData] = useState({
    type: 'banner' as BulkRequest['type'],
    quantity: 1,
    notes: '',
  });
  
  const handleClose = () => {
    setIsBulkRequestModalOpen(false);
    setFormData({ type: 'banner', quantity: 1, notes: '' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) return;
    
    const newRequest: BulkRequest = {
      id: `bulk-${Date.now()}`,
      clientId: selectedClientId,
      type: formData.type,
      quantity: formData.quantity,
      notes: formData.notes,
      status: 'pending',
      createdAt: format(new Date(), 'yyyy-MM-dd'),
    };
    
    addBulkRequest(newRequest);
    handleClose();
  };

  return (
    <Dialog open={isBulkRequestModalOpen} onOpenChange={setIsBulkRequestModalOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Work</DialogTitle>
          <DialogDescription>
            Submit a bulk request for content. Our team will review and process your request.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Type */}
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: BulkRequest['type']) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.emoji}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {typeOptions.find(t => t.value === formData.type)?.description}
            </p>
          </div>
          
          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={50}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            />
            <p className="text-xs text-muted-foreground">
              How many items do you need? (Max: 50)
            </p>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe your requirements, style preferences, or any specific details..."
              rows={4}
            />
          </div>
          
          {/* Summary */}
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Request Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{formData.quantity} items</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
