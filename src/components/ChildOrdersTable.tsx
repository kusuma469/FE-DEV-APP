import React, { useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Order } from '../types';
import { actionMenuManager } from './ActionMenuManager';
import { getBaseColumns, defaultColDef, getActionsColumn } from './ordersGridConfig';
import ErrorBoundary from './ErrorBoundary';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ChildOrdersTableProps {
  orders: Order[];
}

const ChildOrdersTable: React.FC<ChildOrdersTableProps> = ({ orders }) => {
    
  const handleActionMenuClick = useCallback((action: string, order: Order) => {
    console.log(`Child Action: ${action} for order:`, order.orderId);
  }, []);

  // Setup action menu manager with error handling
  useEffect(() => {
    try {
      actionMenuManager.setActionCallback(handleActionMenuClick);
    } catch (error) {
      console.error('Error setting up child action menu:', error);
    }
  }, [handleActionMenuClick]);

  const columnDefs: ColDef[] = useMemo(() => [
    ...getBaseColumns(),
    getActionsColumn()
  ], []);

  // Handle missing or empty orders
  if (!orders || orders.length === 0) {
    return <p style={{ color: '#888' }}>No child orders</p>;
  }

  return (
    <div className="orders-table-container" style={{ marginTop: 20 }}>
      <h3>Child Orders</h3>
      {/* Wrap AG Grid in ErrorBoundary to prevent crashes */}
      <ErrorBoundary name="Child Orders Grid">
        <div className="ag-theme-quartz-dark" style={{ height: 250, width: '100%' }}>
          <AgGridReact
            rowData={orders}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowHeight={42}
            headerHeight={44}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default ChildOrdersTable;