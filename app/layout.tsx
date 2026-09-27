import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = { title: 'Voice Note Idea Catcher' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
