document.addEventListener("DOMContentLoaded", function(event) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        if (isYouTubeURL(activeTab.url)) {
            const videoId = getVideoIdFromUrl(activeTab.url);

            chrome.storage.local.get([videoId], function(result) {
                // alert('Value currently is ' + JSON.stringify(result[videoId].data));
                setValuesInUI(result[videoId].data);
            });
        }

     });
     
});

function setValuesInUI(data) {
    const averageLifeSpanInYears = 73.2;
    const yearsWatched = data.totalSeconds/31557600
    const averageLivesLost =  yearsWatched/averageLifeSpanInYears;

    document.getElementById("lives_lost").innerHTML = averageLivesLost;
}

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