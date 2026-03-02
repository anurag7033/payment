# **App Name**: FixFlow Pro

## Core Features:

- Admin Authentication & Dashboard: Secure login for administrators to access a dashboard displaying key metrics like total customers, pending payments, completed repairs, and total earnings.
- Customer Record Management: Admins can create, view, edit, and delete customer records including customer name, phone number, device model, issue description, estimated charges, repaired parts, and repair/payment status. Automatically generates a unique customer ID and trackable link for each record.
- Repair Status & Customer Tracking: Admins can update repair status (Pending, In Progress, Completed) and payment status (Unpaid, Paid). Customers can access a minimal page via their unique ID/link to view their device details, issue, current repair status, and progress timeline.
- Payment Integration & Handling: Admins can associate external payment links (Razorpay/Stripe/UPI) with completed repairs. The customer tracking page will show a 'Pay Now' button when the repair is completed, redirecting them to the payment link, followed by a 'Payment Successful' message post-transaction.
- Automated Customer Communication Tool: Admins can initiate WhatsApp messages using a wa.me link with pre-filled text and the customer's unique tracking link. An AI tool assists in customizing and personalizing these messages based on the repair status and other customer-specific details before sending.
- Invoice Generation & Management: Admins can generate and send invoices to customers after payment confirmation. Customers have the option to download or view their invoice directly from their tracking page.

## Style Guidelines:

- Primary color: A professional and trustworthy blue (#5595D3), conveying reliability and clarity in operations.
- Background color: A very light, desaturated blue (#ECF2F9), providing a clean and calm canvas for content.
- Accent color: A vibrant yet clean cyan-blue (#21B2CC), to highlight interactive elements, calls to action, and important statuses.
- Headline and body font: 'Inter', a modern grotesque sans-serif that ensures objective clarity and excellent readability for both data tables and longer descriptions.
- Use clear and intuitive icons for navigation and status indication. Incorporate status badges for repair and payment states, along with clean progress indicators for customer tracking. Tool-related or tech-themed icons will reinforce the app's purpose.
- Design should be mobile-responsive with a clean, modern aesthetic. The admin interface will feature card-based layouts for dashboards and clear tabular forms for customer management. The customer-facing page will be minimal, displaying information prominently in easily digestible cards with a clear progress timeline.
- Subtle, non-distracting animations to provide feedback on user actions (e.g., saving data, updating status) and smooth transitions in the customer's progress timeline to enhance perceived responsiveness.