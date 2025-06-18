import { ActivatedRoute } from '@angular/router';
import { Product } from './../../common/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId!: number;
  currentCategoryName: string = "";

  constructor(private ProductService: ProductService, 
              private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
  });
  }
  listProducts() {

    // check if "id" parameter is 
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId){
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else{
        this.currentCategoryId = 1;
        this.currentCategoryName = 'Books';
    }

    this.ProductService.getProductList(this.currentCategoryId).subscribe(
      data => {
            console.log('DATA: ', data); // THÊM LOG NÀY
        this.products = data;
      }
    )
  }
}
