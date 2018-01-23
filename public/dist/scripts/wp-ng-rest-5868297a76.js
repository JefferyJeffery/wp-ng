!function(e,t,n){"use strict";function r(e,t){return("string"==typeof t||t instanceof String)&&(t=new RegExp(t)),t instanceof RegExp?t.test(e):t&&Array.isArray(t.and)?t.and.every(function(t){return r(e,t)}):t&&Array.isArray(t.or)?t.or.some(function(t){return r(e,t)}):!(!t||!t.not)&&!r(e,t.not)}function i(e,t){return("string"==typeof t||t instanceof String)&&(t=new RegExp(t)),t instanceof RegExp?t.exec(e):t&&Array.isArray(t)?t.reduce(function(t,n){return t||i(e,n)},null):null}n&&n.module("reTree",[]).factory("reTree",[function(){return{test:r,exec:i}}]),t&&(t.reTree={test:r,exec:i}),e&&(e.exports={test:r,exec:i})}("undefined"==typeof module?null:module,"undefined"==typeof window?null:window,"undefined"==typeof angular?null:angular),function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.Sifter=t()}(this,function(){var e=function(e,t){this.items=e,this.settings=t||{diacritics:!0}};e.prototype.tokenize=function(e){if(!(e=i(String(e||"").toLowerCase()))||!e.length)return[];var t,n,r,o,a=[],c=e.split(/ +/);for(t=0,n=c.length;t<n;t++){if(r=s(c[t]),this.settings.diacritics)for(o in u)u.hasOwnProperty(o)&&(r=r.replace(new RegExp(o,"g"),u[o]));a.push({string:c[t],regex:new RegExp(r,"i")})}return a},e.prototype.iterator=function(e,t){var n;n=o(e)?Array.prototype.forEach||function(e){for(var t=0,n=this.length;t<n;t++)e(this[t],t,this)}:function(e){for(var t in this)this.hasOwnProperty(t)&&e(this[t],t,this)},n.apply(e,[t])},e.prototype.getScoreFunction=function(e,t){var n,i,s,o,u;n=this,e=n.prepareSearch(e,t),s=e.tokens,i=e.options.fields,o=s.length,u=e.options.nesting;var a=function(e,t){var n,r;return e?(e=String(e||""),-1===(r=e.search(t.regex))?0:(n=t.string.length/e.length,0===r&&(n+=.5),n)):0},c=function(){var e=i.length;return e?1===e?function(e,t){return a(r(t,i[0],u),e)}:function(t,n){for(var s=0,o=0;s<e;s++)o+=a(r(n,i[s],u),t);return o/e}:function(){return 0}}();return o?1===o?function(e){return c(s[0],e)}:"and"===e.options.conjunction?function(e){for(var t,n=0,r=0;n<o;n++){if((t=c(s[n],e))<=0)return 0;r+=t}return r/o}:function(e){for(var t=0,n=0;t<o;t++)n+=c(s[t],e);return n/o}:function(){return 0}},e.prototype.getSortFunction=function(e,n){var i,s,o,u,a,c,f,g,l,p,d;if(o=this,e=o.prepareSearch(e,n),d=!e.query&&n.sort_empty||n.sort,l=function(e,t){return"$score"===e?t.score:r(o.items[t.id],e,n.nesting)},a=[],d)for(i=0,s=d.length;i<s;i++)(e.query||"$score"!==d[i].field)&&a.push(d[i]);if(e.query){for(p=!0,i=0,s=a.length;i<s;i++)if("$score"===a[i].field){p=!1;break}p&&a.unshift({field:"$score",direction:"desc"})}else for(i=0,s=a.length;i<s;i++)if("$score"===a[i].field){a.splice(i,1);break}for(g=[],i=0,s=a.length;i<s;i++)g.push("desc"===a[i].direction?-1:1);return c=a.length,c?1===c?(u=a[0].field,f=g[0],function(e,n){return f*t(l(u,e),l(u,n))}):function(e,n){var r,i,s;for(r=0;r<c;r++)if(s=a[r].field,i=g[r]*t(l(s,e),l(s,n)))return i;return 0}:null},e.prototype.prepareSearch=function(e,t){if("object"==typeof e)return e;t=n({},t);var r=t.fields,i=t.sort,s=t.sort_empty;return r&&!o(r)&&(t.fields=[r]),i&&!o(i)&&(t.sort=[i]),s&&!o(s)&&(t.sort_empty=[s]),{options:t,query:String(e||"").toLowerCase(),tokens:this.tokenize(e),total:0,items:[]}},e.prototype.search=function(e,t){var n,r,i,s,o=this;return r=this.prepareSearch(e,t),t=r.options,e=r.query,s=t.score||o.getScoreFunction(r),e.length?o.iterator(o.items,function(e,i){n=s(e),(!1===t.filter||n>0)&&r.items.push({score:n,id:i})}):o.iterator(o.items,function(e,t){r.items.push({score:1,id:t})}),i=o.getSortFunction(r,t),i&&r.items.sort(i),r.total=r.items.length,"number"==typeof t.limit&&(r.items=r.items.slice(0,t.limit)),r};var t=function(e,t){return"number"==typeof e&&"number"==typeof t?e>t?1:e<t?-1:0:(e=a(String(e||"")),t=a(String(t||"")),e>t?1:t>e?-1:0)},n=function(e,t){var n,r,i,s;for(n=1,r=arguments.length;n<r;n++)if(s=arguments[n])for(i in s)s.hasOwnProperty(i)&&(e[i]=s[i]);return e},r=function(e,t,n){if(e&&t){if(!n)return e[t];for(var r=t.split(".");r.length&&(e=e[r.shift()]););return e}},i=function(e){return(e+"").replace(/^\s+|\s+$|/g,"")},s=function(e){return(e+"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")},o=Array.isArray||"undefined"!=typeof $&&$.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},u={a:"[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]",b:"[b␢βΒB฿𐌁ᛒ]",c:"[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]",d:"[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]",e:"[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]",f:"[fƑƒḞḟ]",g:"[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]",h:"[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]",i:"[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]",j:"[jȷĴĵɈɉʝɟʲ]",k:"[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]",l:"[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]",n:"[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]",o:"[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]",p:"[pṔṕṖṗⱣᵽƤƥᵱ]",q:"[qꝖꝗʠɊɋꝘꝙq̃]",r:"[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]",s:"[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]",t:"[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]",u:"[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]",v:"[vṼṽṾṿƲʋꝞꝟⱱʋ]",w:"[wẂẃẀẁŴŵẄẅẆẇẈẉ]",x:"[xẌẍẊẋχ]",y:"[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]",z:"[zŹźẐẑŽžŻżẒẓẔẕƵƶ]"},a=function(){var e,t,n,r,i="",s={};for(n in u)if(u.hasOwnProperty(n))for(r=u[n].substring(2,u[n].length-1),i+=r,e=0,t=r.length;e<t;e++)s[r.charAt(e)]=n;var o=new RegExp("["+i+"]","g");return function(e){return e.replace(o,function(e){return s[e]}).toLowerCase()}}();return e}),function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.MicroPlugin=t()}(this,function(){var e={};e.mixin=function(e){e.plugins={},e.prototype.initializePlugins=function(e){var n,r,i,s=this,o=[];if(s.plugins={names:[],settings:{},requested:{},loaded:{}},t.isArray(e))for(n=0,r=e.length;n<r;n++)"string"==typeof e[n]?o.push(e[n]):(s.plugins.settings[e[n].name]=e[n].options,o.push(e[n].name));else if(e)for(i in e)e.hasOwnProperty(i)&&(s.plugins.settings[i]=e[i],o.push(i));for(;o.length;)s.require(o.shift())},e.prototype.loadPlugin=function(t){var n=this,r=n.plugins,i=e.plugins[t];if(!e.plugins.hasOwnProperty(t))throw new Error('Unable to find "'+t+'" plugin');r.requested[t]=!0,r.loaded[t]=i.fn.apply(n,[n.plugins.settings[t]||{}]),r.names.push(t)},e.prototype.require=function(e){var t=this,n=t.plugins;if(!t.plugins.loaded.hasOwnProperty(e)){if(n.requested[e])throw new Error('Plugin has circular dependency ("'+e+'")');t.loadPlugin(e)}return n.loaded[e]},e.define=function(t,n){e.plugins[t]={name:t,fn:n}}};var t={isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)}};return e}),function(e){"use strict";var t=["ngResource"],n=e.module("wpNgRest",t);n.config(["$resourceProvider","$httpProvider",function(e,t){e.defaults.cancellable=!0,t.interceptors.push("wpNgRestHttpInterceptor")}]),n.provider("wpNgRest",[function(){this.nonce={key:"X-WP-NG-Nonce",val:""},this.rest={url:"localhost/",path:""},this.lang={key:"X-WP-NG-Lang",val:""},this.$get=["$http",function(e){var t=this.nonce,n=this.rest,r=this.lang;return e.defaults.useXDomain=!0,{getNonce:function(){return t},getRest:function(){return n},getLang:function(){return r}}}],this.setNonce=function(e){this.nonce=e},this.setRest=function(e){this.rest=e},this.setLang=function(e){this.lang=e}}]),n.factory("wpNgRestStatus",["$rootScope","wpNgRest",function(t,n){var r=n.getNonce(),i={reset:function(){return{success:!1,statusCode:null,code:null,message:null}},setNonce:function(e){r=e},getNonce:function(){return r},setSuccess:function(t){var n=i.reset();return n.success=!0,n.statusCode=t.status,e.isDefined(t.messages)&&e.isArray(t.messages)?(n.code=t.messages[0].code,n.message=t.messages[0].message):e.isDefined(t.message)&&e.isObject(t.message)?(n.code=t.message.code,n.message=t.message.message):e.isDefined(t.message)&&e.isString(t.message)&&(n.message=t.message),n},setError:function(t){var n=i.reset();return n.statusCode=t.status,e.isDefined(t.data)&&e.isObject(t.data)?(n.code=t.data.code,n.message=t.data.message,e.isDefined(t.data.data)&&e.isObject(t.data.data)&&e.isDefined(t.data.data.errors)&&(n.errors=t.data.data.errors)):(n.code=t.status,n.message="An error occured on the request."),n},sendEvent:function(e,n){t.$broadcast(e,n)}};return i}]),n.factory("wpNgRestHttpInterceptor",["$injector",function(t){return{request:function(n){if(!e.isString(n.url))return n;var r=t.get("wpNgRest"),i=r.getRest().url+r.getRest().path;if(n.url.indexOf(i)>=0){var s=t.get("wpNgRestStatus"),o=s.getNonce(),u=r.getLang();e.isDefined(o.key)&&e.isString(o.key)&&e.isDefined(o.val)&&e.isString(o.val)&&o.key.length>0&&o.val.length>0&&(n.headers[o.key]=o.val),e.isDefined(u.key)&&e.isString(u.key)&&e.isDefined(u.val)&&e.isString(u.val)&&u.key.length>0&&u.val.length>0&&(n.headers[u.key]=u.val),n.headers["If-Modified-Since"]="0",n.headers["cache-control"]="private, max-age=0, no-cache"}return n},response:function(e){var n=t.get("wpNgRestStatus"),r=n.getNonce(),i=e.headers(r.key);return i&&i!==r.val&&(r.val=i,n.setNonce(r)),e},responseError:function(e){var n=t.get("$q");if(406!==e.status)return n.reject(e);t.get("$window").location.reload()}}}])}(angular);