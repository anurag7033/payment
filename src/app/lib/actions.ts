'use server';

import { revalidatePath } from 'next/cache';
import { addCustomer, updateCustomer, deleteCustomer, CustomerRecord, getCustomerById } from './db';
import { generateWhatsAppMessage, GenerateWhatsAppMessageInput } from '@/ai/flows/generate-whatsapp-message';

export async function createCustomerAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const deviceModel = formData.get('deviceModel') as string;
    const issueDescription = formData.get('issueDescription') as string;
    const trackingId = formData.get('trackingId') as string;
    const estimatedCharges = Number(formData.get('estimatedCharges')) || 0;
    const paidAmount = Number(formData.get('paidAmount')) || 0;
    const repairedParts = formData.get('repairedParts') as string;
    const repairStatus = formData.get('repairStatus') as any;
    const paymentStatus = formData.get('paymentStatus') as any;
    const paymentLink = formData.get('paymentLink') as string;

    if (!trackingId) {
      return { success: false, message: 'Tracking ID is required.' };
    }

    const newCustomer = await addCustomer({
      name,
      phoneNumber,
      deviceModel,
      issueDescription,
      trackingId,
      estimatedCharges,
      paidAmount,
      repairedParts,
      repairStatus,
      paymentStatus,
      paymentLink,
    });

    revalidatePath('/', 'layout');
    
    return { 
      success: true, 
      customer: newCustomer,
      message: 'Intake recorded successfully!' 
    };
  } catch (error) {
    console.error(error);
    return { 
      success: false, 
      message: 'Failed to record intake. Please try again.' 
    };
  }
}

export async function updateCustomerAction(id: string, data: Partial<CustomerRecord>) {
  try {
    await updateCustomer(id, data);
    revalidatePath('/', 'layout');
    
    const customer = await getCustomerById(id);
    if (customer) {
      revalidatePath(`/track/${customer.trackingId}`);
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update record.' };
  }
}

export async function deleteCustomerAction(id: string) {
  await deleteCustomer(id);
  revalidatePath('/', 'layout');
}

export async function getCustomerAction(id: string) {
  return await getCustomerById(id);
}

export async function getWhatsAppPreview(id: string) {
  const customer = await getCustomerById(id);
  if (!customer) return null;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  const trackingLink = `${baseUrl}/track/${customer.trackingId}`;

  const input: GenerateWhatsAppMessageInput = {
    customerName: customer.name,
    deviceName: customer.deviceModel,
    issueDescription: customer.issueDescription,
    repairStatus: customer.repairStatus,
    trackingLink,
    estimatedCharges: customer.estimatedCharges,
    paymentStatus: customer.paymentStatus,
  };

  const { message } = await generateWhatsAppMessage(input);
  return { message, phone: customer.phoneNumber };
}

/**
 * Generates a professional UPI payment link (compatible with Razorpay/GPay/PhonePe)
 * In a real scenario, this would call the Razorpay API to create a unique link.
 */
export async function generatePaymentLinkAction(name: string, amount: number, trackingId: string) {
  // Mock UPI ID for the shop - in a real app, this would come from shop settings
  const shopUPI = "fixflow@upi"; 
  const merchantName = "FixFlow Pro Repairs";
  
  // Construct standard UPI intent link
  const encodedName = encodeURIComponent(merchantName);
  const encodedNote = encodeURIComponent(`Repair Payment for ${trackingId}`);
  const upiLink = `upi://pay?pa=${shopUPI}&pn=${encodedName}&am=${amount}&tn=${encodedNote}&cu=INR`;
  
  return upiLink;
}
