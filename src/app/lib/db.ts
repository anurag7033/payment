export type RepairStatus = 'Pending' | 'In Progress' | 'Completed';
export type PaymentStatus = 'Unpaid' | 'Paid';

export interface CustomerRecord {
  id: string;
  name: string;
  phoneNumber: string;
  deviceModel: string;
  issueDescription: string;
  estimatedCharges: number;
  repairedParts: string;
  repairStatus: RepairStatus;
  paymentStatus: PaymentStatus;
  paymentLink?: string;
  trackingId: string;
  createdAt: string;
}

// In-memory store (will reset on server restart, but works for the demo/prototype)
let customers: CustomerRecord[] = [
  {
    id: '1',
    name: 'John Doe',
    phoneNumber: '5551234567',
    deviceModel: 'iPhone 13 Pro',
    issueDescription: 'Cracked screen and battery draining fast',
    estimatedCharges: 150,
    repairedParts: 'Original Screen, 3095mAh Battery',
    repairStatus: 'Completed',
    paymentStatus: 'Unpaid',
    paymentLink: 'https://razorpay.com/demo',
    trackingId: 'TRK-9921-A',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    phoneNumber: '5559876543',
    deviceModel: 'Samsung Galaxy S22',
    issueDescription: 'Water damage',
    estimatedCharges: 250,
    repairedParts: '',
    repairStatus: 'In Progress',
    paymentStatus: 'Unpaid',
    trackingId: 'TRK-4452-B',
    createdAt: new Date().toISOString(),
  }
];

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

export const addCustomer = async (data: Omit<CustomerRecord, 'id' | 'trackingId' | 'createdAt'>) => {
  const newId = Math.random().toString(36).substr(2, 9);
  const newTrackingId = `TRK-${Math.floor(1000 + Math.random() * 9000)}-${newId.substr(0, 1).toUpperCase()}`;
  const newCustomer: CustomerRecord = {
    ...data,
    id: newId,
    trackingId: newTrackingId,
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
  customers = customers.filter(c => c.id !== id);
};
