export default function ContactsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Kontaktlar</h1>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-1">Telefon</h3>
            <a href="tel:+998901234567" className="text-primary hover:underline">
              +998 90 123 45 67
            </a>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Ish vaqti</h3>
            <p>Har kuni: 09:00 - 23:00</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Email</h3>
            <a href="mailto:info@zahratun.uz" className="text-primary hover:underline">
              info@zahratun.uz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
