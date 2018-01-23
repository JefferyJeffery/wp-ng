!function(e,t){"function"==typeof define&&define.amd?define(["angular"],t):"object"==typeof module&&module.exports?module.exports=t(require("angular")):t(e.angular)}(this,function(e){e.module("pageslide-directive",[]).directive("pageslide",["$document","$timeout",function(t,s){return{restrict:"EA",transclude:!1,scope:{psOpen:"=?",psAutoClose:"@",psSide:"@",psSpeed:"@",psClass:"@",psSize:"@",psZindex:"@",psPush:"@",psContainer:"@",psKeyListener:"@",psBodyClass:"@",psClickOutside:"@",onopen:"&?",onclose:"&?"},link:function(o,i,n){function l(e){var t=e.touches&&e.touches[0]||e.target;g&&f.contains(t)&&!h.contains(t)&&(g=!1,o.psOpen=!1,o.$apply()),o.psOpen&&(g=!0)}function p(e){if(u.bodyClass){var t=u.className+"-body",s=new RegExp(t+"-closed|"+t+"-open");f.className=f.className.replace(s,"");var o=t+"-"+e;" "!==f.className[f.className.length-1]?f.className+=" "+o:f.className+=o}}function a(){o.psOpen?"function"==typeof o.onopen&&o.onopen()():"function"==typeof o.onclose&&o.onclose()()}function r(){switch(u.side){case"right":h.style.width=u.size,h.style.height="100%",h.style.top="0px",h.style.bottom="0px",h.style.right="0px";break;case"left":h.style.width=u.size,h.style.height="100%",h.style.top="0px",h.style.bottom="0px",h.style.left="0px";break;case"top":h.style.height=u.size,h.style.width="100%",h.style.left="0px",h.style.top="0px",h.style.right="0px";break;case"bottom":h.style.height=u.size,h.style.width="100%",h.style.bottom="0px",h.style.left="0px",h.style.right="0px"}}function c(e,s){switch(s.side){case"right":e.style.right="-"+s.size,s.push&&(f.style.right="0px",f.style.left="0px");break;case"left":e.style.left="-"+s.size,s.push&&(f.style.left="0px",f.style.right="0px");break;case"top":e.style.top="-"+s.size,s.push&&(f.style.top="0px",f.style.bottom="0px");break;case"bottom":e.style.bottom="-"+s.size,s.push&&(f.style.bottom="0px",f.style.top="0px")}s.keyListener&&t.off("keydown",y),s.clickOutside&&t.off("touchend click",l),g=!1,p("closed"),o.psOpen=!1}function d(e,s){switch(s.side){case"right":e.style.right="0px",s.push&&(f.style.right=s.size,f.style.left="-"+s.size);break;case"left":e.style.left="0px",s.push&&(f.style.left=s.size,f.style.right="-"+s.size);break;case"top":e.style.top="0px",s.push&&(f.style.top=s.size,f.style.bottom="-"+s.size);break;case"bottom":e.style.bottom="0px",s.push&&(f.style.bottom=s.size,f.style.top="-"+s.size)}o.psOpen=!0,s.keyListener&&t.on("keydown",y),s.clickOutside&&t.on("touchend click",l),p("open")}function y(e){27===(e.keyCode||e.which)&&(c(h,u),s(function(){o.$apply()}))}var u={};u.side=o.psSide||"right",u.speed=o.psSpeed||"0.5",u.size=o.psSize||"300px",u.zindex=o.psZindex||1e3,u.className=o.psClass||"ng-pageslide",u.push="true"===o.psPush,u.container=o.psContainer||!1,u.keyListener="true"===o.psKeyListener,u.bodyClass=o.psBodyClass||!1,u.clickOutside="false"!==o.psClickOutside,u.autoClose=o.psAutoClose||!1,u.push=u.push&&!u.container,i.addClass(u.className);var h,f,g=!1;if(f=u.container?document.getElementById(u.container):document.body,p("closed"),h=i[0],"div"!==h.tagName.toLowerCase()&&"pageslide"!==h.tagName.toLowerCase())throw new Error("Pageslide can only be applied to <div> or <pageslide> elements");if(0===h.children.length)throw new Error("You need to have content inside the <pageslide>");e.element(h.children),f.appendChild(h),h.style.zIndex=u.zindex,h.style.position="fixed",h.style.transitionDuration=u.speed+"s",h.style.webkitTransitionDuration=u.speed+"s",h.style.height=u.size,h.style.transitionProperty="top, bottom, left, right",u.push&&(f.style.position="absolute",f.style.transitionDuration=u.speed+"s",f.style.webkitTransitionDuration=u.speed+"s",f.style.transitionProperty="top, bottom, left, right"),u.container&&(h.style.position="absolute",f.style.position="relative",f.style.overflow="hidden"),h.addEventListener("transitionend",a),r(),o.$watch("psOpen",function(e){e?d(h,u):c(h,u)}),o.$watch("psSize",function(e,t){t!==e&&(u.size=e,r())}),o.$on("$destroy",function(){h.parentNode===f&&(u.clickOutside&&t.off("touchend click",l),f.removeChild(h)),h.removeEventListener("transitionend",a)}),u.autoClose&&(o.$on("$locationChangeStart",function(){c(h,u)}),o.$on("$stateChangeStart",function(){c(h,u)}))}}}])});