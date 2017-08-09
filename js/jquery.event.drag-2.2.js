/*! 
 * jquery.event.drag - v 2.2
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
(function(e){e.fn.drag=function(t,n,r){var i=typeof t=="string"?t:"",s=e.isFunction(t)?t:e.isFunction(n)?n:null;if(i.indexOf("drag")!==0)i="drag"+i;r=(t==s?n:r)||{};return s?this.bind(i,r,s):this.trigger(i)};var t=e.event,n=t.special,r=n.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:false,drop:true,click:false},datakey:"dragdata",noBubble:true,add:function(t){var n=e.data(this,r.datakey),i=t.data||{};n.related+=1;e.each(r.defaults,function(e,t){if(i[e]!==undefined)n[e]=i[e]})},remove:function(){e.data(this,r.datakey).related-=1},setup:function(){if(e.data(this,r.datakey))return;var n=e.extend({related:0},r.defaults);e.data(this,r.datakey,n);t.add(this,"touchstart mousedown",r.init,n);if(this.attachEvent)this.attachEvent("ondragstart",r.dontstart)},teardown:function(){var n=e.data(this,r.datakey)||{};if(n.related)return;e.removeData(this,r.datakey);t.remove(this,"touchstart mousedown",r.init);r.textselect(true);if(this.detachEvent)this.detachEvent("ondragstart",r.dontstart)},init:function(i){if(r.touched)return;var s=i.data,o;if(i.which!=0&&s.which>0&&i.which!=s.which)return;if(e(i.target).is(s.not))return;if(s.handle&&!e(i.target).closest(s.handle,i.currentTarget).length)return;r.touched=i.type=="touchstart"?this:null;s.propagates=1;s.mousedown=this;s.interactions=[r.interaction(this,s)];s.target=i.target;s.pageX=i.pageX;s.pageY=i.pageY;s.dragging=null;o=r.hijack(i,"draginit",s);if(!s.propagates)return;o=r.flatten(o);if(o&&o.length){s.interactions=[];e.each(o,function(){s.interactions.push(r.interaction(this,s))})}s.propagates=s.interactions.length;if(s.drop!==false&&n.drop)n.drop.handler(i,s);r.textselect(false);if(r.touched)t.add(r.touched,"touchmove touchend",r.handler,s);else t.add(document,"mousemove mouseup",r.handler,s);if(!r.touched||s.live)return false},interaction:function(t,n){var i=e(t)[n.relative?"position":"offset"]()||{top:0,left:0};return{drag:t,callback:new r.callback,droppable:[],offset:i}},handler:function(i){var s=i.data;switch(i.type){case!s.dragging&&"touchmove":i.preventDefault();case!s.dragging&&"mousemove":if(Math.pow(i.pageX-s.pageX,2)+Math.pow(i.pageY-s.pageY,2)<Math.pow(s.distance,2))break;i.target=s.target;r.hijack(i,"dragstart",s);if(s.propagates)s.dragging=true;case"touchmove":i.preventDefault();case"mousemove":if(s.dragging){r.hijack(i,"drag",s);if(s.propagates){if(s.drop!==false&&n.drop)n.drop.handler(i,s);break}i.type="mouseup"};case"touchend":case"mouseup":default:if(r.touched)t.remove(r.touched,"touchmove touchend",r.handler);else t.remove(document,"mousemove mouseup",r.handler);if(s.dragging){if(s.drop!==false&&n.drop)n.drop.handler(i,s);r.hijack(i,"dragend",s)}r.textselect(true);if(s.click===false&&s.dragging)e.data(s.mousedown,"suppress.click",(new Date).getTime()+5);s.dragging=r.touched=false;break}},hijack:function(n,i,s,o,u){if(!s)return;var a={event:n.originalEvent,type:n.type},f=i.indexOf("drop")?"drag":"drop",l,c=o||0,h,p,d,v=!isNaN(o)?o:s.interactions.length;n.type=i;n.originalEvent=null;s.results=[];do if(h=s.interactions[c]){if(i!=="dragend"&&h.cancelled)continue;d=r.properties(n,s,h);h.results=[];e(u||h[f]||s.droppable).each(function(o,u){d.target=u;n.isPropagationStopped=function(){return false};l=u?t.dispatch.call(u,n,d):null;if(l===false){if(f=="drag"){h.cancelled=true;s.propagates-=1}if(i=="drop"){h[f][o]=null}}else if(i=="dropinit")h.droppable.push(r.element(l)||u);if(i=="dragstart")h.proxy=e(r.element(l)||h.drag)[0];h.results.push(l);delete n.result;if(i!=="dropinit")return l});s.results[c]=r.flatten(h.results);if(i=="dropinit")h.droppable=r.flatten(h.droppable);if(i=="dragstart"&&!h.cancelled)d.update()}while(++c<v);n.type=a.type;n.originalEvent=a.event;return r.flatten(s.results)},properties:function(e,t,n){var i=n.callback;i.drag=n.drag;i.proxy=n.proxy||n.drag;i.startX=t.pageX;i.startY=t.pageY;i.deltaX=e.pageX-t.pageX;i.deltaY=e.pageY-t.pageY;i.originalX=n.offset.left;i.originalY=n.offset.top;i.offsetX=i.originalX+i.deltaX;i.offsetY=i.originalY+i.deltaY;i.drop=r.flatten((n.drop||[]).slice());i.available=r.flatten((n.droppable||[]).slice());return i},element:function(e){if(e&&(e.jquery||e.nodeType==1))return e},flatten:function(t){return e.map(t,function(t){return t&&t.jquery?e.makeArray(t):t&&t.length?r.flatten(t):t})},textselect:function(t){e(document)[t?"unbind":"bind"]("selectstart",r.dontstart).css("MozUserSelect",t?"":"none");document.unselectable=t?"off":"on"},dontstart:function(){return false},callback:function(){}};r.callback.prototype={update:function(){if(n.drop&&this.available.length)e.each(this.available,function(e){n.drop.locate(this,e)})}};var i=t.dispatch;t.dispatch=function(t){if(e.data(this,"suppress."+t.type)-(new Date).getTime()>0){e.removeData(this,"suppress."+t.type);return}return i.apply(this,arguments)};var s=t.fixHooks.touchstart=t.fixHooks.touchmove=t.fixHooks.touchend=t.fixHooks.touchcancel={props:"clientX clientY pageX pageY screenX screenY".split(" "),filter:function(t,n){if(n){var r=n.touches&&n.touches[0]||n.changedTouches&&n.changedTouches[0]||null;if(r)e.each(s.props,function(e,n){t[n]=r[n]})}return t}};n.draginit=n.dragstart=n.dragend=r})(jQuery)