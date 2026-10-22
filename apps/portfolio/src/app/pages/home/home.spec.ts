import { TestBed } from '@angular/core/testing';
import { portfolio, resolveContactLink } from '../../content/portfolio';
import { Home } from './home';

async function renderHome(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Home);
  await fixture.whenStable();
  return fixture.nativeElement;
}

function textsOf(root: HTMLElement, selector: string): string[] {
  return Array.from(root.querySelectorAll(selector), (element) =>
    element.textContent?.trim(),
  ).filter((text): text is string => !!text);
}

describe('Home', () => {
  it('introduces the person and role in the banner heading', async () => {
    const heading = (await renderHome()).querySelector('h1')?.textContent;
    expect(heading).toContain(portfolio.name);
    expect(heading).toContain(portfolio.role);
  });

  it('lists every service along the banner horizon', async () => {
    expect(textsOf(await renderHome(), '.services li')).toEqual(
      portfolio.services.map((service) => expect.stringContaining(service)),
    );
  });

  it('shows every tool from the skill groups', async () => {
    const tools = textsOf(await renderHome(), '.skills li');
    expect(tools).toEqual(portfolio.skills.flatMap((group) => group.items));
  });

  it('renders the experience timeline in content order', async () => {
    const roles = textsOf(await renderHome(), '#experience h3');
    expect(roles).toEqual(portfolio.experience.map((entry) => entry.role));
  });

  it('links each project card and keeps a card for work in progress', async () => {
    const root = await renderHome();
    const hrefs = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('#work a.project-card'),
      (card) => card.getAttribute('href'),
    );
    expect(hrefs).toEqual(portfolio.projects.map((project) => project.href));
    expect(
      root.querySelector('#work .project-card.is-upcoming'),
    ).not.toBeNull();
  });

  it('points the contact banner at the resolved contact link', async () => {
    const contact = (await renderHome()).querySelector<HTMLAnchorElement>(
      '#contact a',
    );
    expect(contact?.getAttribute('href')).toBe(
      resolveContactLink(portfolio)?.href,
    );
  });

  it('leaves the sun empty until a portrait is configured', async () => {
    expect((await renderHome()).querySelector('.sun img')).toBeNull();
  });
});
