import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Modal Component
 * 
 * Modal dialog with backdrop, close button, and footer slot.
 * 
 * @example
 * <Modal 
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Delete"
 *   footer={
 *     <>
 *       <Button variant="secondary" onClick={onCancel}>Cancel</Button>
 *       <Button variant="danger" onClick={onConfirm}>Delete</Button>
 *     </>
 *   }
 * >
 *   Are you sure you want to delete this item?
 * </Modal>
 */
export function Modal({
    children,
    open,
    onClose,
    title,
    footer,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    className = '',
    ...props
}) {
    const modalRef = useRef(null);

    // Handle escape key
    useEffect(() => {
        if (!open || !closeOnEscape) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, closeOnEscape, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className="ui-modal-backdrop" onClick={handleBackdropClick}>
            <div
                ref={modalRef}
                className={`ui-modal ui-modal--${size} ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                {...props}
            >
                {(title || onClose) && (
                    <div className="ui-modal__header">
                        {title && <h2 id="modal-title" className="ui-modal__title">{title}</h2>}
                        {onClose && (
                            <button
                                type="button"
                                className="ui-modal__close"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                )}
                <div className="ui-modal__content">{children}</div>
                {footer && <div className="ui-modal__footer">{footer}</div>}
            </div>
        </div>
    );
}

/**
 * ConfirmModal - Preset modal for confirmations
 */
export function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = 'Confirm',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button className="ui-btn ui-btn--secondary" onClick={onClose}>
                        {cancelLabel}
                    </button>
                    <button className={`ui-btn ui-btn--${variant}`} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </>
            }
        >
            {message}
        </Modal>
    );
}
