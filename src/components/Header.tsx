'use client';
import Link from 'next/link';
import { PAGES } from '@/app/config/pages.config';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="ml-7 p-5 font-bold bg-black">
      <nav className="flex items-center gap-4">
        <Link
          className={
            pathname === PAGES.HOME ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.HOME}
        >
          Home{' '}
        </Link>

        <div className='bg-white/15 rounded-full h-5 w-[1px]'></div>

        <Link
          className={
            pathname === PAGES.PRODUCTS ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.PRODUCTS}
        >
          Products{' '}
        </Link>

        <div className='bg-white/15 rounded-full h-5 w-[1px]'></div>

        <Link
          className={
            pathname === PAGES.CART ? 'text-[#78a068]' : 'text-white/80'
          }
          href={PAGES.CART}
        >
          Cart{' '}
        </Link>
      </nav>
      <div className="width-full h-[1px] mt-5 bg-white/10"></div>
    </header>
  );
}