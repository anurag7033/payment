'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2, Send } from 'lucide-react';
import { getWhatsAppPreview } from '@/app/lib/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function WhatsAppAction({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ message: string; phone: string } | null>(null);
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await getWhatsAppPreview(customerId);
      if (data) {
        setPreview(data);
        setOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate preview for this customer."
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Flow Error",
        description: "Failed to generate personalized message."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!preview) return;
    const encodedMsg = encodeURIComponent(preview.message);
    const whatsappUrl = `https://wa.me/${preview.phone}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank');
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        disabled={loading}
        onClick={handleGenerate}
        title="Send WhatsApp Message"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              WhatsApp AI Preview
            </DialogTitle>
            <DialogDescription>
              We've personalized this message using AI. You can edit it before sending.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              className="min-h-[200px] text-sm bg-muted/30 font-body leading-relaxed"
              value={preview?.message || ''}
              onChange={(e) => setPreview(prev => prev ? { ...prev, message: e.target.value } : null)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" /> Open WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
