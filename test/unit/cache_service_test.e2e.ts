import {CacheService, Info} from "../../src/price"

const cache = new CacheService<string, Info>(60*1000*10)

xdescribe("get", () => {
    beforeEach(async() => {
        await cache.empty
    });

    it("should return nothing on no such entry", async() => {
        const emptyInfo = await cache.get("WII")

        expect(emptyInfo).toBeUndefined
    });

    it("should return cached info", async() => {
        cache.put("WII", {name: "WIII", price: 137.11})
        const info = await cache.get("WII")

        expect(info?.name).toEqual("WIII")
        expect(info?.price).toEqual(137.11)
    });

    it("should return nothing after reset", async() => {
        await cache.put("WII", {name: "WIII", price: 137.11})

        await cache.empty

        const emptyInfo = await cache.get("WII")

        expect(emptyInfo).toBeUndefined
    });
});

xdescribe("put", () => {
    beforeEach(async() => {
        await cache.empty
    });

    it("should set new key properly", async() => {
        await cache.put("WII", {name: "WIII2", price: 7.91})

        const info = await cache.get("WII")

        expect(info?.name).toEqual("WIII2")
        expect(info?.price).toEqual(7.91)
    });
});

xdescribe("empty", () => {
    beforeEach(async() => {
        await cache.empty
    });
    
    it("should remove anything ", async() => {
        await cache.put("WII", {name: "WIII", price: 137.11})
        await cache.put("WIII", {name: "WIII2", price: 7.91})

        const emptyInfo = await cache.get("WII")
        const emptyInfo2 = await cache.get("WIII")

        await cache.empty

        expect(emptyInfo).toBeUndefined
        expect(emptyInfo2).toBeUndefined
    });
});