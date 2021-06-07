import {CacheService, Info} from "../../src/price"

const cache = new CacheService<string, Info>(60*1000*10)

describe("get", () => {
    it("should return nothing on no such entry", async() => {
        const emptyInfo = await cache.get("WII")

        expect(emptyInfo).toBeUndefined
    })

    it("should return cached info", async() => {
        cache.put("WII", {name: "WIII", price: 137.11})
        const info = await cache.get("WII")

        expect(info.name).toEqual("WIII")
        expect(info.price).toEqual(137.11)
    })

    it("show that tests are ordered", async() => {
        const info = await cache.get("WII")

        expect(info.name).toEqual("WIII")
        expect(info.price).toEqual(137.11)
    })

    it("should return nothing after reset", async() => {
        await cache.empty

        const emptyInfo = await cache.get("WII")

        expect(emptyInfo).toBeUndefined
    })
})

describe("put", () => {
    it("should set new key properly", async() => {
        const info = await cache.get("WII")

        expect(info.name).toEqual("WIII")
        expect(info.price).toEqual(137.11)
    })
})

describe("empty", () => {
    it("should remove anything ", async() => {
        await cache.empty
        await cache.put("WIII", {name: "WIII2", price: 7.91})

        const emptyInfo = await cache.get("WII")
        const emptyInfo2 = await cache.get("WIII")


        expect(emptyInfo).toBeUndefined
        expect(emptyInfo2).toBeDefined
    })
})