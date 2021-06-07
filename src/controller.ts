import express from "express";
import {Request, Response, NextFunction, json} from "express";
import StocksService from "./price";

const prices = new StocksService();
const app = express();

app.use(json());

app.get("/api/v1/prices", async (req: Request, res: Response, next: NextFunction) =>{
  try {
    //console.error(JSON.stringify(req.query));
    const company = req.query.company;
    if (company == undefined) {
      return res.status(400).send("Bad request query");
    }
    let info = await prices.getInfo(company);
    if (info == null) {
      res.status(200).send("No such company found");
    } else {
      res.status(200).json({
        name: info.name,
        price: info.price
      });
    }
  } catch(err) {
    next(err);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).send('Something broke!');
});

export default app;
