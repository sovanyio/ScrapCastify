/**
 * Get filename of a given URL
 * @param  {String} url URL pointing to a file
 * @return {String}     Last portion, which should be the filename
 */
const getFilenameFromUrl = url => {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

/**
 * Iterate over an object and convert dates to either JSON or UTC formats as
 * required by the json feed or rss specs
 * @param  {Object} data            Object to iterate over for dates
 * @param  {String} [format='json'] Format to use, defaults to json format, all
 *                                  other values will output a utc string
 * @return {Object}                 Object with 'valid' dates converted
 */
const convertDates = (data, format = 'json') => {
    return Object.keys(data).reduce((object, key) => {
        let value = data[key];
        if (typeof value == 'object') {
            return convertDates(value);
        }

        const timestamp = Date.parse(value);
        if (!isNaN(timestamp)) {
            const date = new Date(timestamp);
            if (format == 'json') {
                value = date.toJSON();
            } else {
                value = date.toUTCString();
            }
        }
        object[key] = value;

        return object;
    }, {});
}

module.exports = {
    getFilenameFromUrl,
    convertDates
}
