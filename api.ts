import type { Provider, Order, NewOrderPayload, User } from './types';
import { Material, OrderStatus } from './types';

// --- MOCK DATABASE ---

const mockOrders: Order[] = [
    { id: 1, customerName: 'Alice', fileName: 'dragon_v2.stl', material: Material.PLA, quantity: 1, status: OrderStatus.PENDING, date: '2023-10-27' },
    { id: 2, customerName: 'Bob', fileName: 'phone_stand.stl', material: Material.PETG, quantity: 1, status: OrderStatus.PRINTING, date: '2023-10-26' },
    { id: 3, customerName: 'Charlie', fileName: 'gear_set.obj', material: Material.ABS, quantity: 5, status: OrderStatus.COMPLETED, date: '2023-10-25' },
    { id: 4, customerName: 'Diana', fileName: 'miniature_knight.stl', material: Material.RESIN, quantity: 1, status: OrderStatus.REJECTED, date: '2023-10-24' },
    { id: 5, customerName: 'Eve', ideaDescription: 'Portachiavi a forma di gatto', material: Material.PLA, quantity: 2, status: OrderStatus.PENDING, date: '2023-10-28' },
];

const mockProviders: Provider[] = [
  {
    id: 1,
    name: 'Marco Rossi',
    distance: 2.5,
    rating: 4.8,
    avatarUrl: 'https://picsum.photos/seed/marco/200',
    printers: [{ id: 1, model: 'Creality Ender 3', buildVolume: '220x220x250mm' }],
    materials: [Material.PLA, Material.PETG],
    isBusiness: false,
    motto: 'Stampe veloci e affidabili per i tuoi progetti personali.',
    orders: mockOrders,
  },
  {
    id: 2,
    name: '3D Pro Services',
    distance: 5.1,
    rating: 5.0,
    avatarUrl: 'https://picsum.photos/seed/3dpro/200',
    printers: [
        { id: 2, model: 'Prusa i3 MK3S+', buildVolume: '250x210x210mm' },
        { id: 3, model: 'Formlabs Form 3', buildVolume: '145x145x185mm' }
    ],
    materials: [Material.PLA, Material.ABS, Material.PETG, Material.RESIN],
    isBusiness: true,
    motto: 'Qualità professionale per ordini di qualsiasi dimensione.',
    orders: [],
  },
  {
    id: 3,
    name: 'Giulia Bianchi',
    distance: 8.3,
    rating: 4.5,
    avatarUrl: 'https://picsum.photos/seed/giulia/200',
    printers: [{ id: 4, model: 'Anycubic Vyper', buildVolume: '245x245x260mm' }],
    materials: [Material.PLA, Material.TPU],
    isBusiness: false,
    motto: 'Specializzata in materiali flessibili e prototipi rapidi.',
    orders: [],
  },
   {
    id: 4,
    name: 'FabLab Locale',
    distance: 12.0,
    rating: 4.9,
    avatarUrl: 'https://picsum.photos/seed/fablab/200',
    printers: [
      { id: 5, model: 'Ultimaker S5', buildVolume: '330x240x300mm' },
      { id: 6, model: 'Bambu Lab X1 Carbon', buildVolume: '256x256x256mm' }
    ],
    materials: [Material.PLA, Material.ABS, Material.PETG, Material.TPU],
    isBusiness: true,
    motto: 'La tua idea, la nostra tecnologia. Servizi per hobbisti e aziende.',
    orders: [],
  },
];


// --- MOCK API FUNCTIONS ---

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  fetchProviders: async (): Promise<Provider[]> => {
    console.log('API: Fetching providers...');
    await simulateDelay(1000);
    console.log('API: Providers fetched successfully.');
    // Return a deep copy to prevent direct state mutation
    return JSON.parse(JSON.stringify(mockProviders));
  },

  submitOrder: async (payload: NewOrderPayload, currentUser: User): Promise<Order> => {
    console.log('API: Submitting order...', payload);
    await simulateDelay(1500);

    const provider = mockProviders.find(p => p.id === payload.providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const newOrder: Order = {
      id: Math.floor(Math.random() * 10000) + 10,
      customerName: currentUser.name,
      fileName: payload.fileName,
      ideaDescription: payload.ideaDescription,
      material: payload.material,
      quantity: payload.quantity,
      status: OrderStatus.PENDING,
      date: new Date().toISOString().split('T')[0],
    };

    // This mutation happens on our "server"
    provider.orders.unshift(newOrder); 
    
    console.log('API: Order submitted successfully.', newOrder);
    return newOrder;
  }
};