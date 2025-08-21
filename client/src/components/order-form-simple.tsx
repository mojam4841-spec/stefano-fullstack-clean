import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { insertOrderSchema } from "@shared/schema";
import OrderMenuSelector from "./order-menu-selector";

const orderFormSchema = insertOrderSchema.extend({
  items: z.string().min(1, "Opisz co chcesz zamówić"),
  totalAmount: z.number().min(1, "Podaj kwotę zamówienia"),
  orderType: z.enum(["pickup", "delivery"]),
  paymentMethod: z.enum(["cash", "card", "online"]),
  estimatedTime: z.string().optional(),
  // Szczegółowe dane adresowe dla dostawy
  deliveryStreet: z.string().optional(),
  deliveryApartment: z.string().optional().transform(val => val === "puste pole" ? "" : val), 
  deliveryCity: z.string().optional(),
  deliveryPostalCode: z.string().optional().transform(val => val === "puste pole" ? "" : val),
  deliveryDistrict: z.string().optional().transform(val => val === "puste pole" ? "" : val),
  deliveryFloor: z.string().optional().transform(val => val === "puste pole" ? "" : val),
  deliveryBuildingCode: z.string().optional().transform(val => val === "puste pole" ? "" : val),
  deliveryLandmarks: z.string().optional().transform(val => val === "puste pole" ? "" : val),
  deliveryDriverNotes: z.string().optional().transform(val => val === "puste pole" ? "" : val),
  deliveryContactPhone: z.string().optional().transform(val => val === "puste pole" ? "" : val)
}).refine((data) => {
  if (data.orderType === "delivery") {
    return data.deliveryStreet && data.deliveryCity;
  }
  return true;
}, {
  message: "Adres ulicy i miasto są wymagane dla dostawy",
  path: ["deliveryStreet"]
});

type OrderForm = z.infer<typeof orderFormSchema>;

export default function OrderForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      items: "",
      totalAmount: 0,
      orderType: "pickup",
      paymentMethod: "cash",
      estimatedTime: "25 min",
      deliveryStreet: "",
      deliveryApartment: "",
      deliveryCity: "Bełchatów",
      deliveryPostalCode: "",
      deliveryDistrict: "",
      deliveryFloor: "",
      deliveryBuildingCode: "",
      deliveryLandmarks: "",
      deliveryDriverNotes: "",
      deliveryContactPhone: ""
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

  const handleOrderChange = (items: string, totalAmount: number) => {
    form.setValue("items", items);
    form.setValue("totalAmount", totalAmount);
  };

  const onSubmit = (data: OrderForm) => {
    console.log("Form data:", data);
    console.log("Form errors:", form.formState.errors);
    
    // Multiply by 100 to convert to cents for backend
    const orderData = {
      ...data,
      totalAmount: Math.round(data.totalAmount * 100)
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
          Złóż zamówienie z odbiorem
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
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
                        <Input placeholder="+48 123 456 789" className="bg-gray-700 border-gray-600" {...field} />
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
                      <FormLabel>Email (opcjonalnie)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="jan@example.com" 
                          type="email" 
                          className="bg-gray-700 border-gray-600" 
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-stefano-gold">Wybierz z menu</h3>
                  <OrderMenuSelector onOrderChange={handleOrderChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orderType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sposób odbioru</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue placeholder="Wybierz sposób odbioru" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pickup">Odbiór osobisty</SelectItem>
                            <SelectItem value="delivery">Dostawa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            <SelectItem value="cash">Gotówka</SelectItem>
                            <SelectItem value="card">Karta</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Szczegółowe dane adresowe dla dostawy */}
                {form.watch("orderType") === "delivery" && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-stefano-gold/20">
                    <h3 className="text-lg font-semibold text-stefano-gold mb-4">📍 Szczegółowy adres dostawy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="deliveryStreet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-400">*Ulica i numer domu</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="np. ul. Kolejowa 15" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryApartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mieszkanie/Lokal</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="np. m. 15, lok. 2A" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-400">*Miasto</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Bełchatów" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kod pocztowy</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="97-400" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryDistrict"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dzielnica/Osiedle</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="np. Centrum, Kaszewska" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryFloor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Piętro</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="np. parter, 2 piętro" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryBuildingCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kod do bramy/Domofon</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="np. #1234, nazwisko" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dodatkowy telefon</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="telefon do dostawy" 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="deliveryLandmarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Punkty orientacyjne</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="np. przy sklepie Żabka, za szkołą, czerwony blok..." 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryDriverNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Uwagi dla kierowcy</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Dodatkowe informacje dla kierowcy: parking, wejście, specjalne uwagi..." 
                                className="bg-gray-700 border-gray-600"
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-3 p-3 bg-blue-900/30 rounded border border-blue-500/30">
                      <p className="text-sm text-blue-300">
                        <span className="font-semibold">💡 Wskazówka:</span> Im więcej szczegółów podasz, tym łatwiej kierowca znajdzie Twój adres i dostawa będzie szybsza!
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <div className="bg-gray-900 p-4 rounded-lg border border-stefano-gold/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">Całkowita kwota:</span>
                      <span className="text-2xl font-bold text-stefano-gold">
                        {form.watch("totalAmount")?.toFixed(2)} zł
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Czas przygotowania:</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {form.watch("estimatedTime") || "25 min"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-stefano-red hover:bg-red-600 text-lg py-3"
                  disabled={createOrder.isPending || form.watch("totalAmount") === 0}
                >
                  {createOrder.isPending ? "Składanie zamówienia..." : "Złóż Zamówienie"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gray-900 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="text-stefano-gold text-center">Jak zamówić?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="text-center">
                <div className="bg-stefano-red w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">1</div>
                <h3 className="font-bold mb-2">Złóż Zamówienie</h3>
                <p className="text-sm text-gray-400">Wypełnij formularz i wyślij</p>
              </div>
              <div className="text-center">
                <div className="bg-stefano-red w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">2</div>
                <h3 className="font-bold mb-2">Odbierz w Restauracji</h3>
                <p className="text-sm text-gray-400">Czas przygotowania: 20-30 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}