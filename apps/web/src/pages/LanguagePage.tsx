export default function LanguagePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Til</h1>
        <div className="space-y-2">
          <button className="w-full text-left p-4 rounded-lg bg-primary text-white font-medium">
            O'zbekcha
          </button>
          <button className="w-full text-left p-4 rounded-lg bg-gray-100 text-gray-700 font-medium opacity-50">
            Русский (Yaqin orada)
          </button>
          <button className="w-full text-left p-4 rounded-lg bg-gray-100 text-gray-700 font-medium opacity-50">
            English (Coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
