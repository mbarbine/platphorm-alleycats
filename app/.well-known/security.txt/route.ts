import { NextResponse } from 'next/server'

const SECURITY_TXT = `# Alleycats Alcove Security Policy
# https://securitytxt.org/

Contact: mailto:security@platphormnews.com
Contact: https://alleycats.platphormnews.com/security
Expires: 2027-05-01T00:00:00.000Z
Preferred-Languages: en, es, fr
Canonical: https://alleycats.platphormnews.com/.well-known/security.txt
Policy: https://alleycats.platphormnews.com/security

# Acknowledgments
# We appreciate responsible disclosure of security vulnerabilities.
# Thank you for helping keep our community safe.

# This site is part of the Platphorm News Network
# https://platphormnews.com
`

export async function GET() {
  return new NextResponse(SECURITY_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
