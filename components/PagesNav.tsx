"use client"
import React from 'react';
import { usePathname } from 'next/navigation';
import { CategoriesPath } from '@/app/constants';

export default function PagesNav() {
  const pathname = usePathname();
  const currentItem = CategoriesPath.find(category => pathname === category.pathName)?.name || 'Home';

  return (
    <div className="bg-background sticky top-[64px] z-20 py-4 px-48 shadow-md">
      {/* Flex Container for Breadcrumbs and Menu Items */}
      <div className="flex justify-between items-center px-6">
        {/* Breadcrumbs (Aligned Left) */}
        <nav className="text-highlight text-xs">
          <span 
            className='cursor-pointer'
            onClick={() => {
              window.location.href = '/';
            }}>Home&nbsp;</span> 
          <span className='text-foreground'>&gt;&nbsp;</span>  
          <span className="text-foreground text-xs">{currentItem}</span>
        </nav>

        {/* Menu Items (Aligned Right) */}
        <ul className="flex  gap-6">
          {CategoriesPath.map((category) => (
            <li
              key={category.category}
              onClick={() => {
                window.location.href = category.pathName;
              }}
              className={`text-foreground text-xs cursor-pointer ${category.name === currentItem ? 'underline decoration-highlight decoration-1 underline-offset-4' : ''}`}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
