import { Order } from '../types';
import ordersData from './orders.json';

// Function to multiply orders for infinite scroll simulation
const multiplyOrders = (baseOrders: Order[], targetCount: number = 1000): Order[] => {
  const result: Order[] = [];
  
  for (let i = 0; i < targetCount; i++) {
    const template = baseOrders[i % baseOrders.length];
    const newOrder: Order = {
      ...template,
      orderId: `ORD${String(i + 1).padStart(4, '0')}`,
      time: new Date(Date.now() - i * 60000).toISOString(), // 1 minute apart
      childOrders: template.childOrders?.map((child, idx) => ({
        ...child,
        orderId: `ORD${String(i + 1).padStart(4, '0')}-C${idx + 1}`,
        time: new Date(Date.now() - i * 60000 + 1000).toISOString(),
      }))
    };
    result.push(newOrder);
  }
  
  return result;
};

// existing orders from JSON
const baseOrders: Order[] = ordersData as Order[];

// Multiply to 1000 orders for infinite scroll
export const sampleOrders: Order[] = multiplyOrders(baseOrders, 1000);

export const totalOrdersCount = sampleOrders.length;