const args = require('minimist')(process.argv.slice(2));
const Chalk = require('chalk');
const {scrapeForContent} = require('./scraper.js');
const {generateAudioFeed} = require('./marker.js')

/**
 * Process CLI args
 * @return {String} XML representation of podcast/feed-ified resources
 */
const main = async () => {
    if (!args.url || args.url == '') {
        const errorMessage = `No URL supplied: --url ${Chalk.italic('path')}`;
        throw new Error(errorMessage);
    }
    
    const {sourceInfo, foundMedia} = await scrapeForContent(args.url, 'mp3');
    
    const feed = generateAudioFeed(sourceInfo)(foundMedia);
    
    /*
     Echo to stdout, this would ideally support file output through fs, but
     terminal users can redirect to a file for this quick version
     */
    // eslint-disable-next-line no-console
    console.log(feed);
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e));