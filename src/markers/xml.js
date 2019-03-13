const builder = require('xmlbuilder');
const {getFilenameFromUrl, convertDates} = require('../helpers');
require('../types');

/**
 * Create a basic RSS 2.0 document, ideally this would accept more data from the
 * scraper, but lets just worry about the requirements for now. Also ignoring
 * common podcast metadata (ie. iTunes and Google Play)
 */

class XmlBuilder {
    /**
     * [constructor description]
     * @param  {PageInfo} sourceInfo  Object describing the site
     * @param  {String[]} [assets=[]] Array of asset sources
     */
    constructor(sourceInfo, assets = []) {
        this.builder = builder.create('rss', {
            version: '1.0',
            encoding: 'UTF-8'
        });
        this.sourceInfo = convertDates(sourceInfo, 'utc');
        this.assets = assets;
    }

    /**
     * Main API call
     * @return {void}
     */
    build() {
        this.generateHeader();
        this.generateBody();
        this.generateBody();
    }

    /**
     * Generate the baseline rss feed
     * @return {void}
     */
    generateHeader() {
        this.builder = this.builder.attribute('version', '2.0')
            .element('channel')
                .element('title').text(this.sourceInfo.title).up()
                .element('link').text(this.sourceInfo.url).up()
                .element('description')
                    .text(`Audio content of ${this.sourceInfo.url}`).up()
                .element('pubDate').text(this.sourceInfo.lastModified).up();
    }

    generateBody() {
        this.assetArrayToItemFeed();
    }

    /**
     * Iterate over a given asset array and append appropriate podcast-style data
     * to the working xmlbuilder document
     * @return {void}
     */
    assetArrayToItemFeed() {
        this.builder = this.assets.reduce((xmlBuilder, asset) => {
            const filename = getFilenameFromUrl(asset);

            xmlBuilder.element('item')
                .element('title').text(filename).up()
                .element('link').text(this.sourceInfo.url).up()
                .element('guid').text(asset).up()
                .element('description')
                    .text(`Found media asset from ${this.sourceInfo.url}, ${filename}`)
                    .up()
                .element('enclosure')
                    .attribute('url', asset)
                    .attribute('length', 1024000000) // Fake value for now
                    .attribute('type', 'audio/mpeg').up()
                .element('category')
                    .text('Podcast')
            .up();

            return xmlBuilder;
        }, this.builder);
    }

    /**
     * Ends the xmlbuilder and returns the xml representation pretty printed
     * @return {String}             String of podcast rss data, pretty printed
     */
    toString() {
        return this.builder.end({
            pretty: true,
            indent: '  ',
            newline: '\n',
            allowEmpty: false,
            spacebeforespace: ' '
        });
    }
}

module.exports = {
    default: XmlBuilder,
    XmlBuilder
};
