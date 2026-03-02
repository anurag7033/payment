import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smartphone, Settings, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3">
        <Smartphone className="text-primary-foreground w-8 h-8" />
      </div>
      <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 text-foreground tracking-tight">
        FixFlow <span className="text-secondary">Pro</span>
      </h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        The ultimate management system for modern mobile repair shops. Professional, reliable, and clear.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Button asChild size="lg" className="rounded-full px-8 shadow-md">
          <Link href="/login" className="flex items-center gap-2">
            Admin Login <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link href="/track" className="flex items-center gap-2">
            Track Device
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl w-full">
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Settings className="text-primary w-6 h-6" />
          </div>
          <h3 className="font-bold mb-2">Efficient Ops</h3>
          <p className="text-sm text-muted-foreground">Streamlined repair tracking from intake to completion.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="text-secondary w-6 h-6" />
          </div>
          <h3 className="font-bold mb-2">Client Transparency</h3>
          <p className="text-sm text-muted-foreground">Unique tracking links for every customer to see real-time progress.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="text-green-600 w-6 h-6" />
          </div>
          <h3 className="font-bold mb-2">Secure Payments</h3>
          <p className="text-sm text-muted-foreground">Integrated external payment links and automated invoicing.</p>
        </div>
      </div>
    </div>
  );
}
