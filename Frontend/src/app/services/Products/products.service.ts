import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environments/environment';

export interface Product {
  id: number;
  product_type_id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  is_active: number;
  created_at: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${env.API_URL}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }
}
