import Header from "@/components/header";
import Footer from "@/components/footer";
import OrderForm from "@/components/order-form";

export default function Order() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20 pb-16">
        <OrderForm />
      </div>
      <Footer />
    </div>
  );
}