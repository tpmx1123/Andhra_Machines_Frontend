import Modal from './Modal';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export default function AlertModal({ isOpen, onClose, title, message, type = 'info' }) {
  const icons = {
    success: <CheckCircle className="h-6 w-6 text-green-600" />,
    error: <XCircle className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={`flex items-start gap-3 p-4 rounded-lg border ${bgColors[type] || bgColors.info}`}>
        <div className="flex-shrink-0">
          {icons[type] || icons.info}
        </div>
        <div className="flex-1">
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-[#c54513] rounded-md hover:bg-[#a43a10] transition-colors"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}

