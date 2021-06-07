import {Info, CacheService, ApiService} from "../../src/price"
import StocksService from "../../src/price"

let cacheResponse : Info|undefined = {
    name: "WIX", 
    price: 263.2
}

const cache = {
    get: async(key: string) => {
        return cacheResponse
    },
    put: async(key: string, info: Info) => {},
    empty: () => {}
} as CacheService<String, Info>

const api = {
    getSymbol: async(company: string) => {
        return {
            symbol: "WII", 
            name: "WIX"
        }
    },
    getPrice: async(company: string) => {
        return 233.21
    }
} as ApiService

const stocksService = new StocksService(cache, api)

describe("getInfo", () => {
    beforeEach(() => {
        spyOn(cache, "get")
        spyOn(cache, "put")
        spyOn(cache, "empty")
        spyOn(api, "getPrice")
        spyOn(api, "getSymbol")
    })

    afterEach(() => {    
        jest.clearAllMocks();
    });

    it("getInfo uses cache", async() => {
        cacheResponse = {
            name: "WIX", 
            price: 263.2
        }
        const info = await stocksService.getInfo("WII")

        expect(cache.get).toHaveBeenCalled
        expect(cache.put).not.toHaveBeenCalled
        expect(cache.empty).not.toHaveBeenCalled
        expect(api.getPrice).not.toHaveBeenCalled
    })

    it("getInfo uses external api", async() => {
        cacheResponse = undefined
        const info = await stocksService.getInfo("WII")

        expect(cache.get).toHaveBeenCalled
        expect(cache.put).toHaveBeenCalled
        expect(cache.empty).not.toHaveBeenCalled
        expect(api.getPrice).toHaveBeenCalled
        expect(api.getSymbol).toHaveBeenCalled
    })
})