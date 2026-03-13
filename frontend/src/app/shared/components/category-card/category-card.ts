import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-card',
  standalone: true,
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss'
})
export class CategoryCardComponent {
  @Input() title!: string;
  @Input() image!: string;
}
