import mysql from 'mysql';

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'program',
  password: '',
  database: 'ExamQuestions',
  port: 3306,
});

interface Question {
  QuestionID: number;
  PaperCode: string;
  QuestionNumber: number;
  QuestionText: string;
  TotalMarks: number;
  Topics: string;
}

interface Image {
  id: number;
  isMS: boolean;
}

interface Text {
  questionText: string;
  markschemeText: string;
}

/**
 * This function is used to perform a parameterized query to get data
 * @param {string} query - The query to be executed
 * @param {any[]} params - The parameters to be used in the query
 * @returns {Promise<any>} - The promise resolves to the result of the query
 */
function selectQuery(query: string, params: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}


/**
 * Sanitize a string
 * @param {string} str - The string to be sanitized
 * @returns {string} - The sanitized string
 */
function sanitize(str: string): string {
    return str.replace(/[^A-Za-z0-9\s.,?!()\-_'"]/, '');
}
    
/**
 * Take search criteria and return an array of questions
 * @param {object} criteria - The search criteria
 * @returns {Promise<Question[]>} - The promise resolves to the result of the query
 */
function getQuestions(criteria: any): Promise<Question[]> {
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

  let conditions: string[] = [];

  if (search) {
    // escape single quotes in search string
    search = search.replace(/'/g, "''");
    // sanitise search string
    search = sanitize(search);
    // use like query to search for search string in question text
    // NOTE this could be improved with better search functionality
    conditions.push(`Question.QuestionContents LIKE '%${search}%'`);
  }

  if (topics && topics.length > 0) {
    // add each topic to the conditions array
    let topicQueries = topics.map((topic: string) => `QuestionTopic.TopicID = ${topic}`);
    // join the topic queries with OR
    conditions.push(`(${topicQueries.join(' OR ')})`);
  }

  if (component) {
    let components: string[] = [component];
    // if component 1, add "unit 1" and "unit 3" to extra components
    if (component.toLowerCase() === 'component 1') {
      components.push('unit 1');
      components.push('unit 3');
    }
    // if component 2, add "unit 2" and "unit 4" to extra components
    else if (component.toLowerCase() === 'component 2') {
      components.push('unit 2');
      components.push('unit 4');
    }
    // add each component to the conditions array
    let componentQueries = components.map((component: string) => `Paper.PaperComponent = '${component}'`);
    // join the component queries with OR
    conditions.push(`(${componentQueries.join(' OR ')})`);
  }

  if (level) {
    conditions.push(`Paper.PaperLevel = '${level}'`);
  }

  // add min and max marks
  conditions.push(`Question.TotalMarks >= ${minMarks}`);
  conditions.push(`Question.TotalMarks <= ${maxMarks}`);

  if (questionID > -1) {
    conditions.push(`Question.QuestionID = ${questionID}`);
  }

  if (markscheme) {
    conditions.push(`Question.Markscheme = '${markscheme}'`);
  }

  if (paperYear) {
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
        let questions: Question[] = [];
        results.forEach((row: any) => {
          questions.push({
            QuestionID: row.QuestionID,
            PaperCode: row.PaperCode,
            QuestionNumber: row.QuestionNumber,
            QuestionText: row.QuestionText,
            TotalMarks: row.TotalMarks,
            Topics: row.Topics,
          });
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
 * @returns {Promise<string[]>} - an array of topic strings
 */
function getTopics(): Promise<string[]> {
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
        let topics = results.map((row: any) => row.TopicID);
        resolve(topics);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * This gets the array of images for a questionID.
 * @param {number} questionID - the questionID to get the images for
 * @returns {Promise<Image[]>} - a promise for the results of the query - a structure containing the imageID and whether it is part of the markscheme
 */
function getImages(questionID: number): Promise<Image[]> {
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
      let images: Image[] = [];
      results.forEach((row: any) => {
        images.push({
          id: row.ImageID,
          isMS: row.IsPartOfMarkscheme,
        });
      });
      return images;
    });
}

/**
 * This gets the text for a questionID.
 * @param {number} questionID - the questionID to get the text for
 * @returns {Promise<Text>} - a promise for the results of the query - a structure containing the question text and markscheme text
 */
function getText(questionID: number): Promise<Text> {
  // get the question text and markscheme text for a question
  let query = `
    SELECT
        QuestionContents AS questionText,
        Markscheme AS markschemeText
    FROM
        Question
    WHERE
        QuestionID = ?;
    `;

  return selectQuery(query, [questionID])
    .then((results) => {
      let text: Text = {
        questionText: results[0].questionText,
        markschemeText: results[0].markschemeText,
      };
      return text;
    });
}

export { getQuestions, getTopics, getImages, getText };
