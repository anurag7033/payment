'use client';

import { createCustomerAction, generatePaymentLinkAction } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  Smartphone, 
  User, 
  IndianRupee, 
  Tag, 
  CheckCircle2, 
  Copy, 
  ArrowRight,
  Plus,
  Link as LinkIcon,
  Wrench,
  Hash,
  Wallet,
  Zap,
  Loader2,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import WhatsAppAction from '@/components/WhatsAppAction';
import { toast } from '@/hooks/use-toast';

export default function NewCustomerPage() {
  const [state, formAction, isPending] = useActionState(createCustomerAction, null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [autoPaymentLink, setAutoPaymentLink] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    estimatedCharges: 0,
    paidAmount: 0,
    trackingId: ''
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
      const link = await generatePaymentLinkAction(formData.name, remaining, formData.trackingId || 'NEW-JOB');
      setAutoPaymentLink(link);
      toast({
        title: "Razorpay Link Generated",
        description: "Automated payment link created for balance.",
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Tracking ID copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (state?.success && state.customer) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
          <div className="h-2 bg-emerald-500 w-full" />
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold">Intake Registered!</CardTitle>
            <CardDescription className="text-lg">
              Customer record created and tracking ID assigned.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="bg-muted/30 p-6 rounded-2xl border flex flex-col items-center gap-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tracking ID</p>
              <div className="flex items-center gap-3">
                <code className="text-4xl font-mono font-black text-primary tracking-tighter">
                  {state.customer.trackingId}
                </code>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard(state.customer.trackingId)}
                  className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Copy className={`w-5 h-5 ${copied ? 'text-emerald-500' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-bold uppercase">Customer</p>
                <p className="font-semibold text-lg">{state.customer.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-bold uppercase">Device</p>
                <p className="font-semibold text-lg">{state.customer.deviceModel}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm font-medium text-center text-muted-foreground">
                Would you like to notify the customer now?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold hover:bg-emerald-100 transition-colors cursor-pointer group">
                  <WhatsAppAction customerId={state.customer.id} />
                  <span>Send AI Update</span>
                </div>
                <Button asChild variant="outline" className="flex-1 h-16 rounded-2xl border-2">
                  <Link href="/admin/customers">
                    Manage All Repairs <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 p-6 flex justify-center">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/admin/customers/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Register Another Device
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href="/admin/customers">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-headline font-bold">New Repair Intake</h1>
          <p className="text-sm text-muted-foreground">Enter customer details and assign a tracking ID.</p>
        </div>
      </div>

      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Customer Info
                </CardTitle>
                <CardDescription>Primary contact details for the customer.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="e.g. Michael Scott" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" placeholder="e.g. +91 98765 43210" required />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-secondary/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-secondary" /> Device Details
                </CardTitle>
                <CardDescription>Information about the device being repaired.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceModel">Model Name</Label>
                  <Input id="deviceModel" name="deviceModel" placeholder="e.g. iPhone 14 Pro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDescription">Issue Description</Label>
                  <Textarea id="issueDescription" name="issueDescription" placeholder="Describe the problem..." required />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-blue-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-600" /> Tracking Information
                </CardTitle>
                <CardDescription>Assign a unique tracking ID for this repair.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingId">Tracking ID / Job Sheet Number</Label>
                  <Input 
                    id="trackingId" 
                    name="trackingId" 
                    placeholder="e.g. JOB-1021-A" 
                    required 
                    value={formData.trackingId}
                    onChange={(e) => setFormData({...formData, trackingId: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-muted pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5 text-muted-foreground" /> Status
                </CardTitle>
                <CardDescription>Track repair progress and payment status.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="repairStatus">Repair Status</Label>
                    <Select name="repairStatus" defaultValue="Pending">
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
                    <Label htmlFor="paymentStatus">Payment</Label>
                    <Select name="paymentStatus" defaultValue="Unpaid">
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
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-amber-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-amber-600" /> Payment & Razorpay
                </CardTitle>
                <CardDescription>Costing and automated link generation.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCharges">Estimated Total (₹)</Label>
                    <Input 
                      id="estimatedCharges" 
                      name="estimatedCharges" 
                      type="number" 
                      required 
                      value={formData.estimatedCharges || ''}
                      onChange={(e) => setFormData({...formData, estimatedCharges: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paidAmount">Paid Amount (₹)</Label>
                    <Input 
                      id="paidAmount" 
                      name="paidAmount" 
                      type="number" 
                      value={formData.paidAmount || ''}
                      onChange={(e) => setFormData({...formData, paidAmount: Number(e.target.value)})}
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
                    name="paymentLink" 
                    placeholder="https://rzp.io/l/..." 
                    value={autoPaymentLink}
                    onChange={(e) => setAutoPaymentLink(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg shadow-lg mt-4 font-bold rounded-2xl"
                  disabled={isPending}
                >
                  {isPending ? 'Registering Intake...' : 'Register Intake'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
