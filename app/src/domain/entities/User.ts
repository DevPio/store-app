export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    cpfCnpj: number;
    cep: string;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(
        id: number,
        name: string,
        email: string,
        password: string,
        cpfCnpj: number,
        cep: string,
        address: string

    ) {
        this.id = id
        this.name = name;
        this.email = email;
        this.password = password;
        this.cpfCnpj = cpfCnpj;
        this.cep = cep;
        this.address = address;
    }


    setCreatedAt(date: Date) {
        this.createdAt = date
    }

    setUpdatedAt(date: Date) {
        this.updatedAt = date
    }

    setId(id: number) {
        this.id = id
    }
}