import {ApiService, Info} from "../../src/price"
import nock from "nock"

const apiKey = process.env.API_KEY;
const apiService = new ApiService()

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