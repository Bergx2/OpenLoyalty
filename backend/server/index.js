const express = require('express')
const cors = require('cors')
const route = require('./routes/index')
const app = express();
const port = 3000

app.use(express.urlencoded({
    extended: true
}))
// Để app đọc được json gửi lên
app.use(express.json())

// để front end từ local host lấy api được
app.use(cors())

// navigation
route(app)

// connect server
app.listen(port, () => {
    console.log(`server has started on port ${port}`)
})