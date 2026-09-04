import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../interfaces/producto';
import { supabase } from '../supabase/supabase.client';
import type { CategoryRow, ProductRow } from '../types/database.helpers';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  obtenerProductos(): Observable<Producto[]> {
    return from(Promise.all([
      supabase.from('products').select('*').order('id'),
      supabase.from('categories').select('*'),
    ])).pipe(map(([productsResult, categoriesResult]) => {
      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      const categories = new Map((categoriesResult.data as CategoryRow[]).map((category) => [category.id, category.name]));
      return (productsResult.data as ProductRow[]).map((product) => ({
        id: product.id, title: product.title, price: product.price,
        description: product.description, category: categories.get(product.category_id) ?? '', image: product.image,
      }));
    }));
  }

  obtenerProducto(id: number): Observable<Producto> {
    return from(Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('categories').select('*'),
    ])).pipe(map(([productResult, categoriesResult]) => {
      if (productResult.error) throw productResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      const product = productResult.data as ProductRow;
      const category = (categoriesResult.data as CategoryRow[]).find((item) => item.id === product.category_id);
      return {
        id: product.id, title: product.title, price: product.price,
        description: product.description, category: category?.name ?? '', image: product.image,
      };
    }));
  }
}
