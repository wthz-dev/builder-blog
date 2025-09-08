export type SeoOptions = {
  title?: string
  description?: string
  type?: 'website' | 'article'
  image?: string
  url?: string
  datePublished?: string
  authorName?: string
  schema?: Record<string, any>
}

export function useSeo(opts: SeoOptions) {
  const title = opts.title ? `${opts.title} • Torkait` : 'Torkait — Personal Tech Blog'
  document.title = title

  setMeta('description', opts.description || 'A modern personal blog built with Vue.js and TailwindCSS')
  setProperty('og:title', title)
  setProperty('og:description', opts.description || '')
  setProperty('og:type', opts.type || 'website')
  setProperty('og:url', opts.url || location.pathname)
  if (opts.image) setProperty('og:image', opts.image)

  setProperty('twitter:title', title)
  setProperty('twitter:description', opts.description || '')
  if (opts.image) setProperty('twitter:image', opts.image)

  if (opts.type === 'article') {
    const ld: any = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: opts.title,
      description: opts.description,
      datePublished: opts.datePublished,
      author: opts.authorName ? { '@type': 'Person', name: opts.authorName } : undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url || location.href },
    }
    injectJsonLd(ld)
  } else if (opts.schema) {
    injectJsonLd(opts.schema)
  }
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function injectJsonLd(data: Record<string, any>) {
  const id = 'dynamic-jsonld'
  const existing = document.getElementById(id)
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}
