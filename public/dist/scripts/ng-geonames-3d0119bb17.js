!function(e){"use strict";e.module("ngGeonames",[]).service("geonamesHelpers",["$q","$log","$timeout",function(n,t,r){function o(n,r){var o,a;if(e.isDefined(r))o=r;else if(0===Object.keys(n).length)o="mainGeonames";else if(Object.keys(n).length>=1)for(a in n)n.hasOwnProperty(a)&&(o=a);else t.error(s+"- You have more than 1 geonames on the DOM, you must provide the geonames ID to the geonamesData.getXXX call");return o}function a(t,r){var a,s=o(t,r);return e.isDefined(t[s])&&!0!==t[s].resolvedDefer?a=t[s].defer:(a=n.defer(),t[s]={defer:a,resolvedDefer:!1}),a}var s="[ng-geonames] ",i=function(n){return e.isString(n)&&""!==n},u=function(n){return e.isDefined(n)&&null!==n},c=function(e){return!u(e)};return{isTruthy:function(e){return"true"===e||!0===e},isEmpty:function(e){return 0===Object.keys(e).length},isUndefinedOrEmpty:function(n){return e.isUndefined(n)||null===n||0===Object.keys(n).length},isDefined:u,isUndefined:c,isNumber:e.isNumber,isString:i,isArray:e.isArray,isObject:e.isObject,isFunction:e.isFunction,equals:e.equals,getUnresolvedDefer:a,setResolvedDefer:function(e,n){e[o(e,n)].resolvedDefer=!0},obtainEffectiveGeonamesId:o}}])}(window.angular),function(e){"use strict";e.module("ngGeonames").factory("geonamesDefaults",["$q","geonamesHelpers",function(e,n){function t(){return{server:"http://api.geonames.org",maxRows:50,postalCode:!1,country:[],username:"demo"}}var r=n.isDefined,o=(n.isObject,n.obtainEffectiveGeonamesId),a={};return{reset:function(e){var n=o(a,e);"mainGeonames"!==n&&delete a[n]},getDefaults:function(e){var n=o(a,e);return a[n]},getGeonamesCreationDefaults:function(e){var n=o(a,e),t=a[n];return{server:t.server,maxRows:t.maxRows,postalCode:t.postalCode,country:t.country,username:t.username}},setDefaults:function(e,n){var s=t();r(e)&&(s.server=r(e.server)?e.server:s.server,s.maxRows=r(e.maxRows)?e.maxRows:s.maxRows,s.postalCode=r(e.postalCode)?e.postalCode:s.postalCode,s.country=r(e.country)?e.country:s.country,s.username=r(e.username)?e.username:s.username);var i=o(a,n);return a[i]=s,s}}}])}(window.angular),function(e){"use strict";e.module("ngGeonames").service("geonamesData",["$q","$log","geonamesHelpers",function(e,n,t){var r=t.getDefer,o=t.getUnresolvedDefer,a=t.setResolvedDefer,s={},i=this,u=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},c=["geonames"];c.forEach(function(e){s[e]={}}),this.unresolveGeonames=function(e){var n=t.obtainEffectiveGeonamesId(s.geonames,e);c.forEach(function(e){s[e][n]=void 0})},c.forEach(function(e){var n=u(e);i["set"+n]=function(n,t){o(s[e],t).resolve(n),a(s[e],t)},i["get"+n]=function(n){return r(s[e],n).promise}})}])}(window.angular),function(e){"use strict";e.module("ngGeonames").factory("geonamesService",["$log","$sce","$q","$http","geonamesHelpers","geonamesDefaults",function(n,t,r,o,a,s){var i=a.isDefined,u=e.isString,c=a.equals;return{query:function(a,l){var m=s.getDefaults(l),f=m.server,d=m.maxRows,g=m.postalCode,v=m.country,p=m.username,h=r.defer(),y=[],D=null,w={method:"JSONP",url:f,params:{},cancellable:!0};return i(a.q)&&u(a.q)&&""!==a.q&&(!0===g?(w.url+="/postalCodeLookupJSON",w.params.postalcode=a.q,D="postalcodes"):(w.url+="/searchJSON",w.params.q=a.q,D="geonames"),i(a.country)&&u(a.country)&&""!==a.country&&(v=a.country)),i(w.params)&&!c({},w.params)?(e.extend(w.params,{maxRows:d,country:v,username:p,jsonpCallbackParam:"callback"}),w.url=t.trustAsResourceUrl(w.url),o(w).then(function(t){i(t.data[D])?(e.forEach(t.data[D],function(e,n){switch(D){case"postalcodes":i(e.title)||(e.title="["+e.postalcode+"] "),i(e.locationName)||(e.locationName=e.countryCode+" "+e.placeName);break;case"geonames":i(e.title)||(e.title=e.name),i(e.locationName)||(e.locationName=e.countryName)}this.push(e)},y),h.resolve(y)):(h.reject("[Geonames] Invalid query: "+t.data.status+" "+t.data.statusText),n.warn(t))},function(e){h.reject("[Geonames] Request: "+(e.data.status+" "+e.data.statusText||"failed")),n.warn(e)})):(h.reject("[Geonames] Invalid query params"),n.warn(w)),h.promise}}}])}(window.angular),function(e){"use strict";e.module("ngGeonames").directive("geonames",["$q","geonamesData","geonamesDefaults","geonamesHelpers",function(e,n,t,r){return{restrict:"AE",replace:!1,scope:{defaults:"=",search:"=",id:"@"},transclude:!0,template:'<div class="angular-geonames"><div ng-transclude></div></div>',controller:["$scope",function(n){this._geonames=e.defer(),this.getGeonames=function(){return this._geonames.promise},this.getScope=function(){return n}}],link:function(e,r,o,a){n.isDefined,t.setDefaults(e.defaults,o.id);e.geonamesId=o.id;var s=t.getGeonamesCreationDefaults(o.id);a._geonames.resolve(s),n.setGeonames(s,o.id),e.$on("$destroy",function(){t.reset(o.id),n.unresolveGeonames(o.id)})}}}])}(window.angular),function(e){"use strict";e.module("ngGeonames").directive("search",["$log","$timeout","$http","geonamesHelpers","geonamesService",function(e,n,t,r,o){return{restrict:"A",scope:!1,replace:!1,require:["geonames"],link:function(t,a,s,i){var u=r.isDefined,c=r.isString,l=i[0].getScope();i[0].getGeonames().then(function(r){var a;l.$watch("search",function(r){if(!t.settingSearchFromGeonames)return u(r.q)&&c(r.q)&&""!==r.q&&r.q!==a?(t.settingSearchFromScope=!0,t.$broadcast("geonamesDirectiveSearch.find_start"),o.query(r,s.id).then(function(e){r.find=e,t.$broadcast("geonamesDirectiveSearch.find_end",e)},function(n){r.find=[],t.$broadcast("geonamesDirectiveSearch.find_end",[]),e.error("[ng-geonames]  [Search]  "+n+".")}),a=r.q,void n(function(){t.settingSearchFromScope=!1})):void 0},!0)})}}}])}(window.angular);