export default function OpeningHours() {
  return (
    <section id="godziny" className="py-16 bg-stefano-dark">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-montserrat font-bold mb-12">
          <span className="stefano-gold">Godziny</span> Otwarcia
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-stefano-gray p-6 rounded-lg">
            <h3 className="font-montserrat font-semibold stefano-gold mb-4">Poniedziałek - Środa</h3>
            <p className="text-2xl">15:00 - 21:00</p>
          </div>
          <div className="bg-stefano-gray p-6 rounded-lg">
            <h3 className="font-montserrat font-semibold stefano-gold mb-4">Czwartek - Sobota</h3>
            <p className="text-2xl">15:00 - 24:00</p>
          </div>
          <div className="bg-stefano-gray p-6 rounded-lg">
            <h3 className="font-montserrat font-semibold stefano-gold mb-4">Niedziela</h3>
            <p className="text-2xl">13:00 - 22:00</p>
          </div>
        </div>
      </div>
    </section>
  );
}
