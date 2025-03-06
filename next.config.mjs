import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'out',
  reactStrictMode: true,
  output: 'export',
  basePath: '/bgramaje.github.io',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
})

export default withMDX(nextConfig)
