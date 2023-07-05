import './globals.css'
import { Figtree } from 'next/font/google'

const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Question Bank',
  description: 'tools for viewing question banks',
}

import React, { ReactNode } from 'react';
import Link from 'next/link';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center text-base font-sans">
          <div className="text-2xl font-bold">Question Bank</div>
          <nav>
            <ul className="list-none m-10 p-0 flex">
              <li>
                <Link href="/questionbank">Question Bank</Link>
              </li>
              <li>
                <Link href="/randomquestiongenerator">Random Question Generator</Link>
              </li>
              <li>
                <Link href="/exampapergenerator">Exam Paper Generator</Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center">
            <a href="/login" className="layoutlink">Login</a>
            <a href="/register" className="layoutlink">Register</a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
