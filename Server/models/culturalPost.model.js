const db = require('../config/db');


const CulturalPost = {
    tableName:"Cultural-Post",
    async createCulturalPostTable() {
        const query = `
            CREATE TABLE IF NOT EXIST cultural-post(
                id SERIAL PRIMARY KEY,
                
            )
        `
    }
}