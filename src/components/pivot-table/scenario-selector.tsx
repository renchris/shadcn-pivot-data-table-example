'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllScenarios, getScenario } from '@/lib/pivot/scenarios'

export function ScenarioSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isInitialized, setIsInitialized] = useState(false)

  // Use searchParams directly as source of truth (no local state needed)
  const currentScenario = searchParams.get('scenario')
  const scenario = getScenario(currentScenario)
  const allScenarios = getAllScenarios()

  // On mount, if URL doesn't have scenario parameter, navigate to default
  // Mark as initialized once scenario is in URL (or was already there)
  useEffect(() => {
    if (!searchParams.get('scenario')) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('scenario', 'market-data')
      router.push(pathname + '?' + params.toString())
      // Don't set initialized yet - wait for URL to update
    } else {
      // Scenario already in URL, mark as initialized
      setIsInitialized(true)
    }
  }, [searchParams, router, pathname])

  const handleScenarioChange = useCallback((scenarioId: string) => {
    // Guard: only allow navigation after initialization completes
    if (!isInitialized) return

    // Canonical Next.js App Router pattern for updating search params
    const params = new URLSearchParams(searchParams.toString())
    params.set('scenario', scenarioId)

    // Use pathname + query string (never hardcode the route)
    router.push(pathname + '?' + params.toString())
  }, [isInitialized, router, pathname, searchParams])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pivot Table Scenario</CardTitle>
        <CardDescription>
          Select a finance scenario to visualize and analyze
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="scenario-select" className="text-sm font-medium">
            Example Scenario
          </label>
          <Select
            value={scenario.id}
            onValueChange={handleScenarioChange}
            disabled={!isInitialized}
          >
            <SelectTrigger id="scenario-select">
              <SelectValue placeholder="Select a scenario" />
            </SelectTrigger>
            <SelectContent>
              {allScenarios.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <h4 className="text-sm font-semibold">{scenario.title}</h4>
          <p className="text-sm text-muted-foreground">{scenario.description}</p>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            <span className="font-medium">Row Fields:</span>{' '}
            {scenario.defaultConfig.rowFields.join(', ')}
          </div>
          {scenario.defaultConfig.columnFields.length > 0 && (
            <div>
              <span className="font-medium">Column Fields:</span>{' '}
              {scenario.defaultConfig.columnFields.join(', ')}
            </div>
          )}
          <div>
            <span className="font-medium">Metrics:</span>{' '}
            {scenario.defaultConfig.valueFields.map(v => v.displayName).join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
