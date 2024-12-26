import { JSONFilePreset } from "lowdb/node";

export class Database {
    #db_path = './src/db';
    #table = '';
    #db = {};

    async openTable(table){
        this.#db = await JSONFilePreset(`${this.#db_path}/${table}/${table}.json`, {});
        this.#db.read();
        this.#table = table;

        return this;
    }

    select({operator, name, value}){
        let and = this.all();

        and = and.filter((item) => {
            switch(operator){
                case '=':
                    return item[`${name}`] == value;
                case '!=':
                    return item[`${name}`] != value;
                case '>':
                    return  Number(item[`${name}`]) > Number(value);
                case '<':
                    return Number(item[`${name}`]) < Number(value);
                case '<=':
                    return Number(item[`${name}`]) <= Number(value);
                case '>=':
                    return Number(item[`${name}`]) >= Number(value);
            }
        });

        return and;
    }

    all(){
        return this.#db.data[`${this.#table}`];
    }

    one(id){
        return this.#getIndex(id).register;
    }

    async create(values){
        const id = this.#db.data['setting'].autokey++;

        this.#db.data[`${this.#table}`].push({
            id,
            ...values
        });
        
        
        await this.#db.write();
        await this.#db.read();

        return id;
    }

    async update_one(id, values){
        const { register, index } = this.#getIndex(id);

        if(index == -1) return;

        this.#db.data[`${this.#table}`][index] = {
            ...register,
            ...values
        }

        await this.#db.write();
        await this.#db.read();
    }

    async destroy_one(id){
        const { index } = this.#getIndex(id);

        if(index == -1) return;

        this.#db.data[`${this.#table}`].splice(index, 1);

        await this.#db.write();
        await this.#db.read();
    }

    #getIndex(id){
        const index = this.#db.data[`${this.#table}`].findIndex(r => r.id == id);
        const register = index !== -1 ? this.#db.data[`${this.#table}`][index] : null;

        return {
            index,
            register
        }
    }
}