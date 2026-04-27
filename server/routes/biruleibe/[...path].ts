/**
 * PostHog first-party proxy (`clientConfig.api_host`). Overrides short upstream
 * Cache-Control for versioned static scripts and config.js so repeat visits cache efficiently.
 */
function isVersionedAssetPath(path: string, search: string): boolean {
  const p = path.toLowerCase()
  if (!(p.startsWith('static/') || p.startsWith('array/')) || !p.endsWith('.js')) {
    return false
  }
  return /[?&]v=/.test(search)
}

function isPosthogConfigJs(path: string): boolean {
  const p = path.toLowerCase()
  return p.endsWith('config.js') || p.includes('/config.js')
}

function shouldReplaceUpstreamCache(path: string, search: string): boolean {
  return isVersionedAssetPath(path, search) || isPosthogConfigJs(path)
}

export default defineEventHandler(async (event) => {
  const pathParam = event.context.params?.path as string | string[] | undefined
  const path =
    typeof pathParam === 'string' ? pathParam : Array.isArray(pathParam) ? pathParam.join('/') : ''

  const config = useRuntimeConfig(event)
  const posthogPublic = config.public.posthog as { host?: string } | undefined
  const hostUrl = String(
    posthogPublic?.host ?? process.env.NUXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  )
  const isEu = hostUrl.includes('eu.i.posthog')

  const url = getRequestURL(event)
  const search = url.search || ''
  const useAssetHost = path.startsWith('static/') || path.startsWith('array/')
  const hostname = useAssetHost
    ? isEu
      ? 'eu-assets.i.posthog.com'
      : 'us-assets.i.posthog.com'
    : isEu
      ? 'eu.i.posthog.com'
      : 'us.i.posthog.com'

  const targetUrl = `https://${hostname}/${path}${search}`

  const headers = new Headers()
  const excludedHeaders = ['host', 'connection', 'content-length', 'transfer-encoding', 'accept-encoding']
  const requestHeaders = getRequestHeaders(event)
  for (const [key, value] of Object.entries(requestHeaders)) {
    if (value && !excludedHeaders.includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  }
  headers.set('host', hostname)

  const clientIp = getHeader(event, 'x-forwarded-for') || getRequestIP(event)
  if (clientIp) {
    headers.set('x-forwarded-for', clientIp)
  }

  const rawBody =
    event.method !== 'GET' && event.method !== 'HEAD' ? await readRawBody(event, false) : undefined
  const body = rawBody ? new Uint8Array(rawBody) : undefined

  const response = await fetch(targetUrl, {
    method: event.method,
    headers,
    body,
  })

  const replaceCache = shouldReplaceUpstreamCache(path, search)
  for (const [key, value] of response.headers.entries()) {
    const lower = key.toLowerCase()
    if (['content-encoding', 'content-length', 'transfer-encoding'].includes(lower)) {
      continue
    }
    if (replaceCache && (lower === 'cache-control' || lower === 'expires')) {
      continue
    }
    setResponseHeader(event, key, value)
  }
  if (replaceCache && response.ok) {
    if (isVersionedAssetPath(path, search)) {
      setResponseHeader(
        event,
        'cache-control',
        'public, max-age=31536000, immutable',
      )
    } else if (isPosthogConfigJs(path)) {
      setResponseHeader(event, 'cache-control', 'public, max-age=3600')
    }
  }
  setResponseStatus(event, response.status)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
})
