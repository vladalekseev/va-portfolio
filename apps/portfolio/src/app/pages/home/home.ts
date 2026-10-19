import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { portfolio } from '../../content/portfolio';

@Component({
  selector: 'app-home',
  imports: [HlmButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly content = portfolio;
  protected readonly menuOpen = signal(false);

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
