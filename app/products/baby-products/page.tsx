"use client"
import { PiBabyCarriageLight } from "react-icons/pi";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"

export default function BabyProducts(){
   return (
            <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
                     <PiBabyCarriageLight className="text-highlight text-3xl" />
                  </div>
      
                  <div className="flex flex-col">
                     <span className="text-foreground text-lg font-semibold">
                        Baby & Kids products on Rent
                     </span>
                     <p className="text-sm text-muted">
                        Make parenting easier—rent top-quality baby & kids essentials hassle-free!
                     </p>
                  </div>
               </div>
      
               <Tabs defaultValue="babyFurniture" className="w-full mt-8">
                  <TabsList className="grid w-full grid-cols-2 bg-highlight">
      
                     <TabsTrigger value="babyFurniture" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Baby&nbsp;Furniture</TabsTrigger>
      
                     <TabsTrigger value="kidsBikes" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Kids&nbsp;Bikes</TabsTrigger>
      
                  </TabsList>
      
                  <TabsContent value="babyFurniture" className="max-h-[500px] overflow-y-auto scrollbar-hide">
                     <div className="grid grid-cols-3 gap-4 mt-4">
                        
                     </div>
                  </TabsContent>
      
                  <TabsContent value="kidsBikes" className="max-h-[500px] overflow-y-auto scrollbar-hide">
                     <div className="grid grid-cols-3 gap-4 mt-4">
                        
                     </div>
                  </TabsContent>
      
               </Tabs>
            </main>
         );
}