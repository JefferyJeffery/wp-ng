"use strict";angular.module("jtt_aping_dailymotion",["jtt_dailymotion"]).directive("apingDailymotion",["apingDailymotionHelper","apingUtilityHelper","dailymotionFactory",function(t,e,i){return{require:"?aping",restrict:"A",replace:"false",link:function(a,r,o,n){var l=n.getAppSettings();e.parseJsonFromAttributes(o.apingDailymotion,t.getThisPlattformString(),l).forEach(function(e){var a={model:l.model};angular.isDefined(l.getNativeData)?a.getNativeData=l.getNativeData:a.getNativeData=!1,"http"===e.protocol||"https"===e.protocol?a.protocol=e.protocol+"://":"http"===l.protocol||"https"===l.protocol?a.protocol=l.protocol+"://":a.protocol="//";var r={};if(angular.isDefined(e.items)?r.limit=e.items:r.limit=l.items,0===r.limit||"0"===r.limit)return!1;(r.limit<0||isNaN(r.limit))&&(r.limit=void 0),r.limit>100&&(r.limit=100),angular.isDefined(e.search)&&(r.search=e.search),angular.isDefined(e.tags)&&(r.tags=e.tags),e.userId?(r.id=e.userId,r.sort="recent",angular.isDefined(e.channelId)&&(r.channel=e.channelId),i.getVideosFromUserById(r).then(function(e){e&&n.concatToResults(t.getObjectByJsonData(e,a))})):e.channelId?(r.id=e.channelId,r.sort="recent",i.getVideosFromChannelById(r).then(function(e){e&&n.concatToResults(t.getObjectByJsonData(e,a))})):e.playlistId?(r.id=e.playlistId,r.sort="recent",i.getVideosFromPlaylistById(r).then(function(e){e&&n.concatToResults(t.getObjectByJsonData(e,a))})):(angular.isDefined(e.genre)&&(r.genre=e.genre),angular.isDefined(e.country)&&(r.country=e.country),angular.isDefined(e.language)&&(r.detected_language=e.language),i.getVideosByParams(r).then(function(e){e&&n.concatToResults(t.getObjectByJsonData(e,a))}))})}}}]),angular.module("jtt_aping_dailymotion").service("apingDailymotionHelper",["apingModels","apingTimeHelper","apingUtilityHelper",function(t,e,i){this.getThisPlattformString=function(){return"dailymotion"},this.getThisPlatformLink=function(){return"https://dailymotion.com/"},this.getObjectByJsonData=function(t,e){var i=[];if(t){var a=this;t&&angular.forEach(t.data.list,function(t,r){var o;(o=!0===e.getNativeData||"true"===e.getNativeData?t:a.getItemByJsonData(t,e))&&i.push(o)})}return i},this.getItemByJsonData=function(t,e){var i={};if(t&&e.model)switch(e.model){case"social":i=this.getSocialItemByJsonData(t);break;case"video":i=this.getVideoItemByJsonData(t,e);break;default:return!1}return i},this.getSocialItemByJsonData=function(e){var a=t.getNew("social",this.getThisPlattformString());return angular.extend(a,{blog_name:e["owner.screenname"]||void 0,blog_id:e["owner.id"]||void 0,blog_link:e["owner.url"]||void 0,type:e.item_type||e.media_type||void 0,timestamp:1e3*e.created_time,source:e.embed_html||void 0,post_url:e.url,intern_id:e.id,text:i.getTextFromHtml(e.description),caption:e.title,img_url:e.thumbnail_720_url,thumb_url:e.thumbnail_240_url,native_url:e.thumbnail_url,likes:e.bookmarks_total,comments:e.comments_total}),a.date_time=new Date(a.timestamp),a},this.getVideoItemByJsonData=function(e,a){var r=t.getNew("video",this.getThisPlattformString());return angular.extend(r,{blog_name:e["owner.screenname"]||void 0,blog_id:e["owner.id"]||void 0,blog_link:e["owner.url"]||void 0,type:e.item_type||e.media_type||void 0,timestamp:1e3*e.created_time,markup:e.embed_html||void 0,post_url:e.url,intern_id:e.id,text:i.getTextFromHtml(e.description),caption:e.title,img_url:e.thumbnail_720_url,thumb_url:e.thumbnail_240_url,native_url:e.thumbnail_url,likes:e.bookmarks_total,comments:e.comments_total,duration:e.duration}),a.protocol&&(r.markup=r.markup.replace('src="//','src="'+a.protocol)),r.date_time=new Date(r.timestamp),r}}]),angular.module("jtt_dailymotion",[]).factory("dailymotionFactory",["$http","dailymotionSearchDataService",function(t,e){var i={};return i.getVideosFromUserById=function(i){if(!i.id)return!1;var a=e.getNew("videosFromUserById",i);return t({method:"GET",url:a.url,params:a.object})},i.getVideosFromChannelById=function(i){if(!i.id)return!1;var a=e.getNew("videosFromChannelById",i);return t({method:"GET",url:a.url,params:a.object})},i.getVideosFromPlaylistById=function(i){if(!i.id)return!1;var a=e.getNew("videosFromPlaylistById",i);return t({method:"GET",url:a.url,params:a.object})},i.getVideosByParams=function(i){var a=e.getNew("videosByParams",i);return t({method:"GET",url:a.url,params:a.object})},i}]).service("dailymotionSearchDataService",function(){this.getApiBaseUrl=function(t){return"https://api.dailymotion.com/"},this.fillDataInObjectByList=function(t,e,i){return angular.forEach(i,function(i,a){void 0!==e[i]&&(t.object[i]=e[i])}),t},this.getNew=function(t,e){var i={object:{},url:""};switch(t){case"videosFromUserById":i.object.fields="bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_240_url,thumbnail_720_url,thumbnail_url,title,updated_time,url,",i=this.fillDataInObjectByList(i,e,["fields","channel","created_after","created_before","genre","nogenre","page","limit","search","tags"]),i.url=this.getApiBaseUrl()+"user/"+e.id+"/videos";break;case"videosFromChannelById":i.object.fields="bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_240_url,thumbnail_720_url,thumbnail_url,title,updated_time,url,",i=this.fillDataInObjectByList(i,e,["fields","channel","created_after","created_before","search","sort","tags","page","limit"]),i.url=this.getApiBaseUrl()+"channel/"+e.id+"/videos";break;case"videosFromPlaylistById":i.object.fields="bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_240_url,thumbnail_720_url,thumbnail_url,title,updated_time,url,",i=this.fillDataInObjectByList(i,e,["fields","search","sort","tags","page","limit"]),i.url=this.getApiBaseUrl()+"playlist/"+e.id+"/videos";break;case"videosByParams":i.object.fields="bookmarks_total,comments_total,created_time,description,duration,embed_html,id,item_type,media_type,owner.id,owner.screenname,owner.url,thumbnail_240_url,thumbnail_720_url,thumbnail_url,title,updated_time,url,",i=this.fillDataInObjectByList(i,e,["fields","channel","country","created_after","created_before","detected_language","exclude_ids","featured","genre","has_game","hd","ids","in_history","languages","list","live","live_offair","live_onair","live_upcoming","longer_than","no_live","no_premium","nogenre","owners","partner","poster","premium","private","search","shorter_than","sort","svod","tags","tvod","ugc","verified","page","limit"]),i.url=this.getApiBaseUrl()+"videos"}return i}});