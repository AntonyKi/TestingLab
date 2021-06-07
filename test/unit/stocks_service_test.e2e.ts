import {Info, CacheService, ApiService} from "../../src/price"
import StocksService from "../../src/price"


const cache = {
    get: async(key: string) => {
        return {
            name: "WIX", 
            price: 263.2
        }
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
        return 263.2
    }
} as ApiService

const stocksService = new StocksService(cache, api)

xdescribe("getInfo", () => {
    it("getInfo", async() => {
        const info = await stocksService.getInfo("WII")

        expect(info?.name).toEqual("WIX")
        expect(info?.price).toEqual(263.2)
    })
})