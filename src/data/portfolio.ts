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

