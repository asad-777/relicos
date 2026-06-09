import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer items-center p-8 bg-neutral text-neutral-content font-body border-t-2 border-base-content">
      <aside className="items-center grid-flow-col">
        <p className="text-lg">© {new Date().getFullYear()} Relic OS. All rights reserved.</p>
      </aside> 
      <nav className="grid-flow-col gap-6 md:place-self-center md:justify-self-end uppercase font-heading">
        <Link href="/admin" className="hover:text-primary transition-colors">Admin Panel</Link>
        <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
      </nav>
    </footer>
  );
}
