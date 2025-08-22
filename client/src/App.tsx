import { useEffect, useState } from "react";
import { getMenu } from "./lib/api";
import type { MenuItem } from "./types/menu";

export default function App() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMenu()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Ładowanie…</div>;
  if (error) return <div className="p-6 text-red-600">Błąd: {error}</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <ul className="grid gap-3">
        {items.map((i) => (
          <li key={i.id} className="rounded-lg border p-4">
            <div className="flex justify-between">
              <span className="font-medium">{i.name}</span>
              <span>{i.price.toFixed(2)} zł</span>
            </div>
            {i.category && (
              <div className="text-sm text-gray-500">{i.category}</div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
