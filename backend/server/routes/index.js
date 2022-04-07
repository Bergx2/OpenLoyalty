const feedbackRoute = require('./feedbackRoute')

function route(app) {
    app.use('/feedback', feedbackRoute)
}


module.exports = route