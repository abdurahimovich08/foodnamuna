import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ItemCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialComment: string;
  onSave: (comment: string) => void;
}

export default function ItemCommentModal({
  isOpen,
  onClose,
  initialComment,
  onSave,
}: ItemCommentModalProps) {
  const [comment, setComment] = useState(initialComment);

  const handleSave = () => {
    onSave(comment);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold">
                    Fikr qoldiring
                  </Dialog.Title>
                  <button onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Masalan: Achchiq bo'lmasin..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium"
                  >
                    Saqlash
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
