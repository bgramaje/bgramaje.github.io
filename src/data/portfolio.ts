export interface Job {
  id?: number;
  /** Slug used to load the job MDX file (e.g. etra-id, devoltec-sl) */
  mdxSlug: string;
  company: string;
  role: string;
  period: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  location?: string;
  achievements?: string[];
  ctaLink?: string;
  src?: string;
}

export interface Publication {
  title: string;
  description: string;
  link: string;
  publisher: string;
  uid: number;
  tags: string[];
  role: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Study {
  degree: string;
  institution: string;
  type: "degree" | "master";
  /** When true, shown as currently in progress */
  ongoing?: boolean;
}

export const personalInfo = {
  name: "Borja Albert Gramaje",
  title: "Software Engineer",
  email: "boralbgra@gmail.com",
  location: "Valencia, Spain",
  bio: `Passionate software engineer with expertise in full-stack development 
and research in computer science. I love building elegant solutions 
to complex problems and contributing to open-source projects.`,
  avatar: "👨‍💻",
};

export const jobs: Job[] = [
  {
    id: 0,
    mdxSlug: "etra-id",
    company: "ETRA I+D",
    role: "Software Engineer",
    period: "2022 - Present",
    description:
      "Contributing to European research and development projects within the Horizon 2020 framework. Providing technical leadership for multiple I+D initiatives focused on innovative software solutions. Architecting and developing comprehensive data management platforms and enterprise applications. Designing and implementing custom microservices using Python and JavaScript, containerized with Docker and orchestrated via Kubernetes. Developing embedded software solutions utilizing Arduino and PlatformIO for IoT applications.",
    shortDescription:
      "Leading European I+D projects, architecting data platforms and microservices, and developing embedded IoT solutions.",
    technologies: [
      "FIWARE",
      "RabbitMQ",
      "MeteorJS",
      "MongoDB",
      "InfluxDB",
      "NodeJS",
      "Arduino",
      "NATS",
      "Docker",
      "Kubernetes",
    ],
    achievements: [
      "Architected and developed an abstract data visualization and digital twin platform, enabling comprehensive remote management across diverse use cases. Implemented a suite of microservices facilitating data ingestion through multiple industry-standard protocols including HTTP, MQTT, and AMQP. Built on Node.js utilizing the MeteorJS full-stack framework for real-time capabilities.",
      "Designed and implemented a scalable transportation management system leveraging Node.js, MongoDB, and InfluxDB. The architecture supports high-throughput data processing and efficient management of large-scale datasets, ensuring optimal performance and reliability.",
      "Led the adaptation and customization of the FIWARE open-source platform for Indoor Air Quality (IAQ) monitoring applications. FIWARE provides standardized tools and APIs for developing smart solutions and managing real-time data across various industrial sectors.",
      "Developed an embedded software solution utilizing LoRaWAN communication protocols and ESP-32 microcontrollers. The system enables intelligent remote management of parking infrastructure, facilitating dynamic resource allocation and optimization.",
    ],
    ctaLink: "https://www.grupoetra.com/",
    src: "https://www.matchup-project.eu/wp-content/uploads/2018/03/01-ETRA-ID-1024x412.png",
  },
  {
    id: 1,
    mdxSlug: "devoltec-sl",
    company: "DEVOLTEC SL",
    role: "Software Engineer",
    period: "2021 - 2022",
    description:
      "Developed enterprise-grade custom software solutions aligned with business requirements and technical specifications. Architected and implemented full-stack applications utilizing Angular, Express.js, and NestJS frameworks. Designed and developed RESTful APIs and custom user interfaces. Established and maintained Docker-based production environments. Managed version control systems and implemented CI/CD pipelines using GitLab to ensure continuous integration and deployment workflows.",
    shortDescription:
      "Architected enterprise software solutions with Angular and Express. Designed REST APIs and established CI/CD pipelines.",
    technologies: [
      "Angular",
      "Express",
      "Docker",
      "NestJS",
      "PostgreSQL",
      "React",
      "MongoDB",
      "Gitlab",
    ],
    achievements: [
      "Architected and developed a comprehensive Enterprise Resource Planning (ERP) system for small and medium-sized businesses in the Ontinyent region, streamlining operational processes and improving business efficiency.",
      "Designed and implemented a production control system for industrial manufacturing operations in the Ontinyent area, enabling real-time monitoring and optimization of production workflows.",
      "Developed an intelligent email categorization and management system capable of processing and organizing emails from multiple backup service providers, enhancing data organization and retrieval capabilities.",
    ],
    ctaLink: "https://devoltec.com/",
    src: "https://devoltec.com/wp-content/uploads/elementor/thumbs/devoltec-favicon-1-pscbwn8ibf6w4a5ij59sb3ie1y9wmzm1i8xlojqjtc.png",
  },
  {
    id: 2,
    mdxSlug: "good-morning-panda",
    company: "Good Morning Panda",
    role: "Frontend Engineer",
    period: "2020 - 2020",
    description:
      "Designed and developed custom web interfaces and user experiences using WordPress, HTML5, CSS3, JavaScript, and jQuery. Created comprehensive UI/UX designs and prototypes utilizing Adobe XD and Figma, ensuring responsive design principles and optimal user experience across multiple devices and platforms.",
    shortDescription:
      "Designed and developed responsive web interfaces with WordPress. Created comprehensive UI/UX designs using Figma and Adobe XD.",
    technologies: ["Wordpress", "After Effects", "Figma", "Adobe XD"],
    ctaLink: "https://goodmorningpanda.com/",
    src: "https://goodmorningpanda.com/wp-content/uploads/2019/10/goodmorningpanda_logo.png",
  },
];

export const publications: Publication[] = [
  {
    title:
      "Ensuring Data Quality in FIWARE-Based Air Quality Monitoring Systems: A Step-by-Step Approach",
    description:
      "This paper presents a structured, step-by-step approach for developing FIWARE-based air quality monitoring systems with a strong focus on data quality.",
    link: "https://ieeexplore.ieee.org/document/11205684",
    publisher: "IEEE",
    uid: 3,
    tags: ["FIWARE", "Air Quality", "Data Quality", "NGSI-LD"],
    role: "Co-Author",
  },
  {
    title: "Data Management Platform for Indoor Air Quality Management",
    description:
      "This research presents the solution for building a Data Management platform with FIWARE framework and other open-source components to monitor and manage indoor air quality.",
    link: "https://ieeexplore.ieee.org/document/10710780",
    publisher: "IEEE",
    uid: 1,
    tags: ["FIWARE", "API", "MQTT"],
    role: "Co-Author",
  },
  {
    title: "Exploring GPT's Capabilities in Chess-Puzzles",
    description:
      "Language Models have not acquired their popularity based only on their text-generation capabilities, but also for the ability of learning they do have.",
    link: "https://riunet.upv.es/handle/10251/197801",
    publisher: "UPV",
    uid: 2,
    tags: ["AI", "LLM", "GPT"],
    role: "Author",
  },
];

export const projects: Project[] = [
  {
    name: "Portfolio Terminal",
    description: "Interactive terminal-style portfolio website built with React and TypeScript",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/bgramaje/bgramaje-portfolio-v2",
  },
  {
    name: "IoT Dashboard",
    description: "Real-time monitoring dashboard for IoT devices with data visualization",
    technologies: ["Vue.js", "D3.js", "WebSockets", "Python"],
    github: "https://github.com/bgramaje",
  },
  {
    name: "ML Pipeline",
    description: "Automated machine learning pipeline for data preprocessing and model training",
    technologies: ["Python", "TensorFlow", "Apache Airflow", "Docker"],
    github: "https://github.com/bgramaje",
  },
];

export const skills: Skill[] = [
  {
    category: "Languages",
    items: ["JavaScript", "Python", "TypeScript", "SQL", "HTML", "CSS"],
  },
  {
    category: "Frontend",
    items: ["React", "Angular", "MeteorJS", "jQuery", "WordPress", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "MeteorJS"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "DuckDB", "MongoDB", "InfluxDB"],
  },
  {
    category: "Message Queues & Protocols",
    items: ["RabbitMQ", "NATS", "MQTT", "AMQP", "HTTP"],
  },
  {
    category: "Platforms & Frameworks",
    items: ["FIWARE", "NGSI-LD"],
  },
  {
    category: "DevOps & Infrastructure",
    items: ["Docker", "Kubernetes", "GitLab", "CI/CD"],
  },
  {
    category: "IoT & Embedded",
    items: ["Arduino", "PlatformIO", "ESP-32", "LoraWAN"],
  },
  {
    category: "Design Tools",
    items: ["Figma", "Adobe XD", "After Effects"],
  },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/bgramaje",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/bgramaje",
    icon: "linkedin",
  },
  {
    name: "Email",
    url: "mailto:bgramaje@gmail.com",
    icon: "mail",
  },
];

export const studies: Study[] = [
  {
    degree: "Degree in Computer Engineering",
    institution: "Universitat Politècnica de València",
    type: "degree",
  },
  {
    degree: "Degree in Information & Communication Technology",
    institution: "LAB University of Applied Sciences",
    type: "degree",
  },
  {
    degree: "Master's Degree in Software Systems Engineering and Technology",
    institution: "Univresitat Politècnica de València",
    type: "master",
  },
  {
    degree: "Master's Degree in Computational Engineering & Industrial Mathematics",
    institution: "Universitat Politècnica de València (UPV)",
    type: "master",
    ongoing: true,
  },
];

export const commands = {
  help: "Show available commands",
  jobs: "List jobs",
  publications: "Show publications",
  skills: "Show technical skills",
  contact: "Display contact information",
  studies: "Show academic studies",
  home: "Navigate to home page",
  clear: "Clear the terminal",
};

