"use client";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/ui/tabs"
export default function Electronics() {
   return (
      <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
               <HiOutlineDevicePhoneMobile className="text-highlight text-3xl" />
            </div>

            <div className="flex flex-col">
               <span className="text-foreground text-lg font-semibold">
                  Electronics on Rent
               </span>
               <p className="text-sm text-muted">
                  Power up your life with gadgets you need, when you need them.
               </p>
            </div>
         </div>

         <Tabs defaultValue="smartphones" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-highlight">
               <TabsTrigger value="smartphones" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Smartphones</TabsTrigger>
               <TabsTrigger value="laptops" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Laptops</TabsTrigger>
            </TabsList>
            <TabsContent value="smartphones" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

            <TabsContent value="laptops" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

         </Tabs>
      </main>
   );
}