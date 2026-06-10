import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: 'WorkWrite AI',
  description: 'A lightweight workplace writing assistant.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto w-full max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
