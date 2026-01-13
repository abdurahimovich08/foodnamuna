import { useAppStore } from '../stores/useAppStore';

export default function DeliveryModeSelect() {
  const { deliveryMode, setDeliveryMode } = useAppStore();

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setDeliveryMode('delivery')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          deliveryMode === 'delivery'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 border border-gray-300'
        }`}
      >
        Yetkazish
      </button>
      <button
        onClick={() => setDeliveryMode('pickup')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          deliveryMode === 'pickup'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 border border-gray-300'
        }`}
      >
        Olib ketish
      </button>
    </div>
  );
}
