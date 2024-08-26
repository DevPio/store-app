import { ProductInput } from "../../services/types";
import { Http } from "../http/ExpressAdapter";


export class ErrorController {
    constructor(http: Http) {
        this.addStoreRender(http)
    }


    addStoreRender(http: Http) {

        http.route('get', '*', async (params: any, body: ProductInput) => {

            return {};
        }, 'NotFound')
    }
}