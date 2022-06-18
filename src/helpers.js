const YouTubeUrlFormatOne = /^https?:\/\/(?:youtu\.be|(?:www\.)?youtube\.com\/embed)\/([\w\-]+)/;
const YouTubeUrlFormatTwo = /^https?:\/\/(?:[\w\-]+\.)*youtube\.com\/(watch|attribution_link)\?([^\#]+)/;

function isYouTubeURL(url) {
    return url.match(YouTubeUrlFormatOne) || url.match(YouTubeUrlFormatTwo);
}

function getQueryData(queryString) {
    var queryData = Object.create(null);

    queryString.split("&").some(function (qpair) {
        qpair = qpair.split("=").map(decodeURIComponent);
        queryData[qpair[0]] = qpair[1];
    });

    return queryData;
}

function getVideoIdFromUrl(url) {
    if (url.match(YouTubeUrlFormatOne)) {
        return RegExp.$1;
    }

    if (url.match(YouTubeUrlFormatTwo)) {
        var page = RegExp.$1;
        var qs = RegExp.$2;

        switch (page) {
            case "watch":
                var q = getQueryData(qs);
                return q.v;
                break;
            case "attribution_link":
                var q1 = getQueryData(qs);

                if (q1.u) {
                    if (q1.u.match(/^\/watch\?([^\#]+)/)) {
                        var q2 = getQueryData(RegExp.$1);
                        return q2.v
                    }
                }
                break;
        }
    }
}