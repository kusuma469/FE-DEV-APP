import React from 'react';

interface StatusBadgeProps {
  status: 'Filled' | 'Pending' | 'Rejected' | 'Cancelled' | 'New' | 'Unknown';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'Filled': return 'status-filled';
      case 'Pending': return 'status-pending';
      case 'Rejected': return 'status-rejected';
      case 'Cancelled': return 'status-cancelled';
      case 'New': return 'status-new';
      case 'Unknown': return 'status-new'; 
      default: return 'status-new';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;