"use client"
import { IoBedOutline } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"

export default function Furniture() {
   return (
      <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
               <IoBedOutline className="text-highlight text-3xl" />
            </div>

            <div className="flex flex-col">
               <span className="text-foreground text-lg font-semibold">
                  Furniture on Rent
               </span>
               <p className="text-sm text-muted">
                  Style your space effortlessly—rent premium furniture today!
               </p>
            </div>
         </div>

         <Tabs defaultValue="livingroom" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-5 bg-highlight">

               <TabsTrigger value="livingroom" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Living&nbsp;Room</TabsTrigger>

               <TabsTrigger value="kitchen" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Kitchen&nbsp;&&nbsp;Dining</TabsTrigger>

               <TabsTrigger value="bedroom" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Bedroom</TabsTrigger>

               <TabsTrigger value="work" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Work</TabsTrigger>

               <TabsTrigger value="baby" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Baby</TabsTrigger>
            </TabsList>

            <TabsContent value="livingroom" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

            <TabsContent value="kitchen" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

            <TabsContent value="bedroom" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

            <TabsContent value="work" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

            <TabsContent value="baby" className="max-h-[500px] overflow-y-auto scrollbar-hide">
               <div className="grid grid-cols-3 gap-4 mt-4">
                  
               </div>
            </TabsContent>

         </Tabs>
      </main>
   );
}