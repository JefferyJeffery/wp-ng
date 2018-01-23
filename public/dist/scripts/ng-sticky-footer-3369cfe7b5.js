!function(t){"use strict";t.module("ngStickyFooter",[]).directive("stickyFooter",["$window","$timeout",function(e,o){return{restrict:"AE",transclude:!1,scope:{stickyFooterWrapper:"@",stickyFooterContainer:"@",stickyFooterContent:"@",stickyFooterIf:"@"},link:function(i,r,n){function s(){null===c&&(c=o(function(){var t=r.outerHeight(),e=f.height()-p.position().top,o=u.outerHeight();!1!==a.ifWrapperHeight||o<e-t?(!1!==a.ifWrapperHeight?(p.css("bottom",t),p.css("height","")):(p.css("bottom",""),p.css("height",e-t)),l.style.position=!1!==a.footerContainer?"absolute":"relative",l.style.height="auto",l.style.marginLeft="0px",l.style.marginRight="0px",!1!==a.footerContainer&&(l.style.bottom="0px")):(p.css("bottom",""),p.css("height",""),l.style.position="",l.style.height="",l.style.marginLeft="",l.style.marginRight="",!1!==a.footerContainer&&(l.style.bottom="")),c=null},100))}var c=null,a={};a.wrapperName=i.stickyFooterWrapper||"sticky-footer-wrapper",a.footerContainer="true"===i.stickyFooterContainer||!1,a.contentName=i.stickyFooterContent||a.wrapperName,a.ifWrapperHeight="true"===i.stickyFooterIf||!1;var l=r[0],p=t.element("."+a.wrapperName),u=t.element("."+a.contentName),f=t.element(e);s(),new MutationObserver(function(t){s()}).observe(r[0],{childList:!0,subtree:!0}),i.$watch(function(){return p.height()},function(t,e){t!==e&&s()}),t.element(e).on("resize",s),i.$on("stickyFooterResizeAll",function(){s(),i.$apply()}),i.$on("$destroy",function(){t.element(e).off("resize",s)})}}}])}(window.angular);