import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with realistic dummy data...');

  // Clear existing seed-generated data (keep users for auth)
  await prisma.application.deleteMany({});
  await prisma.techStack.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.roadmap.deleteMany({});
  console.log('✅ Cleared previous project data');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ─── USERS (Freelancers & Clients) ─────────────────────────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.developer@example.com' },
      update: {},
      create: {
        email: 'john.developer@example.com',
        password: hashedPassword,
        role: 'freelancer',
        profile: {
          create: {
            fullName: 'John Anderson',
            location: 'San Francisco, CA',
            bio: 'Full-stack developer with 8+ years building scalable web apps. Ex-Stripe. React, TypeScript, Node.js, PostgreSQL. I ship on time and keep code maintainable.',
            website: 'https://johndev.io',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          }
        },
        skills: {
          create: [
            { name: 'React', proficiency: 95 },
            { name: 'TypeScript', proficiency: 90 },
            { name: 'Node.js', proficiency: 88 },
            { name: 'PostgreSQL', proficiency: 85 },
            { name: 'AWS', proficiency: 80 }
          ]
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.designer@example.com' },
      update: {},
      create: {
        email: 'sarah.designer@example.com',
        password: hashedPassword,
        role: 'freelancer',
        profile: {
          create: {
            fullName: 'Sarah Mitchell',
            location: 'Brooklyn, NY',
            bio: 'Senior UI/UX designer. 6 years in fintech and healthtech. Design systems, user research, high-fidelity prototypes. Figma expert.',
            website: 'https://sarahdesigns.co',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
          }
        },
        skills: {
          create: [
            { name: 'Figma', proficiency: 98 },
            { name: 'UI Design', proficiency: 95 },
            { name: 'UX Research', proficiency: 90 },
            { name: 'Prototyping', proficiency: 88 },
            { name: 'Design Systems', proficiency: 85 }
          ]
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike.backend@example.com' },
      update: {},
      create: {
        email: 'mike.backend@example.com',
        password: hashedPassword,
        role: 'freelancer',
        profile: {
          create: {
            fullName: 'Michael Chen',
            location: 'Seattle, WA',
            bio: 'Backend engineer. Python, Go, distributed systems. Previously at Google and Amazon. I build APIs that scale and stay readable.',
            website: 'https://mikechen.dev',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          }
        },
        skills: {
          create: [
            { name: 'Python', proficiency: 95 },
            { name: 'Go', proficiency: 90 },
            { name: 'Docker', proficiency: 92 },
            { name: 'Kubernetes', proficiency: 85 },
            { name: 'PostgreSQL', proficiency: 88 }
          ]
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'emma.client@example.com' },
      update: {},
      create: {
        email: 'emma.client@example.com',
        password: hashedPassword,
        role: 'client',
        profile: {
          create: {
            fullName: 'Emma Williams',
            location: 'Austin, TX',
            bio: 'Founder at Remotify — tools for async teams. Previously PM at Notion. Always hiring great contractors.',
            website: 'https://remotify.io',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'david.client@example.com' },
      update: {},
      create: {
        email: 'david.client@example.com',
        password: hashedPassword,
        role: 'client',
        profile: {
          create: {
            fullName: 'David Park',
            location: 'Los Angeles, CA',
            bio: 'Tech founder. Building an AI-powered learning platform. Two previous exits. Looking for senior engineers who care about product.',
            website: 'https://edutechventures.com',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'alex.fullstack@example.com' },
      update: {},
      create: {
        email: 'alex.fullstack@example.com',
        password: hashedPassword,
        role: 'freelancer',
        profile: {
          create: {
            fullName: 'Alex Rodriguez',
            location: 'Miami, FL',
            bio: 'Mobile & web developer. Shipped 20+ apps to App Store and Play Store. React Native, Flutter, React. Strong in real-time and payments.',
            website: 'https://alexdev.app',
            avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
          }
        },
        skills: {
          create: [
            { name: 'React Native', proficiency: 94 },
            { name: 'Flutter', proficiency: 88 },
            { name: 'React', proficiency: 90 },
            { name: 'Firebase', proficiency: 90 },
            { name: 'Stripe', proficiency: 82 }
          ]
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'priya.data@example.com' },
      update: {},
      create: {
        email: 'priya.data@example.com',
        password: hashedPassword,
        role: 'freelancer',
        profile: {
          create: {
            fullName: 'Priya Sharma',
            location: 'Boston, MA',
            bio: 'Data engineer and BI specialist. Python, SQL, dbt, BigQuery, Looker. I turn messy data into clear dashboards and pipelines.',
            website: 'https://priyadata.com',
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
          }
        },
        skills: {
          create: [
            { name: 'Python', proficiency: 92 },
            { name: 'SQL', proficiency: 95 },
            { name: 'dbt', proficiency: 85 },
            { name: 'Looker', proficiency: 88 },
            { name: 'BigQuery', proficiency: 90 }
          ]
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'james.client@example.com' },
      update: {},
      create: {
        email: 'james.client@example.com',
        password: hashedPassword,
        role: 'client',
        profile: {
          create: {
            fullName: 'James Okonkwo',
            location: 'London, UK',
            bio: 'CTO at a Series A healthtech startup. We need senior frontend and backend contractors for the next 6 months.',
            website: 'https://healthflow.io',
            avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
          }
        }
      }
    })
  ]);

  console.log('✅ Users created');

  const emma = await prisma.user.findUnique({ where: { email: 'emma.client@example.com' } });
  const david = await prisma.user.findUnique({ where: { email: 'david.client@example.com' } });
  const james = await prisma.user.findUnique({ where: { email: 'james.client@example.com' } });
  const john = await prisma.user.findUnique({ where: { email: 'john.developer@example.com' } });
  const sarah = await prisma.user.findUnique({ where: { email: 'sarah.designer@example.com' } });
  const mike = await prisma.user.findUnique({ where: { email: 'mike.backend@example.com' } });
  const alex = await prisma.user.findUnique({ where: { email: 'alex.fullstack@example.com' } });
  const priya = await prisma.user.findUnique({ where: { email: 'priya.data@example.com' } });

  const clients = [emma!, david!, james!];
  const freelancers = [john!, sarah!, mike!, alex!, priya!];

  // ─── PROJECTS (realistic job postings) ─────────────────────────────────
  const projectData = [
    {
      title: 'E-commerce Admin Dashboard (React + Real-time Analytics)',
      description: 'We need an experienced React developer to build an admin dashboard for our D2C brand. Requirements: real-time order/inventory updates, charts (recharts or similar), role-based access, export to CSV. Design is in Figma. Prefer TypeScript and clean component structure. We use a REST API; no GraphQL.',
      deadline: new Date('2025-02-20'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$4,500 - $6,500',
      owner: emma!,
      techStack: [
        { name: 'React', proficiency: 90 },
        { name: 'TypeScript', proficiency: 85 },
        { name: 'Tailwind CSS', proficiency: 80 },
        { name: 'Recharts', proficiency: 75 }
      ]
    },
    {
      title: 'Mobile App UI/UX Redesign — Fitness & Wellness',
      description: 'Our fitness app has 50k MAU but the UI feels dated. We need a senior designer to own the full redesign: onboarding, home, workout flows, and settings. Deliverables: Figma file with components and prototypes, handoff doc. We have a design system started; you’ll extend it. Experience with health/fitness apps is a plus.',
      deadline: new Date('2025-01-28'),
      duration: 'short' as const,
      workType: ['remote', 'hybrid'] as const,
      budget: '$3,200 - $4,500',
      owner: david!,
      techStack: [
        { name: 'Figma', proficiency: 95 },
        { name: 'UI Design', proficiency: 90 },
        { name: 'Prototyping', proficiency: 85 },
        { name: 'Design Systems', proficiency: 80 }
      ]
    },
    {
      title: 'Backend APIs for SaaS (Auth, Billing, Webhooks)',
      description: 'We’re building a B2B SaaS and need a backend engineer to implement auth (JWT + refresh), subscription/billing (Stripe), and webhooks. Stack: Node.js or Python, PostgreSQL, Redis for rate limiting. Must write tests and OpenAPI docs. Experience with Stripe Billing is required.',
      deadline: new Date('2025-03-05'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$7,000 - $10,000',
      owner: emma!,
      techStack: [
        { name: 'Node.js', proficiency: 90 },
        { name: 'PostgreSQL', proficiency: 85 },
        { name: 'Redis', proficiency: 75 },
        { name: 'Stripe', proficiency: 85 }
      ]
    },
    {
      title: 'AI Customer Support Chatbot (OpenAI + Custom Knowledge)',
      description: 'Integrate an AI chatbot into our help center. It should use our docs (we can provide sitemap/API) and support multi-turn conversations. We need: conversation history, basic analytics, and an admin UI to tweak prompts. Prefer Python/FastAPI or Node. Experience with RAG or LangChain is a plus.',
      deadline: new Date('2025-02-12'),
      duration: 'short' as const,
      workType: ['remote'] as const,
      budget: '$3,500 - $5,500',
      owner: david!,
      techStack: [
        { name: 'Python', proficiency: 85 },
        { name: 'OpenAI API', proficiency: 80 },
        { name: 'FastAPI', proficiency: 75 },
        { name: 'LangChain', proficiency: 70 }
      ]
    },
    {
      title: 'Full-stack Project Management Tool (MVP)',
      description: 'We need a senior full-stack developer to build an MVP: projects, tasks, assignees, due dates, comments, and file attachments. Auth, basic roles, and a simple dashboard. Tech stack is flexible (React + Node or similar). We’ll provide designs. Goal: production-ready MVP in 10–12 weeks.',
      deadline: new Date('2025-05-01'),
      duration: 'long' as const,
      workType: ['remote', 'hybrid'] as const,
      budget: '$18,000 - $28,000',
      owner: emma!,
      techStack: [
        { name: 'React', proficiency: 90 },
        { name: 'Node.js', proficiency: 90 },
        { name: 'PostgreSQL', proficiency: 85 },
        { name: 'AWS', proficiency: 75 }
      ]
    },
    {
      title: 'BI Dashboard — Sales & Operations (Real-time)',
      description: 'We need a dashboard that connects to our PostgreSQL DB and shows: revenue by region/product, pipeline stages, and operational KPIs. Real-time updates (polling or WebSocket). Export to PDF/Excel. Must handle large datasets (1M+ rows) without killing the browser. Experience with D3 or similar is a plus.',
      deadline: new Date('2025-03-15'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$6,000 - $9,000',
      owner: david!,
      techStack: [
        { name: 'React', proficiency: 85 },
        { name: 'D3.js', proficiency: 85 },
        { name: 'PostgreSQL', proficiency: 80 },
        { name: 'WebSocket', proficiency: 75 }
      ]
    },
    {
      title: 'Food Delivery App (React Native) — iOS & Android',
      description: 'We need a React Native developer to build our consumer app: menu, cart, checkout (Stripe), order tracking (real-time), push notifications, and basic account management. Backend APIs exist. We need clean UI, good performance, and App Store / Play Store deployment experience.',
      deadline: new Date('2025-04-10'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$10,000 - $14,000',
      owner: emma!,
      techStack: [
        { name: 'React Native', proficiency: 90 },
        { name: 'TypeScript', proficiency: 85 },
        { name: 'Firebase', proficiency: 80 },
        { name: 'Stripe', proficiency: 75 }
      ]
    },
    {
      title: 'WordPress + WooCommerce Store (Custom Theme)',
      description: 'Boutique fashion brand needs a custom WordPress/WooCommerce site: custom theme (from Figma), product variants, checkout, and inventory sync with our warehouse API. Experience with WooCommerce hooks and payment gateways required. No page builders — we want clean code.',
      deadline: new Date('2025-01-22'),
      duration: 'short' as const,
      workType: ['remote', 'onsite'] as const,
      budget: '$2,500 - $4,000',
      owner: david!,
      techStack: [
        { name: 'WordPress', proficiency: 90 },
        { name: 'WooCommerce', proficiency: 85 },
        { name: 'PHP', proficiency: 80 },
        { name: 'JavaScript', proficiency: 75 }
      ]
    },
    {
      title: 'Healthcare Portal — Patient Dashboard & Appointments',
      description: 'We need a secure patient portal: login, profile, appointment booking, and view results. Must be HIPAA-aware (encryption, audit logging). Stack: React frontend, Node or Python backend, PostgreSQL. Experience in healthtech or regulated environments is required.',
      deadline: new Date('2025-04-01'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$12,000 - $18,000',
      owner: james!,
      techStack: [
        { name: 'React', proficiency: 90 },
        { name: 'Node.js', proficiency: 85 },
        { name: 'PostgreSQL', proficiency: 90 },
        { name: 'HIPAA', proficiency: 80 }
      ]
    },
    {
      title: 'Landing Pages + Blog (Next.js, CMS-backed)',
      description: 'Marketing site with 5–7 landing pages and a blog. We use a headless CMS (Contentful or Sanity). Next.js, responsive design, SEO (meta, sitemap). We’ll provide copy and assets. Need someone who can set up the CMS schema and deploy to Vercel.',
      deadline: new Date('2025-02-05'),
      duration: 'short' as const,
      workType: ['remote'] as const,
      budget: '$2,800 - $4,200',
      owner: emma!,
      techStack: [
        { name: 'Next.js', proficiency: 90 },
        { name: 'TypeScript', proficiency: 85 },
        { name: 'Tailwind', proficiency: 85 },
        { name: 'Contentful', proficiency: 70 }
      ]
    },
    {
      title: 'Data Pipeline: ETL + Daily Reports (Python/SQL)',
      description: 'We need a data engineer to build an ETL pipeline: pull from 3 APIs and our DB, transform (Python + SQL), load into BigQuery. Daily aggregated reports and alerts. dbt experience is a plus. Clean code and documentation required.',
      deadline: new Date('2025-03-20'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$5,500 - $8,000',
      owner: david!,
      techStack: [
        { name: 'Python', proficiency: 90 },
        { name: 'SQL', proficiency: 95 },
        { name: 'BigQuery', proficiency: 85 },
        { name: 'dbt', proficiency: 75 }
      ]
    },
    {
      title: 'Chrome Extension — Summarize & Save Articles',
      description: 'Build a Chrome extension that lets users summarize web articles (using OpenAI or similar) and save to a simple backend. Popup UI, options page, and a small API (Node or Python). We have a basic design. Need clean code and published-extension experience.',
      deadline: new Date('2025-02-08'),
      duration: 'short' as const,
      workType: ['remote'] as const,
      budget: '$2,000 - $3,500',
      owner: james!,
      techStack: [
        { name: 'JavaScript', proficiency: 90 },
        { name: 'Chrome APIs', proficiency: 80 },
        { name: 'Node.js', proficiency: 80 },
        { name: 'OpenAI API', proficiency: 70 }
      ]
    },
    {
      title: 'Design System + Component Library (Figma + React)',
      description: 'We need a designer and/or frontend dev to build a design system: tokens (colors, typography, spacing), 20+ components in Figma, and matching React components (Storybook). Our product is B2B SaaS. Experience with design systems is a must.',
      deadline: new Date('2025-03-01'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$6,500 - $9,500',
      owner: james!,
      techStack: [
        { name: 'Figma', proficiency: 95 },
        { name: 'React', proficiency: 88 },
        { name: 'Storybook', proficiency: 80 },
        { name: 'Design Tokens', proficiency: 85 }
      ]
    },
    {
      title: 'API Integration Layer (Zapier-style Connectors)',
      description: 'We need an engineer to build an integration layer: connect our app to 5–6 third-party APIs (CRM, email, storage). Each connector: auth, sync logic, error handling, retries. Node.js or Python. Experience with OAuth and webhooks required.',
      deadline: new Date('2025-02-25'),
      duration: 'medium' as const,
      workType: ['remote'] as const,
      budget: '$5,000 - $7,500',
      owner: emma!,
      techStack: [
        { name: 'Node.js', proficiency: 90 },
        { name: 'REST APIs', proficiency: 90 },
        { name: 'OAuth', proficiency: 85 },
        { name: 'Webhooks', proficiency: 80 }
      ]
    },
    {
      title: 'Mobile App — Onboarding & Profile (React Native)',
      description: 'We need a React Native dev to build onboarding (3–4 screens), profile edit, and settings for our existing app. Backend exists. Focus on smooth UX and accessibility. iOS and Android.',
      deadline: new Date('2025-01-30'),
      duration: 'short' as const,
      workType: ['remote'] as const,
      budget: '$3,000 - $4,500',
      owner: james!,
      techStack: [
        { name: 'React Native', proficiency: 90 },
        { name: 'TypeScript', proficiency: 85 },
        { name: 'Accessibility', proficiency: 75 }
      ]
    }
  ];

  const createdProjects: { id: string; ownerId: string }[] = [];
  for (const p of projectData) {
    const project = await prisma.project.create({
      data: {
        title: p.title,
        description: p.description,
        deadline: p.deadline,
        duration: p.duration,
        workType: p.workType,
        budget: p.budget,
        status: 'open',
        ownerId: p.owner.id,
        techStack: { create: p.techStack }
      }
    });
    createdProjects.push({ id: project.id, ownerId: project.ownerId });
  }

  console.log('✅ Projects created');

  // ─── APPLICATIONS (freelancers applying to projects) ────────────────────
  const applicationMessages = [
    'I’ve built similar dashboards before and can start next week. Happy to do a short paid trial.',
    'I have 6+ years in UI/UX and have shipped several health/fitness apps. Portfolio link in profile.',
    'I’ve implemented Stripe Billing and webhooks on multiple projects. Can share code samples.',
    'I’ve integrated OpenAI and RAG in production. Would love to discuss your knowledge base setup.',
    'I’ve led full-stack builds for two project-management tools. Can share case studies.',
    'I’ve built real-time BI dashboards with D3 and React. Comfortable with large datasets.',
    'I’ve shipped 5+ React Native apps to both stores. Can share links and timeline.',
    'I’ve done 10+ WooCommerce builds. Prefer clean PHP and minimal plugins.',
    'I have HIPAA experience and have built patient portals. Can discuss compliance approach.',
    'I’ve set up Next.js + headless CMS several times. Fast turnaround possible.',
    'I’ve built similar ETL pipelines with dbt and BigQuery. Can outline architecture.',
    'I’ve published Chrome extensions with 10k+ users. Can deliver in 3–4 weeks.',
    'I’ve built design systems at two startups. Figma + React + Storybook is my stack.',
    'I’ve built integration layers for 10+ services. Strong in OAuth and webhooks.',
    'I can deliver onboarding and profile flows in 2–3 weeks. I’ve done similar work recently.'
  ];

  for (let i = 0; i < createdProjects.length; i++) {
    const project = createdProjects[i];
    const ownerId = project.ownerId;
    const applicants = freelancers.filter(f => f.id !== ownerId);
    const numApps = 2 + Math.floor(Math.random() * 3); // 2–4 per project
    const shuffled = [...applicants].sort(() => Math.random() - 0.5);
    for (let j = 0; j < numApps && j < shuffled.length; j++) {
      try {
        await prisma.application.create({
          data: {
            projectId: project.id,
            userId: shuffled[j].id,
            status: j === 0 ? 'accepted' : 'pending',
            message: applicationMessages[i % applicationMessages.length]
          }
        });
      } catch (_) {
        // ignore duplicate application
      }
    }
  }

  console.log('✅ Applications created');

  // ─── REVIEWS (with projectId where it makes sense) ───────────────────────
  const reviewData = [
    { author: emma!, recipient: john!, rating: 5, comment: 'John delivered our e-commerce dashboard on time. Code was clean and well-documented. Will hire again.', projectId: createdProjects[0]?.id },
    { author: david!, recipient: john!, rating: 5, comment: 'Excellent React work. Great communication and proactive with suggestions.' },
    { author: emma!, recipient: sarah!, rating: 5, comment: 'Sarah’s redesign of our fitness app increased engagement significantly. Professional and creative.' },
    { author: david!, recipient: sarah!, rating: 4, comment: 'Great designer. Minor timeline slip but quality was worth it.' },
    { author: emma!, recipient: mike!, rating: 5, comment: 'Mike built our billing and webhook layer. Rock solid and well tested.' },
    { author: david!, recipient: alex!, rating: 5, comment: 'Alex shipped our React Native app on schedule. Smooth process and great code.' },
    { author: james!, recipient: priya!, rating: 5, comment: 'Priya set up our ETL and BigQuery reports. Very clear documentation.' },
    { author: emma!, recipient: alex!, rating: 5, comment: 'Alex built our food delivery app. Users love the UX. Highly recommend.' },
    { author: david!, recipient: mike!, rating: 5, comment: 'Mike integrated our AI chatbot quickly. Clean API design.' }
  ];

  for (const r of reviewData) {
    await prisma.review.create({
      data: {
        authorId: r.author.id,
        recipientId: r.recipient.id,
        rating: r.rating,
        comment: r.comment,
        projectId: r.projectId ?? undefined
      }
    });
  }

  console.log('✅ Reviews created');

  // ─── CHANNELS (ensure they exist) ──────────────────────────────────────
  const channelNames = ['react', 'nodejs', 'python', 'design', 'general', 'jobs'];
  const channels: { id: string; name: string }[] = [];
  for (const name of channelNames) {
    const ch = await prisma.channel.upsert({
      where: { name },
      update: { memberCount: 2000 + Math.floor(Math.random() * 2000) },
      create: { name, description: `${name} channel`, memberCount: 2000 + Math.floor(Math.random() * 2000) }
    });
    channels.push(ch);
  }

  const getChannel = (name: string) => channels.find(c => c.name === name)!;

  // ─── MESSAGES (realistic chat in each channel) ──────────────────────────
  const reactMessages = [
    { user: john!, text: 'Has anyone used the new React 19 use() for data fetching in production yet?' },
    { user: alex!, text: 'We’re trying it on a small feature. So far so good — less boilerplate than before.' },
    { user: john!, text: 'Same here. The transition from loaders was smooth. Docs are solid.' },
    { user: sarah!, text: 'Do you usually get design tokens from Figma or do you define them in code first?' },
    { user: john!, text: 'We do code-first (Tailwind + CSS vars) and then sync to Figma. Avoids drift.' },
    { user: alex!, text: 'We’re still on React 18. Any gotchas when upgrading to 19?' },
    { user: john!, text: 'Main thing is the new compiler — turn it on in a branch and fix the warnings. Took us ~2 days.' }
  ];

  const nodeMessages = [
    { user: mike!, text: 'Best way to structure a monorepo with 2 Node services and a shared package? npm workspaces or pnpm?' },
    { user: john!, text: 'We use pnpm workspaces. Fast and strict. Turborepo on top if you want caching.' },
    { user: mike!, text: 'Cool, will try pnpm. Need to add auth to our API — Passport.js or something lighter?' },
    { user: alex!, text: 'We use JWT with a small custom middleware. Passport is heavy for just API auth.' },
    { user: mike!, text: 'Makes sense. Going with JWT + refresh tokens. Thanks.' }
  ];

  const pythonMessages = [
    { user: priya!, text: 'Anyone running dbt in production with BigQuery? How do you schedule runs?' },
    { user: mike!, text: 'We use Cloud Composer (Airflow). dbt runs as a DAG. Overkill for small projects though.' },
    { user: priya!, text: 'We’re small. Maybe Cloud Run on a schedule or just GitHub Actions.' },
    { user: mike!, text: 'GitHub Actions works. We did that before moving to Composer. dbt cloud is another option.' }
  ];

  const designMessages = [
    { user: sarah!, text: 'What’s your go-to for user testing with remote users? We need 5–10 sessions.' },
    { user: john!, text: 'We’ve used Maze and UserTesting. Maze is cheaper and good for prototypes.' },
    { user: sarah!, text: 'Thanks. Also — do you hand off with Dev Mode or a separate spec doc?' },
    { user: alex!, text: 'Figma Dev Mode + a short doc for edge cases and copy. Cuts down back-and-forth.' }
  ];

  const generalMessages = [
    { user: emma!, text: 'Just shipped a big release with two contractors from this platform. Huge shoutout to the community.' },
    { user: david!, text: 'That’s great to hear. We’ve had good luck here too.' },
    { user: sarah!, text: 'Looking for a frontend to pair with on a 2-month project. React + TypeScript. DM me if interested.' },
    { user: james!, text: 'We’re hiring for a 6-month healthtech project. Backend and frontend. Posting in #jobs.' },
    { user: priya!, text: 'If anyone needs help with dbt or BigQuery, happy to share patterns. Done 4 implementations this year.' }
  ];

  const jobsMessages = [
    { user: james!, text: 'Opening: Senior React + Node contractor for 6 months. Healthtech, remote. HIPAA experience a plus. Budget ~$12k/month. DM for details.' },
    { user: emma!, text: 'We need a designer for a design system project. 2–3 months. Figma + React storybook. Apply via our project post.' },
    { user: david!, text: 'Looking for someone to build a Chrome extension (summarize + save articles). 3–4 weeks. See project list.' }
  ];

  const allMessages: { channelName: string; user: typeof john; text: string }[] = [
    ...reactMessages.map(m => ({ channelName: 'react', ...m })),
    ...nodeMessages.map(m => ({ channelName: 'nodejs', ...m })),
    ...pythonMessages.map(m => ({ channelName: 'python', ...m })),
    ...designMessages.map(m => ({ channelName: 'design', ...m })),
    ...generalMessages.map(m => ({ channelName: 'general', ...m })),
    ...jobsMessages.map(m => ({ channelName: 'jobs', ...m }))
  ];

  for (const msg of allMessages) {
    const ch = getChannel(msg.channelName);
    await prisma.message.create({
      data: {
        channelId: ch.id,
        userId: msg.user.id,
        content: msg.text
      }
    });
  }

  console.log('✅ Messages created');

  // ─── ROADMAPS (so AI Roadmap page has something) ───────────────────────
  const roadmapModules = [
    { id: '1', title: 'Fundamentals', description: 'Core concepts', topics: ['Intro', 'Syntax', 'Best practices'], completed: true, progress: 100 },
    { id: '2', title: 'Intermediate', description: 'Next level', topics: ['Patterns', 'Testing'], completed: false, progress: 40 },
    { id: '3', title: 'Advanced', description: 'Expert', topics: ['Scale', 'Security'], completed: false, progress: 0 }
  ];

  await prisma.roadmap.create({
    data: {
      userId: john!.id,
      skill: 'React',
      modules: roadmapModules
    }
  }).catch(() => {});

  await prisma.roadmap.create({
    data: {
      userId: priya!.id,
      skill: 'Data Engineering',
      modules: roadmapModules
    }
  }).catch(() => {});

  console.log('✅ Roadmaps created');

  console.log('');
  console.log('🎉 Seeding finished. The app now looks like a live project.');
  console.log('');
  console.log('📧 Log in with (password: password123):');
  console.log('   Freelancers: john.developer@example.com, sarah.designer@example.com, mike.backend@example.com, alex.fullstack@example.com, priya.data@example.com');
  console.log('   Clients:    emma.client@example.com, david.client@example.com, james.client@example.com');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
