type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

export type WorkExperienceT = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
  description: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

export type PublicationPostT = {
  title: string
  description: string
  link: string
  uid: string
  publisher: string
  tags?: string[]
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Motion Primitives Pro',
    description:
      'Advanced components and templates to craft beautiful websites.',
    link: 'https://pro.motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Motion Primitives',
    description: 'UI kit to make beautiful, animated interfaces.',
    link: 'https://motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperienceT[] = [
  {
    company: 'ETRA I+D',
    title: 'Software Engineer',
    start: '2022',
    end: 'Present',
    link: 'https://www.grupoetra.com/',
    id: 'work1',
    description:
      'Experienced in European tech partnerships, contributing to projects like TwinAIR, ECOLOOP, and UNCHAIN. Expertise in web application development (Meteor.js, FIWARE), API development. (Express.js, Flask). Proficient in containerization (Docker, Kubernetes), CI/CD pipelines (GitLab), and technologies such as RabbitMQ, OCPP, MongoDB, InfluxDB, and NATS.',
  },
  {
    company: 'DEVOLTEC',
    title: 'Software Engineer',
    start: '2021',
    end: '2022',
    link: 'https://devoltec.com/',
    id: 'work2',
    description:
      'Developed comprehensive ERP and production control systems using Angular, Express, and various databases, while creating REST APIs and custom interfaces. Implemented Docker-based production environments and managed version control and CI/CD pipelines through GitLab.',
  },
  {
    company: 'Panda Creatiu',
    title: 'Frontend Engineer',
    start: '2020',
    end: '2020',
    link: 'https://goodmorningpanda.com/',
    id: 'work3',
    description:
      'Designed and developed custom web interfaces using WordPress, HTML, CSS, JavaScript, and jQuery, while creating UI/UX designs with Adobe XD and Figma.',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
    description: 'How AI is changing the way we design',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-1',
  },
  {
    title: 'Why I left my job to start my own company',
    description:
      'A deep dive into my decision to leave my job and start my own company',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-2',
  },
  {
    title: 'What I learned from my first year of freelancing',
    description:
      'A look back at my first year of freelancing and what I learned',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-3',
  },
]

export const PUBLICATIONS: PublicationPostT[] = [
  {
    title: 'Data Management Platform for Indoor Air Quality Management',
    description:
      'This research presents the solution for building a Data Management platform with FIWARE framework and other open-source components to monitor and manage indoor air quality.',
    link: 'https://ieeexplore.ieee.org/document/10710780',
    publisher: 'IEEE',
    uid: 'blog-1',
    tags: ['FIWARE', 'IAQ', 'API', 'MQTT'],
  },
  {
    title: "Exploring GPT's Capabilities in Chess-Puzzles",
    description:
      'Language Models have not acquired their popularity based only on their text-generation capabilities, but also for the ability of learning they do have.',
    link: 'https://riunet.upv.es/handle/10251/197801',
    publisher: 'UPV',
    uid: 'blog-2',
    tags: ['AI', 'LLM', 'GPT', 'OpenAI'],
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/ibelick',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/ibelick',
  },
  {
    label: 'CV',
    link: '/CV_BORJA.pdf',
  },
]

export const EMAIL = 'your@email.com'
