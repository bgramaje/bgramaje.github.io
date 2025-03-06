import React from 'react'
import { IconCloud } from '../magicui/icon-cloud'

const slugs = [
  'typescript',
  'javascript',
  'react',
  'html5',
  'css3',
  'nodedotjs',
  'express',
  'nextdotjs',
  'prisma',
  'postgresql',
  'nginx',
  'docker',
  'git',
  'github',
  'gitlab',
  'sonarqube',
  'meteor',
  'python',
  'rabbitmq',
  'postman',
  'mqtt',
  'kubernetes',
]

export const Technologies = () => {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  )

  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud images={images} />
    </div>
  )
}
