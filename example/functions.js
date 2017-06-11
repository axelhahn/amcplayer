
/**
 * get query parameters from url as object
 * @returns {object}
 */
function getQueryParams() {
    qs = document.location.search.split('+').join(' ');

    var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
