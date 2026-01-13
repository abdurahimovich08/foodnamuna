import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface QuantityStepperProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
}

export default function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MinusIcon className="w-5 h-5 text-gray-700" />
      </button>
      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={max !== undefined && quantity >= max}
        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}
