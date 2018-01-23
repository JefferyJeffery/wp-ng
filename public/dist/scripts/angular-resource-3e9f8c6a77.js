!function(e,r){"use strict";function t(e){return null!=e&&""!==e&&"hasOwnProperty"!==e&&s.test("."+e)}function a(e,a){if(!t(a))throw o("badmember",'Dotted member path "@{0}" is invalid.',a);for(var n=a.split("."),s=0,i=n.length;s<i&&r.isDefined(e);s++){var u=n[s];e=null!==e?e[u]:void 0}return e}function n(e,t){t=t||{},r.forEach(t,function(e,r){delete t[r]});for(var a in e)!e.hasOwnProperty(a)||"$"===a.charAt(0)&&"$"===a.charAt(1)||(t[a]=e[a]);return t}var o=r.$$minErr("$resource"),s=/^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;r.module("ngResource",["ng"]).info({angularVersion:"1.6.4"}).provider("$resource",function(){var e=/^https?:\/\/\[[^\]]*][^\/]*/,t=this;this.defaults={stripTrailingSlashes:!0,cancellable:!1,actions:{get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},delete:{method:"DELETE"}}},this.$get=["$http","$log","$q","$timeout",function(s,i,u,c){function l(e,r){this.template=e,this.defaults=h({},t.defaults,r),this.urlParams={}}function p(e,r,b,w){function E(e,t){var n={};return t=h({},r,t),d(t,function(r,t){g(r)&&(r=r(e)),n[t]=r&&r.charAt&&"@"===r.charAt(0)?a(e,r.substr(1)):r}),n}function P(e){return e.resource}function A(e){n(e||{},this)}var R=new l(e,w);return b=h({},t.defaults.actions,b),A.prototype.toJSON=function(){var e=h({},this);return delete e.$promise,delete e.$resolved,delete e.$cancelRequest,e},d(b,function(e,r){var t=!0===e.hasBody||!1!==e.hasBody&&/^(POST|PUT|PATCH)$/i.test(e.method),a=e.timeout,l=v(e.cancellable)?e.cancellable:R.defaults.cancellable;a&&!y(a)&&(i.debug("ngResource:\n  Only numeric values are allowed as `timeout`.\n  Promises are not supported in $resource, because the same value would be used for multiple requests. If you are looking for a way to cancel requests, you should use the `cancellable` option."),delete e.timeout,a=null),A[r]=function(i,p,v,y){function b(e){z.catch(f),q.resolve(e)}var w,T,O,x={};switch(arguments.length){case 4:O=y,T=v;case 3:case 2:if(!g(p)){x=i,w=p,T=v;break}if(g(i)){T=i,O=p;break}T=p,O=v;case 1:g(i)?T=i:t?w=i:x=i;break;case 0:break;default:throw o("badargs","Expected up to 4 arguments [params, data, success, error], got {0} arguments",arguments.length)}var q,k,S=this instanceof A,j=S?w:e.isArray?[]:new A(w),D={},U=e.interceptor&&e.interceptor.response||P,W=e.interceptor&&e.interceptor.responseError||void 0,Q=!!O,V=!!W;d(e,function(e,r){switch(r){default:D[r]=m(e);break;case"params":case"isArray":case"interceptor":case"cancellable":}}),!S&&l&&(q=u.defer(),D.timeout=q.promise,a&&(k=c(q.resolve,a))),t&&(D.data=w),R.setUrlParams(D,h({},E(w,e.params||{}),x),e.url);var z=s(D).then(function(t){var a=t.data;if(a){if($(a)!==!!e.isArray)throw o("badcfg","Error in resource configuration for action `{0}`. Expected response to contain an {1} but got an {2} (Request: {3} {4})",r,e.isArray?"array":"object",$(a)?"array":"object",D.method,D.url);if(e.isArray)j.length=0,d(a,function(e){"object"==typeof e?j.push(new A(e)):j.push(e)});else{var s=j.$promise;n(a,j),j.$promise=s}}return t.resource=j,t});return z=z.finally(function(){j.$resolved=!0,!S&&l&&(j.$cancelRequest=f,c.cancel(k),q=k=D.timeout=null)}),z=z.then(function(e){var r=U(e);return(T||f)(r,e.headers,e.status,e.statusText),r},Q||V?function(e){return Q&&!V&&z.catch(f),Q&&O(e),V?W(e):u.reject(e)}:void 0),S?z:(j.$promise=z,j.$resolved=!1,l&&(j.$cancelRequest=b),j)},A.prototype["$"+r]=function(e,t,a){g(e)&&(a=t,t=e,e={});var n=A[r].call(this,e,this,t,a);return n.$promise||n}}),A.bind=function(t){var a=h({},r,t);return p(e,a,b,w)},A}var f=r.noop,d=r.forEach,h=r.extend,m=r.copy,$=r.isArray,v=r.isDefined,g=r.isFunction,y=r.isNumber,b=r.$$encodeUriQuery,w=r.$$encodeUriSegment;return l.prototype={setUrlParams:function(r,t,a){var n,s,i=this,u=a||i.template,c="",l=i.urlParams=Object.create(null);d(u.split(/\W/),function(e){if("hasOwnProperty"===e)throw o("badname","hasOwnProperty is not a valid parameter name.");!new RegExp("^\\d+$").test(e)&&e&&new RegExp("(^|[^\\\\]):"+e+"(\\W|$)").test(u)&&(l[e]={isQueryParamValue:new RegExp("\\?.*=:"+e+"(?:\\W|$)").test(u)})}),u=u.replace(/\\:/g,":"),u=u.replace(e,function(e){return c=e,""}),t=t||{},d(i.urlParams,function(e,r){n=t.hasOwnProperty(r)?t[r]:i.defaults[r],v(n)&&null!==n?(s=e.isQueryParamValue?b(n,!0):w(n),u=u.replace(new RegExp(":"+r+"(\\W|$)","g"),function(e,r){return s+r})):u=u.replace(new RegExp("(/?):"+r+"(\\W|$)","g"),function(e,r,t){return"/"===t.charAt(0)?t:r+t})}),i.defaults.stripTrailingSlashes&&(u=u.replace(/\/+$/,"")||"/"),u=u.replace(/\/\.(?=\w+($|\?))/,"."),r.url=c+u.replace(/\/(\\|%5C)\./,"/."),d(t,function(e,t){i.urlParams[t]||(r.params=r.params||{},r.params[t]=e)})}},p}]})}(window,window.angular);