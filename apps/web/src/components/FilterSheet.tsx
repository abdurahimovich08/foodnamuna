import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '../stores/useAppStore';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const sortOptions = [
  { value: 'name_asc', label: 'A dan Z gacha' },
  { value: 'name_desc', label: 'Z dan A gacha' },
  { value: 'rating', label: 'Mijoz reytinglari bo\'yicha' },
  { value: 'price_asc', label: 'Avval arzonroq' },
  { value: 'price_desc', label: 'Avval qimmatroq' },
];

const specialTags = [
  { id: 'best_seller', label: 'Best seller', icon: '⭐' },
  { id: 'new', label: 'New', icon: '🆕' },
  { id: 'spicy', label: 'Achchiq', icon: '🌶️' },
  { id: 'cheesy', label: 'Pishloqli', icon: '🧀' },
  { id: 'chicken', label: 'Tovuq', icon: '🍗' },
];

export default function FilterSheet({ isOpen, onClose }: FilterSheetProps) {
  const { sortBy, setSortBy, selectedTags, toggleTag, clearFilters } = useAppStore();

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
          <div className="flex min-h-full items-end justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold">Filtrlash</Dialog.Title>
                  <button onClick={onClose}>
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Saralash</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="sort"
                            value={option.value}
                            checked={sortBy === option.value}
                            onChange={() => setSortBy(option.value as any)}
                            className="w-4 h-4 text-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Maxsus</h3>
                    <div className="flex flex-wrap gap-2">
                      {specialTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag.id)
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tag.icon} {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium"
                    >
                      Tozalash
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-medium"
                    >
                      Filtrlash
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
