import { PublicationPostT } from '@/data/publications'
import Link from 'next/link'
import React from 'react'

type PublicationProps = {
  post: PublicationPostT
}

export const Publication = ({ post }: PublicationProps) => {
  return (
    <Link key={post.uid} href={post.link} target="_blank" data-id={post.uid}>
      <div className="flex flex-col space-y-1 rounded-md px-2 py-3 hover:bg-zinc-100 dark:hover:bg-neutral-800">
        <div className="flex items-center gap-1">
          <h4 className="mb-0 pb-0 font-normal dark:text-zinc-100">
            {post.title}
          </h4>
          {/* <p className="dark:bg-blue w-fit rounded-md bg-green-300 px-1.5 text-sm font-medium text-black dark:text-black">
            {post.publisher}
          </p> */}
        </div>
        <p className="text-sm">
          Published on <i>{post.publisher}</i> as{' '}
          <span className="text-[13px] font-semibold uppercase">
            {post.role}
          </span>
        </p>
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
          {post.description}
        </p>
        <div className="flex items-center gap-1 pt-1">
          {post?.tags?.map((tag) => (
            <p
              key={`${post.uid}-${tag}`}
              className="w-fit rounded-md bg-zinc-800 px-1.75 py-0.5 text-[11px] font-medium text-white dark:bg-white dark:text-black"
            >
              {tag}
            </p>
          ))}
        </div>
      </div>
    </Link>
  )
}
