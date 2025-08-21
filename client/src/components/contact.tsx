import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Dziękujemy za wiadomość!",
        description: "Skontaktujemy się z Tobą wkrótce.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    { icon: MapPin, label: "Adres", value: "ul. Kościuszki 12, 97-400 Bełchatów" },
    { icon: Phone, label: "Telefon", value: "517-616-618" },
    { icon: Mail, label: "Email", value: "stefano@stefanogroup.pl" },
    { icon: Globe, label: "Strona WWW", value: "www.stefanogroup.pl" }
  ];

  return (
    <section id="kontakt" className="py-16 bg-stefano-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-montserrat font-bold text-center mb-16">
          <span className="stefano-gold">Kontakt</span>
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-montserrat font-bold mb-8">Skontaktuj się z nami</h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <Icon className="text-stefano-gold text-2xl w-8 h-8 shrink-0" />
                    <div>
                      <h4 className="font-semibold">{info.label}</h4>
                      <p>{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="https://www.facebook.com/przestrzen.belchatow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stefano-gold hover:text-white text-3xl transition-colors"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a 
                href="https://www.instagram.com/przestrzen.belchatow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stefano-gold hover:text-white text-3xl transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="block font-semibold mb-2">Imię i nazwisko</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-stefano-gray border-stefano-gray focus:border-stefano-gold"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="block font-semibold mb-2">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-stefano-gray border-stefano-gray focus:border-stefano-gold"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="block font-semibold mb-2">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-stefano-gray border-stefano-gray focus:border-stefano-gold"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="block font-semibold mb-2">Wiadomość</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-stefano-gray border-stefano-gray focus:border-stefano-gold"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-stefano-red hover:bg-red-600 py-4 font-semibold text-lg transition-colors"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? "Wysyłanie..." : "Wyślij wiadomość"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
