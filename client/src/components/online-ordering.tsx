import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function OnlineOrdering() {
  const handleOrder = () => {
    // Direct to order form without avatar selection
    window.location.href = `/order`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-stefano-red to-stefano-gold bg-clip-text text-transparent">
            Zamówienia Online
          </h1>
          <p className="text-xl text-gray-300">
            Złóż zamówienie na pyszne jedzenie z restauracji Stefano
          </p>
        </div>

        <div className="text-center">
          <div className="bg-gray-800 rounded-xl p-8 border-2 border-gray-700 mb-8">
            <h2 className="text-3xl font-bold text-stefano-gold mb-4">Dostępne zamówienia</h2>
            <p className="text-gray-300 mb-6">
              Pizza, burgery, tortille i więcej! Sprawdź nasze menu i złóż zamówienie.
            </p>
            <Button
              onClick={handleOrder}
              className="text-xl px-12 py-6 rounded-xl bg-gradient-to-r from-stefano-red to-stefano-gold hover:shadow-lg hover:shadow-stefano-red/30 text-white"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Złóż Zamówienie
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-stefano-gold mb-2">🍕 Pizza</h3>
              <p className="text-gray-400">Najlepsza pizza w Bełchatowie</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-stefano-gold mb-2">🍔 Burgery</h3>
              <p className="text-gray-400">Soczyste burgery z najlepszymi składnikami</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-stefano-gold mb-2">🌯 Tortille</h3>
              <p className="text-gray-400">Pełne smaku tortille na każdą okazję</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}