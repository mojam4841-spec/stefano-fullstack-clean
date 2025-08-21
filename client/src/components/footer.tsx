export default function Footer() {
  const menuLinks = [
    { name: "Pizza", href: "#pizza" },
    { name: "Burgery", href: "#burgery" },
    { name: "Kurczak", href: "#kurczak" },
    { name: "Inne dania", href: "#inne" }
  ];

  const serviceLinks = [
    { name: "Gry planszowe", href: "#gry" },
    { name: "Imprezy rodzinne", href: "#imprezy" },
    { name: "Obsługa firm", href: "#firmy" },
    { name: "Zamówienia online", href: "#zamow" }
  ];

  return (
    <footer className="bg-black border-t border-stefano-gold/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/attached_assets/Asset 1@2x-1-80_1750909127916.png" 
                alt="Stefano Logo" 
                className="h-8 w-auto mr-2 bg-white rounded p-1"
              />
              <div className="text-3xl font-montserrat font-bold">
                <span className="stefano-gold">STEF</span>
                <span className="text-white">ANO</span>
              </div>
            </div>
            <p className="opacity-80">Restauracja & Pub w sercu Bełchatowa. Delicious Pizza & Family Chicken King.</p>
          </div>
          
          <div>
            <h4 className="font-montserrat font-bold stefano-gold mb-4">Menu</h4>
            <ul className="space-y-2 opacity-80">
              {menuLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-stefano-gold transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-bold stefano-gold mb-4">Usługi</h4>
            <ul className="space-y-2 opacity-80">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-stefano-gold transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-bold stefano-gold mb-4">Kontakt</h4>
            <div className="space-y-2 opacity-80">
              <p>ul. Kościuszki 12</p>
              <p>97-400 Bełchatów</p>
              <p>517-616-618</p>
              <p>stefano@stefanogroup.pl</p>
              <a 
                href="https://www.facebook.com/Przestrzen.Belchatow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-400 hover:text-blue-300 transition-colors"
              >
                Facebook: Przestrzeń Bełchatów
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stefano-gold/20 mt-12 pt-8 text-center opacity-60">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>&copy; 2024 Restauracja & Pub Stefano. Wszystkie prawa zastrzeżone.</p>
            <div className="space-x-6">
              <a href="#regulamin" className="hover:text-stefano-gold transition-colors">Regulamin</a>
              <a href="#polityka" className="hover:text-stefano-gold transition-colors">Polityka prywatności</a>
              <a href="/admin" className="hover:text-stefano-gold transition-colors text-xs opacity-50">Panel</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
