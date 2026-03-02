'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Smartphone, Search, ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TrackLandingPage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF2F9] flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-primary p-2 rounded-lg">
          <Smartphone className="text-primary-foreground w-6 h-6" />
        </div>
        <span className="text-2xl font-headline font-bold tracking-tight">FixFlow Pro</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-none rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-white pb-2 pt-8">
          <CardTitle className="text-2xl font-headline font-bold">Track Your Repair</CardTitle>
          <CardDescription>Enter your unique tracking ID to see real-time progress.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="e.g. TRK-9921-A" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="pl-10 h-14 text-lg rounded-2xl border-2 focus:border-primary transition-all"
                required
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg">
              Track Status <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Button asChild variant="ghost" className="mt-8 text-muted-foreground hover:bg-white/50 rounded-full">
        <Link href="/" className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}
