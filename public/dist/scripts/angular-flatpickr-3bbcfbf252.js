!function(t,n){"use strict";t["angular-flatpickr"]=function(t,n){"use strict";var r=t.module("angular-flatpickr",[]);return r.directive("ngFlatpickr",[function(){return{require:"ngModel",restrict:"A",scope:{fpOpts:"&",fpOnSetup:"&"},link:function(t,r,e,i){var a;if(!FlatpickrInstance&&!n)return void console.warn("Unable to find any flatpickr installation");a=FlatpickrInstance?new FlatpickrInstance(r[0],t.fpOpts()):new n(r[0],t.fpOpts()),t.fpOnSetup&&t.fpOnSetup({fpItem:a}),r.on("$destroy",function(){a.destroy()})}}}]),r}(t.angular,t.flatpickr)}(this);