import { Icon } from '@iconify/react';

const Sidebar = () => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col gap-3.5 items-center justify-center">
        <Icon icon="ri:github-fill" fontSize="1.75rem" className="hover:cursor-pointer" />
        <Icon icon="cib:codewars" fontSize="1.4rem" className="hover:cursor-pointer" />
        <Icon icon="ic:twotone-mail" fontSize="1.5rem" className="hover:cursor-pointer" />
        <Icon icon="cib:linkedin" fontSize="1.2rem" className="hover:cursor-pointer" />
      </div>
    </div>
  )
}

export default Sidebar