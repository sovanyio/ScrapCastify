# ScrapCastify
Small for-fun utility that will generate a very basic rss-2.0 "podcast" feed when pointed at a web document with href links to mp3 content.

## Running
* Run a recent verion of node, this project runs on `v11.10.1`
* Install node dependencies
  * `npm i`
* Find a site with relevant links.

  I used [https://ccrma.stanford.edu/~jos/pasp/Sound_Examples.html](https://ccrma.stanford.edu/~jos/pasp/Sound_Examples.html) though any remote document with elements that href content ending with '.mp3' should work, thank you to Julius Smith for having a great page for this purpose!
* Call the utility with the URL
  * `npm start -- --url path`

## Saving
There is no built-in save functionality currently, so to save redirect to a file. Note: the `--silent` flag is necessary to prevent node from echo'ing some verbose information into the output.

`npm start --silent -- --url path > demoCastFeed.xml`

## Notable References
* [https://validator.w3.org/feed/docs/rss2.html](https://validator.w3.org/feed/docs/rss2.html)
* [https://www.podcast411.com/howto_1.html](https://www.podcast411.com/howto_1.html)