import { Order } from '../types';

interface MenuState {          // State interface for menu
  isOpen: boolean;
  position: { top: number; left: number };
  order: Order | null;
  menuElement: HTMLDivElement | null;
}

class ActionMenuManager {      // Singleton class to manage action menu
  private static instance: ActionMenuManager;
  private state: MenuState = {
    isOpen: false,
    position: { top: 0, left: 0 },
    order: null,
    menuElement: null
  };
  private onActionCallback: ((action: string, order: Order) => void) | null = null;

// Singleton instance accessor
  static getInstance(): ActionMenuManager {
    if (!ActionMenuManager.instance) {
      ActionMenuManager.instance = new ActionMenuManager();
    }
    return ActionMenuManager.instance;
  }
  // Set callback for action handling
  setActionCallback(callback: (action: string, order: Order) => void) {
    this.onActionCallback = callback;
  }

  // Open menu at calculated position
  openMenu(event: MouseEvent, order: Order) { 
    try {
      // Basic validation
      if (!event || !order) return;

      // Close existing menu
      this.closeMenu();

      const target = event.target as HTMLElement;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const menuHeight = 200;
      const menuWidth = 180;

      // Calculate optimal position
      let top = rect.bottom + 4;
      let left = rect.left - 120;

      if (top + menuHeight > viewportHeight) {
        top = rect.top - menuHeight - 4;
      }
      if (left < 0) {
        left = rect.right - menuWidth;
      }
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 10;
      }

      // Create menu element
      const menuElement = this.createMenuElement(order);
      menuElement.style.position = 'fixed';
      menuElement.style.top = `${top}px`;
      menuElement.style.left = `${left}px`;
      menuElement.style.zIndex = '10000';

      // Safe DOM append
      document.body.appendChild(menuElement);

      this.state = {
        isOpen: true,
        position: { top, left },
        order,
        menuElement
      };

      // Add global listeners
      setTimeout(() => {
        document.addEventListener('click', this.handleOutsideClick);
        document.addEventListener('keydown', this.handleKeydown);
      }, 0);

    } catch (error) {
      console.error('ActionMenuManager: Error opening menu', error);
      this.closeMenu();
    }
  }

  private createMenuElement(order: Order): HTMLDivElement {
    const menu = document.createElement('div');
    menu.className = 'action-menu-dropdown';

    const menuItems = [
      { label: 'View Details', action: 'view-details', disabled: false },
      { label: 'Cancel Order', action: 'cancel', disabled: order.status === 'Filled' || order.status === 'Cancelled' },
      { label: 'Download CSV', action: 'download-csv', disabled: false },
      { label: 'Download JSON', action: 'download-json', disabled: false },
      { label: 'Force Cancel', action: 'force-cancel', disabled: order.status === 'Filled' || order.status === 'Cancelled' }
    ];

    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = `action-menu-item ${item.disabled ? 'disabled' : ''}`;
      menuItem.textContent = item.label;
      
      if (!item.disabled) {
        menuItem.onclick = (e) => {
          e.stopPropagation();
          this.handleAction(item.action, order);
        };
      }

      menu.appendChild(menuItem);
    });

    return menu;
  }

  // Handle action selection
  private handleAction = (action: string, order: Order) => {
    if (this.onActionCallback) {
      this.onActionCallback(action, order);
    }
    this.closeMenu();
  };

  // Close menu on outside click or Escape key
  private handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (this.state.menuElement && !this.state.menuElement.contains(target)) {
      this.closeMenu();
    }
  };
// Close menu on Escape key
  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  };

  closeMenu() {
    try {
      if (this.state.menuElement && this.state.menuElement.parentNode) {
        document.body.removeChild(this.state.menuElement);
      }
    } catch (error) {
      console.warn('ActionMenuManager: Error removing menu element', error);
    }
    
    try {
      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('keydown', this.handleKeydown);
    } catch (error) {
      console.warn('ActionMenuManager: Error removing event listeners', error);
    }

    this.state = {
      isOpen: false,
      position: { top: 0, left: 0 },
      order: null,
      menuElement: null
    };
  }
}

export const actionMenuManager = ActionMenuManager.getInstance();