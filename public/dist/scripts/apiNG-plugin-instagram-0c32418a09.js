"use strict";angular.module("jtt_aping_instagram",["jtt_instagram"]).directive("apingInstagram",["instagramFactory","apingInstagramHelper","apingUtilityHelper",function(t,e,a){return{require:"?aping",restrict:"A",replace:"false",link:function(i,n,s,r){var o=r.getAppSettings();a.parseJsonFromAttributes(s.apingInstagram,e.getThisPlatformString(),o).forEach(function(i){var n={model:o.model};void 0!==o.getNativeData?n.getNativeData=o.getNativeData:n.getNativeData=!1;var s={access_token:a.getApiCredentials(e.getThisPlatformString(),"access_token")};if(void 0!==i.items?s.count=i.items:s.count=o.items,0===s.count||"0"===s.count)return!1;(s.count<0||isNaN(s.count))&&(s.count=void 0),s.count>33&&(s.count=33),i.userId?(s.userId=i.userId,t.getMediaFromUserById(s).then(function(t){r.concatToResults(e.getObjectByJsonData(t,n))})):i.tag?(s.tag=i.tag,t.getMediaByTag(s).then(function(t){r.concatToResults(e.getObjectByJsonData(t,n))})):i.locationId?(s.locationId=i.locationId,t.getMediaFromLocationById(s).then(function(t){r.concatToResults(e.getObjectByJsonData(t,n))})):i.lat&&i.lng&&(s.lat=i.lat,s.lng=i.lng,i.distance&&(s.distance=i.distance),t.getMediaByCoordinates(s).then(function(t){r.concatToResults(e.getObjectByJsonData(t,n))}))})}}}]),angular.module("jtt_aping_instagram").service("apingInstagramHelper",["apingModels","apingTimeHelper","apingUtilityHelper",function(t,e,a){this.getThisPlatformString=function(){return"instagram"},this.getThisPlatformLink=function(){return"https://instagram.com/"},this.replaceHashtagWithoutSpaces=function(t){return t&&"string"==typeof t&&(t=t.replace(/#/g," #"),t=t.replace(/  #/g," #")),t},this.getObjectByJsonData=function(t,e){var a=[];if(t){var i=this;t.data&&t.data.data&&angular.forEach(t.data.data,function(t,n){var s;(s=!0===e.getNativeData||"true"===e.getNativeData?i.getNativeItemByJsonData(t,e.model):i.getItemByJsonData(t,e.model))&&a.push(s)})}return a},this.getItemByJsonData=function(t,e){var a={};if(t&&e)switch(e){case"social":a=this.getSocialItemByJsonData(t);break;case"video":a=this.getVideoItemByJsonData(t);break;case"image":a=this.getImageItemByJsonData(t);break;default:return!1}return a},this.getSocialItemByJsonData=function(e){var a=t.getNew("social",this.getThisPlatformString());return angular.extend(a,{blog_name:e.user.full_name||"@"+e.user.username,blog_id:"@"+e.user.username,blog_link:this.getThisPlatformLink()+e.user.username,intern_type:e.type,timestamp:1e3*parseInt(e.created_time),post_url:e.link,intern_id:e.id,text:e.caption?e.caption.text:void 0,likes:e.likes?e.likes.count:void 0,comments:e.comments?e.likes.comments:void 0,thumb_url:e.images.low_resolution.url,img_url:e.images.standard_resolution.url,native_url:e.images.standard_resolution.url.replace("s640x640/","")}),a.date_time=new Date(a.timestamp),a.text=this.replaceHashtagWithoutSpaces(a.text),"video"==e.type&&(a.type="video",a.source=e.videos),a},this.getVideoItemByJsonData=function(e){if("video"!=e.type)return!1;var a=t.getNew("video",this.getThisPlatformString());return angular.extend(a,{blog_name:e.user.full_name||"@"+e.user.username,blog_id:"@"+e.user.username,blog_link:this.getThisPlatformLink()+e.user.username,intern_type:e.type,timestamp:1e3*parseInt(e.created_time),post_url:e.link,intern_id:e.id,text:e.caption?e.caption.text:void 0,likes:e.likes?e.likes.count:void 0,comments:e.comments?e.likes.comments:void 0,type:"video",source:e.videos.standard_resolution?e.videos.standard_resolution.url:void 0,width:e.videos.standard_resolution?e.videos.standard_resolution.width:void 0,height:e.videos.standard_resolution?e.videos.standard_resolution.height:void 0,thumb_url:e.images.low_resolution.url,img_url:e.images.standard_resolution.url,native_url:e.images.standard_resolution.url.replace("s640x640/","")}),a.date_time=new Date(a.timestamp),a.text=this.replaceHashtagWithoutSpaces(a.text),a},this.getImageItemByJsonData=function(e){if("image"!=e.type)return!1;var a=t.getNew("image",this.getThisPlatformString());return angular.extend(a,{blog_name:e.user.full_name||"@"+e.user.username,blog_id:"@"+e.user.username,blog_link:this.getThisPlatformLink()+e.user.username,intern_type:e.type,timestamp:1e3*parseInt(e.created_time),post_url:e.link,intern_id:e.id,text:e.caption?e.caption.text:void 0,likes:e.likes?e.likes.count:void 0,comments:e.comments?e.likes.comments:void 0,thumb_url:e.images.low_resolution.url,thumb_width:e.images.low_resolution.width,thumb_height:e.images.low_resolution.height,img_url:e.images.standard_resolution.url,img_width:e.images.standard_resolution.width,img_height:e.images.standard_resolution.height,native_url:e.images.standard_resolution.url.replace("s640x640/",""),type:"image"}),a.date_time=new Date(a.timestamp),a.text=this.replaceHashtagWithoutSpaces(a.text),a},this.getNativeItemByJsonData=function(t,e){switch(e){case"image":if("image"!=t.type)return!1;t;break;case"video":if("video"!=t.type)return!1;t}return t}}]),angular.module("jtt_instagram",[]).factory("instagramFactory",["$http","instagramSearchDataService",function(t,e){var a={};return a.getUserById=function(a){var i=e.getNew("userById",a);return t.jsonp(i.url,{method:"GET",params:i.object})},a.getMediaFromUserById=function(a){var i=e.getNew("mediaFromUserById",a);return t.jsonp(i.url,{method:"GET",params:i.object})},a.getMediaByTag=function(a){var i=e.getNew("mediaByTag",a);return t.jsonp(i.url,{method:"GET",params:i.object})},a.getMediaFromLocationById=function(a){var i=e.getNew("mediaFromLocationById",a);return t.jsonp(i.url,{method:"GET",params:i.object})},a.getMediaByCoordinates=function(a){var i=e.getNew("mediaByCoordinates",a);return t.jsonp(i.url,{method:"GET",params:i.object})},a}]).service("instagramSearchDataService",function(){this.getApiBaseUrl=function(t){return"https://api.instagram.com/v1/"},this.fillDataInObjectByList=function(t,e,a){return angular.forEach(a,function(a,i){void 0!==e[a]&&(t.object[a]=e[a])}),t},this.getNew=function(t,e){var a={object:{access_token:e.access_token,callback:"JSON_CALLBACK"},url:""};switch(void 0!==e.count&&(a.object.count=e.count),t){case"userById":a.object.count=void 0,a.url=this.getApiBaseUrl()+"users/"+e.userId;break;case"mediaFromUserById":a=this.fillDataInObjectByList(a,e,["max_id","min_id","min_timestamp","max_timestamp"]),a.url=this.getApiBaseUrl()+"users/"+e.userId+"/media/recent";break;case"mediaByTag":a=this.fillDataInObjectByList(a,e,["max_tag_id","min_tag_id","min_timestamp","max_timestamp"]),a.url=this.getApiBaseUrl()+"tags/"+e.tag+"/media/recent";break;case"mediaFromLocationById":a=this.fillDataInObjectByList(a,e,["max_id","min_id","min_timestamp","max_timestamp"]),a.url=this.getApiBaseUrl()+"locations/"+e.locationId+"/media/recent";break;case"mediaByCoordinates":a=this.fillDataInObjectByList(a,e,["lat","lng","distance","min_timestamp","max_timestamp"]),a.url=this.getApiBaseUrl()+"media/search"}return a}});