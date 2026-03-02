'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Loader2, Save, Wallet, Zap, Link as LinkIcon } from 'lucide-react';
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
        description: "Cannot generate a link for zero or negative balance.",
      });
      return;
    }

    setIsGeneratingLink(true);
    try {
      const link = await generatePaymentLinkAction(customer.name, remaining, customer.trackingId);
      setFormData({ ...formData, paymentLink: link });
      toast({
        title: "Link Generated",
        description: "Automated payment link updated for balance.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate link.",
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
              <Label htmlFor="paidAmount" className="flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Paid (₹)
              </Label>
              <Input 
                id="paidAmount" 
                type="number" 
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
              />
            </div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="paymentLink" className="flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Payment Link
              </Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] text-amber-700 hover:text-amber-800 hover:bg-amber-100 font-bold"
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
