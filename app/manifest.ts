import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alex Morgan | Full-Stack Developer',
    short_name: 'MM.dev',
    description: 'Portfolio of Alex Morgan — Full-Stack Web Developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0c0e',
    theme_color: '#00d4ff',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
