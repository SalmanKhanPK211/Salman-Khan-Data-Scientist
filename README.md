# Salman Khan — Data Analyst Portfolio

A modern, responsive personal portfolio built to showcase data analytics projects, skills, certifications, and professional experience. The site features smooth scroll navigation, a typing hero animation, and a clean minimal design optimized for both desktop and mobile.

**Live Demo:** [https://salmankhanportfolio.lovable.app](https://salmankhanportfolio.lovable.app)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Overview

This portfolio presents Salman Khan as an aspiring Data Analyst and Data Science Learner. It highlights expertise in Python, SQL, data cleaning, visualization, and business intelligence, along with completed certifications and hands-on projects.

The goal is to provide a fast, accessible, and visually polished landing page for recruiters, collaborators, and clients.

---

## Features

- **Responsive Hero Section** with animated typing effect and stable layout
- **About Section** summarizing background, skills, and career focus
- **Services Section** showcasing offered data services
- **Skills Section** displaying technical competencies
- **Projects Section** with highlighted data analytics projects
- **Tools Section** listing analytics and visualization tools
- **Certifications Section** featuring completed courses and certificates
- **Contact Form** powered by [Formspree](https://formspree.io)
- **Social Links** to GitHub, LinkedIn, Gmail, WhatsApp, and TikTok
- **Smooth Scroll Navigation** across all sections
- **Downloadable CV** button
- **Light/Dark Mode** support ready
- **Mobile-first responsive design**

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | [React](https://react.dev) 18 |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Build Tool | [Vite](https://vitejs.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 |
| UI Components | [shadcn/ui](https://ui.shadcn.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Forms | [Formspree](https://formspree.io) |
| Backend/Auth | Lovable Cloud (Supabase) |
| Testing | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Bun](https://bun.sh) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SalmanKhanPK211/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Start the development server:

   ```bash
   bun dev
   # or
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Project Structure

```text
portfolio/
├── public/                 # Static assets (CV, images, favicon)
├── src/
│   ├── assets/             # Images and certificates
│   ├── components/         # React components for each section
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Backend/client integrations
│   ├── lib/                # Utility functions
│   ├── pages/              # Page-level components
│   ├── styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start the local development server |
| `build` | Build the project for production |
| `preview` | Preview the production build locally |
| `lint` | Run ESLint across the codebase |
| `test` | Run unit tests with Vitest |
| `test:watch` | Run unit tests in watch mode |

---

## Deployment

This project is configured for seamless deployment on [Lovable](https://lovable.dev). Pushing to the connected repository branch automatically builds and deploys the latest changes.

You can also build the project manually:

```bash
bun run build
```

The static production files will be generated in the `dist/` directory.

---

## Contact

Feel free to connect or reach out for collaboration:

- **Portfolio:** [salmankhanportfolio.lovable.app](https://salmankhanportfolio.lovable.app)
- **GitHub:** [https://github.com/SalmanKhanPK211](https://github.com/SalmanKhanPK211)
- **LinkedIn:** [https://www.linkedin.com/in/salman-khan-a196773aa](https://www.linkedin.com/in/salman-khan-a196773aa)
- **Email:** [salmankhan.pk211@gmail.com](mailto:salmankhan.pk211@gmail.com)
- **WhatsApp:** [+92 313 7700673](https://wa.me/923137700673)

---

## License

This project is for personal use and demonstration purposes.

© 2026 Salman Khan. All rights reserved.
