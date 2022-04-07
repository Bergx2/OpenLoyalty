const e = require('cors')
const db = require('../../config/db')

const getReadStateQuery = (state) => {
    switch (state) {
        case 'read':
            return 'isread = true'
        case 'unread':
            return 'isread = false'
        default:
            return ''
    }
}

const isValidDate = (dateString) => {
    // First check for the pattern
    var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if (!regex_date.test(dateString)) {
        return false;
    }

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
        return false;
    }

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

class FeedbackController {

    // GET ALL FEEDBACKS
    //@GET: /feedback
    getAllFeedback(req, res, next) {
        const limitFeedbacks = 20;
        let { page, state, start_date, end_date, email } = req.query
        let currentPage = page | 0
        if (currentPage < 0)
            currentPage = 0
        let filterDate = false;

        if (isValidDate(start_date) && isValidDate(end_date)) {
            filterDate = true;
            start_date = start_date + ''
            end_date = end_date + ''
        }



        const readState = getReadStateQuery(state)

        const query = `SELECT feedback.id, title, content, createdat, isread, userid, email, username, first_name, last_name
            FROM ol__user, feedback  
            WHERE feedback.userid = ol__user.id 
            ${readState && `and ${readState} `} 
            ${filterDate ? `and Date(createdat) BETWEEN '${start_date}' AND '${end_date}' ` : ''} 
            ${email ? `AND email LIKE '%${email}%' ` : ''}
            ORDER BY feedback.id DESC
            LIMIT ${limitFeedbacks}
            OFFSET ${currentPage * limitFeedbacks} `


        db.query(query)
            .then(results => {
                const data = results.rows
                const allFeedbacks = data.map(feedback => {
                    const { id, title, content, createdat, isread, ...user } = feedback
                    return {
                        id,
                        title,
                        content,
                        createdAt: createdat,
                        isReaded: isread,
                        user
                    }
                })
                return {
                    success: true,
                    allFeedbacks,
                    currentPage,
                    limit: limitFeedbacks,
                    filter: {
                        readState,
                        date: {
                            filterDate,
                            start_date,
                            end_date,
                        },
                        email,

                    }
                }
            })
            .then(feedbacks => {

                const getConditions = () => {

                    const readStateCondition = feedbacks.filter.readState ? feedbacks.filter.readState : 'true'
                    const dateCondition = feedbacks.filter.date.filterDate ? `Date(createdat) BETWEEN '${feedbacks.filter.date.start_date}' AND '${feedbacks.filter.date.end_date}'` : 'true'
                    const emailCondition = feedbacks.filter.email ? `email LIKE '%${feedbacks.filter.email}%'` : 'true'
                    const finalCondition = `${readStateCondition} AND ${dateCondition} AND ${emailCondition}`

                    return finalCondition
                }

                const conditions = getConditions()

                const query = `SELECT COUNT(feedback.id) FROM ol__user, feedback WHERE feedback.userid = ol__user.id and ${conditions}`
                console.log(query)
                db.query(query)
                    .then(results => {

                        const totalFeedbacks = results.rows[0].count;
                        const totalPages = Math.floor(totalFeedbacks / limitFeedbacks) + 1
                        res.status(200).json({
                            ...feedbacks,
                            totalFeedbacks,
                            totalPages,
                            query
                        })
                    })
                    .catch(() => {
                        res.status(200).json({
                            ...feedbacks,
                            query
                        })
                    })
            })
            .catch(error => {
                res.status(400).json({
                    success: false,
                    error,
                    query
                })
            })

    }


    // ADD NEW FEEDBACK
    // @POST: /feedback
    addNewFeedback(req, res, next) {
        const { userId, title, content } = req.body;
        const isReaded = false;

        db.query('INSERT INTO feedback(userid,title, content, isread) VALUES ($1, $2, $3, $4 )',
            [userId, title, content, isReaded], (error, results) => {
                if (error) {
                    res.status(401).json({
                        success: false,
                        error,
                    })
                }
                else {
                    res.status(200).json({
                        success: true,
                        data: results
                    })
                }
            })
    }

    makeAsRead(req, res, next) {
        const id = req.params.id
        let isReaded = req.body.isReaded
        isReaded = isReaded || true;
        isReaded = !!isReaded
        const query = `UPDATE feedback SET isread = ${isReaded} WHERE id = ${id}`
        db.query(query)
            .then(results => {
                res.status(200).json({
                    success: true,
                    data: results
                })
            })
            .catch(error => {
                res.status(401).json({
                    success: false,
                    error,
                })
            })
    }



}


module.exports = new FeedbackController



