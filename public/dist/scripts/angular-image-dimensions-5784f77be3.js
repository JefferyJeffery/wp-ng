"use strict";!function(n,e){"object"==typeof module&&module.exports?module.exports=e(require("angular")):"function"==typeof define&&define.amd?define(["angular"],e):e(angular)}(0,function(n){return{ngImageDimensions:n.module("ngImageDimensions",[]).directive("imageDimensions",function(){return{restrict:"A",scope:!0,controller:["$scope","$element","$attrs",function(n,e,t){var i;return i=e.find("img"),i.bind("load",function(){var e,t,r,a,u;return e=i[0],u=e.width,t=e.height,a=e.naturalWidth,r=e.naturalHeight,n.width=u,n.height=t,n.dimensions=u+" x "+t,n.naturalWidth=a,n.naturalHeight=r,n.naturalDimensions=e.naturalWidth+" x "+e.naturalHeight,n.$apply()})}]}})}});