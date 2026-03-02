import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  TrendingUp, 
  Smartphone,
  MoreVertical
} from 'lucide-react';
import { getCustomers } from '../lib/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboard() {
  const customers = await getCustomers();
  
  const totalCustomers = customers.length;
  const pendingPayments = customers.filter(c => c.paymentStatus === 'Unpaid').length;
  const completedRepairs = customers.filter(c => c.repairStatus === 'Completed').length;
  const totalEarnings = customers
    .filter(c => c.paymentStatus === 'Paid')
    .reduce((sum, c) => sum + c.estimatedCharges, 0);

  const stats = [
    { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Payments', value: pendingPayments, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed Repairs', value: completedRepairs, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Earnings', value: `₹${totalEarnings}`, icon: IndianRupee, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, here's what's happening with FixFlow today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="flex items-center text-xs text-emerald-600 font-medium">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-headline font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
            <CardTitle className="text-lg">Recent Repairs</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {customers.slice(0, 5).map((customer) => (
                <div key={customer.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.deviceModel} • {customer.trackingId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={customer.repairStatus === 'Completed' ? 'default' : 'secondary'} className="rounded-full px-3">
                      {customer.repairStatus}
                    </Badge>
                    <p className="text-sm font-bold">₹{customer.estimatedCharges}</p>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Quick Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 mb-6">Received a new device for repair? Start the flow quickly.</p>
              <Button asChild variant="secondary" className="w-full shadow-lg">
                <Link href="/admin/customers/new">New Customer Intake</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Database Sync</span>
                <span className="text-emerald-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">WhatsApp API</span>
                <span className="text-emerald-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage (92%)</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[92%]"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
