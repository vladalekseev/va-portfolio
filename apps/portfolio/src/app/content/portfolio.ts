export interface PortfolioProject {
  title: string;
  description: string;
  category: string;
  href: string;
}

export interface PortfolioExperience {
  period: string;
  role: string;
  company: string;
  summary: string;
}

export interface PortfolioSkillGroup {
  label: string;
  items: ReadonlyArray<string>;
}

export interface PortfolioLink {
  label: string;
  href: string;
}

export interface PortfolioContent {
  name: string;
  role: string;
  headline: string;
  introduction: string;
  about: string;
  email: string | null;
  // Rendered inside the banner's sun; a backlit or high-contrast shot works best.
  portrait: { src: string; alt: string } | null;
  services: ReadonlyArray<string>;
  skills: ReadonlyArray<PortfolioSkillGroup>;
  experience: ReadonlyArray<PortfolioExperience>;
  links: ReadonlyArray<PortfolioLink>;
  projects: ReadonlyArray<PortfolioProject>;
}

// Replace the starter copy and the placeholder role, services and experience with real details.
// Keep this content independent of the router for a future AnalogJS migration.
export const portfolio: PortfolioContent = {
  name: 'Vladyslav Alekseev',
  role: 'Software engineer',
  headline: 'Fast, calm products for the web.',
  introduction:
    'I design and build web applications end to end, from the interface down to a type-safe API.',
  about:
    'This portfolio is taking shape. In the meantime, you can find my professional background and experience on LinkedIn.',
  email: null,
  portrait: null,
  services: [
    'Frontend engineering',
    'Design systems',
    'Type-safe APIs',
    'Performance and accessibility',
  ],
  skills: [
    {
      label: 'Frontend',
      items: ['Angular', 'TypeScript', 'Signals', 'Angular Material'],
    },
    { label: 'Backend', items: ['Node.js', 'Bun', 'tRPC'] },
    { label: 'Tooling', items: ['Nx', 'Vitest', 'Playwright', 'Vercel'] },
  ],
  experience: [
    {
      period: '2023 – now',
      role: 'Software engineer',
      company: 'Company name',
      summary: 'One line on the product you built and the impact it had.',
    },
    {
      period: '2020 – 2023',
      role: 'Frontend developer',
      company: 'Company name',
      summary: 'One line on the product you built and the impact it had.',
    },
  ],
  links: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/vladyslav-alekseev-4074a5175/',
    },
  ],
  projects: [
    {
      title: 'This portfolio',
      category: 'Web app',
      description:
        'A prerendered Angular site with a type-safe tRPC API, built in an Nx monorepo and deployed on Vercel.',
      href: 'https://github.com/vladalekseev/va-portfolio',
    },
  ],
};

export function resolveContactLink(
  content: PortfolioContent,
): PortfolioLink | null {
  if (content.email) {
    return { label: 'Email me', href: `mailto:${content.email}` };
  }
  const [profile] = content.links;
  return profile
    ? { label: `Message me on ${profile.label}`, href: profile.href }
    : null;
}
