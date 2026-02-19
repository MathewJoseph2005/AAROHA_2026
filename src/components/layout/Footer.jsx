import { Phone, Instagram, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import sargamLogo from '@/assets/icon_logo.png';
import sjcLogo from '@/assets/SJC_LOGO.png';


export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/5">
      {/* Glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img src={sargamLogo} alt="SARGAM" className="h-7 w-7 object-contain" style={{ filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.35))' }} />
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                SARGAM 2026
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AAROHA 2026 – Battle of Bands. An inter-college music showdown bringing
              together the most talented campus bands for an electrifying live
              performance experience.
            </p>
            <div>
              <img src={sjcLogo} alt="SARGAM" className="h-30 w-40 object-contain" style={{ filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.35))' }} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'About Event', href: '/#about' },
                { label: 'Rules', href: '/#rules' },
                { label: 'Judging Criteria', href: '/#criteria' },
                { label: 'Register Now', href: '/register' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-neon-violet" />
                <a href="tel:+916238010336" className="hover:text-neon-cyan transition-colors">
                  Alen Siju: 6238010336
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-neon-violet" />
                <a href="tel:+916282257804" className="hover:text-neon-cyan transition-colors">
                  Arjun TN: 6282257804
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-neon-violet" />
                <a href="tel:+919847847419" className="hover:text-neon-cyan transition-colors">
                  Joel Biju: 9847847419
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Instagram className="w-4 h-4 text-neon-magenta" />
                <a href="https://www.instagram.com/sargam_sjcet?igsh=MXNlcHJ4MTJwdmpseQ==" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">
                  @sargam_sjcet
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-neon-gold mt-0.5" />
                <span>St. Joseph&apos;s College of Engineering and Technology, Palai (Autonomous)</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-white/5" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 AAROHA – St. Joseph&apos;s College of Engineering and Technology, Palai. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with passion for music
          </p>
        </div>
      </div>
    </footer>
  );
}
