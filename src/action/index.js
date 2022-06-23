document.addEventListener("DOMContentLoaded", function(event) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;

        if (isYouTubeURL(activeTab.url)) {
            document.getElementById("content").style.display = "block";
            const videoId = getVideoIdFromUrl(activeTab.url);

            chrome.storage.local.get([videoId], function(result) {
                setValuesInUI(result[videoId].data);
                document.getElementById("site_link").href = "https://opportunitycost.life?v=" + videoId;
            });
        } else {
            document.getElementById("no-content").style.display = "block";
        }
     });
});

function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}

function getLivesLost(data) {
    const averageLifeSpanInYears = 73.2;
    const yearsWatched = data.totalSeconds/31557600
    const averageLivesLost =  yearsWatched/averageLifeSpanInYears;
    const precision = averageLivesLost > 1 ? 2 : 4;
    return roundUp(averageLivesLost, precision);
}

function getYearsLostString(data) {
    const yearsWatched = data.totalSeconds/31557600

    if (yearsWatched > 1000) {
        return getShortFormatString(yearsWatched);
    }

    const precision = yearsWatched > 1 ? 2 : 4;
    return String(roundUp(yearsWatched, precision));
}

function getCollegeEducationsString(data) {
    const yearsWatched = data.totalSeconds/31557600;
    const collegeEducations = yearsWatched/4;

    if (collegeEducations > 1000) {
        return getShortFormatString(collegeEducations);
    }

    const precision = collegeEducations > 1 ? 2 : 4;
    return String(roundUp(collegeEducations, precision));
}

function getWeekendsString(data) {
    const weekendsWatched = data.totalSeconds/(86400 * 2);

    if (weekendsWatched > 1000) {
        return getShortFormatString(weekendsWatched);
    }

    const precision = weekendsWatched > 1 ? 2 : 4;
    return String(roundUp(weekendsWatched, precision));
}

function getShortFormatString(value) {
    if (value > 1000000) {
        const millions = value/1000000;
        const milResults = millions + (value - (millions * 1000000));
        return String(roundUp(milResults, 2) + 'mil');
    } else if (value > 1000) {
        const thousands = value/1000;
        const kResults = thousands + (value - (thousands * 1000));
        return String(roundUp(kResults, 1) + 'k');
    }

    return String(value);
}

function setValuesInUI(data) {
    document.getElementById("lives-spent-digit").innerHTML = getLivesLost(data);
    document.getElementById("years-spent-digit").innerHTML = getYearsLostString(data);
    document.getElementById("college-educations-spent-digit").innerHTML = getCollegeEducationsString(data);
    document.getElementById("weekends-spent-digit").innerHTML = getWeekendsString(data);
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