import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function SharingWidget() {
  const sharePromotion = async () => {
    trackEvent('share', 'promotion', 'share_button');
    
    const shareData = {
      title: 'Stefano - Najlepsza restauracja w Bełchatowie!',
      text: 'Sprawdź menu i zamów online z odbiorem. Delicious Pizza & Family Chicken King!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers without Web Share API
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(shareData.text);
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
      
      // Also suggest visiting our Facebook page
      const confirmShare = confirm('Udostępnić na Facebooku? Kliknij OK aby udostępnić lub Anuluj aby odwiedzić naszą stronę Facebook Przestrzeń Bełchatów');
      
      if (confirmShare) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      } else {
        window.open('https://www.facebook.com/Przestrzen.Belchatow', '_blank');
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={sharePromotion}
        size="icon"
        className="bg-stefano-gray/90 hover:bg-stefano-gray backdrop-blur-sm rounded-full p-4 shadow-2xl text-stefano-gold hover:text-white transition-colors"
        title="Udostępnij promocję"
      >
        <Share2 size={24} />
      </Button>
    </div>
  );
}
