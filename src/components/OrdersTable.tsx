import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { Order } from '../types';
import { actionMenuManager } from './ActionMenuManager';
import { getBaseColumns, defaultColDef, getActionsColumn } from './ordersGridConfig';
import { sampleOrders } from '../data/sampleOrders';

interface OrdersTableProps {
  onRowSelection?: (order: Order | null) => void;
  onGridReady?: (api: GridApi) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ onRowSelection, onGridReady }) => {
  const gridApiRef = useRef<GridApi | undefined>(undefined);
  const [loading, setLoading] = useState(false);

    // Action menu handler
  const handleActionMenuClick = useCallback((action: string, order: Order) => {
    console.log(`Action: ${action} for order:`, order.orderId);
  }, []);

  useEffect(() => {
    actionMenuManager.setActionCallback(handleActionMenuClick);
  }, [handleActionMenuClick]);

  const columnDefs: ColDef[] = useMemo(() => [
    ...getBaseColumns(),
    getActionsColumn()
  ], []);

  //infinite scroll datasource with basic filtering, sorting, and error handling
  const datasource: IDatasource = useMemo(() => ({
    rowCount: undefined,
    getRows: (params: IGetRowsParams) => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          let filteredData = [...sampleOrders];
          
          // Basic filtering - handle AG Grid filter requests
          if (params.filterModel) {
            Object.keys(params.filterModel).forEach(field => {
              const filter = (params.filterModel as any)[field];
              if (filter && filter.filter) {
                filteredData = filteredData.filter(order => {
                  const value = (order as any)[field];
                  return String(value).toLowerCase().includes(filter.filter.toLowerCase());
                });
              }
            });
          }
          
          // Basic sorting - handle AG Grid sort requests
          if (params.sortModel && params.sortModel.length > 0) {
            const { colId, sort } = params.sortModel[0];
            filteredData.sort((a, b) => {
              const aValue = (a as any)[colId];
              const bValue = (b as any)[colId];
              
              if (aValue < bValue) return sort === 'asc' ? -1 : 1;
              if (aValue > bValue) return sort === 'asc' ? 1 : -1;
              return 0;
            });
          }
          
          // Slice data for infinite scroll chunk
          const rowsThisPage = filteredData.slice(params.startRow, params.endRow);
          const lastRow = filteredData.length <= params.endRow ? filteredData.length : -1;
          
          params.successCallback(rowsThisPage, lastRow);
          setLoading(false);
        } catch (error) {
          console.error('Error loading data:', error);
          params.failCallback();
          setLoading(false);
        }
      }, 100);
    }
  }), []);
  // End datasource

  // Grid ready handler
  const onGridReadyHandler = useCallback((event: GridReadyEvent) => {
    gridApiRef.current = event.api;
    onGridReady?.(event.api);
  }, [onGridReady]);
 
    // Row selection handler
  const onSelectionChanged = useCallback(() => {
    if (gridApiRef.current) {
      const selectedRows = gridApiRef.current.getSelectedRows();
      const selectedOrder = selectedRows.length > 0 ? selectedRows[0] as Order : null;
      onRowSelection?.(selectedOrder);
    }
  }, [onRowSelection]);

  return (
    <div className="orders-table-container">
      {loading && (
        <div className="loading-overlay">
          Loading orders...
        </div>
      )}
      
      <div className="ag-theme-quartz-dark" style={{ height: 600, width: '100%' }}>
        <AgGridReact    // Main AG Grid component
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={42}
          headerHeight={44}
          rowSelection="single"
          onSelectionChanged={onSelectionChanged}
          onGridReady={onGridReadyHandler}
          
          rowModelType="infinite"
          datasource={datasource}
          cacheBlockSize={50}
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={2}
          infiniteInitialRowCount={1}
          maxBlocksInCache={10}
        />
      </div>
    </div>
  );
};

export default OrdersTable;