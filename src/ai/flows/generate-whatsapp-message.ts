'use server';
/**
 * @fileOverview A Genkit flow for generating personalized WhatsApp messages for customers.
 *
 * - generateWhatsAppMessage - A function that generates a personalized WhatsApp message.
 * - GenerateWhatsAppMessageInput - The input type for the generateWhatsAppMessage function.
 * - GenerateWhatsAppMessageOutput - The return type for the generateWhatsAppMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhatsAppMessageInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  deviceName: z.string().describe('The model name of the device being repaired.'),
  issueDescription: z.string().describe('A brief description of the issue with the device.'),
  repairStatus: z.enum(['Pending', 'In Progress', 'Completed']).describe('The current repair status of the device.'),
  trackingLink: z.string().url().describe('A unique URL for the customer to track their repair status.'),
  estimatedCharges: z.number().optional().describe('The estimated charges for the repair, if applicable.'),
  paymentStatus: z.enum(['Unpaid', 'Paid']).optional().describe('The payment status of the repair, if applicable.'),
});
export type GenerateWhatsAppMessageInput = z.infer<typeof GenerateWhatsAppMessageInputSchema>;

const GenerateWhatsAppMessageOutputSchema = z.object({
  message: z.string().describe('The personalized WhatsApp message.'),
});
export type GenerateWhatsAppMessageOutput = z.infer<typeof GenerateWhatsAppMessageOutputSchema>;

export async function generateWhatsAppMessage(input: GenerateWhatsAppMessageInput): Promise<GenerateWhatsAppMessageOutput> {
  return generateWhatsAppMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhatsAppMessagePrompt',
  input: {schema: GenerateWhatsAppMessageInputSchema},
  output: {schema: GenerateWhatsAppMessageOutputSchema},
  prompt: `You are an AI assistant for a mobile repair shop. Your task is to generate a personalized and professional WhatsApp message for a customer based on the provided details.

The message should clearly convey the repair status, mention the device, and include a tracking link. If the repair is completed and payment is due, prompt the customer to check the tracking link for payment options.

Customer Name: {{{customerName}}}
Device Name: {{{deviceName}}}
Issue Description: {{{issueDescription}}}
Repair Status: {{{repairStatus}}}
Tracking Link: {{{trackingLink}}}
{{#if estimatedCharges}}Estimated Charges: $ {{{estimatedCharges}}}{{/if}}
{{#if paymentStatus}}Payment Status: {{{paymentStatus}}}{{/if}}

Generate the WhatsApp message:
`,
});

const generateWhatsAppMessageFlow = ai.defineFlow(
  {
    name: 'generateWhatsAppMessageFlow',
    inputSchema: GenerateWhatsAppMessageInputSchema,
    outputSchema: GenerateWhatsAppMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
