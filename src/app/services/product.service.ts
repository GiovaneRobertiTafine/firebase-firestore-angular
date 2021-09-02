import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product.models';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private productsCollection: AngularFirestoreCollection<Product> = this.afs.collection('products');

    constructor(private afs: AngularFirestore) { }

    getProducts(): Observable<Product[]> {
        return this.productsCollection.valueChanges();
    }

    addProduct(product: Product): Promise<void> {
        // No modelo abaixo estamos criando um id
        //e com ele salvando no campo id e salvando na indetificaocao
        //do objeto que o proprio banco gera
        const id = this.afs.createId();
        product.id = id;
        return this.productsCollection.doc(id).set(product);

        // No modelo abaixo, ira salvar o objeto sem o id
        //pois ao salvar um novo, e como o id é nullable
        //este campo nao sera preenchido
        //e com isso na base de dados ira salvar com id null
        //e no banco de dados firestore ele cria
        //uma indetificacao do objeto como se fosse um id
        //isso é o padrão dele 

        // return this.productsCollection.add(product);
    }

    deleteProduct(p: Product): Promise<void> {
        return this.productsCollection.doc(p.id).delete();
    }

    updateProduct(p: Product): Promise<void> {
        return this.productsCollection.doc(p.id).set(p);
    }

    searchByName(name: string): Observable<Product[]> {
        // Neste modo estamos pegando a referencia para fazer a query
        //diferente da atribuicao para productsCollection
        return this.afs.collection<Product>('products',
            ref => ref.orderBy('name').startAt(name).endAt(name + "\uf8ff"))
            .valueChanges();
        // Estamos utilizando esse código \uf8ff no endAt, código do utf-8
        //para dizer que é o fim da string de pesquisa
    }
}
