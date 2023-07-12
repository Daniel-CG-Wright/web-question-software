import mysql from 'mysql';
import { SearchCriteria, Question } from '@/types';
import { OutputData, Components, SmallOutputData } from '@/types';
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
 * Take search criteria and return the conditions for the WHERE clause of the query.
 * Ensure that SubjectLevel, LevelComponent are joined.
 * @param {SearchCriteria} criteria - The search criteria
 * @returns {string} - The conditions for the WHERE clause of the query
 */
function getWhereConditions(criteria: SearchCriteria): string {
  let { text, topics, component, level, minMarks, maxMarks, id, searchInMarkscheme, paperYear, subject } = criteria;
  let conditions = [];
  // if there is no subject, then return an empty string
  if (!subject) return "";

  // if topics is a string, convert to an array with one element
  if (typeof topics === 'string' && topics != "") topics = [topics];

  // create the query based on search criteria
  conditions.push(`SubjectLevel.SubjectID = ${subject}`);

  if (text && searchInMarkscheme === false) {
    // escape single quotes in search string
    text = text.replace(/'/g, "''");
    // sanitise search string
    text = sanitize(text);
    // use like query to search for search string in question text
    // NOTE this could be improved with better search functionality
    conditions.push(`Question.QuestionContents LIKE '%${text}%'`);
  }
  else if (text && searchInMarkscheme === true) {
    // escape single quotes in search string
    text = text.replace(/'/g, "''");
    // sanitise search string
    text = sanitize(text);
    // use like query to search for search string in question text
    // NOTE this could be improved with better search functionality
    conditions.push(`Question.MarkschemeContents LIKE '%${text}%'`);
  }

  if (topics && topics.length > 0) {
    // add each topic to the conditions array
    let topicQueries = topics.map((topic: string) => `QuestionTopic.TopicID = '${topic}'`);
    // join the topic queries with OR
    conditions.push(`(${topicQueries.join(' OR ')})`);
  }

  if (component) {
    // get the logical components from levelComponent linked to the
    // component selected by the user in displayComponent, and the subject
    // selected by the user and the level selected by the user
    let logicalComponentsQuery = `
            
          LevelComponent.LevelComponentID IN (
            SELECT
              LevelComponent.LevelComponentID
            FROM
              LevelComponent
            INNER JOIN SubjectLevel ON LevelComponent.SubjectLevelID = SubjectLevel.SubjectLevelID
            INNER JOIN DisplayComponent ON LevelComponent.DisplayComponentID = DisplayComponent.DisplayComponentID
            WHERE
              SubjectLevel.SubjectID = ${subject}
              AND DisplayComponent.DisplayComponent = '${component}'
              ${level ? `AND SubjectLevel.LevelID = '${level}'` : ''}
          )
        `;
    conditions.push(logicalComponentsQuery);

  }

  if (level) {
    conditions.push(`SubjectLevel.LevelID = '${level}'`);
  }

  // add min and max marks
  conditions.push(`Question.TotalMarks >= ${minMarks}`);
  conditions.push(`Question.TotalMarks <= ${maxMarks}`);

  if (id > -1) {
    conditions.push(`Question.QuestionID = ${id}`);
  }

  if (paperYear) {
    conditions.push(`Paper.PaperYear = ${paperYear}`);
  }

  return conditions.join(' AND ');

}

/**
 * Take search criteria and return an array of questions
 * @param {SearchCriteria} criteria - The search criteria
 * @returns {Promise<Question[]>} - The promise resolves to the result of the query
 */
function dbGetQuestions(criteria: SearchCriteria): Promise<Question[]> {
  let { subject } = criteria;
  // log all the search criteria
  // if there is no subject, then return an empty array
  if (!subject) return Promise.resolve([]);

  // create the query based on search criteria
  let query = `
    SELECT
        Question.QuestionID AS QuestionID,
        CONCAT(Paper.PaperYear, '-', LevelComponent.ComponentID, '-', SubjectLevel.LevelID) AS PaperCode,
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
        INNER JOIN LevelComponent ON Paper.LevelComponentID = LevelComponent.LevelComponentID
        INNER JOIN SubjectLevel ON LevelComponent.SubjectLevelID = SubjectLevel.SubjectLevelID
    WHERE
        `;

  query += getWhereConditions(criteria);

  // add group by and order by
  query += `
    GROUP BY
    Question.QuestionID,
    Paper.PaperYear,
    Question.QuestionNumber,
    Question.QuestionContents,
    Question.TotalMarks
    ORDER BY
        Question.QuestionID ASC;
    `;

   console.log(query);
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
    INNER JOIN levelComponent lc on p.levelComponentID = lc.levelComponentID
    INNER JOIN subjectLevel sl on lc.subjectLevelID = sl.subjectLevelID
    WHERE sl.subjectID = ${subjectID}
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
    Images.ImageID ASC;
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
      console.log("outputData: ", outputData.images);
      return outputData;
    });
}


/**
 * This function gets the distinct display components for a given subjectID and selected level. Should
 * return an object of components, with the key being the level and the value being an array of the display components
 * for that level.
 * @param {number} subjectID - the subjectID to get the components for
 * @returns {Promise<Components>} - a promise for the results of the query - an object of components, with the key being the level and the value being an array of the display components for that level
 */
function dbGetComponents(subjectID: number): Promise<Components> {

  // @note MAY NEED TO LINK Components together (e.g. component 1 linked to unit 1)
  // Could do with even/odd numbers being checked

  let query = `
  SELECT DISTINCT sl.LevelID, dc.DisplayComponent
  FROM SubjectLevel sl
  JOIN LevelComponent lc ON sl.SubjectLevelID = lc.SubjectLevelID
  JOIN DisplayComponent dc ON lc.DisplayComponentID = dc.DisplayComponentID
  WHERE sl.SubjectID = ?
    `;
    // will return something like:
    /*
+---------+------------------+
| LevelID | DisplayComponent |
+---------+------------------+
| A       | component 1      |
| A       | component 2      |
| AS      | component 1      |
+---------+------------------+
    */

// put the results into an object, with the key being the level and the value being an array of the display components for that level
// for the above example, the object would be:
/*
{
  A: ['component 1', 'component 2'],
  AS: ['component 1']
}
*/
return selectQuery(query, [subjectID])
.then(results => {
  const displayComponentsByLevel: Components = {};
  const allComponents: string[] = [];

  results.forEach((row: any) => {
    const levelID = row.LevelID.toLowerCase();
    const displayComponent = row.DisplayComponent.toLowerCase();

    if (displayComponentsByLevel.hasOwnProperty(levelID)) {
      displayComponentsByLevel[levelID].push(displayComponent);
    } else {
      displayComponentsByLevel[levelID] = [displayComponent];
    }

    if (!allComponents.includes(displayComponent)) {
      allComponents.push(displayComponent);
    }
  });

  displayComponentsByLevel['all'] = allComponents;

  return displayComponentsByLevel;
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


/**
 * Get the maximum number of marks in any question for a given subject ID
 * @param {number} subjectID - the subject ID to get the max marks for
 * @returns {Promise<number>} - a promise for the results of the query - the maximum number of marks in any question
 */
function dbGetMaxMarks(subjectID: number): Promise<number> {
  let query = `
    SELECT
      MAX(TotalMarks) AS maxMarks
    FROM
        Question
    INNER JOIN
        Paper
    ON
        Question.PaperID = Paper.PaperID
    INNER JOIN
        LevelComponent
    ON
        Paper.LevelComponentID = LevelComponent.LevelComponentID
    INNER JOIN
        SubjectLevel
    ON
        LevelComponent.SubjectLevelID = SubjectLevel.SubjectLevelID
    WHERE
        SubjectLevel.SubjectID = ?;
    `;
  return selectQuery(query, [subjectID])
    .then((results) => {
      return results[0].maxMarks;
    })
    .catch((error) => {
      throw error;
    }
    );
}


/**
 * This function gets the images, text and totalmarks, and question ID, for all questions in a given search criteria
 * @param {SearchCriteria} searchCriteria - the search criteria to search for
 * @returns {Promise<SmallOutputData[]>} - a promise for the results of the query - an array of objects containing the images, text and totalmarks, and question ID, for all questions in a given search criteria
 */
async function dbGetExamPaperOutputData(searchCriteria: SearchCriteria): Promise<SmallOutputData[]> {
  let { subject } = searchCriteria;
  // set the min and max marks to 0 and the max marks for the subject respectively rather than the values in the search criteria
  // this is because the min and max marks are specified for the use of the exam paper generator, not for individual questions.
  searchCriteria.minMarks = 0;
  searchCriteria.maxMarks = await dbGetMaxMarks(subject);

  if (!subject) {
    return Promise.reject('No subject specified');
  }
/*
Get the question ID, total marks, question text, markscheme text, and images for all questions in a given search criteria.
The images are returned as a string of the image IDs for the question images, and a string of the image IDs for the markscheme images, separated by commas.
Also the topics for the question are returned as a string of the topic IDs, separated by commas.
*/
  let query = `
  SELECT Question.QuestionID, Question.TotalMarks, Question.QuestionContents, Question.MarkschemeContents, 
  GROUP_CONCAT(DISTINCT i1.ImageID) AS QuestionImages, 
  GROUP_CONCAT(DISTINCT i2.ImageID) AS MarkschemeImages,
  GROUP_CONCAT(DISTINCT QuestionTopic.TopicID) AS TopicIDs
FROM Question
LEFT JOIN images i1 ON Question.QuestionID = i1.QuestionID
LEFT JOIN images i2 ON Question.QuestionID = i2.QuestionID AND i2.IsPartOfMarkscheme = 1
LEFT JOIN QuestionTopic ON Question.QuestionID = QuestionTopic.QuestionID
INNER JOIN Paper ON Question.PaperID = Paper.PaperID
INNER JOIN LevelComponent ON Paper.LevelComponentID = LevelComponent.LevelComponentID
INNER JOIN SubjectLevel ON LevelComponent.SubjectLevelID = SubjectLevel.SubjectLevelID
WHERE
${getWhereConditions(searchCriteria)}
GROUP BY Question.QuestionID;
`;

console.log(query);
  return selectQuery(query, [])
    .then((results) => {
      let outputData: SmallOutputData[] = [];
      results.forEach((row: any) => {
        // split the image IDs into an array
        let questionImages: string[] = [];
        let markschemeImages: string[] = [];
        if (row.QuestionImages) {
          questionImages = row.QuestionImages.split(',');
        }
        if (row.MarkschemeImages) {
          markschemeImages = row.MarkschemeImages.split(',');
        }
        let questionTopics: string[] = [];
        if (row.TopicIDs) {
          questionTopics = row.TopicIDs.split(',');
        }
        outputData.push({
          id: row.QuestionID,
          totalMarks: row.TotalMarks,
          text: {
            questionContents: row.QuestionContents,
            markschemeContents: row.MarkschemeContents
          },
          topics: questionTopics,
          // convert the image IDs to an array of image objects which have id and isMS properties
          images: [
            ...questionImages.map((imageID) => {
              return {
                id: parseInt(imageID),
                isMS: 0
              };
            }),
            ...markschemeImages.map((imageID) => {
              return {
                id: parseInt(imageID),
                isMS: 1
              };
            })
          ]
        });
      });
      return outputData;
    }
    );
}

export { dbGetQuestions, dbGetTopics, dbGetOutputData, dbGetComponents, dbGetLevels , dbGetSubjectName, dbGetMaxMarks, dbGetExamPaperOutputData };
