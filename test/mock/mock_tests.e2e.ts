import request from 'supertest'
import app from "../../src/controller"
import nock from "nock"
import axios from "axios"
import dotenv from "dotenv"
import {ApiService, CacheService, Info} from "../../src/price"
import StocksService from "../../src/price"

const apiService = new ApiService()
dotenv.config();
const port = process.env.PORT;
const apiKey = process.env.API_KEY;
app.listen(port);


describe("Stockprice api", () => {
    nock('https://www.alphavantage.co', {allowUnmocked: true})
    .get('/query')
    .query({
        function: "SYMBOL_SEARCH",
        keywords: "WII",
        apikey: apiKey
    })
    .reply(200, {
    bestMatches: [{
            '1. symbol': 'WII',
            '2. name': 'Wix.com Ltd.'
        }]
    });

    nock('https://www.alphavantage.co', {allowUnmocked: true})
    .get('/query')
    .query({
    function: "GLOBAL_QUOTE",
    symbol: "WII",
    apikey: apiKey
    })
    .reply(200, {
    "Global Quote": {
        "01. symbol": "WII",
        "05. price": "145.2100",
        }
    });

    it("should return correct info on getInfo with mocked api", async() => {
        const res = await axios.get(`http://localhost:${port}/api/v1/prices?company=WII`);
        expect(res.data.name).toEqual("Wix.com Ltd.");
        expect(res.data.price).toEqual(145.21);
    });
});

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

describe("StocksService.getInfo", () => {
    it("getInfo", async() => {
        const info = await stocksService.getInfo("WII")

        expect(info?.name).toEqual("WIX")
        expect(info?.price).toEqual(263.2)
    })
})

describe("getSymbol", () => {

    nock('https://www.alphavantage.co', {allowUnmocked: true})
    .get('/query')
    .query({
        function: "SYMBOL_SEARCH",
        keywords: "WII",
        apikey: apiKey
    })
    .reply(200, {
    bestMatches: [{
            '1. symbol': 'WII',
            '2. name': 'Wix.com Ltd.'
        }]
    });

    it("should return best match", async() => {
        const sym = await apiService.getSymbol("WII")

        expect(sym?.symbol).toEqual("WII")
        expect(sym?.name).toEqual("Wix.com Ltd.")
    })
})

describe("getPrice", () => {
    nock('https://www.alphavantage.co', {allowUnmocked: true})
    .get('/query')
    .query({
    function: "GLOBAL_QUOTE",
    symbol: "WII",
    apikey: apiKey
    })
    .reply(200, {
    "Global Quote": {
        "01. symbol": "WII",
        "05. price": "145.2100",
        }
    });

    it("should return price for stock symbol", async() => {
        const price = await apiService.getPrice("WII")

        expect(price).toEqual(145.21)
    })
})