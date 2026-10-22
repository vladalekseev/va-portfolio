import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { PortfolioLink } from '../../../../content/portfolio';
import { CtaArrow } from '../cta-arrow';

@Component({
  selector: 'app-contact-banner',
  imports: [MatButton, CtaArrow],
  template: `
    <section id="contact" class="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">Have a project in mind? Let’s build it.</h2>
      <p>
        I’m open to new roles and collaborations. Tell me what you’re working
        on.
      </p>
      <a matButton="filled" class="button-dusk" [href]="contact().href"
        >{{ contact().label }}<app-cta-arrow
      /></a>
    </section>
  `,
  styleUrl: './contact-banner.css',
})
export class ContactBanner {
  readonly contact = input.required<PortfolioLink>();
}
