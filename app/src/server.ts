
import { AzureBlobStorageAdapter } from './infra/adapters/AzureBlobStorageAdapter';
import { StoreController } from './infra/controllers/store-controller';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { CategoryRepositoryDatabase } from './infra/repositories/database/CategoryRepositoryDatabase';
import { FileProductRepositoryDatabase } from './infra/repositories/database/FileProductRepositoryDatabase';
import { ProductRepositoryDatabase } from './infra/repositories/database/ProductRepositoryDatabase';
import { UserRepositoryDatabase } from './infra/repositories/database/UserRepositoryDatabase';
import { CategoryService } from './services/CategoryService';
import { FileProductService } from './services/FileProductService';
import { ProductService } from './services/ProductService';
import { StorageService } from './services/StorageService';
import { UserService } from './services/UserService';


const productRepositoryDatabase = new ProductRepositoryDatabase()
const productService = new ProductService(productRepositoryDatabase)

const categoryRepositoryDatabase = new CategoryRepositoryDatabase()
const categoryService = new CategoryService(categoryRepositoryDatabase)

const fileProductRepositoryDatabase = new FileProductRepositoryDatabase()
const fileProductRepository = new FileProductService(fileProductRepositoryDatabase)

const storageAdapter = new AzureBlobStorageAdapter()
const storageService = new StorageService(storageAdapter)

const userRepository = new UserRepositoryDatabase()
const userService = new UserService(userRepository)

const htpp = new ExpressAdapter()
new StoreController
(
    htpp, 
    productService, 
    categoryService, 
    storageService, 
    fileProductRepository,
    userService
)


htpp.listen(5000, () => {
    console.log('Server is running')
})