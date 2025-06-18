import { ProductService } from './../../services/product.service';
import { Component } from '@angular/core';
import { ProductCategory } from '../../common/product-category';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent {

  productCategories: ProductCategory[] = [];
  constructor(private ProductService: ProductService){}

  ngOnInit(){
    this.listProductCategories();
  }


  listProductCategories() {
    this.ProductService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );

  }

}
