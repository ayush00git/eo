import Image from 'next/image';
import Link from 'next/link';

function Header() {
  return (
    <header className="relative bg-neutral-900">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {/* Rendered at the logo's real 651:105 aspect ratio so it no longer
              gets stretched by mismatched width/height props. */}
          <Image
            src="/logo.png"
            alt="NIT Hamirpur Logo"
            width={651}
            height={105}
            className="h-9 w-auto sm:h-11"
            priority
          />
          <div className="hidden border-l border-white/15 pl-3 sm:block">
            <p className="text-base font-semibold tracking-tight text-white sm:text-lg">
              Campus Venue Booking
            </p>
            <p className="text-xs text-white/50">
              National Institute of Technology, Hamirpur
            </p>
          </div>
        </Link>
      </div>
      <div className="brand-accent-bar h-0.5 w-full" />
    </header>
  );
}

export default Header;
