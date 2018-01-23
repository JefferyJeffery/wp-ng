"use strict";angular.module("jtt_aping_youtube",["jtt_youtube"]).directive("apingYoutube",["youtubeFactory","apingYoutubeHelper","apingUtilityHelper",function(e,t,i){return{require:"?aping",restrict:"A",replace:"false",link:function(n,a,o,s){var r=s.getAppSettings();i.parseJsonFromAttributes(o.apingYoutube,t.getThisPlatformString(),r).forEach(function(n){var a={model:r.model};void 0!==r.getNativeData?a.getNativeData=r.getNativeData:a.getNativeData=!1;var o={key:i.getApiCredentials(t.getThisPlatformString(),"apiKey")};if(void 0!==n.items?o.maxResults=n.items:o.maxResults=r.items,0===o.maxResults||"0"===o.maxResults)return!1;if((o.maxResults<0||isNaN(o.maxResults))&&(o.maxResults=void 0),o.maxResults>50&&(o.maxResults=50),n.videoId)o.videoId=n.videoId,e.getVideoById(o).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))});else if(n.channelId){if(o.channelId=n.channelId,n.search&&(o.q=n.search),n.order)if("$RANDOM"===n.order){var d=["date","rating","relevance","title","videoCount","viewCount"];o.order=d[Math.floor(Math.random()*d.length)]}else o.order=n.order;e.getVideosFromChannelById(o).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))})}else if(n.search||n.lat&&n.lng){if(n.order)if("$RANDOM"===n.order){var d=["date","rating","relevance","title","videoCount","viewCount"];o.order=d[Math.floor(Math.random()*d.length)]}else o.order=n.order;n.search&&(o.q=n.search),n.lat&&n.lng&&(o.location=n.lat+","+n.lng),n.distance&&(o.locationRadius=n.distance),e.getVideosFromSearchByParams(o).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))})}else n.playlistId&&(o.playlistId=n.playlistId,e.getVideosFromPlaylistById(o).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))}))})}}}]),angular.module("jtt_aping_youtube").service("apingYoutubeHelper",["apingModels","apingTimeHelper","apingUtilityHelper",function(e,t,i){this.getThisPlatformString=function(){return"youtube"},this.getThisPlatformLink=function(){return"https://www.youtube.com/"},this.convertYoutubeDurationToSeconds=function(e){var t=e.match(/\d+/g);return e.indexOf("M")>=0&&-1==e.indexOf("H")&&-1==e.indexOf("S")&&(t=[0,t[0],0]),e.indexOf("H")>=0&&-1==e.indexOf("M")&&(t=[t[0],0,t[1]]),e.indexOf("H")>=0&&-1==e.indexOf("M")&&-1==e.indexOf("S")&&(t=[t[0],0,0]),e=0,3==t.length&&(e+=3600*parseInt(t[0]),e+=60*parseInt(t[1]),e+=parseInt(t[2])),2==t.length&&(e+=60*parseInt(t[0]),e+=parseInt(t[1])),1==t.length&&(e+=parseInt(t[0])),e},this.getYoutubeIdFromUrl=function(e){var t=/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;return e.match(t)[1]||!1},this.getYoutubeImageFromId=function(e,t){switch(t){case"default":case"maxresdefault":case"mqdefault":case"sddefault":return"https://img.youtube.com/vi/"+e+"/"+t+".jpg";case"hqdefault":default:return"https://img.youtube.com/vi/"+e+"/hqdefault.jpg"}},this.getObjectByJsonData=function(e,t){var i=[];if(e&&e.data){var n=this;e.data.items&&angular.forEach(e.data.items,function(e,a){var o;(o=!0===t.getNativeData||"true"===t.getNativeData?e:n.getItemByJsonData(e,t.model))&&i.push(o)})}return i},this.getItemByJsonData=function(e,t){var i={};if(e&&t)switch(t){case"social":i=this.getSocialItemByJsonData(e);break;case"video":i=this.getVideoItemByJsonData(e);break;default:return!1}return i},this.getSocialItemByJsonData=function(i){var n=e.getNew("social","youtube");return angular.extend(n,{blog_name:i.snippet.channelTitle||void 0,blog_id:i.snippet.channelId||void 0,blog_link:this.getThisPlatformLink()+"channel/"+i.snippet.channelId,intern_type:i.id.kind,intern_id:i.id.videoId||(i.snippet.resourceId&&i.snippet.resourceId.videoId?i.snippet.resourceId.videoId:i.id),timestamp:t.getTimestampFromDateString(i.snippet.publishedAt,1e3,7200)}),n.date_time=new Date(n.timestamp),""!==i.snippet.title&&""!==i.snippet.description?(n.caption=i.snippet.title,n.text=i.snippet.description):""!==i.snippet.title?n.caption=i.snippet.title:n.caption=i.snippet.description,"youtube#video"==i.id.kind?n.type="video":"youtube#playlistItem"==i.kind&&i.snippet.resourceId&&"youtube#video"==i.snippet.resourceId.kind&&(n.type="video",n.position=i.snippet.position),n.source='<iframe width="1280" height="720" src="https://www.youtube.com/embed/'+n.intern_id+'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>',n.img_url=this.getYoutubeImageFromId(n.intern_id),n.thumb_url=this.getYoutubeImageFromId(n.intern_id,"default"),n.native_url=this.getYoutubeImageFromId(n.intern_id),n.post_url=this.getThisPlatformLink()+"watch?v="+n.intern_id,i.statistics&&(i.statistics.commentCount&&i.statistics.commentCount>0&&(n.comments=i.statistics.commentCount),i.statistics.likeCount&&i.statistics.likeCount>0&&(n.likes=i.statistics.likeCount)),n},this.getVideoItemByJsonData=function(i){var n=e.getNew("video","youtube");return angular.extend(n,{blog_name:i.snippet.channelTitle||void 0,blog_id:i.snippet.channelId||void 0,blog_link:this.getThisPlatformLink()+"channel/"+i.snippet.channelId,intern_type:i.id.kind,intern_id:i.id.videoId||(i.snippet.resourceId&&i.snippet.resourceId.videoId?i.snippet.resourceId.videoId:i.id),timestamp:t.getTimestampFromDateString(i.snippet.publishedAt,1e3,7200)}),n.date_time=new Date(n.timestamp),""!==i.snippet.title&&""!==i.snippet.description?(n.caption=i.snippet.title,n.text=i.snippet.description):""!==i.snippet.title?n.caption=i.snippet.title:n.caption=i.snippet.description,n.img_url=this.getYoutubeImageFromId(n.intern_id),n.thumb_url=this.getYoutubeImageFromId(n.intern_id,"default"),n.native_url=this.getYoutubeImageFromId(n.intern_id),n.post_url=this.getThisPlatformLink()+"watch?v="+n.intern_id,n.position=i.snippet.position,n.markup='<iframe width="1280" height="720" src="https://www.youtube.com/embed/'+n.intern_id+'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>',i.statistics&&(i.statistics.commentCount&&i.statistics.commentCount>0&&(n.comments=i.statistics.commentCount),i.statistics.likeCount&&i.statistics.likeCount>0&&(n.likes=i.statistics.likeCount)),i.contentDetails&&i.contentDetails.duration&&(n.duration=this.convertYoutubeDurationToSeconds(i.contentDetails.duration)),n}}]),angular.module("jtt_youtube",[]).factory("youtubeFactory",["$http","youtubeSearchDataService",function(e,t){var i={};return i.getVideosFromChannelById=function(i){var n=t.getNew("videosFromChannelById",i);return e({method:"GET",url:n.url,params:n.object})},i.getVideosFromSearchByParams=function(i){var n=t.getNew("videosFromSearchByParams",i);return e({method:"GET",url:n.url,params:n.object})},i.getVideosFromPlaylistById=function(i){var n=t.getNew("videosFromPlaylistById",i);return e({method:"GET",url:n.url,params:n.object})},i.getChannelById=function(i){var n=t.getNew("channelById",i);return e({method:"GET",url:n.url,params:n.object})},i.getVideoById=function(i){var n=t.getNew("videoById",i);return e({method:"GET",url:n.url,params:n.object})},i}]).service("youtubeSearchDataService",function(){this.getApiBaseUrl=function(e){return"https://content.googleapis.com/youtube/v3/"},this.fillDataInObjectByList=function(e,t,i){return angular.forEach(i,function(i,n){void 0!==i&&i.constructor===Array?angular.isDefined(t[i[0]])?e.object[i[0]]=t[i[0]]:e.object[i[0]]=i[1]:angular.isDefined(t[i])&&(e.object[i]=t[i])}),e},this.getNew=function(e,t){var i={object:{key:t.key},url:""};switch(e){case"videosFromChannelById":i=this.fillDataInObjectByList(i,t,[["part","id,snippet"],["type","video"],["order","date"],["videoEmbeddable",!0],"channelId","q","maxResults","publishedAfter","publishedBefore","regionCode","relevanceLanguage","safeSearch","videoLicense","videoSyndicated","fields"]),i.url=this.getApiBaseUrl()+"search?",(t.nextPageToken||t.prevPageToken)&&(i.url+="pageToken="+(t.nextPageToken||t.prevPageToken)+"&");break;case"videosFromSearchByParams":i=this.fillDataInObjectByList(i,t,[["part","id,snippet"],["type","video"],["order","date"],["videoEmbeddable",!0],"location","q","maxResults","publishedAfter","publishedBefore","regionCode","relevanceLanguage","safeSearch","videoLicense","videoSyndicated","fields"]),angular.isDefined(t.locationRadius)?i.object.locationRadius=t.locationRadius:angular.isDefined(t.location)&&(i.object.locationRadius="5000m"),i.url=this.getApiBaseUrl()+"search?",(t.nextPageToken||t.prevPageToken)&&(i.url+="pageToken="+(t.nextPageToken||t.prevPageToken)+"&");break;case"videosFromPlaylistById":i=this.fillDataInObjectByList(i,t,[["part","id,snippet"],["type","video"],"playlistId","maxResults","fields"]),i.url=this.getApiBaseUrl()+"playlistItems?",(t.nextPageToken||t.prevPageToken)&&(i.url+="pageToken="+(t.nextPageToken||t.prevPageToken)+"&");break;case"videoById":i=this.fillDataInObjectByList(i,t,[["part","id,snippet,contentDetails,statistics"]]),i.object.id=t.videoId,i.url=this.getApiBaseUrl()+"videos?",(t.nextPageToken||t.prevPageToken)&&(i.url+="pageToken="+(t.nextPageToken||t.prevPageToken)+"&");break;case"channelById":i=this.fillDataInObjectByList(i,t,[["part","id,snippet"],["type","channel"]]),i.url=this.getApiBaseUrl()+"search?",(t.nextPageToken||t.prevPageToken)&&(i.url+="pageToken="+(t.nextPageToken||t.prevPageToken)+"&")}return i}});