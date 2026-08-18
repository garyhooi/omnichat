var OmniChatChatPage=(function(Kt){"use strict";var zg=Object.defineProperty;var Bg=(Kt,bt,ae)=>bt in Kt?zg(Kt,bt,{enumerable:!0,configurable:!0,writable:!0,value:ae}):Kt[bt]=ae;var me=(Kt,bt,ae)=>Bg(Kt,typeof bt!="symbol"?bt+"":bt,ae);/**
* @vue/shared v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/var Ms;function bt(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const ae={},Dn=[],Ct=()=>{},yo=()=>!1,Fr=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),Ur=t=>t.startsWith("onUpdate:"),Ee=Object.assign,js=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Sc=Object.prototype.hasOwnProperty,ue=(t,e)=>Sc.call(t,e),H=Array.isArray,zn=t=>ir(t)==="[object Map]",wo=t=>ir(t)==="[object Set]",_o=t=>ir(t)==="[object Date]",j=t=>typeof t=="function",xe=t=>typeof t=="string",Ot=t=>typeof t=="symbol",he=t=>t!==null&&typeof t=="object",xo=t=>(he(t)||j(t))&&j(t.then)&&j(t.catch),vo=Object.prototype.toString,ir=t=>vo.call(t),Ec=t=>ir(t).slice(8,-1),Hr=t=>ir(t)==="[object Object]",Vs=t=>xe(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,or=bt(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),jr=t=>{const e=Object.create(null);return(n=>e[n]||(e[n]=t(n)))},Ac=/-\w/g,Qe=jr(t=>t.replace(Ac,e=>e.slice(1).toUpperCase())),Rc=/\B([A-Z])/g,st=jr(t=>t.replace(Rc,"-$1").toLowerCase()),ko=jr(t=>t.charAt(0).toUpperCase()+t.slice(1)),qs=jr(t=>t?`on${ko(t)}`:""),It=(t,e)=>!Object.is(t,e),Vr=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},To=(t,e,n,r=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:r,value:n})},Ws=t=>{const e=parseFloat(t);return isNaN(e)?t:e},So=t=>{const e=xe(t)?Number(t):NaN;return isNaN(e)?t:e};let Eo;const qr=()=>Eo||(Eo=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function yt(t){if(H(t)){const e={};for(let n=0;n<t.length;n++){const r=t[n],s=xe(r)?Pc(r):yt(r);if(s)for(const i in s)e[i]=s[i]}return e}else if(xe(t)||he(t))return t}const Cc=/;(?![^(]*\))/g,Oc=/:([^]+)/,Ic=/\/\*[^]*?\*\//g;function Pc(t){const e={};return t.replace(Ic,"").split(Cc).forEach(n=>{if(n){const r=n.split(Oc);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}function wn(t){let e="";if(xe(t))e=t;else if(H(t))for(let n=0;n<t.length;n++){const r=wn(t[n]);r&&(e+=r+" ")}else if(he(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const Nc=bt("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function Ao(t){return!!t||t===""}function Lc(t,e){if(t.length!==e.length)return!1;let n=!0;for(let r=0;n&&r<t.length;r++)n=Ks(t[r],e[r]);return n}function Ks(t,e){if(t===e)return!0;let n=_o(t),r=_o(e);if(n||r)return n&&r?t.getTime()===e.getTime():!1;if(n=Ot(t),r=Ot(e),n||r)return t===e;if(n=H(t),r=H(e),n||r)return n&&r?Lc(t,e):!1;if(n=he(t),r=he(e),n||r){if(!n||!r)return!1;const s=Object.keys(t).length,i=Object.keys(e).length;if(s!==i)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!Ks(t[o],e[o]))return!1}}return String(t)===String(e)}const Ro=t=>!!(t&&t.__v_isRef===!0),Ie=t=>xe(t)?t:t==null?"":H(t)||he(t)&&(t.toString===vo||!j(t.toString))?Ro(t)?Ie(t.value):JSON.stringify(t,Co,2):String(t),Co=(t,e)=>Ro(e)?Co(t,e.value):zn(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[r,s],i)=>(n[Gs(r,i)+" =>"]=s,n),{})}:wo(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>Gs(n))}:Ot(e)?Gs(e):he(e)&&!H(e)&&!Hr(e)?String(e):e,Gs=(t,e="")=>{var n;return Ot(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let De;class Mc{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&De&&(De.active?(this.parent=De,this.index=(De.scopes||(De.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes){const r=this.scopes.slice();for(e=0,n=r.length;e<n;e++)r[e].pause()}for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes){const s=this.scopes.slice();for(e=0,n=s.length;e<n;e++)s[e].resume()}const r=this.effects.slice();for(e=0,n=r.length;e<n;e++)r[e].resume()}}run(e){if(this._active){const n=De;try{return De=this,e()}finally{De=n}}}on(){++this._on===1&&(this.prevScope=De,De=this)}off(){if(this._on>0&&--this._on===0){if(De===this)De=this.prevScope;else{let e=De;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){const s=this.scopes.slice();for(n=0,r=s.length;n<r;n++)s[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function Dc(){return De}let _e;const Ys=new WeakSet;class Oo{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,De&&(De.active?De.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ys.has(this)&&(Ys.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Po(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,zo(this),No(this);const e=_e,n=wt;_e=this,wt=!0;try{return this.fn()}finally{Lo(this),_e=e,wt=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Qs(e);this.deps=this.depsTail=void 0,zo(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ys.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Js(this)&&this.run()}get dirty(){return Js(this)}}let Io=0,ar,lr;function Po(t,e=!1){if(t.flags|=8,e){t.next=lr,lr=t;return}t.next=ar,ar=t}function Xs(){Io++}function Zs(){if(--Io>0)return;if(lr){let e=lr;for(lr=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;ar;){let e=ar;for(ar=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(r){t||(t=r)}e=n}}if(t)throw t}function No(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function Lo(t){let e,n=t.depsTail,r=n;for(;r;){const s=r.prevDep;r.version===-1?(r===n&&(n=s),Qs(r),zc(r)):e=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}t.deps=e,t.depsTail=n}function Js(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(Mo(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function Mo(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===cr)||(t.globalVersion=cr,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!Js(t))))return;t.flags|=2;const e=t.dep,n=_e,r=wt;_e=t,wt=!0;try{No(t);const s=t.fn(t._value);(e.version===0||It(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{_e=n,wt=r,Lo(t),t.flags&=-3}}function Qs(t,e=!1){const{dep:n,prevSub:r,nextSub:s}=t;if(r&&(r.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=r,t.nextSub=void 0),n.subs===t&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)Qs(i,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function zc(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let wt=!0;const Do=[];function Pt(){Do.push(wt),wt=!1}function Nt(){const t=Do.pop();wt=t===void 0?!0:t}function zo(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=_e;_e=void 0;try{e()}finally{_e=n}}}let cr=0;class Bc{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class ei{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!_e||!wt||_e===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==_e)n=this.activeLink=new Bc(_e,this),_e.deps?(n.prevDep=_e.depsTail,_e.depsTail.nextDep=n,_e.depsTail=n):_e.deps=_e.depsTail=n,Bo(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=_e.depsTail,n.nextDep=void 0,_e.depsTail.nextDep=n,_e.depsTail=n,_e.deps===n&&(_e.deps=r)}return n}trigger(e){this.version++,cr++,this.notify(e)}notify(e){Xs();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Zs()}}}function Bo(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let r=e.deps;r;r=r.nextDep)Bo(r)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const ti=new WeakMap,_n=Symbol(""),ni=Symbol(""),ur=Symbol("");function qe(t,e,n){if(wt&&_e){let r=ti.get(t);r||ti.set(t,r=new Map);let s=r.get(n);s||(r.set(n,s=new ei),s.map=r,s.key=n),s.track()}}function Gt(t,e,n,r,s,i){const o=ti.get(t);if(!o){cr++;return}const a=l=>{l&&l.trigger()};if(Xs(),e==="clear")o.forEach(a);else{const l=H(t),f=l&&Vs(n);if(l&&n==="length"){const h=Number(r);o.forEach((d,x)=>{(x==="length"||x===ur||!Ot(x)&&x>=h)&&a(d)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),f&&a(o.get(ur)),e){case"add":l?f&&a(o.get("length")):(a(o.get(_n)),zn(t)&&a(o.get(ni)));break;case"delete":l||(a(o.get(_n)),zn(t)&&a(o.get(ni)));break;case"set":zn(t)&&a(o.get(_n));break}}Zs()}function Bn(t){const e=le(t);return e===t?e:(qe(e,"iterate",ur),ct(t)?e:e.map(_t))}function Wr(t){return qe(t=le(t),"iterate",ur),t}function Lt(t,e){return Xt(t)?$n(xn(t)?_t(e):e):_t(e)}const $c={__proto__:null,[Symbol.iterator](){return ri(this,Symbol.iterator,t=>Lt(this,t))},concat(...t){return Bn(this).concat(...t.map(e=>H(e)?Bn(e):e))},entries(){return ri(this,"entries",t=>(t[1]=Lt(this,t[1]),t))},every(t,e){return Yt(this,"every",t,e,void 0,arguments)},filter(t,e){return Yt(this,"filter",t,e,n=>n.map(r=>Lt(this,r)),arguments)},find(t,e){return Yt(this,"find",t,e,n=>Lt(this,n),arguments)},findIndex(t,e){return Yt(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Yt(this,"findLast",t,e,n=>Lt(this,n),arguments)},findLastIndex(t,e){return Yt(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Yt(this,"forEach",t,e,void 0,arguments)},includes(...t){return si(this,"includes",t)},indexOf(...t){return si(this,"indexOf",t)},join(t){return Bn(this).join(t)},lastIndexOf(...t){return si(this,"lastIndexOf",t)},map(t,e){return Yt(this,"map",t,e,void 0,arguments)},pop(){return fr(this,"pop")},push(...t){return fr(this,"push",t)},reduce(t,...e){return $o(this,"reduce",t,e)},reduceRight(t,...e){return $o(this,"reduceRight",t,e)},shift(){return fr(this,"shift")},some(t,e){return Yt(this,"some",t,e,void 0,arguments)},splice(...t){return fr(this,"splice",t)},toReversed(){return Bn(this).toReversed()},toSorted(t){return Bn(this).toSorted(t)},toSpliced(...t){return Bn(this).toSpliced(...t)},unshift(...t){return fr(this,"unshift",t)},values(){return ri(this,"values",t=>Lt(this,t))}};function ri(t,e,n){const r=Wr(t),s=r[e]();return r!==t&&!ct(t)&&(s._next=s.next,s.next=()=>{const i=s._next();return i.done||(i.value=n(i.value)),i}),s}const Fc=Array.prototype;function Yt(t,e,n,r,s,i){const o=Wr(t),a=o!==t&&!ct(t),l=o[e];if(l!==Fc[e]){const d=l.apply(t,i);return a?_t(d):d}let f=n;o!==t&&(a?f=function(d,x){return n.call(this,Lt(t,d),x,t)}:n.length>2&&(f=function(d,x){return n.call(this,d,x,t)}));const h=l.call(o,f,r);return a&&s?s(h):h}function $o(t,e,n,r){const s=Wr(t),i=s!==t&&!ct(t);let o=n,a=!1;s!==t&&(i?(a=r.length===0,o=function(f,h,d){return a&&(a=!1,f=Lt(t,f)),n.call(this,f,Lt(t,h),d,t)}):n.length>3&&(o=function(f,h,d){return n.call(this,f,h,d,t)}));const l=s[e](o,...r);return a?Lt(t,l):l}function si(t,e,n){const r=le(t);qe(r,"iterate",ur);const s=r[e](...n);return(s===-1||s===!1)&&li(n[0])?(n[0]=le(n[0]),r[e](...n)):s}function fr(t,e,n=[]){Pt(),Xs();const r=le(t)[e].apply(t,n);return Zs(),Nt(),r}const Uc=bt("__proto__,__v_isRef,__isVue"),Fo=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Ot));function Hc(t){Ot(t)||(t=String(t));const e=le(this);return qe(e,"has",t),e.hasOwnProperty(t)}class Uo{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,r){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(s?i?Ko:Wo:i?qo:Vo).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(r)?e:void 0;const o=H(e);if(!s){let l;if(o&&(l=$c[n]))return l;if(n==="hasOwnProperty")return Hc}const a=Reflect.get(e,n,ze(e)?e:r);if((Ot(n)?Fo.has(n):Uc(n))||(s||qe(e,"get",n),i))return a;if(ze(a)){const l=o&&Vs(n)?a:a.value;return s&&he(l)?ai(l):l}return he(a)?s?ai(a):oi(a):a}}class Ho extends Uo{constructor(e=!1){super(!1,e)}set(e,n,r,s){let i=e[n];const o=H(e)&&Vs(n);if(!this._isShallow){const f=Xt(i);if(!ct(r)&&!Xt(r)&&(i=le(i),r=le(r)),!o&&ze(i)&&!ze(r))return f||(i.value=r),!0}const a=o?Number(n)<e.length:ue(e,n),l=Reflect.set(e,n,r,ze(e)?e:s);return e===le(s)&&l&&(a?It(r,i)&&Gt(e,"set",n,r):Gt(e,"add",n,r)),l}deleteProperty(e,n){const r=ue(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&r&&Gt(e,"delete",n,void 0),s}has(e,n){const r=Reflect.has(e,n);return(!Ot(n)||!Fo.has(n))&&qe(e,"has",n),r}ownKeys(e){return qe(e,"iterate",H(e)?"length":_n),Reflect.ownKeys(e)}}class jo extends Uo{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const jc=new Ho,Vc=new jo,qc=new Ho(!0),Wc=new jo(!0),ii=t=>t,Kr=t=>Reflect.getPrototypeOf(t);function Kc(t,e,n){return function(...r){const s=this.__v_raw,i=le(s),o=zn(i),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,f=s[t](...r),h=n?ii:e?$n:_t;return!e&&qe(i,"iterate",l?ni:_n),Ee(Object.create(f),{next(){const{value:d,done:x}=f.next();return x?{value:d,done:x}:{value:a?[h(d[0]),h(d[1])]:h(d),done:x}}})}}function Gr(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function Gc(t,e){const n={get(s){const i=this.__v_raw,o=le(i),a=le(s);t||(It(s,a)&&qe(o,"get",s),qe(o,"get",a));const{has:l}=Kr(o),f=e?ii:t?$n:_t;if(l.call(o,s))return f(i.get(s));if(l.call(o,a))return f(i.get(a));i!==o&&i.get(s)},get size(){const s=this.__v_raw;return!t&&qe(le(s),"iterate",_n),s.size},has(s){const i=this.__v_raw,o=le(i),a=le(s);return t||(It(s,a)&&qe(o,"has",s),qe(o,"has",a)),s===a?i.has(s):i.has(s)||i.has(a)},forEach(s,i){const o=this,a=o.__v_raw,l=le(a),f=e?ii:t?$n:_t;return!t&&qe(l,"iterate",_n),a.forEach((h,d)=>s.call(i,f(h),f(d),o))}};return Ee(n,t?{add:Gr("add"),set:Gr("set"),delete:Gr("delete"),clear:Gr("clear")}:{add(s){const i=le(this),o=Kr(i),a=le(s),l=!e&&!ct(s)&&!Xt(s)?a:s;return o.has.call(i,l)||It(s,l)&&o.has.call(i,s)||It(a,l)&&o.has.call(i,a)||(i.add(l),Gt(i,"add",l,l)),this},set(s,i){!e&&!ct(i)&&!Xt(i)&&(i=le(i));const o=le(this),{has:a,get:l}=Kr(o);let f=a.call(o,s);f||(s=le(s),f=a.call(o,s));const h=l.call(o,s);return o.set(s,i),f?It(i,h)&&Gt(o,"set",s,i):Gt(o,"add",s,i),this},delete(s){const i=le(this),{has:o,get:a}=Kr(i);let l=o.call(i,s);l||(s=le(s),l=o.call(i,s)),a&&a.call(i,s);const f=i.delete(s);return l&&Gt(i,"delete",s,void 0),f},clear(){const s=le(this),i=s.size!==0,o=s.clear();return i&&Gt(s,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=Kc(s,t,e)}),n}function Yr(t,e){const n=Gc(t,e);return(r,s,i)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?r:Reflect.get(ue(n,s)&&s in r?n:r,s,i)}const Yc={get:Yr(!1,!1)},Xc={get:Yr(!1,!0)},Zc={get:Yr(!0,!1)},Jc={get:Yr(!0,!0)},Vo=new WeakMap,qo=new WeakMap,Wo=new WeakMap,Ko=new WeakMap;function Qc(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function oi(t){return Xt(t)?t:Xr(t,!1,jc,Yc,Vo)}function eu(t){return Xr(t,!1,qc,Xc,qo)}function ai(t){return Xr(t,!0,Vc,Zc,Wo)}function Fg(t){return Xr(t,!0,Wc,Jc,Ko)}function Xr(t,e,n,r,s){if(!he(t)||t.__v_raw&&!(e&&t.__v_isReactive)||t.__v_skip||!Object.isExtensible(t))return t;const i=s.get(t);if(i)return i;const o=Qc(Ec(t));if(o===0)return t;const a=new Proxy(t,o===2?r:n);return s.set(t,a),a}function xn(t){return Xt(t)?xn(t.__v_raw):!!(t&&t.__v_isReactive)}function Xt(t){return!!(t&&t.__v_isReadonly)}function ct(t){return!!(t&&t.__v_isShallow)}function li(t){return t?!!t.__v_raw:!1}function le(t){const e=t&&t.__v_raw;return e?le(e):t}function tu(t){return!ue(t,"__v_skip")&&Object.isExtensible(t)&&To(t,"__v_skip",!0),t}const _t=t=>he(t)?oi(t):t,$n=t=>he(t)?ai(t):t;function ze(t){return t?t.__v_isRef===!0:!1}function V(t){return nu(t,!1)}function nu(t,e){return ze(t)?t:new ru(t,e)}class ru{constructor(e,n){this.dep=new ei,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:le(e),this._value=n?e:_t(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,r=this.__v_isShallow||ct(e)||Xt(e);e=r?e:le(e),It(e,n)&&(this._rawValue=e,this._value=r?e:_t(e),this.dep.trigger())}}function vn(t){return ze(t)?t.value:t}const su={get:(t,e,n)=>e==="__v_raw"?t:vn(Reflect.get(t,e,n)),set:(t,e,n,r)=>{const s=t[e];return ze(s)&&!ze(n)?(s.value=n,!0):Reflect.set(t,e,n,r)}};function Go(t){return xn(t)?t:new Proxy(t,su)}class iu{constructor(e,n,r){this.fn=e,this.setter=n,this._value=void 0,this.dep=new ei(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=cr-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&_e!==this)return Po(this,!0),!0}get value(){const e=this.dep.track();return Mo(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function ou(t,e,n=!1){let r,s;return j(t)?r=t:(r=t.get,s=t.set),new iu(r,s,n)}const Zr={},Jr=new WeakMap;let kn;function au(t,e=!1,n=kn){if(n){let r=Jr.get(n);r||Jr.set(n,r=[]),r.push(t)}}function lu(t,e,n=ae){const{immediate:r,deep:s,once:i,scheduler:o,augmentJob:a,call:l}=n,f=N=>s?N:ct(N)||s===!1||s===0?Zt(N,1):Zt(N);let h,d,x,O,P=!1,z=!1;if(ze(t)?(d=()=>t.value,P=ct(t)):xn(t)?(d=()=>f(t),P=!0):H(t)?(z=!0,P=t.some(N=>xn(N)||ct(N)),d=()=>t.map(N=>{if(ze(N))return N.value;if(xn(N))return f(N);if(j(N))return l?l(N,2):N()})):j(t)?e?d=l?()=>l(t,2):t:d=()=>{if(x){Pt();try{x()}finally{Nt()}}const N=kn;kn=h;try{return l?l(t,3,[O]):t(O)}finally{kn=N}}:d=Ct,e&&s){const N=d,te=s===!0?1/0:s;d=()=>Zt(N(),te)}const ee=Dc(),Y=()=>{h.stop(),ee&&ee.active&&js(ee.effects,h)};if(i&&e){const N=e;e=(...te)=>{const ve=N(...te);return Y(),ve}}let W=z?new Array(t.length).fill(Zr):Zr;const X=N=>{if(!(!(h.flags&1)||!h.dirty&&!N))if(e){const te=h.run();if(N||s||P||(z?te.some((ve,pe)=>It(ve,W[pe])):It(te,W))){x&&x();const ve=kn;kn=h;try{const pe=[te,W===Zr?void 0:z&&W[0]===Zr?[]:W,O];W=te,l?l(e,3,pe):e(...pe)}finally{kn=ve}}}else h.run()};return a&&a(X),h=new Oo(d),h.scheduler=o?()=>o(X,!1):X,O=N=>au(N,!1,h),x=h.onStop=()=>{const N=Jr.get(h);if(N){if(l)l(N,4);else for(const te of N)te();Jr.delete(h)}},e?r?X(!0):W=h.run():o?o(X.bind(null,!0),!0):h.run(),Y.pause=h.pause.bind(h),Y.resume=h.resume.bind(h),Y.stop=Y,Y}function Zt(t,e=1/0,n){if(e<=0||!he(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,ze(t))Zt(t.value,e,n);else if(H(t))for(let r=0;r<t.length;r++)Zt(t[r],e,n);else if(wo(t)||zn(t))t.forEach(r=>{Zt(r,e,n)});else if(Hr(t)){for(const r in t)Zt(t[r],e,n);for(const r of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,r)&&Zt(t[r],e,n)}return t}/**
* @vue/runtime-core v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const hr=[];let ci=!1;function Ug(t,...e){if(ci)return;ci=!0,Pt();const n=hr.length?hr[hr.length-1].component:null,r=n&&n.appContext.config.warnHandler,s=cu();if(r)Fn(r,n,11,[t+e.map(i=>{var o,a;return(a=(o=i.toString)==null?void 0:o.call(i))!=null?a:JSON.stringify(i)}).join(""),n&&n.proxy,s.map(({vnode:i})=>`at <${qa(n,i.type)}>`).join(`
`),s]);else{const i=[`[Vue warn]: ${t}`,...e];s.length&&i.push(`
`,...uu(s)),console.warn(...i)}Nt(),ci=!1}function cu(){let t=hr[hr.length-1];if(!t)return[];const e=[];for(;t;){const n=e[0];n&&n.vnode===t?n.recurseCount++:e.push({vnode:t,recurseCount:0});const r=t.component&&t.component.parent;t=r&&r.vnode}return e}function uu(t){const e=[];return t.forEach((n,r)=>{e.push(...r===0?[]:[`
`],...fu(n))}),e}function fu({vnode:t,recurseCount:e}){const n=e>0?`... (${e} recursive calls)`:"",r=t.component?t.component.parent==null:!1,s=` at <${qa(t.component,t.type,r)}`,i=">"+n;return t.props?[s,...hu(t.props),i]:[s+i]}function hu(t){const e=[],n=Object.keys(t);return n.slice(0,3).forEach(r=>{e.push(...Yo(r,t[r]))}),n.length>3&&e.push(" ..."),e}function Yo(t,e,n){return xe(e)?(e=JSON.stringify(e),n?e:[`${t}=${e}`]):typeof e=="number"||typeof e=="boolean"||e==null?n?e:[`${t}=${e}`]:ze(e)?(e=Yo(t,le(e.value),!0),n?e:[`${t}=Ref<`,e,">"]):j(e)?[`${t}=fn${e.name?`<${e.name}>`:""}`]:(e=le(e),n?e:[`${t}=`,e])}function Fn(t,e,n,r){try{return r?t(...r):t()}catch(s){Qr(s,e,n)}}function xt(t,e,n,r){if(j(t)){const s=Fn(t,e,n,r);return s&&xo(s)&&s.catch(i=>{Qr(i,e,n)}),s}if(H(t)){const s=[];for(let i=0;i<t.length;i++)s.push(xt(t[i],e,n,r));return s}}function Qr(t,e,n,r=!0){const s=e?e.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||ae;if(e){let a=e.parent;const l=e.proxy,f=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const h=a.ec;if(h){for(let d=0;d<h.length;d++)if(h[d](t,l,f)===!1)return}a=a.parent}if(i){Pt(),Fn(i,null,10,[t,l,f]),Nt();return}}pu(t,n,s,r,o)}function pu(t,e,n,r=!0,s=!1){if(s)throw t;console.error(t)}const Ge=[];let Mt=-1;const Un=[];let cn=null,Hn=0;const Xo=Promise.resolve();let es=null;function pr(t){const e=es||Xo;return t?e.then(this?t.bind(this):t):e}function du(t){let e=Mt+1,n=Ge.length;for(;e<n;){const r=e+n>>>1,s=Ge[r],i=dr(s);i<t||i===t&&s.flags&2?e=r+1:n=r}return e}function ui(t){if(!(t.flags&1)){const e=dr(t),n=Ge[Ge.length-1];!n||!(t.flags&2)&&e>=dr(n)?Ge.push(t):Ge.splice(du(e),0,t),t.flags|=1,Zo()}}function Zo(){es||(es=Xo.then(ea))}function gu(t){if(!H(t))cn&&t.id===-1?cn.splice(Hn+1,0,t):t.flags&1||(Un.push(t),t.flags|=1);else for(let e=0;e<t.length;e++)Un.push(t[e]);Zo()}function Jo(t,e,n=Mt+1){for(;n<Ge.length;n++){const r=Ge[n];if(r&&r.flags&2){if(t&&r.id!==t.uid)continue;Ge.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Qo(t){if(Un.length){const e=[...new Set(Un)].sort((n,r)=>dr(n)-dr(r));if(Un.length=0,cn){for(let n=0;n<e.length;n++)cn.push(e[n]);return}for(cn=e,Hn=0;Hn<cn.length;Hn++){const n=cn[Hn];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}cn=null,Hn=0}}const dr=t=>t.id==null?t.flags&2?-1:1/0:t.id;function ea(t){try{for(Mt=0;Mt<Ge.length;Mt++){const e=Ge[Mt];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Fn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Mt<Ge.length;Mt++){const e=Ge[Mt];e&&(e.flags&=-2)}Mt=-1,Ge.length=0,Qo(),es=null,(Ge.length||Un.length)&&ea()}}let ut=null,ta=null;function ts(t){const e=ut;return ut=t,ta=t&&t.type.__scopeId||null,e}function mu(t,e=ut,n){if(!e||t._n)return t;const r=(...s)=>{r._d&&za(-1);const i=ts(e),o=En.length;let a;try{a=t(...s)}finally{for(let l=En.length;l>o;l--)Da();ts(i),r._d&&za(1)}return a};return r._n=!0,r._c=!0,r._d=!0,r}function ns(t,e){if(ut===null)return t;const n=gs(ut),r=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[i,o,a,l=ae]=e[s];i&&(j(i)&&(i={mounted:i,updated:i}),i.deep&&Zt(o),r.push({dir:i,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function Tn(t,e,n,r){const s=t.dirs,i=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];i&&(a.oldValue=i[o].value);let l=a.dir[r];l&&(Pt(),xt(l,n,8,[t.el,a,t,e]),Nt())}}function bu(t,e){if(Xe){let n=Xe.provides;const r=Xe.parent&&Xe.parent.provides;r===n&&(n=Xe.provides=Object.create(r)),n[t]=e}}function rs(t,e,n=!1){const r=gf();if(r||jn){let s=jn?jn._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&j(e)?e.call(r&&r.proxy):e}}const yu=Symbol.for("v-scx"),wu=()=>rs(yu);function ss(t,e,n){return na(t,e,n)}function na(t,e,n=ae){const{immediate:r,deep:s,flush:i,once:o}=n,a=Ee({},n),l=e&&r||!e&&i!=="post";let f;if(kr){if(i==="sync"){const O=wu();f=O.__watcherHandles||(O.__watcherHandles=[])}else if(!l){const O=()=>{};return O.stop=Ct,O.resume=Ct,O.pause=Ct,O}}const h=Xe;a.call=(O,P,z)=>xt(O,h,P,z);let d=!1;i==="post"?a.scheduler=O=>{et(O,h&&h.suspense)}:i!=="sync"&&(d=!0,a.scheduler=(O,P)=>{P?O():ui(O)}),a.augmentJob=O=>{e&&(O.flags|=4),d&&(O.flags|=2,h&&(O.id=h.uid,O.i=h))};const x=lu(t,e,a);return kr&&(f?f.push(x):l&&x()),x}function _u(t,e,n){const r=this.proxy,s=xe(t)?t.includes(".")?ra(r,t):()=>r[t]:t.bind(r,r);let i;j(e)?i=e:(i=e.handler,n=e);const o=vr(this),a=na(s,i.bind(r),n);return o(),a}function ra(t,e){const n=e.split(".");return()=>{let r=t;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}const xu=Symbol("_vte"),is=t=>t.__isTeleport,fi=Symbol("_leaveCb");function vu(t){let e=t[0];if(t.length>1){for(const n of t)if(n.type!==Qt){e=n;break}}return e}function sa(t){if(!pi(t))return is(t.type)&&t.children?vu(t.children):t;if(t.component)return t.component.subTree;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&j(n.default))return n.default()}}function hi(t,e){if(t.shapeFlag&6&&t.component){t.transition=e;const n=t.component.subTree;hi(is(n.type)&&sa(n)||n,e)}else t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function ia(t,e){return j(t)?Ee({name:t.name},e,{setup:t}):t}function oa(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function aa(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const os=new WeakMap;function gr(t,e,n,r,s=!1){if(H(t)){t.forEach((z,ee)=>gr(z,e&&(H(e)?e[ee]:e),n,r,s));return}if(mr(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&gr(t,e,n,r.component.subTree);return}const i=r.shapeFlag&4?gs(r.component):r.el,o=s?null:i,{i:a,r:l}=t,f=e&&e.r,h=a.refs===ae?a.refs={}:a.refs,d=a.setupState,x=le(d),O=d===ae?yo:z=>aa(h,z)?!1:ue(x,z),P=(z,ee)=>!(ee&&aa(h,ee));if(f!=null&&f!==l){if(la(e),xe(f))h[f]=null,O(f)&&(d[f]=null);else if(ze(f)){const z=e;P(f,z.k)&&(f.value=null),z.k&&(h[z.k]=null)}}if(j(l))Fn(l,a,12,[o,h]);else{const z=xe(l),ee=ze(l);if(z||ee){const Y=()=>{if(t.f){const W=z?O(l)?d[l]:h[l]:P()||!t.k?l.value:h[t.k];if(s)H(W)&&js(W,i);else if(H(W))W.includes(i)||W.push(i);else if(z)h[l]=[i],O(l)&&(d[l]=h[l]);else{const X=[i];P(l,t.k)&&(l.value=X),t.k&&(h[t.k]=X)}}else z?(h[l]=o,O(l)&&(d[l]=o)):ee&&(P(l,t.k)&&(l.value=o),t.k&&(h[t.k]=o))};if(o){const W=()=>{Y(),os.delete(t)};W.id=-1,os.set(t,W),et(W,n)}else la(t),Y()}}}function la(t){const e=os.get(t);e&&(e.flags|=8,os.delete(t))}qr().requestIdleCallback,qr().cancelIdleCallback;const mr=t=>!!t.type.__asyncLoader,pi=t=>t.type.__isKeepAlive;function ku(t,e){ca(t,"a",e)}function Tu(t,e){ca(t,"da",e)}function ca(t,e,n=Xe){const r=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(as(e,r,n),n){let s=n.parent;for(;s&&s.parent;)pi(s.parent.vnode)&&Su(r,e,n,s),s=s.parent}}function Su(t,e,n,r){const s=as(e,t,r,!0);di(()=>{js(r[e],s)},n)}function as(t,e,n=Xe,r=!1){if(n){const s=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{Pt();const a=vr(n),l=xt(e,n,t,o);return a(),Nt(),l});return r?s.unshift(i):s.push(i),i}}const Jt=t=>(e,n=Xe)=>{(!kr||t==="sp")&&as(t,(...r)=>e(...r),n)},Eu=Jt("bm"),ua=Jt("m"),Au=Jt("bu"),Ru=Jt("u"),Cu=Jt("bum"),di=Jt("um"),Ou=Jt("sp"),Iu=Jt("rtg"),Pu=Jt("rtc");function Nu(t,e=Xe){as("ec",t,e)}const Lu=Symbol.for("v-ndc");function gi(t,e,n,r){let s;const i=n,o=H(t);if(o||xe(t)){const a=o&&xn(t);let l=!1,f=!1;a&&(l=!ct(t),f=Xt(t),t=Wr(t)),s=new Array(t.length);for(let h=0,d=t.length;h<d;h++)s[h]=e(l?f?$n(_t(t[h])):_t(t[h]):t[h],h,void 0,i)}else if(typeof t=="number"){s=new Array(t);for(let a=0;a<t;a++)s[a]=e(a+1,a,void 0,i)}else if(he(t))if(t[Symbol.iterator])s=Array.from(t,(a,l)=>e(a,l,void 0,i));else{const a=Object.keys(t);s=new Array(a.length);for(let l=0,f=a.length;l<f;l++){const h=a[l];s[l]=e(t[h],h,l,i)}}else s=[];return s}const mi=t=>t?Ha(t)?gs(t):mi(t.parent):null,br=Ee(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>mi(t.parent),$root:t=>mi(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>da(t),$forceUpdate:t=>t.f||(t.f=()=>{ui(t.update)}),$nextTick:t=>t.n||(t.n=pr.bind(t.proxy)),$watch:t=>_u.bind(t)}),bi=(t,e)=>t!==ae&&!t.__isScriptSetup&&ue(t,e),Mu={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:i,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const x=o[e];if(x!==void 0)switch(x){case 1:return r[e];case 2:return s[e];case 4:return n[e];case 3:return i[e]}else{if(bi(r,e))return o[e]=1,r[e];if(s!==ae&&ue(s,e))return o[e]=2,s[e];if(ue(i,e))return o[e]=3,i[e];if(n!==ae&&ue(n,e))return o[e]=4,n[e];yi&&(o[e]=0)}}const f=br[e];let h,d;if(f)return e==="$attrs"&&qe(t.attrs,"get",""),f(t);if((h=a.__cssModules)&&(h=h[e]))return h;if(n!==ae&&ue(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,ue(d,e))return d[e]},set({_:t},e,n){const{data:r,setupState:s,ctx:i}=t;return bi(s,e)?(s[e]=n,!0):r!==ae&&ue(r,e)?(r[e]=n,!0):ue(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:r,appContext:s,props:i,type:o}},a){let l;return!!(n[a]||t!==ae&&a[0]!=="$"&&ue(t,a)||bi(e,a)||ue(i,a)||ue(r,a)||ue(br,a)||ue(s.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:ue(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function fa(t){return H(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let yi=!0;function Du(t){const e=da(t),n=t.proxy,r=t.ctx;yi=!1,e.beforeCreate&&ha(e.beforeCreate,t,"bc");const{data:s,computed:i,methods:o,watch:a,provide:l,inject:f,created:h,beforeMount:d,mounted:x,beforeUpdate:O,updated:P,activated:z,deactivated:ee,beforeDestroy:Y,beforeUnmount:W,destroyed:X,unmounted:N,render:te,renderTracked:ve,renderTriggered:pe,errorCaptured:Ce,serverPrefetch:Et,expose:Ue,inheritAttrs:He,components:Ht,directives:tt,filters:dn}=e;if(f&&zu(f,r,null),o)for(const ce in o){const ie=o[ce];j(ie)&&(r[ce]=ie.bind(n))}if(s){const ce=s.call(n,n);he(ce)&&(t.data=oi(ce))}if(yi=!0,i)for(const ce in i){const ie=i[ce],Le=j(ie)?ie.bind(n,n):j(ie.get)?ie.get.bind(n,n):Ct,je=!j(ie)&&j(ie.set)?ie.set.bind(n):Ct,At=Si({get:Le,set:je});Object.defineProperty(r,ce,{enumerable:!0,configurable:!0,get:()=>At.value,set:Z=>At.value=Z})}if(a)for(const ce in a)pa(a[ce],r,n,ce);if(l){const ce=j(l)?l.call(n):l;Reflect.ownKeys(ce).forEach(ie=>{bu(ie,ce[ie])})}h&&ha(h,t,"c");function be(ce,ie){H(ie)?ie.forEach(Le=>ce(Le.bind(n))):ie&&ce(ie.bind(n))}if(be(Eu,d),be(ua,x),be(Au,O),be(Ru,P),be(ku,z),be(Tu,ee),be(Nu,Ce),be(Pu,ve),be(Iu,pe),be(Cu,W),be(di,N),be(Ou,Et),H(Ue))if(Ue.length){const ce=t.exposed||(t.exposed={});Ue.forEach(ie=>{Object.defineProperty(ce,ie,{get:()=>n[ie],set:Le=>n[ie]=Le,enumerable:!0})})}else t.exposed||(t.exposed={});te&&t.render===Ct&&(t.render=te),He!=null&&(t.inheritAttrs=He),Ht&&(t.components=Ht),tt&&(t.directives=tt),Et&&oa(t)}function zu(t,e,n=Ct){H(t)&&(t=wi(t));for(const r in t){const s=t[r];let i;he(s)?"default"in s?i=rs(s.from||r,s.default,!0):i=rs(s.from||r):i=rs(s),ze(i)?Object.defineProperty(e,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[r]=i}}function ha(t,e,n){xt(H(t)?t.map(r=>r.bind(e.proxy)):t.bind(e.proxy),e,n)}function pa(t,e,n,r){let s=r.includes(".")?ra(n,r):()=>n[r];if(xe(t)){const i=e[t];j(i)&&ss(s,i)}else if(j(t))ss(s,t.bind(n));else if(he(t))if(H(t))t.forEach(i=>pa(i,e,n,r));else{const i=j(t.handler)?t.handler.bind(n):e[t.handler];j(i)&&ss(s,i,t)}}function da(t){const e=t.type,{mixins:n,extends:r}=e,{mixins:s,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,a=i.get(e);let l;return a?l=a:!s.length&&!n&&!r?l=e:(l={},s.length&&s.forEach(f=>ls(l,f,o,!0)),ls(l,e,o)),he(e)&&i.set(e,l),l}function ls(t,e,n,r=!1){const{mixins:s,extends:i}=e;i&&ls(t,i,n,!0),s&&s.forEach(o=>ls(t,o,n,!0));for(const o in e)if(!(r&&o==="expose")){const a=Bu[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const Bu={data:ga,props:ma,emits:ma,methods:yr,computed:yr,beforeCreate:Ye,created:Ye,beforeMount:Ye,mounted:Ye,beforeUpdate:Ye,updated:Ye,beforeDestroy:Ye,beforeUnmount:Ye,destroyed:Ye,unmounted:Ye,activated:Ye,deactivated:Ye,errorCaptured:Ye,serverPrefetch:Ye,components:yr,directives:yr,watch:Fu,provide:ga,inject:$u};function ga(t,e){return e?t?function(){return Ee(j(t)?t.call(this,this):t,j(e)?e.call(this,this):e)}:e:t}function $u(t,e){return yr(wi(t),wi(e))}function wi(t){if(H(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Ye(t,e){return t?[...new Set([].concat(t,e))]:e}function yr(t,e){return t?Ee(Object.create(null),t,e):e}function ma(t,e){return t?H(t)&&H(e)?[...new Set([...t,...e])]:Ee(Object.create(null),fa(t),fa(e??{})):e}function Fu(t,e){if(!t)return e;if(!e)return t;const n=Ee(Object.create(null),t);for(const r in e)n[r]=Ye(t[r],e[r]);return n}function ba(){return{app:null,config:{isNativeTag:yo,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Uu=0;function Hu(t,e){return function(r,s=null){j(r)||(r=Ee({},r)),s!=null&&!he(s)&&(s=null);const i=ba(),o=new WeakSet,a=[];let l=!1;const f=i.app={_uid:Uu++,_component:r,_props:s,_container:null,_context:i,_instance:null,version:Tf,get config(){return i.config},set config(h){},use(h,...d){return o.has(h)||(h&&j(h.install)?(o.add(h),h.install(f,...d)):j(h)&&(o.add(h),h(f,...d))),f},mixin(h){return i.mixins.includes(h)||i.mixins.push(h),f},component(h,d){return d?(i.components[h]=d,f):i.components[h]},directive(h,d){return d?(i.directives[h]=d,f):i.directives[h]},mount(h,d,x){if(!l){const O=f._ceVNode||Dt(r,s);return O.appContext=i,x===!0?x="svg":x===!1&&(x=void 0),t(O,h,x),l=!0,f._container=h,h.__vue_app__=f,gs(O.component)}},onUnmount(h){a.push(h)},unmount(){l&&(xt(a,f._instance,16),t(null,f._container),delete f._container.__vue_app__)},provide(h,d){return i.provides[h]=d,f},runWithContext(h){const d=jn;jn=f;try{return h()}finally{jn=d}}};return f}}let jn=null;const ju=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${Qe(e)}Modifiers`]||t[`${st(e)}Modifiers`];function Vu(t,e,...n){if(t.isUnmounted)return;const r=t.vnode.props||ae;let s=n;const i=e.startsWith("update:"),o=i&&ju(r,e.slice(7));o&&(o.trim&&(s=n.map(h=>xe(h)?h.trim():h)),o.number&&(s=n.map(Ws)));let a,l=r[a=qs(e)]||r[a=qs(Qe(e))];!l&&i&&(l=r[a=qs(st(e))]),l&&xt(l,t,6,s);const f=r[a+"Once"];if(f){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,xt(f,t,6,s)}}const qu=new WeakMap;function ya(t,e,n=!1){const r=n?qu:e.emitsCache,s=r.get(t);if(s!==void 0)return s;const i=t.emits;let o={},a=!1;if(!j(t)){const l=f=>{const h=ya(f,e,!0);h&&(a=!0,Ee(o,h))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!i&&!a?(he(t)&&r.set(t,null),null):(H(i)?i.forEach(l=>o[l]=null):Ee(o,i),he(t)&&r.set(t,o),o)}function cs(t,e){return!t||!Fr(e)?!1:(e=e.slice(2),e=e==="Once"?e:e.replace(/Once$/,""),ue(t,e[0].toLowerCase()+e.slice(1))||ue(t,st(e))||ue(t,e))}function Hg(){}function wa(t){const{type:e,vnode:n,proxy:r,withProxy:s,propsOptions:[i],slots:o,attrs:a,emit:l,render:f,renderCache:h,props:d,data:x,setupState:O,ctx:P,inheritAttrs:z}=t,ee=ts(t);let Y,W;try{if(n.shapeFlag&4){const N=s||r,te=N;Y=zt(f.call(te,N,h,d,O,x,P)),W=a}else{const N=e;Y=zt(N.length>1?N(d,{attrs:a,slots:o,emit:l}):N(d,null)),W=e.props?a:Wu(a)}}catch(N){En.length=0,Qr(N,t,1),Y=Dt(Qt)}let X=Y;if(W&&z!==!1){const N=Object.keys(W),{shapeFlag:te}=X;N.length&&te&7&&(i&&N.some(Ur)&&(W=Ku(W,i)),X=Vn(X,W,!1,!0))}if(n.dirs&&(X=Vn(X,null,!1,!0),X.dirs=X.dirs?X.dirs.concat(n.dirs):n.dirs),n.transition){const N=is(X.type)&&sa(X)||X;hi(N,n.transition)}return Y=X,ts(ee),Y}const Wu=t=>{let e;for(const n in t)(n==="class"||n==="style"||Fr(n))&&((e||(e={}))[n]=t[n]);return e},Ku=(t,e)=>{const n={};for(const r in t)(!Ur(r)||!(r.slice(9)in e))&&(n[r]=t[r]);return n};function Gu(t,e,n){const{props:r,children:s,component:i}=t,{props:o,children:a,patchFlag:l}=e,f=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return r?_a(r,o,f):!!o;if(l&8){const h=e.dynamicProps;for(let d=0;d<h.length;d++){const x=h[d];if(xa(o,r,x)&&!cs(f,x))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===o?!1:r?o?_a(r,o,f):!0:!!o;return!1}function _a(t,e,n){const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!0;for(let s=0;s<r.length;s++){const i=r[s];if(xa(e,t,i)&&!cs(n,i))return!0}return!1}function xa(t,e,n){const r=t[n],s=e[n];return n==="style"&&he(r)&&he(s)?!Ks(r,s):r!==s}function Yu({vnode:t,parent:e,suspense:n},r){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=r,t=s),s===t)(t=e.vnode).el=r,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=r)}const va={},ka=()=>Object.create(va),Ta=t=>Object.getPrototypeOf(t)===va;function Xu(t,e,n,r=!1){const s={},i=ka();t.propsDefaults=Object.create(null),Sa(t,e,s,i);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=r?s:eu(s):t.type.props?t.props=s:t.props=i,t.attrs=i}function Zu(t,e,n,r){const{props:s,attrs:i,vnode:{patchFlag:o}}=t,a=le(s),[l]=t.propsOptions;let f=!1;if((r||o>0)&&!(o&16)){if(o&8){const h=t.vnode.dynamicProps;for(let d=0;d<h.length;d++){let x=h[d];if(cs(t.emitsOptions,x))continue;const O=e[x];if(l)if(ue(i,x))O!==i[x]&&(i[x]=O,f=!0);else{const P=Qe(x);s[P]=_i(l,a,P,O,t,!1)}else O!==i[x]&&(i[x]=O,f=!0)}}}else{Sa(t,e,s,i)&&(f=!0);let h;for(const d in a)(!e||!ue(e,d)&&((h=st(d))===d||!ue(e,h)))&&(l?n&&(n[d]!==void 0||n[h]!==void 0)&&(s[d]=_i(l,a,d,void 0,t,!0)):delete s[d]);if(i!==a)for(const d in i)(!e||!ue(e,d))&&(delete i[d],f=!0)}f&&Gt(t.attrs,"set","")}function Sa(t,e,n,r){const[s,i]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(or(l))continue;const f=e[l];let h;s&&ue(s,h=Qe(l))?!i||!i.includes(h)?n[h]=f:(a||(a={}))[h]=f:cs(t.emitsOptions,l)||(!(l in r)||f!==r[l])&&(r[l]=f,o=!0)}if(i){const l=le(n),f=a||ae;for(let h=0;h<i.length;h++){const d=i[h];n[d]=_i(s,l,d,f[d],t,!ue(f,d))}}return o}function _i(t,e,n,r,s,i){const o=t[n];if(o!=null){const a=ue(o,"default");if(a&&r===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&j(l)){const{propsDefaults:f}=s;if(n in f)r=f[n];else{const h=vr(s);r=f[n]=l.call(null,e),h()}}else r=l;s.ce&&s.ce._setProp(n,r)}o[0]&&(i&&!a?r=!1:o[1]&&(r===""||r===st(n))&&(r=!0))}return r}const Ju=new WeakMap;function Ea(t,e,n=!1){const r=n?Ju:e.propsCache,s=r.get(t);if(s)return s;const i=t.props,o={},a=[];let l=!1;if(!j(t)){const h=d=>{l=!0;const[x,O]=Ea(d,e,!0);Ee(o,x),O&&a.push(...O)};!n&&e.mixins.length&&e.mixins.forEach(h),t.extends&&h(t.extends),t.mixins&&t.mixins.forEach(h)}if(!i&&!l)return he(t)&&r.set(t,Dn),Dn;if(H(i))for(let h=0;h<i.length;h++){const d=Qe(i[h]);Aa(d)&&(o[d]=ae)}else if(i)for(const h in i){const d=Qe(h);if(Aa(d)){const x=i[h],O=o[d]=H(x)||j(x)?{type:x}:Ee({},x),P=O.type;let z=!1,ee=!0;if(H(P))for(let Y=0;Y<P.length;++Y){const W=P[Y],X=j(W)&&W.name;if(X==="Boolean"){z=!0;break}else X==="String"&&(ee=!1)}else z=j(P)&&P.name==="Boolean";O[0]=z,O[1]=ee,(z||ue(O,"default"))&&a.push(d)}}const f=[o,a];return he(t)&&r.set(t,f),f}function Aa(t){return t[0]!=="$"&&!or(t)}const xi=t=>t==="_"||t==="_ctx"||t==="$stable",vi=t=>H(t)?t.map(zt):[zt(t)],Qu=(t,e,n)=>{if(e._n)return e;const r=mu((...s)=>vi(e(...s)),n);return r._c=!1,r},Ra=(t,e,n)=>{const r=t._ctx;for(const s in t){if(xi(s))continue;const i=t[s];if(j(i))e[s]=Qu(s,i,r);else if(i!=null){const o=vi(i);e[s]=()=>o}}},Ca=(t,e)=>{const n=vi(e);t.slots.default=()=>n},Oa=(t,e,n)=>{for(const r in e)(n||!xi(r))&&(t[r]=e[r])},ef=(t,e,n)=>{const r=t.slots=ka();if(t.vnode.shapeFlag&32){const s=e._;s?(Oa(r,e,n),n&&To(r,"_",s,!0)):Ra(e,r)}else e&&Ca(t,e)},tf=(t,e,n)=>{const{vnode:r,slots:s}=t;let i=!0,o=ae;if(r.shapeFlag&32){const a=e._;a?n&&a===1?i=!1:Oa(s,e,n):(i=!e.$stable,Ra(e,s)),o=e}else e&&(Ca(t,e),o={default:1});if(i)for(const a in s)!xi(a)&&o[a]==null&&delete s[a]},et=af;function nf(t){return rf(t)}function rf(t,e){const n=qr();n.__VUE__=!0;const{insert:r,remove:s,patchProp:i,createElement:o,createText:a,createComment:l,setText:f,setElementText:h,parentNode:d,nextSibling:x,setScopeId:O=Ct,insertStaticContent:P}=t,z=(u,p,m,v=null,b=null,w=null,C=void 0,T=null,E=!!p.dynamicChildren)=>{if(u===p)return;u&&!_r(u,p)&&(v=mn(u),Z(u,b,w,!0),u=null),p.patchFlag===-2&&(E=!1,p.dynamicChildren=null);const{type:_,ref:F,shapeFlag:I}=p;switch(_){case us:ee(u,p,m,v);break;case Qt:Y(u,p,m,v);break;case Ti:u==null&&W(p,m,v,C);break;case Be:Ht(u,p,m,v,b,w,C,T,E);break;default:I&1?te(u,p,m,v,b,w,C,T,E):I&6?tt(u,p,m,v,b,w,C,T,E):(I&64||I&128)&&_.process(u,p,m,v,b,w,C,T,E,Rt)}F!=null&&b?gr(F,u&&u.ref,w,p||u,!p):F==null&&u&&u.ref!=null&&gr(u.ref,null,w,u,!0)},ee=(u,p,m,v)=>{if(u==null)r(p.el=a(p.children),m,v);else{const b=p.el=u.el;p.children!==u.children&&f(b,p.children)}},Y=(u,p,m,v)=>{u==null?r(p.el=l(p.children||""),m,v):p.el=u.el},W=(u,p,m,v)=>{[u.el,u.anchor]=P(u.children,p,m,v,u.el,u.anchor)},X=({el:u,anchor:p},m,v)=>{let b;for(;u&&u!==p;)b=x(u),r(u,m,v),u=b;r(p,m,v)},N=({el:u,anchor:p})=>{let m;for(;u&&u!==p;)m=x(u),s(u),u=m;s(p)},te=(u,p,m,v,b,w,C,T,E)=>{if(p.type==="svg"?C="svg":p.type==="math"&&(C="mathml"),u==null)ve(p,m,v,b,w,C,T,E);else{const _=u.el&&u.el._isVueCE?u.el:null;try{_&&_._beginPatch(),Et(u,p,b,w,C,T,E)}finally{_&&_._endPatch()}}},ve=(u,p,m,v,b,w,C,T)=>{let E,_;const{props:F,shapeFlag:I,transition:L,dirs:$}=u;if(E=u.el=o(u.type,w,F&&F.is,F),I&8?h(E,u.children):I&16&&Ce(u.children,E,null,v,b,ki(u,w),C,T),$&&Tn(u,null,v,"created"),pe(E,u,u.scopeId,C,v),F){for(const oe in F)oe!=="value"&&!or(oe)&&i(E,oe,null,F[oe],w,v);"value"in F&&i(E,"value",null,F.value,w),(_=F.onVnodeBeforeMount)&&Bt(_,v,u)}$&&Tn(u,null,v,"beforeMount");const q=sf(b,L);q&&L.beforeEnter(E),r(E,p,m),((_=F&&F.onVnodeMounted)||q||$)&&et(()=>{try{_&&Bt(_,v,u),q&&L.enter(E),$&&Tn(u,null,v,"mounted")}finally{}},b)},pe=(u,p,m,v,b)=>{if(m&&O(u,m),v)for(let w=0;w<v.length;w++)O(u,v[w]);if(b){let w=b.subTree;if(p===w||Ma(w.type)&&(w.ssContent===p||w.ssFallback===p)){const C=b.vnode;pe(u,C,C.scopeId,C.slotScopeIds,b.parent)}}},Ce=(u,p,m,v,b,w,C,T,E=0)=>{for(let _=E;_<u.length;_++){const F=u[_]=T?en(u[_]):zt(u[_]);z(null,F,p,m,v,b,w,C,T)}},Et=(u,p,m,v,b,w,C)=>{const T=p.el=u.el;let{patchFlag:E,dynamicChildren:_,dirs:F}=p;E|=u.patchFlag&16;const I=u.props||ae,L=p.props||ae;let $;if(m&&Sn(m,!1),($=L.onVnodeBeforeUpdate)&&Bt($,m,p,u),F&&Tn(p,u,m,"beforeUpdate"),m&&Sn(m,!0),_&&(!u.dynamicChildren||u.dynamicChildren.length!==_.length)&&(E=0,C=!1,_=null),(I.innerHTML&&L.innerHTML==null||I.textContent&&L.textContent==null)&&h(T,""),_?Ue(u.dynamicChildren,_,T,m,v,ki(p,b),w):C||ie(u,p,T,null,m,v,ki(p,b),w,!1),E>0){if(E&16)He(T,I,L,m,b);else if(E&2&&I.class!==L.class&&i(T,"class",null,L.class,b),E&4&&i(T,"style",I.style,L.style,b),E&8){const q=p.dynamicProps;for(let oe=0;oe<q.length;oe++){const re=q[oe],ye=I[re],Te=L[re];(Te!==ye||re==="value")&&i(T,re,ye,Te,b,m)}}E&1&&u.children!==p.children&&h(T,p.children)}else!C&&_==null&&He(T,I,L,m,b);(($=L.onVnodeUpdated)||F)&&et(()=>{$&&Bt($,m,p,u),F&&Tn(p,u,m,"updated")},v)},Ue=(u,p,m,v,b,w,C)=>{for(let T=0;T<p.length;T++){const E=u[T],_=p[T],F=E.el&&(E.type===Be||!_r(E,_)||E.shapeFlag&198)?d(E.el):m;z(E,_,F,null,v,b,w,C,!0)}},He=(u,p,m,v,b)=>{if(p!==m){if(p!==ae)for(const w in p)!or(w)&&!(w in m)&&i(u,w,p[w],null,b,v);for(const w in m){if(or(w))continue;const C=m[w],T=p[w];C!==T&&w!=="value"&&i(u,w,T,C,b,v)}"value"in m&&i(u,"value",p.value,m.value,b)}},Ht=(u,p,m,v,b,w,C,T,E)=>{const _=p.el=u?u.el:a(""),F=p.anchor=u?u.anchor:a("");let{patchFlag:I,dynamicChildren:L,slotScopeIds:$}=p;$&&(T=T?T.concat($):$),u==null?(r(_,m,v),r(F,m,v),Ce(p.children||[],m,F,b,w,C,T,E)):I>0&&I&64&&L&&u.dynamicChildren&&u.dynamicChildren.length===L.length?(Ue(u.dynamicChildren,L,m,b,w,C,T),(p.key!=null||b&&p===b.subTree)&&Ia(u,p,!0)):ie(u,p,m,F,b,w,C,T,E)},tt=(u,p,m,v,b,w,C,T,E)=>{p.slotScopeIds=T,u==null?p.shapeFlag&512?b.ctx.activate(p,m,v,C,E):dn(p,m,v,b,w,C,E):In(u,p,E)},dn=(u,p,m,v,b,w,C)=>{const T=u.component=df(u,v,b);if(pi(u)&&(T.ctx.renderer=Rt),mf(T,!1,C),T.asyncDep){if(b&&b.registerDep(T,be,C),!u.el){const E=T.subTree=Dt(Qt);Y(null,E,p,m),u.placeholder=E.el}}else be(T,u,p,m,b,w,C)},In=(u,p,m)=>{const v=p.component=u.component;if(Gu(u,p,m))if(v.asyncDep&&!v.asyncResolved){ce(v,p,m);return}else v.next=p,v.update();else p.el=u.el,v.vnode=p},be=(u,p,m,v,b,w,C)=>{const T=()=>{if(u.isMounted){let{next:I,bu:L,u:$,parent:q,vnode:oe}=u;{const Ve=Pa(u);if(Ve){I&&(I.el=oe.el,ce(u,I,C)),Ve.asyncDep.then(()=>{et(()=>{u.isUnmounted||_()},b)});return}}let re=I,ye;Sn(u,!1),I?(I.el=oe.el,ce(u,I,C)):I=oe,L&&Vr(L),(ye=I.props&&I.props.onVnodeBeforeUpdate)&&Bt(ye,q,I,oe),Sn(u,!0);const Te=wa(u),Oe=u.subTree;u.subTree=Te,z(Oe,Te,d(Oe.el),mn(Oe),u,b,w),I.el=Te.el,re===null&&Yu(u,Te.el),$&&et($,b),(ye=I.props&&I.props.onVnodeUpdated)&&et(()=>Bt(ye,q,I,oe),b)}else{let I;const{el:L,props:$}=p,{bm:q,m:oe,parent:re,root:ye,type:Te}=u,Oe=mr(p);Sn(u,!1),q&&Vr(q),!Oe&&(I=$&&$.onVnodeBeforeMount)&&Bt(I,re,p),Sn(u,!0);{ye.ce&&ye.ce._hasShadowRoot()&&ye.ce._injectChildStyle(Te,u.parent?u.parent.type:void 0);const Ve=u.subTree=wa(u);z(null,Ve,m,v,u,b,w),p.el=Ve.el}if(oe&&et(oe,b),!Oe&&(I=$&&$.onVnodeMounted)){const Ve=p;et(()=>Bt(I,re,Ve),b)}(p.shapeFlag&256||re&&mr(re.vnode)&&re.vnode.shapeFlag&256)&&u.a&&et(u.a,b),u.isMounted=!0,p=m=v=null}};u.scope.on();const E=u.effect=new Oo(T);u.scope.off();const _=u.update=E.run.bind(E),F=u.job=E.runIfDirty.bind(E);F.i=u,F.id=u.uid,E.scheduler=()=>ui(F),Sn(u,!0),_()},ce=(u,p,m)=>{p.component=u;const v=u.vnode.props;u.vnode=p,u.next=null,Zu(u,p.props,v,m),tf(u,p.children,m),Pt(),Jo(u),Nt()},ie=(u,p,m,v,b,w,C,T,E=!1)=>{const _=u&&u.children,F=u?u.shapeFlag:0,I=p.children,{patchFlag:L,shapeFlag:$}=p;if(L>0){if(L&128){je(_,I,m,v,b,w,C,T,E);return}else if(L&256){Le(_,I,m,v,b,w,C,T,E);return}}$&8?(F&16&&rn(_,b,w),I!==_&&h(m,I)):F&16?$&16?je(_,I,m,v,b,w,C,T,E):rn(_,b,w,!0):(F&8&&h(m,""),$&16&&Ce(I,m,v,b,w,C,T,E))},Le=(u,p,m,v,b,w,C,T,E)=>{u=u||Dn,p=p||Dn;const _=u.length,F=p.length,I=Math.min(_,F);let L;for(L=0;L<I;L++){const $=p[L]=E?en(p[L]):zt(p[L]);z(u[L],$,m,null,b,w,C,T,E)}_>F?rn(u,b,w,!0,!1,I):Ce(p,m,v,b,w,C,T,E,I)},je=(u,p,m,v,b,w,C,T,E)=>{let _=0;const F=p.length;let I=u.length-1,L=F-1;for(;_<=I&&_<=L;){const $=u[_],q=p[_]=E?en(p[_]):zt(p[_]);if(_r($,q))z($,q,m,null,b,w,C,T,E);else break;_++}for(;_<=I&&_<=L;){const $=u[I],q=p[L]=E?en(p[L]):zt(p[L]);if(_r($,q))z($,q,m,null,b,w,C,T,E);else break;I--,L--}if(_>I){if(_<=L){const $=L+1,q=$<F?p[$].el:v;for(;_<=L;)z(null,p[_]=E?en(p[_]):zt(p[_]),m,q,b,w,C,T,E),_++}}else if(_>L)for(;_<=I;)Z(u[_],b,w,!0),_++;else{const $=_,q=_,oe=new Map;for(_=q;_<=L;_++){const Me=p[_]=E?en(p[_]):zt(p[_]);Me.key!=null&&oe.set(Me.key,_)}let re,ye=0;const Te=L-q+1;let Oe=!1,Ve=0;const ht=new Array(Te);for(_=0;_<Te;_++)ht[_]=0;for(_=$;_<=I;_++){const Me=u[_];if(ye>=Te){Z(Me,b,w,!0);continue}let Ze;if(Me.key!=null)Ze=oe.get(Me.key);else for(re=q;re<=L;re++)if(ht[re-q]===0&&_r(Me,p[re])){Ze=re;break}Ze===void 0?Z(Me,b,w,!0):(ht[Ze-q]=_+1,Ze>=Ve?Ve=Ze:Oe=!0,z(Me,p[Ze],m,null,b,w,C,T,E),ye++)}const Pn=Oe?of(ht):Dn;for(re=Pn.length-1,_=Te-1;_>=0;_--){const Me=q+_,Ze=p[Me],on=p[Me+1],Vt=Me+1<F?on.el||La(on):v;ht[_]===0?z(null,Ze,m,Vt,b,w,C,T,E):Oe&&(re<0||_!==Pn[re]?At(Ze,m,Vt,2):re--)}}},At=(u,p,m,v,b=null)=>{const{el:w,type:C,transition:T,children:E,shapeFlag:_}=u;if(_&6){At(u.component.subTree,p,m,v);return}if(_&128){u.suspense.move(p,m,v);return}if(_&64){C.move(u,p,m,Rt);return}if(C===Be){r(w,p,m);for(let I=0;I<E.length;I++)At(E[I],p,m,v);r(u.anchor,p,m);return}if(C===Ti){X(u,p,m);return}if(v!==2&&_&1&&T)if(v===0)T.persisted&&!w[fi]?r(w,p,m):(T.beforeEnter(w),r(w,p,m),et(()=>T.enter(w),b));else{const{leave:I,delayLeave:L,afterLeave:$}=T,q=()=>{u.ctx.isUnmounted?s(w):r(w,p,m)},oe=()=>{const re=w._isLeaving||!!w[fi];w._isLeaving&&w[fi](!0),T.persisted&&!re?q():I(w,()=>{q(),$&&$()})};L?L(w,q,oe):oe()}else r(w,p,m)},Z=(u,p,m,v=!1,b=!1)=>{const{type:w,props:C,ref:T,children:E,dynamicChildren:_,shapeFlag:F,patchFlag:I,dirs:L,cacheIndex:$,memo:q}=u;if(I===-2&&(b=!1),T!=null&&(Pt(),gr(T,null,m,u,!0),Nt()),$!=null&&(p.renderCache[$]=void 0),F&256){p.ctx.deactivate(u);return}const oe=F&1&&L,re=!mr(u);let ye;if(re&&(ye=C&&C.onVnodeBeforeUnmount)&&Bt(ye,p,u),F&6)er(u.component,m,v);else{if(F&128){u.suspense.unmount(m,v);return}oe&&Tn(u,null,p,"beforeUnmount"),F&64?u.type.remove(u,p,m,Rt,v):_&&!_.hasOnce&&(w!==Be||I>0&&I&64)?rn(_,p,m,!1,!0):(w===Be&&I&384||!b&&F&16)&&rn(E,p,m),v&&Qn(u)}const Te=q!=null&&$==null;(re&&(ye=C&&C.onVnodeUnmounted)||oe||Te)&&et(()=>{ye&&Bt(ye,p,u),oe&&Tn(u,null,p,"unmounted"),Te&&(u.el=null)},m)},Qn=u=>{const{type:p,el:m,anchor:v,transition:b}=u;if(p===Be){gn(m,v);return}if(p===Ti){N(u);return}const w=()=>{s(m),b&&!b.persisted&&b.afterLeave&&b.afterLeave()};if(u.shapeFlag&1&&b&&!b.persisted){const{leave:C,delayLeave:T}=b,E=()=>C(m,w);T?T(u.el,w,E):E()}else w()},gn=(u,p)=>{let m;for(;u!==p;)m=x(u),s(u),u=m;s(p)},er=(u,p,m)=>{const{bum:v,scope:b,job:w,subTree:C,um:T,m:E,a:_}=u;Na(E),Na(_),v&&Vr(v),b.stop(),w&&(w.flags|=8,Z(C,u,p,m)),T&&et(T,p),et(()=>{u.isUnmounted=!0},p)},rn=(u,p,m,v=!1,b=!1,w=0)=>{for(let C=w;C<u.length;C++)Z(u[C],p,m,v,b)},mn=u=>{if(u.shapeFlag&6)return mn(u.component.subTree);if(u.shapeFlag&128)return u.suspense.next();const p=x(u.anchor||u.el),m=p&&p[xu];return m?x(m):p};let lt=!1;const jt=(u,p,m)=>{let v;u==null?p._vnode&&(Z(p._vnode,null,null,!0),v=p._vnode.component):z(p._vnode||null,u,p,null,null,null,m),p._vnode=u,lt||(lt=!0,Jo(v),Qo(),lt=!1)},Rt={p:z,um:Z,m:At,r:Qn,mt:dn,mc:Ce,pc:ie,pbc:Ue,n:mn,o:t};return{render:jt,hydrate:void 0,createApp:Hu(jt)}}function ki({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function Sn({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function sf(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function Ia(t,e,n=!1){const r=t.children,s=e.children;if(H(r)&&H(s))for(let i=0;i<r.length;i++){const o=r[i];let a=s[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[i]=en(s[i]),a.el=o.el),!n&&a.patchFlag!==-2&&Ia(o,a)),a.type===us&&(a.patchFlag===-1&&(a=s[i]=en(a)),a.el=o.el),a.type===Qt&&!a.el&&(a.el=o.el)}}function of(t){const e=t.slice(),n=[0];let r,s,i,o,a;const l=t.length;for(r=0;r<l;r++){const f=t[r];if(f!==0){if(s=n[n.length-1],t[s]<f){e[r]=s,n.push(r);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,t[n[a]]<f?i=a+1:o=a;f<t[n[i]]&&(i>0&&(e[r]=n[i-1]),n[i]=r)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function Pa(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Pa(e)}function Na(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function La(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?La(e.subTree):null}const Ma=t=>t.__isSuspense;function af(t,e){e&&e.pendingBranch?H(t)?e.effects.push(...t):e.effects.push(t):gu(t)}const Be=Symbol.for("v-fgt"),us=Symbol.for("v-txt"),Qt=Symbol.for("v-cmt"),Ti=Symbol.for("v-stc"),En=[];let it=null;function G(t=!1){En.push(it=t?null:[])}function Da(){En.pop(),it=En[En.length-1]||null}let wr=1;function za(t,e=!1){wr+=t,t<0&&it&&e&&(it.hasOnce=!0)}function Ba(t){return t.dynamicChildren=wr>0?it||Dn:null,Da(),wr>0&&it&&it.push(t),t}function J(t,e,n,r,s,i){return Ba(B(t,e,n,r,s,i,!0))}function lf(t,e,n,r,s){return Ba(Dt(t,e,n,r,s,!0))}function $a(t){return t?t.__v_isVNode===!0:!1}function _r(t,e){return t.type===e.type&&t.key===e.key}const Fa=({key:t})=>t??null,fs=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?xe(t)||ze(t)||j(t)?{i:ut,r:t,k:e,f:!!n}:t:null);function B(t,e=null,n=null,r=0,s=null,i=t===Be?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&Fa(e),ref:e&&fs(e),scopeId:ta,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:ut};return a?(ps(l,n),i&128&&t.normalize(l)):n&&(l.shapeFlag|=xe(n)?8:16),wr>0&&!o&&it&&(l.patchFlag>0||i&6)&&l.patchFlag!==32&&it.push(l),l}const Dt=cf;function cf(t,e=null,n=null,r=0,s=null,i=!1){if((!t||t===Lu)&&(t=Qt),$a(t)){const a=Vn(t,e,!0);return n&&ps(a,n),wr>0&&!i&&it&&(a.shapeFlag&6?it[it.indexOf(t)]=a:it.push(a)),a.patchFlag=-2,a}if(kf(t)&&(t=t.__vccOpts),e){e=uf(e);let{class:a,style:l}=e;a&&!xe(a)&&(e.class=wn(a)),he(l)&&(li(l)&&!H(l)&&(l=Ee({},l)),e.style=yt(l))}const o=xe(t)?1:Ma(t)?128:is(t)?64:he(t)?4:j(t)?2:0;return B(t,e,n,r,s,o,i,!0)}function uf(t){return t?li(t)||Ta(t)?Ee({},t):t:null}function Vn(t,e,n=!1,r=!1){const{props:s,ref:i,patchFlag:o,children:a,transition:l}=t,f=e?ff(s||{},e):s,h={__v_isVNode:!0,__v_skip:!0,type:t.type,props:f,key:f&&Fa(f),ref:e&&e.ref?n&&i?H(i)?i.concat(fs(e)):[i,fs(e)]:fs(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Be?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Vn(t.ssContent),ssFallback:t.ssFallback&&Vn(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&r&&hi(h,l.clone(h)),h}function hs(t=" ",e=0){return Dt(us,null,t,e)}function ot(t="",e=!1){return e?(G(),lf(Qt,null,t)):Dt(Qt,null,t)}function zt(t){return t==null||typeof t=="boolean"?Dt(Qt):H(t)?Dt(Be,null,t.slice()):$a(t)?en(t):Dt(us,null,String(t))}function en(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Vn(t)}function ps(t,e){let n=0;const{shapeFlag:r}=t;if(e==null)e=null;else if(H(e))n=16;else if(typeof e=="object")if(r&65){const s=e.default;s&&(s._c&&(s._d=!1),ps(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!Ta(e)?e._ctx=ut:s===3&&ut&&(ut.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else if(j(e)){if(r&65){ps(t,{default:e});return}e={default:e,_ctx:ut},n=32}else e=String(e),r&64?(n=16,e=[hs(e)]):n=8;t.children=e,t.shapeFlag|=n}function ff(...t){const e={};for(let n=0;n<t.length;n++){const r=t[n];for(const s in r)if(s==="class")e.class!==r.class&&(e.class=wn([e.class,r.class]));else if(s==="style")e.style=yt([e.style,r.style]);else if(Fr(s)){const i=e[s],o=r[s];o&&i!==o&&!(H(i)&&i.includes(o))?e[s]=i?[].concat(i,o):o:o==null&&i==null&&!Ur(s)&&(e[s]=o)}else s!==""&&(e[s]=r[s])}return e}function Bt(t,e,n,r=null){xt(t,e,7,[n,r])}const hf=ba();let pf=0;function df(t,e,n){const r=t.type,s=(e?e.appContext:t.appContext)||hf,i={uid:pf++,vnode:t,type:r,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Mc(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Ea(r,s),emitsOptions:ya(r,s),emit:null,emitted:null,propsDefaults:ae,inheritAttrs:r.inheritAttrs,ctx:ae,data:ae,props:ae,attrs:ae,slots:ae,refs:ae,setupState:ae,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=Vu.bind(null,i),t.ce&&t.ce(i),i}let Xe=null;const gf=()=>Xe||ut;let ds,xr;{const t=qr(),e=(n,r)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(r),i=>{s.length>1?s.forEach(o=>o(i)):s[0](i)}};ds=e("__VUE_INSTANCE_SETTERS__",n=>Xe=n),xr=e("__VUE_SSR_SETTERS__",n=>kr=n)}const vr=t=>{const e=Xe;return ds(t),t.scope.on(),()=>{t.scope.off(),ds(e)}},Ua=()=>{Xe&&Xe.scope.off(),ds(null)};function Ha(t){return t.vnode.shapeFlag&4}let kr=!1;function mf(t,e=!1,n=!1){e&&xr(e);const{props:r,children:s}=t.vnode,i=Ha(t);Xu(t,r,i,e),ef(t,s,n||e);const o=i?bf(t,e):void 0;return e&&xr(!1),o}function bf(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,Mu);const{setup:r}=n;if(r){Pt();const s=t.setupContext=r.length>1?wf(t):null,i=vr(t),o=Fn(r,t,0,[t.props,s]),a=xo(o);if(Nt(),i(),(a||t.sp)&&!mr(t)&&oa(t),a){if(o.then(Ua,Ua),e)return o.then(l=>{xr(!0);try{ja(t,l,e)}finally{xr(!1)}}).catch(l=>{Qr(l,t,0)});t.asyncDep=o}else ja(t,o)}else Va(t)}function ja(t,e,n){j(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:he(e)&&(t.setupState=Go(e)),Va(t)}function Va(t,e,n){const r=t.type;t.render||(t.render=r.render||Ct);{const s=vr(t);Pt();try{Du(t)}finally{Nt(),s()}}}const yf={get(t,e){return qe(t,"get",""),t[e]}};function wf(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,yf),slots:t.slots,emit:t.emit,expose:e}}function gs(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(Go(tu(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in br)return br[n](t)},has(e,n){return n in e||n in br}})):t.proxy}const _f=/(?:^|[-_])\w/g,xf=t=>t.replace(_f,e=>e.toUpperCase()).replace(/[-_]/g,"");function vf(t,e=!0){return j(t)?t.displayName||t.name:t.name||e&&t.__name}function qa(t,e,n=!1){let r=vf(e);if(!r&&e.__file){const s=e.__file.match(/([^/\\]+)\.\w+$/);s&&(r=s[1])}if(!r&&t){const s=i=>{for(const o in i)if(i[o]===e)return o};r=s(t.components)||t.parent&&s(t.parent.type.components)||s(t.appContext.components)}return r?xf(r):n?"App":"Anonymous"}function kf(t){return j(t)&&"__vccOpts"in t}const Si=(t,e)=>ou(t,e,kr),Tf="3.5.41";/**
* @vue/runtime-dom v3.5.41
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ei;const Wa=typeof window<"u"&&window.trustedTypes;if(Wa)try{Ei=Wa.createPolicy("vue",{createHTML:t=>t})}catch{}const Ka=Ei?t=>Ei.createHTML(t):t=>t,Sf="http://www.w3.org/2000/svg",Ef="http://www.w3.org/1998/Math/MathML",tn=typeof document<"u"?document:null,Ga=tn&&tn.createElement("template"),Af={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,r)=>{const s=e==="svg"?tn.createElementNS(Sf,t):e==="mathml"?tn.createElementNS(Ef,t):n?tn.createElement(t,{is:n}):tn.createElement(t);return t==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:t=>tn.createTextNode(t),createComment:t=>tn.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>tn.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,r,s,i){const o=n?n.previousSibling:e.lastChild;if(s&&(s===i||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===i||!(s=s.nextSibling)););else{Ga.innerHTML=Ka(r==="svg"?`<svg>${t}</svg>`:r==="mathml"?`<math>${t}</math>`:t);const a=Ga.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Rf=Symbol("_vtc");function Cf(t,e,n){const r=t[Rf];r&&(e=(e?[e,...r]:[...r]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const Ya=Symbol("_vod"),Of=Symbol("_vsh"),If=Symbol(""),Pf=/(?:^|;)\s*display\s*:/;function Nf(t,e,n){const r=t.style,s=xe(n);let i=!1;if(n&&!s){if(e)if(xe(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Tr(r,a,"")}else for(const o in e)n[o]==null&&Tr(r,o,"");for(const o in n){o==="display"&&(i=!0);const a=n[o];a!=null?Mf(t,o,!xe(e)&&e?e[o]:void 0,a)||Tr(r,o,a):Tr(r,o,"")}}else if(s){if(e!==n){const o=r[If];o&&(n+=";"+o),r.cssText=n,i=Pf.test(n)}}else e&&t.removeAttribute("style");Ya in t&&(t[Ya]=i?r.display:"",t[Of]&&(r.display="none"))}const Xa=/\s*!important$/;function Tr(t,e,n){if(H(n))n.forEach(r=>Tr(t,e,r));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const r=Lf(t,e);Xa.test(n)?t.setProperty(st(r),n.replace(Xa,""),"important"):t[r]=n}}const Za=["Webkit","Moz","ms"],Ai={};function Lf(t,e){const n=Ai[e];if(n)return n;let r=Qe(e);if(r!=="filter"&&r in t)return Ai[e]=r;r=ko(r);for(let s=0;s<Za.length;s++){const i=Za[s]+r;if(i in t)return Ai[e]=i}return e}function Mf(t,e,n,r){return t.tagName==="TEXTAREA"&&(e==="width"||e==="height")&&xe(r)&&n===r}const Ja="http://www.w3.org/1999/xlink";function Qa(t,e,n,r,s,i=Nc(e)){r&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Ja,e.slice(6,e.length)):t.setAttributeNS(Ja,e,n):n==null||i&&!Ao(n)?t.removeAttribute(e):t.setAttribute(e,i?"":Ot(n)?String(n):n)}function el(t,e,n,r,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?Ka(n):n);return}const i=t.tagName;if(e==="value"&&i!=="PROGRESS"&&!i.includes("-")){const a=i==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=Ao(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(s||e)}function qn(t,e,n,r){t.addEventListener(e,n,r)}function Df(t,e,n,r){t.removeEventListener(e,n,r)}const tl=Symbol("_vei");function zf(t,e,n,r,s=null){const i=t[tl]||(t[tl]={}),o=i[e];if(r&&o)o.value=r;else{const[a,l]=Ff(e);if(r){const f=i[e]=jf(r,s);qn(t,a,f,l)}else o&&(Df(t,a,o,l),i[e]=void 0)}}const Bf=/(Once|Passive|Capture)$/,$f=/^on:?(?:Once|Passive|Capture)$/;function Ff(t){let e,n;for(;(n=t.match(Bf))&&!$f.test(t);)e||(e={}),t=t.slice(0,t.length-n[1].length),e[n[1].toLowerCase()]=!0;return[t[2]===":"?t.slice(3):st(t.slice(2)),e]}let Ri=0;const Uf=Promise.resolve(),Hf=()=>Ri||(Uf.then(()=>Ri=0),Ri=Date.now());function jf(t,e){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;const s=n.value;if(H(s)){const i=r.stopImmediatePropagation;r.stopImmediatePropagation=()=>{i.call(r),r._stopped=!0};const o=s.slice(),a=[r];for(let l=0;l<o.length&&!r._stopped;l++){const f=o[l];f&&xt(f,e,5,a)}}else xt(s,e,5,[r])};return n.value=t,n.attached=Hf(),n}const nl=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,Vf=(t,e,n,r,s,i)=>{const o=s==="svg";e==="class"?Cf(t,r,o):e==="style"?Nf(t,n,r):Fr(e)?Ur(e)||zf(t,e,n,r,i):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):qf(t,e,r,o))?(el(t,e,r),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&Qa(t,e,r,o,i,e!=="value")):t._isVueCE&&(Wf(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!xe(r)))?el(t,Qe(e),r,i,e):(e==="true-value"?t._trueValue=r:e==="false-value"&&(t._falseValue=r),Qa(t,e,r,o))};function qf(t,e,n,r){if(r)return!!(e==="innerHTML"||e==="textContent"||e in t&&nl(e)&&j(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return nl(e)&&xe(n)?!1:e in t}function Wf(t,e){const n=t._def.props;if(!n)return!1;const r=Qe(e);return Array.isArray(n)?n.some(s=>Qe(s)===r):Object.keys(n).some(s=>Qe(s)===r)}const rl={};function Kf(t,e,n){let r=ia(t,e);Hr(r)&&(r=Ee({},r,e));class s extends Ci{constructor(o){super(r,o,n)}}return s.def=r,s}const Gf=typeof HTMLElement<"u"?HTMLElement:class{};class Ci extends Gf{constructor(e,n={},r=cl){super(),this._def=e,this._props=n,this._createApp=r,this._isVueCE=!0,this._instance=null,this._app=null,this._nonce=this._def.nonce,this._connected=!1,this._resolved=!1,this._patching=!1,this._dirty=!1,this._numberProps=null,this._styleChildren=new WeakSet,this._styleAnchors=new WeakMap,this._ob=null,this.shadowRoot&&r!==cl?this._root=this.shadowRoot:e.shadowRoot!==!1?(this.attachShadow(Ee({},e.shadowRootOptions,{mode:"open"})),this._root=this.shadowRoot):this._root=this}connectedCallback(){if(!this.isConnected)return;!this.shadowRoot&&!this._resolved&&this._parseSlots(),this._connected=!0;let e=this;for(;e=e&&(e.assignedSlot||e.parentNode||e.host);)if(e instanceof Ci){this._parent=e;break}this._instance||(this._resolved?this._mount(this._def):e&&e._pendingResolve?this._pendingResolve=e._pendingResolve.then(()=>{if(this._pendingResolve=void 0,this.isConnected)return this._resolveDef()}):this._resolveDef())}_setParent(e=this._parent){e&&(this._instance.parent=e._instance,this._inheritParentContext(e))}_inheritParentContext(e=this._parent){e&&this._app&&Object.setPrototypeOf(this._app._context.provides,e._instance.provides)}disconnectedCallback(){this._connected=!1,pr(()=>{this._connected||(this._ob&&(this._ob.disconnect(),this._ob=null),this._app&&this._app.unmount(),this._instance&&(this._instance.ce=void 0),this._app=this._instance=null,this._teleportTargets&&(this._teleportTargets.clear(),this._teleportTargets=void 0))})}_processMutations(e){for(const n of e)this._setAttr(n.attributeName)}_resolveDef(){if(this._pendingResolve)return this._pendingResolve;for(let r=0;r<this.attributes.length;r++)this._setAttr(this.attributes[r].name);this._ob=new MutationObserver(this._processMutations.bind(this)),this._ob.observe(this,{attributes:!0});const e=(r,s=!1)=>{this._resolved=!0,this._pendingResolve=void 0;const{props:i,styles:o}=r;let a;if(i&&!H(i))for(const l in i){const f=i[l];(f===Number||f&&f.type===Number)&&(l in this._props&&(this._props[l]=So(this._props[l])),(a||(a=Object.create(null)))[Qe(l)]=!0)}this._numberProps=a,this._resolveProps(r),this.shadowRoot&&this._applyStyles(o),this._mount(r)},n=this._def.__asyncLoader;if(n)return this._pendingResolve=n().then(r=>{r.configureApp=this._def.configureApp,e(this._def=r,!0)}),this._pendingResolve;e(this._def)}_mount(e){this._app=this._createApp(e),this._inheritParentContext(),e.configureApp&&e.configureApp(this._app),this._app._ceVNode=this._createVNode(),this._app.mount(this._root);const n=this._instance&&this._instance.exposed;if(n)for(const r in n)ue(this,r)||Object.defineProperty(this,r,{get:()=>vn(n[r])})}_resolveProps(e){const{props:n}=e,r=H(n)?n:Object.keys(n||{});for(const s of Object.keys(this))s[0]!=="_"&&r.includes(s)&&this._setProp(s,this[s]);for(const s of r.map(Qe))Object.defineProperty(this,s,{get(){return this._getProp(s)},set(i){this._setProp(s,i,!0,!this._patching)}})}_setAttr(e){if(e.startsWith("data-v-"))return;const n=this.hasAttribute(e);let r=n?this.getAttribute(e):rl;const s=Qe(e);n&&this._numberProps&&this._numberProps[s]&&(r=So(r)),this._setProp(s,r,!1,!0)}_getProp(e){return this._props[e]}_setProp(e,n,r=!0,s=!1){if(n!==this._props[e]&&(this._dirty=!0,n===rl?delete this._props[e]:(this._props[e]=n,e==="key"&&this._app&&(this._app._ceVNode.key=n)),s&&this._instance&&this._update(),r)){const i=this._ob;i&&(this._processMutations(i.takeRecords()),i.disconnect()),n===!0?this.setAttribute(st(e),""):typeof n=="string"||typeof n=="number"?this.setAttribute(st(e),n+""):n||this.removeAttribute(st(e)),i&&i.observe(this,{attributes:!0})}}_update(){const e=this._createVNode();this._app&&(e.appContext=this._app._context),eh(e,this._root)}_createVNode(){const e={};this.shadowRoot||(e.onVnodeMounted=e.onVnodeUpdated=this._renderSlots.bind(this));const n=Dt(this._def,Ee(e,this._props));return this._instance||(n.ce=r=>{this._instance=r,r.ce=this,r.isCE=!0;const s=(i,o)=>{this.dispatchEvent(new CustomEvent(i,Hr(o[0])?Ee({detail:o},o[0]):{detail:o}))};r.emit=(i,...o)=>{s(i,o),st(i)!==i&&s(st(i),o)},this._setParent()}),n}_applyStyles(e,n,r){if(!e)return;if(n){if(n===this._def||this._styleChildren.has(n))return;this._styleChildren.add(n)}const s=this._nonce,i=this.shadowRoot,o=r?this._getStyleAnchor(r)||this._getStyleAnchor(this._def):this._getRootStyleInsertionAnchor(i);let a=null;for(let l=e.length-1;l>=0;l--){const f=document.createElement("style");s&&f.setAttribute("nonce",s),f.textContent=e[l],i.insertBefore(f,a||o),a=f,l===0&&(r||this._styleAnchors.set(this._def,f),n&&this._styleAnchors.set(n,f))}}_getStyleAnchor(e){if(!e)return null;const n=this._styleAnchors.get(e);return n&&n.parentNode===this.shadowRoot?n:(n&&this._styleAnchors.delete(e),null)}_getRootStyleInsertionAnchor(e){for(let n=0;n<e.childNodes.length;n++){const r=e.childNodes[n];if(!(r instanceof HTMLStyleElement))return r}return null}_parseSlots(){const e=this._slots={};let n;for(;n=this.firstChild;){const r=n.nodeType===1&&n.getAttribute("slot")||"default";(e[r]||(e[r]=[])).push(n),this.removeChild(n)}}_renderSlots(){const e=this._getSlots(),n=this._instance.type.__scopeId;for(let r=0;r<e.length;r++){const s=e[r],i=s.getAttribute("name")||"default",o=this._slots[i],a=s.parentNode;if(o)for(const l of o){if(n&&l.nodeType===1){const f=n+"-s",h=document.createTreeWalker(l,1);l.setAttribute(f,"");let d;for(;d=h.nextNode();)d.setAttribute(f,"")}a.insertBefore(l,s)}else for(;s.firstChild;)a.insertBefore(s.firstChild,s);a.removeChild(s)}}_getSlots(){const e=[this];this._teleportTargets&&e.push(...this._teleportTargets);const n=new Set;for(const r of e){const s=r.querySelectorAll("slot");for(let i=0;i<s.length;i++)n.add(s[i])}return Array.from(n)}_injectChildStyle(e,n){this._applyStyles(e.styles,e,n)}_beginPatch(){this._patching=!0,this._dirty=!1}_endPatch(){this._patching=!1,this._dirty&&this._instance&&this._update()}_hasShadowRoot(){return this._def.shadowRoot!==!1}_removeChildStyle(e){}}const sl=t=>{const e=t.props["onUpdate:modelValue"]||!1;return H(e)?n=>Vr(e,n):e};function Yf(t){t.target.composing=!0}function il(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const ms=Symbol("_assign"),bs=Symbol("_initialValue");function Oi(t,e,n){return e&&(t=t.trim()),n&&(t=Ws(t)),t}const ys={created(t,{modifiers:{lazy:e,trim:n,number:r}},s){t.parentNode&&(t.type==="text"?t[bs]=t.defaultValue.replace(/[\r\n]/g,""):t.type==="textarea"&&(t[bs]=t.defaultValue.replace(/\r\n?/g,`
`))),t[ms]=sl(s);const i=r||s.props&&s.props.type==="number";qn(t,e?"change":"input",o=>{o.target.composing||t[ms](Oi(t.value,n,i))}),(n||i)&&qn(t,"change",()=>{t.value=Oi(t.value,n,i)}),e||(qn(t,"compositionstart",Yf),qn(t,"compositionend",il),qn(t,"change",il))},mounted(t,{value:e,modifiers:{trim:n,number:r}}){const s=e??"",i=t[bs];delete t[bs],i!==void 0&&(t.type==="text"||t.type==="textarea")&&t.value!==i?t[ms](Oi(t.value,n,r)):t.value=s},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:r,trim:s,number:i}},o){if(t[ms]=sl(o),t.composing)return;const a=(i||t.type==="number")&&!/^0\d/.test(t.value)?Ws(t.value):t.value,l=e??"";if(a===l)return;const f=t.getRootNode();(f instanceof Document||f instanceof ShadowRoot)&&f.activeElement===t&&t.type!=="range"&&(r&&e===n||s&&t.value.trim()===l)||(t.value=l)}},Xf=["ctrl","shift","alt","meta"],Zf={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>Xf.some(n=>t[`${n}Key`]&&!e.includes(n))},Ii=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),r=e.join(".");return n[r]||(n[r]=((s,...i)=>{for(let o=0;o<e.length;o++){const a=Zf[e[o]];if(a&&a(s,e))return}return t(s,...i)}))},Jf={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},ol=(t,e)=>{const n=t._withKeys||(t._withKeys={}),r=e.join(".");return n[r]||(n[r]=(s=>{if(!("key"in s))return;const i=st(s.key);if(e.some(o=>o===i||Jf[o]===i))return t(s)}))},Qf=Ee({patchProp:Vf},Af);let al;function ll(){return al||(al=nf(Qf))}const eh=((...t)=>{ll().render(...t)}),cl=((...t)=>{const e=ll().createApp(...t),{mount:n}=e;return e.mount=r=>{const s=nh(r);if(!s)return;const i=e._component;!j(i)&&!i.render&&!i.template&&(i.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const o=n(s,!1,th(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e});function th(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function nh(t){return xe(t)?document.querySelector(t):t}const $t=Object.create(null);$t.open="0",$t.close="1",$t.ping="2",$t.pong="3",$t.message="4",$t.upgrade="5",$t.noop="6";const ws=Object.create(null);Object.keys($t).forEach(t=>{ws[$t[t]]=t});const Pi={type:"error",data:"parser error"},ul=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",fl=typeof ArrayBuffer=="function",hl=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,Ni=({type:t,data:e},n,r)=>ul&&e instanceof Blob?n?r(e):pl(e,r):fl&&(e instanceof ArrayBuffer||hl(e))?n?r(e):pl(new Blob([e]),r):r($t[t]+(e||"")),pl=(t,e)=>{const n=new FileReader;return n.onload=function(){const r=n.result.split(",")[1];e("b"+(r||""))},n.readAsDataURL(t)};function dl(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let Li;function rh(t,e){if(ul&&t.data instanceof Blob)return t.data.arrayBuffer().then(dl).then(e);if(fl&&(t.data instanceof ArrayBuffer||hl(t.data)))return e(dl(t.data));Ni(t,!1,n=>{Li||(Li=new TextEncoder),e(Li.encode(n))})}const gl="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Sr=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<gl.length;t++)Sr[gl.charCodeAt(t)]=t;const sh=t=>{let e=t.length*.75,n=t.length,r,s=0,i,o,a,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const f=new ArrayBuffer(e),h=new Uint8Array(f);for(r=0;r<n;r+=4)i=Sr[t.charCodeAt(r)],o=Sr[t.charCodeAt(r+1)],a=Sr[t.charCodeAt(r+2)],l=Sr[t.charCodeAt(r+3)],h[s++]=i<<2|o>>4,h[s++]=(o&15)<<4|a>>2,h[s++]=(a&3)<<6|l&63;return f},ih=typeof ArrayBuffer=="function",Mi=(t,e)=>{if(typeof t!="string")return{type:"message",data:ml(t,e)};const n=t.charAt(0);return n==="b"?{type:"message",data:oh(t.substring(1),e)}:ws[n]?t.length>1?{type:ws[n],data:t.substring(1)}:{type:ws[n]}:Pi},oh=(t,e)=>{if(ih){const n=sh(t);return ml(n,e)}else return{base64:!0,data:t}},ml=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},bl="",ah=(t,e)=>{const n=t.length,r=new Array(n);let s=0;t.forEach((i,o)=>{Ni(i,!1,a=>{r[o]=a,++s===n&&e(r.join(bl))})})},lh=(t,e)=>{const n=t.split(bl),r=[];for(let s=0;s<n.length;s++){const i=Mi(n[s],e);if(r.push(i),i.type==="error")break}return r};function ch(){return new TransformStream({transform(t,e){rh(t,n=>{const r=n.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const i=new DataView(s.buffer);i.setUint8(0,126),i.setUint16(1,r)}else{s=new Uint8Array(9);const i=new DataView(s.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(r))}t.data&&typeof t.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(n)})}})}let Di;function _s(t){return t.reduce((e,n)=>e+n.length,0)}function xs(t,e){if(t[0].length===e)return t.shift();const n=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)n[s]=t[0][r++],r===t[0].length&&(t.shift(),r=0);return t.length&&r<t[0].length&&(t[0]=t[0].slice(r)),n}function uh(t,e){Di||(Di=new TextDecoder);const n=[];let r=0,s=-1,i=!1;return new TransformStream({transform(o,a){for(n.push(o);;){if(r===0){if(_s(n)<1)break;const l=xs(n,1);i=(l[0]&128)===128,s=l[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(_s(n)<2)break;const l=xs(n,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if(_s(n)<8)break;const l=xs(n,8),f=new DataView(l.buffer,l.byteOffset,l.length),h=f.getUint32(0);if(h>Math.pow(2,21)-1){a.enqueue(Pi);break}s=h*Math.pow(2,32)+f.getUint32(4),r=3}else{if(_s(n)<s)break;const l=xs(n,s);a.enqueue(Mi(i?l:Di.decode(l),e)),r=0}if(s===0||s>t){a.enqueue(Pi);break}}}})}const yl=4;function Ae(t){if(t)return fh(t)}function fh(t){for(var e in Ae.prototype)t[e]=Ae.prototype[e];return t}Ae.prototype.on=Ae.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},Ae.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},Ae.prototype.off=Ae.prototype.removeListener=Ae.prototype.removeAllListeners=Ae.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var r,s=0;s<n.length;s++)if(r=n[s],r===e||r.fn===e){n.splice(s,1);break}return n.length===0&&delete this._callbacks["$"+t],this},Ae.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(n){n=n.slice(0);for(var r=0,s=n.length;r<s;++r)n[r].apply(this,e)}return this},Ae.prototype.emitReserved=Ae.prototype.emit,Ae.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},Ae.prototype.hasListeners=function(t){return!!this.listeners(t).length};const vs=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,n)=>n(e,0),ft=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),hh="arraybuffer";function jg(){}function wl(t,...e){return e.reduce((n,r)=>(t.hasOwnProperty(r)&&(n[r]=t[r]),n),{})}const ph=ft.setTimeout,dh=ft.clearTimeout;function ks(t,e){e.useNativeTimers?(t.setTimeoutFn=ph.bind(ft),t.clearTimeoutFn=dh.bind(ft)):(t.setTimeoutFn=ft.setTimeout.bind(ft),t.clearTimeoutFn=ft.clearTimeout.bind(ft))}const gh=1.33;function mh(t){return typeof t=="string"?bh(t):Math.ceil((t.byteLength||t.size)*gh)}function bh(t){let e=0,n=0;for(let r=0,s=t.length;r<s;r++)e=t.charCodeAt(r),e<128?n+=1:e<2048?n+=2:e<55296||e>=57344?n+=3:(r++,n+=4);return n}function _l(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function yh(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e}function wh(t){let e={},n=t.split("&");for(let r=0,s=n.length;r<s;r++){let i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class _h extends Error{constructor(e,n,r){super(e),this.description=n,this.context=r,this.type="TransportError"}}class zi extends Ae{constructor(e){super(),this.writable=!1,ks(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,n,r){return super.emitReserved("error",new _h(e,n,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const n=Mi(e,this.socket.binaryType);this.onPacket(n)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,n={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(n)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const n=yh(e);return n.length?"?"+n:""}}class xh extends zi{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const n=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||n()})),this.writable||(r++,this.once("drain",function(){--r||n()}))}else n()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const n=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};lh(e,this.socket.binaryType).forEach(n),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,ah(e,n=>{this.doWrite(n,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",n=this.query||{};return this.opts.timestampRequests!==!1&&(n[this.opts.timestampParam]=_l()),!this.supportsBinary&&!n.sid&&(n.b64=1),this.createUri(e,n)}}let xl=!1;try{xl=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const vh=xl;function kh(){}class Th extends xh{constructor(e){if(super(e),typeof location<"u"){const n=location.protocol==="https:";let r=location.port;r||(r=n?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,n){const r=this.request({method:"POST",data:e});r.on("success",n),r.on("error",(s,i)=>{this.onError("xhr post error",s,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(n,r)=>{this.onError("xhr poll error",n,r)}),this.pollXhr=e}}class Ft extends Ae{constructor(e,n,r){super(),this.createRequest=e,ks(this,r),this._opts=r,this._method=r.method||"GET",this._uri=n,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const n=wl(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");n.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(n);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ft.requestsCount++,Ft.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=kh,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ft.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}if(Ft.requestsCount=0,Ft.requests={},typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",vl);else if(typeof addEventListener=="function"){const t="onpagehide"in ft?"pagehide":"unload";addEventListener(t,vl,!1)}}function vl(){for(let t in Ft.requests)Ft.requests.hasOwnProperty(t)&&Ft.requests[t].abort()}const Sh=(function(){const t=kl({xdomain:!1});return t&&t.responseType!==null})();class Eh extends Th{constructor(e){super(e);const n=e&&e.forceBase64;this.supportsBinary=Sh&&!n}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ft(kl,this.uri(),e)}}function kl(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||vh))return new XMLHttpRequest}catch{}if(!e)try{return new ft[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Tl=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Ah extends zi{get name(){return"websocket"}doOpen(){const e=this.uri(),n=this.opts.protocols,r=Tl?{}:wl(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,n,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;Ni(r,this.supportsBinary,i=>{try{this.doWrite(r,i)}catch{}s&&vs(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",n=this.query||{};return this.opts.timestampRequests&&(n[this.opts.timestampParam]=_l()),this.supportsBinary||(n.b64=1),this.createUri(e,n)}}const Bi=ft.WebSocket||ft.MozWebSocket;class Rh extends Ah{createSocket(e,n,r){return Tl?new Bi(e,n,r):n?new Bi(e,n):new Bi(e)}doWrite(e,n){this.ws.send(n)}}class Ch extends zi{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const n=uh(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(n).getReader(),s=ch();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const i=()=>{r.read().then(({done:a,value:l})=>{a||(this.onPacket(l),i())}).catch(a=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;this._writer.write(r).then(()=>{s&&vs(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Oh={websocket:Rh,webtransport:Ch,polling:Eh},Ih=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Ph=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function $i(t){if(t.length>8e3)throw"URI too long";const e=t,n=t.indexOf("["),r=t.indexOf("]");n!=-1&&r!=-1&&(t=t.substring(0,n)+t.substring(n,r).replace(/:/g,";")+t.substring(r,t.length));let s=Ih.exec(t||""),i={},o=14;for(;o--;)i[Ph[o]]=s[o]||"";return n!=-1&&r!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=Nh(i,i.path),i.queryKey=Lh(i,i.query),i}function Nh(t,e){const n=/\/{2,9}/g,r=e.replace(n,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function Lh(t,e){const n={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,i){s&&(n[s]=i)}),n}const Fi=typeof addEventListener=="function"&&typeof removeEventListener=="function",Ts=[];Fi&&addEventListener("offline",()=>{Ts.forEach(t=>t())},!1);class un extends Ae{constructor(e,n){if(super(),this.binaryType=hh,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(n=e,e=null),e){const r=$i(e);n.hostname=r.host,n.secure=r.protocol==="https"||r.protocol==="wss",n.port=r.port,r.query&&(n.query=r.query)}else n.host&&(n.hostname=$i(n.host).host);ks(this,n),this.secure=n.secure!=null?n.secure:typeof location<"u"&&location.protocol==="https:",n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.hostname=n.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=n.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},n.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},n),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=wh(this.opts.query)),Fi&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Ts.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const n=Object.assign({},this.opts.query);n.EIO=yl,n.transport=e,this.id&&(n.sid=this.id);const r=Object.assign({},this.opts,{query:n,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&un.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const n=this.createTransport(e);n.open(),this.setTransport(n)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",n=>this._onClose("transport close",n))}onOpen(){this.readyState="open",un.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const n=new Error("server error");n.code=e.data,this._onError(n);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let n=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(n+=mh(s)),r>0&&n>this._maxPayload)return this.writeBuffer.slice(0,r);n+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,vs(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,n,r){return this._sendPacket("message",e,n,r),this}send(e,n,r){return this._sendPacket("message",e,n,r),this}_sendPacket(e,n,r,s){if(typeof n=="function"&&(s=n,n=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const i={type:e,data:n,options:r};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},n=()=>{this.off("upgrade",n),this.off("upgradeError",n),e()},r=()=>{this.once("upgrade",n),this.once("upgradeError",n)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(un.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,n){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Fi&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Ts.indexOf(this._offlineEventListener);r!==-1&&Ts.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,n),this.writeBuffer=[],this._prevBufferLen=0}}}un.protocol=yl;class Mh extends un{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let n=this.createTransport(e),r=!1;un.priorWebsocketSuccess=!1;const s=()=>{r||(n.send([{type:"ping",data:"probe"}]),n.once("packet",d=>{if(!r)if(d.type==="pong"&&d.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",n),!n)return;un.priorWebsocketSuccess=n.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(h(),this.setTransport(n),n.send([{type:"upgrade"}]),this.emitReserved("upgrade",n),n=null,this.upgrading=!1,this.flush())})}else{const x=new Error("probe error");x.transport=n.name,this.emitReserved("upgradeError",x)}}))};function i(){r||(r=!0,h(),n.close(),n=null)}const o=d=>{const x=new Error("probe error: "+d);x.transport=n.name,i(),this.emitReserved("upgradeError",x)};function a(){o("transport closed")}function l(){o("socket closed")}function f(d){n&&d.name!==n.name&&i()}const h=()=>{n.removeListener("open",s),n.removeListener("error",o),n.removeListener("close",a),this.off("close",l),this.off("upgrading",f)};n.once("open",s),n.once("error",o),n.once("close",a),this.once("close",l),this.once("upgrading",f),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||n.open()},200):n.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const n=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&n.push(e[r]);return n}}let Dh=class extends Mh{constructor(e,n={}){const r=typeof e=="object",s=r?{...e}:{...n};(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(i=>Oh[i]).filter(i=>!!i)),super(r?s:e,s)}};function zh(t,e="",n){let r=t;n=n||typeof location<"u"&&location,t==null&&(t=n.protocol+"//"+n.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=n.protocol+t:t=n.host+t),/^(https?|wss?):\/\//.test(t)||(typeof n<"u"?t=n.protocol+"//"+t:t="https://"+t),r=$i(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const i=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port+e,r.href=r.protocol+"://"+i+(n&&n.port===r.port?"":":"+r.port),r}const Bh=typeof ArrayBuffer=="function",$h=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Sl=Object.prototype.toString,Fh=typeof Blob=="function"||typeof Blob<"u"&&Sl.call(Blob)==="[object BlobConstructor]",Uh=typeof File=="function"||typeof File<"u"&&Sl.call(File)==="[object FileConstructor]";function Ui(t){return Bh&&(t instanceof ArrayBuffer||$h(t))||Fh&&t instanceof Blob||Uh&&t instanceof File}function Ss(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let n=0,r=t.length;n<r;n++)if(Ss(t[n]))return!0;return!1}if(Ui(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return Ss(t.toJSON(),!0);for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&Ss(t[n]))return!0;return!1}function Hh(t){const e=[],n=t.data,r=t;return r.data=Es(n,e),r.attachments=e.length,{packet:r,buffers:e}}function Es(t,e,n){if(!t)return t;if(Ui(t)){const r={_placeholder:!0,num:e.length};return e.push(t),r}else if(Array.isArray(t)){const r=new Array(t.length);for(let s=0;s<t.length;s++)r[s]=Es(t[s],e);return r}else if(typeof t=="object"&&!(t instanceof Date)){if(t.toJSON&&typeof t.toJSON=="function"&&!n)return Es(t.toJSON(),e,!0);const r={};for(const s in t)Object.prototype.hasOwnProperty.call(t,s)&&(r[s]=Es(t[s],e));return r}return t}function jh(t,e){return t.data=Hi(t.data,e),delete t.attachments,t}function Hi(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let n=0;n<t.length;n++)t[n]=Hi(t[n],e);else if(typeof t=="object")for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(t[n]=Hi(t[n],e));return t}const Vh=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var ne;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(ne||(ne={}));class qh{constructor(e){this.replacer=e}encode(e){return(e.type===ne.EVENT||e.type===ne.ACK)&&Ss(e)?this.encodeAsBinary({type:e.type===ne.EVENT?ne.BINARY_EVENT:ne.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let n=""+e.type;return(e.type===ne.BINARY_EVENT||e.type===ne.BINARY_ACK)&&(n+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(n+=e.nsp+","),e.id!=null&&(n+=e.id),e.data!=null&&(n+=JSON.stringify(e.data,this.replacer)),n}encodeAsBinary(e){const n=Hh(e),r=this.encodeAsString(n.packet),s=n.buffers;return s.unshift(r),s}}class ji extends Ae{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let n;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");n=this.decodeString(e);const r=n.type===ne.BINARY_EVENT;r||n.type===ne.BINARY_ACK?(n.type=r?ne.EVENT:ne.ACK,this.reconstructor=new Wh(n)):super.emitReserved("decoded",n)}else if(Ui(e)||e.base64)if(this.reconstructor)n=this.reconstructor.takeBinaryData(e),n&&(this.reconstructor=null,super.emitReserved("decoded",n));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let n=0;const r={type:Number(e.charAt(0))};if(ne[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===ne.BINARY_EVENT||r.type===ne.BINARY_ACK){const i=n+1;for(;e.charAt(++n)!=="-"&&n!=e.length;);const o=e.substring(i,n);if(o!=Number(o)||e.charAt(n)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!Kh(a)||a<1)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");r.attachments=a}if(e.charAt(n+1)==="/"){const i=n+1;for(;++n&&!(e.charAt(n)===","||n===e.length););r.nsp=e.substring(i,n)}else r.nsp="/";const s=e.charAt(n+1);if(s!==""&&Number(s)==s){const i=n+1;for(;++n;){const o=e.charAt(n);if(o==null||Number(o)!=o){--n;break}if(n===e.length)break}r.id=Number(e.substring(i,n+1))}if(e.charAt(++n)){const i=this.tryParse(e.substr(n));if(ji.isPayloadValid(r.type,i))r.data=i;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,n){switch(e){case ne.CONNECT:return El(n);case ne.DISCONNECT:return n===void 0;case ne.CONNECT_ERROR:return typeof n=="string"||El(n);case ne.EVENT:case ne.BINARY_EVENT:return Array.isArray(n)&&(typeof n[0]=="number"||typeof n[0]=="string"&&Vh.indexOf(n[0])===-1);case ne.ACK:case ne.BINARY_ACK:return Array.isArray(n)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Wh{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const n=jh(this.reconPack,this.buffers);return this.finishedReconstruction(),n}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const Kh=Number.isInteger||function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t};function El(t){return Object.prototype.toString.call(t)==="[object Object]"}const Gh=Object.freeze(Object.defineProperty({__proto__:null,Decoder:ji,Encoder:qh,get PacketType(){return ne}},Symbol.toStringTag,{value:"Module"}));function vt(t,e,n){return t.on(e,n),function(){t.off(e,n)}}const Yh=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Al extends Ae{constructor(e,n,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=n,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[vt(e,"open",this.onopen.bind(this)),vt(e,"packet",this.onpacket.bind(this)),vt(e,"error",this.onerror.bind(this)),vt(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...n){var r,s,i;if(Yh.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(n.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(n),this;const o={type:ne.EVENT,data:n};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof n[n.length-1]=="function"){const h=this.ids++,d=n.pop();this._registerAckCallback(h,d),o.id=h}const a=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!a||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,n){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=n;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);n.call(this,new Error("operation has timed out"))},s),o=(...a)=>{this.io.clearTimeoutFn(i),n.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...n){return new Promise((r,s)=>{const i=(o,a)=>o?s(o):r(a);i.withError=!0,n.push(i),this.emit(e,...n)})}_addToQueue(e){let n;typeof e[e.length-1]=="function"&&(n=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...i)=>(this._queue[0],s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),n&&n(s)):(this._queue.shift(),n&&n(null,...i)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const n=this._queue[0];n.pending&&!e||(n.pending=!0,n.tryCount++,this.flags=n.flags,this.emit.apply(this,n.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:ne.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,n){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,n),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case ne.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case ne.EVENT:case ne.BINARY_EVENT:this.onevent(e);break;case ne.ACK:case ne.BINARY_ACK:this.onack(e);break;case ne.DISCONNECT:this.ondisconnect();break;case ne.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const n=e.data||[];e.id!=null&&n.push(this.ack(e.id)),this.connected?this.emitEvent(n):this.receiveBuffer.push(Object.freeze(n))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const n=this._anyListeners.slice();for(const r of n)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const n=this;let r=!1;return function(...s){r||(r=!0,n.packet({type:ne.ACK,id:e,data:s}))}}onack(e){const n=this.acks[e.id];typeof n=="function"&&(delete this.acks[e.id],n.withError&&e.data.unshift(null),n.apply(this,e.data))}onconnect(e,n){this.id=e,this.recovered=n&&this._pid===n,this._pid=n,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:ne.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const n=this._anyListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const n=this._anyOutgoingListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const n=this._anyOutgoingListeners.slice();for(const r of n)r.apply(this,e.data)}}}function Wn(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}Wn.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=(Math.floor(e*10)&1)==0?t-n:t+n}return Math.min(t,this.max)|0},Wn.prototype.reset=function(){this.attempts=0},Wn.prototype.setMin=function(t){this.ms=t},Wn.prototype.setMax=function(t){this.max=t},Wn.prototype.setJitter=function(t){this.jitter=t};class Vi extends Ae{constructor(e,n){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(n=e,e=void 0),n=n||{},n.path=n.path||"/socket.io",this.opts=n,ks(this,n),this.reconnection(n.reconnection!==!1),this.reconnectionAttempts(n.reconnectionAttempts||1/0),this.reconnectionDelay(n.reconnectionDelay||1e3),this.reconnectionDelayMax(n.reconnectionDelayMax||5e3),this.randomizationFactor((r=n.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new Wn({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(n.timeout==null?2e4:n.timeout),this._readyState="closed",this.uri=e;const s=n.parser||Gh;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=n.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var n;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(n=this.backoff)===null||n===void 0||n.setMin(e),this)}randomizationFactor(e){var n;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(n=this.backoff)===null||n===void 0||n.setJitter(e),this)}reconnectionDelayMax(e){var n;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(n=this.backoff)===null||n===void 0||n.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Dh(this.uri,this.opts);const n=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=vt(n,"open",function(){r.onopen(),e&&e()}),i=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=vt(n,"error",i);if(this._timeout!==!1){const a=this._timeout,l=this.setTimeoutFn(()=>{s(),i(new Error("timeout")),n.close()},a);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(vt(e,"ping",this.onping.bind(this)),vt(e,"data",this.ondata.bind(this)),vt(e,"error",this.onerror.bind(this)),vt(e,"close",this.onclose.bind(this)),vt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(n){this.onclose("parse error",n)}}ondecoded(e){vs(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,n){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new Al(this,e,n),this.nsps[e]=r),r}_destroy(e){const n=Object.keys(this.nsps);for(const r of n)if(this.nsps[r].active)return;this._close()}_packet(e){const n=this.encoder.encode(e);for(let r=0;r<n.length;r++)this.engine.write(n[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,n){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,n),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const n=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},n);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Er={};function As(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const n=zh(t,e.path||"/socket.io"),r=n.source,s=n.id,i=n.path,o=Er[s]&&i in Er[s].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return a?l=new Vi(r,e):(Er[s]||(Er[s]=new Vi(r,e)),l=Er[s]),n.query&&!e.query&&(e.query=n.queryKey),l.socket(n.path,e)}Object.assign(As,{Manager:Vi,Socket:Al,io:As,connect:As});function qi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var An=qi();function Rl(t){An=t}var Rn={exec:()=>null};function Kn(t){let e=[];return n=>{let r=Math.max(0,Math.min(3,n-1)),s=e[r];return s||(s=t(r),e[r]=s),s}}function Q(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(s,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(We.caret,"$1"),n=n.replace(s,o),r},getRegex:()=>new RegExp(n,e)};return r}var Xh=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),We={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:Kn(t=>new RegExp(`^ {0,${t}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:Kn(t=>new RegExp(`^ {0,${t}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:Kn(t=>new RegExp(`^ {0,${t}}(?:\`\`\`|~~~)`)),headingBeginRegex:Kn(t=>new RegExp(`^ {0,${t}}#`)),htmlBeginRegex:Kn(t=>new RegExp(`^ {0,${t}}<(?:[a-z].*>|!--)`,"i")),blockquoteBeginRegex:Kn(t=>new RegExp(`^ {0,${t}}>`))},Zh=/^(?:[ \t]*(?:\n|$))+/,Jh=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Qh=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ar=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ep=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Wi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Cl=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Ol=Q(Cl).replace(/bull/g,Wi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),tp=Q(Cl).replace(/bull/g,Wi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Ki=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,np=/^[^\n]+/,Gi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,rp=Q(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Gi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),sp=Q(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Wi).getRegex(),Rs="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Yi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ip=Q("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Yi).replace("tag",Rs).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Il=t=>Q(Ki).replace("hr",Ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list",t).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Rs).getRegex(),op=Il(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),ap=Il(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),lp=Q(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ap).getRegex(),Xi={blockquote:lp,code:Jh,def:rp,fences:Qh,heading:ep,hr:Ar,html:ip,lheading:Ol,list:sp,newline:Zh,paragraph:op,table:Rn,text:np},Pl=Q("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Rs).getRegex(),cp={...Xi,lheading:tp,table:Pl,paragraph:Q(Ki).replace("hr",Ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Pl).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Rs).getRegex()},up={...Xi,html:Q(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Yi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Rn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Q(Ki).replace("hr",Ar).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Ol).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},fp=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,hp=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Nl=/^( {2,}|\\)\n(?!\s*$)/,pp=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,nn=/[\p{P}\p{S}]/u,Gn=/[\s\p{P}\p{S}]/u,Rr=/[^\s\p{P}\p{S}]/u,dp=Q(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Gn).getRegex(),gp=/[\p{Pi}\p{Ps}"']/u,Ll=/(?!~)[\p{P}\p{S}]/u,mp=/(?!~)[\s\p{P}\p{S}]/u,bp=/(?:[^\s\p{P}\p{S}]|~)/u,yp=Q(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Xh?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Ml=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,wp=Q(Ml,"u").replace(/punct/g,nn).getRegex(),_p=Q(Ml,"u").replace(/punct/g,Ll).getRegex(),xp=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,vp=Q(xp,"u").replace(/openQuote/g,gp).replace(/punct/g,nn).getRegex(),Dl="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",kp=Q(Dl,"gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Gn).replace(/punct/g,nn).getRegex(),Tp=Q(Dl,"gu").replace(/notPunctSpace/g,bp).replace(/punctSpace/g,mp).replace(/punct/g,Ll).getRegex(),Sp="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Ep=Q(Sp,"gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Gn).replace(/punct/g,nn).getRegex(),Ap=Q("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Gn).replace(/punct/g,nn).getRegex(),Rp="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",Cp=Q(Rp,"gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Gn).replace(/punct/g,nn).getRegex(),Op=Q(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,nn).getRegex(),Ip="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Pp=Q(Ip,"gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Gn).replace(/punct/g,nn).getRegex(),Np=Q(/\\(punct)/,"gu").replace(/punct/g,nn).getRegex(),Lp=Q(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Mp=Q(Yi).replace("(?:-->|$)","-->").getRegex(),Dp=Q("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Mp).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Cs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,zp=Q(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Cs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),zl=Q(/^!?\[(label)\]\[(ref)\]/).replace("label",Cs).replace("ref",Gi).getRegex(),Bl=Q(/^!?\[(ref)\](?:\[\])?/).replace("ref",Gi).getRegex(),Bp=Q("reflink|nolink(?!\\()","g").replace("reflink",zl).replace("nolink",Bl).getRegex(),$l=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Zi={_backpedal:Rn,anyPunctuation:Np,autolink:Lp,blockSkip:yp,br:Nl,code:hp,del:Rn,delLDelim:Rn,delRDelim:Rn,emStrongLDelim:wp,emStrongRDelimAst:kp,emStrongRDelimUnd:Ap,escape:fp,link:zp,nolink:Bl,punctuation:dp,reflink:zl,reflinkSearch:Bp,tag:Dp,text:pp,url:Rn},$p={...Zi,emStrongLDelim:vp,emStrongRDelimAst:Ep,emStrongRDelimUnd:Cp,link:Q(/^!?\[(label)\]\((.*?)\)/).replace("label",Cs).getRegex(),reflink:Q(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Cs).getRegex()},Ji={...Zi,emStrongRDelimAst:Tp,emStrongLDelim:_p,delLDelim:Op,delRDelim:Pp,url:Q(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",$l).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Q(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",$l).getRegex()},Fp={...Ji,br:Q(Nl).replace("{2,}","*").getRegex(),text:Q(Ji.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Os={normal:Xi,gfm:cp,pedantic:up},Cr={normal:Zi,gfm:Ji,breaks:Fp,pedantic:$p},Up={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Fl=t=>Up[t];function Ut(t,e){if(e){if(We.escapeTest.test(t))return t.replace(We.escapeReplace,Fl)}else if(We.escapeTestNoEncode.test(t))return t.replace(We.escapeReplaceNoEncode,Fl);return t}function Ul(t){try{t=encodeURI(t).replace(We.percentDecode,"%")}catch{return null}return t}function Hl(t,e){let n=t.replace(We.findPipe,(i,o,a)=>{let l=!1,f=o;for(;--f>=0&&a[f]==="\\";)l=!l;return l?"|":" |"}),r=n.split(We.splitPipe),s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(We.slashPipe,"|");return r}function fn(t,e,n){let r=t.length;if(r===0)return"";let s=0;for(;s<r&&t.charAt(r-s-1)===e;)s++;return t.slice(0,r-s)}function jl(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&We.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function Hp(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function jp(t,e=0){let n=e,r="";for(let s of t)if(s==="	"){let i=4-n%4;r+=" ".repeat(i),n+=i}else r+=s,n++;return r}function Vl(t,e,n,r,s){let i=e.href,o=e.title||null,a=t[1].replace(s.other.outputLinkReplace,"$1");r.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,l}function Vp(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let s=r[1];return e.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[a]=o;return a.length>=s.length?i.slice(s.length):i}).join(`
`)}var Is=class{constructor(t){me(this,"options");me(this,"rules");me(this,"lexer");this.options=t||An}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:jl(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=Vp(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=fn(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:fn(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:fn(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=fn(e[0],`
`).split(`
`),r="",s="",i=[];for(;n.length>0;){let o=!1,a=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))a.push(n[l]),o=!0;else if(!o)a.push(n[l]);else break;n=n.slice(l);let f=a.join(`
`),h=f.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${f}`:f,s=s?`${s}
${h}`:h;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,i,!0),this.lexer.state.top=d,n.length===0)break;let x=i.at(-1);if(x?.type==="code")break;if(x?.type==="blockquote"){let O=x,P=n.join(`
`),z=O.raw+`
`+P.replace(this.rules.other.blockquoteSetextReplace2,""),ee=this.blockquote(z);i[i.length-1]=ee,r=`${r}
${P}`,s=s.substring(0,s.length-O.text.length)+ee.text;break}else if(x?.type==="list"){let O=x,P=O.raw+`
`+n.join(`
`),z=this.list(P);i[i.length-1]=z,r=r.substring(0,r.length-x.raw.length)+z.raw,s=s.substring(0,s.length-O.raw.length)+z.raw,n=P.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;t;){let l=!1,f="",h="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;f=e[0],t=t.substring(f.length);let d=jp(e[2].split(`
`,1)[0],e[1].length),x=t.split(`
`,1)[0],O=!d.trim(),P=0;if(this.options.pedantic?(P=2,h=d.trimStart()):O?P=e[1].length+1:(P=d.search(this.rules.other.nonSpaceChar),P=P>4?1:P,h=d.slice(P),P+=e[1].length),O&&this.rules.other.blankLine.test(x)&&(f+=x+`
`,t=t.substring(x.length+1),l=!0),!l){let z=this.rules.other.nextBulletRegex(P),ee=this.rules.other.hrRegex(P),Y=this.rules.other.fencesBeginRegex(P),W=this.rules.other.headingBeginRegex(P),X=this.rules.other.htmlBeginRegex(P),N=this.rules.other.blockquoteBeginRegex(P);for(;t;){let te=t.split(`
`,1)[0],ve;if(x=te,this.options.pedantic?(x=x.replace(this.rules.other.listReplaceNesting,"  "),ve=x):ve=x.replace(this.rules.other.tabCharGlobal,"    "),Y.test(x)||W.test(x)||X.test(x)||N.test(x)||z.test(x)||ee.test(x))break;if(ve.search(this.rules.other.nonSpaceChar)>=P||!x.trim())h+=`
`+ve.slice(P);else{if(O||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Y.test(d)||W.test(d)||ee.test(d))break;h+=`
`+x}O=!x.trim(),f+=te+`
`,t=t.substring(te.length+1),d=ve.slice(P)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(f)&&(o=!0)),s.items.push({type:"list_item",raw:f,task:!!this.options.gfm&&this.rules.other.listIsTask.test(h),loose:!1,text:h,tokens:[]}),s.raw+=f}let a=s.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let l of s.items){this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]);let f=l.tokens[0];if(l.task&&(f?.type==="text"||f?.type==="paragraph")){l.text=l.text.replace(this.rules.other.listReplaceTask,""),f.raw=f.raw.replace(this.rules.other.listReplaceTask,""),f.text=f.text.replace(this.rules.other.listReplaceTask,"");for(let d=this.lexer.inlineQueue.length-1;d>=0;d--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)){this.lexer.inlineQueue[d].src=this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask,"");break}let h=this.rules.other.listTaskCheckbox.exec(l.raw);if(h){let d={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};l.checked=d.checked,s.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=d.raw+l.tokens[0].raw,l.tokens[0].text=d.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(d)):l.tokens.unshift({type:"paragraph",raw:d.raw,text:d.raw,tokens:[d]}):l.tokens.unshift(d)}}else l.task&&(l.task=!1);if(!s.loose){let h=l.tokens.filter(x=>x.type==="space"),d=h.length>0&&h.some(x=>this.rules.other.anyLine.test(x.raw));s.loose=d}}if(s.loose)for(let l of s.items){l.loose=!0;for(let f of l.tokens)f.type==="text"&&(f.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){let n=jl(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:fn(e[0],`
`),href:r,title:s}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Hl(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:fn(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of s)i.rows.push(Hl(o,i.header.length).map((a,l)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:fn(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=fn(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Hp(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],s="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],s=i[3])}else s=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),Vl(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[r.toLowerCase()];if(!s){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Vl(n,s,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=0,f=r[0][0],h=n===f,d=f==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,e=e.slice(-1*t.length+s);(r=d.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(o=[...i].length,r[3]||r[4]){a+=o;continue}else if(r[5]||r[6]){if(s%3&&!((s+o)%3)){l+=o;continue}if(h)break}if(a-=o,a>0)continue;o=Math.min(o,o+a+l);let x=[...r[0]][0].length,O=t.slice(0,s+r.index+x+o);if(Math.min(s,o)%2){let z=O.slice(1,-1);return{type:"em",raw:O,text:z,tokens:this.lexer.inlineTokens(z)}}let P=O.slice(2,-2);return{type:"strong",raw:O,text:P,tokens:this.lexer.inlineTokens(P)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+s);(r=l.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(o=[...i].length,o!==s))continue;if(r[3]||r[4]){a+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a);let f=[...r[0]][0].length,h=t.slice(0,s+r.index+f+o),d=h.slice(s,-s);return{type:"del",raw:h,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},kt=class mo{constructor(e){me(this,"tokens");me(this,"options");me(this,"state");me(this,"inlineQueue");me(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||An,this.options.tokenizer=this.options.tokenizer||new Is,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:We,block:Os.normal,inline:Cr.normal};this.options.pedantic?(n.block=Os.pedantic,n.inline=Cr.pedantic):this.options.gfm&&(n.block=Os.gfm,this.options.breaks?n.inline=Cr.breaks:n.inline=Cr.gfm),this.tokenizer.rules=n}static get rules(){return{block:Os,inline:Cr}}static lex(e,n){return new mo(n).lex(e)}static lexInline(e,n){return new mo(n).inlineTokens(e)}lex(e){e=e.replace(We.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(We.tabCharGlobal,"    ").replace(We.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},e,n))?(e=e.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let a=n.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),n.push(i);continue}let o=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),f;this.options.extensions.startBlock.forEach(h=>{f=h.call({lexer:this},l),typeof f=="number"&&f>=0&&(a=Math.min(a,f))}),a<1/0&&a>=0&&(o=e.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(o))){let a=n.at(-1);r&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i),r=o.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=e;if(this.tokens.links){let a=Object.keys(this.tokens.links);a.length>0&&(r=r.replace(this.tokenizer.rules.inline.reflinkSearch,l=>a.includes(l.slice(l.lastIndexOf("[")+1,-1))?"["+"a".repeat(l.length-2)+"]":l))}r=r.replace(this.tokenizer.rules.inline.anyPunctuation,"++"),r=r.replace(this.tokenizer.rules.inline.blockSkip,(a,l,f)=>{let h=f?f.length:0;return a.slice(0,h)+"["+"a".repeat(a.length-h-2)+"]"}),r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let s=!1,i="",o=1/0;for(;e;){if(e.length<o)o=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}s||(i=""),s=!1;let a;if(this.options.extensions?.inline?.some(f=>(a=f.call({lexer:this},e,n))?(e=e.substring(a.raw.length),n.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let f=n.at(-1);a.type==="text"&&f?.type==="text"?(f.raw+=a.raw,f.text+=a.text):n.push(a);continue}if(a=this.tokenizer.emStrong(e,r,i)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.del(e,r,i)){e=e.substring(a.raw.length),n.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),n.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),n.push(a);continue}let l=e;if(this.options.extensions?.startInline){let f=1/0,h=e.slice(1),d;this.options.extensions.startInline.forEach(x=>{d=x.call({lexer:this},h),typeof d=="number"&&d>=0&&(f=Math.min(f,d))}),f<1/0&&f>=0&&(l=e.substring(0,f+1))}if(a=this.tokenizer.inlineText(l)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(i=a.raw.slice(-1)),s=!0;let f=n.at(-1);f?.type==="text"?(f.raw+=a.raw,f.text+=a.text):n.push(a);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},Ps=class{constructor(t){me(this,"options");me(this,"parser");this.options=t||An}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(We.notSpaceStart)?.[0],s=t.replace(We.endingNewline,"")+`
`;return r?'<pre><code class="language-'+Ut(r)+'">'+(n?s:Ut(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:Ut(s,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,r="";for(let o=0;o<t.items.length;o++){let a=t.items[o];r+=this.listitem(a)}let s=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+s+i+`>
`+r+"</"+s+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",n="";for(let s=0;s<t.header.length;s++)n+=this.tablecell(t.header[s]);e+=this.tablerow({text:n});let r="";for(let s=0;s<t.rows.length;s++){let i=t.rows[s];n="";for(let o=0;o<i.length;o++)n+=this.tablecell(i[o]);r+=this.tablerow({text:n})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),n=t.header?"th":"td";return(t.align?`<${n} align="${t.align}">`:`<${n}>`)+e+`</${n}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Ut(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let r=this.parser.parseInline(n),s=Ul(t);if(s===null)return r;t=s;let i='<a href="'+t+'"';return e&&(i+=' title="'+Ut(e)+'"'),i+=">"+r+"</a>",i}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let s=Ul(t);if(s===null)return Ut(n);t=s;let i=`<img src="${t}" alt="${Ut(n)}"`;return e&&(i+=` title="${Ut(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Ut(t.text)}},Qi=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Tt=class bo{constructor(e){me(this,"options");me(this,"renderer");me(this,"textRenderer");this.options=e||An,this.options.renderer=this.options.renderer||new Ps,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Qi}static parse(e,n){return new bo(n).parse(e)}static parseInline(e,n){return new bo(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let s=e[r];if(this.options.extensions?.renderers?.[s.type]){let o=s,a=this.options.extensions.renderers[o.type].call({parser:this},o);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(o.type)){n+=a||"";continue}}let i=s;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let s=0;s<e.length;s++){let i=e[s];if(this.options.extensions?.renderers?.[i.type]){let a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(i.type)){r+=a||"";continue}}let o=i;switch(o.type){case"escape":{r+=n.text(o);break}case"html":{r+=n.html(o);break}case"link":{r+=n.link(o);break}case"image":{r+=n.image(o);break}case"checkbox":{r+=n.checkbox(o);break}case"strong":{r+=n.strong(o);break}case"em":{r+=n.em(o);break}case"codespan":{r+=n.codespan(o);break}case"br":{r+=n.br(o);break}case"del":{r+=n.del(o);break}case"text":{r+=n.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},Or=(Ms=class{constructor(t){me(this,"options");me(this,"block");this.options=t||An}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?kt.lex:kt.lexInline}provideParser(t=this.block){return t?Tt.parse:Tt.parseInline}},me(Ms,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),me(Ms,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),Ms),qp=class{constructor(...t){me(this,"defaults",qi());me(this,"options",this.setOptions);me(this,"parse",this.parseMarkdown(!0));me(this,"parseInline",this.parseMarkdown(!1));me(this,"Parser",Tt);me(this,"Renderer",Ps);me(this,"TextRenderer",Qi);me(this,"Lexer",kt);me(this,"Tokenizer",Is);me(this,"Hooks",Or);this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{let s=r;for(let i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of s.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{let s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{let s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{let o=s[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let i=e.renderers[s.name];i?e.renderers[s.name]=function(...o){let a=s.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){let s=this.defaults.renderer||new Ps(this.defaults);for(let i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,a=n.renderer[o],l=s[o];s[o]=(...f)=>{let h=a.apply(s,f);return h===!1&&(h=l.apply(s,f)),h||""}}r.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new Is(this.defaults);for(let i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,a=n.tokenizer[o],l=s[o];s[o]=(...f)=>{let h=a.apply(s,f);return h===!1&&(h=l.apply(s,f)),h}}r.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new Or;for(let i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,a=n.hooks[o],l=s[o];Or.passThroughHooks.has(i)?s[o]=f=>{if(this.defaults.async&&Or.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await a.call(s,f);return l.call(s,d)})();let h=a.call(s,f);return l.call(s,h)}:s[o]=(...f)=>{if(this.defaults.async)return(async()=>{let d=await a.apply(s,f);return d===!1&&(d=await l.apply(s,f)),d})();let h=a.apply(s,f);return h===!1&&(h=l.apply(s,f)),h}}r.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),s&&(a=a.concat(s.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return kt.lex(t,e??this.defaults)}parser(t,e){return Tt.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},s={...this.defaults,...r},i=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=t),s.async)return(async()=>{let o=s.hooks?await s.hooks.preprocess(e):e,a=await(s.hooks?await s.hooks.provideLexer(t):t?kt.lex:kt.lexInline)(o,s),l=s.hooks?await s.hooks.processAllTokens(a):a;s.walkTokens&&await Promise.all(this.walkTokens(l,s.walkTokens));let f=await(s.hooks?await s.hooks.provideParser(t):t?Tt.parse:Tt.parseInline)(l,s);return s.hooks?await s.hooks.postprocess(f):f})().catch(i);try{s.hooks&&(e=s.hooks.preprocess(e));let o=(s.hooks?s.hooks.provideLexer(t):t?kt.lex:kt.lexInline)(e,s);s.hooks&&(o=s.hooks.processAllTokens(o)),s.walkTokens&&this.walkTokens(o,s.walkTokens);let a=(s.hooks?s.hooks.provideParser(t):t?Tt.parse:Tt.parseInline)(o,s);return s.hooks&&(a=s.hooks.postprocess(a)),a}catch(o){return i(o)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+Ut(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},Cn=new qp;function fe(t,e){return Cn.parse(t,e)}fe.options=fe.setOptions=function(t){return Cn.setOptions(t),fe.defaults=Cn.defaults,Rl(fe.defaults),fe},fe.getDefaults=qi,fe.defaults=An;function Wp(...t){return Cn.use(...t),fe.defaults=Cn.defaults,Rl(fe.defaults),fe}fe.use=Wp,fe.walkTokens=function(t,e){return Cn.walkTokens(t,e)},fe.parseInline=Cn.parseInline,fe.Parser=Tt,fe.parser=Tt.parse,fe.Renderer=Ps,fe.TextRenderer=Qi,fe.Lexer=kt,fe.lexer=kt.lex,fe.Tokenizer=Is,fe.Hooks=Or,fe.parse=fe,fe.options,fe.setOptions,fe.walkTokens,fe.parseInline,Tt.parse,kt.lex;/*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE */function ql(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Kp(t){if(Array.isArray(t))return t}function Gp(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var r,s,i,o,a=[],l=!0,f=!1;try{if(i=(n=n.call(t)).next,e!==0)for(;!(l=(r=i.call(n)).done)&&(a.push(r.value),a.length!==e);l=!0);}catch(h){f=!0,s=h}finally{try{if(!l&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(f)throw s}}return a}}function Yp(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Xp(t,e){return Kp(t)||Gp(t,e)||Zp(t,e)||Yp()}function Zp(t,e){if(t){if(typeof t=="string")return ql(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ql(t,e):void 0}}const Wl=Object.entries,Kl=Object.setPrototypeOf,Jp=Object.isFrozen,Qp=Object.getPrototypeOf,ed=Object.getOwnPropertyDescriptor;let $e=Object.freeze,Fe=Object.seal,Yn=Object.create,Gl=typeof Reflect<"u"&&Reflect,eo=Gl.apply,to=Gl.construct;$e||($e=function(e){return e}),Fe||(Fe=function(e){return e}),eo||(eo=function(e,n){for(var r=arguments.length,s=new Array(r>2?r-2:0),i=2;i<r;i++)s[i-2]=arguments[i];return e.apply(n,s)}),to||(to=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return new e(...r)});const Xn=Re(Array.prototype.forEach),td=Re(Array.prototype.lastIndexOf),Yl=Re(Array.prototype.pop),Zn=Re(Array.prototype.push),nd=Re(Array.prototype.splice),hn=Array.isArray,Ir=Re(String.prototype.toLowerCase),no=Re(String.prototype.toString),Xl=Re(String.prototype.match),Pr=Re(String.prototype.replace),Zl=Re(String.prototype.indexOf),rd=Re(String.prototype.trim),sd=Re(Number.prototype.toString),id=Re(Boolean.prototype.toString),Jl=typeof BigInt>"u"?null:Re(BigInt.prototype.toString),Ql=typeof Symbol>"u"?null:Re(Symbol.prototype.toString),Pe=Re(Object.prototype.hasOwnProperty),Nr=Re(Object.prototype.toString),Ne=Re(RegExp.prototype.test),On=od(TypeError);function Re(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return eo(t,e,r)}}function od(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return to(t,n)}}function se(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Ir;if(Kl&&Kl(t,null),!hn(e))return t;let r=e.length;for(;r--;){let s=e[r];if(typeof s=="string"){const i=n(s);i!==s&&(Jp(e)||(e[r]=i),s=i)}t[s]=!0}return t}function ad(t){for(let e=0;e<t.length;e++)Pe(t,e)||(t[e]=null);return t}function Ke(t){const e=Yn(null);for(const r of Wl(t)){var n=Xp(r,2);const s=n[0],i=n[1];Pe(t,s)&&(hn(i)?e[s]=ad(i):i&&typeof i=="object"&&i.constructor===Object?e[s]=Ke(i):e[s]=i)}return e}function ld(t){switch(typeof t){case"string":return t;case"number":return sd(t);case"boolean":return id(t);case"bigint":return Jl?Jl(t):"0";case"symbol":return Ql?Ql(t):"Symbol()";case"undefined":return Nr(t);case"function":case"object":{if(t===null)return Nr(t);const e=t,n=St(e,"toString");if(typeof n=="function"){const r=n(e);return typeof r=="string"?r:Nr(r)}return Nr(t)}default:return Nr(t)}}function St(t,e){for(;t!==null;){const r=ed(t,e);if(r){if(r.get)return Re(r.get);if(typeof r.value=="function")return Re(r.value)}t=Qp(t)}function n(){return null}return n}function cd(t){try{return Ne(t,""),!0}catch{return!1}}const ec=$e(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),ro=$e(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),so=$e(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ud=$e(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),io=$e(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),fd=$e(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),tc=$e(["#text"]),nc=$e(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),oo=$e(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),rc=$e(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Ns=$e(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),hd=Fe(/{{[\w\W]*|^[\w\W]*}}/g),pd=Fe(/<%[\w\W]*|^[\w\W]*%>/g),dd=Fe(/\${[\w\W]*/g),gd=Fe(/^data-[\-\w.\u00B7-\uFFFF]+$/),md=Fe(/^aria-[\-\w]+$/),sc=Fe(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),bd=Fe(/^(?:\w+script|data):/i),yd=Fe(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),wd=Fe(/^html$/i),_d=Fe(/^[a-z][.\w]*(-[.\w]+)+$/i),ic=Fe(/<[/\w!]/g),oc=Fe(/<[/\w]/g),xd=Fe(/<\/no(script|embed|frames)/i),vd=Fe(/\/>/i),at={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},kd=function(){return typeof window>"u"?null:window},Td=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null;const s="data-tt-policy-suffix";n&&n.hasAttribute(s)&&(r=n.getAttribute(s));const i="dompurify"+(r?"#"+r:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},ac=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},pn=function(e,n,r,s){return Pe(e,n)&&hn(e[n])?se(s.base?Ke(s.base):{},e[n],s.transform):r};function lc(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:kd();const e=R=>lc(R);if(e.version="3.4.13",e.removed=[],!t||!t.document||t.document.nodeType!==at.document||!t.Element)return e.isSupported=!1,e;let n=t.document;const r=n,s=r.currentScript;t.DocumentFragment;const i=t.HTMLTemplateElement,o=t.Node,a=t.Element,l=t.NodeFilter,f=t.NamedNodeMap;f===void 0&&(t.NamedNodeMap||t.MozNamedAttrMap),t.HTMLFormElement;const h=t.DOMParser,d=t.trustedTypes,x=a.prototype,O=St(x,"cloneNode"),P=St(x,"remove"),z=St(x,"nextSibling"),ee=St(x,"childNodes"),Y=St(x,"parentNode"),W=St(x,"shadowRoot"),X=St(x,"attributes"),N=o&&o.prototype?St(o.prototype,"nodeType"):null,te=o&&o.prototype?St(o.prototype,"nodeName"):null,ve=o&&o.prototype?St(o.prototype,"ownerDocument"):null;if(typeof i=="function"){const R=n.createElement("template");R.content&&R.content.ownerDocument&&(n=R.content.ownerDocument)}let pe,Ce="",Et,Ue=!1,He=0;const Ht=function(){if(He>0)throw On('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},tt=function(c){Ht(),He++;try{return pe.createHTML(c)}finally{He--}},dn=function(c){Ht(),He++;try{return pe.createScriptURL(c)}finally{He--}},In=function(){return Ue||(Et=Td(d,s),Ue=!0),Et},be=n,ce=be.implementation,ie=be.createNodeIterator,Le=be.createDocumentFragment,je=be.getElementsByTagName,At=r.importNode;let Z=ac();e.isSupported=typeof Wl=="function"&&typeof Y=="function"&&ce&&ce.createHTMLDocument!==void 0;const Qn=hd,gn=pd,er=dd,rn=gd,mn=md,lt=bd,jt=yd,Rt=_d;let sn=sc,u=null;const p=se({},[...ec,...ro,...so,...io,...tc]);let m=null;const v=se({},[...nc,...oo,...rc,...Ns]);let b=Object.seal(Yn(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),w=null,C=null;const T=Object.seal(Yn(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let E=!0,_=!0,F=!1,I=!0,L=!1,$=!0,q=!1,oe=!1,re=null,ye=null,Te=!1,Oe=!1,Ve=!1,ht=!1,Pn=!0,Me=!1;const Ze="user-content-";let on=!0,Vt=!1,qt={},pt=null;const Mr=se({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]);let Ds=null;const zs=se({},["audio","video","img","source","image","track"]);let Dr=null;const Nn=se({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ln="http://www.w3.org/1998/Math/MathML",tr="http://www.w3.org/2000/svg",dt="http://www.w3.org/1999/xhtml";let bn=dt,an=!1,zr=null;const uo=se({},[Ln,tr,dt],no),y=$e(["mi","mo","mn","ms","mtext"]);let S=se({},y);const A=$e(["annotation-xml"]);let ke=se({},A);const we=se({},["title","style","font","a","script"]);let M=null;const ln=["application/xhtml+xml","text/html"],gt="text/html";let de=null,mt=null;const nr=n.createElement("form"),fo=function(c){return c instanceof RegExp||c instanceof Function},rr=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(mt&&mt===c)return;(!c||typeof c!="object")&&(c={}),c=Ke(c),M=ln.indexOf(c.PARSER_MEDIA_TYPE)===-1?gt:c.PARSER_MEDIA_TYPE,de=M==="application/xhtml+xml"?no:Ir,u=pn(c,"ALLOWED_TAGS",p,{transform:de}),m=pn(c,"ALLOWED_ATTR",v,{transform:de}),zr=pn(c,"ALLOWED_NAMESPACES",uo,{transform:no}),Dr=pn(c,"ADD_URI_SAFE_ATTR",Nn,{transform:de,base:Nn}),Ds=pn(c,"ADD_DATA_URI_TAGS",zs,{transform:de,base:zs}),pt=pn(c,"FORBID_CONTENTS",Mr,{transform:de}),w=pn(c,"FORBID_TAGS",Ke({}),{transform:de}),C=pn(c,"FORBID_ATTR",Ke({}),{transform:de}),qt=Pe(c,"USE_PROFILES")?c.USE_PROFILES&&typeof c.USE_PROFILES=="object"?Ke(c.USE_PROFILES):c.USE_PROFILES:!1,E=c.ALLOW_ARIA_ATTR!==!1,_=c.ALLOW_DATA_ATTR!==!1,F=c.ALLOW_UNKNOWN_PROTOCOLS||!1,I=c.ALLOW_SELF_CLOSE_IN_ATTR!==!1,L=c.SAFE_FOR_TEMPLATES||!1,$=c.SAFE_FOR_XML!==!1,q=c.WHOLE_DOCUMENT||!1,Oe=c.RETURN_DOM||!1,Ve=c.RETURN_DOM_FRAGMENT||!1,ht=c.RETURN_TRUSTED_TYPE||!1,Te=c.FORCE_BODY||!1,Pn=c.SANITIZE_DOM!==!1,Me=c.SANITIZE_NAMED_PROPS||!1,on=c.KEEP_CONTENT!==!1,Vt=c.IN_PLACE||!1,sn=cd(c.ALLOWED_URI_REGEXP)?c.ALLOWED_URI_REGEXP:sc,bn=typeof c.NAMESPACE=="string"?c.NAMESPACE:dt,S=Pe(c,"MATHML_TEXT_INTEGRATION_POINTS")&&c.MATHML_TEXT_INTEGRATION_POINTS&&typeof c.MATHML_TEXT_INTEGRATION_POINTS=="object"?Ke(c.MATHML_TEXT_INTEGRATION_POINTS):se({},y),ke=Pe(c,"HTML_INTEGRATION_POINTS")&&c.HTML_INTEGRATION_POINTS&&typeof c.HTML_INTEGRATION_POINTS=="object"?Ke(c.HTML_INTEGRATION_POINTS):se({},A);const g=Pe(c,"CUSTOM_ELEMENT_HANDLING")&&c.CUSTOM_ELEMENT_HANDLING&&typeof c.CUSTOM_ELEMENT_HANDLING=="object"?Ke(c.CUSTOM_ELEMENT_HANDLING):Yn(null);if(b=Yn(null),Pe(g,"tagNameCheck")&&fo(g.tagNameCheck)&&(b.tagNameCheck=g.tagNameCheck),Pe(g,"attributeNameCheck")&&fo(g.attributeNameCheck)&&(b.attributeNameCheck=g.attributeNameCheck),Pe(g,"allowCustomizedBuiltInElements")&&typeof g.allowCustomizedBuiltInElements=="boolean"&&(b.allowCustomizedBuiltInElements=g.allowCustomizedBuiltInElements),Fe(b),L&&(_=!1),Ve&&(Oe=!0),qt&&(u=se({},tc),m=Yn(null),qt.html===!0&&(se(u,ec),se(m,nc)),qt.svg===!0&&(se(u,ro),se(m,oo),se(m,Ns)),qt.svgFilters===!0&&(se(u,so),se(m,oo),se(m,Ns)),qt.mathMl===!0&&(se(u,io),se(m,rc),se(m,Ns))),T.tagCheck=null,T.attributeCheck=null,Pe(c,"ADD_TAGS")&&(typeof c.ADD_TAGS=="function"?T.tagCheck=c.ADD_TAGS:hn(c.ADD_TAGS)&&(u===p&&(u=Ke(u)),se(u,c.ADD_TAGS,de))),Pe(c,"ADD_ATTR")&&(typeof c.ADD_ATTR=="function"?T.attributeCheck=c.ADD_ATTR:hn(c.ADD_ATTR)&&(m===v&&(m=Ke(m)),se(m,c.ADD_ATTR,de))),Pe(c,"ADD_URI_SAFE_ATTR")&&hn(c.ADD_URI_SAFE_ATTR)&&se(Dr,c.ADD_URI_SAFE_ATTR,de),Pe(c,"FORBID_CONTENTS")&&hn(c.FORBID_CONTENTS)&&(pt===Mr&&(pt=Ke(pt)),se(pt,c.FORBID_CONTENTS,de)),Pe(c,"ADD_FORBID_CONTENTS")&&hn(c.ADD_FORBID_CONTENTS)&&(pt===Mr&&(pt=Ke(pt)),se(pt,c.ADD_FORBID_CONTENTS,de)),on&&(u["#text"]=!0),q&&se(u,["html","head","body"]),u.table&&(se(u,["tbody"]),delete w.tbody),c.TRUSTED_TYPES_POLICY){if(typeof c.TRUSTED_TYPES_POLICY.createHTML!="function")throw On('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof c.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw On('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const k=pe;pe=c.TRUSTED_TYPES_POLICY;try{Ce=tt("")}catch(D){throw pe=k,D}}else c.TRUSTED_TYPES_POLICY===null?(pe=void 0,Ce=""):(pe===void 0&&(pe=In()),pe&&typeof Ce=="string"&&(Ce=tt("")));$e&&$e(c),mt=c},Bs=se({},[...ro,...so,...ud]),bc=se({},[...io,...fd]),Eg=function(c,g,k){return g.namespaceURI===dt?c==="svg":g.namespaceURI===Ln?c==="svg"&&(k==="annotation-xml"||S[k]):!!Bs[c]},Ag=function(c,g,k){return g.namespaceURI===dt?c==="math":g.namespaceURI===tr?c==="math"&&ke[k]:!!bc[c]},Rg=function(c,g,k){return g.namespaceURI===tr&&!ke[k]||g.namespaceURI===Ln&&!S[k]?!1:!bc[c]&&(we[c]||!Bs[c])},Cg=function(c){let g=Y(c);(!g||!g.tagName)&&(g={namespaceURI:bn,tagName:"template"});const k=Ir(c.tagName),D=Ir(g.tagName);return zr[c.namespaceURI]?c.namespaceURI===tr?Eg(k,g,D):c.namespaceURI===Ln?Ag(k,g,D):c.namespaceURI===dt?Rg(k,g,D):!!(M==="application/xhtml+xml"&&zr[c.namespaceURI]):!1},yn=function(c){Zn(e.removed,{element:c});try{Y(c).removeChild(c)}catch{if(P(c),!Y(c))throw On("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},$s=function(c){Br(c);const g=ee(c);if(g){const D=[];Xn(g,U=>{Zn(D,U)}),Xn(D,U=>{try{P(U)}catch{}})}const k=X(c);if(k)for(let D=k.length-1;D>=0;--D){const U=k[D],K=U&&U.name;if(typeof K=="string")try{c.removeAttribute(K)}catch{}}},Mn=function(c,g){try{Zn(e.removed,{attribute:g.getAttributeNode(c),from:g})}catch{Zn(e.removed,{attribute:null,from:g})}if(g.removeAttribute(c),c==="is")if(Oe||Ve)try{yn(g)}catch{}else try{g.setAttribute(c,"")}catch{}},Og=function(c){const g=X(c);if(g)for(let k=g.length-1;k>=0;--k){const D=g[k],U=D&&D.name;if(!(typeof U!="string"||m[de(U)]))try{c.removeAttribute(U)}catch{}}},Br=function(c){const g=[c];for(;g.length>0;){const k=g.pop();(N?N(k):k.nodeType)===at.element&&Og(k);const U=ee(k);if(U)for(let K=U.length-1;K>=0;--K)g.push(U[K])}},Ig=function(c){if(!$)return;const g=[c];for(;g.length>0;){const k=g.pop(),D=N?N(k):k.nodeType;if(D===at.processingInstruction||D===at.comment&&Ne(oc,k.data)){try{P(k)}catch{}continue}if(D===at.element){const K=k,ge=de(te?te(k):k.nodeName);try{K.hasAttribute&&K.hasAttribute("patchsrc")&&K.removeAttribute("patchsrc"),K.hasAttribute&&K.hasAttribute("for")&&ge!=="label"&&ge!=="output"&&K.removeAttribute("for")}catch{}}const U=ee(k);if(U)for(let K=U.length-1;K>=0;--K)g.push(U[K])}},yc=function(c){let g=null,k=null;if(Te)c="<remove></remove>"+c;else{const K=Xl(c,/^[\r\n\t ]+/);k=K&&K[0]}M==="application/xhtml+xml"&&bn===dt&&(c='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+c+"</body></html>");const D=pe?tt(c):c;if(bn===dt)try{g=new h().parseFromString(D,M)}catch{}if(!g||!g.documentElement){g=ce.createDocument(bn,"template",null);try{g.documentElement.innerHTML=an?Ce:D}catch{}}const U=g.body||g.documentElement;return c&&k&&U.insertBefore(n.createTextNode(k),U.childNodes[0]||null),bn===dt?je.call(g,q?"html":"body")[0]:q?g.documentElement:U},wc=function(c){const g=ve?ve(c):c.ownerDocument;return ie.call(g||c,c,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT|l.SHOW_PROCESSING_INSTRUCTION|l.SHOW_CDATA_SECTION,null)},Fs=function(c){return c=Pr(c,Qn," "),c=Pr(c,gn," "),c=Pr(c,er," "),c},ho=function(c){var g;c.normalize();const k=ve?ve(c):c.ownerDocument,D=ie.call(k||c,c,l.SHOW_TEXT|l.SHOW_COMMENT|l.SHOW_CDATA_SECTION|l.SHOW_PROCESSING_INSTRUCTION,null);let U=D.nextNode();for(;U;)U.data=Fs(U.data),U=D.nextNode();const K=(g=c.querySelectorAll)===null||g===void 0?void 0:g.call(c,"template");K&&Xn(K,ge=>{sr(ge.content)&&ho(ge.content)})},Us=function(c){const g=te?te(c):null;return typeof g!="string"||de(g)!=="form"?!1:typeof c.nodeName!="string"||typeof c.textContent!="string"||typeof c.removeChild!="function"||c.attributes!==X(c)||typeof c.removeAttribute!="function"||typeof c.setAttribute!="function"||typeof c.namespaceURI!="string"||typeof c.insertBefore!="function"||typeof c.hasChildNodes!="function"||c.nodeType!==N(c)||c.childNodes!==ee(c)},sr=function(c){if(!N||typeof c!="object"||c===null)return!1;try{return N(c)===at.documentFragment}catch{return!1}},$r=function(c){if(!N||typeof c!="object"||c===null)return!1;try{return typeof N(c)=="number"}catch{return!1}};function Wt(R,c,g){R.length!==0&&Xn(R,k=>{k.call(e,c,g,mt)})}const Pg=function(c,g){return!!($&&c.hasChildNodes()&&!$r(c.firstElementChild)&&Ne(ic,c.textContent)&&Ne(ic,c.innerHTML)||$&&c.namespaceURI===dt&&g==="style"&&$r(c.firstElementChild)||c.nodeType===at.processingInstruction||$&&c.nodeType===at.comment&&Ne(oc,c.data))},Ng=function(c,g,k){if(!w[g]&&kc(g)&&(b.tagNameCheck instanceof RegExp&&Ne(b.tagNameCheck,g)||b.tagNameCheck instanceof Function&&b.tagNameCheck(g)))return!1;if(on&&!pt[g]){const D=Y(c),U=ee(c);if(U&&D){const K=U.length;for(let ge=K-1;ge>=0;--ge){const Se=c===k?O(U[ge],!0):U[ge];D.insertBefore(Se,z(c))}}}return yn(c),!0},_c=function(c,g,k,D){return c.length===0?g:g===k||g===D?Ke(g):g},xc=function(c,g){if(Wt(Z.beforeSanitizeElements,c,null),c!==g&&Y(c)===null)return Vt&&Br(c),!0;if(Us(c))return yn(c),!0;const k=de(te?te(c):c.nodeName);if(u=_c(Z.uponSanitizeElement,u,p,re),Wt(Z.uponSanitizeElement,c,{tagName:k,allowedTags:u}),c!==g&&Y(c)===null)return Vt&&Br(c),!0;if(Pg(c,k))return yn(c),!0;if(w[k]||!(T.tagCheck instanceof Function&&T.tagCheck(k))&&!u[k]){const U=Ng(c,k,g);return U===!1&&Wt(Z.afterSanitizeElements,c,null),U}if((N?N(c):c.nodeType)===at.element&&!Cg(c)||(k==="noscript"||k==="noembed"||k==="noframes")&&Ne(xd,c.innerHTML))return yn(c),!0;if(L&&c.nodeType===at.text){const U=Fs(c.textContent);c.textContent!==U&&(Zn(e.removed,{element:c.cloneNode()}),c.textContent=U)}return Wt(Z.afterSanitizeElements,c,null),!1},vc=function(c,g,k){if(C[g]||$&&g==="patchsrc"||$&&g==="for"&&c!=="label"&&c!=="output"||Pn&&(g==="id"||g==="name")&&(k in n||k in nr))return!1;const D=m[g]||T.attributeCheck instanceof Function&&T.attributeCheck(g,c);if(!(_&&Ne(rn,g))){if(!(E&&Ne(mn,g))){if(D){if(!Dr[g]){if(!Ne(sn,Pr(k,jt,""))){if(!((g==="src"||g==="xlink:href"||g==="href")&&c!=="script"&&Zl(k,"data:")===0&&Ds[c])){if(!(F&&!Ne(lt,Pr(k,jt,"")))){if(k)return!1}}}}}else if(!(kc(c)&&(b.tagNameCheck instanceof RegExp&&Ne(b.tagNameCheck,c)||b.tagNameCheck instanceof Function&&b.tagNameCheck(c))&&(b.attributeNameCheck instanceof RegExp&&Ne(b.attributeNameCheck,g)||b.attributeNameCheck instanceof Function&&b.attributeNameCheck(g,c))||g==="is"&&b.allowCustomizedBuiltInElements&&(b.tagNameCheck instanceof RegExp&&Ne(b.tagNameCheck,k)||b.tagNameCheck instanceof Function&&b.tagNameCheck(k))))return!1}}return!0},Lg=se({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),kc=function(c){return!Lg[Ir(c)]&&Ne(Rt,c)},Mg=function(c,g,k,D){if(pe&&typeof d=="object"&&typeof d.getAttributeType=="function"&&!k)switch(d.getAttributeType(c,g)){case"TrustedHTML":return tt(D);case"TrustedScriptURL":return dn(D)}return D},Dg=function(c,g,k,D){try{k?c.setAttributeNS(k,g,D):c.setAttribute(g,D),Us(c)?yn(c):Yl(e.removed)}catch{Mn(g,c)}},Tc=function(c){Wt(Z.beforeSanitizeAttributes,c,null);const g=c.attributes;if(!g||Us(c))return;m=_c(Z.uponSanitizeAttribute,m,v,ye);const k={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:m,forceKeepAttr:void 0};let D=g.length;const U=de(c.nodeName);for(;D--;){const K=g[D],ge=K.name,Se=K.namespaceURI,nt=K.value,rt=de(ge),go=nt;let Je=ge==="value"?go:rd(go);if(k.attrName=rt,k.attrValue=Je,k.keepAttr=!0,k.forceKeepAttr=void 0,Wt(Z.uponSanitizeAttribute,c,k),Je=k.attrValue,Me&&(rt==="id"||rt==="name")&&Zl(Je,Ze)!==0&&(Mn(ge,c),Je=Ze+Je),$&&Ne(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,Je)){Mn(ge,c);continue}if(rt==="attributename"&&Xl(Je,"href")){Mn(ge,c);continue}if(!k.forceKeepAttr){if(!k.keepAttr){Mn(ge,c);continue}if(!I&&Ne(vd,Je)){Mn(ge,c);continue}if(L&&(Je=Fs(Je)),!vc(U,rt,Je)){Mn(ge,c);continue}Je=Mg(U,rt,Se,Je),Je!==go&&Dg(c,ge,Se,Je)}}Wt(Z.afterSanitizeAttributes,c,null)},Hs=function(c){let g=null;const k=wc(c);for(Wt(Z.beforeSanitizeShadowDOM,c,null);g=k.nextNode();)if(Wt(Z.uponSanitizeShadowNode,g,null),xc(g,c),Tc(g),sr(g.content)&&Hs(g.content),(N?N(g):g.nodeType)===at.element){const U=W(g);sr(U)&&(po(U),Hs(U))}Wt(Z.afterSanitizeShadowDOM,c,null)},po=function(c){const g=[{node:c,shadow:null}];for(;g.length>0;){const k=g.pop();if(k.shadow){Hs(k.shadow);continue}const D=k.node,K=(N?N(D):D.nodeType)===at.element,ge=ee(D);if(ge)for(let Se=ge.length-1;Se>=0;--Se)g.push({node:ge[Se],shadow:null});if(K){const Se=te?te(D):null;if(typeof Se=="string"&&de(Se)==="template"){const nt=D.content;sr(nt)&&g.push({node:nt,shadow:null})}}if(K){const Se=W(D);sr(Se)&&g.push({node:null,shadow:Se},{node:Se,shadow:null})}}};return e.sanitize=function(R){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},g=null,k=null,D=null,U=null;if(an=!R,an&&(R="<!-->"),typeof R!="string"&&!$r(R)&&(R=ld(R),typeof R!="string"))throw On("dirty is not a string, aborting");if(!e.isSupported)return R;oe?(u=re,m=ye):rr(c),(Z.uponSanitizeElement.length>0||Z.uponSanitizeAttribute.length>0)&&(u=Ke(u)),Z.uponSanitizeAttribute.length>0&&(m=Ke(m)),e.removed=[];const K=Vt&&typeof R!="string"&&$r(R);if(K){Ig(R);const nt=te?te(R):R.nodeName;if(typeof nt=="string"){const rt=de(nt);if(!u[rt]||w[rt])throw $s(R),On("root node is forbidden and cannot be sanitized in-place")}if(Us(R))throw $s(R),On("root node is clobbered and cannot be sanitized in-place");try{po(R)}catch(rt){throw $s(R),rt}}else if($r(R))g=yc("<!---->"),k=g.ownerDocument.importNode(R,!0),k.nodeType===at.element&&k.nodeName==="BODY"||k.nodeName==="HTML"?g=k:g.appendChild(k),po(k);else{if(!Oe&&!L&&!q&&R.indexOf("<")===-1)return pe&&ht?tt(R):R;if(g=yc(R),!g)return Oe?null:ht?Ce:""}g&&Te&&yn(g.firstChild);const ge=K?R:g;try{const nt=wc(ge);for(;D=nt.nextNode();)xc(D,ge),Tc(D),sr(D.content)&&Hs(D.content)}catch(nt){throw K&&($s(R),Xn(e.removed,rt=>{rt.element&&Br(rt.element)})),nt}if(K)return Xn(e.removed,nt=>{nt.element&&Br(nt.element)}),L&&ho(R),R;if(Oe){if(L&&ho(g),Ve)for(U=Le.call(g.ownerDocument);g.firstChild;)U.appendChild(g.firstChild);else U=g;return(m.shadowroot||m.shadowrootmode)&&(U=At.call(r,U,!0)),U}let Se=q?g.outerHTML:g.innerHTML;return q&&u["!doctype"]&&g.ownerDocument&&g.ownerDocument.doctype&&g.ownerDocument.doctype.name&&Ne(wd,g.ownerDocument.doctype.name)&&(Se="<!DOCTYPE "+g.ownerDocument.doctype.name+`>
`+Se),L&&(Se=Fs(Se)),pe&&ht?tt(Se):Se},e.setConfig=function(){let R=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};rr(R),oe=!0,re=u,ye=m},e.clearConfig=function(){mt=null,oe=!1,re=null,ye=null,pe=Et,Ce=""},e.isValidAttribute=function(R,c,g){mt||rr({});const k=de(R),D=de(c);return vc(k,D,g)},e.addHook=function(R,c){typeof c=="function"&&Pe(Z,R)&&Zn(Z[R],c)},e.removeHook=function(R,c){if(Pe(Z,R)){if(c!==void 0){const g=td(Z[R],c);return g===-1?void 0:nd(Z[R],g,1)[0]}return Yl(Z[R])}},e.removeHooks=function(R){Pe(Z,R)&&(Z[R]=[])},e.removeAllHooks=function(){Z=ac()},e}var Sd=lc();fe.setOptions({breaks:!0,gfm:!0});function Ls(t){if(!t)return"";const e=fe.parse(t,{async:!1});return Sd.sanitize(e,{ALLOWED_TAGS:["p","br","strong","b","em","i","code","pre","ul","ol","li","blockquote","a","h1","h2","h3","h4","h5","h6","hr","table","thead","tbody","tr","th","td","del","sup","sub","span"],ALLOWED_ATTR:["href","target","rel","class"]})}const ao="omnichat_accessToken",lo="omnichat_refreshToken",co="omnichat_siteToken";let Lr=null,Ed="",Ad=null;function cc(){return localStorage.getItem(ao)}function uc(){return localStorage.getItem(co)}function fc(){return localStorage.getItem(lo)}async function Rd(){return Lr||(Lr=(async()=>{try{const t=fc();if(!t)return!1;const e=await fetch(`${Ed}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:t})});if(!e.ok)return localStorage.removeItem(ao),localStorage.removeItem(lo),localStorage.removeItem(co),Ad?.(),!1;const n=await e.json();return localStorage.setItem(ao,n.accessToken),localStorage.setItem(lo,n.refreshToken),localStorage.setItem(co,n.siteToken),!0}catch{return!1}finally{Lr=null}})(),Lr)}async function Cd(t,e={}){const n=cc(),r=uc(),s={...e.headers||{}};n&&(s.Authorization=`Bearer ${n}`),r&&(s["x-external-site-token"]=r);const i=e.body!=null;i&&!(e.body instanceof FormData)&&!s["Content-Type"]&&(s["Content-Type"]="application/json");let o=await fetch(t,{...e,headers:s});if(o.status===401&&fc()&&await Rd()){const l={...e.headers||{}},f=cc(),h=uc();f&&(l.Authorization=`Bearer ${f}`),h&&(l["x-external-site-token"]=h),i&&!(e.body instanceof FormData)&&!l["Content-Type"]&&(l["Content-Type"]="application/json"),o=await fetch(t,{...e,headers:l})}return o}const Od="omnichat_translations",Id=1,Jn="translations",hc=[{value:"en",label:"English"},{value:"zh-Hans",label:"简体中文"},{value:"zh-Hant",label:"繁體中文"},{value:"ja",label:"日本語"},{value:"ko",label:"한국어"},{value:"fr",label:"Français"},{value:"de",label:"Deutsch"},{value:"it",label:"Italiano"},{value:"es",label:"Español"},{value:"pt",label:"Português"},{value:"nl",label:"Nederlands"},{value:"pl",label:"Polski"},{value:"tr",label:"Türkçe"},{value:"ar",label:"العربية"},{value:"ru",label:"Русский"},{value:"th",label:"ไทย"},{value:"vi",label:"Tiếng Việt"},{value:"id",label:"Bahasa Indonesia"},{value:"ms",label:"Bahasa Melayu"},{value:"hi",label:"हिन्दी"}];function Pd(t){const e=localStorage.getItem(t);if(e)return e;const n=navigator.language||navigator.userLanguage||"",r=n.split("-")[0].toLowerCase();if(r==="zh")return n.toLowerCase().includes("hant")||n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans";const s=hc.find(i=>i.value===r);return s?s.value:"en"}function pc(){return new Promise((t,e)=>{const n=indexedDB.open(Od,Id);n.onupgradeneeded=()=>{const r=n.result;r.objectStoreNames.contains(Jn)||r.createObjectStore(Jn,{keyPath:"id"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}function dc(t,e){let n=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);n=(n<<5)-n+s,n|=0}return`${n}:${e}`}async function Nd(t,e){try{const n=await pc(),r=dc(t,e);return new Promise((s,i)=>{const l=n.transaction(Jn,"readonly").objectStore(Jn).get(r);l.onsuccess=()=>{n.close(),s(l.result?.translatedText||null)},l.onerror=()=>{n.close(),i(l.error)}})}catch{return null}}async function Ld(t,e,n){try{const r=await pc(),s=dc(t,e);return new Promise((i,o)=>{const f=r.transaction(Jn,"readwrite").objectStore(Jn).put({id:s,translatedText:n,createdAt:Date.now()});f.onsuccess=()=>{r.close(),i()},f.onerror=()=>{r.close(),o(f.error)}})}catch{}}async function Md(t,e,n){const r=await Nd(e,n);if(r)return r;const s=await Cd(`${t}/ai/translate`,{method:"POST",body:JSON.stringify({text:e,targetLanguage:n})});if(!s.ok){const a=await s.text();throw new Error(a||`HTTP ${s.status}`)}const o=(await s.json()).translatedText;if(!o)throw new Error("Translation returned empty result");return await Ld(e,n,o),o}const Dd={key:0,style:{"font-size":"12px",opacity:"0.85","margin-top":"2px"}},zd={style:{display:"flex","align-items":"center",gap:"8px"}},Bd={key:0,style:{position:"relative"}},$d={key:0,style:{position:"absolute",top:"100%",right:"0","margin-top":"6px",background:"white",border:"1px solid #e5e7eb","border-radius":"8px","box-shadow":"0 4px 16px rgba(0,0,0,0.12)","z-index":"100","min-width":"160px","max-height":"260px","overflow-y":"auto",padding:"4px 0"}},Fd=["onClick","onMouseleave"],Ud=["title"],Hd={key:0,class:"drag-overlay"},jd={key:1,class:"welcome-screen"},Vd={key:0,style:{background:"rgba(254, 226, 226, 0.8)",border:"1px solid #fca5a5",padding:"16px","border-radius":"12px","margin-bottom":"24px","text-align":"center"}},qd={style:{color:"#7f1d1d","white-space":"pre-wrap","font-size":"14px",margin:"0"}},Wd={class:"pre-chat-form"},Kd={key:0,style:{"flex-shrink":"0",background:"#fef2f2","border-bottom":"1px solid #fecaca",padding:"8px 12px","text-align":"center"}},Gd={style:{color:"#991b1b",margin:"2px 0 0","font-size":"12px"}},Yd=["innerHTML"],Xd={class:"msg-meta"},Zd={class:"msg-time"},Jd={class:"msg-avatar"},Qd=["src"],eg={key:1},tg={key:0,class:"ai-label"},ng=["src","onClick"],rg=["innerHTML"],sg=["innerHTML"],ig={class:"msg-time"},og=["onClick","disabled","title"],ag={key:1,class:"msg-row ai",style:{"align-self":"flex-start"}},lg={class:"msg-avatar"},cg=["src"],ug={key:1},fg={class:"msg-bubble ai ai-streaming"},hg=["innerHTML"],pg={key:2,class:"typing-hint"},dg={key:3,class:"resolved-banner"},gg={key:0,class:"review-section"},mg={class:"star-rating"},bg=["onClick"],yg={key:1,class:"review-thank-you"},wg={key:0,class:"confirm-action-area"},_g={key:1,class:"input-area"},xg={key:0,style:{position:"absolute",top:"-32px",left:"12px",right:"12px",background:"#fef2f2",color:"#dc2626","font-size":"11px",padding:"4px 10px","border-radius":"6px",border:"1px solid #fecaca"}},vg=["disabled"],kg=["placeholder","disabled","onKeydown"],Tg=["disabled"],Sg=["src"],gc=200,mc=Kf(ia({__name:"App.ce",props:{serverUrl:{type:String,required:!0},bubbleColor:{type:String,default:"#4F46E5"},welcomeMessage:{type:String,default:"Hello! How can we help you today?"},dataExternalToken:{type:String,default:""}},setup(t){const e=t,n=V(null),r=V(!0),s=V(null),i=V([]),o=V(""),a=V(!1),l=V(""),f=V(!1),h=V(""),d=V(null),x=V(null),O=V(""),P=V(!1),z=V(!1),ee=V(!0),Y=V(!0);let W=null,X=!1;function N(){if(!d.value)return!0;const y=d.value;return y.scrollHeight-y.scrollTop-y.clientHeight<80}function te(){X||W||(W=requestAnimationFrame(()=>{Nn(!0),W=null}))}ss(d,(y,S)=>{S&&S.removeEventListener("scroll",q),y&&y.addEventListener("scroll",q,{passive:!0})});const ve=V(""),pe=V(""),Ce=V("We are currently offline. Please check back later."),Et=V(!1),Ue=V(localStorage.getItem("omnichat_visitor_muted")==="true"),He=V(""),Ht=V(!0),tt=V("🤖"),dn=V("👨🏻‍💻"),In=V("👤");function be(y){let S="";if(y==="ai")S=tt.value;else if(y==="agent")S=dn.value;else if(y==="visitor")S=In.value;else return{isImage:!1,value:""};if(S.startsWith("custom:")){const A=S.slice(7);return{isImage:!0,value:A.startsWith("http")?A:e.serverUrl+A}}return S.startsWith("/")||S.startsWith("http")?{isImage:!0,value:S.startsWith("http")?S:e.serverUrl+S}:{isImage:!1,value:S}}const ce=V(Pd("omnichat_visitor_translate_lang")),ie=V(!1),Le=V(new Set),je=V({});function At(y){ce.value=y,localStorage.setItem("omnichat_visitor_translate_lang",y)}async function Z(y){if(je.value[y.id]){delete je.value[y.id];return}if(Le.value.has(y.id))return;const S=y.content||"";if(S.trim()){Le.value=new Set([...Le.value,y.id]);try{const A=await Md(e.serverUrl,S,ce.value);je.value={...je.value,[y.id]:A}}catch(A){console.warn("Translation failed:",A.message)}finally{const A=new Set(Le.value);A.delete(y.id),Le.value=A}}}function Qn(y){Y.value&&(!y.content||y.messageType==="image"||je.value[y.id]||Le.value.has(y.id)||Z(y))}const gn=new Audio;function er(){try{const y=new(window.AudioContext||window.webkitAudioContext),S=y.createOscillator(),A=y.createGain();S.connect(A),A.connect(y.destination),S.type="sine",S.frequency.setValueAtTime(600,y.currentTime),S.frequency.exponentialRampToValueAtTime(100,y.currentTime+.1),A.gain.setValueAtTime(.5,y.currentTime),A.gain.exponentialRampToValueAtTime(.01,y.currentTime+.1),S.start(y.currentTime),S.stop(y.currentTime+.1)}catch(y){console.warn("Synthesized audio failed:",y)}}function rn(){if(!Ue.value)if(He.value){const y=e.serverUrl.replace(/\/$/,""),S=He.value.startsWith("http")?He.value:y+He.value;gn.src!==S&&(gn.src=S),gn.currentTime=0,gn.play().catch(()=>er())}else er()}function mn(){Ue.value=!Ue.value,localStorage.setItem("omnichat_visitor_muted",Ue.value?"true":"false")}const lt=Si(()=>ve.value||e.bubbleColor),jt=V(""),Rt=V(""),sn=V(0),u=V(""),p=V(!1),m=V(!1),v=V(!1),b=V(!1),w=V(0),C=V(null),T=V(null),E=V(null),_=V(""),F=V(null);async function I(){const y=e.serverUrl.replace(/\/$/,""),S=localStorage.getItem("omnichat_visitor_id");S&&localStorage.removeItem("omnichat_visitor_id");const A=S||`v_${crypto.randomUUID?.()||Math.random().toString(36).slice(2,10)}`,ke=e.dataExternalToken||window.__OMNICHAT_EXTERNAL_TOKEN__;try{const M={visitorId:A};ke&&(M.externalToken=ke);const gt=await(await fetch(`${y}/auth/visitor`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(M),credentials:"include"})).json();gt.visitorId&&(h.value=gt.visitorId)}catch{}const we=As(e.serverUrl,{auth:{visitorId:A,externalToken:ke||void 0},transports:["websocket","polling"],withCredentials:!0});we.on("connect",()=>{const M=localStorage.getItem("omnichat_conversation_id");M&&(s.value=M,we.emit("join_conversation",{conversationId:M}))}),we.on("upload_token",M=>{T.value=M.token}),we.on("conversation_started",M=>{s.value=M.conversation.id,localStorage.setItem("omnichat_conversation_id",M.conversation.id)}),we.on("conversation_history",M=>{i.value=M.conversation.messages||[],f.value=M.conversation.status==="resolved",M.conversation.rating&&(p.value=!0),pr(()=>Nn())}),we.on("inactivity_warning",M=>{M.conversationId===s.value&&(i.value.push({id:"sys_"+Date.now(),conversationId:M.conversationId,senderType:"system",content:M.message,createdAt:new Date().toISOString()}),L(),pr(()=>Nn()))}),we.on("message_error",M=>{_.value=M.error,setTimeout(()=>_.value="",4e3)}),we.on("new_message",M=>{M.message.conversationId===s.value&&(M.message.senderType==="ai"&&P.value&&(P.value=!1,O.value="",X=!1),i.value.push(M.message),L(),(M.message.senderType==="agent"||M.message.senderType==="ai")&&rn(),pr(()=>{Nn(),r.value&&(M.message.senderType==="agent"||M.message.senderType==="ai")&&n.value?.emit("read_message",{messageId:M.message.id,conversationId:s.value}),(M.message.senderType==="agent"||M.message.senderType==="ai")&&Qn(M.message)}))}),we.on("ai_stream",M=>{M.conversationId===s.value&&(M.isComplete||(P.value=!0,O.value+=M.token,te()))}),we.on("message_read",M=>{const ln=i.value.find(gt=>gt.id===M.messageId);ln&&(ln.readAt=M.readAt)}),we.on("agent_typing",M=>{M.conversationId===s.value&&(a.value=M.isTyping,l.value=M.user)}),we.on("ip_blacklisted",M=>{M.conversationId===s.value&&(F.value={reason:M.reason})}),we.on("conversation_resolved",M=>{M.conversationId===s.value&&(f.value=!0)}),we.on("error",M=>{console.error("Visitor Error:",M.message),M.message==="Conversation not found"&&(localStorage.removeItem("omnichat_conversation_id"),s.value="",f.value=!1,i.value=[]),M.message==="Failed to resolve conversation"&&(f.value=!0)}),we.on("disconnect",()=>{}),n.value=we}function L(){i.value.length>gc&&i.value.splice(0,i.value.length-gc)}function $(y){return y?y.slice(-8).toUpperCase():""}function q(){P.value&&(X=!N())}function oe(y){!s.value||!r.value||(y.preventDefault(),w.value++,b.value=!0)}function re(y){!s.value||!r.value||y.preventDefault()}function ye(y){!s.value||!r.value||(y.preventDefault(),w.value--,w.value<=0&&(w.value=0,b.value=!1))}function Te(y){y.preventDefault(),w.value=0,b.value=!1,s.value&&y.dataTransfer?.files&&y.dataTransfer.files.length>0&&on(y.dataTransfer.files[0])}function Oe(y){E.value=y}function Ve(){E.value=null}function ht(){jt.value.trim()||alert("Please provide your name to continue."),n.value?.emit("start_conversation",{visitorId:h.value,visitorName:jt.value.trim(),visitorEmail:Rt.value.trim(),visitorCurrentUrl:window.location.href,visitorTimezone:Intl.DateTimeFormat().resolvedOptions().timeZone,visitorLanguage:navigator.language,visitorScreenRes:`${window.screen.width}x${window.screen.height}`,visitorReferrer:document.referrer||null,metadata:JSON.stringify({userAgent:navigator.userAgent})})}function Pn(){C.value?.click()}function Me(y,S=1200,A=.8){return new Promise((ke,we)=>{const M=new FileReader;M.readAsDataURL(y),M.onload=ln=>{const gt=new Image;gt.src=ln.target?.result,gt.onload=()=>{const de=document.createElement("canvas");let mt=gt.width,nr=gt.height;mt>S&&(nr=Math.round(nr*S/mt),mt=S),de.width=mt,de.height=nr,de.getContext("2d")?.drawImage(gt,0,0,mt,nr),de.toBlob(rr=>{if(rr){const Bs=y.name.replace(/\.[^/.]+$/,"")+".webp";ke(new File([rr],Bs,{type:"image/webp"}))}else we(new Error("Canvas to Blob failed"))},"image/webp",A)}},M.onerror=ln=>we(ln)})}async function Ze(y){const S=y.target;!S.files||S.files.length===0||await on(S.files[0])}async function on(y){y.size>5*1024*1024&&alert("File size exceeds 5MB limit."),v.value=!0;try{const A=y.name.toLowerCase(),ke=A.endsWith(".heic")||A.endsWith(".heif")||y.type==="image/heic"||y.type==="image/heif";if(!ke&&y.type.match(/image\/(jpeg|jpg|png|webp)/))y=await Me(y,1200,.8);else if(!ke)throw new Error(`Unsupported format: ${y.type}`)}catch(A){console.error("Image processing failed",A),alert(`Failed to process image: ${A.message}.`),v.value=!1,C.value&&(C.value.value="");return}const S=new FormData;S.append("file",y),s.value&&S.append("conversationId",s.value);try{const A={};T.value&&(A.Authorization=T.value);const ke=await fetch(`${e.serverUrl}/upload`,{method:"POST",headers:A,body:S});if(!ke.ok)throw new Error("Upload failed");const we=await ke.json();we.uploadToken&&(T.value=we.uploadToken),n.value?.emit("send_message",{conversationId:s.value,content:"",messageType:"image",attachmentUrl:`${e.serverUrl}${we.url}`,attachmentThumbnailUrl:`${e.serverUrl}${we.thumbnailUrl||we.url}`})}catch(A){console.error("Upload error:",A),alert("Failed to upload file.")}finally{v.value=!1,C.value&&(C.value.value="")}}function Vt(){if(!o.value.trim()||!s.value||P.value)return;const y=o.value.trim();if(y.length>100){_.value=`Message too long (${y.length}/100 characters).`,setTimeout(()=>_.value="",4e3);return}_.value="",n.value?.emit("send_message",{conversationId:s.value,content:o.value.trim(),messageType:"text"}),n.value?.emit("typing_stop",{conversationId:s.value}),o.value=""}let qt=null;function pt(){s.value&&(n.value?.emit("typing_start",{conversationId:s.value}),qt&&clearTimeout(qt),qt=setTimeout(()=>{n.value?.emit("typing_stop",{conversationId:s.value})},2e3))}function Mr(){!s.value||sn.value===0||(n.value?.emit("submit_review",{conversationId:s.value,rating:sn.value,review:u.value.trim()}),p.value=!0)}function Ds(){m.value=!0}function zs(){if(!s.value){f.value=!0,m.value=!1;return}n.value?.emit("resolve_conversation",{conversationId:s.value}),m.value=!1}function Dr(){m.value=!1}function Nn(y=!1){d.value&&(y?d.value.scrollTop=d.value.scrollHeight:d.value.scrollTo({top:d.value.scrollHeight,behavior:"smooth"}))}function Ln(y){const S=new Date(y),A=S.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`${S.toLocaleDateString([],{month:"short",day:"numeric"})} ${A}`}function tr(){s.value=null,i.value=[],f.value=!1,p.value=!1,sn.value=0,u.value="",O.value="",P.value=!1,localStorage.removeItem("omnichat_conversation_id")}const dt=Si(()=>({fontSize:"10px",color:o.value.length>=85?"#dc2626":"#9ca3af",position:"absolute",bottom:"4px",right:"65px",pointerEvents:"none"}));function bn(y){return ce.value===y.value?{background:"#eef2ff",color:"#4f46e5",fontWeight:600}:{}}function an(){const y=x.value;if(!y)return;const S=window.visualViewport;S&&(S.height<document.documentElement.clientHeight?y.style.height=`${S.height}px`:y.style.height="")}function zr(){try{const y=document.querySelector('meta[name="viewport"]');y&&!y.content.includes("viewport-fit=cover")&&(y.content=`${y.content}, viewport-fit=cover`)}catch{}}ua(()=>{fetch(`${e.serverUrl}/config/active`).then(y=>y.json()).then(y=>{y.bubbleColor&&(ve.value=y.bubbleColor),y.welcomeMessage&&(pe.value=y.welcomeMessage),y.offlineMessage&&(Ce.value=y.offlineMessage),y.isOfflineMode!==void 0&&(Et.value=y.isOfflineMode),y.notificationSoundUrl&&(He.value=y.notificationSoundUrl),y.aiAvatar&&(tt.value=y.aiAvatar),y.agentAvatar&&(dn.value=y.agentAvatar),y.visitorAvatar&&(In.value=y.visitorAvatar),y.aiEnabled!==void 0&&(z.value=y.aiEnabled),y.translationEnabled!==void 0&&(ee.value=y.translationEnabled),y.autoTranslationEnabled!==void 0&&(Y.value=y.autoTranslationEnabled),y.showVisitorWidget!==void 0&&(Ht.value=y.showVisitorWidget)}).catch(()=>{}),I(),zr(),an(),window.visualViewport?.addEventListener("resize",an),window.visualViewport?.addEventListener("scroll",an)}),di(()=>{window.visualViewport?.removeEventListener("resize",an),window.visualViewport?.removeEventListener("scroll",an),n.value?.disconnect()});function uo(){try{window.opener?window.close():window.parent!==window?window.parent.postMessage({type:"omnichat-close"},"*"):window.history.back()}catch{window.history.back()}}return(y,S)=>(G(),J(Be,null,[Ht.value?(G(),J("div",{key:0,ref_key:"panelWrapper",ref:x,class:"panel-wrapper",style:{left:"0px",top:"0px",width:"100%",height:"100dvh",borderRadius:"0px",border:"none"},onDragenter:oe,onDragover:re,onDragleave:ye,onDrop:Te},[B("div",{class:"panel-header",style:yt({backgroundColor:lt.value})},[B("div",null,[B("h3",null,Ie(s.value?"Chat Support":"Chat with us"),1),s.value?(G(),J("span",Dd," Ticket: #"+Ie($(s.value)),1)):ot("",!0)]),B("div",zd,[ee.value?(G(),J("div",Bd,[B("button",{type:"button",class:"close-btn",onClick:S[0]||(S[0]=A=>ie.value=!ie.value),title:"Translate",style:{"font-size":"16px"}}," 🌐 "),ie.value?(G(),J("div",$d,[(G(!0),J(Be,null,gi(vn(hc),A=>(G(),J("button",{key:A.value,onClick:ke=>{At(A.value),ie.value=!1},style:yt([{display:"block",width:"100%","text-align":"left",padding:"6px 14px",border:"none",background:"none",cursor:"pointer","font-size":"13px",color:"#374151"},bn(A)]),onMouseenter:S[1]||(S[1]=ke=>ke.target.style.background="#f3f4f6"),onMouseleave:ke=>ke.target.style.background=ce.value===A.value?"#eef2ff":"none"},Ie(A.label),45,Fd))),128))])):ot("",!0)])):ot("",!0),B("button",{type:"button",class:"close-btn",onClick:mn,title:Ue.value?"Unmute":"Mute",style:{"font-size":"16px"}},Ie(Ue.value?"🔕":"🔔"),9,Ud),B("button",{type:"button",class:"close-btn",onClick:uo,"aria-label":"Close chat"}," × ")])],4),b.value?(G(),J("div",Hd,[...S[7]||(S[7]=[B("div",{class:"drag-overlay-content"},[B("span",{style:{"font-size":"40px","margin-bottom":"12px",display:"block","text-align":"center"}},"📥"),B("span",null,"Drop file to upload")],-1)])])):ot("",!0),s.value?(G(),J(Be,{key:2},[F.value?(G(),J("div",Kd,[S[9]||(S[9]=B("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0","font-size":"13px"}}," ⚠ You have been flagged for spam activity ",-1)),B("p",Gd,Ie(F.value.reason),1)])):ot("",!0),B("div",{ref_key:"messagesArea",ref:d,class:"messages-area"},[(G(!0),J(Be,null,gi(i.value,A=>(G(),J("div",{key:A.id},[A.senderType==="system"?(G(),J("div",{key:0,class:wn(["msg-bubble",A.senderType])},[B("div",{class:"md-content",innerHTML:vn(Ls)(je.value[A.id]||A.content||"")},null,8,Yd),B("div",Xd,[B("span",Zd,Ie(Ln(A.createdAt)),1)])],2)):(G(),J("div",{key:1,class:wn(["msg-row",A.senderType])},[B("div",Jd,[be(A.senderType).isImage?(G(),J("img",{key:0,src:be(A.senderType).value,alt:""},null,8,Qd)):(G(),J("span",eg,Ie(be(A.senderType).value),1))]),B("div",{class:wn(["msg-bubble",A.senderType]),style:yt(A.senderType==="visitor"?{backgroundColor:lt.value,padding:A.messageType==="image"?"4px":""}:{padding:A.messageType==="image"?"4px":""})},[A.senderType==="ai"?(G(),J("div",tg,"AI Agent")):ot("",!0),A.messageType==="image"?(G(),J(Be,{key:1},[B("img",{src:A.attachmentThumbnailUrl||A.attachmentUrl,alt:"Attachment",style:{"max-width":"100%","max-height":"150px","border-radius":"8px",display:"block",cursor:"pointer","object-fit":"cover"},onClick:ke=>Oe(A.attachmentUrl||"")},null,8,ng),A.content?(G(),J("div",{key:0,class:"md-content",style:{padding:"8px"},innerHTML:vn(Ls)(je.value[A.id]||A.content)},null,8,rg)):ot("",!0)],64)):(G(),J("div",{key:2,class:"md-content",innerHTML:vn(Ls)(je.value[A.id]||A.content||"")},null,8,sg)),B("div",{class:"msg-meta",style:yt({display:"flex",alignItems:"center",justifyContent:"space-between",padding:A.messageType==="image"?"0 8px 8px 8px":""})},[B("span",ig,Ie(Ln(A.createdAt)),1),A.content&&A.messageType!=="image"&&ee.value?(G(),J("button",{key:0,onClick:ke=>Z(A),disabled:Le.value.has(A.id),style:{background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"inherit",padding:"1px 6px","border-radius":"4px","font-size":"10px",cursor:"pointer",opacity:"0.7"},title:je.value[A.id]?"Show original":"Translate"},Ie(Le.value.has(A.id)?"...":je.value[A.id]?"Original":"Translate"),9,og)):ot("",!0)],4)],6)],2))]))),128))],512),P.value&&O.value?(G(),J("div",ag,[B("div",lg,[be("ai").isImage?(G(),J("img",{key:0,src:be("ai").value,alt:""},null,8,cg)):(G(),J("span",ug,Ie(be("ai").value),1))]),B("div",fg,[S[10]||(S[10]=B("div",{class:"ai-label"},"AI Agent",-1)),B("div",{class:"md-content",innerHTML:vn(Ls)(O.value)},null,8,hg),S[11]||(S[11]=B("span",{class:"ai-cursor"},"|",-1))])])):ot("",!0),a.value?(G(),J("div",pg,[B("span",null,Ie(l.value)+" is typing",1)])):ot("",!0),f.value?(G(),J("div",dg,[S[13]||(S[13]=hs(" This conversation has been resolved. ",-1)),S[14]||(S[14]=B("br",null,null,-1)),S[15]||(S[15]=hs(" Reference Ticket: ",-1)),B("strong",null,"#"+Ie($(s.value)),1),p.value?(G(),J("div",yg,"Thank you for your feedback!")):(G(),J("div",gg,[S[12]||(S[12]=B("p",null,"How was your experience?",-1)),B("div",mg,[(G(),J(Be,null,gi(5,A=>B("span",{key:A,onClick:ke=>sn.value=A,class:wn({active:A<=sn.value})},"★",10,bg)),64))]),ns(B("textarea",{"onUpdate:modelValue":S[4]||(S[4]=A=>u.value=A),placeholder:"Any comments? (Optional)",class:"form-input"},null,512),[[ys,u.value]]),B("button",{type:"button",class:"submit-review-btn",style:yt({backgroundColor:lt.value}),onClick:Mr},"Submit Review",4)])),B("button",{type:"button",class:"start-new-chat-btn",onClick:tr},"Start a new chat")])):(G(),J(Be,{key:4},[m.value?(G(),J("div",wg,[S[16]||(S[16]=B("span",{class:"confirm-text"},"End this chat?",-1)),B("div",{class:"confirm-buttons"},[B("button",{type:"button",class:"confirm-yes-btn",onClick:zs},"End"),B("button",{type:"button",class:"confirm-cancel-btn",onClick:Dr},"Cancel")])])):(G(),J("div",_g,[_.value?(G(),J("div",xg,Ie(_.value),1)):ot("",!0),B("button",{type:"button",class:"attachment-btn",style:{background:"transparent",border:"none","font-size":"18px",cursor:"pointer",color:"#64748b",display:"flex","align-items":"center","justify-content":"center"},disabled:v.value,onClick:Pn,title:"Attach Image (Max 5MB)"},[...S[17]||(S[17]=[B("span",{style:{transform:"rotate(45deg)"}},"📎",-1)])],8,vg),B("input",{type:"file",ref_key:"fileInput",ref:C,style:{display:"none"},accept:"image/*",onChange:Ze},null,544),ns(B("textarea",{"onUpdate:modelValue":S[5]||(S[5]=A=>o.value=A),class:"msg-input",rows:"1",maxlength:"100",placeholder:v.value?"Uploading...":P.value?"AI is responding...":"Type your message...",disabled:v.value||P.value,onKeydown:[ol(Ii(Vt,["exact","prevent"]),["enter"]),ol(Ii(()=>{},["shift","exact"]),["enter"])],onInput:pt},null,40,kg),[[ys,o.value]]),B("span",{style:yt(dt.value)},Ie(o.value.length)+"/100",5),B("button",{type:"button",class:"send-msg-btn",style:yt({backgroundColor:lt.value,boxShadow:"0 4px 10px "+lt.value+"40"}),disabled:!o.value.trim()&&!v.value||P.value,onClick:Vt},Ie(v.value||P.value?"...":"Send"),13,Tg),B("button",{type:"button",class:"end-chat-btn",onClick:Ds,title:"End Chat"},"✖")]))],64))],64)):(G(),J("div",jd,[Et.value&&!z.value?(G(),J("div",Vd,[S[8]||(S[8]=B("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0 0 8px 0","font-size":"15px"}},[B("span",null,"🌙"),hs(" Agents are offline ")],-1)),B("p",qd,Ie(Ce.value),1)])):(G(),J(Be,{key:1},[B("p",null,Ie(pe.value||t.welcomeMessage),1),B("div",Wd,[ns(B("input",{"onUpdate:modelValue":S[2]||(S[2]=A=>jt.value=A),type:"text",placeholder:"Your Name",class:"form-input"},null,512),[[ys,jt.value]]),ns(B("input",{"onUpdate:modelValue":S[3]||(S[3]=A=>Rt.value=A),type:"text",inputmode:"email",placeholder:"Your Email (Optional)",class:"form-input"},null,512),[[ys,Rt.value]])]),B("button",{type:"button",class:"start-chat-btn",style:yt({backgroundColor:lt.value,boxShadow:"0 4px 14px "+lt.value+"66"}),onClick:ht}," Start a conversation ",4)],64))]))],544)):ot("",!0),E.value?(G(),J("div",{key:1,style:{position:"fixed",inset:"0",background:"rgba(0,0,0,0.8)","z-index":"2147483647",display:"flex","align-items":"center","justify-content":"center"},onClick:Ve},[S[18]||(S[18]=B("button",{style:{position:"absolute",top:"20px",right:"20px",background:"none",border:"none",color:"white","font-size":"32px",cursor:"pointer"}},"×",-1)),B("img",{src:E.value,style:{"max-width":"90vw","max-height":"90vh","object-fit":"contain","border-radius":"4px"},onClick:S[6]||(S[6]=Ii(()=>{},["stop"]))},null,8,Sg)])):ot("",!0)],64))}}),{styles:[`*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}/*
! tailwindcss v3.4.19 | MIT License | https://tailwindcss.com
*//*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/
dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.collapse {
  visibility: collapse;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.inset-0 {
  inset: 0px;
}
.z-50 {
  z-index: 50;
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
.float-right {
  float: right;
}
.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.ml-auto {
  margin-left: auto;
}
.mt-0\\.5 {
  margin-top: 0.125rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.table {
  display: table;
}
.grid {
  display: grid;
}
.hidden {
  display: none;
}
.h-10 {
  height: 2.5rem;
}
.h-2 {
  height: 0.5rem;
}
.h-3 {
  height: 0.75rem;
}
.h-5 {
  height: 1.25rem;
}
.h-6 {
  height: 1.5rem;
}
.h-8 {
  height: 2rem;
}
.h-full {
  height: 100%;
}
.max-h-40 {
  max-height: 10rem;
}
.max-h-60 {
  max-height: 15rem;
}
.max-h-96 {
  max-height: 24rem;
}
.w-10 {
  width: 2.5rem;
}
.w-11 {
  width: 2.75rem;
}
.w-16 {
  width: 4rem;
}
.w-2 {
  width: 0.5rem;
}
.w-3 {
  width: 0.75rem;
}
.w-32 {
  width: 8rem;
}
.w-36 {
  width: 9rem;
}
.w-40 {
  width: 10rem;
}
.w-64 {
  width: 16rem;
}
.w-8 {
  width: 2rem;
}
.w-80 {
  width: 20rem;
}
.w-9 {
  width: 2.25rem;
}
.w-full {
  width: 100%;
}
.min-w-0 {
  min-width: 0px;
}
.max-w-2xl {
  max-width: 42rem;
}
.max-w-6xl {
  max-width: 72rem;
}
.max-w-lg {
  max-width: 32rem;
}
.max-w-xs {
  max-width: 20rem;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink {
  flex-shrink: 1;
}
.shrink-0 {
  flex-shrink: 0;
}
.border-collapse {
  border-collapse: collapse;
}
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes spin {

  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.cursor-pointer {
  cursor: pointer;
}
.resize-y {
  resize: vertical;
}
.resize {
  resize: both;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-start {
  align-items: flex-start;
}
.items-end {
  align-items: flex-end;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-1\\.5 {
  gap: 0.375rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-divide-opacity, 1));
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-y-auto {
  overflow-y: auto;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.break-all {
  word-break: break-all;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.border {
  border-width: 1px;
}
.border-2 {
  border-width: 2px;
}
.border-t {
  border-top-width: 1px;
}
.border-dashed {
  border-style: dashed;
}
.border-gray-100 {
  --tw-border-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-border-opacity, 1));
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
}
.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}
.border-indigo-200 {
  --tw-border-opacity: 1;
  border-color: rgb(199 210 254 / var(--tw-border-opacity, 1));
}
.border-indigo-300 {
  --tw-border-opacity: 1;
  border-color: rgb(165 180 252 / var(--tw-border-opacity, 1));
}
.border-indigo-500 {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity, 1));
}
.border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.bg-amber-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));
}
.bg-black\\/50 {
  background-color: rgb(0 0 0 / 0.5);
}
.bg-blue-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-gray-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
}
.bg-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
}
.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.bg-gray-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(107 114 128 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-indigo-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));
}
.bg-indigo-50\\/30 {
  background-color: rgb(238 242 255 / 0.3);
}
.bg-indigo-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity, 1));
}
.bg-indigo-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity, 1));
}
.bg-purple-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 232 255 / var(--tw-bg-opacity, 1));
}
.bg-purple-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));
}
.bg-red-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}
.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-50\\/40 {
  background-color: rgb(254 242 242 / 0.4);
}
.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.bg-yellow-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.object-cover {
  -o-object-fit: cover;
     object-fit: cover;
}
.p-2 {
  padding: 0.5rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-8 {
  padding: 2rem;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.pt-2 {
  padding-top: 0.5rem;
}
.pt-3 {
  padding-top: 0.75rem;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold {
  font-weight: 700;
}
.font-medium {
  font-weight: 500;
}
.font-normal {
  font-weight: 400;
}
.font-semibold {
  font-weight: 600;
}
.uppercase {
  text-transform: uppercase;
}
.capitalize {
  text-transform: capitalize;
}
.italic {
  font-style: italic;
}
.text-amber-600 {
  --tw-text-opacity: 1;
  color: rgb(217 119 6 / var(--tw-text-opacity, 1));
}
.text-amber-700 {
  --tw-text-opacity: 1;
  color: rgb(180 83 9 / var(--tw-text-opacity, 1));
}
.text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}
.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-gray-800 {
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity, 1));
}
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}
.text-green-700 {
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-indigo-500 {
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity, 1));
}
.text-indigo-600 {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity, 1));
}
.text-purple-700 {
  --tw-text-opacity: 1;
  color: rgb(126 34 206 / var(--tw-text-opacity, 1));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-700 {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-yellow-700 {
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.underline {
  text-decoration-line: underline;
}
.accent-indigo-600 {
  accent-color: #4f46e5;
}
.opacity-25 {
  opacity: 0.25;
}
.opacity-75 {
  opacity: 0.75;
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* =========================================================================
   OmniChat Visitor — Embeddable Custom Element + Standalone Page styles
   ========================================================================= */

:host {
  display: block;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: fixed;
  inset: 0;
  z-index: 999999;
}

.panel-wrapper {
  position: fixed;
  height: 100vh; /* Fallback for browsers without dvh support */
  height: 100dvh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.panel-header {
  padding: 20px;
  padding-top: max(20px, env(safe-area-inset-top, 0px));
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.panel-header .close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #ffffff;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background 0.2s, transform 0.2s;
}

.panel-header .close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

/* Welcome screen */
.welcome-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(248,250,252,0.6) 100%);
}

.welcome-screen p {
  color: #475569;
  font-size: 15px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.start-chat-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 9999px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.start-chat-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

/* Messages */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg-row {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  width: 100%;
}
.msg-row.visitor {
  flex-direction: row-reverse;
}
.msg-row.system {
  justify-content: center;
}

.msg-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  overflow: hidden;
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
  background: #f1f5f9;
}
.msg-avatar img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
     object-fit: cover;
}

.msg-bubble {
  max-width: 82%;
  padding: 10px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
  position: relative;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg-bubble.visitor {
  align-self: flex-end;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.msg-bubble.agent {
  align-self: flex-start;
  background: #f8fafc;
  color: #334155;
  border-bottom-left-radius: 4px;
  border: 1px solid #e2e8f0;
}

.msg-bubble.system {
  align-self: center;
  background: transparent !important;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  margin: 12px 0;
  text-align: center;
  max-width: 100%;
  box-shadow: none;
}

.msg-time {
  font-size: 10px;
  color: inherit;
  opacity: 0.7;
  margin-top: 4px;
}

.typing-hint {
  font-size: 13px;
  color: #64748b;
  padding: 8px 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}
.typing-hint::after {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background-image: radial-gradient(circle, currentColor 2px, transparent 2px);
  background-size: 12px 12px;
  animation: dots 1.5s infinite steps(4, end);
}
@keyframes dots { 0% { width: 0; } 100% { width: 18px; } }

/* Input */
.input-area {
  position: relative;
  padding: 16px 20px;
  padding-bottom: max(16px, env(safe-area-inset-bottom, 0px));
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.msg-input {
  flex: 1;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap;
  display: block;
}

.msg-input:focus {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.03);
}

.send-msg-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 20px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-msg-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.send-msg-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Resolved banner */
.resolved-banner {
  padding: 24px;
  text-align: center;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
}

/* Form */
.pre-chat-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 320px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  color: #334155;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.form-input:focus {
  outline: none;
  background: #ffffff;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 11px;
  color: inherit;
  opacity: 0.8;
  justify-content: flex-end;
}

.star-rating {
  font-size: 28px;
  cursor: pointer;
  color: #e2e8f0;
  display: flex;
  gap: 4px;
}

.star-rating span {
  transition: color 0.2s, transform 0.1s;
}

.star-rating span.active, .star-rating span:hover {
  color: #f59e0b;
  transform: scale(1.1);
}

.submit-review-btn {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.review-thank-you {
  margin: 20px 0;
  color: #10B981;
  font-weight: 600;
  font-size: 15px;
}

.start-new-chat-btn {
  background: transparent;
  border: 2px solid #4F46E5;
  color: #4F46E5;
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s, color 0.2s;
}
.start-new-chat-btn:hover {
  background: #4F46E5;
  color: #ffffff;
}

.end-chat-btn {
  background: #f1f5f9;
  border: none;
  color: #64748b;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.end-chat-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

.confirm-action-area {
  padding: 16px 20px;
  padding-bottom: max(16px, env(safe-area-inset-bottom, 0px));
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fef2f2;
  flex-shrink: 0;
}

.confirm-text {
  font-size: 14px;
  color: #b91c1c;
  font-weight: 600;
}

.confirm-buttons {
  display: flex;
  gap: 8px;
}

.confirm-cancel-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #47569;
  transition: background 0.2s;
}
.confirm-cancel-btn:hover { background: #f8fafc; }

.confirm-yes-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: #ef4444;
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
}
.confirm-yes-btn:hover { background: #dc2626; }

/* Drag & Drop Overlay */
.drag-overlay {
  position: absolute;
  top: 73px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed #4f46e5;
  animation: fadeIn 0.2s ease-out;
  pointer-events: none;
}

.drag-overlay-content {
  text-align: center;
  color: #4f46e5;
  font-weight: 600;
  font-size: 16px;
  pointer-events: none;
}

/* AI styles */
.msg-bubble.ai {
  align-self: flex-start;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  color: #334155;
  border-bottom-left-radius: 4px;
  border: 1px solid #c7d2fe;
}

.ai-label {
  font-size: 10px;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.ai-streaming .ai-cursor {
  animation: blink 0.8s infinite;
  color: #6366f1;
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Markdown content */
.md-content {
  line-height: 1.5;
  word-break: break-word;
}
.md-content p {
  margin: 0 0 8px 0;
}
.md-content p:last-child {
  margin-bottom: 0;
}
.md-content code {
  background: rgba(0, 0, 0, 0.08);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}
.md-content pre {
  background: rgba(0, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 0.85em;
}
.md-content pre code {
  background: none;
  padding: 0;
}
.md-content ul, .md-content ol {
  margin: 4px 0;
  padding-left: 20px;
}
.md-content li {
  margin: 2px 0;
}
.md-content blockquote {
  margin: 8px 0;
  padding: 4px 12px;
  border-left: 3px solid rgba(0, 0, 0, 0.2);
  color: inherit;
  opacity: 0.85;
}
.md-content a {
  color: #4f46e5;
  text-decoration: underline;
}
.md-content h1, .md-content h2, .md-content h3,
.md-content h4, .md-content h5, .md-content h6 {
  margin: 8px 0 4px 0;
  font-weight: 600;
  line-height: 1.3;
}
.md-content h1 { font-size: 1.3em; }
.md-content h2 { font-size: 1.2em; }
.md-content h3 { font-size: 1.1em; }
.md-content table {
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 0.9em;
}
.md-content th, .md-content td {
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 4px 8px;
}
.md-content th {
  background: rgba(0, 0, 0, 0.04);
  font-weight: 600;
}
.md-content hr {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  margin: 8px 0;
}

/* Mobile */
@media (max-width: 640px) {
  .panel-wrapper {
    border-radius: 12px;
  }

  .welcome-screen {
    padding: 24px 18px;
    justify-content: flex-start;
    overflow-y: auto;
  }

  .panel-header,
  .messages-area,
  .input-area,
  .confirm-action-area {
    padding-left: 16px;
    padding-right: 16px;
  }

  .input-area {
    gap: 8px;
    align-items: flex-end;
  }

  .msg-input {
    min-height: 42px;
  }
}
.after\\:absolute::after {
  content: var(--tw-content);
  position: absolute;
}
.after\\:left-0\\.5::after {
  content: var(--tw-content);
  left: 0.125rem;
}
.after\\:left-\\[2px\\]::after {
  content: var(--tw-content);
  left: 2px;
}
.after\\:top-0\\.5::after {
  content: var(--tw-content);
  top: 0.125rem;
}
.after\\:top-\\[2px\\]::after {
  content: var(--tw-content);
  top: 2px;
}
.after\\:h-4::after {
  content: var(--tw-content);
  height: 1rem;
}
.after\\:h-5::after {
  content: var(--tw-content);
  height: 1.25rem;
}
.after\\:w-4::after {
  content: var(--tw-content);
  width: 1rem;
}
.after\\:w-5::after {
  content: var(--tw-content);
  width: 1.25rem;
}
.after\\:rounded-full::after {
  content: var(--tw-content);
  border-radius: 9999px;
}
.after\\:bg-white::after {
  content: var(--tw-content);
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.after\\:transition-all::after {
  content: var(--tw-content);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.after\\:transition-transform::after {
  content: var(--tw-content);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.after\\:content-\\[\\'\\'\\]::after {
  --tw-content: '';
  content: var(--tw-content);
}
.hover\\:border-gray-400:hover {
  --tw-border-opacity: 1;
  border-color: rgb(156 163 175 / var(--tw-border-opacity, 1));
}
.hover\\:bg-gray-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-gray-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-green-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-indigo-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(224 231 255 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-indigo-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-indigo-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(67 56 202 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-red-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-red-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.hover\\:bg-yellow-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
}
.hover\\:text-gray-700:hover {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.hover\\:text-indigo-700:hover {
  --tw-text-opacity: 1;
  color: rgb(67 56 202 / var(--tw-text-opacity, 1));
}
.hover\\:text-indigo-800:hover {
  --tw-text-opacity: 1;
  color: rgb(55 48 163 / var(--tw-text-opacity, 1));
}
.hover\\:text-red-700:hover {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}
.hover\\:opacity-80:hover {
  opacity: 0.8;
}
.focus\\:border-indigo-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity, 1));
}
.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.focus\\:ring-indigo-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(99 102 241 / var(--tw-ring-opacity, 1));
}
.focus\\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}
.disabled\\:opacity-40:disabled {
  opacity: 0.4;
}
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}
.peer:checked ~ .peer-checked\\:bg-indigo-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity, 1));
}
.peer:checked ~ .peer-checked\\:after\\:translate-x-4::after {
  content: var(--tw-content);
  --tw-translate-x: 1rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.peer:checked ~ .peer-checked\\:after\\:translate-x-full::after {
  content: var(--tw-content);
  --tw-translate-x: 100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.peer:focus ~ .peer-focus\\:ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.peer:focus ~ .peer-focus\\:ring-4 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.peer:focus ~ .peer-focus\\:ring-indigo-300 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(165 180 252 / var(--tw-ring-opacity, 1));
}
@media (min-width: 640px) {

  .sm\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`]});return customElements.define("omnichat-chat-page",mc),Kt.OmniChatChatPage=mc,Object.defineProperty(Kt,Symbol.toStringTag,{value:"Module"}),Kt})({});
