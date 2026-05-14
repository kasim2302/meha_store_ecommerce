import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConfirmDialog - A premium delete confirmation modal.
 *
 * Props:
 *   isOpen      {boolean}   - Whether the dialog is visible
 *   onConfirm   {function}  - Called when user clicks the confirm button
 *   onCancel    {function}  - Called when user clicks cancel or the X
 *   title       {string}    - Dialog heading
 *   message     {string}    - Descriptive text
 *   confirmText {string}    - Label for the confirm button (default: "Delete")
 *   isDanger    {boolean}   - Whether to style confirm button as destructive (default: true)
 */
const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[200]"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-dialog-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <AlertTriangle className={`h-8 w-8 ${isDanger ? 'text-red-500' : 'text-yellow-500'}`} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold text-sm text-white transition-colors ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
                : 'bg-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
