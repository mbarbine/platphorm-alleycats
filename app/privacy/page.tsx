import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Alleycats Alcove Zine reader. We respect your privacy and collect minimal data.',
}

export default function PrivacyPage() {
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
        
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: May 1, 2026</p>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Alleycats Alcove Zine is committed to protecting your privacy. This policy explains 
              what information we collect, how we use it, and your rights regarding your data.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">What We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">Local Storage (Your Device Only)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We store your reading preferences (theme, last page, zoom level) locally on your 
                  device using localStorage. This data never leaves your browser and is not transmitted 
                  to any server.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Analytics (Production Only)</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In production, we use Vercel Analytics to collect anonymous, aggregate data about 
                  page views. This helps us understand how the zine is being read. No personal 
                  information is collected.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">What We Do NOT Collect</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Personal information (name, email, address)</li>
              <li>Tracking cookies</li>
              <li>Cross-site tracking data</li>
              <li>Device fingerprints</li>
              <li>IP addresses (beyond standard server logs)</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Third Parties</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or share your data with third parties. The only external 
              service we use is Vercel for hosting and anonymous analytics.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Since we store data locally on your device, you have full control. You can clear 
              your reading preferences at any time by clearing your browser&apos;s localStorage for 
              this site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy, please contact us at{' '}
              <a href="mailto:privacy@platphormnews.com" className="text-primary hover:underline">
                privacy@platphormnews.com
              </a>
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
