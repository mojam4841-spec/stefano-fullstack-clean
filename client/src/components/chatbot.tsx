import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface BotResponse {
  text: string;
  quickReplies?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Cześć! Jestem STEFANO bot 🍕 Jak mogę Ci pomóc? Mogę opowiedzieć o naszym menu, godzinach otwarcia, rezerwacjach lub zamówieniach online.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage: string): Promise<BotResponse> => {
    try {
      // Call DeepSeek API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.error) {
        // Use fallback response if provided
        if (data.fallback) {
          return { text: data.fallback };
        }
        throw new Error(data.error);
      }

      return { text: data.response };
      
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Fallback to local response
      return getLocalBotResponse(userMessage);
    }
  };

  const getLocalBotResponse = (userMessage: string): BotResponse => {
    const message = userMessage.toLowerCase();
    
    // Godziny otwarcia
    if (message.includes('godzin') || message.includes('otwar') || message.includes('czynne')) {
      return {
        text: '🕐 Nasze godziny otwarcia:\n\n📅 Poniedziałek - Środa: 15:00 - 21:00\n📅 Czwartek - Sobota: 15:00 - 24:00\n📅 Niedziela: 13:00 - 22:00',
        quickReplies: ['Menu z cenami', 'Rezerwacja', 'Zamówienie online']
      };
    }
    
    // Menu ogólne
    if (message.includes('menu') || message.includes('jedzenie') || message.includes('dania')) {
      return {
        text: '🍕 Nasze menu z cenami:\n\n🍔 BURGERY (24-29 zł)\n🌯 TORTILLA (24-29 zł)\n🍕 PIZZA (46-72 zł)\n🍟 DODATKI (4-12 zł)\n\n🔥 PROMOCJA: Zamów dużą pizzę - druga za pół ceny!',
        quickReplies: ['Burgery', 'Pizza', 'Tortilla', 'Dodatki']
      };
    }
    
    // Burgery szczegółowo
    if (message.includes('burger') || message.includes('classic chicken') || message.includes('big king')) {
      return {
        text: '🍔 BURGERY - pełna lista z cenami:\n\n• CLASSIC Chicken Burger - 24 zł\n  Bułka pszenna, 3x stripsy, sałata, pomidor, cebula, ogórek konserwowy, cebula prażona, sos majonezowy\n\n• BIG KING Chicken Burger - 29 zł\n  Bułka pszenna, 3x stripsy, sałata, pomidor, cebula, ogórek konserwowy, 2x ser cheddar, 2x bekon, jalapeño, cebula prażona, sos BBQ, sos majonezowy',
        quickReplies: ['Pizza', 'Tortilla', 'Dodatki', 'Zamów online']
      };
    }
    
    // Pizza szczegółowo
    if (message.includes('pizza') || message.includes('mexicana') || message.includes('italiana') || message.includes('gusto')) {
      return {
        text: '🍕 PIZZA - pełna lista z cenami:\n\n• 11. MEXICANA - 58zł/69zł\n  Sos pomidorowy, mozzarella, wołowina szarpana, jalapeño, kukurydza, cebula\n\n• 12. COUNTRY FIESTA - 46zł/57zł\n  Sos pomidorowy, mozzarella, boczek, kiełbasa, kukurydza, jajko, cebula, czosnek\n\n• 13. ITALIANA - 48zł/58zł\n  Sos pomidorowy, mozzarella, szynka dojrzewająca, pomidorki cherry, rukola, mozzarella, parmezan\n\n• 14. GUSTO - 59zł/72zł\n  Sos pomidorowy, mozzarella, wołowina, baranina, mix papryka, cebula, oliwki',
        quickReplies: ['Więcej pizz', 'Burgery', 'Promocja pizza', 'Zamów online']
      };
    }
    
    // Więcej pizz
    if (message.includes('więcej pizz') || message.includes('melbourne') || message.includes('fantasia') || message.includes('delicja')) {
      return {
        text: '🍕 PIZZA - pozostałe pozycje:\n\n• MELBOURNE - 59zł/72zł\n  Sos pomidorowy, mozzarella, wołowina, baranina, ser cheddar, jalapeño, cebula, pomidor, oliwki, mix pietruszki\n\n• FANTASIA DEL MARE - 59zł/72zł\n  Sos pomidorowy, mozzarella, krewetki kraba, małże, sarczynki, mix papryki, cebula, sos sojowy, sok z limonki\n\n• DELICJA MARINA - 46zł/57zł\n  Sos pomidorowy, mozzarella, pomidor, anchovies, mix papryka, bazylia, mięta, natka pietruszki, sok z limonki\n\n• CHLEBEK Z PARMEZANEM/CZOSNKOWY - 25zł/30zł',
        quickReplies: ['Promocja pizza', 'Burgery', 'Tortilla', 'Zamów online']
      };
    }
    
    // Tortilla szczegółowo
    if (message.includes('tortilla') || message.includes('vege') || message.includes('classic tortilla') || message.includes('power')) {
      return {
        text: '🌯 TORTILLA - pełna lista z cenami:\n\n• VEGE Tortilla - 24 zł\n  Tortilla pszenna, sałata, pomidor, ogórek konserwowy, ogórek zielony, kukurydza, cebula, papryka, sos majonezowy, sos sweet chilli\n\n• CLASSIC Tortilla - 26 zł\n  Tortilla pszenna, 3x stripsy w chrupiącej panierce, sałata, ogórek zielony, czerwona cebula, pomidor, sos czosnowy\n\n• POWER Tortilla - 29 zł\n  Tortilla pszenna, stripsy x3, grillowany bekon, ser cheddar, sałata, ogórek konserwowy, czerwona cebula, sos majonezowy, pomidor, sos BBQ',
        quickReplies: ['Burgery', 'Pizza', 'Dodatki', 'Zamów online']
      };
    }
    
    // Dodatki szczegółowo
    if (message.includes('dodatki') || message.includes('frytki') || message.includes('krążki') || message.includes('sosy')) {
      return {
        text: '🍟 DODATKI - pełna lista z cenami:\n\n• Frytki - 8 zł\n• Krążki Cebulowe - 10 zł\n• Ser w brzegach - 12 zł\n• Sosy/oliwa z oliwek - 6 zł\n• Sery - 10 zł\n• Mięsa, wędliny - 10 zł\n• Ryby, owoce morza - 12 zł\n• Warzywa, owoce - 8 zł\n• Cebula, czosnek - 4 zł\n• Pudełko na wynos - 2 zł',
        quickReplies: ['Burgery', 'Pizza', 'Tortilla', 'Zamów online']
      };
    }
    
    // Promocja pizza
    if (message.includes('promocja') || message.includes('druga za pół') || message.includes('druga pizza')) {
      return {
        text: '🔥 PROMOCJA PIZZA!\n\nZAMÓW DUŻĄ PIZZĘ - DRUGA ZA PÓŁ CENY!\n\n💰 Przykładowe oszczędności:\n• 2x MEXICANA (69zł) = 103,50 zł zamiast 138 zł\n• 2x GUSTO (72zł) = 108 zł zamiast 144 zł\n• 2x ITALIANA (58zł) = 87 zł zamiast 116 zł\n\nOszczędzasz nawet 36 zł!',
        quickReplies: ['Menu pizza', 'Zamów online', 'Burgery', 'Tortilla']
      };
    }
    
    // Rezerwacje
    if (message.includes('rezerwacj') || message.includes('stolik') || message.includes('miejsce')) {
      return {
        text: '📞 Rezerwacje:\n\nZadzwoń: 517-616-618\nEmail: stefano@stefanogroup.pl\n\n🎉 Organizujemy także:\n• Komunie i chrzty\n• 18-stki i urodziny\n• Spotkania firmowe\n• Imprezy z grami planszowymi',
        quickReplies: ['Godziny otwarcia', 'Lokalizacja', 'Zamów online']
      };
    }
    
    // Promocje dzienne
    if (message.includes('promocj') || message.includes('rabat') || message.includes('okazj') || message.includes('zniżk')) {
      const today = new Date().getDay();
      const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
      const dayName = days[today];
      
      const promotions: { [key: string]: string } = {
        'Poniedziałek': 'Cyber Monday Pizza: 2x Pizza średnia za 89 zł (zamiast 116 zł)',
        'Wtorek': 'Tortilla Tuesday: Wszystkie tortille -20% + darmowe frytki',
        'Środa': 'Wing Wednesday: Kubełek kurczaka + 2x sos za 35 zł',
        'Czwartek': 'Burger Thursday: BIG KING Burger + Frytki + Napój za 35 zł',
        'Piątek': 'Pizza Friday: ZAMÓW DUŻĄ PIZZĘ - DRUGA ZA PÓŁ CENY',
        'Sobota': 'Weekend Warriors: Mega Zestaw za 99 zł (Pizza + Kurczak + 2x Napój)',
        'Niedziela': 'Family Sunday: Zestaw Rodzinny za 89 zł (2x Burger + 2x Frytki + 4x Napój)'
      };
      
      return {
        text: `🎉 Promocje dnia (${dayName}):\n\n${promotions[dayName]}\n\n📱 Zainstaluj naszą aplikację na telefonie - kliknij "Dodaj do ekranu głównego" w przeglądarce!\n\nCodziennie mamy nowe promocje!`,
        quickReplies: ['Zamów promocję', 'Menu', 'Pizza', 'Godziny']
      };
    }

    // Sklep z sosami
    if (message.includes('sklep') || message.includes('sos') || message.includes('kup') || message.includes('sprzedam')) {
      return {
        text: '🛒 SKLEP STEFANO - Nasze autorskie sosy:\n\n🥫 STEFANO CLASSIC - 12zł (ziola śródziemnomorskie)\n🌶️ STEFANO FIRE - 15zł (habanero + chili, bardzo ostry!)\n🍖 STEFANO BBQ - 14zł (słodko-kwaśny do grilla)\n🧄 STEFANO GARLIC - 13zł (intensywny czosnek)\n🥗 STEFANO RANCH - 11zł (kremowy z ziołami)\n🍯 STEFANO HONEY MUSTARD - 12zł (miód + musztarda)\n\n📦 Odbiór w restauracji w 30 minut\n💳 Płatność przy odbiorze',
        quickReplies: ['Zamów sosy', 'Które ostre?', 'Składniki', 'Promocje']
      };
    }

    // Zamówienia online
    if (message.includes('zamów') || message.includes('dostaw') || message.includes('online')) {
      return {
        text: '🛒 Zamówienia online z odbiorem:\n\n1️⃣ Wybierz kategorie menu:\n🍕 Pizza (Wszystkie rodzaje)\n🍗 Kurczak (Kubełki i zestawy)\n🍔 Burgery (Big King i inne)\n🌯 Tortille (Różne smaki)\n\n2️⃣ Złóż zamówienie przez WhatsApp: 517-616-618\n3️⃣ Otrzymasz SMS z czasem odbioru\n4️⃣ Odbierz w restauracji (20-30 min)\n\n🛍️ NOWOŚĆ: Sklep z autorskimi sosami!',
        quickReplies: ['Pizza menu', 'Kurczak menu', 'Burger menu', 'Sklep sosów']
      };
    }
    
    // Lokalizacja
    if (message.includes('adres') || message.includes('lokalizacj') || message.includes('gdzie') || message.includes('kościuszki')) {
      return {
        text: '📍 Znajdziesz nas tutaj:\n\nRestauracja & Pub STEFANO\nul. Kościuszki 12\n97-400 Bełchatów\n\n📞 Tel: 517-616-618\n✉️ stefano@stefanogroup.pl\n🌐 www.stefanogroup.pl',
        quickReplies: ['Godziny otwarcia', 'Menu', 'Rezerwacja']
      };
    }
    
    // Gry planszowe
    if (message.includes('gry') || message.includes('planszow') || message.includes('rozrywka')) {
      return {
        text: '🎲 Gry planszowe:\n\n🎯 Ponad 50 tytułów do wypożyczenia\n🆓 Bezpłatne przy zamówieniu\n👨‍👩‍👧‍👦 Dla całej rodziny\n⏰ Dostępne w godzinach otwarcia\n\nOd klasycznych jak Monopoly po nowoczesne gry strategiczne!',
        quickReplies: ['Menu', 'Rezerwacja', 'Godziny otwarcia']
      };
    }
    
    // Obsługa firm
    if (message.includes('firm') || message.includes('biznes') || message.includes('konferencj') || message.includes('spotkanie')) {
      return {
        text: '💼 Obsługa firm:\n\n🏢 Sala konferencyjna dla 20 osób\n🎥 Projektor i ekran\n☕ Przerwy kawowe\n🍽️ Zestawy obiadowe 30-80 zł/os\n🍻 Pakiety imprezowe od 300 zł\n\n⏰ Dostępna: 8:00 - 21:00',
        quickReplies: ['Rezerwacja', 'Menu', 'Kontakt']
      };
    }
    
    // Powitania
    if (message.includes('cześć') || message.includes('hej') || message.includes('witaj') || message.includes('dzień dobry')) {
      return {
        text: 'Cześć! Miło Cię poznać! 😊 Jestem STEFANO bot i chętnie pomogę Ci z wszystkim co związane z naszą restauracją. O czym chciałbyś się dowiedzieć?',
        quickReplies: ['Menu', 'Godziny otwarcia', 'Rezerwacja', 'Zamów online']
      };
    }
    
    // Pizza menu
    if (message.includes('pizza')) {
      return {
        text: '🍕 MENU PIZZA:\n\n🍕 STEFANO SPECIAL - 35zł (salami, pieczarki, papryka, ser)\n🍕 MARGHERITA SUPREME - 28zł (sos, ser mozzarella, bazylia)\n🍕 AMERICANA - 32zł (salami, pieczarki, cebula)\n🍕 QUATTRO STAGIONI - 38zł (4 sezony w jednej)\n🍕 DIAVOLA FIRE - 34zł (salami pikantne, chili)\n\n📱 Zamów przez WhatsApp: 517-616-618',
        quickReplies: ['Zamów przez WhatsApp', 'Kurczak menu', 'Burger menu']
      };
    }
    
    // Kurczak menu
    if (message.includes('kurczak')) {
      return {
        text: '🍗 MENU KURCZAK:\n\n🍗 KUBEŁEK KURCZAKA - 35zł (8 kawałków + frytki + sos)\n🔥 HOT WINGS INFERNO - 28zł (6 skrzydełek pikantnych)\n🥪 CHICKEN ROYAL - 25zł (stripsy + frytki + napój)\n🍖 FAMILY FEAST - 55zł (16 kawałków + 2x frytki + 2x sos)\n🌶️ SPICY DRUMSTICKS - 22zł (4 podudzia w ziołach)\n\n📱 Zamów przez WhatsApp: 517-616-618',
        quickReplies: ['Zamów przez WhatsApp', 'Pizza menu', 'Burger menu']
      };
    }
    
    // Burger menu
    if (message.includes('burger')) {
      return {
        text: '🍔 MENU BURGER:\n\n🍔 BIG KING BURGER - 35zł (podwójne mięso, ser, sos sekretny)\n🍔 STEFAN SPECIAL - 32zł (burger + frytki + napój + sos)\n🔥 INFERNO BURGER - 34zł (jalapeño, chili, pikantny sos)\n🥓 BACON DELUXE - 36zł (podwójny bekon, ser cheddar)\n🍄 MUSHROOM MAGIC - 30zł (pieczarki, ser szwajcarski)\n\n📱 Zamów przez WhatsApp: 517-616-618',
        quickReplies: ['Zamów przez WhatsApp', 'Pizza menu', 'Kurczak menu']
      };
    }
    
    // Tortilla menu
    if (message.includes('tortilla')) {
      return {
        text: '🌯 MENU TORTILLA:\n\n🌯 STEFAN WRAP - 25zł (kurczak, warzywa, sos czosnkowy)\n🔥 FIRE TORTILLA - 27zł (wołowina, jalapeño, sos pikantny)\n🥗 VEGGIE POWER - 22zł (warzywa grillowane, hummus)\n🧀 CHEESE TORNADO - 24zł (3 sery, kurczak, frytki)\n⚡ GRILLED CHICKEN - 26zł (kurczak z grilla, awokado)\n\n📱 Zamów przez WhatsApp: 517-616-618',
        quickReplies: ['Zamów przez WhatsApp', 'Pizza menu', 'Kurczak menu']
      };
    }
    
    // Kontakt
    if (message.includes('kontakt') || message.includes('telefon') || message.includes('email')) {
      return {
        text: '📞 Skontaktuj się z nami:\n\n📱 Telefon: 517-616-618\n✉️ Email: stefano@stefanogroup.pl\n🌐 Web: www.stefanogroup.pl\n📍 ul. Kościuszki 12, Bełchatów\n\n📘 Facebook: Przestrzeń Bełchatów\n📸 Instagram: @przestrzen.belchatow',
        quickReplies: ['Lokalizacja', 'Godziny otwarcia', 'Menu']
      };
    }
    
    // Pytania o ceny konkretnych dań
    if (message.includes('ile kosztuje') || message.includes('cena') || message.includes('cennik')) {
      if (message.includes('pizza')) {
        return {
          text: '💰 Ceny pizzy:\n\n• COUNTRY FIESTA: 46-57 zł\n• ITALIANA: 48-58 zł\n• MEXICANA: 58-69 zł\n• GUSTO/MELBOURNE: 59-72 zł\n• FANTASIA DEL MARE: 59-72 zł\n• DELICJA MARINA: 46-57 zł\n• CHLEBEK: 25-30 zł\n\n(Pierwsza cena = średnia, druga = duża)',
          quickReplies: ['Promocja pizza', 'Burgery', 'Więcej info', 'Zamów online']
        };
      }
      if (message.includes('burger')) {
        return {
          text: '💰 Ceny burgerów:\n\n• CLASSIC Chicken Burger: 24 zł\n• BIG KING Chicken Burger: 29 zł\n\nOba burgery zawierają 3x stripsy w chrupiącej panierce!',
          quickReplies: ['Pizza', 'Tortilla', 'Dodatki', 'Zamów online']
        };
      }
      return {
        text: '💰 Nasze ceny:\n\n🍔 BURGERY: 24-29 zł\n🌯 TORTILLA: 24-29 zł\n🍕 PIZZA: 46-72 zł\n🍟 DODATKI: 4-12 zł\n\nO cenach czego chcesz się dowiedzieć?',
        quickReplies: ['Pizza', 'Burgery', 'Tortilla', 'Dodatki']
      };
    }

    // Pytania o składniki
    if (message.includes('składniki') || message.includes('co zawiera') || message.includes('alergeny')) {
      return {
        text: '📋 Informacje o składnikach:\n\nMogę podać dokładne składniki każdego dania. Napisz nazwę dania, np.:\n• "Classic Chicken Burger"\n• "MEXICANA pizza"\n• "VEGE tortilla"\n\nMożesz też zapytać o alergeny - wszystkie nasze dania zawierają gluten, niektóre produkty mleczne.',
        quickReplies: ['MEXICANA pizza', 'Classic Chicken', 'VEGE tortilla', 'Menu']
      };
    }

    // Pytania o dostępność
    if (message.includes('dostępne') || message.includes('można zamówić') || message.includes('mają państwo')) {
      return {
        text: '✅ Wszystkie pozycje z menu są dostępne codziennie!\n\nMożesz zamówić:\n• Na miejscu w restauracji\n• Na wynos (odbiór osobisty)\n• Przez telefon: 517-616-618\n\nAktualnie nie robimy dostaw, ale mamy wygodny odbiór osobisty z systemem powiadomień SMS.',
        quickReplies: ['Zamów online', 'Godziny otwarcia', 'Menu', 'Rezerwacja']
      };
    }

    // Pytania o rozmiary
    if (message.includes('rozmiar') || message.includes('duża') || message.includes('średnia') || message.includes('mała')) {
      return {
        text: '📏 Rozmiary dań:\n\n🍕 PIZZA: średnia i duża (ceny podane w menu)\n🍔 BURGERY: jeden rozmiar (bardzo sycące!)\n🌯 TORTILLA: jeden rozmiar (duża tortilla)\n🍟 FRYTKI: standardowa porcja\n\nPizza w rozmiarze dużym idealnie wystarczy dla 2 osób!',
        quickReplies: ['Promocja pizza', 'Menu', 'Zamów online', 'Dodatki']
      };
    }

    // Pytania o czas przygotowania
    if (message.includes('ile czasu') || message.includes('jak długo') || message.includes('kiedy będzie gotowe')) {
      return {
        text: '⏱️ Czas przygotowania:\n\n🍕 PIZZA: 15-20 minut\n🍔 BURGERY: 10-15 minut\n🌯 TORTILLA: 8-12 minut\n🍟 DODATKI: 5-8 minut\n\nPodczas złożenia zamówienia otrzymasz SMS z dokładnym czasem odbioru!',
        quickReplies: ['Zamów online', 'Menu', 'Godziny otwarcia', 'Kontakt']
      };
    }

    // Domyślna odpowiedź
    return {
      text: '🤔 Nie jestem pewien jak Ci pomóc z tym pytaniem. Mogę opowiedzieć o:\n\n• Menu z cenami i składnikami\n• Godzinach otwarcia\n• Rezerwacjach\n• Zamówieniach online\n• Lokalizacji\n• Grach planszowych\n• Obsłudze firm\n• Dostępności dań\n• Czasach przygotowania\n\nO czym chciałbyś się dowiedzieć?',
      quickReplies: ['Menu z cenami', 'Godziny otwarcia', 'Rezerwacja', 'Zamów online']
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Track bot interaction
    trackEvent('chatbot_interaction', 'message', text);

    // Get bot response
    try {
      const response = await getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Przepraszam, wystąpił problem. Spróbuj ponownie lub zadzwoń: 517-616-618',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      trackEvent('chatbot_opened', 'interaction', 'chat_toggle');
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="icon"
          className="h-14 w-14 rounded-full bg-stefano-red hover:bg-red-600 shadow-2xl transition-all duration-300 hover:scale-110"
          title="Czat z STEFANO bot"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-96 bg-stefano-gray rounded-xl shadow-2xl border border-stefano-gold/20 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-stefano-red p-4 flex items-center space-x-3">
            <div className="h-8 w-8 bg-stefano-gold rounded-full flex items-center justify-center">
              <Bot size={20} className="text-black" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-white">STEFANO Bot</h3>
              <p className="text-xs text-white/80">Asystent restauracji</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-stefano-red text-white'
                      : 'bg-black text-white border border-stefano-gold/20'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot size={16} className="text-stefano-gold mt-0.5 shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User size={16} className="text-white mt-0.5 shrink-0" />
                    )}
                    <div className="whitespace-pre-line text-sm">{message.text}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-black text-white border border-stefano-gold/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot size={16} className="text-stefano-gold" />
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-stefano-gold rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-stefano-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-stefano-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length > 0 && !isTyping && (
            <div className="p-2 border-t border-stefano-gold/20">
              <div className="flex flex-wrap gap-2">
                {['Menu', 'Godziny', 'Rezerwacja', 'Zamów online'].map((reply) => (
                  <Button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    variant="outline"
                    size="sm"
                    className="text-xs border-stefano-gold/50 text-stefano-gold hover:bg-stefano-gold hover:text-black"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-stefano-gold/20">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                placeholder="Napisz wiadomość..."
                className="flex-1 bg-black border-stefano-gold/50 text-white placeholder:text-gray-400 focus:border-stefano-gold"
              />
              <Button
                onClick={() => sendMessage(inputText)}
                size="icon"
                className="bg-stefano-red hover:bg-red-600"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}