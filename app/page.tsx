"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import { Categories } from "./constants";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen flex flex-col bg-gray"> 
      <Navbar />
      <section className="w-full px-6 py-10 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Text Content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Rent Smarter with <span className="text-highlight">OneStopLease</span>
            </h1>
            <p className="mt-6 text-md text-foreground">
              Affordable rentals for furniture, appliances, electronics and many more. All in one place, experience fast delivery, easy returns, and hassle-free service.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products">
                <Button className="px-6 py-3 text-base bg-highlight hover:bg-highlight/80">Explore Products</Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img
              src="/hero.svg"
              alt="Rental service illustration"
              className="w-full max-w-md mx-auto "
            />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="w-full px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Categories.map((category) => (
              <Link key={category.name} href={`/products/${category.category}`}>
              <div className="bg-background p-4 rounded-xl shadow hover:shadow-xl hover:shadow-accent transition-all cursor-pointer flex flex-col items-center justify-center group">
                <div className="text-2xl text-highlight group-hover:text-accent transition-colors">
                  {category.icon}
                </div>
                <p className="text-xs p-2 font-medium text-foreground">{category.name}</p>
              </div>
            </Link>            
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="text-center py-2 text-sm text-foreground mt-auto">
        © {new Date().getFullYear()} OneStopLease. All rights reserved.
      </footer>
    </main>
  );
}