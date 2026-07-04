import Link from 'next/link'
import { Mail, Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/shared/BrandIcons'
import { siteConfig } from '@/config/site.config'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-10 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-semibold gradient-text text-sm">{siteConfig.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Full Stack Engineer · Chennai, India
            </p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {siteConfig.nav.map((item: { label: string, href: string }) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           bg-white/5 border border-white/8 text-muted-foreground
                           hover:text-foreground hover:bg-white/10 transition-all duration-200"
              >
                <GithubIcon style={{ width: 14, height: 14 }} />
              </a>
            )}
            {siteConfig.social.linkedin && (
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           bg-white/5 border border-white/8 text-muted-foreground
                           hover:text-foreground hover:bg-white/10 transition-all duration-200"
              >
                <LinkedinIcon style={{ width: 14, height: 14 }} />
              </a>
            )}
            <a
              href={`mailto:${siteConfig.social.email}`}
              aria-label="Email"
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         bg-white/5 border border-white/8 text-muted-foreground
                         hover:text-foreground hover:bg-white/10 transition-all duration-200"
            >
              <Mail size={14} />
            </a>
          </div>
        </div>

        <div className="section-divider mt-8 mb-6" />

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          © {year} {siteConfig.name} · Built with
          <Heart size={10} className="text-fuchsia-400 fill-fuchsia-400 mx-0.5" />
          using Next.js & Framer Motion
        </p>
      </div>
    </footer>
  )
}
