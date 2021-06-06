import request from 'supertest'
import app from "../../src/controller"
import nock from "nock"
import axios from "axios"
import dotenv from "dotenv";
import {CacheService, ApiService, Info} from "../../src/price";
import StocksService from "../../src/price";

dotenv.config();
const port = process.env.PORT;
const apiKey = process.env.API_KEY;
app.listen(port);

// axios.defaults.adapter = require('axios/lib/adapters/http');

describe("Stockprice api", () =>{
  it("should return correct types", async() =>{
    const res = await request(app).
    get(`/api/v1/prices?company=WIX`);
    expect(typeof res.body.price).toBe('number');
  });

  const api = new ApiService();
  const cache = new CacheService<string, Info>(10*1000*60);
  const stocks = new StocksService(cache, api);

  it("should use cache ", async() => {
    await stocks.getInfo("WIX");
    const info = await cache.get("WIX");
    expect(info.name).toEqual("Wix.com Ltd.");
  });

  it("should return correct info on getInfo", async() => {
    const res = await axios
      .get(`http://localhost:${port}/api/v1/prices?company=WIX`);
    expect(res.data.name).toEqual("Wix.com Ltd.");
    //expect(res.data.price).toEqual(148.28);
  });

  it("should return not found on searching non existing company name",
  async() =>{
    const res = await axios
      .get(`http://localhost:${port}/api/v1/prices?company=hbjsadfkasdf`);
    expect(res.data).toEqual("No such company found");
    expect(res.status).toEqual(200);
  });

  it("should return bad request on bad query", async() => {
    const res = await axios
      .get(`http://localhost:${port}/api/v1/prices?knsb=sdg`);
    expect(res.data).toEqual("Bad request query");
    expect(res.status).toEqual(400);
  });

  nock('https://www.alphavantage.co', {allowUnmocked: true})
  .get('/query')
  .query({
    function: "SYMBOL_SEARCH",
    keywords: "WII",
    apikey: apiKey
  })
  .reply(200, {
    bestMatches: [
    {
      '1. symbol': 'WII',
      '2. name': 'Wix.com Ltd.'
    } ]
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
