import { config } from '../config/Constants';
import { Request, Response } from "express";
import shortId from "shortid";
import { URLModel } from '../database/model/URL';

export class URLController {
    public async shorten(req: Request, res: Response): Promise<void>{
       //VERIFICANDO SE A URL JÁ EXISTE NO BANCO
       const {originURL} = req.body;
       const url = await URLModel.findOne({ originURL })
		if (url) {
			res.json(url)
			return
		}
        //CASO NÃO EXISTA, CRIA O HASH PARA A URL
       const hash = shortId.generate();
       const shortURL = `${config.API_URL}/${hash}`
       const newURL = await URLModel.create({ hash, shortURL, originURL })
       //SALVAR URL NO BANCO
       //RETORNAR A URL QUE FOI SALVA NO BANCO 
       res.json(newURL);
    }

    public async redirect(req: Request, res: Response): Promise<void>{
        //PEGAR O HASH DA URL
        const {hash}  = req.params
        //ENCONTRAR URL ORIGINAL
        const url = await URLModel.findOne({hash})
        if (url) {
			res.redirect(url.originURL)
			return
		}
        //REDIRECIONAR PARA A URL ORIGINAL DE ACORDO COM O QUE ENCONTRAR
        //NO BANCO DE DADOS
        res.status(400).json({ error: 'URL not found' });
    }
}