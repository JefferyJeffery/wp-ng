"use strict";angular.module("jtt_aping_wikipedia",["jtt_wikipedia"]).directive("apingWikipedia",["apingWikipediaHelper","apingUtilityHelper","wikipediaFactory",function(t,e,i){return{require:"?aping",restrict:"A",replace:"false",link:function(a,r,n,s){var o=s.getAppSettings();e.parseJsonFromAttributes(n.apingWikipedia,t.getThisPlatformString(),o).forEach(function(e){var a={model:o.model};angular.isDefined(o.getNativeData)?a.getNativeData=o.getNativeData:a.getNativeData=!1;var r={pithumbsize:700};if(angular.isDefined(e.items)?r.gsrlimit=e.items:r.gsrlimit=o.items,0===r.gsrlimit||"0"===r.gsrlimit)return!1;(r.gsrlimit<0||isNaN(r.gsrlimit))&&(r.gsrlimit=void 0),r.gsrlimit>500&&(r.gsrlimit=500),angular.isDefined(e.language)&&(r.lang=e.language),angular.isDefined(e.title)?(r.term=e.title,i.getArticle(r).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))})):angular.isDefined(e.search)&&(r.term=e.search,!angular.isDefined(e.textSearch)||"true"!==e.textSearch&&!0!==e.textSearch?i.searchArticlesByTitle(r).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))}):i.searchArticles(r).then(function(e){e&&s.concatToResults(t.getObjectByJsonData(e,a))}))})}}}]),angular.module("jtt_aping_wikipedia").service("apingWikipediaHelper",["apingModels","apingTimeHelper","apingUtilityHelper",function(t,e,i){this.getThisPlatformString=function(){return"wikipedia"},this.getThisPlatformLink=function(t){return"https://"+t+".wikipedia.org/wiki/"},this.getObjectByJsonData=function(t,e){var i=[];if(t&&t.data&&t.data.query&&t.data.query.pages){var a=this;t.data.query.pages&&angular.forEach(t.data.query.pages,function(t,r){var n;(n=!0===e.getNativeData||"true"===e.getNativeData?t:a.getItemByJsonData(t,e.model))&&i.push(n)})}return i},this.getItemByJsonData=function(t,e){var i={};if(t&&e)switch(e){case"social":i=this.getSocialItemByJsonData(t);break;default:return!1}return i},this.getSocialItemByJsonData=function(a){var r=t.getNew("social",this.getThisPlatformString());return angular.extend(r,{timestamp:e.getTimestampFromDateString(a.touched,1e3,36e5),post_url:a.pagelanguage?this.getThisPlatformLink(a.pagelanguage)+encodeURI(a.title):void 0,intern_id:a.pageid,text:i.getTextFromHtml(a.extract),caption:a.title,img_url:a.thumbnail?a.thumbnail.source:void 0,thumb_url:a.thumbnail?a.thumbnail.source:void 0,native_url:a.thumbnail?a.thumbnail.source:void 0,source:a.extract,position:a.index}),r.date_time=new Date(r.timestamp),r}}]),angular.module("jtt_wikipedia",[]).factory("wikipediaFactory",["$http","wikipediaSearchDataService",function(t,e){var i={};return i.searchArticlesByTitle=function(i){var a=e.getNew("searchArticlesByTitle",i);return t.jsonp(a.url,{method:"GET",params:a.object})},i.searchArticles=function(i){var a=e.getNew("searchArticles",i);return t.jsonp(a.url,{method:"GET",params:a.object})},i.getArticle=function(i){var a=e.getNew("getArticle",i);return t.jsonp(a.url,{method:"GET",params:a.object})},i}]).service("wikipediaSearchDataService",function(){this.getApiBaseUrl=function(t){return"https://"+t+".wikipedia.org/w/api.php"},this.fillDataInObjectByList=function(t,e,i){return angular.forEach(i,function(i,a){angular.isDefined(e[i])&&(t.object[i]=e[i])}),t},this.getNew=function(t,e){var i={object:{callback:"JSON_CALLBACK",action:"query",format:"json",formatversion:2},url:""};switch(angular.isUndefined(e.lang)&&(e.lang="en"),angular.isUndefined(e.pithumbsize)&&(e.pithumbsize="400"),t){case"searchArticlesByTitle":i.object.prop="extracts|pageimages|info",i.object.generator="search",i.object.gsrsearch="intitle:"+e.term,i.object.pilimit="max",i.object.exlimit="max",i.object.exintro="",i=this.fillDataInObjectByList(i,e,["prop","generator","gsrsearch","pilimit","exlimit","exintro","rvparse","formatversion","prop","pithumbsize","gsrlimit"]),i.url=this.getApiBaseUrl(e.lang);break;case"searchArticles":i.object.prop="extracts|pageimages|info",i.object.generator="search",i.object.gsrsearch=e.term,i.object.pilimit="max",i.object.exlimit="max",i.object.exintro="",i=this.fillDataInObjectByList(i,e,["prop","generator","gsrsearch","pilimit","exlimit","exintro","rvparse","formatversion","prop","pithumbsize","gsrlimit"]),i.url=this.getApiBaseUrl(e.lang);break;case"getArticle":i.object.prop="extracts|pageimages|images|info",i.object.titles=e.term,i=this.fillDataInObjectByList(i,e,["prop","rvparse","formatversion","prop","pithumbsize"]),i.url=this.getApiBaseUrl(e.lang)}return i}});