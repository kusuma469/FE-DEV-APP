import React, { useState } from 'react';
import OrdersTable from './components/OrdersTable';
import ChildOrdersTable from './components/ChildOrdersTable';
import { Order } from './types';
import TopBar from './components/TopBar';
import ToolBar from './components/ToolBar';
import { GridApi } from 'ag-grid-community';
import ErrorBoundary from './components/ErrorBoundary'; 

const App: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | undefined>(undefined);

  const handleCreateOrder = () => {
    alert('Create Order feature - Coming soon!');
  };

  return (
    <div className="app-shell">
      <TopBar />
      <ToolBar 
        gridApi={gridApi}
        onCreateOrder={handleCreateOrder} 
      />

      <div className="content">
        <main className="main-pane">
          <ErrorBoundary name="Orders Table">
            <OrdersTable
              onRowSelection={(order) => setSelectedOrder(order)}
              onGridReady={(api) => setGridApi(api)}
            />
          </ErrorBoundary>

          {selectedOrder && (
            <div className="child-orders-section">
              <ErrorBoundary name="Child Orders">
                <ChildOrdersTable orders={selectedOrder.childOrders || []} />
              </ErrorBoundary>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;