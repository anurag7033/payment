import { createCustomerAction } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { ChevronLeft, Smartphone, User, DollarSign, Tag } from 'lucide-react';
import Link from 'next/link';

export default function NewCustomerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/customers">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-headline font-bold">New Repair Intake</h1>
      </div>

      <form action={createCustomerAction}>
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
                <Button type="submit" className="w-full h-11 text-lg shadow-lg mt-4">
                  Register Intake
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
