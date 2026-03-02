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
    const estimatedCharges = Number(formData.get('estimatedCharges'));
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
      repairedParts,
      repairStatus,
      paymentStatus,
      paymentLink,
    });

    // Revalidate multiple paths to ensure dashboard consistency
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
    
    // Force complete site revalidation for data sync
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
  // Force complete site revalidation for data sync
  revalidatePath('/', 'layout');
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
