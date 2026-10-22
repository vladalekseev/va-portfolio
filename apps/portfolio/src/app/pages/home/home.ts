import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { portfolio, resolveContactLink } from '../../content/portfolio';
import { ContactBanner } from './sections/contact-banner/contact-banner';
import { ExperienceTimeline } from './sections/experience-timeline/experience-timeline';
import { HeroBanner } from './sections/hero-banner/hero-banner';
import { SiteHeader } from './sections/site-header/site-header';
import { SkillsStrip } from './sections/skills-strip/skills-strip';
import { WorkGrid } from './sections/work-grid/work-grid';

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    SiteHeader,
    HeroBanner,
    SkillsStrip,
    ExperienceTimeline,
    WorkGrid,
    ContactBanner,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly content = portfolio;
  protected readonly contact = resolveContactLink(portfolio);
}
