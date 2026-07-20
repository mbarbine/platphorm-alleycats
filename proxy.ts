import type { NextRequest } from "next/server"
import { withPlatphormTrace } from "./lib/platphorm-trace"

export function proxy(request: NextRequest) {
  return withPlatphormTrace(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
