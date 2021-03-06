import {CacheService, Info} from "../../src/price"
import each from "jest-each"

const data = require('./data.json')

const cache = new CacheService<string, Info>(60*1000*10)

const inputArray = data.input
// [
//     ["WII", {name: "WIX", price: 11.1}, "WII", 11.1],
//     ["WII", {name: "WIX", price: 11.1}, "WOW", undefined],
//     ["APPL", {name: "Apple", price: 1922.3}, "APPL", 1922.3],
//     ["TENC", {name: "Tencent", price: 141.1}, "TENC", 141.1],
//     ["FED", {name: "FedEx", price: 244.377}, "Fffeeeeddddd", undefined],
// ]

describe("get", () => {
    beforeEach(async() => {
        await cache.empty
    });

    each(inputArray).it("should return info", 
        async(key: string, inf: Info, searchStr: string, resPrice: number|string) => {
            await cache.put(key, inf)
            const info = await cache.get(searchStr)
            if (resPrice == "undefined") {
                expect(info?.price).toBeUndefined
            } else {
                expect(info?.price).toEqual(resPrice)
            }
            
        }
    );
});