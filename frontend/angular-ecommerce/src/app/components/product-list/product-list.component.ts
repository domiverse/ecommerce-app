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
  rowsPerPageOptions: number[] = [2,10, 20, 50];


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

    // Hàm mới để xử lý sự kiện từ p-paginator
  onPageChange(event: any) {
    this.thePageNumber = event.page + 1; // event.page bắt đầu từ 0, nên cần +1
    this.thePageSize = event.rows;
    this.listProducts(); // Gọi lại hàm lấy dữ liệu cho trang mới
  }

 handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // === GHI CHÚ QUAN TRỌNG ===
    // Giờ đây chúng ta gọi đến phương thức `searchProductsPaginate` mới
    // thay vì phương thức search cũ không hỗ trợ phân trang.
    this.productService.searchProductsPaginate(this.thePageNumber - 1,  // page number (0-based)
                                                this.thePageSize,
                                                theKeyword)
      .subscribe(this.processResult()); // <-- Tái sử dụng hàm helper để xử lý kết quả
  }

  // Hàm helper để xử lý dữ liệu trả về và cập nhật các thuộc tính
  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElement = data.page.totalElements;
      this.scrollToTop();
    };
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

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElement = data.page.totalElements;
          this.scrollToTop();

        }
      );
  }
  // 1. Thêm một getter để tính toán tổng số trang
get totalPages(): number {
  return Math.ceil(this.theTotalElement / this.thePageSize);
}

// 2. Thêm một getter để tạo ra một mảng các số trang [1, 2, 3, ...]
get pages(): number[] {
    const total = this.totalPages;
    const current = this.thePageNumber;

    // Nếu có 7 trang hoặc ít hơn, hiển thị tất cả
    if (total <= 7) {
        return Array.from(Array(total).keys()).map(i => i + 1);
    }

    // Nếu trang hiện tại gần đầu (trang 1-4)
    // Hiển thị [1, 2, 3, 4, 5, ..., total]
    if (current < 5) {
        return [1, 2, 3, 4, 5, 0, total]; // 0 đại diện cho '...'
    }

    // Nếu trang hiện tại gần cuối (total-3 đến total)
    // Hiển thị [1, ..., total-4, total-3, total-2, total-1, total]
    if (current > total - 4) {
        return [1, 0, total - 4, total - 3, total - 2, total - 1, total];
    }
  
    // Nếu trang hiện tại ở giữa  
    // Hiển thị [1, ..., current-1, current, current+1, ..., total]
    return [1, 2, 0, current - 1, current, current + 1, 0, total - 1, total];
  }


// 3. Thêm phương thức mới này để xử lý việc chuyển trang
goToPage(pageNumber: number): void {
  // Kiểm tra để đảm bảo không đi ra ngoài giới hạn trang
  if (pageNumber >= 1 && pageNumber <= this.totalPages) {
    this.thePageNumber = pageNumber;
    this.listProducts(); // Giả định rằng bạn có phương thức này để tải lại sản phẩm
  }
}

// 4. Phương thức onPageSizeChange có thể cần được cập nhật
// để reset về trang 1 mỗi khi người dùng thay đổi số lượng item
onPageSizeChange(): void {
    this.thePageNumber = 1;
    this.listProducts();
}
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
