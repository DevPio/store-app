import { CategoryService } from "../../services/CategoryService";
import { FileProductService } from "../../services/FileProductService";
import { ProductService } from "../../services/ProductService";
import { StorageService } from "../../services/StorageService";
import { UserService } from "../../services/UserService";
import { Http } from "../http/ExpressAdapter";
import { CartController } from "./CartController";
import { ErrorController } from "./ErrorController";
import { ProductController } from "./ProductController";
import { SessionController } from "./SessionController";
import { StoreController } from "./StoreController";
import { UserController } from "./UserCotroller";


export class MainController {

    constructor(
        http: Http,
        productService: ProductService,
        categoryService: CategoryService,
        storageService: StorageService,
        fileProductService: FileProductService,
        userService: UserService
    ) {
        new StoreController(http, productService, categoryService, storageService, fileProductService)
        new ProductController(http, productService, categoryService, storageService, fileProductService, userService)
        new UserController(http, userService)
        new CartController(http, productService, storageService, fileProductService)
        new SessionController(http, userService)
        new ErrorController(http)
    }
}