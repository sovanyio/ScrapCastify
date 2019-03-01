const request = require('request-promise-native');
const cheerio = require('cheerio');

/* 
  An alternate version of this scraper would use puppeteer to evaluate js
  and traverse the DOM instead of using regex, but this will do for basic sites
*/

/**
 * Fetch the remote resource, fails if status !== 200
 * @async
 * @param  {string}  url URL of remote resource
 * @return {Promise}     Promise resolving to the complete returned response
 */
const getTarget = async url => {
    const options = {
        uri: url,
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
 * This could probably be done easily with cheerio, but this is more fun :)
 * @param  {String} body          String representation of response.body
 * @param  {String} extension     Extension to match against
 * @return {Array}                Array of matched resources of type
 */
const grepLinksByExtension = body => extension => {
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
 * @typedef {Object} PageInfo
 * @property {String} lastModified Last Modified header data from response
 * @property {String} url          Original request URL
 * @property {String} title        Parsed html title
 */

/**
 * Get some base page data that is helpful when generating RSS XML
 * @param  {String} url URL of the original request
 * @return {PageInfo}   Page metadata
 */
const getPageMetadata = url => response => {
    // I was trying to avoid doing this, but lets not make grabbing the title crazy
    const $ = cheerio.load(response.body);
    
    return {
        lastModified: response.headers['last-modified'] || '',
        url: url,
        title: $('title', 'head').text()
    }
}

/**
 * Fetch remote content and return foundn resources matching the given extension
 * @async
 * @param  {String}  uri                URI of remote resource document
 * @param  {String}  [scrapeType='mp3'] Extension to search the resource for
 * @return {Array}                      Array of matched resources of type
 */
const scrapeForContent = async (url, scrapeType = 'mp3') => {
    let response;
    try {
        response = await getTarget(url);
        return {
            sourceInfo: getPageMetadata(url)(response),
            foundMedia: grepLinksByExtension(response.body)(scrapeType)
        }
    } catch(e) {
        throw new Error(e);
    }
}

module.exports = {
    scrapeForContent
};