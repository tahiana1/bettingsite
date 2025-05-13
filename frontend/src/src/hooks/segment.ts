'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export function usePathSegments(): string[] {
  const pathname = usePathname() // e.g., "/admin/financials/deposit"

  const segments = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean) // ["admin", "financials", "deposit"]

    const cumulative: string[] = []
    for (let i = 0; i < parts.length; i++) {
      cumulative.push(parts.slice(0, i + 1).join('/'))
    }

    return cumulative
  }, [pathname])

  return segments
}
