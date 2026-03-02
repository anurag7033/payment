export type RepairStatus = 'Pending' | 'In Progress' | 'Completed';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid';

export interface CustomerRecord {
  id: string;
  name: string;
  phoneNumber: string;
  deviceModel: string;
  issueDescription: string;
  estimatedCharges: number;
  paidAmount: number;
  repairedParts: string;
  repairStatus: RepairStatus;
  paymentStatus: PaymentStatus;
  paymentLink?: string;
  trackingId: string;
  createdAt: string;
}

// Ensure the database persists across hot-reloads in development
const globalForDb = global as unknown as { 
  customers: CustomerRecord[] | undefined 
};

if (!globalForDb.customers) {
  globalForDb.customers = [];
}

const customers = globalForDb.customers;

export const getCustomers = async () => [...customers];

export const getCustomerById = async (id: string) => {
  if (!id) return null;
  const normalizedId = id.toUpperCase();
  return customers.find(c => 
    c.id === id || 
    c.trackingId === id || 
    c.trackingId.toUpperCase() === normalizedId
  );
};

export const addCustomer = async (data: Omit<CustomerRecord, 'id' | 'createdAt'>) => {
  const newId = Math.random().toString(36).substr(2, 9);
  const newCustomer: CustomerRecord = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = async (id: string, data: Partial<CustomerRecord>) => {
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...data };
    return customers[index];
  }
  return null;
};

export const deleteCustomer = async (id: string) => {
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers.splice(index, 1);
  }
};
