// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border/50 bg-card/40 backdrop-blur-sm pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Mission */}
        <div className="space-y-5">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <img 
              src={theme === "dark" ? "/icons/vs1.svg" : "/icons/vs2.svg"} 
              alt="VaultString Logo"
              className="h-16 md:h-18 transition-all"
            />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Tech-enabled microfinance for Malawi’s future. Empowering salaried workers and SMEs with smart, sustainable credit.
          </p>
          <div className="flex gap-2.5 mt-2">
            <SocialIcon Icon={Twitter} />
            <SocialIcon Icon={Linkedin} />
            <SocialIcon Icon={Facebook} />
          </div>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold text-sm tracking-wide mb-5 text-foreground">Our Products</h4>
          <ul className="space-y-3.5">
            <FooterLink href="/dashboard/payroll">Payroll Advance</FooterLink>
            <FooterLink href="/dashboard/sme">SME Growth Capital</FooterLink>
            <FooterLink href="/dashboard/orders">Order Financing</FooterLink>
            <FooterLink href="/dashboard/invoice">Invoice Discounting</FooterLink>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-sm tracking-wide mb-5 text-foreground">Contact</h4>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3 text-sm text-muted-foreground group">
              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <span>Area 4, Lilongwe, Malawi</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-muted-foreground group">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="group-hover:text-primary transition-colors">thrive@vaultstring.com</span>
            </li>
          </ul>
        </div>

        {/* Trust / Regulatory */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-emerald-400/5 rounded-xl blur-md -z-10"></div>
          <div className="relative p-5 rounded-xl border border-border/60 bg-card/60">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest mb-2.5 text-primary-600 dark:text-primary-400">
              Regulated & Licensed
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Licensed non-deposit-taking Microfinance Institution by the Reserve Bank of Malawi.
            </p>
            <div className="pt-3 border-t border-border/30">
              <code className="text-[10px] font-mono font-bold text-foreground/80 bg-muted/30 px-2 py-1 rounded">
                MFI/2026/001
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-14 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} VaultString. Built for Malawi’s financial future.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-muted-foreground">
          <FooterTextLink href="#">Privacy</FooterTextLink>
          <FooterTextLink href="#">Terms</FooterTextLink>
          <FooterTextLink href="#">Cookies</FooterTextLink>
          <FooterTextLink href="#">Security</FooterTextLink>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon }: { Icon: React.ComponentType<{ size?: number }> }) => (
  <button 
    className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-300 hover:bg-muted/30"
    aria-label={`${Icon.name} link`}
  >
    <Icon size={16} />
  </button>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      href={href} 
      className="text-sm text-muted-foreground hover:text-primary transition-colors relative group inline-flex items-center"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
    </Link>
  </li>
);

const FooterTextLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="hover:text-primary transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary/60 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);