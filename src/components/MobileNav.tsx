'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href:'/hub',                    icon:'⊞', label:'Hub'         },
  { href:'/apps/creatorseal/dashboard', icon:'🛡', label:'Seal'   },
  { href:'/apps/reviewradar/dashboard', icon:'⭐', label:'Reviews' },
  { href:'/workflows',              icon:'⚡', label:'Flows'       },
  { href:'/coins',                  icon:'🪙', label:'Coins'       },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-gray-800"
      style={{background:'rgba(3,5,10,.97)',backdropFilter:'blur(20px)'}}>
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(item=>{
          const active = path.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{background:active?'rgba(0,212,255,.1)':'transparent'}}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-xs font-mono" style={{color:active?'#00D4FF':'rgba(255,255,255,.35)'}}>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-safe" style={{paddingBottom:'env(safe-area-inset-bottom)'}}/>
    </nav>
  );
}
