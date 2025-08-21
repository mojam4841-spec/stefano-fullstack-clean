import Header from "@/components/header";
import Hero from "@/components/hero";
import OpeningHours from "@/components/opening-hours";
import DailyPromotions from "@/components/daily-promotions";
import MenuSection from "@/components/menu-section";
import OnlineOrdering from "@/components/online-ordering";
import Shop from "@/components/shop";
import BoardGames from "@/components/board-games";
import FamilyEvents from "@/components/family-events";
import BusinessServices from "@/components/business-services";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import VisitCounter from "@/components/visit-counter";
import SharingWidget from "@/components/sharing-widget";
import Chatbot from "@/components/chatbot";
import SEOAssistant from "@/components/seo-assistant";
import { MobileAppDownload } from "@/components/mobile-app-download";
import ButtonTester from "@/components/button-tester";
import { EnterpriseTestSuite } from "@/components/enterprise-test-suite";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <OpeningHours />
      <DailyPromotions />
      <MenuSection />
      <OnlineOrdering />
      <Shop />
      <BoardGames />
      <FamilyEvents />
      <BusinessServices />
      <MobileAppDownload />
      <Contact />
      <Footer />
      <VisitCounter />
      <SharingWidget />
      <Chatbot />
      <SEOAssistant />
      <ButtonTester />
      <EnterpriseTestSuite />
    </div>
  );
}
