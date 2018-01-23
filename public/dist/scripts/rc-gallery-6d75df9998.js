!function(e){"use strict";e.module("rcGallery",[])}(angular),function(e){"use strict";e.module("rcGallery").directive("rcgMedia",[function(){return{restrict:"EA",require:"^rc-gallery",transclude:!0,priority:100,scope:{id:"@rcgId",width:"@rcgWidth",height:"@rcgHeight",theme:"@rcgTheme",options:"&rcgOptions",sources:"=?rcgSources"},templateUrl:function(e,r){return r.templateUrl||"rcg-media.tpl.html"},link:function(r,t,l,n,i){var a=e.element(t).find("[rcg-transclude]");r.id=e.isDefined(r.id)?r.id:"rcg_media_"+Math.random().toString(36).substr(2,10),r.options=e.isObject(r.options())?r.options():{},r.onChangeSources=function(t,l){t!==l&&e.isArray(t)&&(r.sources=t,n.sources=t)},n.mediaElement=e.element(t),n.mediaId=r.id,n.theme=r.theme,n.width=r.width,n.height=r.height,n.options=r.options,n.sources=r.sources,r.rcGalleryApi=n,l.id||e.element(t).find("[rcg-transclude]").attr("id",r.id),i(r,function(e,r){a.append(e)}),n.onMediaReady(),r.$watchCollection("sources",r.onChangeSources),r.$watchCollection("rcGalleryApi.sources",r.onChangeSources)}}}])}(angular),function(e){"use strict";e.module("rcGallery").directive("rcgSource",[function(){return{restrict:"A",link:function(r,t,l){if(l.rcgSource){var n=r.$eval(l.rcgSource);e.isObject(n)&&e.forEach(n,function(e,r){if(0!==r.indexOf("$")){var t=r.replace(/([A-Z])/g,function(e){return"-"+e.toLowerCase()});t.length>0&&!l[t]&&l.$set(t,e)}})}}}}])}(angular),function(e){"use strict";e.module("rcGallery").directive("rcGallery",[function(){return{restrict:"EA",scope:{loadUrls:"&rcgLoadUrls",onGalleryReady:"&rcgOnGalleryReady"},controller:"rcGalleryCtrl",controllerAs:"rcGalleryApi",link:{pre:function(r,t,l,n){r.rcGalleryApi.rcGalleryElement=e.element(t)}}}}])}(angular),function(e){"use strict";e.module("rcGallery").controller("rcGalleryCtrl",["$scope","$log","rcGallery","rcGalleryLazyload",function(r,t,l,n){var i=this;this.rcGalleryElement=null,this.init=function(){this.isReady=!1,this.isMediaReady=!1,this.mediaElement=null,this.mediaGalleryElement=null,this.mediaId=null,this.loadUrls=l.getLoadUrls(),r.loadUrls=e.isDefined(r.loadUrls())?r.loadUrls():void 0,r.loadUrls&&this.addLoadUrls(r.loadUrls)},this.onMediaReady=function(){0!==i.mediaElement.length?n.get(i.loadUrls).then(function(e){t.debug("rcGallery Ready: "+i.mediaId),i.mediaGalleryElement=i.mediaElement.find("#"+i.mediaId),i.isReady=!0,r.onGalleryReady({$rcGalleryApi:i})},function(e){t.error("rcGallery Error to load urls")}):t.error("rcGallery Media Element ID not found")},this.addLoadUrls=function(r){r&&r.length>0&&(this.loadUrls,e.isArray(r)?e.forEach(r,function(e,r){-1===this.indexOf(e)&&this.push(e)},this.loadUrls):e.isString(r)&&-1===this.loadUrls.indexOf(r)&&this.loadUrls.push(r))},this.setMediaReady=function(){this.isMediaReady=!0},this.init()}])}(angular),function(e){"use strict";var r=e.module("rcGallery");r.provider("rcGallery",[function(){this.loadUrls=[],this.setUrls=function(r){e.isArray(r)&&(this.loadUrls=r)},this.$get=[function(){var e=this.loadUrls;return{getLoadUrls:function(){return e}}}]}]),r.factory("rcGalleryLazyload",["$q",function(r){function t(e){if("function"==typeof Event)return new Event(e);var r=document.createEvent("Event");return r.initEvent(e,!0,!0),r}return{get:function(l){var n=[];return e.forEach(l,function(l){var n,i=r.defer();switch(l.split(".").pop()){case"css":n=e.element('link[href="'+l+'"]'),n[0]||(n=document.createElement("link"),n.rel="stylesheet",n.type="text/css",n.async=!1,n.href=l);break;case"js":n=e.element('script[src="'+l+'"]'),n[0]||(n=document.createElement("script"),n.type="text/javascript",n.async=!1,n.src=l)}if(n[0])n[0]?(n[0].addEventListener("onRcGalleryLazyloadComplete",function(){n[0].removeEventListener("onRcGalleryLazyloadComplete",this),i.resolve(n)}),n[0].addEventListener("onRcGalleryLazyloadError",function(){n[0].removeEventListener("onRcGalleryLazyloadError",this),i.reject(n)})):i.resolve(n);else{var a=t("onRcGalleryLazyloadComplete"),o=t("onRcGalleryLazyloadError");n.onload=function(){n.dispatchEvent(a),i.resolve(n)},n.onError=function(){n.dispatchEvent(o),i.reject(n)},document.head.appendChild(n)}this.push(i.promise)},n),r.all(n)}}}])}(angular),angular.module("rcGallery").run(["$templateCache",function(e){e.put("rcg-media.tpl.html",'<div data-ng-show="rcGalleryApi.isMediaReady" class="rcg-media" rcg-transclude ></div>')}]);