const Chalk = require('chalk');
const XmlFeed = require('./markers/xml').default;
const JsonFeed = require('./markers/json').default;
let builder;

/**
 * Create a basic document, ideally this would accept more data from the
 * scraper, but lets just worry about the requirements for now. Also ignoring
 * common podcast metadata (ie. iTunes and Google Play)
 */

/**
 * Generate an rss 2.0 podcast feed from the given information
 * @param  {Object} sourceInfo              Object describing the site
 * @param  {String} sourceInfo.lastModified Last Modified time taken from
 *                                          response header
 * @param  {String} sourceInfo.url          The original requested URL
 * @param  {String} sourceInfo.title        The parsed out title of the
 *                                          retrieved document
 * @param  {Array}  assets                  Array of assets from scraper
 * @param  {String} format                  'xml' or 'json' output
 * @return {String}                         String representation of the xml
 *                                          feed
 */
const generateAudioFeed = sourceInfo => assets => format => {
    if (!Array.isArray(assets)) {
        const error = `Passed ${Chalk.italic('assets')} is not an array!`;
        throw new Error(error);
    }

    builder = format == 'json' ?
        JsonFeed(sourceInfo, assets) :
        new XmlFeed(sourceInfo, assets);

    builder.build();

    return builder.toString();
};

module.exports = {
    generateAudioFeed
};
