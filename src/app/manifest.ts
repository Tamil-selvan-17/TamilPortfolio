import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tamilselvan G — Portfolio',
    short_name: 'TG Portfolio',
    description: 'Full Stack Engineer — Angular & .NET Core',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090f',
    theme_color: '#6366f1',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
