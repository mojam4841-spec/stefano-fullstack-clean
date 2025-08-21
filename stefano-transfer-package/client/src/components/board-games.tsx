import { Button } from "@/components/ui/button";
import { Dice1, Clock, Users } from "lucide-react";

export default function BoardGames() {
  return (
    <section id="gry" className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-montserrat font-bold text-center mb-16">
          <span className="stefano-gold">Gry</span> Planszowe
        </h2>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Szachy w restauracji Stefano" 
                className="rounded-lg shadow-xl"
                loading="lazy"
              />
              <img 
                src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                alt="Gry video w restauracji Stefano" 
                className="rounded-lg shadow-xl"
                loading="lazy"
              />
            </div>
            <img 
              src="https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Monopoly w restauracji Stefano" 
              className="rounded-xl shadow-2xl w-full"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-3xl font-montserrat font-bold mb-6">Graj, jedz i baw się doskonale!</h3>
            <p className="text-lg mb-8 opacity-90">
              Mamy ponad 50 gier planszowych oraz konsole do gier video. 
              Od klasycznych jak Monopoly i szachy, po nowoczesne gry video i strategiczne gry rodzinne.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Dice1 className="text-stefano-gold text-2xl w-8 h-8" />
                <div>
                  <h4 className="font-semibold stefano-gold">Ponad 50 gier + konsole</h4>
                  <p className="opacity-80">Gry planszowe i video dla całej rodziny</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="text-stefano-gold text-2xl w-8 h-8" />
                <div>
                  <h4 className="font-semibold stefano-gold">Wypożyczenie na miejscu</h4>
                  <p className="opacity-80">Gry wypożyczasz bezpłatnie przy zamówieniu</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="text-stefano-gold text-2xl w-8 h-8" />
                <div>
                  <h4 className="font-semibold stefano-gold">Dla każdego wieku</h4>
                  <p className="opacity-80">Od gier dla dzieci po skomplikowane strategie</p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8 bg-stefano-red hover:bg-red-600 px-8 py-4 font-semibold transition-colors">
              Zobacz pełną listę gier
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
