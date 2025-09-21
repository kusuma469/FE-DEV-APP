// Core Order Interface
export interface Order {
  orderId: string;
  symbol: string;
  type: 'LIMIT' | 'MARKET';
  side: 'BUY' | 'SELL';
  tif: 'FOK' | 'GTC' | 'IOC';
  orderQty: number;
  filledQty?: number;
  price: number;
  status: 'Filled' | 'Pending' | 'Rejected' | 'Cancelled' | 'New';
  exchange: 'Velocity' | 'Binance' | 'OKX';
  time: string;
  childOrders?: Order[];
}

// Component Props
export interface OrdersTableProps {
  orders: Order[];
  onRowSelection?: (order: Order | null) => void;
  onExport?: (format: 'csv' | 'json') => void;
}

export interface StatusBadgeProps {
  status: Order['status'] | 'Unknown';
}
