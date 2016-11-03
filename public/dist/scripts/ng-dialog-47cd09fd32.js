!function(e,a){"undefined"!=typeof module&&module.exports?(a("undefined"==typeof angular?require("angular"):angular),module.exports="ngDialog"):"function"==typeof define&&define.amd?define(["angular"],a):a(e.angular)}(this,function(e){"use strict";var a=e.module("ngDialog",[]),o=e.element,n=e.isDefined,t=(document.body||document.documentElement).style,l=n(t.animation)||n(t.WebkitAnimation)||n(t.MozAnimation)||n(t.MsAnimation)||n(t.OAnimation),i="animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",r="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",s="ngdialog-disabled-animation",d={html:!1,body:!1},c={},g=[],u=!1,f=!1;return a.provider("ngDialog",function(){var a=this.defaults={className:"ngdialog-theme-default",appendClassName:"",disableAnimation:!1,plain:!1,showClose:!0,closeByDocument:!0,closeByEscape:!0,closeByNavigation:!1,appendTo:!1,preCloseCallback:!1,overlay:!0,cache:!0,trapFocus:!0,preserveFocus:!0,ariaAuto:!0,ariaRole:null,ariaLabelledById:null,ariaLabelledBySelector:null,ariaDescribedById:null,ariaDescribedBySelector:null,bodyClassName:"ngdialog-open",width:null,height:null};this.setForceHtmlReload=function(e){d.html=e||!1},this.setForceBodyReload=function(e){d.body=e||!1},this.setDefaults=function(o){e.extend(a,o)},this.setOpenOnePerName=function(e){f=e||!1};var n,t=0,p=0,m={};this.$get=["$document","$templateCache","$compile","$q","$http","$rootScope","$timeout","$window","$controller","$injector",function(y,b,v,h,D,C,$,A,E,w){var B=[],S={onDocumentKeydown:function(e){27===e.keyCode&&k.close("$escape")},activate:function(e){var a=e.data("$ngDialogOptions");a.trapFocus&&(e.on("keydown",S.onTrapFocusKeydown),B.body.on("keydown",S.onTrapFocusKeydown))},deactivate:function(e){e.off("keydown",S.onTrapFocusKeydown),B.body.off("keydown",S.onTrapFocusKeydown)},deactivateAll:function(a){e.forEach(a,function(a){var o=e.element(a);S.deactivate(o)})},setBodyPadding:function(e){var a=parseInt(B.body.css("padding-right")||0,10);B.body.css("padding-right",a+e+"px"),B.body.data("ng-dialog-original-padding",a),C.$broadcast("ngDialog.setPadding",e)},resetBodyPadding:function(){var e=B.body.data("ng-dialog-original-padding");e?B.body.css("padding-right",e+"px"):B.body.css("padding-right",""),C.$broadcast("ngDialog.setPadding",0)},performCloseDialog:function(e,a){var o=e.data("$ngDialogOptions"),t=e.attr("id"),r=c[t];if(r){if("undefined"!=typeof A.Hammer){var s=r.hammerTime;s.off("tap",n),s.destroy&&s.destroy(),delete r.hammerTime}else e.unbind("click");1===p&&B.body.unbind("keydown",S.onDocumentKeydown),e.hasClass("ngdialog-closing")||(p-=1);var d=e.data("$ngDialogPreviousFocus");d&&d.focus&&d.focus(),C.$broadcast("ngDialog.closing",e,a),p=p<0?0:p,l&&!o.disableAnimation?(r.$destroy(),e.unbind(i).bind(i,function(){S.closeDialogElement(e,a)}).addClass("ngdialog-closing")):(r.$destroy(),S.closeDialogElement(e,a)),m[t]&&(m[t].resolve({id:t,value:a,$dialog:e,remainingDialogs:p}),delete m[t]),c[t]&&delete c[t],g.splice(g.indexOf(t),1),g.length||(B.body.unbind("keydown",S.onDocumentKeydown),u=!1)}},closeDialogElement:function(e,a){var o=e.data("$ngDialogOptions");e.remove(),0===p&&(B.html.removeClass(o.bodyClassName),B.body.removeClass(o.bodyClassName),S.resetBodyPadding()),C.$broadcast("ngDialog.closed",e,a)},closeDialog:function(a,o){var n=a.data("$ngDialogPreCloseCallback");if(n&&e.isFunction(n)){var t=n.call(a,o);if(e.isObject(t))t.closePromise?t.closePromise.then(function(){S.performCloseDialog(a,o)},function(){return!1}):t.then(function(){S.performCloseDialog(a,o)},function(){return!1});else{if(t===!1)return!1;S.performCloseDialog(a,o)}}else S.performCloseDialog(a,o)},onTrapFocusKeydown:function(a){var o,n=e.element(a.currentTarget);if(n.hasClass("ngdialog"))o=n;else if(o=S.getActiveDialog(),null===o)return;var t=9===a.keyCode,l=a.shiftKey===!0;t&&S.handleTab(o,a,l)},handleTab:function(e,a,o){var n=S.getFocusableElements(e);if(0===n.length)return void(document.activeElement&&document.activeElement.blur&&document.activeElement.blur());var t=document.activeElement,l=Array.prototype.indexOf.call(n,t),i=l===-1,r=0===l,s=l===n.length-1,d=!1;o?(i||r)&&(n[n.length-1].focus(),d=!0):(i||s)&&(n[0].focus(),d=!0),d&&(a.preventDefault(),a.stopPropagation())},autoFocus:function(e){var a=e[0],n=a.querySelector("*[autofocus]");if(null===n||(n.focus(),document.activeElement!==n)){var t=S.getFocusableElements(e);if(t.length>0)return void t[0].focus();var l=S.filterVisibleElements(a.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));if(l.length>0){var i=l[0];o(i).attr("tabindex","-1").css("outline","0"),i.focus()}}},getFocusableElements:function(e){var a=e[0],o=a.querySelectorAll(r),n=S.filterTabbableElements(o);return S.filterVisibleElements(n)},filterTabbableElements:function(e){for(var a=[],n=0;n<e.length;n++){var t=e[n];"-1"!==o(t).attr("tabindex")&&a.push(t)}return a},filterVisibleElements:function(e){for(var a=[],o=0;o<e.length;o++){var n=e[o];(n.offsetWidth>0||n.offsetHeight>0)&&a.push(n)}return a},getActiveDialog:function(){var e=document.querySelectorAll(".ngdialog");return 0===e.length?null:o(e[e.length-1])},applyAriaAttributes:function(e,a){if(a.ariaAuto){if(!a.ariaRole){var o=S.getFocusableElements(e).length>0?"dialog":"alertdialog";a.ariaRole=o}a.ariaLabelledBySelector||(a.ariaLabelledBySelector="h1,h2,h3,h4,h5,h6"),a.ariaDescribedBySelector||(a.ariaDescribedBySelector="article,section,p")}a.ariaRole&&e.attr("role",a.ariaRole),S.applyAriaAttribute(e,"aria-labelledby",a.ariaLabelledById,a.ariaLabelledBySelector),S.applyAriaAttribute(e,"aria-describedby",a.ariaDescribedById,a.ariaDescribedBySelector)},applyAriaAttribute:function(e,a,n,t){if(n&&e.attr(a,n),t){var l=e.attr("id"),i=e[0].querySelector(t);if(!i)return;var r=l+"-"+a;return o(i).attr("id",r),e.attr(a,r),r}},detectUIRouter:function(){try{return e.module("ui.router"),!0}catch(e){return!1}},getRouterLocationEventName:function(){return S.detectUIRouter()?"$stateChangeStart":"$locationChangeStart"}},k={__PRIVATE__:S,open:function(l){function i(e,a){return C.$broadcast("ngDialog.templateLoading",e),D.get(e,a||{}).then(function(a){return C.$broadcast("ngDialog.templateLoaded",e),a.data||""})}function r(a){return a?e.isString(a)&&y.plain?a:"boolean"!=typeof y.cache||y.cache?i(a,{cache:b}):i(a,{cache:!1}):"Empty template"}var d=null;if(l=l||{},!(f&&l.name&&(d=l.name.toLowerCase().replace(/\s/g,"-")+"-dialog",this.isOpen(d)))){var y=e.copy(a),F=++t;d=d||"ngdialog"+F,g.push(d),"undefined"!=typeof y.data&&("undefined"==typeof l.data&&(l.data={}),l.data=e.merge(e.copy(y.data),l.data)),e.extend(y,l);var T;m[d]=T=h.defer();var N;c[d]=N=e.isObject(y.scope)?y.scope.$new():C.$new();var P,O,x,I=e.extend({},y.resolve);return e.forEach(I,function(a,o){I[o]=e.isString(a)?w.get(a):w.invoke(a,null,null,o)}),h.all({template:r(y.template||y.templateUrl),locals:h.all(I)}).then(function(a){var t=a.template,l=a.locals;y.showClose&&(t+='<div class="ngdialog-close"></div>');var i=y.overlay?"":" ngdialog-no-overlay";if(P=o('<div id="'+d+'" class="ngdialog'+i+'"></div>'),P.html(y.overlay?'<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">'+t+"</div>":'<div class="ngdialog-content" role="document">'+t+"</div>"),P.data("$ngDialogOptions",y),N.ngDialogId=d,y.data&&e.isString(y.data)){var r=y.data.replace(/^\s*/,"")[0];N.ngDialogData="{"===r||"["===r?e.fromJson(y.data):new String(y.data),N.ngDialogData.ngDialogId=d}else y.data&&e.isObject(y.data)&&(N.ngDialogData=y.data,N.ngDialogData.ngDialogId=d);if(y.className&&P.addClass(y.className),y.appendClassName&&P.addClass(y.appendClassName),y.width&&(x=P[0].querySelector(".ngdialog-content"),e.isString(y.width)?x.style.width=y.width:x.style.width=y.width+"px"),y.height&&(x=P[0].querySelector(".ngdialog-content"),e.isString(y.height)?x.style.height=y.height:x.style.height=y.height+"px"),y.disableAnimation&&P.addClass(s),O=y.appendTo&&e.isString(y.appendTo)?e.element(document.querySelector(y.appendTo)):B.body,S.applyAriaAttributes(P,y),y.preCloseCallback){var c;e.isFunction(y.preCloseCallback)?c=y.preCloseCallback:e.isString(y.preCloseCallback)&&N&&(e.isFunction(N[y.preCloseCallback])?c=N[y.preCloseCallback]:N.$parent&&e.isFunction(N.$parent[y.preCloseCallback])?c=N.$parent[y.preCloseCallback]:C&&e.isFunction(C[y.preCloseCallback])&&(c=C[y.preCloseCallback])),c&&P.data("$ngDialogPreCloseCallback",c)}if(N.closeThisDialog=function(e){S.closeDialog(P,e)},y.controller&&(e.isString(y.controller)||e.isArray(y.controller)||e.isFunction(y.controller))){var g;y.controllerAs&&e.isString(y.controllerAs)&&(g=y.controllerAs);var f=E(y.controller,e.extend(l,{$scope:N,$element:P}),!0,g);y.bindToController&&e.extend(f.instance,{ngDialogId:N.ngDialogId,ngDialogData:N.ngDialogData,closeThisDialog:N.closeThisDialog,confirm:N.confirm}),"function"==typeof f?P.data("$ngDialogControllerController",f()):P.data("$ngDialogControllerController",f)}if($(function(){var e=document.querySelectorAll(".ngdialog");S.deactivateAll(e),v(P)(N);var a=A.innerWidth-B.body.prop("clientWidth");B.html.addClass(y.bodyClassName),B.body.addClass(y.bodyClassName);var o=a-(A.innerWidth-B.body.prop("clientWidth"));o>0&&S.setBodyPadding(o),O.append(P),S.activate(P),y.trapFocus&&S.autoFocus(P),y.name?C.$broadcast("ngDialog.opened",{dialog:P,name:y.name}):C.$broadcast("ngDialog.opened",P)}),u||(B.body.bind("keydown",S.onDocumentKeydown),u=!0),y.closeByNavigation){var m=S.getRouterLocationEventName();C.$on(m,function(e){S.closeDialog(P)===!1&&e.preventDefault()})}if(y.preserveFocus&&P.data("$ngDialogPreviousFocus",document.activeElement),n=function(e){var a=!!y.closeByDocument&&o(e.target).hasClass("ngdialog-overlay"),n=o(e.target).hasClass("ngdialog-close");(a||n)&&k.close(P.attr("id"),n?"$closeButton":"$document")},"undefined"!=typeof A.Hammer){var b=N.hammerTime=A.Hammer(P[0]);b.on("tap",n)}else P.bind("click",n);return p+=1,k}),{id:d,closePromise:T.promise,close:function(e){S.closeDialog(P,e)}}}},openConfirm:function(n){var t=h.defer(),l=e.copy(a);n=n||{},"undefined"!=typeof l.data&&("undefined"==typeof n.data&&(n.data={}),n.data=e.merge(e.copy(l.data),n.data)),e.extend(l,n),l.scope=e.isObject(l.scope)?l.scope.$new():C.$new(),l.scope.confirm=function(e){t.resolve(e);var a=o(document.getElementById(i.id));S.performCloseDialog(a,e)};var i=k.open(l);if(i)return i.closePromise.then(function(e){return e?t.reject(e.value):t.reject()}),t.promise},isOpen:function(e){var a=o(document.getElementById(e));return a.length>0},close:function(e,a){var n=o(document.getElementById(e));if(n.length)S.closeDialog(n,a);else if("$escape"===e){var t=g[g.length-1];n=o(document.getElementById(t)),n.data("$ngDialogOptions").closeByEscape&&S.closeDialog(n,"$escape")}else k.closeAll(a);return k},closeAll:function(e){for(var a=document.querySelectorAll(".ngdialog"),n=a.length-1;n>=0;n--){var t=a[n];S.closeDialog(o(t),e)}},getOpenDialogs:function(){return g},getDefaults:function(){return a}};return e.forEach(["html","body"],function(e){if(B[e]=y.find(e),d[e]){var a=S.getRouterLocationEventName();C.$on(a,function(){B[e]=y.find(e)})}}),k}]}),a.directive("ngDialog",["ngDialog",function(a){return{restrict:"A",scope:{ngDialogScope:"="},link:function(o,n,t){n.on("click",function(n){n.preventDefault();var l=e.isDefined(o.ngDialogScope)?o.ngDialogScope:"noScope";e.isDefined(t.ngDialogClosePrevious)&&a.close(t.ngDialogClosePrevious);var i=a.getDefaults();a.open({template:t.ngDialog,className:t.ngDialogClass||i.className,appendClassName:t.ngDialogAppendClass,controller:t.ngDialogController,controllerAs:t.ngDialogControllerAs,bindToController:t.ngDialogBindToController,scope:l,data:t.ngDialogData,showClose:"false"!==t.ngDialogShowClose&&("true"===t.ngDialogShowClose||i.showClose),closeByDocument:"false"!==t.ngDialogCloseByDocument&&("true"===t.ngDialogCloseByDocument||i.closeByDocument),closeByEscape:"false"!==t.ngDialogCloseByEscape&&("true"===t.ngDialogCloseByEscape||i.closeByEscape),overlay:"false"!==t.ngDialogOverlay&&("true"===t.ngDialogOverlay||i.overlay),preCloseCallback:t.ngDialogPreCloseCallback||i.preCloseCallback,bodyClassName:t.ngDialogBodyClass||i.bodyClassName})})}}}]),a});