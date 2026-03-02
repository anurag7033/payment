'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Loader2, Save, Wallet, Zap, Link as LinkIcon, CreditCard } from 'lucide-react';
import { updateCustomerAction, generatePaymentLinkAction } from '@/app/lib/actions';
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
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    repairStatus: customer.repairStatus,
    paymentStatus: customer.paymentStatus,
    estimatedCharges: customer.estimatedCharges,
    paidAmount: customer.paidAmount || 0,
    repairedParts: customer.repairedParts,
    paymentLink: customer.paymentLink || '',
  });

  const handleGenerateLink = async () => {
    const remaining = formData.estimatedCharges - formData.paidAmount;
    if (remaining <= 0) {
      toast({
        title: "No Balance",
        description: "Cannot generate a link for zero balance.",
      });
      return;
    }

    setIsGeneratingLink(true);
    try {
      const link = await generatePaymentLinkAction(customer.name, remaining, customer.trackingId);
      setFormData({ ...formData, paymentLink: link });
      toast({
        title: "Razorpay Link Generated",
        description: "Updated automated payment link for balance.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate Razorpay link.",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

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
        router.refresh();
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
            Change the status for {customer.name}&apos;s {customer.deviceModel}.
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
                  <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCharges">Total Total (₹)</Label>
              <Input 
                id="estimatedCharges" 
                type="number" 
                value={formData.estimatedCharges}
                onChange={(e) => setFormData({ ...formData, estimatedCharges: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidAmount">Paid (₹)</Label>
              <Input 
                id="paidAmount" 
                type="number" 
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="paymentLink" className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Razorpay Link
              </Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] text-primary hover:bg-primary/10 font-bold"
                onClick={handleGenerateLink}
                disabled={isGeneratingLink}
              >
                {isGeneratingLink ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
                Auto-Generate Link
              </Button>
            </div>
            <Input 
              id="paymentLink" 
              value={formData.paymentLink}
              onChange={(e) => setFormData({ ...formData, paymentLink: e.target.value })}
              placeholder="https://rzp.io/l/..."
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
