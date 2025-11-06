import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  selector: 'app-root',
  host: {
    class: 'bg-gray-900 w-full h-full flex flex-col',
  },
  template: ` <router-outlet /> `,
})
export class App {
  constructor() {
  }
}
