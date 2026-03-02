'use client';

import { getCustomerAction } from '@/app/lib/actions';
import { CustomerRecord } from '@/app/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Download,
  Loader2,
  Check,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import RepairTimeline from '@/components/RepairTimeline';
import { use, useEffect, useState } from 'react';

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [customer, setCustomer] = useState<CustomerRecord | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // We must use a server action to fetch the data from the server's memory
      const data = await getCustomerAction(resolvedParams.id);
      setCustomer(data || null);
      setLoading(false);
    }
    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECF2F9]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#ECF2F9]">
        <h1 className="text-4xl font-bold mb-4">No Record Found</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Sorry, we couldn't find a repair record for the tracking ID: <span className="font-bold text-foreground">"{resolvedParams.id}"</span>. 
          Please double-check the ID and try again.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/track">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Tracking
          </Link>
        </Button>
      </div>
    );
  }

  const isCompleted = customer.repairStatus === 'Completed';
  const isPaid = customer.paymentStatus === 'Paid';

  const partsList = customer.repairedParts 
    ? customer.repairedParts.split(/[\n,]/).map(p => p.trim()).filter(p => p !== "")
    : [];

  return (
    <div className="min-h-screen bg-[#ECF2F9] py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3 h-3" /> Secure Status Page
          </div>
          <h1 className="text-3xl font-headline font-bold">FixFlow Tracking</h1>
          <p className="text-muted-foreground">ID: <code className="bg-white px-2 py-0.5 rounded border">{customer.trackingId}</code></p>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className={cn(
            "text-white pb-8",
            isCompleted ? "bg-emerald-500" : "bg-primary"
          )}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{customer.deviceModel}</CardTitle>
                <CardDescription className="text-white/80">Owner: {customer.name}</CardDescription>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 -mt-6 bg-white rounded-t-3xl relative">
            <div className="space-y-8">
              <RepairTimeline status={customer.repairStatus} />

              <div className="grid grid-cols-1 gap-6 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight mb-2">Original Issue</p>
                  <p className="text-sm font-medium p-4 bg-muted/20 rounded-xl border border-dashed">{customer.issueDescription}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight mb-2">Parts Replaced</p>
                  {partsList.length > 0 ? (
                    <ul className="space-y-2">
                      {partsList.map((part, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm font-medium bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                          <Check className="w-3 h-3 text-emerald-600" /> {part}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No parts listed yet.</p>
                  )}
                </div>
              </div>

              {isCompleted && !isPaid && (
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center text-center space-y-4">
                  <div className="space-y-1">
                    <p className="text-amber-600 font-bold text-lg">Repair Completed!</p>
                    <p className="text-sm text-amber-800/80">Your device is ready for pickup. Please settle the remaining charges.</p>
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    ₹{customer.estimatedCharges.toFixed(2)}
                  </div>
                  {customer.paymentLink ? (
                    <Button className="w-full py-6 text-lg rounded-2xl shadow-lg shadow-primary/20" asChild>
                      <Link href={customer.paymentLink} target="_blank">
                        Pay Online <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground bg-white/50 p-2 rounded-lg border">Please visit the shop to complete payment.</p>
                  )}
                </div>
              )}

              {isPaid && (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-emerald-700 font-bold text-xl">Payment Successful</p>
                    <p className="text-sm text-emerald-800/60">Thank you for choosing FixFlow Pro.</p>
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <Button variant="outline" className="w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-100" asChild>
                      <Link href={`/api/invoice/${customer.id}`}>
                        <FileText className="w-4 h-4 mr-2" /> View Invoice
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full text-emerald-700 hover:bg-emerald-50" asChild>
                      <Link href={`/api/invoice/${customer.id}?download=true`}>
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {!isCompleted && (
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(customer.createdAt).toLocaleDateString()} at {new Date(customer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-xs pb-12">
          FixFlow Pro &copy; {new Date().getFullYear()} • Secure Repair Management System
        </p>
      </div>
    </div>
  );
}
