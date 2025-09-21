import { GridApi } from 'ag-grid-community';
import { Order } from '../types';
import { sampleOrders } from '../data/sampleOrders';

// Enhanced CSV export with clean error handling
export const exportToCSV = (orders: Order[], filename: string): void => {
  if (!orders || orders.length === 0) {
    alert('No orders to export');
    return;
  }

  try {
    const headers = [
      'Order ID', 'Symbol', 'Type', 'Side', 'TIF', 
      'Order QTY', 'Filled QTY', 'Price', 'Status', 
      'Exchange', 'Time'
    ];
    
    const csvRows = [
      headers.join(','),
      ...orders.map(order => [
        order.orderId,
        order.symbol,
        order.type,
        order.side,
        order.tif,
        order.orderQty,
        order.filledQty || '',
        order.price,
        order.status,
        order.exchange,
        new Date(order.time).toLocaleString()
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    alert(`Successfully exported ${orders.length} orders`);
  } catch (error) {
    console.error('CSV Export Error:', error);
    alert('Export failed. Please try again.');
  }
};

// Export all orders
export const exportAllOrders = (): void => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  exportToCSV(sampleOrders, `all-orders-${timestamp}.csv`);
};

// Export visible orders with validation
export const exportVisibleOrders = (gridApi?: GridApi): void => {
  if (!gridApi) {
    alert('Grid is not ready. Please wait for the table to load.');
    return;
  }

  try {
    const visibleOrders: Order[] = [];
    
    // Get currently displayed rows
    const displayedRowCount = gridApi.getDisplayedRowCount();
    
    if (displayedRowCount === 0) {
      alert('No visible orders found. Please wait for data to load.');
      return;
    }
    
    // Get all currently rendered rows
    for (let i = 0; i < displayedRowCount; i++) {
      const rowNode = gridApi.getDisplayedRowAtIndex(i);
      if (rowNode && rowNode.data) {
        visibleOrders.push(rowNode.data);
      }
    }

    if (visibleOrders.length === 0) {
      alert('No visible orders found. Please wait for data to load.');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    exportToCSV(visibleOrders, `visible-orders-${timestamp}.csv`);
    
  } catch (error) {
    console.error('Visible export error:', error);
    alert('Export failed. Please try again.');
  }
};