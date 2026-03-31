import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { ProductsService, Product } from '../../services/Products/products.service';
import { isPlatformBrowser } from '@angular/common';
import { ViewChild } from '@angular/core';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);

@Component({
  selector: 'app-products',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  standalone: true
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  
  colDefs: ColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID',
      width: 80,
      filter: true,
      sortable: true
    },
    { 
      field: 'name', 
      headerName: 'Nombre del Producto',
      flex: 1,
      filter: true,
      sortable: true
    },
    { 
      field: 'description', 
      headerName: 'Descripción',
      flex: 1,
      filter: true,
      sortable: true,
      valueFormatter: (params) => params.value || 'Sin descripción'
    },
    { 
      field: 'price', 
      headerName: 'Precio',
      width: 140,
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params) => {
        const price = parseFloat(params.value);
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(price);
      }
    },
    { 
      field: 'stock', 
      headerName: 'Stock',
      width: 100,
      filter: 'agNumberColumnFilter',
      sortable: true
    },
    { 
      field: 'is_active', 
      headerName: 'Estado',
      width: 120,
      filter: true,
      sortable: true,
      cellRenderer: (params: any) => {
        const isActive = params.value === 1;
        const badgeClass = isActive ? 'badge bg-success' : 'badge bg-secondary';
        const text = isActive ? 'Activo' : 'Inactivo';
        return `<span class="${badgeClass}">${text}</span>`;
      }
    },
    { 
      field: 'created_at', 
      headerName: 'Fecha de Creación',
      width: 180,
      filter: 'agDateColumnFilter',
      sortable: true,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('es-CO', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 25, 50, 100];

  isBrowser: boolean = false;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private productsService: ProductsService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.products = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
      }
    });
  }

  createNewProduct(): void {
    console.log('Crear nuevo producto');
  }
}
