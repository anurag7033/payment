import { getCustomers } from '@/app/lib/db';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import WhatsAppAction from '@/components/WhatsAppAction';
import DeleteCustomerAction from '@/components/DeleteCustomerAction';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Manage Customers</h1>
          <p className="text-sm text-muted-foreground">View and manage all repair records in your shop.</p>
        </div>
        <Button asChild className="rounded-full shadow-md">
          <Link href="/admin/customers/new">
            <Plus className="w-4 h-4 mr-2" /> New Customer
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-muted/10">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Filter records..." className="pl-10 h-10 rounded-lg bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">
              <Filter className="w-4 h-4 mr-2" /> Status
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer / Device</TableHead>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Repair Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total Charges</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers registered yet.
                </TableCell>
              </TableRow>
            ) : (
              customers.slice().reverse().map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{customer.name}</span>
                      <span className="text-xs text-muted-foreground">{customer.deviceModel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-[11px] bg-muted px-1.5 py-0.5 rounded border">{customer.trackingId}</code>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className="rounded-full px-3 text-[10px] font-bold uppercase tracking-wider"
                      variant={
                        customer.repairStatus === 'Completed' ? 'default' : 
                        customer.repairStatus === 'In Progress' ? 'secondary' : 'outline'
                      }
                    >
                      {customer.repairStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={cn(
                        "rounded-full px-3 text-[10px] font-bold uppercase tracking-wider border-none",
                        customer.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {customer.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    ₹{customer.estimatedCharges.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <WhatsAppAction customerId={customer.id} />
                      <Button asChild variant="ghost" size="icon" title="View Tracking Page">
                        <Link href={`/track/${customer.trackingId}`} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                      <DeleteCustomerAction customerId={customer.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
