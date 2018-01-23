"use strict";angular.module("jtt_aping_vimeo",["jtt_vimeo"]).directive("apingVimeo",["apingVimeoHelper","apingUtilityHelper","vimeoFactory",function(e,t,i){return{require:"?aping",restrict:"A",replace:"false",link:function(r,a,n,o){var s=o.getAppSettings();t.parseJsonFromAttributes(n.apingVimeo,e.getThisPlattformString(),s).forEach(function(r){var a={model:s.model};void 0!==s.getNativeData?a.getNativeData=s.getNativeData:a.getNativeData=!1;var n={access_token:t.getApiCredentials(e.getThisPlattformString(),"access_token")};if(void 0!==r.items?n.per_page=r.items:n.per_page=s.items,0===n.per_page||"0"===n.per_page)return!1;(n.per_page<0||isNaN(n.per_page))&&(n.per_page=void 0),n.per_page>50&&(n.per_page=50),void 0!==r.search&&(n.query=r.search),r.user?(n.user=r.user,n.filter="embeddable",n.filter_embeddable=!0,i.getVideosFromUser(n).then(function(t){t&&o.concatToResults(e.getObjectByJsonData(t,a))})):r.channel?(n.channel=r.channel,n.filter="embeddable",n.filter_embeddable=!0,i.getVideosFromChannel(n).then(function(t){t&&o.concatToResults(e.getObjectByJsonData(t,a))})):r.tag?(n.tag=r.tag,i.getVideosFromTag(n).then(function(t){t&&o.concatToResults(e.getObjectByJsonData(t,a))})):r.category&&(n.category=r.category,n.filter="embeddable",n.filter_embeddable=!0,i.getVideosFromCategory(n).then(function(t){t&&o.concatToResults(e.getObjectByJsonData(t,a))}))})}}}]),angular.module("jtt_aping_vimeo").service("apingVimeoHelper",["apingModels","apingTimeHelper","apingUtilityHelper",function(e,t,i){this.getThisPlattformString=function(){return"vimeo"},this.getThisPlattformLink=function(){return"https://vimeo.com/"},this.getIdFromUri=function(e){return e.split("/").slice(-1)[0]},this.getActionCounter=function(e,t){if(e[t])return e[t].total||void 0},this.getDifference=function(e,t){return e>t?e-t:t-e},this.getImagesFromImageArray=function(e){var t=this,i={thumb_url:void 0,thumb_width:void 0,thumb_height:void 0,img_url:void 0,img_width:void 0,img_height:void 0,native_url:void 0,native_width:void 0,native_height:void 0};return e.constructor===Array&&angular.forEach(e,function(e,r){void 0!==e.link&&(void 0===i.thumb_url?(i.thumb_url=e.link,i.thumb_width=e.width,i.thumb_height=e.height):t.getDifference(i.thumb_width,200)>t.getDifference(e.width,200)&&e.width>=200&&(i.thumb_url=e.link,i.thumb_width=e.width,i.thumb_height=e.height),void 0===i.img_url?(i.img_url=e.link,i.img_width=e.width,i.img_height=e.height):t.getDifference(i.img_width,700)>t.getDifference(e.width,700)&&(i.img_url=e.link,i.img_width=e.width,i.img_height=e.height),void 0===i.native_url?(i.native_url=e.link,i.native_width=e.width,i.native_height=e.height):e.width>i.native_width&&(i.native_url=e.link,i.native_width=e.width,i.native_height=e.height))}),i},this.getObjectByJsonData=function(e,t){var i=[];if(e&&e.data){var r=this;e.data.data&&angular.forEach(e.data.data,function(e,a){var n;(n=!0===t.getNativeData||"true"===t.getNativeData?e:r.getItemByJsonData(e,t.model))&&i.push(n)})}return i},this.getItemByJsonData=function(e,t){var i={};if(e&&t)switch(t){case"social":i=this.getSocialItemByJsonData(e);break;case"video":i=this.getVideoItemByJsonData(e);break;default:return!1}return i},this.getSocialItemByJsonData=function(i){var r=e.getNew("social",this.getThisPlattformString());if(angular.extend(r,{blog_name:i.user.name,blog_id:this.getIdFromUri(i.user.uri),blog_link:i.user.link,intern_type:"video",type:"video",intern_id:this.getIdFromUri(i.uri),timestamp:t.getTimestampFromDateString(i.created_time,1e3,36e5),post_url:i.link,caption:i.name,text:i.description}),r.date_time=new Date(r.timestamp),i.pictures&&i.pictures.sizes.length>0){var a=this.getImagesFromImageArray(i.pictures.sizes);r.img_url=a.img_url||void 0,r.thumb_url=a.thumb_url||void 0,r.native_url=a.native_url||void 0}return i.embed&&i.embed.html&&(r.source=i.embed.html),r.text||(r.text=r.caption,r.caption=""),i.metadata&&i.metadata.connections&&(r.likes=this.getActionCounter(i.metadata.connections,"likes"),r.comments=this.getActionCounter(i.metadata.connections,"comments")),r},this.getVideoItemByJsonData=function(i){var r=e.getNew("video",this.getThisPlattformString());if(angular.extend(r,{blog_name:i.user.name,blog_id:this.getIdFromUri(i.user.uri),blog_link:i.user.link,intern_id:this.getIdFromUri(i.uri),timestamp:t.getTimestampFromDateString(i.created_time,1e3,36e5),post_url:i.link,caption:i.name,text:i.description,duration:i.duration,width:i.width,height:i.height}),i.pictures&&i.pictures.sizes.length>0){var a=this.getImagesFromImageArray(i.pictures.sizes);r.img_url=a.img_url||void 0,r.thumb_url=a.thumb_url||void 0,r.native_url=a.native_url||void 0}return r.date_time=new Date(r.timestamp),!(!i.embed||!i.embed.html)&&(r.markup=i.embed.html,r.text||(r.text=r.caption,r.caption=""),i.metadata&&i.metadata.connections&&(r.likes=this.getActionCounter(i.metadata.connections,"likes"),r.comments=this.getActionCounter(i.metadata.connections,"comments")),r)}}]),angular.module("jtt_vimeo",[]).factory("vimeoFactory",["$http","vimeoSearchDataService",function(e,t){var i={};return i.getVideosFromChannel=function(i){if(!i.channel)return!1;var r=t.getNew("videosFromChannel",i);return e({method:"GET",url:r.url,params:r.object})},i.getVideosFromCategory=function(i){if(!i.category)return!1;var r=t.getNew("videosFromCategory",i);return e({method:"GET",url:r.url,params:r.object})},i.getVideosFromTag=function(i){if(!i.tag)return!1;var r=t.getNew("videosFromTag",i);return e({method:"GET",url:r.url,params:r.object})},i.getVideosFromUser=function(i){if(!i.user)return!1;var r=t.getNew("videosFromUser",i);return e({method:"GET",url:r.url,params:r.object})},i}]).service("vimeoSearchDataService",function(){this.getApiBaseUrl=function(e){return"https://api.vimeo.com/"},this.fillDataInObjectByList=function(e,t,i){return angular.forEach(i,function(i,r){void 0!==t[i]&&(e.object[i]=t[i])}),e},this.getNew=function(e,t){var i={object:{access_token:t.access_token},url:""};switch(e){case"videosFromChannel":i=this.fillDataInObjectByList(i,t,["page","query","filter","filter_embeddable","sort","direction","per_page"]),i.url=this.getApiBaseUrl()+"channels/"+t.channel+"/videos";break;case"videosFromCategory":i=this.fillDataInObjectByList(i,t,["page","query","filter","filter_embeddable","sort","direction","per_page"]),i.url=this.getApiBaseUrl()+"categories/"+t.category+"/videos";break;case"videosFromTag":i=this.fillDataInObjectByList(i,t,["page","query","sort","direction","per_page"]),i.url=this.getApiBaseUrl()+"tags/"+t.tag+"/videos";break;case"videosFromUser":i=this.fillDataInObjectByList(i,t,["page","query","filter","filter_embeddable","sort","direction","per_page"]),i.url=this.getApiBaseUrl()+"users/"+t.user+"/videos"}return i}});