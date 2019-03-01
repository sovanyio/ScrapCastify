const builder = require('xmlbuilder');
const Chalk = require('chalk');

/**
 * Create a basic RSS 2.0 document, ideally this would accept more data from the
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
 * @return {String}                         String representation of the xml
 *                                          feed
 */
const generateAudioFeed = sourceInfo => assets => {
    if (!Array.isArray(assets)) {
        const error = `Passed ${Chalk.italic('assets')} is not an array!`;
        throw new Error(error);
    }
    
    let feedBuilder = getFeedHeader(sourceInfo);
    feedBuilder = assetArrayToItemFeed(feedBuilder)(sourceInfo)(assets);
    const feedString = getFeedFooter(feedBuilder);
    
    return feedString;
};

/**
 * Generate the baseline rss feed
 * @param  {Object} sourceInfo              Object describing the site
 * @param  {String} sourceInfo.lastModified Last Modified time taken from 
 *                                          response header
 * @param  {String} sourceInfo.url          The original requested URL
 * @param  {String} sourceInfo.title        The parsed out title of the 
 *                                          retrieved document
 * @return {xmlbuilder}                     Working xmlbuilder object
 */
const getFeedHeader = sourceInfo => {
    return builder.create('rss', {
            version: '1.0',
            encoding: 'UTF-8'
        }).attribute('version', '2.0')
            .element('channel')
                .element('title').text(sourceInfo.title).up()
                .element('link').text(sourceInfo.url).up()
                .element('description')
                    .text(`Audio content of ${sourceInfo.url}`).up()
                .element('pubDate').text(sourceInfo.lastModified).up();
};

/**
 * Ends the xmlbuilder and returns the xml representation pretty printed
 * @param  {xmlbuilder} builder Working xmlbuilder object
 * @return {String}             String of podcast rss data
 */
const getFeedFooter = builder => {
    return builder.end({
        pretty: true,
        indent: '  ',
        newline: '\n',
        allowEmpty: false,
        spacebeforespace: ' '
    });
};

/**
 * Iterate over a given asset array and append appropriate podcast-style data
 * to the working xmlbuilder document
 * @param {xmlbuilder} builder                 Working xmlbuilder object
 * @param {Object}     sourceInfo              Object describing the site
 * @param {String}     sourceInfo.lastModified Last Modified time taken from 
 *                                             response header
 * @param {String}     sourceInfo.url          The original requested URL
 * @param {String}     sourceInfo.title        The parsed out title of the 
 *                                             retrieved document
 * @param {Array}      assets                  Array of assets from scraper
 */
const assetArrayToItemFeed = builder => sourceInfo => assets => {
    return assets.reduce((xmlBuilder, asset) => {
        const filename = getFilenameFromUrl(asset);
        
        xmlBuilder.element('item')
            .element('title').text(filename).up()
            .element('link').text(sourceInfo.url).up()
            .element('guid').text(asset).up()
            .element('description')
                .text(`Found media asset from ${sourceInfo.url}, ${filename}`)
                .up()
            .element('enclosure')
                .attribute('url', asset)
                .attribute('length', 1024000000) // Fake value for now
                .attribute('type', 'audio/mpeg').up()
            .element('category')
                .text('Podcast')
        .up();
        
        return xmlBuilder;
    }, builder);
}

/**
 * Get filename of a given URL
 * @param  {String} url URL pointing to a file
 * @return {String}     Last portion, which should be the filename
 */
const getFilenameFromUrl = url => {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

module.exports = {
    generateAudioFeed
};