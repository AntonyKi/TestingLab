import axios from "axios";
import LRU from "lru-cache";
import dotenv from "dotenv";

dotenv.config();
const API_KEY = process.env.API_KEY;

type Info = {
  name: string,
  price: number
}

type Symbol = {
  name: string,
  symbol: string
}

class ApiService{
  constructor(private apiKey = API_KEY){

  }
  async getSymbol(company: string): Promise<Symbol|null>{
    const res = await axios.get(`https://www.alphavantage.co/query?`+
      `function=SYMBOL_SEARCH`+
      `&keywords=${company}`+
      `&apikey=${this.apiKey}`);
      if(!res.data.bestMatches[0]) return null;
      const symbol: string = res.data.bestMatches[0]["1. symbol"];
      const name: string = res.data.bestMatches[0]["2. name"];
      return {name, symbol};
  }

  async getPrice(symbol: string): Promise<number>{
    const res = await axios.get(`https://www.alphavantage.co/`+
      `query?function=GLOBAL_QUOTE`+
      `&symbol=${symbol}`+
      `&apikey=${this.apiKey}`);
    const price = parseFloat(res.data["Global Quote"]["05. price"]);
    return price;
  }

}

class CacheService<K, V> {

  private cache: any;

  constructor(age: number){
    const options: any = {max: 500
      , length: (n: any, key: any) => n * 2 + key.length
      , dispose: (key: any, n: any) => n.close()
      , maxAge: age};
    this.cache = new LRU(options);
  }
  async get(key: K): Promise<V>{
    return await this.cache.get(key);
  }

  async put(key: K, info: V): Promise<void>{
    await this.cache.set(key, info);
  }

  async empty(): Promise<void>{
    await this.cache.reset();
  }
}

class StocksService{

  constructor(private cache = new CacheService<string, Info>(60*1000*10),
              private api = new ApiService()){
  }

  async getInfo(company: string): Promise<Info|null>{
    const resCache: Info = await this.cache.get(company);
    if(!resCache){
      const s = await this.api.getSymbol(company);
      if(s == null){
        return null;
      }
      const price = await this.api.getPrice(s.symbol);
      const name: string = s.name;
      const finalInfo:Info = {
        name,
        price
      };
      this.cache.put(company, finalInfo);
      return finalInfo;
    }else{
      return resCache;
    }
  }

}

export {CacheService, ApiService, Info};
export default StocksService;
