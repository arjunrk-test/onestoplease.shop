"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-white text-black/80 rounded-lg shadow p-4 w-full aspect-square flex flex-col items-center justify-between">
      <img
        src={product.image_url}
        alt={product.name}
        className="max-w-full max-h-[70%] object-contain rounded"
      />
      <div className="w-full text-center">
        <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm">₹{product.price} / month</p>
      </div>

      {/* Hover Icon Actions */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-opacity duration-300 z-10 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="bg-black/80 hover:bg-muted p-3 rounded-full shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13l-1.5-7M9 21h6" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/80 text-white">
              <p>Add to Cart</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="bg-black/80 hover:bg-muted p-3 rounded-full shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/80 text-white">
              <p>Wishlist</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="bg-black/80 hover:bg-muted p-3 rounded-full shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19 21l-4-4m0 0a7 7 0 10-10 0 7 7 0 0010 0z" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black/80 text-white">
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
