import { getCustomerById } from '@/app/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  
  if (!customer) {
    return new Response('Not Found', { status: 404 });
  }

  const partsList = customer.repairedParts 
    ? customer.repairedParts.split(/[\n,]/).map(p => p.trim()).filter(p => p !== "")
    : ["No parts listed"];

  const remaining = customer.estimatedCharges - (customer.paidAmount || 0);

  const html = `
    <html>
      <head>
        <title>Invoice - ${customer.trackingId}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 40px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #5595D3; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-weight: 800; font-size: 24px; color: #5595D3; }
          .invoice-info { text-align: right; }
          .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .label { font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
          td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .summary { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; font-size: 14px; }
          .total-row { font-size: 18px; font-weight: 800; color: #5595D3; margin-top: 8px; }
          .footer { margin-top: 100px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">FixFlow Pro</div>
          <div class="invoice-info">
            <div style="font-weight: 700;">INVOICE</div>
            <div>#INV-${customer.trackingId}</div>
            <div style="color: #64748b; font-size: 12px;">Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="grid">
          <div>
            <div class="label">Bill To</div>
            <div style="font-weight: 700;">${customer.name}</div>
            <div style="font-size: 14px; color: #475569;">${customer.phoneNumber}</div>
          </div>
          <div>
            <div class="label">Device Info</div>
            <div style="font-weight: 700;">${customer.deviceModel}</div>
            <div style="font-size: 14px; color: #475569;">Tracking ID: ${customer.trackingId}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Parts Replaced</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Repair Service: ${customer.issueDescription}</td>
              <td>
                <ul style="padding-left: 16px; margin: 0;">
                  ${partsList.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </td>
              <td style="text-align: right;">₹${customer.estimatedCharges.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary">
          <div>Total Charges: ₹${customer.estimatedCharges.toFixed(2)}</div>
          <div style="color: #10b981;">Amount Paid: ₹${(customer.paidAmount || 0).toFixed(2)}</div>
          <div class="total-row">Remaining Due: ₹${remaining.toFixed(2)}</div>
        </div>

        <div class="footer">
          <p>Thank you for your business! FixFlow Pro Repair Systems</p>
          <p>Support: +91 800-FIX-FLOW | Web: www.fixflowpro.com</p>
        </div>
        <script>window.print();</script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
