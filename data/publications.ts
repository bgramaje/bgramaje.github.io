export type PublicationPostT = {
  title: string
  description: string
  link: string
  uid: number
  publisher: string
  tags?: string[]
  role?: string
}

export const PUBLICATIONS: PublicationPostT[] = [
  {
    title: 'Data Management Platform for Indoor Air Quality Management',
    description:
      'This research presents the solution for building a Data Management platform with FIWARE framework and other open-source components to monitor and manage indoor air quality.',
    link: 'https://ieeexplore.ieee.org/document/10710780',
    publisher: 'IEEE',
    uid: 1,
    tags: ['FIWARE', 'API', 'MQTT'],
    role: 'Co-author',
  },
  {
    title: "Exploring GPT's Capabilities in Chess-Puzzles",
    description:
      'Language Models have not acquired their popularity based only on their text-generation capabilities, but also for the ability of learning they do have.',
    link: 'https://riunet.upv.es/handle/10251/197801',
    publisher: 'UPV',
    uid: 2,
    tags: ['AI', 'LLM', 'GPT'],
    role: 'Author',
  },
]
