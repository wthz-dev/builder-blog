export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl?: string | null
  categories: string[]
  tags: string[]
  author: string
  publishedAt: string
}

export const posts: BlogPost[] = [
  {
    id: '1',
    slug: 'getting-started-with-vue-3',
    title: 'Getting Started with Vue 3 and Composition API',
    excerpt:
      'A practical guide to building modern interfaces with Vue 3 and the Composition API. Learn core concepts and best practices.',
    content:
      '<p>Vue 3 introduces the Composition API, a set of additive, function-based APIs that allow flexible composition of component logic. It works alongside the Options API and is a great fit for complex components and libraries.</p><p>In this post, we will explore the core concepts of the Composition API, including reactive state, computed properties, lifecycle hooks, and reusability with composables.</p>',
    categories: ['Frontend', 'Vue'],
    tags: ['vue', 'composition-api', 'javascript'],
    author: 'Torkait Sukpramote',
    publishedAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'tailwindcss-productive-workflows',
    title: 'TailwindCSS: Productive Workflows for Beautiful UIs',
    excerpt:
      'How to design beautiful, responsive interfaces fast with TailwindCSS. Tips, patterns, and component structure included.',
    content:
      '<p>TailwindCSS is a utility-first CSS framework that provides low-level utility classes you can compose to build any design, directly in your markup.</p><p>We will cover layout techniques, theming, and strategies for maintaining clean, scalable component styles.</p>',
    categories: ['Frontend', 'CSS'],
    tags: ['tailwind', 'css', 'design'],
    author: 'Torkait Sukpramote',
    publishedAt: new Date(Date.now() - 864e5).toISOString(),
  },
  {
    id: '3',
    slug: 'building-a-modern-node-api',
    title: 'Building a Modern Node.js API with Best Practices',
    excerpt:
      'From project structure to security and testing, learn how to create a robust Node.js REST API ready for production.',
    content:
      '<p>Node.js provides a powerful platform for building scalable backends. We will look at structuring your app, validating inputs, handling errors, and integrating with databases.</p>',
    categories: ['Backend', 'Node.js'],
    tags: ['node', 'api', 'best-practices'],
    author: 'Torkait Sukpramote',
    publishedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
]

export function findPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug)
}

export function allCategories() {
  const set = new Set<string>()
  posts.forEach((p) => p.categories.forEach((c) => set.add(c)))
  return Array.from(set)
}

export function allTags() {
  const set = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
  return Array.from(set)
}
