import express, { Request, Response } from "express";
const testRouter = express();


 testRouter.get("/", async(req:Request, res:Response) => {
    console.log('i am test')  
    res.json({Route :"test"});


});


export {testRouter}