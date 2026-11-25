export interface Profile {
  name: string;
  tagline: string;
  about: string;
  education: string;
  award: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  photo: string;
}

export interface Experience {
  role: string;
  org: string;
  dates: string;
  place: string;
  points: string[];
}

export interface Project {
  name: string;
  date: string;
  url: string | null;
  image: string;
  desc: string;
  tags: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export const profile: Profile = {
  name: 'Sam Vu',
  // Digital Hardware Specialization left out until admission is confirmed.
  tagline:
    'Computer Science (Co-op) at the University of Waterloo · Embedded flight software at WARG',
  about: '', // Sam writes this; render a visible TODO in dev only
  education: 'B.CS (Co-op) · Sep 2026 – May 2031',
  award: "President's Scholarship of Distinction (2026)",
  email: 'dangvu3627@gmail.com',
  github: 'https://github.com/dangvu3627',
  linkedin: 'https://linkedin.com/in/sam-vu-waterloo/',
  resume: '/resume.pdf',
  photo: '/img/sam.jpg',
};

export const experience: Experience[] = [
  {
    role: 'Embedded Flight Software Developer',
    org: 'Waterloo Aerial Robotics Group (WARG)',
    dates: 'Sep 2026 – Present',
    place: 'Waterloo, ON',
    points: [
      'Developing a CAN blackbox logger in C on STM32 to record flight-system CAN traffic for debugging',
      'Wrote STM32 firmware reading an MCP3004 ADC over SPI and mapping each reading to a PWM output',
      'Coordinate asynchronously with the firmware team through Git feature branches and Confluence docs',
    ],
  },
  {
    role: 'Co-Lead, Sumobot Team',
    org: 'TDCH Robotics Club',
    dates: 'Sep 2025 – Nov 2025',
    place: 'Vaughan, ON',
    points: [
      'Co-led a 5-person team at the Ontario Tech University Sumobot competition, placing in the top 16',
      'Built a high-torque LEGO sumo robot with a 25:1 gear reduction to out-push opponents',
    ],
  },
];

export const projects: Project[] = [
  {
    name: 'Arduino Quadcopter',
    date: 'Nov 2025',
    url: 'https://github.com/dangvu3627/Arduino-Drone',
    image: '/img/projects/quadcopter.webp',
    desc: 'Quadcopter built and flight-tested on an Arduino Nano with an MPU6050 IMU, plus a custom 6-channel 2.4 GHz controller and a receiver with a 1 s failsafe.',
    tags: ['C++', 'Arduino', 'nRF24L01', 'MPU6050', 'ESCs'],
  },
  {
    name: 'FarmBot',
    date: 'Nov 2026',
    url: 'https://github.com/dangvu3627/FarmBot',
    image: '/img/projects/farmbot.webp',
    desc: 'Battery-powered handheld game console on an ESP32 with a 128x64 OLED and rotary encoder; 30 Hz main loop and CRC-32-checked saves to flash.',
    tags: ['C++', 'ESP32', 'PlatformIO', 'I2C'],
  },
  {
    name: 'Split',
    date: 'Nov 2026',
    url: null,
    image: '/img/projects/split.webp',
    desc: 'Receipt-scanning bill-splitting app built by a 2-person team at a hackathon, with idempotent PayPal Orders API requests to block duplicate charges.',
    tags: ['Node.js', 'Gemini API', 'PayPal API'],
  },
  {
    name: 'Pyronac',
    date: 'Oct 2026',
    url: 'https://github.com/andrewl746/pyronac',
    image: '/img/projects/pyronac.webp',
    desc: 'NASA Space Apps Challenge 2026: built the frontend with a 6-person team in 48 hours and presented it to the judges.',
    tags: ['React', 'TypeScript'],
  },
];

export const skills: SkillGroup[] = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'JavaScript'] },
  { group: 'Microcontrollers', items: ['STM32', 'ESP32', 'Arduino (ATmega328P)'] },
  { group: 'Protocols', items: ['CAN', 'SPI', 'I2C', 'UART', 'PWM', 'PPM', 'ADC'] },
  {
    group: 'Embedded concepts',
    items: ['Timer interrupts', 'Real-time loops', 'Failsafes', 'Flash/NVS', 'Debouncing'],
  },
  {
    group: 'Hardware',
    items: ['IMU (MPU6050)', 'ESCs', 'Motors', 'Servos', 'nRF24L01', 'OLED', 'Rotary encoders'],
  },
  { group: 'Developer tools', items: ['Git', 'STM32CubeIDE', 'PlatformIO', 'VS Code'] },
];

/** Section labels and nav, kept here so components hold no copy. */
export const sections = [
  // About lives in the hero (#top), so it has no section or nav link of its own.
  { id: 'experience', sec: 'experience', label: 'Experience', index: '01', heading: 'Experience' },
  { id: 'projects', sec: 'projects', label: 'Projects', index: '02', heading: 'Projects' },
  { id: 'skills', sec: 'skills', label: 'Skills', index: '03', heading: 'Skills' },
  { id: 'contact', sec: 'contact', label: 'Contact', index: '04', heading: "Let's talk." },
] as const;

/** Current-section label in the top-right of the HUD bar. */
export const hudMap: Record<string, { label: string }> = {
  hero: { label: 'INTRO' },
  experience: { label: 'EXPERIENCE' },
  projects: { label: 'PROJECTS' },
  skills: { label: 'SKILLS' },
  contact: { label: 'CONTACT' },
};

/** Static HUD readouts in the hero FOV frame (decorative). */
export const fov = {
  top: ['REC', 'RSSI: -72dBm', '02:28:00', 'GPS: 14', 'BAT: 23%'],
  bottom: ['DIST: 1240m', 'GS: 119km/h'],
  left: 'V.S.: 0.0',
  right: 'ALT: 154m',
  label: 'TARGET ACQUIRED',
  lock: 'TGT LOCK',
};

/** Hero buttons and contact copy. */
export const cta = {
  resume: 'Resume',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  contact: 'Contact me',
};

export const contact = {
  pitch:
    "Looking for a Summer 2027 co-op. If you're building something interesting, I'd love to hear from you.",
};

export const meta = {
  title: 'Sam Vu · Embedded & Hardware Portfolio',
  description: `Sam Vu: ${profile.tagline}.`,
  ogImage: '/og.png',
  skipLink: 'Skip to content',
  portraitAlt: 'Portrait of Sam Vu',
  photoPlaceholder: 'Photo coming soon',
  aboutTodo: 'TODO (dev only): write the About paragraph in src/data/site.ts',
  copyright: '© 2026 Sam Vu',
};
