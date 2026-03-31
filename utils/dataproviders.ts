import fs from 'fs';
import {parse} from 'csv-parse/sync';

export class DataProviders {
    static getTestDataFromJSON(filePath: string)
    {
       let data:string=JSON.parse(fs.readFileSync(filePath, 'utf-8'));
       return data;
    }
    static getTestDataFromCSV(filePath: string)
    {
        let data=parse(fs.readFileSync(filePath),{
            columns:true,
            skip_empty_lines:true
        });
        return data;
    }
}    