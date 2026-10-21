import { Component, input } from '@angular/core';
import { PortfolioExperience } from '../../../../content/portfolio';

@Component({
  selector: 'app-experience-timeline',
  template: `
    <section
      id="experience"
      class="experience"
      aria-labelledby="experience-heading"
    >
      <div class="intro">
        <p class="section-label">Experience</p>
        <h2 id="experience-heading">Where I’ve been building</h2>
      </div>
      <ol class="timeline">
        @for (entry of entries(); track entry) {
          <li [class.is-current]="$first">
            <p class="period">{{ entry.period }}</p>
            <div>
              <h3>{{ entry.role }}</h3>
              <p class="company">{{ entry.company }}</p>
              <p class="summary">{{ entry.summary }}</p>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  styleUrl: './experience-timeline.css',
})
export class ExperienceTimeline {
  // Newest first; the first entry is drawn as the current role.
  readonly entries = input.required<ReadonlyArray<PortfolioExperience>>();
}
