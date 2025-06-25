import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Cần cho một số animation
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageModule } from 'primeng/message';
import { SidebarModule } from 'primeng/sidebar';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PaginatorModule,
    BrowserAnimationsModule,
    ButtonModule,
    SelectModule,
    DividerModule,
    DropdownModule,
    FormsModule,
    NgbModule,
    ToolbarModule,
    OverlayBadgeModule,
    BadgeModule,
    MessageModule,
    SidebarModule,
    ReactiveFormsModule
],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
