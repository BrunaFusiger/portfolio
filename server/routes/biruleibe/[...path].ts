/**
 * Reverse proxy for PostHog (first-party `api_host`).
 * Path must match `clientConfig.api_host` in nuxt.config (`/ph-collect`).
 * @see https://posthog.com/docs/advanced/proxy/nuxt
 */
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

  for (const [key, value] of response.headers.entries()) {
    if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
      setResponseHeader(event, key, value)
    }
  }
  setResponseStatus(event, response.status)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
})
