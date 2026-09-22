import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { products } from '@/data/products';
import { siteConfig } from '@/data/products';
import ScentGif from '@/components/ScentGif';

type FooterProps = {
  onNavigate: (page: string) => void;
};

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="site-footer border-t border-[#b08d57]/20 bg-[#efe4d4]/60">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
          <div className="max-w-md">
            <div className="font-serif-display text-2xl text-burgundy">Scent Stack</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-charcoal/70">
              Digital fragrance workbooks and journals designed to help you discover your signature scent.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-charcoal/50">
              <ShieldCheck size={16} className="text-gold" />
              Secure digital delivery
            </div>
            <ScentGif number={10} alt="Illustrated perfume bottle" className="footer-gif" />
          </div>

              <div className="grid gap-10 sm:grid-cols-2">
                <nav aria-label="Store products">
                  <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gold">Products</h4>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-charcoal/80">
                    {products.map((p) => (
                      <li key={p.id}><button onClick={() => onNavigate(`product-${p.slug}`)} className="transition-colors hover:text-burgundy">{p.title}</button></li>
                    ))}
                  </ul>
                </nav>

                <nav aria-label="Legal">
                  <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gold">Legal</h4>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-charcoal/80">
                    <li><button onClick={() => onNavigate('privacy')} className="transition-colors hover:text-burgundy">Privacy Policy</button></li>
                    <li><button onClick={() => onNavigate('terms')} className="transition-colors hover:text-burgundy">Terms</button></li>
                    <li><button onClick={() => onNavigate('refund-policy')} className="transition-colors hover:text-burgundy">Refund Policy</button></li>
                  </ul>
                </nav>
              </div>

          <div className="max-w-md">
            <h4 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-gold">Customer support</h4>
            <p className="text-sm leading-relaxed text-charcoal/70">Questions about payment, delivery, or your digital products? We are here to help.</p>
            <a href={`mailto:${siteConfig.supportEmail}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-burgundy underline-offset-4 hover:underline">
              <Mail size={14} className="text-gold" />
              {siteConfig.supportEmail}
            </a>
            <div className="mt-5 flex items-center gap-2 text-xs text-charcoal/55">
              <ShieldCheck size={14} className="text-gold" />
              Secure PayPal payment and instant digital delivery
            </div>
          </div>
        </div>

        <div className="my-8 gold-divider" />

        <div className="footer-payment-methods" aria-label="Accepted payment methods">
          <span className="footer-payment-label">Secure payments via PayPal</span>
          <div className="footer-payment-logos">
            <div className="payment-logo" title="PayPal">PayPal</div>
            <div className="payment-logo" title="Visa">Visa</div>
            <div className="payment-logo" title="Mastercard">Mastercard</div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 text-xs text-charcoal/50 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 uppercase tracking-[0.16em]">
            <Lock size={13} className="text-gold" />
            <span>Payments processed securely via PayPal</span>
          </div>
          <p>Digital downloads delivered after payment confirmation.</p>
          <p>&copy; {new Date().getFullYear()} Scent Stack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
