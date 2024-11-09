import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export function NotificationToast({ message, type = 'success', onClose }) {
    useEffect(() => {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }, [onClose]);
  
    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
  
    return (
      <div className={`fixed top-4 right-4 max-w-sm w-full border rounded-lg shadow-lg p-4 ${styles[type]}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="flex-1">{message}</p>
          <button onClick={onClose} className="flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }