try{var ce=new window.CustomEvent("test");if(ce.preventDefault(),!0!==ce.defaultPrevented)throw new Error("Could not prevent default")}catch(e){var CustomEvent=function(e,t){var n,r;return t=t||{bubbles:!1,cancelable:!1,detail:void 0},n=document.createEvent("CustomEvent"),n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),r=n.preventDefault,n.preventDefault=function(){r.call(this);try{Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}})}catch(e){this.defaultPrevented=!0}},n};CustomEvent.prototype=window.Event.prototype,window.CustomEvent=CustomEvent}