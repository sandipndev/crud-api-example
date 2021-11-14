const { client } = require("./database")

const migrate = async () => {
    await client.connect()
    await client.query(`
        CREATE TABLE users(
            name TEXT,
            email TEXT,
            password TEXT
        );
    `);
    await client.end();
}

migrate().catch(console.error)
