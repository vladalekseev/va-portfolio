import { Component, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { PortfolioLink } from '../../../../content/portfolio';
import { CtaArrow } from '../cta-arrow';

@Component({
  selector: 'app-site-header',
  imports: [MatButton, CtaArrow],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  readonly name = input.required<string>();
  readonly contact = input<PortfolioLink | null>(null);
  protected readonly menuOpen = signal(false);

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
