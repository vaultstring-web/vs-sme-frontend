// src/components/layout/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border/50 bg-card/40 px-4 pb-8 pt-10 backdrop-blur-sm sm:px-6 sm:pb-10 sm:pt-14 lg:px-8 lg:pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4 sm:gap-10">
        {/* Brand & Mission */}
        <div className="space-y-5">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image 
              src={theme === "dark" ? "/icons/vs1.svg" : "/icons/vs2.svg"} 
              alt="VaultString Logo"
              width={160}
              height={64}
              className="h-16 w-auto md:h-18 transition-all"
              priority
            />
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Tech-enabled microfinance for Malawi’s future. Empowering salaried workers and SMEs with smart, sustainable credit.
          </p>
          {/* <div className="flex gap-2.5 mt-2">
            <SocialIcon Icon={Twitter} />
            <SocialIcon Icon={Linkedin} />
            <SocialIcon Icon={Facebook} />
          </div> */}
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold text-sm tracking-wide mb-5 text-foreground">Our Products</h4>
          <ul className="space-y-3.5">
            <FooterLink href="/dashboard/payroll">Payroll Advance</FooterLink>
            <FooterLink href="/dashboard/sme">SME Growth Capital</FooterLink>
            {/* <FooterLink href="/dashboard/orders">Order Financing</FooterLink>
            <FooterLink href="/dashboard/invoice">Invoice Discounting</FooterLink> */}
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
              {/* Wrapped in a mailto link */}
              <a 
                href="mailto:thrive@vaultstring.com" 
                className="break-all transition-colors group-hover:text-primary hover:underline underline-offset-4 sm:break-normal"
              >
                thrive@vaultstring.com
              </a>
            </li>
          </ul>
        </div>

        {/* Trust / Regulatory */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-emerald-400/5 rounded-xl blur-md -z-10"></div>
          <div className="relative rounded-xl border border-border/60 bg-card/60 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Regulated & Licensed
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Licensed and regulated non-deposit-taking Microfinance Institution by the <span className="font-bold text-foreground">Reserve Bank of Malawi (RBM)</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs sm:mt-14 md:flex-row">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} VaultString. Built for Malawi’s financial future.
        </p>
        {/* <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-muted-foreground">
          <FooterTextLink href="#">Privacy</FooterTextLink>
          <FooterTextLink href="#">Terms</FooterTextLink>
          <FooterTextLink href="#">Cookies</FooterTextLink>
          <FooterTextLink href="#">Security</FooterTextLink>
        </div> */}
      </div>
    </footer>
  );
};

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

