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
  previousCategoryId: number = 1;
  currentCategoryId: number = 1;
  currentCategoryName: string = ""
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElement: number = 0;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProduct();
    } else {

      this.handleListProduct();
    }
  }

  handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get(`keyword`)!;

    //now search for the products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
        console.log('DATASEARCH:', data);
      }
    );
  }

  handleListProduct() {
    // check if "id" parameter is 
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }


    //Check if we have a different category than previous

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`);


    this.productService.getProductListPaginate(this.thePageNumber = 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElement = data.page.totalElements;
        }
      );
  }
}
