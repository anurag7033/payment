'use client';

import { createCustomerAction } from '@/app/lib/actions';
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
  DollarSign, 
  Tag, 
  CheckCircle2, 
  Copy, 
  MessageSquare,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import WhatsAppAction from '@/components/WhatsAppAction';
import { toast } from '@/hooks/use-toast';

export default function NewCustomerPage() {
  const [state, formAction, isPending] = useActionState(createCustomerAction, null);
  const [copied, setCopied] = useState(false);

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
              Customer record created and tracking ID generated.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="bg-muted/30 p-6 rounded-2xl border flex flex-col items-center gap-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unique Tracking ID</p>
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
          <p className="text-sm text-muted-foreground">A unique tracking ID will be generated upon registration.</p>
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
                  <Input id="name" name="name" placeholder="e.g. Michael Scott" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" placeholder="e.g. +1 234 567 890" required />
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
              <CardHeader className="bg-emerald-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-600" /> Status & Parts
                </CardTitle>
                <CardDescription>Track repair progress and replaced components.</CardDescription>
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
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repairedParts">Repaired/Replaced Parts</Label>
                  <Input id="repairedParts" name="repairedParts" placeholder="e.g. OEM Screen, Battery" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="bg-amber-50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" /> Quotation
                </CardTitle>
                <CardDescription>Costing and financial details.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCharges">Estimated Charges ($)</Label>
                  <Input id="estimatedCharges" name="estimatedCharges" type="number" step="0.01" placeholder="0.00" required />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg shadow-lg mt-4 font-bold rounded-2xl"
                  disabled={isPending}
                >
                  {isPending ? 'Registering Intake...' : 'Generate Tracking & Register'}
                </Button>
                {state?.success === false && (
                  <p className="text-sm text-destructive font-medium text-center mt-2">{state.message}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
