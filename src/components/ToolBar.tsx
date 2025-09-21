import React, { useState } from 'react';
import { GridApi } from 'ag-grid-community';
import { Download, Plus, Eye } from 'lucide-react';
import { exportAllOrders, exportVisibleOrders } from '../utils';

interface ToolBarProps {
  gridApi?: GridApi; 
  onCreateOrder?: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ gridApi, onCreateOrder }) => {
  const [exportingAll, setExportingAll] = useState(false);
  const [exportingVisible, setExportingVisible] = useState(false);

  // Handlers with error handling and user feedback
  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      exportAllOrders();
    } catch (error) {
      console.error('Export all failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportingAll(false);
    }
  };

  const handleExportVisible = async () => {
    if (!gridApi) {
      alert('Grid is not ready yet. Please wait a moment and try again.');
      return;
    }
    
    setExportingVisible(true);
    try {
      exportVisibleOrders(gridApi);
    } catch (error) {
      console.error('Export visible failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportingVisible(false);
    }
  };

  return (
    <div className="toolbar">
      <button 
        className="btn btn-primary" 
        onClick={onCreateOrder}
      >
        <Plus size={16} />
        Create Order
      </button>

      <button 
        className="btn btn-outline" 
        onClick={handleExportAll}
        disabled={exportingAll}
        title="Export all orders to CSV"
      >
        <Download size={16} />
        {exportingAll ? 'Exporting...' : 'Export All'}
      </button>

      <button 
        className="btn btn-outline"
        onClick={handleExportVisible}
        disabled={exportingVisible}
        title="Export visible orders to CSV"
      >
        <Eye size={16} />
        {exportingVisible ? 'Exporting...' : 'Export Visible'}
      </button>
    </div>
  );
};

export default ToolBar;