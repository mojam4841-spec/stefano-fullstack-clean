import { Button } from "@/components/ui/button";
import { Video, Wifi, Coffee, Utensils } from "lucide-react";

const features = [
  { icon: Video, label: "Projektor i ekran" },
  { icon: Wifi, label: "Szybkie WiFi" },
  { icon: Coffee, label: "Przerwy kawowe" },
  { icon: Utensils, label: "Catering i obiady" }
];

const packages = [
  { name: "Zestaw Basic", price: "30 zł/os", description: "Podstawowy catering na spotkania" },
  { name: "Zestaw Standard", price: "45 zł/os", description: "Rozszerzony catering + napoje" },
  { name: "Zestaw Premium", price: "60 zł/os", description: "Pełny obiad + przekąski" },
  { name: "Zestaw VIP", price: "80 zł/os", description: "Ekskluzywny catering + alkohol" }
];

export default function BusinessServices() {
  return (
    <section id="firmy" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-montserrat font-bold text-center mb-16">
          <span className="stefano-gold">Obsługa</span> Firm
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Sala konferencyjna Stefano z długim stołem, napojami i rzutnikiem" 
              className="rounded-xl shadow-2xl"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-3xl font-montserrat font-bold mb-6">Sala konferencyjna z pełnym wyposażeniem</h3>
            <p className="text-lg mb-8 opacity-90">
              Profesjonalna sala konferencyjna dostępna od 8:00 do 21:00. 
              Idealna na spotkania biznesowe, szkolenia i prezentacje.
            </p>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="text-stefano-gold w-5 h-5" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Pricing Packages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <div key={index} className="bg-stefano-gray p-6 rounded-xl text-center">
              <h4 className="text-2xl font-montserrat font-bold stefano-gold mb-4">{pkg.name}</h4>
              <div className="text-3xl font-bold mb-4">{pkg.price}</div>
              <p className="mb-6 opacity-80">{pkg.description}</p>
              <Button className="w-full bg-stefano-red hover:bg-red-600 transition-colors">
                Wybierz
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-stefano-gray p-8 rounded-xl inline-block">
            <h4 className="text-2xl font-montserrat font-bold stefano-gold mb-4">Specjalne oferty</h4>
            <div className="space-y-3">
              <p><span className="font-semibold">Stół wiejski:</span> od 10 zł/os</p>
              <p><span className="font-semibold">Pakiety imprezowe dla 6 os.:</span> od 300 zł z "Deską Piwosza"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
