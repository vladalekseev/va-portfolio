import { Component, input } from '@angular/core';
import { PortfolioProject } from '../../../../content/portfolio';

@Component({
  selector: 'app-work-grid',
  templateUrl: './work-grid.html',
  styleUrl: './work-grid.css',
})
export class WorkGrid {
  readonly projects = input.required<ReadonlyArray<PortfolioProject>>();

  // Moves each card's sun along the horizon so neighbouring cards differ.
  protected sunPositionFor(index: number): string {
    return `${20 + ((index * 35) % 70)}%`;
  }
}
