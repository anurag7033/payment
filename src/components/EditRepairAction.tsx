'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Loader2, Save } from 'lucide-react';
import { updateCustomerAction } from '@/app/lib/actions';
import { CustomerRecord } from '@/app/lib/db';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

export default function EditRepairAction({ customer }: { customer: CustomerRecord }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    repairStatus: customer.repairStatus,
    paymentStatus: customer.paymentStatus,
    estimatedCharges: customer.estimatedCharges,
    repairedParts: customer.repairedParts,
    paymentLink: customer.paymentLink || '',
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateCustomerAction(customer.id, formData);
      if (result.success) {
        toast({
          title: "Updated",
          description: "Repair record has been successfully updated.",
        });
        setOpen(false);
        router.refresh(); // Force refresh to update dashboard stats
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update record.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Edit Repair Status">
          <Edit2 className="w-4 h-4 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Repair Progress</DialogTitle>
          <DialogDescription>
            Change the status of the repair for {customer.name}&apos;s {customer.deviceModel}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="repairStatus">Repair Status</Label>
              <Select 
                value={formData.repairStatus} 
                onValueChange={(val: any) => setFormData({ ...formData, repairStatus: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(val: any) => setFormData({ ...formData, paymentStatus: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedCharges">Charges (₹)</Label>
            <Input 
              id="estimatedCharges" 
              type="number" 
              value={formData.estimatedCharges}
              onChange={(e) => setFormData({ ...formData, estimatedCharges: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repairedParts">Parts Replaced (List)</Label>
            <Textarea 
              id="repairedParts" 
              value={formData.repairedParts}
              onChange={(e) => setFormData({ ...formData, repairedParts: e.target.value })}
              placeholder="Enter parts line by line..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentLink">Payment Link (Optional)</Label>
            <Input 
              id="paymentLink" 
              value={formData.paymentLink}
              onChange={(e) => setFormData({ ...formData, paymentLink: e.target.value })}
              placeholder="UPI or Payment URL"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
