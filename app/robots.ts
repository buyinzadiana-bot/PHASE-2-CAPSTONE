import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/settings/', '/editor'],
    },
    sitemap: 'https://techinsights.vercel.app/sitemap.xml',
  }
}
