import { Component, input } from '@angular/core';
import { PortfolioSkillGroup } from '../../../../content/portfolio';

@Component({
  selector: 'app-skills-strip',
  template: `
    <section class="skills" aria-labelledby="skills-heading">
      <h2 id="skills-heading">Tools I work with</h2>
      <div class="groups">
        @for (group of groups(); track group.label) {
          <div class="group">
            <h3>{{ group.label }}</h3>
            <ul>
              @for (item of group.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './skills-strip.css',
})
export class SkillsStrip {
  readonly groups = input.required<ReadonlyArray<PortfolioSkillGroup>>();
}
