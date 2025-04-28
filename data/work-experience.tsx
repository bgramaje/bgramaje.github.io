/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react'

export type WorkExperienceT = {
  id: number
  src: string
  title: string
  business: string
  description: string
  ctaLink?: string
  duration: string
  content?: any
  tags?: string[]
  achievements?: string[]
}

export const WORK_EXPERIENCE: WorkExperienceT[] = [
  {
    id: 0,
    business: 'ETRA I+D',
    description:
      'Contribution to European I+D projects. Technically leading some of the I+D projects. Building comprehensive data management platforms and applications. Building custom microservices, based on Python or Javascript, using Docker and Kubernetes. Development of embedded software using Arduino and PlatformIO.',
    title: 'Software Engineer',
    duration: '2022 - Present',
    ctaLink: 'https://www.grupoetra.com/',
    src: 'https://www.matchup-project.eu/wp-content/uploads/2018/03/01-ETRA-ID-1024x412.png',
    tags: [
      'FIWARE',
      'RabbitMQ',
      'MeteorJS',
      'MongoDB',
      'InfluxDB',
      'NodeJS',
      'Arduino',
      'NATS',
      'Docker',
      'Kubernetes',
    ],
    achievements: [
      'Developed an abstract data visualization and digital twin tool,enabling remote management of any type of use case. Including a suite of microservices enabling data feeding into the system using diverse widely used protocols such as HTTP, MQTT or AMQP. The tool is based on NodeJS, using the full-stack framework of MeteorJS',
      'Developed a transportation management system. Using a combination of technologies such as NodeJS, MongoDB, and InfluxDB. The system is designed to be scalable and efficient allowing for the management of large amounts of data.',
      'Adaptation of the widely-used FIWARE platform in the context of IAQ. FIWARE is an open-source platform offering standardized tools and APIs to develop smart solutions and manage real-time data across various sectors.',
      'Developed an embedded software solution based on LoraWAN and ESP-32 microcontrollers. The solution enables the remote management of parking-slots for a dynamic usage of those.',
    ],
  },
  {
    id: 1,
    business: 'DEVOLTEC SL',
    description:
      'Development of custom software solution based on business requirements. Solutions were built using Angular, Express, and various databases, while creating REST APIs and custom interfaces. Implemented Docker-based production environments and managed version control and CI/CD pipelines through GitLab.',
    title: 'Software Engineer',
    achievements: [
      'Developed a comprehensive Enterprise Resource Planning (ERP) for the management of small business over Ontinyent area.',
      'Developed a production control system for the management of industrial production over Ontinyent area.',
      'Developed an email categorization system managing different types of emails from different backup comapnies.',
    ],
    src: 'https://devoltec.com/wp-content/uploads/elementor/thumbs/devoltec-favicon-1-pscbwn8ibf6w4a5ij59sb3ie1y9wmzm1i8xlojqjtc.png',
    duration: '2021 - 2022',
    tags: [
      'Angular',
      'Express',
      'Docker',
      'NestJS',
      'PostgreSQL',
      'React',
      'MongoDB',
      'Gitlab',
    ],
    ctaLink: 'https://devoltec.com/',
  },
  {
    id: 2,
    business: 'Good Morning Panda',
    description:
      'Design and development of custom web interfaces using WordPress, HTML, CSS, JavaScript, and jQuery, while creating UI/UX designs with Adobe XD and Figma.',
    title: 'Frontend Engineer',
    src: 'https://goodmorningpanda.com/wp-content/uploads/2019/10/goodmorningpanda_logo.png',
    duration: '2020 - 2020',
    ctaLink: 'https://goodmorningpanda.com/',
    tags: ['Wordpress', 'After Effects', 'Figma', 'Adobe XD'],
  },
]
