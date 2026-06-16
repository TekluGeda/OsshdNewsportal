import type { News, Category, Author } from '../types';

const CATEGORIES_KEY = 'news_portal_categories';
const AUTHORS_KEY = 'news_portal_authors';
const ARTICLES_KEY = 'news_portal_articles';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Technology', description: 'Latest trends, gadgets, software development, and innovations.' },
  { id: 'cat-2', name: 'Health', description: 'Wellness, medical research, fitness, and nutrition updates.' },
  { id: 'cat-3', name: 'Education', description: 'Academic news, learning platforms, scholarships, and resources.' },
  { id: 'cat-4', name: 'Business', description: 'Market updates, corporate strategies, startups, and economy trends.' },
  { id: 'cat-5', name: 'Projects', description: 'Updates on ongoing organizational projects, milestones, and reports.' },
  { id: 'cat-6', name: 'Announcements', description: 'Official announcements and notices from the administration.' },
  { id: 'cat-7', name: 'Events', description: 'Upcoming workshops, conferences, webinars, and meetups.' }
];

const DEFAULT_AUTHORS: Author[] = [
  { id: 'auth-1', fullName: 'Sarah Connor', email: 'sconnor@organization.com' },
  { id: 'auth-2', fullName: 'John Doe', email: 'jdoe@organization.com' },
  { id: 'auth-3', fullName: 'Dr. Elizabeth Shaw', email: 'eshaw@organization.com' }
];

const DEFAULT_ARTICLES: News[] = [
  {
    id: 'art-1',
    title: 'Announcing Our Next-Gen AI Integration Project',
    summary: 'Our organization is launching a major initiative to integrate generative AI models into our internal workspace workflows to double developer velocity.',
    content: 'Today, we are thrilled to announce our new Next-Gen AI Integration Project (Project Antigravity). This initiative is aimed at adopting cutting-edge large language models across all product development cycles. Our goal is to empower developers, content writers, and administrators with intelligent assistant plugins that automate manual code review, report generation, and SEO sitemap generation.\n\nOver the next six months, the technology department will work alongside operations to roll out the initial beta program. Staff members will receive hands-on training, and we will monitor internal efficiency metrics to measure success. We believe this integration marks a new chapter for our organization, positioning us at the forefront of digital transformation.',
    category: 'Technology',
    author: 'auth-1',
    publishDate: '2026-06-02',
    status: 'published',
    featured: true,
    image1: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-06-02T10:00:00.000Z',
    updatedDate: '2026-06-02T10:00:00.000Z',
    views: 342
  },
  {
    id: 'art-2',
    title: 'Health and Wellness Week 2026 Commences Next Monday',
    summary: 'Join us for a series of seminars, fitness challenges, and dietary consultations designed to improve physical and mental wellbeing.',
    content: 'Employee health and wellbeing is a top priority. Starting next Monday, we are hosting our annual Health and Wellness Week. This event features daily virtual seminars, yoga workshops, step-count challenges, and free wellness consults with certified practitioners.\n\n"Creating a balanced workspace is crucial for sustainable performance," says Dr. Elizabeth Shaw, coordinator of the event. Daily newsletters will outline scheduling details, registration forms, and zoom links. We encourage everyone to take at least 30 minutes each day to participate in these health-promoting activities. Prizes will be awarded to team leaders with the highest average daily steps!',
    category: 'Health',
    author: 'auth-3',
    publishDate: '2026-06-01',
    status: 'published',
    featured: true,
    image1: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-06-01T08:30:00.000Z',
    updatedDate: '2026-06-01T08:30:00.000Z',
    views: 189
  },
  {
    id: 'art-3',
    title: 'Q2 Financial Briefing: Sustainable Growth and Market Penetration',
    summary: 'The executive board reported a 14% increase in year-over-year revenue, driven by strong performance in overseas markets.',
    content: 'Our Q2 Financial Briefing was presented to the stakeholders yesterday afternoon. We are delighted to report robust financial performance, showing a 14% year-over-year growth in total revenue. This milestone was achieved primarily through the successful rollout of our local operations in international hubs, paired with cost optimization efforts across key service departments.\n\nOur CFO John Doe noted: "Our disciplined capital allocation and focused strategy on software products have returned substantial yields. We plan to reinvest these profits directly into R&D for upcoming cloud infrastructure projects in Q3." A downloadable PDF version of the complete briefing slide deck is available for authenticated team members in the document library.',
    category: 'Business',
    author: 'auth-2',
    publishDate: '2026-05-30',
    status: 'published',
    featured: true,
    image1: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-05-30T14:15:00.000Z',
    updatedDate: '2026-05-30T14:15:00.000Z',
    views: 295
  },
  {
    id: 'art-4',
    title: 'Annual Tech Summit 2026 Speakers Lineup Revealed',
    summary: 'Industry leaders from across the globe gather to discuss cybersecurity, quantum computing, and ethical AI in our upcoming July conference.',
    content: 'We are excited to share the initial speaker roster for our upcoming Annual Tech Summit, scheduled to take place on July 14-16, 2026. This year, we are hosting keynote addresses from leading computer scientists and cybersecurity professionals. Panels will focus on real-world implementations of quantum cryptography, blockchain ledger audit systems, and policies surrounding ethical AI usage in corporate workspaces.\n\nEarly-bird ticket registration is now open. Seats are limited, and we expect high attendance, so register via the internal events calendar as soon as possible. Employee passes are fully sponsored by the HR department.',
    category: 'Events',
    author: 'auth-1',
    publishDate: '2026-05-28',
    status: 'published',
    featured: false,
    image1: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-05-28T09:00:00.000Z',
    updatedDate: '2026-05-28T09:00:00.000Z',
    views: 412
  },
  {
    id: 'art-5',
    title: 'Upgraded Learning Management System (LMS) Launches Next Week',
    summary: 'The HR department is introducing an upgraded learning portal, complete with interactive courses, career pathway recommendations, and certifications.',
    content: 'Continuing our commitment to staff development and professional growth, we are migrating to an upgraded Learning Management System (LMS) next Monday. This next-gen portal offers a sleek responsive interface, hundreds of curated video lectures on software development, project management, and leadership, and an automated system that matches skills gaps with personalized course recommendations.\n\nAll progress from the legacy LMS will be migrated automatically over the weekend. Staff members will receive an email login activation link on Monday morning. Please contact the education board if you experience login credentials issues during the initial launch phase.',
    category: 'Education',
    author: 'auth-3',
    publishDate: '2026-05-25',
    status: 'published',
    featured: false,
    image1: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-05-25T11:00:00.000Z',
    updatedDate: '2026-05-25T11:00:00.000Z',
    views: 204
  },
  {
    id: 'art-6',
    title: 'Office Relocation & Workspace Modernization Update',
    summary: 'The operations department outlines key milestones and safety instructions for our upcoming transition to the new green headquarters.',
    content: 'As part of our commitment to reducing our carbon footprint, our organization is preparing to move to our new solar-powered, green-certified corporate headquarters in downtown next month. The operations department has compiled a timeline mapping office division packing slots, layout blueprints, and security badge distribution dates.\n\nThe new workspace features adjustable standing desks, natural green spaces, interactive brainstorming zones, and advanced HVAC filtering systems for clean air. Please read the PDF guide sent via email to familiarize yourself with the recycling systems and ergonomic workstation options.',
    category: 'Announcements',
    author: 'auth-2',
    publishDate: '2026-05-20',
    status: 'published',
    featured: false,
    image1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-05-20T16:00:00.000Z',
    updatedDate: '2026-05-20T16:00:00.000Z',
    views: 153
  },
  {
    id: 'art-7',
    title: 'Smart Infrastructure IoT Rollout Hits Phase 3 Milestone',
    summary: 'The engineering division reports successful installation of IoT sensor gateways across 85% of regional utility nodes.',
    content: 'We are pleased to announce that our Smart Infrastructure IoT Rollout has officially achieved its Phase 3 milestone. Over the past three months, the field engineering team has deployed, configured, and tested sensor gateways across 85% of target utility systems in the region. This enables real-time telemetry mapping, predictive leak detection, and automated grid optimization workflows.\n\nPhase 4 will commence next month, focusing on custom edge AI analytical workloads that digest raw sensor metrics to flag wear-and-tear events before they escalate. Kudos to the entire field crew for hitting this target ahead of schedule!',
    category: 'Projects',
    author: 'auth-1',
    publishDate: '2026-05-15',
    status: 'published',
    featured: false,
    image1: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-05-15T10:00:00.000Z',
    updatedDate: '2026-05-15T10:00:00.000Z',
    views: 228
  },
  {
    id: 'art-8',
    title: 'Future Draft: Upcoming Organization Rebranding Framework',
    summary: 'A sneak peek into the draft plans for our organizational visual rebranding scheduled for late 2026.',
    content: 'This is a draft document outlining our planned visual rebranding strategy. We will transition to a modern design aesthetic emphasizing simplicity, responsiveness, and premium typography. Our brand logo will be streamlined and standard layouts will adopt a dark-mode first structure. Do not distribute this document publicly as it is currently in review and pending approvals from the steering board.',
    category: 'Announcements',
    author: 'auth-2',
    publishDate: '2026-06-03',
    status: 'draft',
    featured: false,
    image1: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    image2: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
    image3: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    createdDate: '2026-06-03T12:00:00.000Z',
    updatedDate: '2026-06-03T12:00:00.000Z',
    views: 12
  }
];

export const initDb = () => {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem(AUTHORS_KEY)) {
    localStorage.setItem(AUTHORS_KEY, JSON.stringify(DEFAULT_AUTHORS));
  }
  if (!localStorage.getItem(ARTICLES_KEY)) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(DEFAULT_ARTICLES));
  }
};

export const getStoredCategories = (): Category[] => {
  initDb();
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
};

export const saveStoredCategories = (categories: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getStoredAuthors = (): Author[] => {
  initDb();
  return JSON.parse(localStorage.getItem(AUTHORS_KEY) || '[]');
};

export const saveStoredAuthors = (authors: Author[]) => {
  localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors));
};

export const getStoredArticles = (): News[] => {
  initDb();
  return JSON.parse(localStorage.getItem(ARTICLES_KEY) || '[]');
};

export const saveStoredArticles = (articles: News[]) => {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
};
