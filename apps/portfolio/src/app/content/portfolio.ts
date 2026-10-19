export interface PortfolioProject {
  title: string;
  description: string;
  category: string;
  href: string;
}

export interface PortfolioContent {
  name: string;
  headline: string;
  introduction: string;
  about: string;
  email: string | null;
  links: ReadonlyArray<{ label: string; href: string }>;
  projects: ReadonlyArray<PortfolioProject>;
}

// Replace the starter copy and add real projects and links here.
// Keep this content independent of the router for a future AnalogJS migration.
export const portfolio: PortfolioContent = {
  name: 'Vladyslav Alekseev',
  headline: 'A place for what’s next.',
  introduction:
    'I’m Vladyslav Alekseev. Welcome to my work, ideas, and the things taking shape.',
  about:
    'This portfolio is taking shape. In the meantime, you can find my professional background and experience on LinkedIn.',
  email: null,
  links: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/vladyslav-alekseev-4074a5175/',
    },
  ],
  projects: [],
};
