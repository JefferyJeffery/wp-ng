"use strict";angular.module("offClick",[]),angular.module("offClick").directive("offClick",["$rootScope","$parse","OffClickFilterCache",function(n,t,e){var c=0,o={},i=!1,r=function(n,t){if(!n||!t)return!1;for(var e=t.length,c=0;c<e;++c){var o=t[c],i=!1;try{i=o.contains(n)}catch(t){void 0!==o.compareDocumentPosition&&(i=o===n||Boolean(16&o.compareDocumentPosition(n)))}if(i)return!0}return!1},f=function(t){if("touchmove"===t.type)return i=!0,!1;if(i)return i=!1,!1;var c=t.target||t.srcElement;angular.forEach(o,function(o,i){var f=e["*"]||[];o.elm.id&&""!==o.elm.id&&e["#"+o.elm.id]&&(f=f.concat(e["#"+o.elm.id])),angular.forEach(o.elm.classList,function(n){e["."+n]&&(f=f.concat(e["."+n]))}),o.elm.contains(c)||r(c,f)||n.$evalAsync(function(){o.cb(o.scope,{$event:t})})})};return document.addEventListener("touchmove",f,!0),document.addEventListener("touchend",f,!0),document.addEventListener("click",f,!0),{restrict:"A",compile:function(e,i){var r=t(i.offClick);return function(e,f){var u=c++,l=void 0,a=function(){o[u]={elm:f[0],cb:r,scope:e}},d=function(){o[u]=null,delete o[u]};i.offClickIf?l=n.$watch(function(){return t(i.offClickIf)(e)},function(n){n&&a()||!n&&d()}):a(),e.$on("$destroy",function(){d(),l&&l(),f=null})}}}}]),angular.module("offClick").directive("offClickFilter",["OffClickFilterCache","$parse",function(n,t){var e=void 0;return{restrict:"A",compile:function(c,o){return function(c,i){e=t(o.offClickFilter)(c).split(",").map(function(n){return n.trim()}),e.forEach(function(t){n[t]?n[t].push(i[0]):n[t]=[i[0]]}),c.$on("$destroy",function(){e.forEach(function(t){angular.isArray(n[t])&&n[t].length>1?n[t].splice(n[t].indexOf(i[0]),1):(n[t]=null,delete n[t])}),i=null})}}}}]),angular.module("offClick").factory("OffClickFilterCache",function(){return{}});