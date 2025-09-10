import { useRuntimeConfig } from 'nuxt/app'

/**
 * useGtag - ตัวช่วยยิงอีเวนต์ไปยัง Google Analytics (gtag)
 * การใช้งานตัวอย่าง:
 * const { enabled, trackEvent, pageView } = useGtag()
 * trackEvent('sign_up', { method: 'email' })
 */
export function useGtag() {
  const config = useRuntimeConfig()
  const measurementId = (config.public as any)?.gaMeasurementId as string | undefined
  const enabled = process.client && !!measurementId

  function getGtag(): ((...args: any[]) => void) | null {
    if (!enabled) return null
    // @ts-ignore
    const g = (window as any).gtag as any
    if (typeof g === 'function') return g
    // fallback to dataLayer push (ปลั๊กอินจะกำหนด gtag อยู่แล้ว)
    // @ts-ignore
    const dl = (window as any).dataLayer
    if (Array.isArray(dl)) {
      return function gtagShim(...args: any[]) {
        dl.push(args as any)
      }
    }
    return null
  }

  function trackEvent(action: string, params?: Record<string, any>) {
    const g = getGtag()
    if (!g) return
    g('event', action, params || {})
  }

  function pageView(path?: string, title?: string) {
    const g = getGtag()
    if (!g) return
    g('event', 'page_view', {
      page_location: process.client ? window.location.href : undefined,
      page_path: path ?? (process.client ? window.location.pathname : undefined),
      page_title: title ?? (process.client ? document.title : undefined)
    })
  }

  // ตัวอย่าง helper ทั่วไปที่นิยมใช้
  function signUp(method: string) {
    trackEvent('sign_up', { method })
  }
  function login(method: string) {
    trackEvent('login', { method })
  }
  function click(name: string, params?: Record<string, any>) {
    trackEvent('select_content', { content_type: 'click', item_id: name, ...(params || {}) })
  }
  function upload(fileType?: string) {
    trackEvent('file_upload', { file_type: fileType || 'unknown' })
  }

  return {
    enabled,
    trackEvent,
    pageView,
    signUp,
    login,
    click,
    upload,
  }
}
