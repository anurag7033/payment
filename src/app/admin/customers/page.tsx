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
  ExternalLink,
  X,
  Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import WhatsAppAction from '@/components/WhatsAppAction';
import DeleteCustomerAction from '@/components/DeleteCustomerAction';
import EditRepairAction from '@/components/EditRepairAction';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export const dynamic = 'force-dynamic';

export default async function CustomersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const repairStatusFilter = params.repairStatus as string;
  const paymentStatusFilter = params.paymentStatus as string;
  const searchQuery = params.search as string;

  let customers = await getCustomers();

  // Apply Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.deviceModel.toLowerCase().includes(q) || 
      c.trackingId.toLowerCase().includes(q)
    );
  }

  // Apply Filters
  if (repairStatusFilter) {
    customers = customers.filter(c => c.repairStatus === repairStatusFilter);
  }
  if (paymentStatusFilter) {
    customers = customers.filter(c => c.paymentStatus === paymentStatusFilter);
  }

  const hasFilters = repairStatusFilter || paymentStatusFilter || searchQuery;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Manage Customers</h1>
          <p className="text-sm text-muted-foreground">View and manage all repair records in your shop.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link href="/admin/customers">
                <X className="w-4 h-4 mr-2" /> Clear All
              </Link>
            </Button>
          )}
          <Button asChild className="rounded-full shadow-md">
            <Link href="/admin/customers/new">
              <Plus className="w-4 h-4 mr-2" /> New Customer
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 justify-between bg-muted/10">
          <form className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              name="search"
              defaultValue={searchQuery}
              placeholder="Search name, device or ID..." 
              className="pl-10 h-10 rounded-lg bg-white" 
            />
          </form>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Filter className="w-4 h-4 mr-2" /> Filter Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Results</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Repair Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {['Pending', 'In Progress', 'Completed'].map((status) => (
                      <DropdownMenuItem key={status} asChild>
                        <Link href={`/admin/customers?repairStatus=${status}${paymentStatusFilter ? `&paymentStatus=${paymentStatusFilter}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`} className="flex items-center justify-between">
                          {status}
                          {repairStatusFilter === status && <Check className="w-4 h-4" />}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Payment Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {['Unpaid', 'Partially Paid', 'Paid'].map((status) => (
                      <DropdownMenuItem key={status} asChild>
                        <Link href={`/admin/customers?paymentStatus=${status}${repairStatusFilter ? `&repairStatus=${repairStatusFilter}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`} className="flex items-center justify-between">
                          {status}
                          {paymentStatusFilter === status && <Check className="w-4 h-4" />}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                  <Link href="/admin/customers">Clear Filters</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {hasFilters && (
          <div className="px-4 py-2 bg-primary/5 border-b flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mr-2">Active Filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="bg-white border text-xs">Search: {searchQuery}</Badge>
            )}
            {repairStatusFilter && (
              <Badge variant="secondary" className="bg-white border text-xs">Status: {repairStatusFilter}</Badge>
            )}
            {paymentStatusFilter && (
              <Badge variant="secondary" className="bg-white border text-xs">Payment: {paymentStatusFilter}</Badge>
            )}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer / Device</TableHead>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Repair Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Balance (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {hasFilters ? "No customers match the current criteria." : "No customers registered yet."}
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
                        customer.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-700" : 
                        customer.paymentStatus === 'Partially Paid' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {customer.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="flex flex-col">
                      <span className="text-emerald-600">Paid: ₹{customer.paidAmount?.toFixed(2) || '0.00'}</span>
                      <span className="text-[10px] text-muted-foreground">Due: ₹{(customer.estimatedCharges - (customer.paidAmount || 0)).toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditRepairAction customer={customer} />
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
