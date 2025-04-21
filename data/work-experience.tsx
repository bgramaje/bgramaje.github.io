/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards'
import React from 'react'

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
      'Developed an abstract data visualization and digital twin tool,enabling remote management of any type of use case. Including a suite of microservices enabling data feeding into the system using diverse widely used protocols such as HTTP, MQTT or AMQP.The tool is based on NodeJS, using the full-stack framework of MeteorJS',
      'Developed a transportation management system. Using a combination of technologies such as NodeJS, MongoDB, and InfluxDB. The system is designed to be scalable and efficient allowing for the management of large amounts of data.',
      'Adaptation of the widely-used FIWARE platform in the context of Indoor Air Quality. FIWARE is an open-source platform offering standardized tools and APIs to develop smart solutions and manage real-time data across various sectors.',
    ],
    content: ({
      id,
      tags,
      achievements,
      description,
    }: {
      id: number
      tags: string[]
      achievements: string[]
      description: string
    }) => {
      return (
        <div className="flex w-full flex-col space-y-1.5 overflow-y-auto">
          <h3 className="text-md mb-2 font-medium text-neutral-800 dark:text-white">
            Job Description
          </h3>
          <p className="w-full text-justify">{description}</p>
          <div className="flex w-full flex-col gap-2">
            <h3 className="text-md font-medium text-neutral-800 dark:text-white">
              Job Achievements
            </h3>
            <ul className="w-full list-inside list-disc text-justify">
              {achievements?.map((achievement, idx) => (
                <li key={idx + 1} className="w-full py-1 text-justify">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-md font-medium text-neutral-800 dark:text-white">
              European Projects Contribution
            </h3>
          </div>
          <InfiniteMovingCards
            items={[
              {
                title:
                  'https://twinair-project.eu/wp-content/uploads/2022/11/TWIN-AIR-LOGO-FINAL-no-background-300x123.png',
                href: 'https://twinair-project.eu/',
                quote:
                  'Technically leading the TwinAIR project. Integrating IoT devices and sensors. Supervising the development and deployment of the tecnical solutions provided.',
              },
              {
                title:
                  'https://ecoloop-project.eu/wp-content/uploads/2024/03/ecoloop_green-blue_horizontal.svg',
                href: 'https://ecoloop-project.eu/',
                quote:
                  'Technically leading the ECOLOOP project. Building a comprehensive application helping farmers manage crops. Leading data integration from the respective pilot sites.',
              },
              {
                title:
                  'https://www.madrid.es/UnidadesDescentralizadas/UDCMovilidadTransportes/Quizas/proyectos_europeos_movilidad_2024/ficheros/logo_unchain.png',
                href: 'https://unchainproject.eu/',
                quote:
                  'Main developer of the <PARCAR> system. A ESP-32 based device that enables remote management of parking-slots for a dynamic usage of those. Connectivity with LoraWAN.',
              },
              {
                title:
                  'https://ebrt2030.eu/wp-content/themes/webit/images/logo.svg',
                href: 'https://ebrt2030.eu/',
                quote:
                  'Developed an intuitive interface enabling the efficient managemnet of plubc transports in Bogota, Colombia. Use of IndexedDB for loading and efficiently manage large chunks of data. Advance views such a 2D synoptic view.',
              },
            ]}
            direction="left"
            speed="slow"
          />
        </div>
      )
    },
  },
  {
    id: 1,
    business: 'DEVOLTEC SL',
    description:
      'Development of custom software solution based on business requirements. Solutions were built using Angular, Express, and various databases, while creating REST APIs and custom interfaces. Implemented Docker-based production environments and managed version control and CI/CD pipelines through GitLab.',
    title: 'Software Engineer',
    achievements: [
      'Developed a comprehensive Enterprise Resource Planning (ERP) for the management of small business over Ontinyent area.',
      'Developed a production control system for the management of industrail production over Ontinyent area.',
      'Developed an email categorization system managing different types of emails from different backup comapnies.',
    ],
    src: 'https://devoltec.com/wp-content/uploads/Logo-DEVOLTEC-2048x577-1-288x81.png',
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
    content: ({
      id,
      tags,
      achievements,
      description,
    }: {
      id: number
      tags: string[]
      achievements: string[]
      description: string
    }) => {
      return (
        <div className="flex w-full flex-col space-y-1.5 overflow-y-auto">
          <h3 className="text-md mb-2 font-medium text-neutral-800 dark:text-white">
            Job Description
          </h3>
          <p className="w-full text-justify">{description}</p>
          <div className="flex w-full flex-col gap-2">
            <h3 className="text-md font-medium text-neutral-800 dark:text-white">
              Job Achievements
            </h3>
            <ul className="w-full list-inside list-disc text-justify">
              {achievements?.map((achievement, idx) => (
                <li key={idx + 1} className="w-full py-1 text-justify">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
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
    content: ({
      id,
      tags,
      achievements,
      description,
    }: {
      id: number
      tags: string[]
      achievements: string[]
      description: string
    }) => {
      return (
        <div className="flex w-full flex-col space-y-1.5 overflow-y-auto">
          <h3 className="text-md mb-2 font-medium text-neutral-800 dark:text-white">
            Job Description
          </h3>
          <p className="w-full text-justify">{description}</p>
          {achievements.length > 0 && (
            <div className="flex w-full flex-col gap-2">
              <h3 className="text-md font-medium text-neutral-800 dark:text-white">
                Job Achievements
              </h3>
              <ul className="w-full list-inside list-disc text-justify">
                {achievements?.map((achievement, idx) => (
                  <li key={idx + 1} className="w-full py-1 text-justify">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    },
  },
]
