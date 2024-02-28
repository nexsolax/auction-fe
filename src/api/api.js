import axios from "axios"

class Api 
{
    constructor() 
    {
        this.baseURL = 'https://reasapi.azurewebsites.net';

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
        config['Access-Control-Allow-Origin'] = 'https://reasapi.azurewebsites.net';
        config['headers'] = {
            'Content-Type': contentType
        };
        config['payload'] = payload || {}
        return axios(config)
    }

    getAuction()
    {
        return this.Request('get',`${this.baseURL}/api/Auction`)  
    }

    CreateAuction(rowData)
    {
        const {
            startingPrice,
            bidIncrement,
            maxBidIncrement,
            realEstate,    
            isService,
            isActive
        } = rowData

        const payload = {
            data : {
                startingPrice,
                bidIncrement,
                maxBidIncrement,
                realEstateId:+realEstate.id,                
                isService,
                isActive}
        }

        return this.Request('post',`${this.baseURL}/api/Auction/create-request`,payload)  
    }

    EditAuction(rowData)
    {
        const {
            id,
            ...rest
        } = rowData
        const payload = {
            data : rest
        }
        return this.Request('put',`${this.baseURL}/api/Auction/${id}/approve`,payload)  
    }

    DeleteAuction(rowData)
    {
        const {
            id
        } = rowData
        return this.Request('delete',`${this.baseURL}/api/Auction/${id}`)  
    }

    getOwnAuction()
    {
        return this.Request('get',`${this.baseURL}/api/Auction/own`)     
    }

    getCategory()
    {
        return this.Request('get',`${this.baseURL}/api/Category`)  
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


    getRealEstate()
    {
        return this.Request('get',`${this.baseURL}/api/RealEstate`)     
    }
    
    CreateRealEstate(rowData)
    {
        const {
            name,
            address,
            description,
            category,           
            isService,
            isActive
        } = rowData

        const payload = {
            data : {
                name,
                address,
                description,
                categoryId:+category.id,                
                isService,
                isActive}
        }

        return this.Request('post',`${this.baseURL}/api/RealEstate`,payload)  
    }

    EditRealEstate(rowData)
    {
        const {
            id,
            ...rest
        } = rowData
        const payload = {
            data : rest
        }
        return this.Request('put',`${this.baseURL}/api/RealEstate/${id}`,payload)  
    }

    DeleteRealEstate(rowData)
    {
        const {
            id
        } = rowData
        return this.Request('delete',`${this.baseURL}/api/RealEstate/${id}`)  
    }


}
export default new Api()