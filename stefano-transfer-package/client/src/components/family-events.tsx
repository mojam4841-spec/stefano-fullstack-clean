import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const services = [
  "Obsługa komunii świętych i chrztów",
  "Organizacja 18-stek i urodzin",
  "Dekoracja sali zgodnie z okazją",
  "Specjalne menu dla gości",
  "Fotografia i oprawa muzyczna"
];

export default function FamilyEvents() {
  return (
    <section id="imprezy" className="py-16 bg-stefano-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-montserrat font-bold text-center mb-16">
          <span className="stefano-gold">Imprezy</span> Rodzinne
        </h2>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-montserrat font-bold mb-6">Organizujemy wyjątkowe uroczystości</h3>
            <p className="text-lg mb-8 opacity-90">
              Święta komunii, chrzty, 18-stki, urodziny - każda okazja zasługuje na wyjątkowe uczucie.
              Nasza doświadczona kadra zadba o każdy szczegół Twojej imprezy.
            </p>
            
            <div className="space-y-4 mb-8">
              {services.map((service, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-stefano-gold w-5 h-5 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
            
            <Button className="bg-stefano-red hover:bg-red-600 px-8 py-4 font-semibold transition-colors">
              Zapytaj o wycenę
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Sala imprez rodzinnych Stefano" 
              className="rounded-xl shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
