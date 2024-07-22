export class FileProduct {
    id: number;
    name: string;
    path: string;
    productId: number;


    constructor(name: string, path: string, productId: number) {
        this.id = 0
        this.name = name;
        this.path = path;
        this.productId = productId
    }


    setId(id: number) {
        this.id = id
    }
}