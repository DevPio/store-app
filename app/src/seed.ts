import { faker } from '@faker-js/faker'
import { User } from './domain/entities/User'
import { BcryptHash } from './infra/adapters/ByCriptHash'
import { UserRepositoryDatabase } from './infra/repositories/database/UserRepositoryDatabase'
import { Product } from './domain/entities/Product'
import path from 'path'
import { CategoryRepositoryDatabase } from './infra/repositories/database/CategoryRepositoryDatabase'
import { Category } from './domain/entities/Category'
import { ProductRepositoryDatabase } from './infra/repositories/database/ProductRepositoryDatabase'
import { FileProductRepositoryDatabase } from './infra/repositories/database/FileProductRepositoryDatabase'
import fs from 'fs/promises'
import { FileProduct } from './domain/entities/File'
import { AzureBlobStorageAdapter } from './infra/adapters/AzureBlobStorageAdapter'
import { StorageService } from './services/StorageService'
import { FileProductService } from './services/FileProductService'


const createCategory = async () => {
    const categories = [
        'Eletrônicos',
        'Livros',
        'Roupas',
        'Casa e Cozinha',
        'Brinquedos e Jogos',
        'Esportes e Lazer',
        'Saúde e Beleza',
        'Automotivo',
        'Alimentos',
        'Suprimentos para Animais'
    ]

    const categoryRepositoryDatabase = new CategoryRepositoryDatabase()
    const categoriesSavePromise = categories.map(category => categoryRepositoryDatabase.save(new Category(0, category)))


    return await Promise.all(categoriesSavePromise)
}

const createUsers = async () => {
    const users: User[] = []

    while (users.length < 3) {
        const hash = new BcryptHash()
        const user = new User(
            0,
            faker.internet.userName(),
            faker.internet.email(),
            await hash.hash('123'),
            faker.number.int(),
            faker.number.int().toString(),
            faker.address.city()
        )
        users.push(user)
    }

    const userRepository = new UserRepositoryDatabase()

    const createUsers = users.map(async user => {
        return await userRepository.save(user)
    })


    return await Promise.all(createUsers)
}

const productsInput = [
    {
        "name": "Toyota Corolla 2022",
        "description": "Está à procura de um carro que combina estilo, desempenho e confiabilidade? Este Toyota Corolla 2022 é a escolha perfeita! \n\nCom apenas [inserir quilometragem] km rodados, este veículo está em excelente estado de conservação e oferece uma série de características que vão tornar sua experiência de direção incomparável. \n\nPossui ar-condicionado digital, sistema de som premium com Bluetooth, bancos em couro, câmera de ré, sensores de estacionamento, controle de estabilidade e tração, sistema de navegação integrado, rodas de liga leve, faróis de LED, assistente de partida em rampas e piloto automático. \n\nTodas as revisões foram feitas em concessionária autorizada, e o veículo ainda conta com garantia de fábrica até [inserir data de validade da garantia]. \n\nCarro de não fumante, sem histórico de acidentes, e com a documentação em dia.",
        "price": 145000,
        "folder": path.join(__dirname, "images", "corolla"),
        "category": "Automotivo"
    },
    {
        "name": "Ford Focus 2018",
        "description": "Vendo Ford Focus 2018, carro em excelente estado, muito bem conservado, com baixa quilometragem e manutenção em dia. \n\nEste modelo oferece conforto, segurança e tecnologia de ponta, incluindo ar-condicionado digital, bancos em couro, central multimídia com tela touch, controle de estabilidade, rodas de liga leve, faróis de neblina e assistente de partida em rampas. \n\nPerfeito para quem busca um veículo robusto e confiável. Único dono anterior, o carro está com a documentação em dia e o IPVA pago.",
        "price": 78000,
        "folder": path.join(__dirname, "images", "focus"),
        "category": "Automotivo"
    },
    {
        "name": "iPhone 12 64GB",
        "description": "Vendo iPhone 12 de 64GB, cor [inserir cor], em excelente estado de conservação, sem arranhões ou marcas de uso. \n\nSempre utilizado com capa protetora e película de vidro, este iPhone é a combinação perfeita de design elegante e tecnologia avançada. \n\nCom câmera de alta resolução, desempenho rápido e eficiente, e compatibilidade com os mais recentes recursos do iOS, este iPhone 12 vai atender a todas as suas necessidades. \n\nAcompanha caixa original, carregador, cabo USB-C e várias capas protetoras.",
        "price": 3800,
        "folder": path.join(__dirname, "images", "iphone"),
        "category": "Eletrônicos"
    },
    {
        "name": "Chevrolet S10 2020",
        "description": "Vendo Chevrolet S10 2020, caminhonete robusta e em ótimo estado, pronta para qualquer desafio. \n\nCom motor potente e tração 4x4, a S10 é ideal tanto para o trabalho quanto para o lazer. \n\nEste modelo oferece conforto e segurança, com bancos em couro, ar-condicionado, sistema multimídia com tela touch e conectividade Bluetooth, além de sensores de estacionamento e câmera de ré para facilitar as manobras. \n\nDocumentação em dia e revisões feitas regularmente, esta S10 está pronta para seguir viagem.",
        "price": 165000,
        "folder": path.join(__dirname, "images", "s10"),
        "category": "Automotivo"
    },
    {
        "name": "Casa excelente próxima Angeloni Supermercado em Lages-SC!",
        "description": "Já pensou em adquirir um excelente imóvel, com ótima localização no centro de Lages-SC ( próximo ao supermercado \n\n Angeloni), 100% financiável e uma opção perfeita para investimento?\n\n ENTRE EM CONTATO E APROVEITE ESSA OPORTUNIDADE! \n\n VALOR: 930 mil (totalmente financiável) \n\n ÁREA TERRENO: 312 M2 \n\n ÁREA CONSTRUÍDA: 219,70 M2",
        "price": 16500000,
        "folder": path.join(__dirname, "images", "casa"),
        "category": "Casa e Cozinha"
    }
];

(async () => {
    const users = await createUsers()
    const categories = await createCategory()

    const products = productsInput.map(product => {
        return new Product(
            0,
            categories.find(category => category.name === product.category)?.id as number,
            users[faker.number.int({ min: 0, max: users.length - 1 })].id,
            product.name,
            product.price,
            1,
            !!faker.number.int({ min: 0, max: 1 }),
            product.description,
            0

        )
    })


    const productRepositoryDatabase = new ProductRepositoryDatabase()

    const fileProductRepositoryDatabase = new FileProductRepositoryDatabase()
    const fileProductRepository = new FileProductService(fileProductRepositoryDatabase)

    const storageAdapter = new AzureBlobStorageAdapter()
    const storageService = new StorageService(storageAdapter)

    const productsDatabase = await Promise.all(products.map(product => productRepositoryDatabase.save(product)))

    for (const productDatabase of productsDatabase) {
        const getFolder = productsInput.find(product => product.name === productDatabase.name)

        const filesPath = await fs.readdir(getFolder?.folder as string)


        const bufferFiles = await Promise.all(
            filesPath.map(async filePath => {

                const bufferFile = await fs.readFile(path.join(getFolder?.folder as string, filePath))
                return {
                    name: filePath,
                    bufferFile
                }
            })
        )

        const filesName = await Promise.all(bufferFiles.map(async file => await storageService.uploadFile(`${Date.now()}-${file.name}`, file.bufferFile)))

        await Promise.all(filesName.map(fileName => new FileProduct(fileName, fileName, productDatabase.id as number)).map(async file => {
            await fileProductRepository.saveFile(file)
        }))
    }

})()
