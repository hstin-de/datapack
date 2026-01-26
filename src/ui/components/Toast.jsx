import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast Notification System
 * 
 * @example
 * // Wrap your app with ToastProvider
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * 
 * // Use the hook in components
 * function MyComponent() {
 *   const toast = useToast();
 *   
 *   const handleSave = () => {
 *     toast.success('Saved successfully!');
 *   };
 *   
 *   const handleError = () => {
 *     toast.error('Something went wrong');
 *   };
 * }
 */

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children, position = 'bottom-right' }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, options = {}) => {
        const id = ++toastId;
        const toast = {
            id,
            message,
            variant: options.variant || 'default',
            duration: options.duration ?? 4000,
        };

        setToasts((prev) => [...prev, toast]);

        if (toast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        show: (message, options) => addToast(message, options),
        success: (message, options) => addToast(message, { ...options, variant: 'success' }),
        error: (message, options) => addToast(message, { ...options, variant: 'error' }),
        warning: (message, options) => addToast(message, { ...options, variant: 'warning' }),
        info: (message, options) => addToast(message, { ...options, variant: 'info' }),
        dismiss: removeToast,
        dismissAll: () => setToasts([]),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className={`ui-toast-container ui-toast-container--${position}`}>
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

function Toast({ id, message, variant, onClose }) {
    const icons = {
        success: <CheckCircle size={16} />,
        error: <AlertCircle size={16} />,
        warning: <AlertTriangle size={16} />,
        info: <Info size={16} />,
        default: null,
    };

    return (
        <div className={`ui-toast ui-toast--${variant}`} role="alert">
            {icons[variant] && <span className="ui-toast__icon">{icons[variant]}</span>}
            <span className="ui-toast__message">{message}</span>
            <button
                type="button"
                className="ui-toast__close"
                onClick={onClose}
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>
        </div>
    );
}
