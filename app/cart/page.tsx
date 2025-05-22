"use client";

import { useCartStore } from "@/lib/cartStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import MobileNavbar from "@/components/MobileNavbar";
import useIsMobile from "@/hooks/useIsMobile";

export default function CartPage() {
   const { items, removeFromCart, clearCart, addToCart, hasHydrated } = useCartStore();
   const router = useRouter();
   const isMobile = useIsMobile();

   if (!hasHydrated) {
      return (
         <main className="min-h-screen flex flex-col bg-gray">
            {isMobile ? <MobileNavbar /> : <Navbar />}
            <div className="flex-1 flex items-center justify-center">
               <Spinner />
            </div>
         </main>
      );
   }

   const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
   );

   if (items.length === 0) {
      return (
         <main className="min-h-screen flex flex-col bg-gray">
            {isMobile ? <MobileNavbar /> : <Navbar />}
            <div className="flex flex-col items-center justify-center flex-1 text-center p-6 bg-background text-foreground">
               <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
               <Button onClick={() => router.push("/products")} className="bg-highlight hover:bg-highlightHover">
                  Continue Shopping
               </Button>
            </div>
         </main>
      );
   }

   return (
      <main className="min-h-screen flex flex-col bg-gray">
         {isMobile ? <MobileNavbar /> : <Navbar />}
         <div className="px-6 py-10 max-w-6xl mx-auto w-full bg-background">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Your Cart</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Left: Cart Items */}
               <div className="md:col-span-2 space-y-6">
                  {items.map((item) => (
                     <div
                        key={item.id}
                        className="flex items-center justify-between bg-foreground text-background border p-4 rounded-lg shadow-sm"
                     >
                        <div className="flex items-center gap-4">
                           <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-20 h-20 object-contain rounded"
                           />
                           <div>
                              <h2 className="font-semibold text-lg">{item.name}</h2>
                              <p className="text-sm text-muted">₹{item.price} x {item.quantity}</p>
                              <div className="flex items-center gap-2 mt-2">
                                 <Button
                                    variant="default"
                                    className="text-highlight text-xl"
                                    size="sm"
                                    onClick={() => {
                                       if (item.quantity > 1) {
                                          useCartStore.setState((state) => ({
                                             items: state.items.map((i) =>
                                                i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                                             ),
                                          }));
                                       }
                                    }}
                                 >
                                    -
                                 </Button>
                                 <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                 <Button
                                    variant="default"
                                    className="text-highlight text-xl"
                                    size="sm"
                                    onClick={() => {
                                       if (item.quantity >= 4) {
                                          toast.warning("You have exceeded the quantity limit for this item.", {
                                             description:
                                                "Please contact our customer care team directly for bulk/B2B orders.",
                                          });
                                          return;
                                       }
                                       useCartStore.setState((state) => ({
                                          items: state.items.map((i) =>
                                             i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                                          ),
                                       }));
                                    }}
                                 >
                                    +
                                 </Button>
                              </div>
                           </div>
                        </div>
                        <Button
                           variant="destructive"
                           onClick={() => removeFromCart(item.id)}
                           className="text-sm text-background"
                        >
                           Remove
                        </Button>
                     </div>
                  ))}
               </div>

               {/* Right: Summary */}
               <div className="bg-foreground text-background p-6 rounded-lg shadow-sm h-fit flex flex-col justify-between">
                  <h3 className="text-xl font-semibold mb-4">Price Details</h3>
                  <div className="text-sm mb-6 space-y-1">
                     <div className="flex justify-between">
                        <span>Total Products:</span>
                        <span>{items.length}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Total Items:</span>
                        <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                     </div>
                     <div className="flex justify-between font-medium pt-2 border-t mt-2">
                        <span>Total Price:</span>
                        <span>₹{totalPrice}</span>
                     </div>
                  </div>


                  <div className="flex flex-col gap-3">
                     <Button
                        variant="outline"
                        onClick={clearCart}
                        className="text-sm border-red-500 text-red-500 hover:bg-red-50"
                     >
                        Clear Cart
                     </Button>
                     <Button
                        onClick={() => alert("Checkout coming soon!")}
                        className="bg-highlight hover:bg-highlightHover text-sm"
                     >
                        Proceed to Checkout
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}
