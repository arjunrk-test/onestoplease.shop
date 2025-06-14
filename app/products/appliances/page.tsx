"use client";
import { IoBedOutline } from "react-icons/io5";
import useIsMobile from "@/hooks/useIsMobile";
import { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import MobileProductGrid from "@/components/MobileProductGrid";
import { Button } from "@/components/ui/button";

const subcategories = [
  { key: "livingroom", label: "Living Room" },
  { key: "kitchen", label: "Kitchen" },
  { key: "bedroom", label: "Bedroom" },
  { key: "washing", label: "Washing Machine" },
];

export default function Appliances() {
  const isMobile = useIsMobile();
    const [selected, setSelected] = useState(subcategories[0].key);
    const [hydrated, setHydrated] = useState(false);
  
    useEffect(() => {
      setHydrated(true);
    }, []);
    if (!hydrated) return null;
  
    return (
        <main className="h-auto min-h-[calc(100vh-112px)] bg-gray text-foreground flex flex-col px-4 sm:px-6 lg:px-16 xl:px-48 pt-6 space-y-6">
          {isMobile ? (
            <>
              {/* Sticky Header: icon + text + pills */}
              <div className="sticky top-[164px] z-20 bg-gray pb-2 pt-1 space-y-3">
                {/* Icon + Text */}
                <div className="flex items-center gap-4 w-full h-16 px-1">
                  <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center shrink-0">
                    <IoBedOutline className="text-highlight text-2xl" />
                  </div>
                  <div className="flex flex-col justify-center h-full overflow-hidden">
                    <span className="text-lg font-semibold text-foreground leading-none">
                      Appliances on Rent
                    </span>
                    <p className="text-xs sm:text-sm text-muted leading-tight">
                      Upgrade your home hassle-free—rent top-notch appliances today!
                    </p>
                  </div>
                </div>
    
                {/* Scrollable Pills */}
                <div className="overflow-x-auto scrollbar-hide px-1">
                  <div className="flex gap-2 min-w-max">
                    {subcategories.map(({ key, label }) => (
                      <Button
                        key={key}
                        onClick={() => setSelected(key)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition ${selected === key
                            ? "bg-highlight text-white border-highlight"
                            : "bg-white text-black border-gray-300"
                          }`}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
    
              {/* Product Cards */}
              <MobileProductGrid category="Appliances" selected={selected} />
            </>
          ) : (
            <>
              {/* Desktop View */}
              <div className="flex items-center gap-4 w-full h-16 sticky top-[116px] p-4 pt-4 pb-2 z-10 bg-gray">
                <div className="w-16 h-16 bg-background shadow-lg rounded-lg flex items-center justify-center shrink-0">
                  <IoBedOutline className="text-highlight text-2xl" />
                </div>
                <div className="flex flex-col justify-center h-full overflow-hidden">
                  <span className="text-lg font-semibold text-foreground leading-none">
                    Appliances on Rent
                  </span>
                  <p className="text-sm text-muted leading-tight">
                    Upgrade your home hassle-free—rent top-notch appliances today!
                  </p>
                </div>
              </div>
    
              <ProductGrid category="Appliances" subcategories={subcategories} />
            </>
          )}
        </main>
      );
}
