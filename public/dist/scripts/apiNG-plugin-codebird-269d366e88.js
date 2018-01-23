"use strict";angular.module("jtt_aping_codebird",[]).directive("apingCodebird",["apingCodebirdHelper","apingUtilityHelper",function(e,t){return{require:"?aping",restrict:"A",replace:"false",link:function(r,n,i,a,s){var o=a.getAppSettings(),u=t.parseJsonFromAttributes(i.apingCodebird,e.getThisPlattformString(),o),l=new Codebird;l.setBearerToken(t.getApiCredentials(e.getThisPlattformString(),"bearer_token")),u.forEach(function(t){var r={model:o.model,showAvatar:t.showAvatar||!1};void 0!==o.getNativeData?r.getNativeData=o.getNativeData:r.getNativeData=!1;var n={};if(void 0!==t.items?n.count=t.items:n.count=o.items,0===n.count||"0"===n.count)return!1;if((n.count<0||isNaN(n.count))&&(n.count=void 0),n.count>100&&(n.count=100),t.search)n.q=t.search,n.result_type=t.result_type||"mixed",void 0!==t.lat&&void 0!==t.lng&&(n.geocode=t.lat+","+t.lng+","+(t.distance||"1")+"km"),void 0!==t.language&&(n.lang=t.language),l.__call("search_tweets",n,function(t){a.concatToResults(e.getObjectByJsonData(t,r)),a.apply()},!0);else{if(!t.user)return!1;n.screen_name=t.user,n.contributor_details=!0,!0!==t.exclude_replies&&"true"!==t.exclude_replies||(n.exclude_replies=!0),!1!==t.include_rts&&"false"!==t.include_rts||(n.include_rts=!1),l.__call("statuses_userTimeline",n,function(t,n,i){a.concatToResults(e.getObjectByJsonData(t,r)),a.apply()},!0)}})}}}]),angular.module("jtt_aping_codebird").service("apingCodebirdHelper",["apingModels","apingTimeHelper","apingUtilityHelper",function(e,t,r){this.getThisPlattformString=function(){return"twitter"},this.getThisPlattformLink=function(){return"https://twitter.com/"},this.getBigImageUrlFromSmallImageUrl=function(e){return e.replace("_normal","")},this.getImageUrlFromMediaObject=function(e){if(e){if(e.media_url_https)return this.getBigImageUrlFromSmallImageUrl(e.media_url_https);if(e.media_url)return this.getBigImageUrlFromSmallImageUrl(e.media_url)}},this.getImageUrlFromUserObject=function(e){if(e){if(e.profile_image_url_https)return this.getBigImageUrlFromSmallImageUrl(e.profile_image_url_https);if(e.profile_image_url)return this.getBigImageUrlFromSmallImageUrl(e.profile_image_url)}},this.getImagesObjectFromMediaObject=function(e){var t={thumb_url:void 0,thumb_width:void 0,thumb_height:void 0,img_url:void 0,img_width:void 0,img_height:void 0,native_url:void 0,native_width:void 0,native_height:void 0},r=this.getImageUrlFromMediaObject(e);return e.sizes&&(void 0!==e.sizes.small?(t.thumb_url=r+":small",t.thumb_width=e.sizes.small.w||void 0,t.thumb_height=e.sizes.small.h||void 0):t.thumb_url=r,void 0!==e.sizes.medium?(t.img_url=r+":medium",t.img_width=e.sizes.medium.w||void 0,t.img_height=e.sizes.medium.h||void 0):t.img_url=r,void 0!==e.sizes.large?(t.native_url=r+":large",t.native_width=e.sizes.large.w||void 0,t.native_height=e.sizes.large.h||void 0):t.native_url=r),t},this.getObjectByJsonData=function(e,t){var r=[];if(e){var n=this;e.statuses?angular.forEach(e.statuses,function(e,i){var a=n.getItemByJsonData(e,t);a&&r.push(a)}):e.length>0&&angular.forEach(e,function(e,i){var a=n.getItemByJsonData(e,t);a&&r.push(a)})}return r},this.getItemByJsonData=function(e,t){var r={};if(e&&t.model)if(!0===t.getNativeData||"true"===t.getNativeData)r=this.getNativeItemByJsonData(e,t.model);else switch(t.model){case"social":r=this.getSocialItemByJsonData(e,t);break;case"image":r=this.getImageItemByJsonData(e,t);break;default:return!1}return r},this.getSocialItemByJsonData=function(t,r){var n=e.getNew("social",this.getThisPlattformString());if(angular.extend(n,{blog_name:t.user.screen_name,blog_id:t.user.id_str,blog_link:this.getThisPlattformLink()+t.user.screen_name+"/",intern_id:t.id_str,timestamp:new Date(Date.parse(t.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC"))).getTime(),text:t.text,shares:t.retweet_count,likes:t.favorite_count}),n.timestamp&&(n.date_time=new Date(n.timestamp)),t.entities&&t.entities.media&&t.entities.media.length>0){n.source=t.entities.media;var i=this.getImagesObjectFromMediaObject(t.entities.media[0]);angular.extend(n,i),n.img_url||(n.img_url=this.getImageUrlFromMediaObject(t.entities.media[0]))}return n.img_url?n.type="image":(n.type="tweet",!t.user||!0!==r.showAvatar&&"true"!==r.showAvatar||(n.img_url=this.getImageUrlFromUserObject(t.user))),n.post_url=n.blog_link+"status/"+n.intern_id,n},this.getImageItemByJsonData=function(t){var r=e.getNew("image",this.getThisPlattformString());if(angular.extend(r,{blog_name:t.user.screen_name,blog_id:t.user.id_str,blog_link:this.getThisPlattformLink()+t.user.screen_name+"/",intern_id:t.id_str,timestamp:new Date(Date.parse(t.created_at.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC"))).getTime(),text:t.text,shares:t.retweet_count,likes:t.favorite_count}),r.timestamp&&(r.date_time=new Date(r.timestamp)),t.entities&&t.entities.media&&t.entities.media.length>0){r.source=t.entities.media;var n=this.getImagesObjectFromMediaObject(t.entities.media[0]);angular.extend(r,n),r.img_url||(r.img_url=this.getImageUrlFromMediaObject(t.entities.media[0]))}return!!r.img_url&&(r.post_url=r.blog_link+"status/"+r.intern_id,r)},this.getNativeItemByJsonData=function(e,t){switch(t){case"image":if(!e.entities||!e.entities.media||!e.entities.media.length>0||!this.getImageUrlFromMediaObject(e.entities.media[0]))return!1;e}return e}}]),function(undefined){Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){for(var r=t||0;r<this.length;r++)if(this[r]===e)return r;return-1});var Codebird=function(){var _oauth_consumer_key=null,_oauth_consumer_secret=null,_oauth_bearer_token=null,_endpoint_base="https://api.twitter.com/",_endpoint_base_media="https://upload.twitter.com/",_endpoint=_endpoint_base+"1.1/",_endpoint_media=_endpoint_base_media+"1.1/",_endpoint_oauth=_endpoint_base,_endpoint_proxy="https://api.jublo.net/codebird/",_endpoint_old=_endpoint_base+"1/",_use_jsonp="undefined"!=typeof navigator&&void 0!==navigator.userAgent&&(navigator.userAgent.indexOf("Trident/4")>-1||navigator.userAgent.indexOf("Trident/5")>-1||navigator.userAgent.indexOf("MSIE 7.0")>-1),_use_proxy="undefined"!=typeof navigator&&void 0!==navigator.userAgent,_oauth_token=null,_oauth_token_secret=null,_version="2.6.0",setConsumerKey=function(e,t){_oauth_consumer_key=e,_oauth_consumer_secret=t},setBearerToken=function(e){_oauth_bearer_token=e},getVersion=function(){return _version},setToken=function(e,t){_oauth_token=e,_oauth_token_secret=t},setUseProxy=function(e){_use_proxy=!!e},setProxy=function(e){e.match(/\/$/)||(e+="/"),_endpoint_proxy=e},_parse_str=function(str,array){var glue1="=",glue2="&",array2=String(str).replace(/^&?([\s\S]*?)&?$/,"$1").split(glue2),i,j,chr,tmp,key,value,bracket,keys,evalStr,fixStr=function(e){return decodeURIComponent(e).replace(/([\\"'])/g,"\\$1").replace(/\n/g,"\\n").replace(/\r/g,"\\r")};for(array||(array=this.window),i=0;i<array2.length;i++){for(tmp=array2[i].split(glue1),tmp.length<2&&(tmp=[tmp,""]),key=fixStr(tmp[0]),value=fixStr(tmp[1]);" "===key.charAt(0);)key=key.substr(1);if(-1!==key.indexOf("\0")&&(key=key.substr(0,key.indexOf("\0"))),key&&"["!==key.charAt(0)){for(keys=[],bracket=0,j=0;j<key.length;j++)if("["!==key.charAt(j)||bracket){if("]"===key.charAt(j)&&bracket&&(keys.length||keys.push(key.substr(0,bracket-1)),keys.push(key.substr(bracket,j-bracket)),bracket=0,"["!==key.charAt(j+1)))break}else bracket=j+1;for(keys.length||(keys=[key]),j=0;j<keys[0].length&&(chr=keys[0].charAt(j)," "!==chr&&"."!==chr&&"["!==chr||(keys[0]=keys[0].substr(0,j)+"_"+keys[0].substr(j+1)),"["!==chr);j++);for(evalStr="array",j=0;j<keys.length;j++)key=keys[j],key=""!==key&&" "!==key||0===j?"'"+key+"'":eval(evalStr+".push([]);")-1,evalStr+="["+key+"]",j!==keys.length-1&&"undefined"===eval("typeof "+evalStr)&&eval(evalStr+" = [];");evalStr+=" = '"+value+"';\n",eval(evalStr)}}},getApiMethods=function(){return{GET:["account/settings","account/verify_credentials","application/rate_limit_status","blocks/ids","blocks/list","direct_messages","direct_messages/sent","direct_messages/show","favorites/list","followers/ids","followers/list","friends/ids","friends/list","friendships/incoming","friendships/lookup","friendships/lookup","friendships/no_retweets/ids","friendships/outgoing","friendships/show","geo/id/:place_id","geo/reverse_geocode","geo/search","geo/similar_places","help/configuration","help/languages","help/privacy","help/tos","lists/list","lists/members","lists/members/show","lists/memberships","lists/ownerships","lists/show","lists/statuses","lists/subscribers","lists/subscribers/show","lists/subscriptions","mutes/users/ids","mutes/users/list","oauth/authenticate","oauth/authorize","saved_searches/list","saved_searches/show/:id","search/tweets","statuses/home_timeline","statuses/mentions_timeline","statuses/oembed","statuses/retweeters/ids","statuses/retweets/:id","statuses/retweets_of_me","statuses/show/:id","statuses/user_timeline","trends/available","trends/closest","trends/place","users/contributees","users/contributors","users/profile_banner","users/search","users/show","users/suggestions","users/suggestions/:slug","users/suggestions/:slug/members","users/recommendations","account/push_destinations/device","activity/about_me","activity/by_friends","statuses/media_timeline","timeline/home","help/experiments","search/typeahead","search/universal","discover/universal","conversation/show","statuses/:id/activity/summary","account/login_verification_enrollment","account/login_verification_request","prompts/suggest","beta/timelines/custom/list","beta/timelines/timeline","beta/timelines/custom/show"],POST:["account/remove_profile_banner","account/settings__post","account/update_delivery_device","account/update_profile","account/update_profile_background_image","account/update_profile_banner","account/update_profile_colors","account/update_profile_image","blocks/create","blocks/destroy","direct_messages/destroy","direct_messages/new","favorites/create","favorites/destroy","friendships/create","friendships/destroy","friendships/update","lists/create","lists/destroy","lists/members/create","lists/members/create_all","lists/members/destroy","lists/members/destroy_all","lists/subscribers/create","lists/subscribers/destroy","lists/update","media/upload","mutes/users/create","mutes/users/destroy","oauth/access_token","oauth/request_token","oauth2/invalidate_token","oauth2/token","saved_searches/create","saved_searches/destroy/:id","statuses/destroy/:id","statuses/lookup","statuses/retweet/:id","statuses/update","statuses/update_with_media","users/lookup","users/report_spam","direct_messages/read","account/login_verification_enrollment__post","push_destinations/enable_login_verification","account/login_verification_request__post","beta/timelines/custom/create","beta/timelines/custom/update","beta/timelines/custom/destroy","beta/timelines/custom/add","beta/timelines/custom/remove"]}},__call=function(e,t,r,n){switch(void 0===t&&(t={}),void 0===n&&(n=!1),"function"!=typeof r&&"function"==typeof t?(r=t,t={},"boolean"==typeof r&&(n=r)):void 0===r&&(r=function(){}),e){case"oauth_authenticate":case"oauth_authorize":return this[e](t,r);case"oauth2_token":return this[e](r)}"oauth_requestToken"===e&&setToken(null,null);var i={};"object"==typeof t?i=t:_parse_str(t,i);var a,s,o,u="",l=e.split("_");for(s=0;s<l.length;s++)s>0&&(u+="/"),u+=l[s];var c=["screen_name","place_id"];for(s=0;s<c.length;s++){a=c[s].toUpperCase();var _=a.split("_").join("/");u=u.split(_).join(a)}var d=u,m=u.match(/[A-Z_]{2,}/);if(m)for(s=0;s<m.length;s++){a=m[s];var h=a.toLowerCase();if(d=d.split(a).join(":"+h),void 0===i[h]){for(o=0;o<26;o++)d=d.split(String.fromCharCode(65+o)).join("_"+String.fromCharCode(97+o));console.warn('To call the templated method "'+d+'", specify the parameter value for "'+h+'".')}u=u.split(a).join(i[h]),delete i[h]}for(s=0;s<26;s++)u=u.split(String.fromCharCode(65+s)).join("_"+String.fromCharCode(97+s)),d=d.split(String.fromCharCode(65+s)).join("_"+String.fromCharCode(97+s));var p=_detectMethod(d,i),g=_detectMultipart(d),f=_detectInternal(d);return _callApi(p,u,i,g,n,f,r)},oauth_authenticate=function(e,t){void 0===e.force_login&&(e.force_login=null),void 0===e.screen_name&&(e.screen_name=null),null===_oauth_token&&console.warn("To get the authenticate URL, the OAuth token must be set.");var r=_endpoint_oauth+"oauth/authenticate?oauth_token="+_url(_oauth_token);return!0===e.force_login&&(r+="&force_login=1",null!==e.screen_name&&(r+="&screen_name="+e.screen_name)),t(r),!0},oauth_authorize=function(e,t){void 0===e.force_login&&(e.force_login=null),void 0===e.screen_name&&(e.screen_name=null),null===_oauth_token&&console.warn("To get the authorize URL, the OAuth token must be set.");var r=_endpoint_oauth+"oauth/authorize?oauth_token="+_url(_oauth_token);return!0===e.force_login&&(r+="&force_login=1",null!==e.screen_name&&(r+="&screen_name="+e.screen_name)),t(r),!0},oauth2_token=function(e){null===_oauth_consumer_key&&console.warn("To obtain a bearer token, the consumer key must be set."),void 0===e&&(e=function(){});var t=_endpoint_oauth+"oauth2/token";_use_proxy&&(t=t.replace(_endpoint_base,_endpoint_proxy));var r=_getXmlRequestObject();null!==r&&(r.open("POST",t,!0),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),r.setRequestHeader((_use_proxy?"X-":"")+"Authorization","Basic "+_base64_encode(_oauth_consumer_key+":"+_oauth_consumer_secret)),r.onreadystatechange=function(){if(r.readyState>=4){var t=12027;try{t=r.status}catch(e){}var n="";try{n=r.responseText}catch(e){}var i=_parseApiReply(n);i.httpstatus=t,200===t&&setBearerToken(i.access_token),e(i)}},r.send("grant_type=client_credentials"))},_url=function(e){return/boolean|number|string/.test(typeof e)?encodeURIComponent(e).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A"):""},_sha1=function(){function e(e,r){e[r>>5]|=128<<24-r%32,e[15+(r+64>>9<<4)]=r;for(var n=new Array(80),i=1732584193,a=-271733879,s=-1732584194,o=271733878,u=-1009589776,l=0;l<e.length;l+=16){for(var c=i,_=a,d=s,m=o,h=u,p=0;80>p;p++){var g;p<16?g=e[l+p]:(g=n[p-3]^n[p-8]^n[p-14]^n[p-16],g=g<<1|g>>>31),n[p]=g,g=t(t(i<<5|i>>>27,20>p?a&s|~a&o:40>p?a^s^o:60>p?a&s|a&o|s&o:a^s^o),t(t(u,n[p]),20>p?1518500249:40>p?1859775393:60>p?-1894007588:-899497514)),u=o,o=s,s=a<<30|a>>>2,a=i,i=g}i=t(i,c),a=t(a,_),s=t(s,d),o=t(o,m),u=t(u,h)}return[i,a,s,o,u]}function t(e,t){var r=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(e){for(var t=[],r=(1<<n)-1,i=0;i<e.length*n;i+=n)t[i>>5]|=(e.charCodeAt(i/n)&r)<<24-i%32;return t}var n=8;return function(t){var i=_oauth_consumer_secret+"&"+(null!==_oauth_token_secret?_oauth_token_secret:"");null===_oauth_consumer_secret&&console.warn("To generate a hash, the consumer secret must be set.");var a=r(i);a.length>16&&(a=e(a,i.length*n)),i=new Array(16);for(var s=new Array(16),o=0;o<16;o++)s[o]=909522486^a[o],i[o]=1549556828^a[o];for(a=e(s.concat(r(t)),512+t.length*n),i=e(i.concat(a),672),a="",s=0;s<4*i.length;s+=3)for(o=(i[s>>2]>>8*(3-s%4)&255)<<16|(i[s+1>>2]>>8*(3-(s+1)%4)&255)<<8|i[s+2>>2]>>8*(3-(s+2)%4)&255,t=0;4>t;t++)a=8*s+6*t>32*i.length?a+"=":a+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(o>>6*(3-t)&63);return a}}(),_base64_encode=function(e){var t,r,n,i,a=0,s=0,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u=[];if(!e)return e;do{t=e.charCodeAt(a++),r=e.charCodeAt(a++),n=e.charCodeAt(a++),i=t<<16|r<<8|n,t=i>>18&63,r=i>>12&63,n=i>>6&63,i&=63,u[s++]=o.charAt(t)+o.charAt(r)+o.charAt(n)+o.charAt(i)}while(a<e.length);return u=u.join(""),e=e.length%3,(e?u.slice(0,e-3):u)+"===".slice(e||3)},_http_build_query=function(e,t,r){function n(e,t,r){var i,a=[];if(!0===t?t="1":!1===t&&(t="0"),null===t)return"";if("object"==typeof t){for(i in t)null!==t[i]&&a.push(n(e+"["+i+"]",t[i],r));return a.join(r)}if("function"!=typeof t)return _url(e)+"="+_url(t);console.warn("There was an error processing for http_build_query().")}var i,a,s=[];r||(r="&");for(a in e)i=e[a],t&&!isNaN(a)&&(a=String(t)+a),""!==(i=n(a,i,r))&&s.push(i);return s.join(r)},_nonce=function(e){void 0===e&&(e=8),e<1&&console.warn("Invalid nonce length.");for(var t="",r=0;r<e;r++){var n=Math.floor(61*Math.random());t+="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".substring(n,n+1)}return t},_ksort=function(e){var t,r,n=[];t=function(e,t){var r=parseFloat(e),n=parseFloat(t),i=r+""===e,a=n+""===t;return i&&a?r>n?1:r<n?-1:0:i&&!a?1:!i&&a?-1:e>t?1:e<t?-1:0};for(r in e)e.hasOwnProperty(r)&&n.push(r);return n.sort(t),n},_clone=function(e){var t={};for(var r in e)"object"==typeof e[r]?t[r]=_clone(e[r]):t[r]=e[r];return t},_sign=function(e,t,r,n){void 0===r&&(r={}),void 0===n&&(n=!1),null===_oauth_consumer_key&&console.warn("To generate a signature, the consumer key must be set.");var i,a={consumer_key:_oauth_consumer_key,version:"1.0",timestamp:Math.round((new Date).getTime()/1e3),nonce:_nonce(),signature_method:"HMAC-SHA1"},s={};for(var o in a)i=a[o],s["oauth_"+o]=_url(i);null!==_oauth_token&&(s.oauth_token=_url(_oauth_token));var u=_clone(s);for(o in r)i=r[o],s[o]=i;for(var l=_ksort(s),c="",_=0;_<l.length;_++)o=l[_],i=s[o],c+=o+"="+_url(i)+"&";c=c.substring(0,c.length-1);var d=_sha1(e+"&"+_url(t)+"&"+_url(c));r=n?s:u,r.oauth_signature=d,l=_ksort(r);var m="";if(n){for(_=0;_<l.length;_++)o=l[_],i=r[o],m+=o+"="+_url(i)+"&";return m.substring(0,m.length-1)}for(m="OAuth ",_=0;_<l.length;_++)o=l[_],i=r[o],m+=o+'="'+_url(i)+'", ';return m.substring(0,m.length-2)},_detectMethod=function(e,t){switch(e){case"account/settings":case"account/login_verification_enrollment":case"account/login_verification_request":e=t.length?e+"__post":e}var r=getApiMethods();for(var n in r)if(r[n].indexOf(e)>-1)return n;console.warn("Can't find HTTP method to use for \""+e+'".')},_detectMultipart=function(e){return["statuses/update_with_media","account/update_profile_background_image","account/update_profile_image","account/update_profile_banner"].indexOf(e)>-1},_buildMultipart=function(e,t){if(_detectMultipart(e)){var r=["statuses/update_with_media","account/update_profile_background_image","account/update_profile_image","account/update_profile_banner"],n={"statuses/update_with_media":"media[]","account/update_profile_background_image":"image","account/update_profile_image":"image","account/update_profile_banner":"banner"};if(-1!==r.indexOf(e)){n=n[e].split(" ");var i="--------------------"+_nonce(),a="";for(var s in t)a+="--"+i+'\r\nContent-Disposition: form-data; name="'+s+'"',n.indexOf(s)>-1&&(a+="\r\nContent-Transfer-Encoding: base64"),a+="\r\n\r\n"+t[s]+"\r\n";return a+="--"+i+"--"}}},_detectInternal=function(e){return["users/recommendations"].join(" ").indexOf(e)>-1},_detectMedia=function(e){return["media/upload"].join(" ").indexOf(e)>-1},_detectOld=function(e){return["account/push_destinations/device"].join(" ").indexOf(e)>-1},_getEndpoint=function(e){return"oauth"===e.substring(0,5)?_endpoint_oauth+e:_detectMedia(e)?_endpoint_media+e+".json":_detectOld(e)?_endpoint_old+e+".json":_endpoint+e+".json"},_getXmlRequestObject=function(){var e=null;if("object"==typeof window&&window&&void 0!==window.XMLHttpRequest)e=new window.XMLHttpRequest;else if("object"==typeof Ti&&Ti&&void 0!==Ti.Network.createHTTPClient)e=Ti.Network.createHTTPClient();else if("undefined"!=typeof ActiveXObject)try{e=new ActiveXObject("Microsoft.XMLHTTP")}catch(e){console.error("ActiveXObject object not defined.")}else if("function"==typeof require&&require)try{var t=require("xmlhttprequest").XMLHttpRequest;e=new t}catch(r){try{var t=require("xhr2");e=new t}catch(e){console.error("xhr2 object not defined, cancelling.")}}return e},_callApi=function(e,t,r,n,i,a,s){void 0===r&&(r={}),void 0===n&&(n=!1),void 0===i&&(i=!1),"function"!=typeof s&&(s=function(){}),a&&(r.adc="phone",r.application_id=333903271);var o=_getEndpoint(t),u=null,l=_getXmlRequestObject();if(null!==l){var c;if("GET"===e){var _=o;if("{}"!==JSON.stringify(r)&&(_+="?"+_http_build_query(r)),i||(u=_sign(e,o,r)),_use_jsonp){"{}"!==JSON.stringify(r)?_+="&":_+="?";var d=_nonce();window[d]=function(e){e.httpstatus=200;var t=null;void 0!==l.getResponseHeader&&""!==l.getResponseHeader("x-rate-limit-limit")&&(t={limit:l.getResponseHeader("x-rate-limit-limit"),remaining:l.getResponseHeader("x-rate-limit-remaining"),reset:l.getResponseHeader("x-rate-limit-reset")}),s(e,t)},r.callback=d,_=o+"?"+_sign(e,o,r,!0);var m=document.createElement("script");m.type="text/javascript",m.src=_;return void document.getElementsByTagName("body")[0].appendChild(m)}_use_proxy&&(_=_.replace(_endpoint_base,_endpoint_proxy).replace(_endpoint_base_media,_endpoint_proxy)),l.open(e,_,!0)}else{if(_use_jsonp)return void console.warn("Sending POST requests is not supported for IE7-9.");n?(i||(u=_sign(e,o,{})),r=_buildMultipart(t,r)):(i||(u=_sign(e,o,r)),r=_http_build_query(r)),c=r,(_use_proxy||n)&&(o=o.replace(_endpoint_base,_endpoint_proxy).replace(_endpoint_base_media,_endpoint_proxy)),l.open(e,o,!0),n?l.setRequestHeader("Content-Type","multipart/form-data; boundary="+c.split("\r\n")[0].substring(2)):l.setRequestHeader("Content-Type","application/x-www-form-urlencoded")}if(i){if(null===_oauth_consumer_key&&null===_oauth_bearer_token&&console.warn("To make an app-only auth API request, consumer key or bearer token must be set."),null===_oauth_bearer_token)return oauth2_token(function(){_callApi(e,t,r,n,i,!1,s)});u="Bearer "+_oauth_bearer_token}return null!==u&&l.setRequestHeader((_use_proxy?"X-":"")+"Authorization",u),l.onreadystatechange=function(){if(l.readyState>=4){var e=12027;try{e=l.status}catch(e){}var t="";try{t=l.responseText}catch(e){}var r=_parseApiReply(t);r.httpstatus=e;var n=null;void 0!==l.getResponseHeader&&""!==l.getResponseHeader("x-rate-limit-limit")&&(n={limit:l.getResponseHeader("x-rate-limit-limit"),remaining:l.getResponseHeader("x-rate-limit-remaining"),reset:l.getResponseHeader("x-rate-limit-reset")}),s(r,n)}},l.send("GET"===e?null:c),!0}},_parseApiReply=function(e){if("string"!=typeof e||""===e)return{};if("[]"===e)return[];var t;try{t=JSON.parse(e)}catch(a){if(t={},0===e.indexOf('<?xml version="1.0" encoding="UTF-8"?>'))t.request=e.match(/<request>(.*)<\/request>/)[1],t.error=e.match(/<error>(.*)<\/error>/)[1];else for(var r=e.split("&"),n=0;n<r.length;n++){var i=r[n].split("=",2);i.length>1?t[i[0]]=decodeURIComponent(i[1]):t[i[0]]=null}}return t};return{setConsumerKey:setConsumerKey,getVersion:getVersion,setToken:setToken,setBearerToken:setBearerToken,setUseProxy:setUseProxy,setProxy:setProxy,getApiMethods:getApiMethods,__call:__call,oauth_authenticate:oauth_authenticate,oauth_authorize:oauth_authorize,oauth2_token:oauth2_token}};"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=Codebird:("object"==typeof window&&window&&(window.Codebird=Codebird),"function"==typeof define&&define.amd&&define("codebird",[],function(){return Codebird}))}();