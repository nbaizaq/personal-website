import type {
  CvExperience,
  CvEducation,
  CvAward,
  EmploymentType,
} from "~/utils/types";

// Utility function to calculate years between two dates
function calculateYears(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  const diffTime = Math.abs(end.getTime() - startDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(diffYears * 10) / 10; // Round to 1 decimal place
}

// Calculate total years of experience from employment experiences
function calculateTotalExperienceYears(experiences: CvExperience[]): number {
  const employmentExperiences = experiences.filter(
    (exp) => exp.type === "employment"
  );

  if (employmentExperiences.length === 0) return 0;

  // Sort by start date to handle overlapping periods
  const sortedExperiences = employmentExperiences.sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  let totalYears = 0;
  let currentEnd = new Date(0);

  for (const exp of sortedExperiences) {
    const start = exp.start;
    const end = exp.end || new Date();

    // If this experience starts after the previous one ended, add the gap
    if (start > currentEnd) {
      totalYears += calculateYears(start, end);
    } else {
      // If overlapping, only add the additional time beyond currentEnd
      if (end > currentEnd) {
        totalYears += calculateYears(currentEnd, end);
      }
    }

    if (end > currentEnd) {
      currentEnd = end;
    }
  }

  return Math.round(totalYears * 10) / 10; // Round to 1 decimal place
}

// Calculate years for a specific experience
function calculateExperienceYears(experience: CvExperience): number {
  return calculateYears(experience.start, experience.end);
}

export const experiences: CvExperience[] = [
  {
    id: "research-assistant-bmipl",
    type: "employment",
    title: "Research Assistant Intern",
    start: new Date("2018-09-01"),
    end: new Date("2018-12-01"),
    company: "Bio-Medical Image Processing Lab (BMIPL)",
    location: "Ulsan, South Korea",
    employmentType: "part-time",
    responsibilities: [
      "Conducted research on deep learning models and machine learning algorithms for cancer detection using computer vision techniques.",
      "Enhanced deep learning model performance through hyperparameter optimization, achieving 7% improvement in accuracy metrics.",
      "Implemented data preprocessing pipelines and feature engineering for medical imaging datasets.",
    ],
    techStack: [
      "Python",
      "Tensorflow",
      "Keras",
      "Scikit-learn",
      "Matplotlib",
      "Deep Learning",
      "Computer Vision",
      "Machine Learning",
    ],
  },
  {
    id: "csharp-developer-megasoft",
    type: "employment",
    title: "C# Developer",
    start: new Date("2019-11-01"),
    end: new Date("2020-02-01"),
    company: 'LLC "Mega Soft"',
    location: "Bishkek, Kyrgyzstan",
    employmentType: "full-time",
    responsibilities: [
      "Engineered and deployed machine learning models for token prediction in sequential datasets using NLP techniques.",
      "Developed OCR system with image processing capabilities for processing skewed and distorted text.",
      "Architected and deployed web-based issue recognition system with RESTful APIs and database integration.",
    ],
    techStack: [
      "C#",
      "ASP.NET",
      "Python",
      "OpenCV",
      "Scikit-learn",
      "Matplotlib",
      "Tensorflow",
      "Machine Learning",
      "NLP",
      "Computer Vision",
      "RESTful APIs",
    ],
  },
  {
    id: "fullstack-php-crmtech",
    type: "employment",
    title: "Full Stack PHP Developer",
    start: new Date("2020-11-01"),
    end: new Date("2021-05-01"),
    company: 'LLC "CRM Technologies"',
    location: "Bishkek, Kyrgyzstan",
    employmentType: "full-time",
    responsibilities: [
      "Developed and delivered custom CRM solutions for enterprise clients with comprehensive maintenance and support protocols.",
      "Designed and implemented RESTful APIs and microservices architecture for seamless data exchange between mobile and back-end systems.",
      "Implemented custom canvas-based UI approach, achieving 30% improvement in page load times.",
    ],
    techStack: [
      "JavaScript",
      "TypeScript",
      "PHP",
      "jQuery",
      "HTML",
      "CSS",
      "MySQL",
      "Linux",
      "RESTful APIs",
    ],
  },
  {
    id: "team-lead-frontend-tumarsoft",
    type: "employment",
    title: "Team Lead Front-End Developer",
    start: new Date("2022-01-01"),
    end: new Date("2024-04-01"),
    company: 'LLC "Tumarsoft"',
    employmentType: "full-time",
    location: "Bishkek, Kyrgyzstan",
    responsibilities: [
      "Led front-end development for fintech solutions using Agile methodologies, ensuring system stability and timely delivery.",
      "Contributed to strategic product roadmap development and technical architecture decisions through stakeholder collaboration.",
      "Developed and maintained robust, scalable front-end solutions with comprehensive error handling and performance monitoring.",
      "Implemented full-stack demo product using modern development practices for rapid prototyping and innovation.",
      "Conducted technical interviews, code reviews, and provided mentorship to front-end development team.",
      "Designed and implemented company-wide design system and UI component library using Storybook.",
    ],
    techStack: [
      "JavaScript",
      "TypeScript",
      "Vue.js",
      "Nuxt.js",
      "HTML",
      "CSS",
      "SCSS",
      "TailwindCSS",
      "UnoCSS",
      "Storybook",
      "Vuetify",
      "Quasar",
      "Node.js",
      "MongoDB",
      "Linux",
      "CI/CD",
      "Docker",
      "Agile Development",
      "Design Systems",
      "Component Libraries",
      "Code Review",
      "Technical Leadership",
    ],
  },
  {
    id: "team-lead-frontend-ogogo",
    type: "employment",
    title: "Team Lead Front-End Developer",
    start: new Date("2024-04-01"),
    company: 'LLC "OGOGO"',
    employmentType: "part-time",
    location: "Bishkek, Kyrgyzstan",
    responsibilities: [
      "Spearheaded front-end development for financial technology innovations using modern frameworks and best practices.",
      "Collaborated with cross-functional teams including product managers, UX designers, and backend developers to shape product vision.",
      "Crafted high-performance, responsive front-end solutions with comprehensive testing and monitoring.",
      "Conceived and implemented company-wide UI library and design system using component-based architecture.",
      "Led end-to-end product development lifecycle from ideation to launch using Agile methodologies.",
    ],
    techStack: [
      "JavaScript",
      "TypeScript",
      "Vue.js",
      "Nuxt.js",
      "HTML",
      "CSS",
      "TailwindCSS",
      "UnoCSS",
      "Storybook",
      "CI/CD",
      "Docker",
      "Agile Development",
      "Product Management",
      "Stakeholder Management",
      "Quality Assurance",
      "Accessibility",
      "Responsive Design",
    ],
  },
  {
    id: "fullstack-php-bilimot",
    type: "project",
    title: "Full Stack PHP Developer",
    start: new Date("2019-02-01"),
    end: new Date("2020-06-01"),
    company: 'LLC "Bilimot"',
    website: "http://bilimot.kg", // TODO: change to https://bilimot.kg
    employmentType: "part-time",
    responsibilities: [
      "Designed, architected, and deployed scalable educational platform website for National Graduate Exam preparation.",
      "Tailored website to meet user requirements through user-centered design principles, ensuring seamless user experience.",
      "Implemented continuous maintenance and monitoring protocols with regular security updates and performance optimizations.",
    ],
    techStack: [
      "PHP",
      "Laravel",
      "JavaScript",
      "HTML",
      "CSS",
      "MySQL",
      "Apache Server",
      "Nginx",
      "Python",
      "Linux",
      "Scalable Architecture",
      "User-Centered Design",
      "Security Best Practices",
      "Performance Monitoring",
    ],
  },
  {
    id: "fullstack-php-ask-ai",
    type: "project",
    title: "Full Stack PHP Developer",
    start: new Date("2021-07-01"),
    end: new Date("2021-11-01"),
    company: 'LLC "Ask consulting"',
    employmentType: "part-time",
    responsibilities: [
      "Developed an innovative online learning platform leveraging artificial intelligence and machine learning algorithms for evaluation of human-produced data and personalized learning experiences.",
      "Researched and implemented novel methodologies for generating synthetic English words using natural language processing techniques to enhance English language skills practice.",
      "Integrated advanced AI technology and recommendation systems to enhance user experience and provide personalized learning recommendations based on user behavior analytics.",
      "Utilized machine learning algorithms and AI technologies to cross-check user answers and provide instant, contextual feedback for improved learning outcomes.",
    ],
    techStack: [
      "PHP",
      "Laravel",
      "JavaScript",
      "TypeScript",
      "Vue.js",
      "Python",
      "Google Cloud",
      "C++",
      "HTML",
      "CSS",
      "MySQL",
      "Nginx",
      "Linux",
      "Artificial Intelligence",
      "Machine Learning",
      "Natural Language Processing",
      "Recommendation Systems",
      "Cloud Computing",
    ],
  },
  {
    id: "fullstack-php-csharp-ask-crm",
    type: "project",
    title: "Full Stack PHP/C# Developer",
    start: new Date("2022-01-01"),
    end: new Date("2025-05-01"),
    website: "https://ask.kg",
    company: 'LLC "Ask consulting"',
    employmentType: "part-time",
    responsibilities: [
      "Developed custom CRM solution with workflow automation and personalized client dashboards.",
      "Ensured smooth CRM operation through DevOps practices, monitoring, and user training.",
      "Implemented robust data management system with validation and optimization.",
      "Integrated automated call event tracking and real-time monitoring for client communication.",
      "Translated client requirements into product features through rapid prototyping and development.",
      "Delivered staging and production deployment pipelines with CI/CD and automated testing.",
    ],
    techStack: [
      "PHP",
      "Laravel",
      "C#",
      "ASP.NET",
      "JavaScript",
      "TypeScript",
      "Vue.js",
      "React",
      "Next.js",
      "Vercel",
      "HTML",
      "CSS",
      "SCSS",
      "MySQL",
      "PostgreSQL",
      "Docker",
      "Nginx",
      "Linux",
      "Workflow Automation",
      "DevOps",
      "CI/CD",
      "Database Optimization",
      "Real-time Monitoring",
      "Requirements Gathering",
      "Wireframing",
      "Scalable Solutions",
    ],
  },
  {
    id: "frontend-engineer-accepted",
    type: "project",
    title: "Frontend Engineer",
    start: new Date("2024-09-01"),
    website: "https://accepted.kg",
    company: 'LLC "Ask consulting"',
    employmentType: "part-time",
    responsibilities: [
      "Developed responsive web applications using modern JavaScript frameworks and component-based architecture.",
      "Implemented internationalization (i18n) for multi-language platforms.",
      "Built secure user management with authentication, authorization, and RBAC.",
      "Created real-time messaging with WebSocket technologies and event-driven architecture.",
      "Developed e-commerce functionality including shopping cart, payment processing, and order management.",
      "Designed admin dashboards with CRUD operations, data visualization, and reporting.",
      "Maintained code quality through automated testing, linting, and version control best practices.",
    ],
    techStack: [
      "JavaScript",
      "TypeScript",
      "Vue.js",
      "HTML",
      "CSS",
      "Docker",
      "REST APIs",
      "WebSockets",
      "Git",
      "Nuxt",
      "Nuxt UI",
      "PrimeVue",
      "TailwindCSS",
      "Progressive Web Apps",
      "State Management",
      "Internationalization",
      "Authentication",
      "Authorization",
      "RBAC",
      "E-commerce",
      "Payment Processing",
      "Data Visualization",
      "Automated Testing",
      "Static Analysis",
      "Event-Driven Architecture",
    ],
  },
].filter((e) => e.type !== "project") as CvExperience[];

experiences.sort((a, b) => {
  return new Date(b.start).getTime() - new Date(a.start).getTime();
});

export const professionalSummary = (() => {
  const totalYears = calculateTotalExperienceYears(experiences);
  return `Experienced Front-End Team Lead and Full-Stack Software Engineer with ${totalYears}+ years of expertise in delivering scalable web applications and fintech solutions. Proven track record in Agile development, leading cross-functional teams, and implementing DevOps practices including CI/CD pipelines. Strong proficiency in modern JavaScript frameworks (Vue.js, React), microservices architecture, and cloud-native development. Expertise in design systems, responsive UI/UX, database design, and automated testing frameworks. Committed to writing clean, maintainable code following SOLID principles.`;
})();

// Export utility functions for use in components
export const getExperienceDuration = (experience: CvExperience): string => {
  const years = calculateExperienceYears(experience);
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
  return `${years} year${years !== 1 ? "s" : ""}`;
};

export const getTotalExperienceYears = (): number => {
  return calculateTotalExperienceYears(experiences);
};

export const getExperienceYears = (experience: CvExperience): number => {
  return calculateExperienceYears(experience);
};

export const education: CvEducation = {
  start: new Date("2016-09-01"),
  end: new Date("2019-12-01"),
  university: "UNIST",
  location: "Ulsan, South Korea",
  degree: "Bachelor of Science",
  major: "Electrical Engineering",
  minor: "Computer Science and Engineering",
  // TODO: add GPA
  // gpa: "4.0"
  // TODO: add courses
  // courses: [
  //   "Optimization Theory",
  // ],
  academicLeaves: [
    {
      start: new Date("2019-09-01"),
      end: new Date("2020-02-01"),
      reasons: [
        {
          title: "Internship",
          employmentType: "full-time" as EmploymentType, // Cast to EmploymentType
          company: 'LLC "Mega Soft"',
          experienceId: "csharp-developer-megasoft", // Link to the C# Developer experience
        },
      ],
    },
    {
      start: new Date("2020-09-01"),
      end: new Date("2021-06-01"),
      reasons: [
        {
          title: "Employment",
          employmentType: "full-time" as EmploymentType, // Cast to EmploymentType
          company: 'LLC "CRM Technologies"',
          experienceId: "fullstack-php-crmtech", // Link to the Full Stack PHP Developer experience
        },
      ],
    },
  ],
};

export const awards: CvAward[] = [
  {
    dates: [new Date("2015-03-01"), new Date("2016-03-01")],
    award: "Two-time winner (1st place) of National Olympiad in Physics",
    location: "Bishkek, Kyrgyzstan",
  },
  {
    dates: [new Date("2015-02-01")],
    award: '2nd place in Online Physics Olympiad "Phystech"',
    location: "Moscow, Russian Federation",
  },
  {
    award: "Honorable Mention in IPhO",
    location: "Zurich, Switzerland",
    dates: [new Date("2016-07-01")],
  },
  {
    award: "3rd place in Inter-University Rowing Competition (8x)",
    location: "Ulsan, South Korea",
    dates: [new Date("2019-10-01")],
  },
  {
    award: '"Академия Яндекса - школа разработки интерфейсов" Graduate',
    location: "Moscow, Russian Federation",
    dates: [new Date("2022-09-01"), new Date("2022-11-01")],
  },
];
awards.sort((a, b) => {
  return new Date(b.dates[0]).getTime() - new Date(a.dates[0]).getTime();
});

export const languages: string[] = [
  "English - Fluent (TOEFL: 100)",
  "Russian - Fluent",
  "Kyrgyz - Native",
];

export const skills = (() => {
  // Count frequency of each skill
  const skillCounts: Record<string, number> = {};
  experiences.forEach((exp) => {
    exp?.techStack?.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  // Sort skills by frequency (descending)
  const sortedSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);
  // Only amplify the most relevant (top 10) skills
  const topSkills = sortedSkills.slice(0, 30).map(([skill]) => skill);
  return topSkills;
})();
