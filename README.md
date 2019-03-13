# ScrapCastify
Small for-fun utility that will generate a very basic rss-2.0 or json "podcast" feed when pointed at a web document with href links to content.

## Running
* Run a recent verion of node, this project runs on `v10.15.3`
* Install node dependencies
  * `npm i`
* Find a site with relevant links.

  I used [https://ccrma.stanford.edu/~jos/pasp/Sound_Examples.html](https://ccrma.stanford.edu/~jos/pasp/Sound_Examples.html) though any remote document with elements that href content ending with '.mp3' (or any extension given by --type) should work, thank you to Julius Smith for having a great page for this purpose!
* Call the utility with the URL
  * `npm start -- --url path [--format default:json|xml] [--type default:mp3]`

## Saving
There is no built-in save functionality currently, so to save redirect to a file. Note: the `--silent` flag is necessary to prevent node from echo'ing some verbose information into the output.

`npm start --silent -- --url path > demoCastFeed.json`

## Notable References
* [https://validator.w3.org/feed/docs/rss2.html](https://validator.w3.org/feed/docs/rss2.html)
* [https://www.podcast411.com/howto_1.html](https://www.podcast411.com/howto_1.html)
* [https://jsonfeed.org/](https://jsonfeed.org/)
