import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { PortfolioContent } from '../../../../content/portfolio';
import { CtaArrow } from '../cta-arrow';

@Component({
  selector: 'app-hero-banner',
  imports: [DecimalPipe, NgOptimizedImage, MatButton, CtaArrow],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {
  readonly content = input.required<PortfolioContent>();
}
