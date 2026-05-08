import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Security',
  description: 'Security practices and responsible disclosure policy for Alleycats Alcove Zine.',
}

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to reader
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Security</h1>
        <p className="text-muted-foreground mb-8">How we keep Alleycats Alcove safe</p>
        
        <div className="space-y-8">
          <section className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Security by Design</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Alleycats Alcove is designed with security in mind. We have no user accounts, 
                  no database of personal information, and no payment processing. This minimal 
                  attack surface means fewer things that can go wrong.
                </p>
              </div>
            </div>
          </section>
          
          <section className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">HTTPS Everywhere</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All connections to Alleycats Alcove are encrypted using TLS/HTTPS. We use 
                  modern security headers including Content-Security-Policy, X-Frame-Options, 
                  and Strict-Transport-Security.
                </p>
              </div>
            </div>
          </section>
          
          <section className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Open Source</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our code is open and available for inspection. Transparency builds trust. 
                  You can review exactly how the zine reader works and what data it accesses.
                </p>
              </div>
            </div>
          </section>
          
          <section className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Responsible Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you discover a security vulnerability, please report it responsibly. 
                  We appreciate your help in keeping our community safe.
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-foreground font-medium">Email:</span>{' '}
                    <a href="mailto:security@platphormnews.com" className="text-primary hover:underline">
                      security@platphormnews.com
                    </a>
                  </p>
                  <p>
                    <span className="text-foreground font-medium">Security.txt:</span>{' '}
                    <a href="/.well-known/security.txt" className="text-primary hover:underline">
                      /.well-known/security.txt
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Future: CLAWS Integration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We are planning to integrate with CLAWS (Community-Led AI Web Security), 
              a next-generation security platform from the Platphorm News Network. This will 
              provide AI-powered threat detection and community-driven security policies.
            </p>
            <p className="text-sm text-muted-foreground">
              Learn more at{' '}
              <a href="https://claws.platphormnews.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                claws.platphormnews.com
              </a>
              {' '}(coming soon)
            </p>
          </section>
          
          <section className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Alleycats Alcove is part of the{' '}
              <a href="https://platphormnews.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Platphorm News Network
              </a>
              . Made with love in Front Royal, VA.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
