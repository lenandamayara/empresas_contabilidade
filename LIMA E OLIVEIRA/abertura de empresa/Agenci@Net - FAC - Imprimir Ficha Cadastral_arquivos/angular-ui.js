﻿angular.module("ui.mask",[]).value("uiMaskConfig",{maskDefinitions:{9:/\d/,A:/[a-zA-Z]/,"*":/[a-zA-Z0-9]/},clearOnBlur:!0}).directive("uiMask",["uiMaskConfig","$parse",function(I,Q){function J(r){return r===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(r.type||r.href||~r.tabIndex)}return{priority:100,require:"ngModel",restrict:"A",compile:function(){return function(r,f,m,h){function K(){t=!1;w&&(f.unbind("blur",L),f.unbind("mousedown",x),f.unbind("mouseup",x),f.unbind("input",
u),f.unbind("keyup",u),f.unbind("click",u),f.unbind("focus",u),w=!1);angular.isDefined(M)?f.attr("placeholder",M):f.removeAttr("placeholder");angular.isDefined(N)?f.attr("maxlength",N):f.removeAttr("maxlength");f.val(h.$modelValue);h.$viewValue=h.$modelValue;return!1}function y(a){var b="",e=B.slice();a=a.toString();angular.forEach(O,function(c){a=a.replace(c,"")});angular.forEach(a.split(""),function(a){e.length&&e[0].test(a)&&(b+=a,e.shift())});return b}function z(a){var b="",e=l.slice();angular.forEach(n.split(""),
function(c,f){a.length&&f===e[0]?(b+=a.charAt(0)||"_",a=a.substr(1),e.shift()):b+=c});return b}function R(a){var b=0;l=[];B=[];n="";if("string"===typeof a){v=0;var e=!1,c=0;a=a.split("");angular.forEach(a,function(a,f){if(p.maskDefinitions[a]){l.push(b);var g=n,d;d=f-c;var h=m.placeholder;d="undefined"!==typeof h&&h[d]?h[d]:"_";n=g+d;B.push(p.maskDefinitions[a]);b++;e||v++}else"?"===a?(e=!0,c++):(n+=a,b++)})}l.push(l.slice().pop()+1);O=n.replace(/[_]+/g,"_").replace(/([^_]+)([a-zA-Z0-9])([^_])/g,
"$1$2_$3").split("_");t=1<l.length?!0:!1}function L(){p.clearOnBlur&&(A=C=0,k&&0!==g.length||(D="",f.val(""),r.$apply(function(){h.$setViewValue("")})))}function x(a){"mousedown"===a.type?f.bind("mouseout",E):f.unbind("mouseout",E)}function E(){A=F(this);f.unbind("mouseout",E)}function u(a){a=a||{};var b=a.which,e=a.type;if(16!==b&&91!==b){var c=f.val(),g=G,q=y(c),m=H,d=S(this)||0,r=C||0,n=d-r,k=l[0],p=l[q.length]||l.slice().shift(),t=A||0,u=0<F(this),v=0<t,w=c.length>g.length||t&&c.length>g.length-
t,c=c.length<g.length||t&&c.length===g.length-t;a=37<=b&&40>=b&&a.shiftKey;g=8===b||"keyup"!==e&&c&&-1===n;n=46===b||"keyup"!==e&&c&&0===n&&!v;b=(37===b||g||"click"===e)&&d>k;A=F(this);if(!a&&(!u||"click"!==e&&"keyup"!==e)){if("input"===e&&c&&!v&&q===m){for(;g&&d>k&&!(-1<l.indexOf(d));)d--;for(;n&&d<p&&-1===l.indexOf(d);)d++;e=l.indexOf(d);q=q.substring(0,e)+q.substring(e+1)}G=e=z(q);H=q;f.val(e);h.$setViewValue(q);w&&d<=k&&(d=k+1);b&&d--;for(d=d>p?p:d<k?k:d;!(-1<l.indexOf(d))&&d>k&&d<p;)d+=b?-1:
1;(b&&d<p||w&&!(-1<l.indexOf(r)))&&d++;C=d;q=d;this&&0!==this.offsetWidth&&0!==this.offsetHeight&&(this.setSelectionRange?J(f[0])&&(this.focus(),this.setSelectionRange(q,q)):this.createTextRange&&(d=this.createTextRange(),d.collapse(!0),d.moveEnd("character",q),d.moveStart("character",q),d.select()))}}}function S(a){if(!a)return 0;if(void 0!==a.selectionStart)return a.selectionStart;if(document.selection&&J(f[0])){a.focus();var b=document.selection.createRange();b.moveStart("character",a.value?-a.value.length:
0);return b.text.length}return 0}function F(a){return a?void 0!==a.selectionStart?a.selectionEnd-a.selectionStart:document.selection?document.selection.createRange().text.length:0:0}var t=!1,w=!1,l,B,n,O,v,g,D,k,M=m.placeholder,N=m.maxlength,G,H,C,A,p={};m.uiOptions?(p=r.$eval("["+m.uiOptions+"]"),angular.isObject(p[0])&&(p=function(a,b){for(var e in a)Object.prototype.hasOwnProperty.call(a,e)&&(void 0===b[e]?b[e]=angular.copy(a[e]):angular.extend(b[e],a[e]));return b}(I,p[0]))):p=I;m.$observe("uiMask",
function(a){if(!angular.isDefined(a))return K();R(a);if(!t)return K();g=H=y(h.$modelValue||"");D=G=z(g);a=(k=g.length?g.length>=v:!0)&&g.length?D:"";m.maxlength&&f.attr("maxlength",2*l[l.length-1]);f.attr("placeholder",n);f.val(a);h.$viewValue=a;h.$setValidity("mask",k);w||(f.bind("blur",L),f.bind("mousedown mouseup",x),f.bind("input keyup click focus",u),w=!0);return!0});m.$observe("placeholder",function(a){angular.isDefined(a)&&(n=a,t&&u())});var P=!1;m.$observe("modelViewValue",function(a){"true"===
a&&(P=!0)});r.$watch(m.ngModel,function(a){P&&a&&Q(m.ngModel).assign(r,h.$viewValue)});h.$formatters.push(function(a){if(!t)return a;g=y(a||"");k=g.length?g.length>=v:!0;h.$setValidity("mask",k);return k&&g.length?z(g):void 0});h.$parsers.push(function(a){if(!t)return a;g=y(a||"");k=g.length?g.length>=v:!0;h.$viewValue=g.length?z(g):"";h.$setValidity("mask",k);""===g&&m.required&&h.$setValidity("required",!h.$error.required);return k?g:void 0});f.bind("mousedown mouseup",x);Array.prototype.indexOf||
(Array.prototype.indexOf=function(a){if(null===this)throw new TypeError;var b=Object(this),e=b.length>>>0;if(0===e)return-1;var c=0;1<arguments.length&&(c=Number(arguments[1]),c!==c?c=0:0!==c&&Infinity!==c&&-Infinity!==c&&(c=(0<c||-1)*Math.floor(Math.abs(c))));if(c>=e)return-1;for(c=0<=c?c:Math.max(e-Math.abs(c),0);c<e;c++)if(c in b&&b[c]===a)return c;return-1})}}}}]);