import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { insertOrderSchema } from "@shared/schema";
import OrderMenuSelector from "./order-menu-selector";

// Avatar system removed for simplified ordering

// Simple customer types for ordering
const customerTypes = [
  { id: "woman", name: "Kobieta", emoji: "👩" },
  { id: "man", name: "Mężczyzna", emoji: "👨" }
];

const orderFormSchema = insertOrderSchema.extend({
  customerType: z.string().default("customer"),
  items: z.string().min(1, "Opisz co chcesz zamówić"),
  totalAmount: z.number().min(1, "Podaj kwotę zamówienia"),
  orderType: z.enum(["pickup", "delivery"]),
  paymentMethod: z.enum(["cash", "card", "online"]),
  estimatedTime: z.string().optional()
});

type OrderForm = z.infer<typeof orderFormSchema>;

export default function OrderForm() {
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("woman");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerType: "woman",
      items: "",
      totalAmount: 0,
      orderType: "pickup",
      paymentMethod: "cash",
      estimatedTime: "25 min"
    }
  });

  const createOrder = useMutation({
    mutationFn: async (data: OrderForm) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Zamówienie złożone!",
        description: `Twoje zamówienie #${data.order.id} zostało przyjęte. Czas przygotowania: ${data.order.estimatedTime}`,
      });
      form.reset();
      setSelectedCustomerType("woman");
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error) => {
      toast({
        title: "Błąd zamówienia",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCustomerTypeSelect = (type: string) => {
    setSelectedCustomerType(type);
    form.setValue("customerType", type);
  };

  const handleOrderChange = (items: string, totalAmount: number) => {
    form.setValue("items", items);
    form.setValue("totalAmount", totalAmount);
  };

  const onSubmit = (data: OrderForm) => {
    console.log("Form data:", data);
    console.log("Selected customer type:", selectedCustomerType);
    console.log("Form errors:", form.formState.errors);
    
    // Multiply by 100 to convert to cents for backend
    const orderData = {
      ...data,
      totalAmount: Math.round(Number(data.totalAmount) * 100)
    };
    createOrder.mutate(orderData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stefano-red to-stefano-gold bg-clip-text text-transparent">
          Złóż Zamówienie z Odbiorem
        </h1>
        <p className="text-lg text-gray-300">
          Wybierz swój profil i złóż zamówienie
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customer Type Selection */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-stefano-gold flex items-center gap-2">
              <Star className="w-5 h-5" />
              Typ klienta
            </CardTitle>
            <CardDescription>
              Wybierz swój profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {customerTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                    selectedCustomerType === type.id
                      ? 'border-stefano-red bg-stefano-red/10'
                      : 'border-gray-600 hover:border-stefano-gold'
                  }`}
                  onClick={() => handleCustomerTypeSelect(type.id)}
                >
                  <div className="text-center">
                    <div className="mb-3 flex justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-stefano-gold/50 flex items-center justify-center bg-gray-700 overflow-hidden text-2xl">
                        {type.emoji}
                      </div>
                    </div>
                    <h3 className="font-bold text-stefano-gold">{type.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-stefano-gold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Szczegóły Zamówienia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imię i nazwisko</FormLabel>
                      <FormControl>
                        <Input placeholder="Jan Kowalski" className="bg-gray-700 border-gray-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="517-616-618" className="bg-gray-700 border-gray-600" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (opcjonalny)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="jan@example.com" 
                          className="bg-gray-700 border-gray-600" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interactive Menu Selector */}
                <FormField
                  control={form.control}
                  name="items"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-stefano-gold text-lg font-bold">Co chcesz zamówić?</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <OrderMenuSelector onOrderChange={handleOrderChange} />
                          {field.value && (
                            <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                              <p className="text-sm text-gray-300 font-medium">Twoje zamówienie:</p>
                              <p className="text-stefano-gold">{field.value}</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Kwota jest automatycznie obliczana przez menu */}

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sposób płatności</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Wybierz sposób płatności" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Gotówka przy odbiorze</SelectItem>
                          <SelectItem value="card">Karta przy odbiorze</SelectItem>
                          <SelectItem value="online">Płatność online</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-stefano-red to-stefano-gold hover:from-stefano-gold hover:to-stefano-red text-white font-bold py-3"
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Składanie zamówienia...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Złóż zamówienie z odbiorem
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Order Instructions */}
      <Card className="bg-gray-800 border-gray-700 mt-8">
        <CardHeader>
          <CardTitle className="text-stefano-gold">Instrukcja odbioru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-stefano-red w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">1</div>
              <h3 className="font-bold mb-2">Wypełnij Formularz</h3>
              <p className="text-sm text-gray-400">Podaj dane kontaktowe i zamówienie</p>
            </div>
            <div className="text-center">
              <div className="bg-stefano-red w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">2</div>
              <h3 className="font-bold mb-2">Złóż Zamówienie</h3>
              <p className="text-sm text-gray-400">Wypełnij formularz i wyślij</p>
            </div>
            <div className="text-center">
              <div className="bg-stefano-red w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">3</div>
              <h3 className="font-bold mb-2">Odbierz w Restauracji</h3>
              <p className="text-sm text-gray-400">Czas przygotowania: 20-30 min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}