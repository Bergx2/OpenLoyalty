const Pool = require('pg').Pool

const pool = new Pool({
    user: 'openloyalty',
    password: 'openloyalty',
    host: 'openloyalty.localhost',
    port: 5432,
    database: 'openloyalty',
})

// Create table 
const createTabelFeedback = () => {
    const query = "CREATE TABLE IF NOT EXISTS feedback(id serial primary key,userid varchar(255),title varchar(255), content varchar(255), " +
        "createdat timestamp DEFAULT CURRENT_TIMESTAMP, isread boolean, " +
        "foreign key(userid) REFERENCES ol__user(id))"

    pool.query(query)
}
createTabelFeedback()

module.exports = pool