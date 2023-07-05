// server/db.js
// MySQL handling, exported functions are used to
// abstract away the database calls from the pages
const mysql = require('mysql');
const util = require('./util/util.js');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'program',
    password: '',
    database: 'ExamQuestions',
    port: "3306"
});

/**
 * This function is used to perform a parameterized query to get data
 * @param {string} query - The query to be executed
 * @param {array} params - The parameters to be used in the query
 * @returns {Promise} - The promise resolves to the result of the query
 */
function selectQuery(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

/**
 * Take search criteria and return an array of questions
 * @param {object} search - The search criteria
 * @returns {Promise} - The promise resolves to the result of the query
 */
function getQuestions(criteria) 
{
    let { search, topics, component, level, minMarks, maxMarks, questionID, markscheme, paperYear } = criteria;
    // if topics is a string, convert to an array with one element
    if (typeof topics === 'string') topics = [topics];
    
    // create the query based on search criteria
    let query = `
    SELECT
        Question.QuestionID AS QuestionID,
        CONCAT(Paper.PaperYear, '-', Paper.PaperComponent, '-', Paper.PaperLevel) AS PaperCode,
        Question.QuestionNumber AS QuestionNumber,
        Question.QuestionContents AS QuestionText,
        Question.TotalMarks AS TotalMarks,
        (
            SELECT
                GROUP_CONCAT(TopicID SEPARATOR ', ')
            FROM
                QuestionTopic
            WHERE
                QuestionTopic.QuestionID = Question.QuestionID
        ) AS Topics
    FROM
        Paper
        JOIN Question ON Paper.PaperID = Question.PaperID
        LEFT JOIN QuestionTopic ON Question.QuestionID = QuestionTopic.QuestionID
    WHERE
        `;
    
    let conditions = [];

    if (search)
    {
        // escape single quotes in search string
        search = search.replace(/'/g, "''");
        // sanitise search string
        search = util.sanitize(search);
        // use like query to search for search string in question text
        // NOTE this could be improved with better search functionality
        conditions.push(`Question.QuestionContents LIKE '%${search}%'`);
    }

    if (topics && topics.length > 0)
    {
        // add each topic to the conditions array
        let topicQueries = topics.map(topic => `QuestionTopic.TopicID = ${topic}`);
        // join the topic queries with OR
        conditions.push(`(${topicQueries.join(' OR ')})`);

    }

    if (component)
    {
        let components = [component];
        // if component 1, add "unit 1" and "unit 3" to extra components
        if (component.toLowerCase() === 'component 1')
        {
            components.push('unit 1');
            components.push('unit 3');
        }
        // if component 2, add "unit 2" and "unit 4" to extra components
        else if (component.toLowerCase() === 'component 2')
        {
            components.push('unit 2');
            components.push('unit 4');
        }
        // add each component to the conditions array
        let componentQueries = components.map(component => `Paper.PaperComponent = '${component}'`);
        // join the component queries with OR
        conditions.push(`(${componentQueries.join(' OR ')})`);
    }

    if (level)
    {
        conditions.push(`Paper.PaperLevel = '${level}'`);
    }

    // add min and max marks
    conditions.push(`Question.TotalMarks >= ${minMarks}`);
    conditions.push(`Question.TotalMarks <= ${maxMarks}`);

    if (questionID > -1)
    {
        conditions.push(`Question.QuestionID = ${questionID}`);
    }

    if (markscheme)
    {
        conditions.push(`Question.Markscheme = '${markscheme}'`);
    }

    if (paperYear)
    {
        conditions.push(`Paper.PaperYear = ${paperYear}`);
    }

    // join the conditions with AND
    query += conditions.join(' AND ');

    // add group by and order by
    query += `
    GROUP BY
    Question.QuestionID,
    Paper.PaperYear,
    Paper.PaperComponent,
    Paper.PaperLevel,
    Question.QuestionNumber,
    Question.QuestionContents,
    Question.TotalMarks
    ORDER BY
        Question.QuestionID ASC;
    `;
    return new Promise((resolve, reject) => {
        selectQuery(query, [])
        .then((results) => {
            let questions = [];
            results.forEach((row) => {
                questions.push(
                {
                    row.QuestionID,
                    row.PaperCode,
                    row.QuestionNumber,
                    row.QuestionText,
                    row.TotalMarks,
                    row.Topics
                }
                );
            });
            resolve(questions);
        })
        .catch((err) => {
            reject(err);
        });
    });

}


/**
 * This gets all the topics strings from the database
 * @returns {array} - an array of topic strings
 */
function getTopics() 
{
    return new Promise((resolve, reject) => {
      let query = `
        SELECT
          DISTINCT TopicID
        FROM
          QuestionTopic
        ORDER BY
          TopicID;
      `;
      selectQuery(query, [])
        .then((results) => {
          let topics = results.map(row => row.TopicID);
          resolve(topics);
        })
        .catch(error => {
          reject(error);
        });
    });
}

/**
 * This gets the array of images for a questionID.
 * @param {number} questionID - the questionID to get the images for
 * @returns {Promise} - a promise for the results of the query - a structure containing the imageID and whether it is part of the markscheme
 */
function getImages(questionID) {
    // images are stored as blob data
    // get all images for a question
    let query = `
    SELECT
        Images.ImageID AS ImageID,
        Images.IsPartOfMarkscheme AS IsPartOfMarkscheme
    FROM
        Images
    WHERE
        Images.QuestionID = ?
    ORDER BY
        Images.ImageNumber ASC;
    `;

    return selectQuery(query, [questionID])
        .then((results) => {
            let images = [];
            results.forEach((row) => {
                images.push(
                    {
                        id: row.ImageID,
                        isMS: row.IsPartOfMarkscheme
                    }
                    );
            }
            );
            return images;
        }
    );
}


/**
 * Get the question and markscheme text for a questionID
 * @param {number} questionID - the questionID to get the text for
 * @returns {Promise} - a promise for the results of the query - an object with question and markscheme text
 */
function getText(questionID) {
    // get the question and markscheme text for a question
    let query = `
    SELECT
        Question.QuestionContents AS QuestionText,
        Question.MarkschemeContents AS MarkschemeText
    FROM
        Question
    WHERE
        Question.QuestionID = ?;
    `;
    return selectQuery(query, [questionID])
        .then((results) => {
            // return the text if possible, otherwise return "No text found"
            return {
                questionText: results[0].QuestionText || "No text found",
                markschemeText: results[0].MarkschemeText || "No text found"
            };
        }
    );
}

/**
 * Gets all the years for the papers in the database
 * @returns {Promise} - a promise for the results of the query - an array of years
 */
function getYears() {
    let query = `
    SELECT
        DISTINCT PaperYear
    FROM
        Paper
    ORDER BY
        PaperYear DESC;
    `;
    return selectQuery(query, [])
        .then((results) => {
            let years = results.map(row => row.PaperYear);
            return years;
        }
    );
}

/**
 * Function to get the maximum questionID in the database
 * @returns {Promise} - a promise for the results of the query - the maximum questionID
 */
function getMaxQuestionID() {
    let query = `
    SELECT
        MAX(QuestionID) AS MaxQuestionID
    FROM
        Question;
    `;
    return selectQuery(query, [])
        .then((results) => {
            return results[0].MaxQuestionID;
        }
    );
}

module.exports = {
    getQuestions,
    getTopics,
    getImages,
    getText,
    getYears,
    getMaxQuestionID
}

