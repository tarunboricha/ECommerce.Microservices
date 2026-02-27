import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-new-product-feature',
  standalone: true,
  imports: [],
  templateUrl: './new-product-feature.component.html',
  styleUrl: './new-product-feature.component.css'
})
export class NewProductFeatureComponent implements OnInit {
  NewFeature: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getNewFeature().subscribe({
      next: (newFeature: string) => {
        this.NewFeature = newFeature;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
