export class Product {
    id: number;
    categoryId: number;
    userId: number;
    name: string;
    description?: string;
    oldPrice?: number;
    price: number;
    quantity: number;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    categoryName?: string

    constructor(
        id: number,
        categoryId: number,
        userId: number,
        name: string,
        price: number,
        quantity: number,
        status: boolean,
        description?: string,
        oldPrice?: number
    ) {
        this.id = id;
        this.categoryId = categoryId;
        this.userId = userId;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.status = status;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.description = description;
        this.oldPrice = oldPrice;
    }


    setCreatedAt(date: Date) {
        this.createdAt = date
    }

    setUpdatedAt(date: Date) {
        this.updatedAt = date
    }

    setCategoryName(name:string) {
        this.categoryName = name;
    }

    setOldPrice(price: number) {

        if (isNaN(price)) {
            return this.oldPrice = price
        }
        return this.oldPrice = price
    }
}
