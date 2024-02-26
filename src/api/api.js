import axios from "axios"

class Api 
{
    constructor() 
    {
        this.baseURL = 'http://54.211.24.168';

        axios.interceptors.request.use(
            config =>
            {
                return this.ConfigRequest(config)
            },
            error =>
            {
                return Promise.reject(error)
            }
        )

        axios.interceptors.response.use(
            response =>
            {
                return this.PostProcessing(response)
            },
            error =>
            {
                return this.HandleError(error)
            }
        )
    }

    ConfigRequest = (config) =>
    {
        if (config.hasOwnProperty('payload') === false)
        {
            return config
        }

        if (config['headers']['Content-Type'] === 'multipart/form-data')
        {
            let formData = config['payload'].data
            config['data'] = formData
        }
        else
        {
            config['data'] = {
                ...config['payload'].data
            }
        }

        return config
    }

    PostProcessing = (res) =>
    {
        if (res.status < 200 || res.status >= 300)
        {
            return Promise.reject({
                code: res.status || -1,
                title: res.statusText || 'Warning !',
                message: `invalid status ${res.status}`
            })
        }

        if (res.data)
        {
            return res.data
        }

    }

    HandleError = (payload) =>
    {
        let response = payload.response || {}
        return Promise.reject({
            code: response.status || -3,
            title: response.statusText || 'Warning !',
            message: (response.data && response.data.error) || (payload.message) || 'unknown reason'
        })
    }


    Request(method, url, payload, contentType = 'application/json', responseType = 'json')
    {
        let config = {};

        config['method'] = method;
        config['url'] = url;
        config['responseType'] = responseType;
        config['Access-Control-Allow-Origin'] = 'http://54.211.24.168';
        config['headers'] = {
            'Content-Type': contentType
        };
        config['payload'] = payload || {}
        return axios(config)
    }

    getWards()
    {
        return this.Request('get',`${this.baseURL}/get-all-ward`)  
    }

    getAllCategories()
    {
        return this.Request('get',`${this.baseURL}/api/Category/get-all-category`)     
    }

    CreateCategory(rowData)
    {
        
        const payload = {
            data : rowData
        }

        return this.Request('post',`${this.baseURL}/api/Category`,payload)  
    }

    EditCategory(rowData)
    {
        const {
            id,
            ...rest
        } = rowData
        const payload = {
            data : rest
        }
        return this.Request('put',`${this.baseURL}/api/Category/${id}`,payload)  
    }

    DeleteCategory(rowData)
    {
        const {
            id
        } = rowData
        return this.Request('delete',`${this.baseURL}/api/Category/${id}`)  
    }

    // Manufac
    getAllManufacturers()
    {
        return this.Request('get',`${this.baseURL}/get-all-manufacturer`)     
    }

    CreateManufacturer(rowData)
    {
        
        const payload = {
            data : rowData
        }

        return this.Request('post',`${this.baseURL}/api/Manufactuer`,payload)  
    }

    EditManufacturer(rowData)
    {
        const {
            id,
            ...rest
        } = rowData
        const payload = {
            data : rest
        }
        return this.Request('put',`${this.baseURL}/api/Manufactuer/${id}`,payload)  
    }

    DeleteManufacturer(rowData)
    {
        const {
            id
        } = rowData
        return this.Request('delete',`${this.baseURL}/api/Manufactuer/${id}`)  
    }

    //STORE:
    getAllStores()
    {
        return this.Request('get',`${this.baseURL}/api/Store/get-all-store`) 
    }

    CreateStore(rowData)
    {
        const {
            name,
            address,
            phoneNumber,
            wardId
        } = rowData;
        const payload = {
            data : {
                name,
                address,
                phoneNumber,
                wardId:wardId.id
            }
        }

        return this.Request('post',`${this.baseURL}/api/Store`,payload)  
    }

    EditStore(rowData)
    {
        const {
            id,
            ...rest
        } = rowData
        const payload = {
            data : rest
        }
        return this.Request('put',`${this.baseURL}/api/Store/${id}`,payload)  
    }

    DeleteStore(rowData)
    {
        const {
            id
        } = rowData
        return this.Request('delete',`${this.baseURL}/api/Store/${id}`)  
    }

    // Products:
    getAllProducts()
    {
        return this.Request('get',`${this.baseURL}/api/Product/get-all-product`)     
    }
    
    CreateProduct(rowData)
    {
        const {
            name,
            price,
            quantity,
            manufacturer,
            category,
            store,
            isService,
            isActive
        } = rowData

        const payload = {
            data : {
                name,
                price,
                quantity,
                manufacturerId:+manufacturer.id,
                categoryId:+category.id,
                storeId:+store.id,
                isService,
                isActive}
        }

        return this.Request('post',`${this.baseURL}/api/Product`,payload)  
    }

    EditProduct(rowData)
    {
        const {
            id,
            ...rest
        } = rowData
        const payload = {
            data : rest
        }
        return this.Request('put',`${this.baseURL}/api/Product/${id}`,payload)  
    }

    DeleteProduct(rowData)
    {
        const {
            id
        } = rowData
        return this.Request('delete',`${this.baseURL}/api/Product/${id}`)  
    }


}
export default new Api()