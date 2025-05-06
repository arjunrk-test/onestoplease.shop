"use client"
import { CiDumbbell } from "react-icons/ci";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"

export default function Fitness(){
   return (
            <main className="h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col items-start p-6 px-48">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center">
                     <CiDumbbell className="text-highlight text-3xl" />
                  </div>
      
                  <div className="flex flex-col">
                     <span className="text-foreground text-lg font-semibold">
                        Fitness equipments on Rent
                     </span>
                     <p className="text-sm text-muted">
                        Level up your workouts—rent premium fitness gear today!
                     </p>
                  </div>
               </div>
      
               <Tabs defaultValue="treadmills" className="w-full mt-8">
                  <TabsList className="grid w-full grid-cols-4 bg-highlight">
      
                     <TabsTrigger value="treadmills" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Treadmills</TabsTrigger>
      
                     <TabsTrigger value="crossTrainers" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Cross&nbsp;Trainers</TabsTrigger>
      
                     <TabsTrigger value="exerciseBikes" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Exercise&nbsp;Bikes</TabsTrigger>
      
                     <TabsTrigger value="massagers" className="data-[state=active]:bg-foreground data-[state=active]:text-background dark:data-[state=active]:text-background text-black/80">Massagers</TabsTrigger>
      
                  </TabsList>
      
                  <TabsContent value="treadmills" className="max-h-[500px] overflow-y-auto scrollbar-hide">
                     <div className="grid grid-cols-3 gap-4 mt-4">
                        
                     </div>
                  </TabsContent>
      
                  <TabsContent value="crossTrainers" className="max-h-[500px] overflow-y-auto scrollbar-hide">
                     <div className="grid grid-cols-3 gap-4 mt-4">
                        
                     </div>
                  </TabsContent>
      
                  <TabsContent value="exerciseBikes" className="max-h-[500px] overflow-y-auto scrollbar-hide">
                     <div className="grid grid-cols-3 gap-4 mt-4">
                        
                     </div>
                  </TabsContent>
      
                  <TabsContent value="massagers" className="max-h-[500px] overflow-y-auto scrollbar-hide">
                     <div className="grid grid-cols-3 gap-4 mt-4">
                        
                     </div>
                  </TabsContent>
      
               </Tabs>
            </main>
         );
}