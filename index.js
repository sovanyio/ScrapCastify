const args = require('minimist')(process.argv.slice(2));
const Chalk = require('chalk');
const {scrapeForContent} = require('./scraper.js');

/**
 * Process CLI args
 * @return {String} XML representation of podcast/feed-ified resources
 */
const main = async () => {
    if (!args.uri) {
        const errorMessage = `No URI supplied: --uri ${Chalk.italic('path')}`;
        throw new Error(errorMessage);
    }
    
    await scrapeForContent(args.uri, 'mp3');
}

main();