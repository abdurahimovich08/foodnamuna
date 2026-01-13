export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' UZS';
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('uz-UZ');
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'Yangi',
    preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor',
    delivered: 'Yetkazildi',
    cancelled: 'Bekor qilindi',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: 'Sahib',
    manager: 'Menejer',
    operator: 'Operator',
  };
  return labels[role] || role;
}
