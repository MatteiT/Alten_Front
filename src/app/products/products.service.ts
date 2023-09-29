import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private static productslist: Product[] = null;
  private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

  private baseUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    const apiUrl = `${this.baseUrl}`;

    if (!ProductsService.productslist) {
      this.http.get<Product[]>(apiUrl).subscribe(data => {
        ProductsService.productslist = data;
        this.products$.next(ProductsService.productslist);
      });
    } else {
      this.products$.next(ProductsService.productslist);
    }

    return this.products$;
  }

  create(prod: Product): Observable<Product[]> {
    const apiUrl = `${this.baseUrl}`;

    this.http.post<Product>(apiUrl, prod).subscribe(newProduct => {
      ProductsService.productslist.push(newProduct);
      this.products$.next(ProductsService.productslist);
    });

    return this.products$;
  }

  update(prod: Product): Observable<Product[]> {
    const apiUrl = `${this.baseUrl}/${prod.id}`;

    this.http.patch<Product>(apiUrl, prod).subscribe(updatedProduct => {
      ProductsService.productslist = ProductsService.productslist.map(element => {
        if (element.id === updatedProduct.id) {
          return updatedProduct;
        } else {
          return element;
        }
      });
      this.products$.next(ProductsService.productslist);
    });

    return this.products$;
  }

  delete(id: number): Observable<Product[]> {
    const apiUrl = `${this.baseUrl}/${id}`;

    this.http.delete<void>(apiUrl).subscribe(() => {
      ProductsService.productslist = ProductsService.productslist.filter(value => value.id !== id);
      this.products$.next(ProductsService.productslist);
    });

    return this.products$;
  }
}
