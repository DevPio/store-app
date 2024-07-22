
import { AzureBlobStorageAdapter } from './infra/adapters/AzureBlobStorageAdapter';
import { StoreController } from './infra/controllers/store-controller';
import { ExpressAdapter } from './infra/http/ExpressAdapter';
import { CategoryRepositoryDatabase } from './infra/repositories/database/CategoryRepositoryDatabase';
import { FileProductRepositoryDatabase } from './infra/repositories/database/FileProductRepositoryDatabase';
import { ProductRepositoryDatabase } from './infra/repositories/database/ProductRepositoryDatabase';
import { CategoryService } from './services/CategoryService';
import { FileProductService } from './services/FileProductService';
import { ProductService } from './services/ProductService';
import { StorageService } from './services/StorageService';


const productRepositoryDatabase = new ProductRepositoryDatabase()
const productService = new ProductService(productRepositoryDatabase)

const categoryRepositoryDatabase = new CategoryRepositoryDatabase()
const categoryService = new CategoryService(categoryRepositoryDatabase)

const fileProductRepositoryDatabase = new FileProductRepositoryDatabase()

const fileProductRepository = new FileProductService(fileProductRepositoryDatabase)

const storageAdapter = new AzureBlobStorageAdapter()

const storageService = new StorageService(storageAdapter)

const htpp = new ExpressAdapter()
new StoreController(htpp, productService, categoryService, storageService, fileProductRepository)


htpp.listen(5000, () => {
    console.log('Server is running')
})