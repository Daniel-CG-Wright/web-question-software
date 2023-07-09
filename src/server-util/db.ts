import mysql from 'mysql';
import { SearchCriteria, Question } from '@/types';
import { Image, Text, PaperData, OutputData, RQGQuestionData } from '@/types';
// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'program',
  password: '',
  database: 'ExamQuestions',
  port: 3306,
});

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
function dbGetQuestions(criteria: SearchCriteria): Promise<Question[]> {
  let { text, topics, component, level, minMarks, maxMarks, id, searchInMarkscheme, paperYear, subject } = criteria;
  // log all the search criteria
  // if there is no subject, then return an empty array
  if (!subject) return Promise.resolve([]);

  // if topics is a string, convert to an array with one element
  if (typeof topics === 'string' && topics != "") topics = [topics];

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

  let conditions: string[] = [`Paper.PaperSubjectID = ${subject}`];

  if (text) {
    // escape single quotes in search string
    text = text.replace(/'/g, "''");
    // sanitise search string
    text = sanitize(text);
    // use like query to search for search string in question text
    // NOTE this could be improved with better search functionality
    conditions.push(`Question.QuestionContents LIKE '%${text}%'`);
  }

  if (topics && topics.length > 0) {
    // add each topic to the conditions array
    let topicQueries = topics.map((topic: string) => `QuestionTopic.TopicID = '${topic}'`);
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

  if (id > -1) {
    conditions.push(`Question.QuestionID = ${id}`);
  }

  if (searchInMarkscheme === true) {
    conditions.push(`Question.MarkschemeContents LIKE '%${text}%'`);
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

   // console.log(query);
  return new Promise((resolve, reject) => {
    selectQuery(query, [])
      .then((results) => {
        let questions: Question[] = [];
        results.forEach((row: any) => {
          questions.push({
            id: row.QuestionID,
            paperCode: row.PaperCode,
            number: row.QuestionNumber,
            text: row.QuestionText,
            marks: row.TotalMarks,
            topics: row.Topics,
            markscheme: ''
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
 * @param {number} subjectID - the subjectID to get the topics for
 * @returns {Promise<string[]>} - an array of topic strings
 */
function dbGetTopics(subjectID: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT DISTINCT qt.TopicID
    FROM paper p
    JOIN question q ON p.PaperID = q.PaperID
    JOIN questiontopic qt ON q.QuestionID = qt.QuestionID
    WHERE p.PaperSubjectID = ${subjectID};    
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
 * This gets all the output data needed for a given questionID.
 * This includes paperData, text, images and question number.
 * @param {number} questionID - the questionID to get the data for
 * @returns {Promise<OutputData>} - a promise for the results of the query - a structure containing the paperData, text, images and question number
 */
function dbGetOutputData(questionID: number): Promise<OutputData> {
  let query = `
    SELECT
        Question.QuestionNumber AS questionNumber,
        Paper.PaperYear AS paperYear,
        LevelComponent.ComponentID AS paperComponent,
        SubjectLevel.LevelID AS paperLevel,
        Question.QuestionContents AS questionText,
        Question.MarkschemeContents AS markschemeText,
        Images.ImageID AS imageID,
        Images.IsPartOfMarkscheme AS isPartOfMarkscheme,
        Question.TotalMarks AS totalMarks
    FROM
        Question
    INNER JOIN
        Paper
    ON
        Question.PaperID = Paper.PaperID
    LEFT JOIN
        Images
    ON
        Question.QuestionID = Images.QuestionID
    INNER JOIN
        LevelComponent
    ON
        Paper.LevelComponentID = LevelComponent.LevelComponentID
    INNER JOIN
        SubjectLevel
    ON
        LevelComponent.SubjectLevelID = SubjectLevel.SubjectLevelID
    WHERE
        Question.QuestionID = ?
    ORDER BY
        Images.ImageNumber ASC;
    `;

    // each row will have the same header data, but will have different image data
    // this is more 'messy' (data redundancy) but it only uses 1 query as opposed to 2.
  return selectQuery(query, [questionID])
    .then((results) => {
      let outputData: OutputData = {
        questionNumber: results[0].questionNumber,
        paperData: {
          year: results[0].paperYear,
          component: results[0].paperComponent,
          level: results[0].paperLevel,
        },
        text: {
          questionContents: results[0].questionText,
          markschemeContents: results[0].markschemeText,
        },
        images: [],
        totalMarks: results[0].totalMarks
      };
      results.forEach((row: any) => {
        outputData.images.push({
          id: row.imageID,
          isMS: row.isPartOfMarkscheme,
        });
      });
      return outputData;
    });
}


/**
 * This function gets the distinct components for a given subjectID and selected level
 * @param {number} subjectID - the subjectID to get the components for
 * @param {string} level - the level to get the components for - e.g. "as", "a". if left blank, all components will be returned
 * @returns {Promise<string[]>} - a promise for the results of the query - an array of strings representing the components
 */
function dbGetComponents(subjectID: number, level: string = ""): Promise<string[]> {

  // @note MAY NEED TO LINK Components together (e.g. component 1 linked to unit 1)
  // Could do with even/odd numbers being checked

  let query = `
    SELECT DISTINCT
        LevelComponent.ComponentID AS PaperComponent
    FROM
        LevelComponent
    INNER JOIN
        SubjectLevel
    ON
        LevelComponent.SubjectLevelID = SubjectLevel.SubjectLevelID
    WHERE
        SubjectLevel.SubjectID = ?
    ${level ? "AND SubjectLevel.LevelID = ?" : ""}
    ORDER BY
        LevelComponent.ComponentID ASC;
    `;
  return selectQuery(query, [subjectID])
    .then((results) => {
      let components: string[] = [];
      results.forEach((row: any) => {
        components.push(row.PaperComponent);
      });
      return components;
    });
}

/**
 * This function gets the distinct levels for a given subjectID
 * @param {number} subjectID - the subjectID to get the levels for
 * @returns {Promise<string[]>} - a promise for the results of the query - an array of strings representing the levels
  */
function dbGetLevels(subjectID: number): Promise<string[]> {
  let query = `
    SELECT DISTINCT
        SubjectLevel.LevelID AS PaperLevel
    FROM
        SubjectLevel
    WHERE
        SubjectLevel.SubjectID = ?
    ORDER BY
        SubjectLevel.LevelID ASC;
    `;
  return selectQuery(query, [subjectID])
    .then((results) => {
      let levels: string[] = [];
      results.forEach((row: any) => {
        levels.push(row.PaperLevel);
      });
      return levels;
    });
}


/**
 * Get the subject name for a given subject ID
 * @note this may need to be changed to get specific levels, and the isGCSE flag is obsoleted by the specific levels.
 * @param {number} subjectID - the subject ID to get the name for
 * @returns {Promise<string>} - a promise for the results of the query - a string representing the levels + subject name
 */
function dbGetSubjectName(subjectID: number): Promise<string> {
  let query = `
    SELECT
      SubjectName,
      isGCSE
    FROM
        Subject
    WHERE
        Subject.SubjectID = ?;
    `;
  return selectQuery(query, [subjectID])
    .then((results) => {
      // add A/AS to the front of the subject name if not GCSE, otherwise return GCSE + subject name
      if (results[0].isGCSE === 0) {
        return `A/AS ${results[0].SubjectName}`;
      }
      else {
        return `GCSE ${results[0].SubjectName}`;
      }

    })
    .catch((error) => {
      throw error;
    }
    );
}

export { dbGetQuestions, dbGetTopics, dbGetOutputData, dbGetComponents, dbGetLevels , dbGetSubjectName};
