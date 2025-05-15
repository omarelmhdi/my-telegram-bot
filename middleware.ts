import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/webhook" && request.method === "POST") {
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      // Clone the request to read the body
      const clonedRequest = request.clone()
      const body = await clonedRequest.json()

      // Create a new request with the parsed body
      const newRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(body),
      })

      return NextResponse.next({
        request: newRequest,
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/webhook",
}
