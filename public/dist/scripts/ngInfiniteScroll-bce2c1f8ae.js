!function(n,e){if("function"==typeof define&&define.amd)define(["module","exports","angular"],e);else if("undefined"!=typeof exports)e(module,exports,require("angular"));else{var t={exports:{}};e(t,t.exports,n.angular),n.infiniteScroll=t.exports}}(this,function(n,e,t){"use strict";function i(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(e,"__esModule",{value:!0});var l=i(t),o="infinite-scroll";l.default.module(o,[]).value("THROTTLE_MILLISECONDS",null).directive("infiniteScroll",["$rootScope","$window","$interval","THROTTLE_MILLISECONDS",function(n,e,t,i){return{scope:{infiniteScroll:"&",infiniteScrollContainer:"=",infiniteScrollDistance:"=",infiniteScrollDisabled:"=",infiniteScrollUseDocumentBottom:"=",infiniteScrollListenForEvent:"@"},link:function(o,r,c){function u(n){var e=n[0]||n;return isNaN(e.offsetHeight)?e.document.documentElement.clientHeight:e.offsetHeight}function f(n){var e=n[0]||n;return isNaN(window.pageYOffset)?e.document.documentElement.scrollTop:e.ownerDocument.defaultView.pageYOffset}function a(n){if(n[0].getBoundingClientRect&&!n.css("none"))return n[0].getBoundingClientRect().top+f(n)}function d(){var e=void 0,i=void 0;if(y===w)e=u(y)+f(y[0].document.documentElement),i=a(r)+u(r);else{e=u(y);var l=0;void 0!==a(y)&&(l=a(y)),i=a(r)-l+u(r)}L&&(i=u((r[0].ownerDocument||r[0].document).documentElement));var c=i-e,d=c<=u(y)*D+1;d?(T=!0,E&&(o.$$phase||n.$$phase?o.infiniteScroll():o.$apply(o.infiniteScroll))):(x&&t.cancel(x),T=!1)}function s(n,e){function i(){return r=(new Date).getTime(),t.cancel(o),o=null,n.call()}function l(){var l=(new Date).getTime(),c=e-(l-r);c<=0?(t.cancel(o),o=null,r=l,n.call()):o||(o=t(i,c,1))}var o=null,r=0;return l}function m(){y.unbind("scroll",O),null!=b&&(b(),b=null),x&&t.cancel(x)}function S(n){D=parseFloat(n)||0}function p(n){E=!n,E&&T&&(T=!1,O())}function v(n){L=n}function g(n){null!=y&&y.unbind("scroll",O),y=n,null!=n&&y.bind("scroll",O)}function $(n){if(null!=n&&0!==n.length){var e=void 0;if(e=n.nodeType&&1===n.nodeType?l.default.element(n):"function"==typeof n.append?l.default.element(n[n.length-1]):"string"==typeof n?l.default.element(document.querySelector(n)):n,null==e)throw new Error("invalid infinite-scroll-container attribute.");g(e)}}function h(){return C&&O(),t.cancel(x)}var w=l.default.element(e),D=null,E=null,T=null,y=null,C=!0,L=!1,b=null,x=!1,O=null!=i?s(d,i):d;return o.$on("$destroy",m),o.$watch("infiniteScrollDistance",S),S(o.infiniteScrollDistance),o.$watch("infiniteScrollDisabled",p),p(o.infiniteScrollDisabled),o.$watch("infiniteScrollUseDocumentBottom",v),v(o.infiniteScrollUseDocumentBottom),g(w),o.infiniteScrollListenForEvent&&(b=n.$on(o.infiniteScrollListenForEvent,O)),o.$watch("infiniteScrollContainer",$),$(o.infiniteScrollContainer||[]),null!=c.infiniteScrollParent&&g(l.default.element(r.parent())),null!=c.infiniteScrollImmediateCheck&&(C=o.$eval(c.infiniteScrollImmediateCheck)),x=t(h)}}}]),e.default=o,n.exports=e.default});