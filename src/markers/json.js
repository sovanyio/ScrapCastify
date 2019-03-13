const {getFilenameFromUrl, convertDates} = require('../helpers');
require('../types');

/**
 * Create a basic json feed, ideally this would accept more data from the
 * scraper, but lets just worry about the requirements for now. Also ignoring
 * common podcast metadata (ie. iTunes and Google Play)
 */

/**
 * @typedef {Object} JsonBuilder
 * @property {Function} build    Generate feed content
 * @property {Function} toString Generate string output
 */

/**
 * JSON Feed builder
 * @param  {PageInfo} sourceInfo  Object describing the site
 * @param  {String[]} [assets=[]] Array of asset sources
 * @return {JsonBuilder}          API
 */
const JsonBuilder = (sourceInfo, assets = []) => {
    let builder = {};
    sourceInfo = convertDates(sourceInfo);

    /**
     * Main API call
     * @return {void}
     */
    const build = () => {
        generateHeader();
        generateBody();
        generateBody();
    }

    /**
     * Generate the baseline feed data
     * @return {void}
     */
    const generateHeader = () => {
        builder = {
            ...builder,
            version: 'https://jsonfeed.org/version/1',
            title: sourceInfo.title,
            description: `Audio content of ${sourceInfo.url}`,
            home_page_url: sourceInfo.url
        };
    }

    /**
     * Call array to asset
     * @return {void}
     */
    const generateBody = () => {
        assetArrayToItemFeed();
    }

    /**
     * Iterate over the instance asset array and append appropriate feed data
     * @return {void}
     */
    const assetArrayToItemFeed = () => {
        const items = assets.map(item => {
            const filename = getFilenameFromUrl(item);

            return {
                title: `${filename}`, // Must be string
                url: sourceInfo.url,
                id: item,
                date_modified:
                    sourceInfo.lastModified, // Not perfectly applicable in this context
                content_text:
                    `Found media asset from ${sourceInfo.url}, ${filename}`,
                attachments: [
                    {
                        title: filename,
                        url: item,
                        mime_type: 'audio/mpeg'
                    }
                ],
                tags: [
                    'Podcast' // Assuming this is still useful for json feed
                ]
            };
        });

        builder = {
            ...builder,
            items: items
        }
    }

    /**
     * Return pretty printed json string
     * @return {String}             String of json feed, pretty printed
     */
    const toString = () => {
        return JSON.stringify(builder, null, 2);
    }

    return {
        build: build,
        toString: toString
    };
}

module.exports = {
    default: JsonBuilder,
    JsonBuilder
};
