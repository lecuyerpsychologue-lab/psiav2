import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto ${className}`}>
        {title && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate/10 dark:border-dark-text/10">
            <h2 className="text-2xl font-bold text-slate dark:text-dark-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate/10 dark:hover:bg-dark-text/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
