import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Product } from '../models/product.models';
import { Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    displayedColumns: string[] = ['name', 'price', 'stock', 'operations'];
    products$: Observable<Product[]>;
    filterProducts$: Observable<Product[]>;

    firstNameControl = new FormControl();

    @ViewChild('name') productName: ElementRef;

    productForm = this.fb.group({
        id: [undefined],
        name: ['', [Validators.required]],
        stock: [0, [Validators.required]],
        price: [0, [Validators.required]]
    });

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.products$ = this.productService.getProducts();

        // Código para filtrar o nome mas com debounce time
        //utilizando o formControl
        // this.firstNameControl.valueChanges
        //     .pipe(
        //         tap(() => console.log('searching')),
        //         debounceTime(2000))
        //     .subscribe(newValue => {
        //         this.filterProducts$ = this.productService.searchByName(newValue);
        //     });
    }

    onSubmit() {
        let p = this.productForm.value;
        if (!p.id) {
            this.addProduct(p);
        } else {
            this.updateProduct(p);
        }
    }

    addProduct(p: Product) {
        this.productService.addProduct(p)
            .then(() => {
                this.snackBar.open('Product added.', 'OK', { duration: 2000 });
                this.productForm.reset({ name: '', stock: 0, price: 0, id: undefined });
                this.productName.nativeElement.focus();
            })
            .catch(() => {
                this.snackBar.open('Error on submiting the product', 'OK', { duration: 2000 });
            });
    }

    updateProduct(p: Product) {
        this.productService.updateProduct(p)
            .then(() => {
                this.snackBar.open('Product updated', 'OK', { duration: 2000 });
                this.productForm.reset({ name: '', stock: 0, price: 0, id: undefined });
                this.productName.nativeElement.focus();
            })
            .catch((e) => {
                console.log(e);
                this.snackBar.open('Error on submiting the product', 'OK', { duration: 2000 });
            });
    }

    edit(p: Product): void {
        this.productForm.setValue(p);
    }

    del(p: Product): void {
        this.productService.deleteProduct(p)
            .then(() => {
                this.snackBar.open('Product has been removed', 'OK', { duration: 2000 });
            })
            .catch((e) => {
                console.log(e);
                this.snackBar.open('Error when trying to remove the product', 'OK', { duration: 2000 });
            });
    }

    filter(event): void {
        this.filterProducts$ = this.productService.searchByName(event.target.value);
    }
}
