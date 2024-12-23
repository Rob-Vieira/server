import { JSONFilePreset } from "lowdb/node";

export class Database {
    #db_path = './src/db';
    #table = '';
    #db = {};

    async openTable(table){
        this.#db = await JSONFilePreset(`${this.#db_path}/${table}/${table}.json`, {});
        this.#db.read();
        this.#table = table;

        console.log(this.#db);
        console.log(`${this.#db_path}/${table}/${table}.json`);

        return this;
    }

    all(){
        return this.#db.data[`${this.#table}`];
    }
}