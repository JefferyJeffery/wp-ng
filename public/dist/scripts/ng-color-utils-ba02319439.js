!function(r){"use strict";r.module("ngColorUtils",[]).factory("hex2rgba",[function(){return{get:function(r,t){var a=/^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/,n=a.exec(r);return"rgba("+parseInt(n[1],16)+","+parseInt(n[2],16)+","+parseInt(n[3],16)+","+parseFloat(t).toFixed(1)+")"}}}])}(window.angular);