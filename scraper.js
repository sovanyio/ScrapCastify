const request = require('request-promise-native');

/* 
  An alternate version of this scraper would use puppeteer to evaluate js
  and traverse the DOM instead of using regex, but this will do for basic sites
*/

/**
 * Fetch the remote resource, fails if status !== 200
 * @async
 * @param  {string}  uri URI of remote resource
 * @return {Promise}     Promise resolving to the complete returned response
 */
const getTarget = async uri => {
    const options = {
        uri: uri,
        resolveWithFullResponse: true
    };
    
    return new Promise(async (resolve, reject) => {
        try {
            const response = await request(options);
            
            // This should probably also check the mime type of the response
            if (response.statusCode === 200) {
                resolve(response);
            }
            
            const error = `Server returned ${response.statusCode} status`;
            reject(error, response);
        } catch(e) {
            reject(e);
        }
    });
}

/**
 * Grep out href content that matches a given extension
 * @param  {String} body          String representation of response.body
 * @param  {String} extension     Extension to match against
 * @return {Array}                Array of matched resources of type
 */
const grepLinksByExtension = (body, extension) => {
    // Create case-insensitive global regex
    const elementHrefRegex = `href\\s*?=\\s*?['"](.+?\\.${extension})['"]`;
    const regex = new RegExp(elementHrefRegex, 'ig');

    // Since we used a global regex, we can't use the nice .match output
    // So construct an array of the matches basec on .exec instead of making
    // a functional call
    let allResults = [], results;
    while ((results = regex.exec(body)) !== null) {
        allResults.push(results[1]);
    }
    return allResults;
}

/**
 * Fetch remote content and return foundn resources matching the given extension
 * @async
 * @param  {String}  uri                URI of remote resource document
 * @param  {String}  [scrapeType='mp3'] Extension to search the resource for
 * @return {Array}                      Array of matched resources of type
 */
const scrapeForContent = async (uri, scrapeType = 'mp3') => {
    let response;
    try {
        response = await getTarget(uri);
        return grepLinksByExtension(response.body, scrapeType);
    } catch(e) {
        throw new Error(e);
    }
}

module.exports = {
    scrapeForContent
};