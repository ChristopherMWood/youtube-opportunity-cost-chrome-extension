chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: '.youtube.com', schemes: ['https'] }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowAction() ]
      }
      ]);
  });
});

// chrome.webNavigation.onCompleted.addListener(function() {
//   console.log("This is my favorite website!");
// }, {url: [{urlMatches : 'https://www.youtube.com/'}]});

// chrome.webNavigation.onCompleted.addListener(function (tabId, changeInfo, tab) {
//   const url = tab.url; //TODO: make sure URL is present and not pending as future change

//   if (isYouTubeURL(url) && changeInfo.status == 'complete' && tab.active) {
//       const videoId = getVideoIdFromUrl(url);

//       if (videoId !== null && videoId !== undefined) {
//         //CHECK IF CACHED and IF NOT EXPIRED
//         const requestData = true;

//         if (requestData) {
//           getOpportunityCost(videoId, (data) => {
//             const storageData = {
//               data: data,
//               cacheExpiration: getCacheExpirationTime(5)
//             };

//             chrome.storage.local.set({[videoId]: storageData}, function() {
//               console.log(storageData);
//             });
//           });
//         }
//       }
//   }
// })

// function getCacheExpirationTime(minutes) {
//   var currentDate = new Date();
//   var currentDateSeconds = currentDate.getTime();
//   var expirationMinutes = 60 * minutes;
//   return new Date(currentDateSeconds + expirationMinutes);
// }

// function getOpportunityCost(videoId, callback) {
//   const url = 'https://christopherwood.dev/api/opportunitycost/' + videoId;

//   fetch(url).then(function (response) {
//       response.json().then((json) => {
//           callback(json);
//       });
//   }).catch(function (err) {
//       callback(err);
//   });
// }

// const YouTubeUrlFormatOne = /^https?:\/\/(?:youtu\.be|(?:www\.)?youtube\.com\/embed)\/([\w\-]+)/;
// const YouTubeUrlFormatTwo = /^https?:\/\/(?:[\w\-]+\.)*youtube\.com\/(watch|attribution_link)\?([^\#]+)/;

// function isYouTubeURL(url) {
//     return url.match(YouTubeUrlFormatOne) || url.match(YouTubeUrlFormatTwo);
// }

// function getQueryData(queryString) {
//     var queryData = Object.create(null);

//     queryString.split("&").some(function (qpair) {
//         qpair = qpair.split("=").map(decodeURIComponent);
//         queryData[qpair[0]] = qpair[1];
//     });

//     return queryData;
// }

// function getVideoIdFromUrl(url) {
//     if (url.match(YouTubeUrlFormatOne)) {
//         return RegExp.$1;
//     }

//     if (url.match(YouTubeUrlFormatTwo)) {
//         var page = RegExp.$1;
//         var qs = RegExp.$2;

//         switch (page) {
//             case "watch":
//                 var q = getQueryData(qs);
//                 return q.v;
//                 break;
//             case "attribution_link":
//                 var q1 = getQueryData(qs);

//                 if (q1.u) {
//                     if (q1.u.match(/^\/watch\?([^\#]+)/)) {
//                         var q2 = getQueryData(RegExp.$1);
//                         return q2.v
//                     }
//                 }
//                 break;
//         }
//     }
// }