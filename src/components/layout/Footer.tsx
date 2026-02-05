// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-card/30 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand & Mission */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 w-fit">
            <img 
              src={theme === "dark" ? "/icons/vs1.svg" : "/icons/vs2.svg"} 
              alt="VaultString Logo"
              className="h-20 w-auto md:h-24 lg:h-24 transition-all"
            />
          </Link>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Pioneering tech-enabled microfinance in Malawi. Empowering salaried workers and SMEs with sustainable credit solutions.
          </p>
          <div className="flex gap-3">
            <SocialIcon Icon={Twitter} />
            <SocialIcon Icon={Linkedin} />
            <SocialIcon Icon={Facebook} />
          </div>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-slate-900 dark:text-zinc-300">
            Solutions
          </h4>
          <ul className="space-y-4">
            <FooterLink href="/dashboard/payroll">Payroll Lending</FooterLink>
            <FooterLink href="/dashboard/sme">SME Working Capital</FooterLink>
            <FooterLink href="/dashboard/orders">Order Finance</FooterLink>
            <FooterLink href="/dashboard/invoice">Invoice Discounting</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 text-slate-900 dark:text-zinc-300">
            Get in Touch
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-400 leading-tight group">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              </div>
              <span className="mt-1">Area 4, Lilongwe, Malawi</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-zinc-400 group">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
              </div>
              <span>thrive@vaultstring.com</span>
            </li>
          </ul>
        </div>

        {/* Trust Card */}
        <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary-200/20 dark:bg-primary-400/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <h4 className="font-bold text-[10px] uppercase tracking-widest mb-4 text-primary-700 dark:text-primary-300 relative z-10">
            Regulatory Notice
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 relative z-10">
            VaultString Thrive is a licensed non-deposit-taking Microfinance Institution under the Reserve Bank of Malawi.
          </p>
          <div className="pt-4 border-t border-primary-200/50 dark:border-primary-800/30 relative z-10">
            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase">
              License No: MFI/2026/001
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[11px]">
        <p className="text-slate-500 dark:text-zinc-500 font-medium">
          © {new Date().getFullYear()} VaultString. Tech-Enabled Microfinance.
        </p>
        <div className="flex gap-8">
          <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Terms of Use
          </Link>
          <Link href="#" className="text-slate-500 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon }: { Icon: any }) => (
  <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 active:scale-90">
    <Icon size={18} />
  </button>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="text-sm text-slate-600 dark:text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center gap-2 group">
      <span className="w-1 h-1 rounded-full bg-primary-500 dark:bg-primary-400 scale-0 group-hover:scale-100 transition-transform duration-300" />
      {children}
    </Link>
  </li>
);