/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Icon } from '@iconify/react';

import { SOCIAL_MEDIA } from "../../constants/links.ts"

const Sidebar = () => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col gap-3.5 items-center justify-center">
        {SOCIAL_MEDIA.map((item: { url: string, icon: string }) => (
          <a target="_blank" href={item.url}>
            <Icon
              icon={item.icon}
              fontSize="1.4rem"
              className="hover:cursor-pointer transition-all duration-300 ease-in-out hover:text-primary-foreground"
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default Sidebar