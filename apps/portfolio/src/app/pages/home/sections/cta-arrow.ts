import { Component } from '@angular/core';

@Component({
  selector: 'app-cta-arrow',
  host: { class: 'cta-arrow', 'aria-hidden': 'true' },
  template: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M1 7h12M8 2l5 5-5 5"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>`,
})
export class CtaArrow {}
