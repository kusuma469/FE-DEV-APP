// ordersGridConfig.tsx - Minimal error handling for assignment stability
import React from 'react';
import { ColDef } from 'ag-grid-community';
import StatusBadge from './StatusBadge';
import { actionMenuManager } from './ActionMenuManager';
import { Order } from '../types';

// Shared StatusRenderer
export const StatusRenderer = React.memo((params: any) => {
  if (!params.value) {
    return <span className="status-badge status-new">Unknown</span>;
  }
  return <StatusBadge status={params.value} />;
});

// Shared SideRenderer
export const SideRenderer = React.memo((params: any) => {
  if (!params.value) {
    return <span>-</span>;
  }
  const className = params.value === 'BUY' ? 'side-buy' : 'side-sell';
  return <span className={className}>{params.value}</span>;
});

// Shared ActionRenderer
export const ActionRenderer = React.memo((params: any) => {
  const handleClick = (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      if (!params.data) return;
      actionMenuManager.openMenu(e.nativeEvent, params.data as Order);
    } catch (error) {
      console.error('ActionRenderer: Error opening action menu', error);
    }
  };
  return <button className="action-button" onClick={handleClick}>⋮</button>;
});

export const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  filter: true,        
  //floatingFilter: true,
};

// Get base columns (without actions column)
export const getBaseColumns = (): ColDef[] => [
  { headerName: 'Order ID', field: 'orderId', minWidth: 120, flex: 1 },
  { headerName: 'Symbol', field: 'symbol', minWidth: 80, flex: 0.8 },
  { headerName: 'Type', field: 'type', minWidth: 70, flex: 0.6 },
  { headerName: 'Side', field: 'side', minWidth: 70, flex: 0.6, cellRenderer: SideRenderer },
  { headerName: 'TIF', field: 'tif', minWidth: 60, flex: 0.5 },
  { headerName: 'Order QTY', field: 'orderQty', minWidth: 100, flex: 1, type: 'numericColumn' },
  { headerName: 'Filled QTY', field: 'filledQty', minWidth: 100, flex: 1, type: 'numericColumn' },
  { headerName: 'Price', field: 'price', minWidth: 100, flex: 1, type: 'numericColumn' },
  { headerName: 'Status', field: 'status', minWidth: 90, flex: 0.8, cellRenderer: StatusRenderer },
  { headerName: 'Exchange', field: 'exchange', minWidth: 90, flex: 0.8 },
  { headerName: 'Time', field: 'time', minWidth: 160, flex: 1.5 },
];

// Optional helper to add the actions column
export const getActionsColumn = (): ColDef => ({
  colId: 'actions',
  headerName: '',
  cellRenderer: ActionRenderer,
  width: 60,
  suppressMovable: true,
  sortable: false,
  filter: false,
  menuTabs: [],
  suppressNavigable: true,
  suppressAutoSize: true,
});