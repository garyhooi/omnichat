var OmniChatChatPage=function(qt){"use strict";var Ad=Object.defineProperty;var Rd=(qt,bt,te)=>bt in qt?Ad(qt,bt,{enumerable:!0,configurable:!0,writable:!0,value:te}):qt[bt]=te;var fe=(qt,bt,te)=>Rd(qt,typeof bt!="symbol"?bt+"":bt,te);/**
* @vue/shared v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/var hs;function bt(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const te={},Tn=[],At=()=>{},Ki=()=>!1,wr=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),xr=t=>t.startsWith("onUpdate:"),ke=Object.assign,ms=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Wl=Object.prototype.hasOwnProperty,ie=(t,e)=>Wl.call(t,e),$=Array.isArray,Sn=t=>Un(t)==="[object Map]",Gi=t=>Un(t)==="[object Set]",Yi=t=>Un(t)==="[object Date]",U=t=>typeof t=="function",we=t=>typeof t=="string",Rt=t=>typeof t=="symbol",ce=t=>t!==null&&typeof t=="object",Xi=t=>(ce(t)||U(t))&&U(t.then)&&U(t.catch),Zi=Object.prototype.toString,Un=t=>Zi.call(t),Kl=t=>Un(t).slice(8,-1),vr=t=>Un(t)==="[object Object]",bs=t=>we(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,Hn=bt(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),_r=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},Gl=/-\w/g,Ze=_r(t=>t.replace(Gl,e=>e.slice(1).toUpperCase())),Yl=/\B([A-Z])/g,nt=_r(t=>t.replace(Yl,"-$1").toLowerCase()),Ji=_r(t=>t.charAt(0).toUpperCase()+t.slice(1)),ys=_r(t=>t?`on${Ji(t)}`:""),Ct=(t,e)=>!Object.is(t,e),kr=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},Qi=(t,e,n,r=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:r,value:n})},ws=t=>{const e=parseFloat(t);return isNaN(e)?t:e},eo=t=>{const e=we(t)?Number(t):NaN;return isNaN(e)?t:e};let to;const Tr=()=>to||(to=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function yt(t){if($(t)){const e={};for(let n=0;n<t.length;n++){const r=t[n],s=we(r)?Ql(r):yt(r);if(s)for(const i in s)e[i]=s[i]}return e}else if(we(t)||ce(t))return t}const Xl=/;(?![^(]*\))/g,Zl=/:([^]+)/,Jl=/\/\*[^]*?\*\//g;function Ql(t){const e={};return t.replace(Jl,"").split(Xl).forEach(n=>{if(n){const r=n.split(Zl);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}function hn(t){let e="";if(we(t))e=t;else if($(t))for(let n=0;n<t.length;n++){const r=hn(t[n]);r&&(e+=r+" ")}else if(ce(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const ec=bt("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function no(t){return!!t||t===""}function tc(t,e){if(t.length!==e.length)return!1;let n=!0;for(let r=0;n&&r<t.length;r++)n=xs(t[r],e[r]);return n}function xs(t,e){if(t===e)return!0;let n=Yi(t),r=Yi(e);if(n||r)return n&&r?t.getTime()===e.getTime():!1;if(n=Rt(t),r=Rt(e),n||r)return t===e;if(n=$(t),r=$(e),n||r)return n&&r?tc(t,e):!1;if(n=ce(t),r=ce(e),n||r){if(!n||!r)return!1;const s=Object.keys(t).length,i=Object.keys(e).length;if(s!==i)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!xs(t[o],e[o]))return!1}}return String(t)===String(e)}const ro=t=>!!(t&&t.__v_isRef===!0),Oe=t=>we(t)?t:t==null?"":$(t)||ce(t)&&(t.toString===Zi||!U(t.toString))?ro(t)?Oe(t.value):JSON.stringify(t,so,2):String(t),so=(t,e)=>ro(e)?so(t,e.value):Sn(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[r,s],i)=>(n[vs(r,i)+" =>"]=s,n),{})}:Gi(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>vs(n))}:Rt(e)?vs(e):ce(e)&&!$(e)&&!vr(e)?String(e):e,vs=(t,e="")=>{var n;return Rt(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Je;class nc{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=Je,!e&&Je&&(this.index=(Je.scopes||(Je.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=Je;try{return Je=this,e()}finally{Je=n}}}on(){++this._on===1&&(this.prevScope=Je,Je=this)}off(){this._on>0&&--this._on===0&&(Je=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function rc(){return Je}let he;const _s=new WeakSet;class io{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Je&&Je.active&&Je.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,_s.has(this)&&(_s.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||ao(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,ho(this),lo(this);const e=he,n=wt;he=this,wt=!0;try{return this.fn()}finally{co(this),he=e,wt=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Es(e);this.deps=this.depsTail=void 0,ho(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?_s.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Ss(this)&&this.run()}get dirty(){return Ss(this)}}let oo=0,jn,qn;function ao(t,e=!1){if(t.flags|=8,e){t.next=qn,qn=t;return}t.next=jn,jn=t}function ks(){oo++}function Ts(){if(--oo>0)return;if(qn){let e=qn;for(qn=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;jn;){let e=jn;for(jn=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(r){t||(t=r)}e=n}}if(t)throw t}function lo(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function co(t){let e,n=t.depsTail,r=n;for(;r;){const s=r.prevDep;r.version===-1?(r===n&&(n=s),Es(r),sc(r)):e=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}t.deps=e,t.depsTail=n}function Ss(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(uo(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function uo(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===Vn)||(t.globalVersion=Vn,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!Ss(t))))return;t.flags|=2;const e=t.dep,n=he,r=wt;he=t,wt=!0;try{lo(t);const s=t.fn(t._value);(e.version===0||Ct(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{he=n,wt=r,co(t),t.flags&=-3}}function Es(t,e=!1){const{dep:n,prevSub:r,nextSub:s}=t;if(r&&(r.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=r,t.nextSub=void 0),n.subs===t&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)Es(i,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function sc(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let wt=!0;const fo=[];function Ot(){fo.push(wt),wt=!1}function It(){const t=fo.pop();wt=t===void 0?!0:t}function ho(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=he;he=void 0;try{e()}finally{he=n}}}let Vn=0;class ic{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class As{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!he||!wt||he===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==he)n=this.activeLink=new ic(he,this),he.deps?(n.prevDep=he.depsTail,he.depsTail.nextDep=n,he.depsTail=n):he.deps=he.depsTail=n,po(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=he.depsTail,n.nextDep=void 0,he.depsTail.nextDep=n,he.depsTail=n,he.deps===n&&(he.deps=r)}return n}trigger(e){this.version++,Vn++,this.notify(e)}notify(e){ks();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Ts()}}}function po(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let r=e.deps;r;r=r.nextDep)po(r)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const Rs=new WeakMap,pn=Symbol(""),Cs=Symbol(""),Wn=Symbol("");function De(t,e,n){if(wt&&he){let r=Rs.get(t);r||Rs.set(t,r=new Map);let s=r.get(n);s||(r.set(n,s=new As),s.map=r,s.key=n),s.track()}}function Vt(t,e,n,r,s,i){const o=Rs.get(t);if(!o){Vn++;return}const a=l=>{l&&l.trigger()};if(ks(),e==="clear")o.forEach(a);else{const l=$(t),c=l&&bs(n);if(l&&n==="length"){const u=Number(r);o.forEach((d,x)=>{(x==="length"||x===Wn||!Rt(x)&&x>=u)&&a(d)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(Wn)),e){case"add":l?c&&a(o.get("length")):(a(o.get(pn)),Sn(t)&&a(o.get(Cs)));break;case"delete":l||(a(o.get(pn)),Sn(t)&&a(o.get(Cs)));break;case"set":Sn(t)&&a(o.get(pn));break}}Ts()}function En(t){const e=ne(t);return e===t?e:(De(e,"iterate",Wn),ut(t)?e:e.map(xt))}function Sr(t){return De(t=ne(t),"iterate",Wn),t}function Lt(t,e){return Kt(t)?An(dn(t)?xt(e):e):xt(e)}const oc={__proto__:null,[Symbol.iterator](){return Os(this,Symbol.iterator,t=>Lt(this,t))},concat(...t){return En(this).concat(...t.map(e=>$(e)?En(e):e))},entries(){return Os(this,"entries",t=>(t[1]=Lt(this,t[1]),t))},every(t,e){return Wt(this,"every",t,e,void 0,arguments)},filter(t,e){return Wt(this,"filter",t,e,n=>n.map(r=>Lt(this,r)),arguments)},find(t,e){return Wt(this,"find",t,e,n=>Lt(this,n),arguments)},findIndex(t,e){return Wt(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Wt(this,"findLast",t,e,n=>Lt(this,n),arguments)},findLastIndex(t,e){return Wt(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Wt(this,"forEach",t,e,void 0,arguments)},includes(...t){return Is(this,"includes",t)},indexOf(...t){return Is(this,"indexOf",t)},join(t){return En(this).join(t)},lastIndexOf(...t){return Is(this,"lastIndexOf",t)},map(t,e){return Wt(this,"map",t,e,void 0,arguments)},pop(){return Kn(this,"pop")},push(...t){return Kn(this,"push",t)},reduce(t,...e){return go(this,"reduce",t,e)},reduceRight(t,...e){return go(this,"reduceRight",t,e)},shift(){return Kn(this,"shift")},some(t,e){return Wt(this,"some",t,e,void 0,arguments)},splice(...t){return Kn(this,"splice",t)},toReversed(){return En(this).toReversed()},toSorted(t){return En(this).toSorted(t)},toSpliced(...t){return En(this).toSpliced(...t)},unshift(...t){return Kn(this,"unshift",t)},values(){return Os(this,"values",t=>Lt(this,t))}};function Os(t,e,n){const r=Sr(t),s=r[e]();return r!==t&&!ut(t)&&(s._next=s.next,s.next=()=>{const i=s._next();return i.done||(i.value=n(i.value)),i}),s}const ac=Array.prototype;function Wt(t,e,n,r,s,i){const o=Sr(t),a=o!==t&&!ut(t),l=o[e];if(l!==ac[e]){const d=l.apply(t,i);return a?xt(d):d}let c=n;o!==t&&(a?c=function(d,x){return n.call(this,Lt(t,d),x,t)}:n.length>2&&(c=function(d,x){return n.call(this,d,x,t)}));const u=l.call(o,c,r);return a&&s?s(u):u}function go(t,e,n,r){const s=Sr(t),i=s!==t&&!ut(t);let o=n,a=!1;s!==t&&(i?(a=r.length===0,o=function(c,u,d){return a&&(a=!1,c=Lt(t,c)),n.call(this,c,Lt(t,u),d,t)}):n.length>3&&(o=function(c,u,d){return n.call(this,c,u,d,t)}));const l=s[e](o,...r);return a?Lt(t,l):l}function Is(t,e,n){const r=ne(t);De(r,"iterate",Wn);const s=r[e](...n);return(s===-1||s===!1)&&Ms(n[0])?(n[0]=ne(n[0]),r[e](...n)):s}function Kn(t,e,n=[]){Ot(),ks();const r=ne(t)[e].apply(t,n);return Ts(),It(),r}const lc=bt("__proto__,__v_isRef,__isVue"),mo=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Rt));function cc(t){Rt(t)||(t=String(t));const e=ne(this);return De(e,"has",t),e.hasOwnProperty(t)}class bo{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,r){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(s?i?ko:_o:i?vo:xo).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(r)?e:void 0;const o=$(e);if(!s){let l;if(o&&(l=oc[n]))return l;if(n==="hasOwnProperty")return cc}const a=Reflect.get(e,n,Ie(e)?e:r);if((Rt(n)?mo.has(n):lc(n))||(s||De(e,"get",n),i))return a;if(Ie(a)){const l=o&&bs(n)?a:a.value;return s&&ce(l)?Ns(l):l}return ce(a)?s?Ns(a):Ps(a):a}}class yo extends bo{constructor(e=!1){super(!1,e)}set(e,n,r,s){let i=e[n];const o=$(e)&&bs(n);if(!this._isShallow){const c=Kt(i);if(!ut(r)&&!Kt(r)&&(i=ne(i),r=ne(r)),!o&&Ie(i)&&!Ie(r))return c||(i.value=r),!0}const a=o?Number(n)<e.length:ie(e,n),l=Reflect.set(e,n,r,Ie(e)?e:s);return e===ne(s)&&(a?Ct(r,i)&&Vt(e,"set",n,r):Vt(e,"add",n,r)),l}deleteProperty(e,n){const r=ie(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&r&&Vt(e,"delete",n,void 0),s}has(e,n){const r=Reflect.has(e,n);return(!Rt(n)||!mo.has(n))&&De(e,"has",n),r}ownKeys(e){return De(e,"iterate",$(e)?"length":pn),Reflect.ownKeys(e)}}class wo extends bo{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const uc=new yo,fc=new wo,hc=new yo(!0),pc=new wo(!0),Ls=t=>t,Er=t=>Reflect.getPrototypeOf(t);function dc(t,e,n){return function(...r){const s=this.__v_raw,i=ne(s),o=Sn(i),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=s[t](...r),u=n?Ls:e?An:xt;return!e&&De(i,"iterate",l?Cs:pn),ke(Object.create(c),{next(){const{value:d,done:x}=c.next();return x?{value:d,done:x}:{value:a?[u(d[0]),u(d[1])]:u(d),done:x}}})}}function Ar(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function gc(t,e){const n={get(s){const i=this.__v_raw,o=ne(i),a=ne(s);t||(Ct(s,a)&&De(o,"get",s),De(o,"get",a));const{has:l}=Er(o),c=e?Ls:t?An:xt;if(l.call(o,s))return c(i.get(s));if(l.call(o,a))return c(i.get(a));i!==o&&i.get(s)},get size(){const s=this.__v_raw;return!t&&De(ne(s),"iterate",pn),s.size},has(s){const i=this.__v_raw,o=ne(i),a=ne(s);return t||(Ct(s,a)&&De(o,"has",s),De(o,"has",a)),s===a?i.has(s):i.has(s)||i.has(a)},forEach(s,i){const o=this,a=o.__v_raw,l=ne(a),c=e?Ls:t?An:xt;return!t&&De(l,"iterate",pn),a.forEach((u,d)=>s.call(i,c(u),c(d),o))}};return ke(n,t?{add:Ar("add"),set:Ar("set"),delete:Ar("delete"),clear:Ar("clear")}:{add(s){const i=ne(this),o=Er(i),a=ne(s),l=!e&&!ut(s)&&!Kt(s)?a:s;return o.has.call(i,l)||Ct(s,l)&&o.has.call(i,s)||Ct(a,l)&&o.has.call(i,a)||(i.add(l),Vt(i,"add",l,l)),this},set(s,i){!e&&!ut(i)&&!Kt(i)&&(i=ne(i));const o=ne(this),{has:a,get:l}=Er(o);let c=a.call(o,s);c||(s=ne(s),c=a.call(o,s));const u=l.call(o,s);return o.set(s,i),c?Ct(i,u)&&Vt(o,"set",s,i):Vt(o,"add",s,i),this},delete(s){const i=ne(this),{has:o,get:a}=Er(i);let l=o.call(i,s);l||(s=ne(s),l=o.call(i,s)),a&&a.call(i,s);const c=i.delete(s);return l&&Vt(i,"delete",s,void 0),c},clear(){const s=ne(this),i=s.size!==0,o=s.clear();return i&&Vt(s,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=dc(s,t,e)}),n}function Rr(t,e){const n=gc(t,e);return(r,s,i)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?r:Reflect.get(ie(n,s)&&s in r?n:r,s,i)}const mc={get:Rr(!1,!1)},bc={get:Rr(!1,!0)},yc={get:Rr(!0,!1)},wc={get:Rr(!0,!0)},xo=new WeakMap,vo=new WeakMap,_o=new WeakMap,ko=new WeakMap;function xc(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function vc(t){return t.__v_skip||!Object.isExtensible(t)?0:xc(Kl(t))}function Ps(t){return Kt(t)?t:Cr(t,!1,uc,mc,xo)}function _c(t){return Cr(t,!1,hc,bc,vo)}function Ns(t){return Cr(t,!0,fc,yc,_o)}function Od(t){return Cr(t,!0,pc,wc,ko)}function Cr(t,e,n,r,s){if(!ce(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const i=vc(t);if(i===0)return t;const o=s.get(t);if(o)return o;const a=new Proxy(t,i===2?r:n);return s.set(t,a),a}function dn(t){return Kt(t)?dn(t.__v_raw):!!(t&&t.__v_isReactive)}function Kt(t){return!!(t&&t.__v_isReadonly)}function ut(t){return!!(t&&t.__v_isShallow)}function Ms(t){return t?!!t.__v_raw:!1}function ne(t){const e=t&&t.__v_raw;return e?ne(e):t}function kc(t){return!ie(t,"__v_skip")&&Object.isExtensible(t)&&Qi(t,"__v_skip",!0),t}const xt=t=>ce(t)?Ps(t):t,An=t=>ce(t)?Ns(t):t;function Ie(t){return t?t.__v_isRef===!0:!1}function H(t){return Tc(t,!1)}function Tc(t,e){return Ie(t)?t:new Sc(t,e)}class Sc{constructor(e,n){this.dep=new As,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:ne(e),this._value=n?e:xt(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,r=this.__v_isShallow||ut(e)||Kt(e);e=r?e:ne(e),Ct(e,n)&&(this._rawValue=e,this._value=r?e:xt(e),this.dep.trigger())}}function gn(t){return Ie(t)?t.value:t}const Ec={get:(t,e,n)=>e==="__v_raw"?t:gn(Reflect.get(t,e,n)),set:(t,e,n,r)=>{const s=t[e];return Ie(s)&&!Ie(n)?(s.value=n,!0):Reflect.set(t,e,n,r)}};function To(t){return dn(t)?t:new Proxy(t,Ec)}class Ac{constructor(e,n,r){this.fn=e,this.setter=n,this._value=void 0,this.dep=new As(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Vn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&he!==this)return ao(this,!0),!0}get value(){const e=this.dep.track();return uo(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function Rc(t,e,n=!1){let r,s;return U(t)?r=t:(r=t.get,s=t.set),new Ac(r,s,n)}const Or={},Ir=new WeakMap;let mn;function Cc(t,e=!1,n=mn){if(n){let r=Ir.get(n);r||Ir.set(n,r=[]),r.push(t)}}function Oc(t,e,n=te){const{immediate:r,deep:s,once:i,scheduler:o,augmentJob:a,call:l}=n,c=O=>s?O:ut(O)||s===!1||s===0?Gt(O,1):Gt(O);let u,d,x,T,L=!1,M=!1;if(Ie(t)?(d=()=>t.value,L=ut(t)):dn(t)?(d=()=>c(t),L=!0):$(t)?(M=!0,L=t.some(O=>dn(O)||ut(O)),d=()=>t.map(O=>{if(Ie(O))return O.value;if(dn(O))return c(O);if(U(O))return l?l(O,2):O()})):U(t)?e?d=l?()=>l(t,2):t:d=()=>{if(x){Ot();try{x()}finally{It()}}const O=mn;mn=u;try{return l?l(t,3,[T]):t(T)}finally{mn=O}}:d=At,e&&s){const O=d,re=s===!0?1/0:s;d=()=>Gt(O(),re)}const ue=rc(),ee=()=>{u.stop(),ue&&ue.active&&ms(ue.effects,u)};if(i&&e){const O=e;e=(...re)=>{O(...re),ee()}}let j=M?new Array(t.length).fill(Or):Or;const Q=O=>{if(!(!(u.flags&1)||!u.dirty&&!O))if(e){const re=u.run();if(s||L||(M?re.some((Te,We)=>Ct(Te,j[We])):Ct(re,j))){x&&x();const Te=mn;mn=u;try{const We=[re,j===Or?void 0:M&&j[0]===Or?[]:j,T];j=re,l?l(e,3,We):e(...We)}finally{mn=Te}}}else u.run()};return a&&a(Q),u=new io(d),u.scheduler=o?()=>o(Q,!1):Q,T=O=>Cc(O,!1,u),x=u.onStop=()=>{const O=Ir.get(u);if(O){if(l)l(O,4);else for(const re of O)re();Ir.delete(u)}},e?r?Q(!0):j=u.run():o?o(Q.bind(null,!0),!0):u.run(),ee.pause=u.pause.bind(u),ee.resume=u.resume.bind(u),ee.stop=ee,ee}function Gt(t,e=1/0,n){if(e<=0||!ce(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,Ie(t))Gt(t.value,e,n);else if($(t))for(let r=0;r<t.length;r++)Gt(t[r],e,n);else if(Gi(t)||Sn(t))t.forEach(r=>{Gt(r,e,n)});else if(vr(t)){for(const r in t)Gt(t[r],e,n);for(const r of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,r)&&Gt(t[r],e,n)}return t}/**
* @vue/runtime-core v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const Gn=[];let Ds=!1;function Id(t,...e){if(Ds)return;Ds=!0,Ot();const n=Gn.length?Gn[Gn.length-1].component:null,r=n&&n.appContext.config.warnHandler,s=Ic();if(r)Rn(r,n,11,[t+e.map(i=>{var o,a;return(a=(o=i.toString)==null?void 0:o.call(i))!=null?a:JSON.stringify(i)}).join(""),n&&n.proxy,s.map(({vnode:i})=>`at <${xa(n,i.type)}>`).join(`
`),s]);else{const i=[`[Vue warn]: ${t}`,...e];s.length&&i.push(`
`,...Lc(s)),console.warn(...i)}It(),Ds=!1}function Ic(){let t=Gn[Gn.length-1];if(!t)return[];const e=[];for(;t;){const n=e[0];n&&n.vnode===t?n.recurseCount++:e.push({vnode:t,recurseCount:0});const r=t.component&&t.component.parent;t=r&&r.vnode}return e}function Lc(t){const e=[];return t.forEach((n,r)=>{e.push(...r===0?[]:[`
`],...Pc(n))}),e}function Pc({vnode:t,recurseCount:e}){const n=e>0?`... (${e} recursive calls)`:"",r=t.component?t.component.parent==null:!1,s=` at <${xa(t.component,t.type,r)}`,i=">"+n;return t.props?[s,...Nc(t.props),i]:[s+i]}function Nc(t){const e=[],n=Object.keys(t);return n.slice(0,3).forEach(r=>{e.push(...So(r,t[r]))}),n.length>3&&e.push(" ..."),e}function So(t,e,n){return we(e)?(e=JSON.stringify(e),n?e:[`${t}=${e}`]):typeof e=="number"||typeof e=="boolean"||e==null?n?e:[`${t}=${e}`]:Ie(e)?(e=So(t,ne(e.value),!0),n?e:[`${t}=Ref<`,e,">"]):U(e)?[`${t}=fn${e.name?`<${e.name}>`:""}`]:(e=ne(e),n?e:[`${t}=`,e])}function Rn(t,e,n,r){try{return r?t(...r):t()}catch(s){Lr(s,e,n)}}function Pt(t,e,n,r){if(U(t)){const s=Rn(t,e,n,r);return s&&Xi(s)&&s.catch(i=>{Lr(i,e,n)}),s}if($(t)){const s=[];for(let i=0;i<t.length;i++)s.push(Pt(t[i],e,n,r));return s}}function Lr(t,e,n,r=!0){const s=e?e.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||te;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const u=a.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](t,l,c)===!1)return}a=a.parent}if(i){Ot(),Rn(i,null,10,[t,l,c]),It();return}}Mc(t,n,s,r,o)}function Mc(t,e,n,r=!0,s=!1){if(s)throw t;console.error(t)}const $e=[];let Nt=-1;const Cn=[];let rn=null,On=0;const Eo=Promise.resolve();let Pr=null;function Yn(t){const e=Pr||Eo;return t?e.then(this?t.bind(this):t):e}function Dc(t){let e=Nt+1,n=$e.length;for(;e<n;){const r=e+n>>>1,s=$e[r],i=Xn(s);i<t||i===t&&s.flags&2?e=r+1:n=r}return e}function zs(t){if(!(t.flags&1)){const e=Xn(t),n=$e[$e.length-1];!n||!(t.flags&2)&&e>=Xn(n)?$e.push(t):$e.splice(Dc(e),0,t),t.flags|=1,Ao()}}function Ao(){Pr||(Pr=Eo.then(Oo))}function zc(t){$(t)?Cn.push(...t):rn&&t.id===-1?rn.splice(On+1,0,t):t.flags&1||(Cn.push(t),t.flags|=1),Ao()}function Ro(t,e,n=Nt+1){for(;n<$e.length;n++){const r=$e[n];if(r&&r.flags&2){if(t&&r.id!==t.uid)continue;$e.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Co(t){if(Cn.length){const e=[...new Set(Cn)].sort((n,r)=>Xn(n)-Xn(r));if(Cn.length=0,rn){rn.push(...e);return}for(rn=e,On=0;On<rn.length;On++){const n=rn[On];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}rn=null,On=0}}const Xn=t=>t.id==null?t.flags&2?-1:1/0:t.id;function Oo(t){try{for(Nt=0;Nt<$e.length;Nt++){const e=$e[Nt];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Rn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Nt<$e.length;Nt++){const e=$e[Nt];e&&(e.flags&=-2)}Nt=-1,$e.length=0,Co(),Pr=null,($e.length||Cn.length)&&Oo()}}let ft=null,Io=null;function Nr(t){const e=ft;return ft=t,Io=t&&t.type.__scopeId||null,e}function Bc(t,e=ft,n){if(!e||t._n)return t;const r=(...s)=>{r._d&&ha(-1);const i=Nr(e);let o;try{o=t(...s)}finally{Nr(i),r._d&&ha(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function Mr(t,e){if(ft===null)return t;const n=Wr(ft),r=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[i,o,a,l=te]=e[s];i&&(U(i)&&(i={mounted:i,updated:i}),i.deep&&Gt(o),r.push({dir:i,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function bn(t,e,n,r){const s=t.dirs,i=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];i&&(a.oldValue=i[o].value);let l=a.dir[r];l&&(Ot(),Pt(l,n,8,[t.el,a,t,e]),It())}}function Fc(t,e){if(He){let n=He.provides;const r=He.parent&&He.parent.provides;r===n&&(n=He.provides=Object.create(r)),n[t]=e}}function Dr(t,e,n=!1){const r=Bu();if(r||In){let s=In?In._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&U(e)?e.call(r&&r.proxy):e}}const $c=Symbol.for("v-scx"),Uc=()=>Dr($c);function zr(t,e,n){return Lo(t,e,n)}function Lo(t,e,n=te){const{immediate:r,deep:s,flush:i,once:o}=n,a=ke({},n),l=e&&r||!e&&i!=="post";let c;if(ir){if(i==="sync"){const T=Uc();c=T.__watcherHandles||(T.__watcherHandles=[])}else if(!l){const T=()=>{};return T.stop=At,T.resume=At,T.pause=At,T}}const u=He;a.call=(T,L,M)=>Pt(T,u,L,M);let d=!1;i==="post"?a.scheduler=T=>{Qe(T,u&&u.suspense)}:i!=="sync"&&(d=!0,a.scheduler=(T,L)=>{L?T():zs(T)}),a.augmentJob=T=>{e&&(T.flags|=4),d&&(T.flags|=2,u&&(T.id=u.uid,T.i=u))};const x=Oc(t,e,a);return ir&&(c?c.push(x):l&&x()),x}function Hc(t,e,n){const r=this.proxy,s=we(t)?t.includes(".")?Po(r,t):()=>r[t]:t.bind(r,r);let i;U(e)?i=e:(i=e.handler,n=e);const o=sr(this),a=Lo(s,i.bind(r),n);return o(),a}function Po(t,e){const n=e.split(".");return()=>{let r=t;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}const jc=Symbol("_vte"),qc=t=>t.__isTeleport,Vc=Symbol("_leaveCb");function Bs(t,e){t.shapeFlag&6&&t.component?(t.transition=e,Bs(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function No(t,e){return U(t)?ke({name:t.name},e,{setup:t}):t}function Mo(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function Do(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const Br=new WeakMap;function Zn(t,e,n,r,s=!1){if($(t)){t.forEach((M,ue)=>Zn(M,e&&($(e)?e[ue]:e),n,r,s));return}if(Jn(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Zn(t,e,n,r.component.subTree);return}const i=r.shapeFlag&4?Wr(r.component):r.el,o=s?null:i,{i:a,r:l}=t,c=e&&e.r,u=a.refs===te?a.refs={}:a.refs,d=a.setupState,x=ne(d),T=d===te?Ki:M=>Do(u,M)?!1:ie(x,M),L=(M,ue)=>!(ue&&Do(u,ue));if(c!=null&&c!==l){if(zo(e),we(c))u[c]=null,T(c)&&(d[c]=null);else if(Ie(c)){const M=e;L(c,M.k)&&(c.value=null),M.k&&(u[M.k]=null)}}if(U(l))Rn(l,a,12,[o,u]);else{const M=we(l),ue=Ie(l);if(M||ue){const ee=()=>{if(t.f){const j=M?T(l)?d[l]:u[l]:L()||!t.k?l.value:u[t.k];if(s)$(j)&&ms(j,i);else if($(j))j.includes(i)||j.push(i);else if(M)u[l]=[i],T(l)&&(d[l]=u[l]);else{const Q=[i];L(l,t.k)&&(l.value=Q),t.k&&(u[t.k]=Q)}}else M?(u[l]=o,T(l)&&(d[l]=o)):ue&&(L(l,t.k)&&(l.value=o),t.k&&(u[t.k]=o))};if(o){const j=()=>{ee(),Br.delete(t)};j.id=-1,Br.set(t,j),Qe(j,n)}else zo(t),ee()}}}function zo(t){const e=Br.get(t);e&&(e.flags|=8,Br.delete(t))}Tr().requestIdleCallback,Tr().cancelIdleCallback;const Jn=t=>!!t.type.__asyncLoader,Bo=t=>t.type.__isKeepAlive;function Wc(t,e){Fo(t,"a",e)}function Kc(t,e){Fo(t,"da",e)}function Fo(t,e,n=He){const r=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(Fr(e,r,n),n){let s=n.parent;for(;s&&s.parent;)Bo(s.parent.vnode)&&Gc(r,e,n,s),s=s.parent}}function Gc(t,e,n,r){const s=Fr(e,t,r,!0);Fs(()=>{ms(r[e],s)},n)}function Fr(t,e,n=He,r=!1){if(n){const s=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{Ot();const a=sr(n),l=Pt(e,n,t,o);return a(),It(),l});return r?s.unshift(i):s.push(i),i}}const Yt=t=>(e,n=He)=>{(!ir||t==="sp")&&Fr(t,(...r)=>e(...r),n)},Yc=Yt("bm"),$o=Yt("m"),Xc=Yt("bu"),Zc=Yt("u"),Jc=Yt("bum"),Fs=Yt("um"),Qc=Yt("sp"),eu=Yt("rtg"),tu=Yt("rtc");function nu(t,e=He){Fr("ec",t,e)}const ru=Symbol.for("v-ndc");function $s(t,e,n,r){let s;const i=n,o=$(t);if(o||we(t)){const a=o&&dn(t);let l=!1,c=!1;a&&(l=!ut(t),c=Kt(t),t=Sr(t)),s=new Array(t.length);for(let u=0,d=t.length;u<d;u++)s[u]=e(l?c?An(xt(t[u])):xt(t[u]):t[u],u,void 0,i)}else if(typeof t=="number"){s=new Array(t);for(let a=0;a<t;a++)s[a]=e(a+1,a,void 0,i)}else if(ce(t))if(t[Symbol.iterator])s=Array.from(t,(a,l)=>e(a,l,void 0,i));else{const a=Object.keys(t);s=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];s[l]=e(t[u],u,l,i)}}else s=[];return s}const Us=t=>t?ba(t)?Wr(t):Us(t.parent):null,Qn=ke(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Us(t.parent),$root:t=>Us(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>qo(t),$forceUpdate:t=>t.f||(t.f=()=>{zs(t.update)}),$nextTick:t=>t.n||(t.n=Yn.bind(t.proxy)),$watch:t=>Hc.bind(t)}),Hs=(t,e)=>t!==te&&!t.__isScriptSetup&&ie(t,e),su={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:i,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const x=o[e];if(x!==void 0)switch(x){case 1:return r[e];case 2:return s[e];case 4:return n[e];case 3:return i[e]}else{if(Hs(r,e))return o[e]=1,r[e];if(s!==te&&ie(s,e))return o[e]=2,s[e];if(ie(i,e))return o[e]=3,i[e];if(n!==te&&ie(n,e))return o[e]=4,n[e];js&&(o[e]=0)}}const c=Qn[e];let u,d;if(c)return e==="$attrs"&&De(t.attrs,"get",""),c(t);if((u=a.__cssModules)&&(u=u[e]))return u;if(n!==te&&ie(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,ie(d,e))return d[e]},set({_:t},e,n){const{data:r,setupState:s,ctx:i}=t;return Hs(s,e)?(s[e]=n,!0):r!==te&&ie(r,e)?(r[e]=n,!0):ie(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:r,appContext:s,props:i,type:o}},a){let l;return!!(n[a]||t!==te&&a[0]!=="$"&&ie(t,a)||Hs(e,a)||ie(i,a)||ie(r,a)||ie(Qn,a)||ie(s.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:ie(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Uo(t){return $(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let js=!0;function iu(t){const e=qo(t),n=t.proxy,r=t.ctx;js=!1,e.beforeCreate&&Ho(e.beforeCreate,t,"bc");const{data:s,computed:i,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:d,mounted:x,beforeUpdate:T,updated:L,activated:M,deactivated:ue,beforeDestroy:ee,beforeUnmount:j,destroyed:Q,unmounted:O,render:re,renderTracked:Te,renderTriggered:We,errorCaptured:it,serverPrefetch:ot,expose:Ke,inheritAttrs:be,components:dt,directives:gt,filters:St}=e;if(c&&ou(c,r,null),o)for(const ae in o){const G=o[ae];U(G)&&(r[ae]=G.bind(n))}if(s){const ae=s.call(n,n);ce(ae)&&(t.data=Ps(ae))}if(js=!0,i)for(const ae in i){const G=i[ae],Ae=U(G)?G.bind(n,n):U(G.get)?G.get.bind(n,n):At,Jt=!U(G)&&U(G.set)?G.set.bind(n):At,le=Js({get:Ae,set:Jt});Object.defineProperty(r,ae,{enumerable:!0,configurable:!0,get:()=>le.value,set:Ge=>le.value=Ge})}if(a)for(const ae in a)jo(a[ae],r,n,ae);if(l){const ae=U(l)?l.call(n):l;Reflect.ownKeys(ae).forEach(G=>{Fc(G,ae[G])})}u&&Ho(u,t,"c");function xe(ae,G){$(G)?G.forEach(Ae=>ae(Ae.bind(n))):G&&ae(G.bind(n))}if(xe(Yc,d),xe($o,x),xe(Xc,T),xe(Zc,L),xe(Wc,M),xe(Kc,ue),xe(nu,it),xe(tu,Te),xe(eu,We),xe(Jc,j),xe(Fs,O),xe(Qc,ot),$(Ke))if(Ke.length){const ae=t.exposed||(t.exposed={});Ke.forEach(G=>{Object.defineProperty(ae,G,{get:()=>n[G],set:Ae=>n[G]=Ae,enumerable:!0})})}else t.exposed||(t.exposed={});re&&t.render===At&&(t.render=re),be!=null&&(t.inheritAttrs=be),dt&&(t.components=dt),gt&&(t.directives=gt),ot&&Mo(t)}function ou(t,e,n=At){$(t)&&(t=qs(t));for(const r in t){const s=t[r];let i;ce(s)?"default"in s?i=Dr(s.from||r,s.default,!0):i=Dr(s.from||r):i=Dr(s),Ie(i)?Object.defineProperty(e,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[r]=i}}function Ho(t,e,n){Pt($(t)?t.map(r=>r.bind(e.proxy)):t.bind(e.proxy),e,n)}function jo(t,e,n,r){let s=r.includes(".")?Po(n,r):()=>n[r];if(we(t)){const i=e[t];U(i)&&zr(s,i)}else if(U(t))zr(s,t.bind(n));else if(ce(t))if($(t))t.forEach(i=>jo(i,e,n,r));else{const i=U(t.handler)?t.handler.bind(n):e[t.handler];U(i)&&zr(s,i,t)}}function qo(t){const e=t.type,{mixins:n,extends:r}=e,{mixins:s,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,a=i.get(e);let l;return a?l=a:!s.length&&!n&&!r?l=e:(l={},s.length&&s.forEach(c=>$r(l,c,o,!0)),$r(l,e,o)),ce(e)&&i.set(e,l),l}function $r(t,e,n,r=!1){const{mixins:s,extends:i}=e;i&&$r(t,i,n,!0),s&&s.forEach(o=>$r(t,o,n,!0));for(const o in e)if(!(r&&o==="expose")){const a=au[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const au={data:Vo,props:Wo,emits:Wo,methods:er,computed:er,beforeCreate:Ue,created:Ue,beforeMount:Ue,mounted:Ue,beforeUpdate:Ue,updated:Ue,beforeDestroy:Ue,beforeUnmount:Ue,destroyed:Ue,unmounted:Ue,activated:Ue,deactivated:Ue,errorCaptured:Ue,serverPrefetch:Ue,components:er,directives:er,watch:cu,provide:Vo,inject:lu};function Vo(t,e){return e?t?function(){return ke(U(t)?t.call(this,this):t,U(e)?e.call(this,this):e)}:e:t}function lu(t,e){return er(qs(t),qs(e))}function qs(t){if($(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Ue(t,e){return t?[...new Set([].concat(t,e))]:e}function er(t,e){return t?ke(Object.create(null),t,e):e}function Wo(t,e){return t?$(t)&&$(e)?[...new Set([...t,...e])]:ke(Object.create(null),Uo(t),Uo(e??{})):e}function cu(t,e){if(!t)return e;if(!e)return t;const n=ke(Object.create(null),t);for(const r in e)n[r]=Ue(t[r],e[r]);return n}function Ko(){return{app:null,config:{isNativeTag:Ki,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let uu=0;function fu(t,e){return function(r,s=null){U(r)||(r=ke({},r)),s!=null&&!ce(s)&&(s=null);const i=Ko(),o=new WeakSet,a=[];let l=!1;const c=i.app={_uid:uu++,_component:r,_props:s,_container:null,_context:i,_instance:null,version:Ku,get config(){return i.config},set config(u){},use(u,...d){return o.has(u)||(u&&U(u.install)?(o.add(u),u.install(c,...d)):U(u)&&(o.add(u),u(c,...d))),c},mixin(u){return i.mixins.includes(u)||i.mixins.push(u),c},component(u,d){return d?(i.components[u]=d,c):i.components[u]},directive(u,d){return d?(i.directives[u]=d,c):i.directives[u]},mount(u,d,x){if(!l){const T=c._ceVNode||Mt(r,s);return T.appContext=i,x===!0?x="svg":x===!1&&(x=void 0),t(T,u,x),l=!0,c._container=u,u.__vue_app__=c,Wr(T.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Pt(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(u,d){return i.provides[u]=d,c},runWithContext(u){const d=In;In=c;try{return u()}finally{In=d}}};return c}}let In=null;const hu=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${Ze(e)}Modifiers`]||t[`${nt(e)}Modifiers`];function pu(t,e,...n){if(t.isUnmounted)return;const r=t.vnode.props||te;let s=n;const i=e.startsWith("update:"),o=i&&hu(r,e.slice(7));o&&(o.trim&&(s=n.map(u=>we(u)?u.trim():u)),o.number&&(s=n.map(ws)));let a,l=r[a=ys(e)]||r[a=ys(Ze(e))];!l&&i&&(l=r[a=ys(nt(e))]),l&&Pt(l,t,6,s);const c=r[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,Pt(c,t,6,s)}}const du=new WeakMap;function Go(t,e,n=!1){const r=n?du:e.emitsCache,s=r.get(t);if(s!==void 0)return s;const i=t.emits;let o={},a=!1;if(!U(t)){const l=c=>{const u=Go(c,e,!0);u&&(a=!0,ke(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!i&&!a?(ce(t)&&r.set(t,null),null):($(i)?i.forEach(l=>o[l]=null):ke(o,i),ce(t)&&r.set(t,o),o)}function Ur(t,e){return!t||!wr(e)?!1:(e=e.slice(2).replace(/Once$/,""),ie(t,e[0].toLowerCase()+e.slice(1))||ie(t,nt(e))||ie(t,e))}function Ld(){}function Yo(t){const{type:e,vnode:n,proxy:r,withProxy:s,propsOptions:[i],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:d,data:x,setupState:T,ctx:L,inheritAttrs:M}=t,ue=Nr(t);let ee,j;try{if(n.shapeFlag&4){const O=s||r,re=O;ee=Dt(c.call(re,O,u,d,T,x,L)),j=a}else{const O=e;ee=Dt(O.length>1?O(d,{attrs:a,slots:o,emit:l}):O(d,null)),j=e.props?a:gu(a)}}catch(O){tr.length=0,Lr(O,t,1),ee=Mt(sn)}let Q=ee;if(j&&M!==!1){const O=Object.keys(j),{shapeFlag:re}=Q;O.length&&re&7&&(i&&O.some(xr)&&(j=mu(j,i)),Q=Ln(Q,j,!1,!0))}return n.dirs&&(Q=Ln(Q,null,!1,!0),Q.dirs=Q.dirs?Q.dirs.concat(n.dirs):n.dirs),n.transition&&Bs(Q,n.transition),ee=Q,Nr(ue),ee}const gu=t=>{let e;for(const n in t)(n==="class"||n==="style"||wr(n))&&((e||(e={}))[n]=t[n]);return e},mu=(t,e)=>{const n={};for(const r in t)(!xr(r)||!(r.slice(9)in e))&&(n[r]=t[r]);return n};function bu(t,e,n){const{props:r,children:s,component:i}=t,{props:o,children:a,patchFlag:l}=e,c=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return r?Xo(r,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let d=0;d<u.length;d++){const x=u[d];if(Zo(o,r,x)&&!Ur(c,x))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===o?!1:r?o?Xo(r,o,c):!0:!!o;return!1}function Xo(t,e,n){const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!0;for(let s=0;s<r.length;s++){const i=r[s];if(Zo(e,t,i)&&!Ur(n,i))return!0}return!1}function Zo(t,e,n){const r=t[n],s=e[n];return n==="style"&&ce(r)&&ce(s)?!xs(r,s):r!==s}function yu({vnode:t,parent:e,suspense:n},r){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=r,t=s),s===t)(t=e.vnode).el=r,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=r)}const Jo={},Qo=()=>Object.create(Jo),ea=t=>Object.getPrototypeOf(t)===Jo;function wu(t,e,n,r=!1){const s={},i=Qo();t.propsDefaults=Object.create(null),ta(t,e,s,i);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=r?s:_c(s):t.type.props?t.props=s:t.props=i,t.attrs=i}function xu(t,e,n,r){const{props:s,attrs:i,vnode:{patchFlag:o}}=t,a=ne(s),[l]=t.propsOptions;let c=!1;if((r||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let d=0;d<u.length;d++){let x=u[d];if(Ur(t.emitsOptions,x))continue;const T=e[x];if(l)if(ie(i,x))T!==i[x]&&(i[x]=T,c=!0);else{const L=Ze(x);s[L]=Vs(l,a,L,T,t,!1)}else T!==i[x]&&(i[x]=T,c=!0)}}}else{ta(t,e,s,i)&&(c=!0);let u;for(const d in a)(!e||!ie(e,d)&&((u=nt(d))===d||!ie(e,u)))&&(l?n&&(n[d]!==void 0||n[u]!==void 0)&&(s[d]=Vs(l,a,d,void 0,t,!0)):delete s[d]);if(i!==a)for(const d in i)(!e||!ie(e,d))&&(delete i[d],c=!0)}c&&Vt(t.attrs,"set","")}function ta(t,e,n,r){const[s,i]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(Hn(l))continue;const c=e[l];let u;s&&ie(s,u=Ze(l))?!i||!i.includes(u)?n[u]=c:(a||(a={}))[u]=c:Ur(t.emitsOptions,l)||(!(l in r)||c!==r[l])&&(r[l]=c,o=!0)}if(i){const l=ne(n),c=a||te;for(let u=0;u<i.length;u++){const d=i[u];n[d]=Vs(s,l,d,c[d],t,!ie(c,d))}}return o}function Vs(t,e,n,r,s,i){const o=t[n];if(o!=null){const a=ie(o,"default");if(a&&r===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&U(l)){const{propsDefaults:c}=s;if(n in c)r=c[n];else{const u=sr(s);r=c[n]=l.call(null,e),u()}}else r=l;s.ce&&s.ce._setProp(n,r)}o[0]&&(i&&!a?r=!1:o[1]&&(r===""||r===nt(n))&&(r=!0))}return r}const vu=new WeakMap;function na(t,e,n=!1){const r=n?vu:e.propsCache,s=r.get(t);if(s)return s;const i=t.props,o={},a=[];let l=!1;if(!U(t)){const u=d=>{l=!0;const[x,T]=na(d,e,!0);ke(o,x),T&&a.push(...T)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!i&&!l)return ce(t)&&r.set(t,Tn),Tn;if($(i))for(let u=0;u<i.length;u++){const d=Ze(i[u]);ra(d)&&(o[d]=te)}else if(i)for(const u in i){const d=Ze(u);if(ra(d)){const x=i[u],T=o[d]=$(x)||U(x)?{type:x}:ke({},x),L=T.type;let M=!1,ue=!0;if($(L))for(let ee=0;ee<L.length;++ee){const j=L[ee],Q=U(j)&&j.name;if(Q==="Boolean"){M=!0;break}else Q==="String"&&(ue=!1)}else M=U(L)&&L.name==="Boolean";T[0]=M,T[1]=ue,(M||ie(T,"default"))&&a.push(d)}}const c=[o,a];return ce(t)&&r.set(t,c),c}function ra(t){return t[0]!=="$"&&!Hn(t)}const Ws=t=>t==="_"||t==="_ctx"||t==="$stable",Ks=t=>$(t)?t.map(Dt):[Dt(t)],_u=(t,e,n)=>{if(e._n)return e;const r=Bc((...s)=>Ks(e(...s)),n);return r._c=!1,r},sa=(t,e,n)=>{const r=t._ctx;for(const s in t){if(Ws(s))continue;const i=t[s];if(U(i))e[s]=_u(s,i,r);else if(i!=null){const o=Ks(i);e[s]=()=>o}}},ia=(t,e)=>{const n=Ks(e);t.slots.default=()=>n},oa=(t,e,n)=>{for(const r in e)(n||!Ws(r))&&(t[r]=e[r])},ku=(t,e,n)=>{const r=t.slots=Qo();if(t.vnode.shapeFlag&32){const s=e._;s?(oa(r,e,n),n&&Qi(r,"_",s,!0)):sa(e,r)}else e&&ia(t,e)},Tu=(t,e,n)=>{const{vnode:r,slots:s}=t;let i=!0,o=te;if(r.shapeFlag&32){const a=e._;a?n&&a===1?i=!1:oa(s,e,n):(i=!e.$stable,sa(e,s)),o=e}else e&&(ia(t,e),o={default:1});if(i)for(const a in s)!Ws(a)&&o[a]==null&&delete s[a]},Qe=Cu;function Su(t){return Eu(t)}function Eu(t,e){const n=Tr();n.__VUE__=!0;const{insert:r,remove:s,patchProp:i,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:d,nextSibling:x,setScopeId:T=At,insertStaticContent:L}=t,M=(f,p,g,w=null,b=null,y=null,R=void 0,E=null,_=!!p.dynamicChildren)=>{if(f===p)return;f&&!rr(f,p)&&(w=Pe(f),Ge(f,b,y,!0),f=null),p.patchFlag===-2&&(_=!1,p.dynamicChildren=null);const{type:v,ref:z,shapeFlag:C}=p;switch(v){case Hr:ue(f,p,g,w);break;case sn:ee(f,p,g,w);break;case Ys:f==null&&j(p,g,w,R);break;case Le:dt(f,p,g,w,b,y,R,E,_);break;default:C&1?re(f,p,g,w,b,y,R,E,_):C&6?gt(f,p,g,w,b,y,R,E,_):(C&64||C&128)&&v.process(f,p,g,w,b,y,R,E,_,Ye)}z!=null&&b?Zn(z,f&&f.ref,y,p||f,!p):z==null&&f&&f.ref!=null&&Zn(f.ref,null,y,f,!0)},ue=(f,p,g,w)=>{if(f==null)r(p.el=a(p.children),g,w);else{const b=p.el=f.el;p.children!==f.children&&c(b,p.children)}},ee=(f,p,g,w)=>{f==null?r(p.el=l(p.children||""),g,w):p.el=f.el},j=(f,p,g,w)=>{[f.el,f.anchor]=L(f.children,p,g,w,f.el,f.anchor)},Q=({el:f,anchor:p},g,w)=>{let b;for(;f&&f!==p;)b=x(f),r(f,g,w),f=b;r(p,g,w)},O=({el:f,anchor:p})=>{let g;for(;f&&f!==p;)g=x(f),s(f),f=g;s(p)},re=(f,p,g,w,b,y,R,E,_)=>{if(p.type==="svg"?R="svg":p.type==="math"&&(R="mathml"),f==null)Te(p,g,w,b,y,R,E,_);else{const v=f.el&&f.el._isVueCE?f.el:null;try{v&&v._beginPatch(),ot(f,p,b,y,R,E,_)}finally{v&&v._endPatch()}}},Te=(f,p,g,w,b,y,R,E)=>{let _,v;const{props:z,shapeFlag:C,transition:N,dirs:B}=f;if(_=f.el=o(f.type,y,z&&z.is,z),C&8?u(_,f.children):C&16&&it(f.children,_,null,w,b,Gs(f,y),R,E),B&&bn(f,null,w,"created"),We(_,f,f.scopeId,R,w),z){for(const V in z)V!=="value"&&!Hn(V)&&i(_,V,null,z[V],y,w);"value"in z&&i(_,"value",null,z.value,y),(v=z.onVnodeBeforeMount)&&zt(v,w,f)}B&&bn(f,null,w,"beforeMount");const q=Au(b,N);q&&N.beforeEnter(_),r(_,p,g),((v=z&&z.onVnodeMounted)||q||B)&&Qe(()=>{try{v&&zt(v,w,f),q&&N.enter(_),B&&bn(f,null,w,"mounted")}finally{}},b)},We=(f,p,g,w,b)=>{if(g&&T(f,g),w)for(let y=0;y<w.length;y++)T(f,w[y]);if(b){let y=b.subTree;if(p===y||fa(y.type)&&(y.ssContent===p||y.ssFallback===p)){const R=b.vnode;We(f,R,R.scopeId,R.slotScopeIds,b.parent)}}},it=(f,p,g,w,b,y,R,E,_=0)=>{for(let v=_;v<f.length;v++){const z=f[v]=E?Xt(f[v]):Dt(f[v]);M(null,z,p,g,w,b,y,R,E)}},ot=(f,p,g,w,b,y,R)=>{const E=p.el=f.el;let{patchFlag:_,dynamicChildren:v,dirs:z}=p;_|=f.patchFlag&16;const C=f.props||te,N=p.props||te;let B;if(g&&yn(g,!1),(B=N.onVnodeBeforeUpdate)&&zt(B,g,p,f),z&&bn(p,f,g,"beforeUpdate"),g&&yn(g,!0),(C.innerHTML&&N.innerHTML==null||C.textContent&&N.textContent==null)&&u(E,""),v?Ke(f.dynamicChildren,v,E,g,w,Gs(p,b),y):R||G(f,p,E,null,g,w,Gs(p,b),y,!1),_>0){if(_&16)be(E,C,N,g,b);else if(_&2&&C.class!==N.class&&i(E,"class",null,N.class,b),_&4&&i(E,"style",C.style,N.style,b),_&8){const q=p.dynamicProps;for(let V=0;V<q.length;V++){const se=q[V],me=C[se],ve=N[se];(ve!==me||se==="value")&&i(E,se,me,ve,b,g)}}_&1&&f.children!==p.children&&u(E,p.children)}else!R&&v==null&&be(E,C,N,g,b);((B=N.onVnodeUpdated)||z)&&Qe(()=>{B&&zt(B,g,p,f),z&&bn(p,f,g,"updated")},w)},Ke=(f,p,g,w,b,y,R)=>{for(let E=0;E<p.length;E++){const _=f[E],v=p[E],z=_.el&&(_.type===Le||!rr(_,v)||_.shapeFlag&198)?d(_.el):g;M(_,v,z,null,w,b,y,R,!0)}},be=(f,p,g,w,b)=>{if(p!==g){if(p!==te)for(const y in p)!Hn(y)&&!(y in g)&&i(f,y,p[y],null,b,w);for(const y in g){if(Hn(y))continue;const R=g[y],E=p[y];R!==E&&y!=="value"&&i(f,y,E,R,b,w)}"value"in g&&i(f,"value",p.value,g.value,b)}},dt=(f,p,g,w,b,y,R,E,_)=>{const v=p.el=f?f.el:a(""),z=p.anchor=f?f.anchor:a("");let{patchFlag:C,dynamicChildren:N,slotScopeIds:B}=p;B&&(E=E?E.concat(B):B),f==null?(r(v,g,w),r(z,g,w),it(p.children||[],g,z,b,y,R,E,_)):C>0&&C&64&&N&&f.dynamicChildren&&f.dynamicChildren.length===N.length?(Ke(f.dynamicChildren,N,g,b,y,R,E),(p.key!=null||b&&p===b.subTree)&&aa(f,p,!0)):G(f,p,g,z,b,y,R,E,_)},gt=(f,p,g,w,b,y,R,E,_)=>{p.slotScopeIds=E,f==null?p.shapeFlag&512?b.ctx.activate(p,g,w,R,_):St(p,g,w,b,y,R,_):Et(f,p,_)},St=(f,p,g,w,b,y,R)=>{const E=f.component=zu(f,w,b);if(Bo(f)&&(E.ctx.renderer=Ye),Fu(E,!1,R),E.asyncDep){if(b&&b.registerDep(E,xe,R),!f.el){const _=E.subTree=Mt(sn);ee(null,_,p,g),f.placeholder=_.el}}else xe(E,f,p,g,b,y,R)},Et=(f,p,g)=>{const w=p.component=f.component;if(bu(f,p,g))if(w.asyncDep&&!w.asyncResolved){ae(w,p,g);return}else w.next=p,w.update();else p.el=f.el,w.vnode=p},xe=(f,p,g,w,b,y,R)=>{const E=()=>{if(f.isMounted){let{next:C,bu:N,u:B,parent:q,vnode:V}=f;{const Xe=la(f);if(Xe){C&&(C.el=V.el,ae(f,C,R)),Xe.asyncDep.then(()=>{Qe(()=>{f.isUnmounted||v()},b)});return}}let se=C,me;yn(f,!1),C?(C.el=V.el,ae(f,C,R)):C=V,N&&kr(N),(me=C.props&&C.props.onVnodeBeforeUpdate)&&zt(me,q,C,V),yn(f,!0);const ve=Yo(f),Be=f.subTree;f.subTree=ve,M(Be,ve,d(Be.el),Pe(Be),f,b,y),C.el=ve.el,se===null&&yu(f,ve.el),B&&Qe(B,b),(me=C.props&&C.props.onVnodeUpdated)&&Qe(()=>zt(me,q,C,V),b)}else{let C;const{el:N,props:B}=p,{bm:q,m:V,parent:se,root:me,type:ve}=f,Be=Jn(p);yn(f,!1),q&&kr(q),!Be&&(C=B&&B.onVnodeBeforeMount)&&zt(C,se,p),yn(f,!0);{me.ce&&me.ce._hasShadowRoot()&&me.ce._injectChildStyle(ve,f.parent?f.parent.type:void 0);const Xe=f.subTree=Yo(f);M(null,Xe,g,w,f,b,y),p.el=Xe.el}if(V&&Qe(V,b),!Be&&(C=B&&B.onVnodeMounted)){const Xe=p;Qe(()=>zt(C,se,Xe),b)}(p.shapeFlag&256||se&&Jn(se.vnode)&&se.vnode.shapeFlag&256)&&f.a&&Qe(f.a,b),f.isMounted=!0,p=g=w=null}};f.scope.on();const _=f.effect=new io(E);f.scope.off();const v=f.update=_.run.bind(_),z=f.job=_.runIfDirty.bind(_);z.i=f,z.id=f.uid,_.scheduler=()=>zs(z),yn(f,!0),v()},ae=(f,p,g)=>{p.component=f;const w=f.vnode.props;f.vnode=p,f.next=null,xu(f,p.props,w,g),Tu(f,p.children,g),Ot(),Ro(f),It()},G=(f,p,g,w,b,y,R,E,_=!1)=>{const v=f&&f.children,z=f?f.shapeFlag:0,C=p.children,{patchFlag:N,shapeFlag:B}=p;if(N>0){if(N&128){Jt(v,C,g,w,b,y,R,E,_);return}else if(N&256){Ae(v,C,g,w,b,y,R,E,_);return}}B&8?(z&16&&at(v,b,y),C!==v&&u(g,C)):z&16?B&16?Jt(v,C,g,w,b,y,R,E,_):at(v,b,y,!0):(z&8&&u(g,""),B&16&&it(C,g,w,b,y,R,E,_))},Ae=(f,p,g,w,b,y,R,E,_)=>{f=f||Tn,p=p||Tn;const v=f.length,z=p.length,C=Math.min(v,z);let N;for(N=0;N<C;N++){const B=p[N]=_?Xt(p[N]):Dt(p[N]);M(f[N],B,g,null,b,y,R,E,_)}v>z?at(f,b,y,!0,!1,C):it(p,g,w,b,y,R,E,_,C)},Jt=(f,p,g,w,b,y,R,E,_)=>{let v=0;const z=p.length;let C=f.length-1,N=z-1;for(;v<=C&&v<=N;){const B=f[v],q=p[v]=_?Xt(p[v]):Dt(p[v]);if(rr(B,q))M(B,q,g,null,b,y,R,E,_);else break;v++}for(;v<=C&&v<=N;){const B=f[C],q=p[N]=_?Xt(p[N]):Dt(p[N]);if(rr(B,q))M(B,q,g,null,b,y,R,E,_);else break;C--,N--}if(v>C){if(v<=N){const B=N+1,q=B<z?p[B].el:w;for(;v<=N;)M(null,p[v]=_?Xt(p[v]):Dt(p[v]),g,q,b,y,R,E,_),v++}}else if(v>N)for(;v<=C;)Ge(f[v],b,y,!0),v++;else{const B=v,q=v,V=new Map;for(v=q;v<=N;v++){const pe=p[v]=_?Xt(p[v]):Dt(p[v]);pe.key!=null&&V.set(pe.key,v)}let se,me=0;const ve=N-q+1;let Be=!1,Xe=0;const mt=new Array(ve);for(v=0;v<ve;v++)mt[v]=0;for(v=B;v<=C;v++){const pe=f[v];if(me>=ve){Ge(pe,b,y,!0);continue}let Re;if(pe.key!=null)Re=V.get(pe.key);else for(se=q;se<=N;se++)if(mt[se-q]===0&&rr(pe,p[se])){Re=se;break}Re===void 0?Ge(pe,b,y,!0):(mt[Re-q]=v+1,Re>=Xe?Xe=Re:Be=!0,M(pe,p[Re],g,null,b,y,R,E,_),me++)}const en=Be?Ru(mt):Tn;for(se=en.length-1,v=ve-1;v>=0;v--){const pe=q+v,Re=p[pe],tn=p[pe+1],Ht=pe+1<z?tn.el||ua(tn):w;mt[v]===0?M(null,Re,g,Ht,b,y,R,E,_):Be&&(se<0||v!==en[se]?le(Re,g,Ht,2):se--)}}},le=(f,p,g,w,b=null)=>{const{el:y,type:R,transition:E,children:_,shapeFlag:v}=f;if(v&6){le(f.component.subTree,p,g,w);return}if(v&128){f.suspense.move(p,g,w);return}if(v&64){R.move(f,p,g,Ye);return}if(R===Le){r(y,p,g);for(let C=0;C<_.length;C++)le(_[C],p,g,w);r(f.anchor,p,g);return}if(R===Ys){Q(f,p,g);return}if(w!==2&&v&1&&E)if(w===0)E.beforeEnter(y),r(y,p,g),Qe(()=>E.enter(y),b);else{const{leave:C,delayLeave:N,afterLeave:B}=E,q=()=>{f.ctx.isUnmounted?s(y):r(y,p,g)},V=()=>{y._isLeaving&&y[Vc](!0),C(y,()=>{q(),B&&B()})};N?N(y,q,V):V()}else r(y,p,g)},Ge=(f,p,g,w=!1,b=!1)=>{const{type:y,props:R,ref:E,children:_,dynamicChildren:v,shapeFlag:z,patchFlag:C,dirs:N,cacheIndex:B,memo:q}=f;if(C===-2&&(b=!1),E!=null&&(Ot(),Zn(E,null,g,f,!0),It()),B!=null&&(p.renderCache[B]=void 0),z&256){p.ctx.deactivate(f);return}const V=z&1&&N,se=!Jn(f);let me;if(se&&(me=R&&R.onVnodeBeforeUnmount)&&zt(me,p,f),z&6)ge(f.component,g,w);else{if(z&128){f.suspense.unmount(g,w);return}V&&bn(f,null,p,"beforeUnmount"),z&64?f.type.remove(f,p,g,Ye,w):v&&!v.hasOnce&&(y!==Le||C>0&&C&64)?at(v,p,g,!1,!0):(y===Le&&C&384||!b&&z&16)&&at(_,p,g),w&&de(f)}const ve=q!=null&&B==null;(se&&(me=R&&R.onVnodeUnmounted)||V||ve)&&Qe(()=>{me&&zt(me,p,f),V&&bn(f,null,p,"unmounted"),ve&&(f.el=null)},g)},de=f=>{const{type:p,el:g,anchor:w,transition:b}=f;if(p===Le){_n(g,w);return}if(p===Ys){O(f);return}const y=()=>{s(g),b&&!b.persisted&&b.afterLeave&&b.afterLeave()};if(f.shapeFlag&1&&b&&!b.persisted){const{leave:R,delayLeave:E}=b,_=()=>R(g,y);E?E(f.el,y,_):_()}else y()},_n=(f,p)=>{let g;for(;f!==p;)g=x(f),s(f),f=g;s(p)},ge=(f,p,g)=>{const{bum:w,scope:b,job:y,subTree:R,um:E,m:_,a:v}=f;ca(_),ca(v),w&&kr(w),b.stop(),y&&(y.flags|=8,Ge(R,f,p,g)),E&&Qe(E,p),Qe(()=>{f.isUnmounted=!0},p)},at=(f,p,g,w=!1,b=!1,y=0)=>{for(let R=y;R<f.length;R++)Ge(f[R],p,g,w,b)},Pe=f=>{if(f.shapeFlag&6)return Pe(f.component.subTree);if(f.shapeFlag&128)return f.suspense.next();const p=x(f.anchor||f.el),g=p&&p[jc];return g?x(g):p};let Ne=!1;const Qt=(f,p,g)=>{let w;f==null?p._vnode&&(Ge(p._vnode,null,null,!0),w=p._vnode.component):M(p._vnode||null,f,p,null,null,null,g),p._vnode=f,Ne||(Ne=!0,Ro(w),Co(),Ne=!1)},Ye={p:M,um:Ge,m:le,r:de,mt:St,mc:it,pc:G,pbc:Ke,n:Pe,o:t};return{render:Qt,hydrate:void 0,createApp:fu(Qt)}}function Gs({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function yn({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function Au(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function aa(t,e,n=!1){const r=t.children,s=e.children;if($(r)&&$(s))for(let i=0;i<r.length;i++){const o=r[i];let a=s[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[i]=Xt(s[i]),a.el=o.el),!n&&a.patchFlag!==-2&&aa(o,a)),a.type===Hr&&(a.patchFlag===-1&&(a=s[i]=Xt(a)),a.el=o.el),a.type===sn&&!a.el&&(a.el=o.el)}}function Ru(t){const e=t.slice(),n=[0];let r,s,i,o,a;const l=t.length;for(r=0;r<l;r++){const c=t[r];if(c!==0){if(s=n[n.length-1],t[s]<c){e[r]=s,n.push(r);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,t[n[a]]<c?i=a+1:o=a;c<t[n[i]]&&(i>0&&(e[r]=n[i-1]),n[i]=r)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function la(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:la(e)}function ca(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function ua(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?ua(e.subTree):null}const fa=t=>t.__isSuspense;function Cu(t,e){e&&e.pendingBranch?$(t)?e.effects.push(...t):e.effects.push(t):zc(t)}const Le=Symbol.for("v-fgt"),Hr=Symbol.for("v-txt"),sn=Symbol.for("v-cmt"),Ys=Symbol.for("v-stc"),tr=[];let rt=null;function W(t=!1){tr.push(rt=t?null:[])}function Ou(){tr.pop(),rt=tr[tr.length-1]||null}let nr=1;function ha(t,e=!1){nr+=t,t<0&&rt&&e&&(rt.hasOnce=!0)}function pa(t){return t.dynamicChildren=nr>0?rt||Tn:null,Ou(),nr>0&&rt&&rt.push(t),t}function Y(t,e,n,r,s,i){return pa(D(t,e,n,r,s,i,!0))}function Iu(t,e,n,r,s){return pa(Mt(t,e,n,r,s,!0))}function da(t){return t?t.__v_isVNode===!0:!1}function rr(t,e){return t.type===e.type&&t.key===e.key}const ga=({key:t})=>t??null,jr=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?we(t)||Ie(t)||U(t)?{i:ft,r:t,k:e,f:!!n}:t:null);function D(t,e=null,n=null,r=0,s=null,i=t===Le?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&ga(e),ref:e&&jr(e),scopeId:Io,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:ft};return a?(Xs(l,n),i&128&&t.normalize(l)):n&&(l.shapeFlag|=we(n)?8:16),nr>0&&!o&&rt&&(l.patchFlag>0||i&6)&&l.patchFlag!==32&&rt.push(l),l}const Mt=Lu;function Lu(t,e=null,n=null,r=0,s=null,i=!1){if((!t||t===ru)&&(t=sn),da(t)){const a=Ln(t,e,!0);return n&&Xs(a,n),nr>0&&!i&&rt&&(a.shapeFlag&6?rt[rt.indexOf(t)]=a:rt.push(a)),a.patchFlag=-2,a}if(Wu(t)&&(t=t.__vccOpts),e){e=Pu(e);let{class:a,style:l}=e;a&&!we(a)&&(e.class=hn(a)),ce(l)&&(Ms(l)&&!$(l)&&(l=ke({},l)),e.style=yt(l))}const o=we(t)?1:fa(t)?128:qc(t)?64:ce(t)?4:U(t)?2:0;return D(t,e,n,r,s,o,i,!0)}function Pu(t){return t?Ms(t)||ea(t)?ke({},t):t:null}function Ln(t,e,n=!1,r=!1){const{props:s,ref:i,patchFlag:o,children:a,transition:l}=t,c=e?Nu(s||{},e):s,u={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&ga(c),ref:e&&e.ref?n&&i?$(i)?i.concat(jr(e)):[i,jr(e)]:jr(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Le?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Ln(t.ssContent),ssFallback:t.ssFallback&&Ln(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&r&&Bs(u,l.clone(u)),u}function qr(t=" ",e=0){return Mt(Hr,null,t,e)}function st(t="",e=!1){return e?(W(),Iu(sn,null,t)):Mt(sn,null,t)}function Dt(t){return t==null||typeof t=="boolean"?Mt(sn):$(t)?Mt(Le,null,t.slice()):da(t)?Xt(t):Mt(Hr,null,String(t))}function Xt(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Ln(t)}function Xs(t,e){let n=0;const{shapeFlag:r}=t;if(e==null)e=null;else if($(e))n=16;else if(typeof e=="object")if(r&65){const s=e.default;s&&(s._c&&(s._d=!1),Xs(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!ea(e)?e._ctx=ft:s===3&&ft&&(ft.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else U(e)?(e={default:e,_ctx:ft},n=32):(e=String(e),r&64?(n=16,e=[qr(e)]):n=8);t.children=e,t.shapeFlag|=n}function Nu(...t){const e={};for(let n=0;n<t.length;n++){const r=t[n];for(const s in r)if(s==="class")e.class!==r.class&&(e.class=hn([e.class,r.class]));else if(s==="style")e.style=yt([e.style,r.style]);else if(wr(s)){const i=e[s],o=r[s];o&&i!==o&&!($(i)&&i.includes(o))?e[s]=i?[].concat(i,o):o:o==null&&i==null&&!xr(s)&&(e[s]=o)}else s!==""&&(e[s]=r[s])}return e}function zt(t,e,n,r=null){Pt(t,e,7,[n,r])}const Mu=Ko();let Du=0;function zu(t,e,n){const r=t.type,s=(e?e.appContext:t.appContext)||Mu,i={uid:Du++,vnode:t,type:r,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new nc(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:na(r,s),emitsOptions:Go(r,s),emit:null,emitted:null,propsDefaults:te,inheritAttrs:r.inheritAttrs,ctx:te,data:te,props:te,attrs:te,slots:te,refs:te,setupState:te,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=pu.bind(null,i),t.ce&&t.ce(i),i}let He=null;const Bu=()=>He||ft;let Vr,Zs;{const t=Tr(),e=(n,r)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(r),i=>{s.length>1?s.forEach(o=>o(i)):s[0](i)}};Vr=e("__VUE_INSTANCE_SETTERS__",n=>He=n),Zs=e("__VUE_SSR_SETTERS__",n=>ir=n)}const sr=t=>{const e=He;return Vr(t),t.scope.on(),()=>{t.scope.off(),Vr(e)}},ma=()=>{He&&He.scope.off(),Vr(null)};function ba(t){return t.vnode.shapeFlag&4}let ir=!1;function Fu(t,e=!1,n=!1){e&&Zs(e);const{props:r,children:s}=t.vnode,i=ba(t);wu(t,r,i,e),ku(t,s,n||e);const o=i?$u(t,e):void 0;return e&&Zs(!1),o}function $u(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,su);const{setup:r}=n;if(r){Ot();const s=t.setupContext=r.length>1?Hu(t):null,i=sr(t),o=Rn(r,t,0,[t.props,s]),a=Xi(o);if(It(),i(),(a||t.sp)&&!Jn(t)&&Mo(t),a){if(o.then(ma,ma),e)return o.then(l=>{ya(t,l)}).catch(l=>{Lr(l,t,0)});t.asyncDep=o}else ya(t,o)}else wa(t)}function ya(t,e,n){U(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:ce(e)&&(t.setupState=To(e)),wa(t)}function wa(t,e,n){const r=t.type;t.render||(t.render=r.render||At);{const s=sr(t);Ot();try{iu(t)}finally{It(),s()}}}const Uu={get(t,e){return De(t,"get",""),t[e]}};function Hu(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,Uu),slots:t.slots,emit:t.emit,expose:e}}function Wr(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(To(kc(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in Qn)return Qn[n](t)},has(e,n){return n in e||n in Qn}})):t.proxy}const ju=/(?:^|[-_])\w/g,qu=t=>t.replace(ju,e=>e.toUpperCase()).replace(/[-_]/g,"");function Vu(t,e=!0){return U(t)?t.displayName||t.name:t.name||e&&t.__name}function xa(t,e,n=!1){let r=Vu(e);if(!r&&e.__file){const s=e.__file.match(/([^/\\]+)\.\w+$/);s&&(r=s[1])}if(!r&&t){const s=i=>{for(const o in i)if(i[o]===e)return o};r=s(t.components)||t.parent&&s(t.parent.type.components)||s(t.appContext.components)}return r?qu(r):n?"App":"Anonymous"}function Wu(t){return U(t)&&"__vccOpts"in t}const Js=(t,e)=>Rc(t,e,ir),Ku="3.5.32";/**
* @vue/runtime-dom v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Qs;const va=typeof window<"u"&&window.trustedTypes;if(va)try{Qs=va.createPolicy("vue",{createHTML:t=>t})}catch{}const _a=Qs?t=>Qs.createHTML(t):t=>t,Gu="http://www.w3.org/2000/svg",Yu="http://www.w3.org/1998/Math/MathML",Zt=typeof document<"u"?document:null,ka=Zt&&Zt.createElement("template"),Xu={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,r)=>{const s=e==="svg"?Zt.createElementNS(Gu,t):e==="mathml"?Zt.createElementNS(Yu,t):n?Zt.createElement(t,{is:n}):Zt.createElement(t);return t==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:t=>Zt.createTextNode(t),createComment:t=>Zt.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Zt.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,r,s,i){const o=n?n.previousSibling:e.lastChild;if(s&&(s===i||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===i||!(s=s.nextSibling)););else{ka.innerHTML=_a(r==="svg"?`<svg>${t}</svg>`:r==="mathml"?`<math>${t}</math>`:t);const a=ka.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Zu=Symbol("_vtc");function Ju(t,e,n){const r=t[Zu];r&&(e=(e?[e,...r]:[...r]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const Ta=Symbol("_vod"),Qu=Symbol("_vsh"),ef=Symbol(""),tf=/(?:^|;)\s*display\s*:/;function nf(t,e,n){const r=t.style,s=we(n);let i=!1;if(n&&!s){if(e)if(we(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Kr(r,a,"")}else for(const o in e)n[o]==null&&Kr(r,o,"");for(const o in n)o==="display"&&(i=!0),Kr(r,o,n[o])}else if(s){if(e!==n){const o=r[ef];o&&(n+=";"+o),r.cssText=n,i=tf.test(n)}}else e&&t.removeAttribute("style");Ta in t&&(t[Ta]=i?r.display:"",t[Qu]&&(r.display="none"))}const Sa=/\s*!important$/;function Kr(t,e,n){if($(n))n.forEach(r=>Kr(t,e,r));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const r=rf(t,e);Sa.test(n)?t.setProperty(nt(r),n.replace(Sa,""),"important"):t[r]=n}}const Ea=["Webkit","Moz","ms"],ei={};function rf(t,e){const n=ei[e];if(n)return n;let r=Ze(e);if(r!=="filter"&&r in t)return ei[e]=r;r=Ji(r);for(let s=0;s<Ea.length;s++){const i=Ea[s]+r;if(i in t)return ei[e]=i}return e}const Aa="http://www.w3.org/1999/xlink";function Ra(t,e,n,r,s,i=ec(e)){r&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Aa,e.slice(6,e.length)):t.setAttributeNS(Aa,e,n):n==null||i&&!no(n)?t.removeAttribute(e):t.setAttribute(e,i?"":Rt(n)?String(n):n)}function Ca(t,e,n,r,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?_a(n):n);return}const i=t.tagName;if(e==="value"&&i!=="PROGRESS"&&!i.includes("-")){const a=i==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=no(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(s||e)}function Pn(t,e,n,r){t.addEventListener(e,n,r)}function sf(t,e,n,r){t.removeEventListener(e,n,r)}const Oa=Symbol("_vei");function of(t,e,n,r,s=null){const i=t[Oa]||(t[Oa]={}),o=i[e];if(r&&o)o.value=r;else{const[a,l]=af(e);if(r){const c=i[e]=uf(r,s);Pn(t,a,c,l)}else o&&(sf(t,a,o,l),i[e]=void 0)}}const Ia=/(?:Once|Passive|Capture)$/;function af(t){let e;if(Ia.test(t)){e={};let r;for(;r=t.match(Ia);)t=t.slice(0,t.length-r[0].length),e[r[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):nt(t.slice(2)),e]}let ti=0;const lf=Promise.resolve(),cf=()=>ti||(lf.then(()=>ti=0),ti=Date.now());function uf(t,e){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;Pt(ff(r,n.value),e,5,[r])};return n.value=t,n.attached=cf(),n}function ff(t,e){if($(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(r=>s=>!s._stopped&&r&&r(s))}else return e}const La=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,hf=(t,e,n,r,s,i)=>{const o=s==="svg";e==="class"?Ju(t,r,o):e==="style"?nf(t,n,r):wr(e)?xr(e)||of(t,e,n,r,i):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):pf(t,e,r,o))?(Ca(t,e,r),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&Ra(t,e,r,o,i,e!=="value")):t._isVueCE&&(df(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!we(r)))?Ca(t,Ze(e),r,i,e):(e==="true-value"?t._trueValue=r:e==="false-value"&&(t._falseValue=r),Ra(t,e,r,o))};function pf(t,e,n,r){if(r)return!!(e==="innerHTML"||e==="textContent"||e in t&&La(e)&&U(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return La(e)&&we(n)?!1:e in t}function df(t,e){const n=t._def.props;if(!n)return!1;const r=Ze(e);return Array.isArray(n)?n.some(s=>Ze(s)===r):Object.keys(n).some(s=>Ze(s)===r)}const Pa={};function gf(t,e,n){let r=No(t,e);vr(r)&&(r=ke({},r,e));class s extends ni{constructor(o){super(r,o,n)}}return s.def=r,s}const mf=typeof HTMLElement<"u"?HTMLElement:class{};class ni extends mf{constructor(e,n={},r=$a){super(),this._def=e,this._props=n,this._createApp=r,this._isVueCE=!0,this._instance=null,this._app=null,this._nonce=this._def.nonce,this._connected=!1,this._resolved=!1,this._patching=!1,this._dirty=!1,this._numberProps=null,this._styleChildren=new WeakSet,this._styleAnchors=new WeakMap,this._ob=null,this.shadowRoot&&r!==$a?this._root=this.shadowRoot:e.shadowRoot!==!1?(this.attachShadow(ke({},e.shadowRootOptions,{mode:"open"})),this._root=this.shadowRoot):this._root=this}connectedCallback(){if(!this.isConnected)return;!this.shadowRoot&&!this._resolved&&this._parseSlots(),this._connected=!0;let e=this;for(;e=e&&(e.assignedSlot||e.parentNode||e.host);)if(e instanceof ni){this._parent=e;break}this._instance||(this._resolved?this._mount(this._def):e&&e._pendingResolve?this._pendingResolve=e._pendingResolve.then(()=>{this._pendingResolve=void 0,this._resolveDef()}):this._resolveDef())}_setParent(e=this._parent){e&&(this._instance.parent=e._instance,this._inheritParentContext(e))}_inheritParentContext(e=this._parent){e&&this._app&&Object.setPrototypeOf(this._app._context.provides,e._instance.provides)}disconnectedCallback(){this._connected=!1,Yn(()=>{this._connected||(this._ob&&(this._ob.disconnect(),this._ob=null),this._app&&this._app.unmount(),this._instance&&(this._instance.ce=void 0),this._app=this._instance=null,this._teleportTargets&&(this._teleportTargets.clear(),this._teleportTargets=void 0))})}_processMutations(e){for(const n of e)this._setAttr(n.attributeName)}_resolveDef(){if(this._pendingResolve)return;for(let r=0;r<this.attributes.length;r++)this._setAttr(this.attributes[r].name);this._ob=new MutationObserver(this._processMutations.bind(this)),this._ob.observe(this,{attributes:!0});const e=(r,s=!1)=>{this._resolved=!0,this._pendingResolve=void 0;const{props:i,styles:o}=r;let a;if(i&&!$(i))for(const l in i){const c=i[l];(c===Number||c&&c.type===Number)&&(l in this._props&&(this._props[l]=eo(this._props[l])),(a||(a=Object.create(null)))[Ze(l)]=!0)}this._numberProps=a,this._resolveProps(r),this.shadowRoot&&this._applyStyles(o),this._mount(r)},n=this._def.__asyncLoader;n?this._pendingResolve=n().then(r=>{r.configureApp=this._def.configureApp,e(this._def=r,!0)}):e(this._def)}_mount(e){this._app=this._createApp(e),this._inheritParentContext(),e.configureApp&&e.configureApp(this._app),this._app._ceVNode=this._createVNode(),this._app.mount(this._root);const n=this._instance&&this._instance.exposed;if(n)for(const r in n)ie(this,r)||Object.defineProperty(this,r,{get:()=>gn(n[r])})}_resolveProps(e){const{props:n}=e,r=$(n)?n:Object.keys(n||{});for(const s of Object.keys(this))s[0]!=="_"&&r.includes(s)&&this._setProp(s,this[s]);for(const s of r.map(Ze))Object.defineProperty(this,s,{get(){return this._getProp(s)},set(i){this._setProp(s,i,!0,!this._patching)}})}_setAttr(e){if(e.startsWith("data-v-"))return;const n=this.hasAttribute(e);let r=n?this.getAttribute(e):Pa;const s=Ze(e);n&&this._numberProps&&this._numberProps[s]&&(r=eo(r)),this._setProp(s,r,!1,!0)}_getProp(e){return this._props[e]}_setProp(e,n,r=!0,s=!1){if(n!==this._props[e]&&(this._dirty=!0,n===Pa?delete this._props[e]:(this._props[e]=n,e==="key"&&this._app&&(this._app._ceVNode.key=n)),s&&this._instance&&this._update(),r)){const i=this._ob;i&&(this._processMutations(i.takeRecords()),i.disconnect()),n===!0?this.setAttribute(nt(e),""):typeof n=="string"||typeof n=="number"?this.setAttribute(nt(e),n+""):n||this.removeAttribute(nt(e)),i&&i.observe(this,{attributes:!0})}}_update(){const e=this._createVNode();this._app&&(e.appContext=this._app._context),_f(e,this._root)}_createVNode(){const e={};this.shadowRoot||(e.onVnodeMounted=e.onVnodeUpdated=this._renderSlots.bind(this));const n=Mt(this._def,ke(e,this._props));return this._instance||(n.ce=r=>{this._instance=r,r.ce=this,r.isCE=!0;const s=(i,o)=>{this.dispatchEvent(new CustomEvent(i,vr(o[0])?ke({detail:o},o[0]):{detail:o}))};r.emit=(i,...o)=>{s(i,o),nt(i)!==i&&s(nt(i),o)},this._setParent()}),n}_applyStyles(e,n,r){if(!e)return;if(n){if(n===this._def||this._styleChildren.has(n))return;this._styleChildren.add(n)}const s=this._nonce,i=this.shadowRoot,o=r?this._getStyleAnchor(r)||this._getStyleAnchor(this._def):this._getRootStyleInsertionAnchor(i);let a=null;for(let l=e.length-1;l>=0;l--){const c=document.createElement("style");s&&c.setAttribute("nonce",s),c.textContent=e[l],i.insertBefore(c,a||o),a=c,l===0&&(r||this._styleAnchors.set(this._def,c),n&&this._styleAnchors.set(n,c))}}_getStyleAnchor(e){if(!e)return null;const n=this._styleAnchors.get(e);return n&&n.parentNode===this.shadowRoot?n:(n&&this._styleAnchors.delete(e),null)}_getRootStyleInsertionAnchor(e){for(let n=0;n<e.childNodes.length;n++){const r=e.childNodes[n];if(!(r instanceof HTMLStyleElement))return r}return null}_parseSlots(){const e=this._slots={};let n;for(;n=this.firstChild;){const r=n.nodeType===1&&n.getAttribute("slot")||"default";(e[r]||(e[r]=[])).push(n),this.removeChild(n)}}_renderSlots(){const e=this._getSlots(),n=this._instance.type.__scopeId;for(let r=0;r<e.length;r++){const s=e[r],i=s.getAttribute("name")||"default",o=this._slots[i],a=s.parentNode;if(o)for(const l of o){if(n&&l.nodeType===1){const c=n+"-s",u=document.createTreeWalker(l,1);l.setAttribute(c,"");let d;for(;d=u.nextNode();)d.setAttribute(c,"")}a.insertBefore(l,s)}else for(;s.firstChild;)a.insertBefore(s.firstChild,s);a.removeChild(s)}}_getSlots(){const e=[this];this._teleportTargets&&e.push(...this._teleportTargets);const n=new Set;for(const r of e){const s=r.querySelectorAll("slot");for(let i=0;i<s.length;i++)n.add(s[i])}return Array.from(n)}_injectChildStyle(e,n){this._applyStyles(e.styles,e,n)}_beginPatch(){this._patching=!0,this._dirty=!1}_endPatch(){this._patching=!1,this._dirty&&this._instance&&this._update()}_hasShadowRoot(){return this._def.shadowRoot!==!1}_removeChildStyle(e){}}const Na=t=>{const e=t.props["onUpdate:modelValue"]||!1;return $(e)?n=>kr(e,n):e};function bf(t){t.target.composing=!0}function Ma(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const ri=Symbol("_assign");function Da(t,e,n){return e&&(t=t.trim()),n&&(t=ws(t)),t}const Gr={created(t,{modifiers:{lazy:e,trim:n,number:r}},s){t[ri]=Na(s);const i=r||s.props&&s.props.type==="number";Pn(t,e?"change":"input",o=>{o.target.composing||t[ri](Da(t.value,n,i))}),(n||i)&&Pn(t,"change",()=>{t.value=Da(t.value,n,i)}),e||(Pn(t,"compositionstart",bf),Pn(t,"compositionend",Ma),Pn(t,"change",Ma))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:r,trim:s,number:i}},o){if(t[ri]=Na(o),t.composing)return;const a=(i||t.type==="number")&&!/^0\d/.test(t.value)?ws(t.value):t.value,l=e??"";if(a===l)return;const c=t.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===t&&t.type!=="range"&&(r&&e===n||s&&t.value.trim()===l)||(t.value=l)}},yf=["ctrl","shift","alt","meta"],wf={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>yf.some(n=>t[`${n}Key`]&&!e.includes(n))},si=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),r=e.join(".");return n[r]||(n[r]=(s,...i)=>{for(let o=0;o<e.length;o++){const a=wf[e[o]];if(a&&a(s,e))return}return t(s,...i)})},xf={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},za=(t,e)=>{const n=t._withKeys||(t._withKeys={}),r=e.join(".");return n[r]||(n[r]=s=>{if(!("key"in s))return;const i=nt(s.key);if(e.some(o=>o===i||xf[o]===i))return t(s)})},vf=ke({patchProp:hf},Xu);let Ba;function Fa(){return Ba||(Ba=Su(vf))}const _f=(...t)=>{Fa().render(...t)},$a=(...t)=>{const e=Fa().createApp(...t),{mount:n}=e;return e.mount=r=>{const s=Tf(r);if(!s)return;const i=e._component;!U(i)&&!i.render&&!i.template&&(i.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const o=n(s,!1,kf(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e};function kf(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function Tf(t){return we(t)?document.querySelector(t):t}const Bt=Object.create(null);Bt.open="0",Bt.close="1",Bt.ping="2",Bt.pong="3",Bt.message="4",Bt.upgrade="5",Bt.noop="6";const Yr=Object.create(null);Object.keys(Bt).forEach(t=>{Yr[Bt[t]]=t});const ii={type:"error",data:"parser error"},Ua=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Ha=typeof ArrayBuffer=="function",ja=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,oi=({type:t,data:e},n,r)=>Ua&&e instanceof Blob?n?r(e):qa(e,r):Ha&&(e instanceof ArrayBuffer||ja(e))?n?r(e):qa(new Blob([e]),r):r(Bt[t]+(e||"")),qa=(t,e)=>{const n=new FileReader;return n.onload=function(){const r=n.result.split(",")[1];e("b"+(r||""))},n.readAsDataURL(t)};function Va(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let ai;function Sf(t,e){if(Ua&&t.data instanceof Blob)return t.data.arrayBuffer().then(Va).then(e);if(Ha&&(t.data instanceof ArrayBuffer||ja(t.data)))return e(Va(t.data));oi(t,!1,n=>{ai||(ai=new TextEncoder),e(ai.encode(n))})}const Wa="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",or=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Wa.length;t++)or[Wa.charCodeAt(t)]=t;const Ef=t=>{let e=t.length*.75,n=t.length,r,s=0,i,o,a,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const c=new ArrayBuffer(e),u=new Uint8Array(c);for(r=0;r<n;r+=4)i=or[t.charCodeAt(r)],o=or[t.charCodeAt(r+1)],a=or[t.charCodeAt(r+2)],l=or[t.charCodeAt(r+3)],u[s++]=i<<2|o>>4,u[s++]=(o&15)<<4|a>>2,u[s++]=(a&3)<<6|l&63;return c},Af=typeof ArrayBuffer=="function",li=(t,e)=>{if(typeof t!="string")return{type:"message",data:Ka(t,e)};const n=t.charAt(0);return n==="b"?{type:"message",data:Rf(t.substring(1),e)}:Yr[n]?t.length>1?{type:Yr[n],data:t.substring(1)}:{type:Yr[n]}:ii},Rf=(t,e)=>{if(Af){const n=Ef(t);return Ka(n,e)}else return{base64:!0,data:t}},Ka=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Ga="",Cf=(t,e)=>{const n=t.length,r=new Array(n);let s=0;t.forEach((i,o)=>{oi(i,!1,a=>{r[o]=a,++s===n&&e(r.join(Ga))})})},Of=(t,e)=>{const n=t.split(Ga),r=[];for(let s=0;s<n.length;s++){const i=li(n[s],e);if(r.push(i),i.type==="error")break}return r};function If(){return new TransformStream({transform(t,e){Sf(t,n=>{const r=n.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const i=new DataView(s.buffer);i.setUint8(0,126),i.setUint16(1,r)}else{s=new Uint8Array(9);const i=new DataView(s.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(r))}t.data&&typeof t.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(n)})}})}let ci;function Xr(t){return t.reduce((e,n)=>e+n.length,0)}function Zr(t,e){if(t[0].length===e)return t.shift();const n=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)n[s]=t[0][r++],r===t[0].length&&(t.shift(),r=0);return t.length&&r<t[0].length&&(t[0]=t[0].slice(r)),n}function Lf(t,e){ci||(ci=new TextDecoder);const n=[];let r=0,s=-1,i=!1;return new TransformStream({transform(o,a){for(n.push(o);;){if(r===0){if(Xr(n)<1)break;const l=Zr(n,1);i=(l[0]&128)===128,s=l[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(Xr(n)<2)break;const l=Zr(n,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if(Xr(n)<8)break;const l=Zr(n,8),c=new DataView(l.buffer,l.byteOffset,l.length),u=c.getUint32(0);if(u>Math.pow(2,21)-1){a.enqueue(ii);break}s=u*Math.pow(2,32)+c.getUint32(4),r=3}else{if(Xr(n)<s)break;const l=Zr(n,s);a.enqueue(li(i?l:ci.decode(l),e)),r=0}if(s===0||s>t){a.enqueue(ii);break}}}})}const Ya=4;function Ee(t){if(t)return Pf(t)}function Pf(t){for(var e in Ee.prototype)t[e]=Ee.prototype[e];return t}Ee.prototype.on=Ee.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},Ee.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},Ee.prototype.off=Ee.prototype.removeListener=Ee.prototype.removeAllListeners=Ee.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var r,s=0;s<n.length;s++)if(r=n[s],r===e||r.fn===e){n.splice(s,1);break}return n.length===0&&delete this._callbacks["$"+t],this},Ee.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(n){n=n.slice(0);for(var r=0,s=n.length;r<s;++r)n[r].apply(this,e)}return this},Ee.prototype.emitReserved=Ee.prototype.emit,Ee.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},Ee.prototype.hasListeners=function(t){return!!this.listeners(t).length};const Jr=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,n)=>n(e,0),ht=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Nf="arraybuffer";function Pd(){}function Xa(t,...e){return e.reduce((n,r)=>(t.hasOwnProperty(r)&&(n[r]=t[r]),n),{})}const Mf=ht.setTimeout,Df=ht.clearTimeout;function Qr(t,e){e.useNativeTimers?(t.setTimeoutFn=Mf.bind(ht),t.clearTimeoutFn=Df.bind(ht)):(t.setTimeoutFn=ht.setTimeout.bind(ht),t.clearTimeoutFn=ht.clearTimeout.bind(ht))}const zf=1.33;function Bf(t){return typeof t=="string"?Ff(t):Math.ceil((t.byteLength||t.size)*zf)}function Ff(t){let e=0,n=0;for(let r=0,s=t.length;r<s;r++)e=t.charCodeAt(r),e<128?n+=1:e<2048?n+=2:e<55296||e>=57344?n+=3:(r++,n+=4);return n}function Za(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function $f(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e}function Uf(t){let e={},n=t.split("&");for(let r=0,s=n.length;r<s;r++){let i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class Hf extends Error{constructor(e,n,r){super(e),this.description=n,this.context=r,this.type="TransportError"}}class ui extends Ee{constructor(e){super(),this.writable=!1,Qr(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,n,r){return super.emitReserved("error",new Hf(e,n,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const n=li(e,this.socket.binaryType);this.onPacket(n)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,n={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(n)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const n=$f(e);return n.length?"?"+n:""}}class jf extends ui{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const n=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||n()})),this.writable||(r++,this.once("drain",function(){--r||n()}))}else n()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const n=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Of(e,this.socket.binaryType).forEach(n),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Cf(e,n=>{this.doWrite(n,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",n=this.query||{};return this.opts.timestampRequests!==!1&&(n[this.opts.timestampParam]=Za()),!this.supportsBinary&&!n.sid&&(n.b64=1),this.createUri(e,n)}}let Ja=!1;try{Ja=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const qf=Ja;function Vf(){}class Wf extends jf{constructor(e){if(super(e),typeof location<"u"){const n=location.protocol==="https:";let r=location.port;r||(r=n?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,n){const r=this.request({method:"POST",data:e});r.on("success",n),r.on("error",(s,i)=>{this.onError("xhr post error",s,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(n,r)=>{this.onError("xhr poll error",n,r)}),this.pollXhr=e}}class Ft extends Ee{constructor(e,n,r){super(),this.createRequest=e,Qr(this,r),this._opts=r,this._method=r.method||"GET",this._uri=n,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const n=Xa(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");n.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(n);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Ft.requestsCount++,Ft.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Vf,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Ft.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}if(Ft.requestsCount=0,Ft.requests={},typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Qa);else if(typeof addEventListener=="function"){const t="onpagehide"in ht?"pagehide":"unload";addEventListener(t,Qa,!1)}}function Qa(){for(let t in Ft.requests)Ft.requests.hasOwnProperty(t)&&Ft.requests[t].abort()}const Kf=function(){const t=el({xdomain:!1});return t&&t.responseType!==null}();class Gf extends Wf{constructor(e){super(e);const n=e&&e.forceBase64;this.supportsBinary=Kf&&!n}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Ft(el,this.uri(),e)}}function el(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||qf))return new XMLHttpRequest}catch{}if(!e)try{return new ht[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const tl=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Yf extends ui{get name(){return"websocket"}doOpen(){const e=this.uri(),n=this.opts.protocols,r=tl?{}:Xa(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,n,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;oi(r,this.supportsBinary,i=>{try{this.doWrite(r,i)}catch{}s&&Jr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",n=this.query||{};return this.opts.timestampRequests&&(n[this.opts.timestampParam]=Za()),this.supportsBinary||(n.b64=1),this.createUri(e,n)}}const fi=ht.WebSocket||ht.MozWebSocket;class Xf extends Yf{createSocket(e,n,r){return tl?new fi(e,n,r):n?new fi(e,n):new fi(e)}doWrite(e,n){this.ws.send(n)}}class Zf extends ui{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const n=Lf(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(n).getReader(),s=If();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const i=()=>{r.read().then(({done:a,value:l})=>{a||(this.onPacket(l),i())}).catch(a=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;this._writer.write(r).then(()=>{s&&Jr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Jf={websocket:Xf,webtransport:Zf,polling:Gf},Qf=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,eh=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function hi(t){if(t.length>8e3)throw"URI too long";const e=t,n=t.indexOf("["),r=t.indexOf("]");n!=-1&&r!=-1&&(t=t.substring(0,n)+t.substring(n,r).replace(/:/g,";")+t.substring(r,t.length));let s=Qf.exec(t||""),i={},o=14;for(;o--;)i[eh[o]]=s[o]||"";return n!=-1&&r!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=th(i,i.path),i.queryKey=nh(i,i.query),i}function th(t,e){const n=/\/{2,9}/g,r=e.replace(n,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function nh(t,e){const n={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,i){s&&(n[s]=i)}),n}const pi=typeof addEventListener=="function"&&typeof removeEventListener=="function",es=[];pi&&addEventListener("offline",()=>{es.forEach(t=>t())},!1);class on extends Ee{constructor(e,n){if(super(),this.binaryType=Nf,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(n=e,e=null),e){const r=hi(e);n.hostname=r.host,n.secure=r.protocol==="https"||r.protocol==="wss",n.port=r.port,r.query&&(n.query=r.query)}else n.host&&(n.hostname=hi(n.host).host);Qr(this,n),this.secure=n.secure!=null?n.secure:typeof location<"u"&&location.protocol==="https:",n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.hostname=n.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=n.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},n.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},n),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Uf(this.opts.query)),pi&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},es.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const n=Object.assign({},this.opts.query);n.EIO=Ya,n.transport=e,this.id&&(n.sid=this.id);const r=Object.assign({},this.opts,{query:n,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&on.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const n=this.createTransport(e);n.open(),this.setTransport(n)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",n=>this._onClose("transport close",n))}onOpen(){this.readyState="open",on.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const n=new Error("server error");n.code=e.data,this._onError(n);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let n=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(n+=Bf(s)),r>0&&n>this._maxPayload)return this.writeBuffer.slice(0,r);n+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Jr(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,n,r){return this._sendPacket("message",e,n,r),this}send(e,n,r){return this._sendPacket("message",e,n,r),this}_sendPacket(e,n,r,s){if(typeof n=="function"&&(s=n,n=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const i={type:e,data:n,options:r};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},n=()=>{this.off("upgrade",n),this.off("upgradeError",n),e()},r=()=>{this.once("upgrade",n),this.once("upgradeError",n)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(on.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,n){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),pi&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=es.indexOf(this._offlineEventListener);r!==-1&&es.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,n),this.writeBuffer=[],this._prevBufferLen=0}}}on.protocol=Ya;class rh extends on{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let n=this.createTransport(e),r=!1;on.priorWebsocketSuccess=!1;const s=()=>{r||(n.send([{type:"ping",data:"probe"}]),n.once("packet",d=>{if(!r)if(d.type==="pong"&&d.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",n),!n)return;on.priorWebsocketSuccess=n.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(u(),this.setTransport(n),n.send([{type:"upgrade"}]),this.emitReserved("upgrade",n),n=null,this.upgrading=!1,this.flush())})}else{const x=new Error("probe error");x.transport=n.name,this.emitReserved("upgradeError",x)}}))};function i(){r||(r=!0,u(),n.close(),n=null)}const o=d=>{const x=new Error("probe error: "+d);x.transport=n.name,i(),this.emitReserved("upgradeError",x)};function a(){o("transport closed")}function l(){o("socket closed")}function c(d){n&&d.name!==n.name&&i()}const u=()=>{n.removeListener("open",s),n.removeListener("error",o),n.removeListener("close",a),this.off("close",l),this.off("upgrading",c)};n.once("open",s),n.once("error",o),n.once("close",a),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||n.open()},200):n.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const n=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&n.push(e[r]);return n}}let sh=class extends rh{constructor(e,n={}){const r=typeof e=="object"?e:n;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(s=>Jf[s]).filter(s=>!!s)),super(e,r)}};function ih(t,e="",n){let r=t;n=n||typeof location<"u"&&location,t==null&&(t=n.protocol+"//"+n.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=n.protocol+t:t=n.host+t),/^(https?|wss?):\/\//.test(t)||(typeof n<"u"?t=n.protocol+"//"+t:t="https://"+t),r=hi(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const i=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port+e,r.href=r.protocol+"://"+i+(n&&n.port===r.port?"":":"+r.port),r}const oh=typeof ArrayBuffer=="function",ah=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,nl=Object.prototype.toString,lh=typeof Blob=="function"||typeof Blob<"u"&&nl.call(Blob)==="[object BlobConstructor]",ch=typeof File=="function"||typeof File<"u"&&nl.call(File)==="[object FileConstructor]";function di(t){return oh&&(t instanceof ArrayBuffer||ah(t))||lh&&t instanceof Blob||ch&&t instanceof File}function ts(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let n=0,r=t.length;n<r;n++)if(ts(t[n]))return!0;return!1}if(di(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return ts(t.toJSON(),!0);for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&ts(t[n]))return!0;return!1}function uh(t){const e=[],n=t.data,r=t;return r.data=gi(n,e),r.attachments=e.length,{packet:r,buffers:e}}function gi(t,e){if(!t)return t;if(di(t)){const n={_placeholder:!0,num:e.length};return e.push(t),n}else if(Array.isArray(t)){const n=new Array(t.length);for(let r=0;r<t.length;r++)n[r]=gi(t[r],e);return n}else if(typeof t=="object"&&!(t instanceof Date)){const n={};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=gi(t[r],e));return n}return t}function fh(t,e){return t.data=mi(t.data,e),delete t.attachments,t}function mi(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let n=0;n<t.length;n++)t[n]=mi(t[n],e);else if(typeof t=="object")for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(t[n]=mi(t[n],e));return t}const hh=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var Z;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(Z||(Z={}));class ph{constructor(e){this.replacer=e}encode(e){return(e.type===Z.EVENT||e.type===Z.ACK)&&ts(e)?this.encodeAsBinary({type:e.type===Z.EVENT?Z.BINARY_EVENT:Z.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let n=""+e.type;return(e.type===Z.BINARY_EVENT||e.type===Z.BINARY_ACK)&&(n+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(n+=e.nsp+","),e.id!=null&&(n+=e.id),e.data!=null&&(n+=JSON.stringify(e.data,this.replacer)),n}encodeAsBinary(e){const n=uh(e),r=this.encodeAsString(n.packet),s=n.buffers;return s.unshift(r),s}}class bi extends Ee{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let n;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");n=this.decodeString(e);const r=n.type===Z.BINARY_EVENT;r||n.type===Z.BINARY_ACK?(n.type=r?Z.EVENT:Z.ACK,this.reconstructor=new dh(n),n.attachments===0&&super.emitReserved("decoded",n)):super.emitReserved("decoded",n)}else if(di(e)||e.base64)if(this.reconstructor)n=this.reconstructor.takeBinaryData(e),n&&(this.reconstructor=null,super.emitReserved("decoded",n));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let n=0;const r={type:Number(e.charAt(0))};if(Z[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===Z.BINARY_EVENT||r.type===Z.BINARY_ACK){const i=n+1;for(;e.charAt(++n)!=="-"&&n!=e.length;);const o=e.substring(i,n);if(o!=Number(o)||e.charAt(n)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!gh(a)||a<0)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");r.attachments=a}if(e.charAt(n+1)==="/"){const i=n+1;for(;++n&&!(e.charAt(n)===","||n===e.length););r.nsp=e.substring(i,n)}else r.nsp="/";const s=e.charAt(n+1);if(s!==""&&Number(s)==s){const i=n+1;for(;++n;){const o=e.charAt(n);if(o==null||Number(o)!=o){--n;break}if(n===e.length)break}r.id=Number(e.substring(i,n+1))}if(e.charAt(++n)){const i=this.tryParse(e.substr(n));if(bi.isPayloadValid(r.type,i))r.data=i;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,n){switch(e){case Z.CONNECT:return rl(n);case Z.DISCONNECT:return n===void 0;case Z.CONNECT_ERROR:return typeof n=="string"||rl(n);case Z.EVENT:case Z.BINARY_EVENT:return Array.isArray(n)&&(typeof n[0]=="number"||typeof n[0]=="string"&&hh.indexOf(n[0])===-1);case Z.ACK:case Z.BINARY_ACK:return Array.isArray(n)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class dh{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const n=fh(this.reconPack,this.buffers);return this.finishedReconstruction(),n}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const gh=Number.isInteger||function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t};function rl(t){return Object.prototype.toString.call(t)==="[object Object]"}const mh=Object.freeze(Object.defineProperty({__proto__:null,Decoder:bi,Encoder:ph,get PacketType(){return Z}},Symbol.toStringTag,{value:"Module"}));function vt(t,e,n){return t.on(e,n),function(){t.off(e,n)}}const bh=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class sl extends Ee{constructor(e,n,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=n,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[vt(e,"open",this.onopen.bind(this)),vt(e,"packet",this.onpacket.bind(this)),vt(e,"error",this.onerror.bind(this)),vt(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...n){var r,s,i;if(bh.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(n.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(n),this;const o={type:Z.EVENT,data:n};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof n[n.length-1]=="function"){const u=this.ids++,d=n.pop();this._registerAckCallback(u,d),o.id=u}const a=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!a||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,n){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=n;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);n.call(this,new Error("operation has timed out"))},s),o=(...a)=>{this.io.clearTimeoutFn(i),n.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...n){return new Promise((r,s)=>{const i=(o,a)=>o?s(o):r(a);i.withError=!0,n.push(i),this.emit(e,...n)})}_addToQueue(e){let n;typeof e[e.length-1]=="function"&&(n=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...i)=>(this._queue[0],s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),n&&n(s)):(this._queue.shift(),n&&n(null,...i)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const n=this._queue[0];n.pending&&!e||(n.pending=!0,n.tryCount++,this.flags=n.flags,this.emit.apply(this,n.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:Z.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,n){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,n),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case Z.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case Z.EVENT:case Z.BINARY_EVENT:this.onevent(e);break;case Z.ACK:case Z.BINARY_ACK:this.onack(e);break;case Z.DISCONNECT:this.ondisconnect();break;case Z.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const n=e.data||[];e.id!=null&&n.push(this.ack(e.id)),this.connected?this.emitEvent(n):this.receiveBuffer.push(Object.freeze(n))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const n=this._anyListeners.slice();for(const r of n)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const n=this;let r=!1;return function(...s){r||(r=!0,n.packet({type:Z.ACK,id:e,data:s}))}}onack(e){const n=this.acks[e.id];typeof n=="function"&&(delete this.acks[e.id],n.withError&&e.data.unshift(null),n.apply(this,e.data))}onconnect(e,n){this.id=e,this.recovered=n&&this._pid===n,this._pid=n,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:Z.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const n=this._anyListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const n=this._anyOutgoingListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const n=this._anyOutgoingListeners.slice();for(const r of n)r.apply(this,e.data)}}}function Nn(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}Nn.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+n:t-n}return Math.min(t,this.max)|0},Nn.prototype.reset=function(){this.attempts=0},Nn.prototype.setMin=function(t){this.ms=t},Nn.prototype.setMax=function(t){this.max=t},Nn.prototype.setJitter=function(t){this.jitter=t};class yi extends Ee{constructor(e,n){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(n=e,e=void 0),n=n||{},n.path=n.path||"/socket.io",this.opts=n,Qr(this,n),this.reconnection(n.reconnection!==!1),this.reconnectionAttempts(n.reconnectionAttempts||1/0),this.reconnectionDelay(n.reconnectionDelay||1e3),this.reconnectionDelayMax(n.reconnectionDelayMax||5e3),this.randomizationFactor((r=n.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new Nn({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(n.timeout==null?2e4:n.timeout),this._readyState="closed",this.uri=e;const s=n.parser||mh;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=n.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var n;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(n=this.backoff)===null||n===void 0||n.setMin(e),this)}randomizationFactor(e){var n;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(n=this.backoff)===null||n===void 0||n.setJitter(e),this)}reconnectionDelayMax(e){var n;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(n=this.backoff)===null||n===void 0||n.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new sh(this.uri,this.opts);const n=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=vt(n,"open",function(){r.onopen(),e&&e()}),i=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=vt(n,"error",i);if(this._timeout!==!1){const a=this._timeout,l=this.setTimeoutFn(()=>{s(),i(new Error("timeout")),n.close()},a);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(vt(e,"ping",this.onping.bind(this)),vt(e,"data",this.ondata.bind(this)),vt(e,"error",this.onerror.bind(this)),vt(e,"close",this.onclose.bind(this)),vt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(n){this.onclose("parse error",n)}}ondecoded(e){Jr(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,n){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new sl(this,e,n),this.nsps[e]=r),r}_destroy(e){const n=Object.keys(this.nsps);for(const r of n)if(this.nsps[r].active)return;this._close()}_packet(e){const n=this.encoder.encode(e);for(let r=0;r<n.length;r++)this.engine.write(n[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,n){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,n),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const n=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},n);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const ar={};function ns(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const n=ih(t,e.path||"/socket.io"),r=n.source,s=n.id,i=n.path,o=ar[s]&&i in ar[s].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return a?l=new yi(r,e):(ar[s]||(ar[s]=new yi(r,e)),l=ar[s]),n.query&&!e.query&&(e.query=n.queryKey),l.socket(n.path,e)}Object.assign(ns,{Manager:yi,Socket:sl,io:ns,connect:ns});function wi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var wn=wi();function il(t){wn=t}var xn={exec:()=>null};function J(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(s,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(ze.caret,"$1"),n=n.replace(s,o),r},getRegex:()=>new RegExp(n,e)};return r}var yh=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),ze={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},wh=/^(?:[ \t]*(?:\n|$))+/,xh=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,vh=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,lr=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,_h=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,ol=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,al=J(ol).replace(/bull/g,xi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),kh=J(ol).replace(/bull/g,xi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),vi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Th=/^[^\n]+/,_i=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Sh=J(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",_i).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Eh=J(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xi).getRegex(),rs="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ki=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ah=J("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ki).replace("tag",rs).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ll=J(vi).replace("hr",lr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rs).getRegex(),Rh=J(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ll).getRegex(),Ti={blockquote:Rh,code:xh,def:Sh,fences:vh,heading:_h,hr:lr,html:Ah,lheading:al,list:Eh,newline:wh,paragraph:ll,table:xn,text:Th},cl=J("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",lr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rs).getRegex(),Ch={...Ti,lheading:kh,table:cl,paragraph:J(vi).replace("hr",lr).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",cl).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rs).getRegex()},Oh={...Ti,html:J(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ki).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:xn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:J(vi).replace("hr",lr).replace("heading",` *#{1,6} *[^
]`).replace("lheading",al).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ih=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Lh=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ul=/^( {2,}|\\)\n(?!\s*$)/,Ph=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Mn=/[\p{P}\p{S}]/u,ss=/[\s\p{P}\p{S}]/u,Si=/[^\s\p{P}\p{S}]/u,Nh=J(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,ss).getRegex(),fl=/(?!~)[\p{P}\p{S}]/u,Mh=/(?!~)[\s\p{P}\p{S}]/u,Dh=/(?:[^\s\p{P}\p{S}]|~)/u,zh=J(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",yh?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),hl=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Bh=J(hl,"u").replace(/punct/g,Mn).getRegex(),Fh=J(hl,"u").replace(/punct/g,fl).getRegex(),pl="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",$h=J(pl,"gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,ss).replace(/punct/g,Mn).getRegex(),Uh=J(pl,"gu").replace(/notPunctSpace/g,Dh).replace(/punctSpace/g,Mh).replace(/punct/g,fl).getRegex(),Hh=J("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,ss).replace(/punct/g,Mn).getRegex(),jh=J(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Mn).getRegex(),qh="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Vh=J(qh,"gu").replace(/notPunctSpace/g,Si).replace(/punctSpace/g,ss).replace(/punct/g,Mn).getRegex(),Wh=J(/\\(punct)/,"gu").replace(/punct/g,Mn).getRegex(),Kh=J(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Gh=J(ki).replace("(?:-->|$)","-->").getRegex(),Yh=J("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Gh).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),is=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,Xh=J(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",is).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),dl=J(/^!?\[(label)\]\[(ref)\]/).replace("label",is).replace("ref",_i).getRegex(),gl=J(/^!?\[(ref)\](?:\[\])?/).replace("ref",_i).getRegex(),Zh=J("reflink|nolink(?!\\()","g").replace("reflink",dl).replace("nolink",gl).getRegex(),ml=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ei={_backpedal:xn,anyPunctuation:Wh,autolink:Kh,blockSkip:zh,br:ul,code:Lh,del:xn,delLDelim:xn,delRDelim:xn,emStrongLDelim:Bh,emStrongRDelimAst:$h,emStrongRDelimUnd:Hh,escape:Ih,link:Xh,nolink:gl,punctuation:Nh,reflink:dl,reflinkSearch:Zh,tag:Yh,text:Ph,url:xn},Jh={...Ei,link:J(/^!?\[(label)\]\((.*?)\)/).replace("label",is).getRegex(),reflink:J(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",is).getRegex()},Ai={...Ei,emStrongRDelimAst:Uh,emStrongLDelim:Fh,delLDelim:jh,delRDelim:Vh,url:J(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",ml).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:J(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",ml).getRegex()},Qh={...Ai,br:J(ul).replace("{2,}","*").getRegex(),text:J(Ai.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},os={normal:Ti,gfm:Ch,pedantic:Oh},cr={normal:Ei,gfm:Ai,breaks:Qh,pedantic:Jh},ep={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},bl=t=>ep[t];function $t(t,e){if(e){if(ze.escapeTest.test(t))return t.replace(ze.escapeReplace,bl)}else if(ze.escapeTestNoEncode.test(t))return t.replace(ze.escapeReplaceNoEncode,bl);return t}function yl(t){try{t=encodeURI(t).replace(ze.percentDecode,"%")}catch{return null}return t}function wl(t,e){let n=t.replace(ze.findPipe,(i,o,a)=>{let l=!1,c=o;for(;--c>=0&&a[c]==="\\";)l=!l;return l?"|":" |"}),r=n.split(ze.splitPipe),s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(ze.slashPipe,"|");return r}function an(t,e,n){let r=t.length;if(r===0)return"";let s=0;for(;s<r&&t.charAt(r-s-1)===e;)s++;return t.slice(0,r-s)}function xl(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&ze.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function tp(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function np(t,e=0){let n=e,r="";for(let s of t)if(s==="	"){let i=4-n%4;r+=" ".repeat(i),n+=i}else r+=s,n++;return r}function vl(t,e,n,r,s){let i=e.href,o=e.title||null,a=t[1].replace(s.other.outputLinkReplace,"$1");r.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,l}function rp(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let s=r[1];return e.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[a]=o;return a.length>=s.length?i.slice(s.length):i}).join(`
`)}var as=class{constructor(t){fe(this,"options");fe(this,"rules");fe(this,"lexer");this.options=t||wn}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:xl(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=rp(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=an(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:an(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:an(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=an(e[0],`
`).split(`
`),r="",s="",i=[];for(;n.length>0;){let o=!1,a=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))a.push(n[l]),o=!0;else if(!o)a.push(n[l]);else break;n=n.slice(l);let c=a.join(`
`),u=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,s=s?`${s}
${u}`:u;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,i,!0),this.lexer.state.top=d,n.length===0)break;let x=i.at(-1);if(x?.type==="code")break;if(x?.type==="blockquote"){let T=x,L=T.raw+`
`+n.join(`
`),M=this.blockquote(L);i[i.length-1]=M,r=r.substring(0,r.length-T.raw.length)+M.raw,s=s.substring(0,s.length-T.text.length)+M.text;break}else if(x?.type==="list"){let T=x,L=T.raw+`
`+n.join(`
`),M=this.list(L);i[i.length-1]=M,r=r.substring(0,r.length-x.raw.length)+M.raw,s=s.substring(0,s.length-T.raw.length)+M.raw,n=L.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;t;){let l=!1,c="",u="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;c=e[0],t=t.substring(c.length);let d=np(e[2].split(`
`,1)[0],e[1].length),x=t.split(`
`,1)[0],T=!d.trim(),L=0;if(this.options.pedantic?(L=2,u=d.trimStart()):T?L=e[1].length+1:(L=d.search(this.rules.other.nonSpaceChar),L=L>4?1:L,u=d.slice(L),L+=e[1].length),T&&this.rules.other.blankLine.test(x)&&(c+=x+`
`,t=t.substring(x.length+1),l=!0),!l){let M=this.rules.other.nextBulletRegex(L),ue=this.rules.other.hrRegex(L),ee=this.rules.other.fencesBeginRegex(L),j=this.rules.other.headingBeginRegex(L),Q=this.rules.other.htmlBeginRegex(L),O=this.rules.other.blockquoteBeginRegex(L);for(;t;){let re=t.split(`
`,1)[0],Te;if(x=re,this.options.pedantic?(x=x.replace(this.rules.other.listReplaceNesting,"  "),Te=x):Te=x.replace(this.rules.other.tabCharGlobal,"    "),ee.test(x)||j.test(x)||Q.test(x)||O.test(x)||M.test(x)||ue.test(x))break;if(Te.search(this.rules.other.nonSpaceChar)>=L||!x.trim())u+=`
`+Te.slice(L);else{if(T||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||ee.test(d)||j.test(d)||ue.test(d))break;u+=`
`+x}T=!x.trim(),c+=re+`
`,t=t.substring(re.length+1),d=Te.slice(L)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0)),s.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),s.raw+=c}let a=s.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let l of s.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let c=this.rules.other.listTaskCheckbox.exec(l.raw);if(c){let u={type:"checkbox",raw:c[0]+" ",checked:c[0]!=="[ ]"};l.checked=u.checked,s.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}if(!s.loose){let c=l.tokens.filter(d=>d.type==="space"),u=c.length>0&&c.some(d=>this.rules.other.anyLine.test(d.raw));s.loose=u}}if(s.loose)for(let l of s.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){let n=xl(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:an(e[0],`
`),href:r,title:s}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=wl(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:an(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of s)i.rows.push(wl(o,i.header.length).map((a,l)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:an(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=an(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=tp(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],s="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],s=i[3])}else s=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),vl(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[r.toLowerCase()];if(!s){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return vl(n,s,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=0,c=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,e=e.slice(-1*t.length+s);(r=c.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(o=[...i].length,r[3]||r[4]){a+=o;continue}else if((r[5]||r[6])&&s%3&&!((s+o)%3)){l+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a+l);let u=[...r[0]][0].length,d=t.slice(0,s+r.index+u+o);if(Math.min(s,o)%2){let T=d.slice(1,-1);return{type:"em",raw:d,text:T,tokens:this.lexer.inlineTokens(T)}}let x=d.slice(2,-2);return{type:"strong",raw:d,text:x,tokens:this.lexer.inlineTokens(x)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+s);(r=l.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(o=[...i].length,o!==s))continue;if(r[3]||r[4]){a+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a);let c=[...r[0]][0].length,u=t.slice(0,s+r.index+c+o),d=u.slice(s,-s);return{type:"del",raw:u,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},_t=class Vi{constructor(e){fe(this,"tokens");fe(this,"options");fe(this,"state");fe(this,"inlineQueue");fe(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||wn,this.options.tokenizer=this.options.tokenizer||new as,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:ze,block:os.normal,inline:cr.normal};this.options.pedantic?(n.block=os.pedantic,n.inline=cr.pedantic):this.options.gfm&&(n.block=os.gfm,this.options.breaks?n.inline=cr.breaks:n.inline=cr.gfm),this.tokenizer.rules=n}static get rules(){return{block:os,inline:cr}}static lex(e,n){return new Vi(n).lex(e)}static lexInline(e,n){return new Vi(n).inlineTokens(e)}lex(e){e=e.replace(ze.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(ze.tabCharGlobal,"    ").replace(ze.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},e,n))?(e=e.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let a=n.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),n.push(i);continue}let o=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),c;this.options.extensions.startBlock.forEach(u=>{c=u.call({lexer:this},l),typeof c=="number"&&c>=0&&(a=Math.min(a,c))}),a<1/0&&a>=0&&(o=e.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(o))){let a=n.at(-1);r&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i),r=o.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=e,s=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(r))!==null;)c.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(r))!==null;)r=r.slice(0,s.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(s=this.tokenizer.rules.inline.blockSkip.exec(r))!==null;)i=s[2]?s[2].length:0,r=r.slice(0,s.index+i)+"["+"a".repeat(s[0].length-i-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let o=!1,a="",l=1/0;for(;e;){if(e.length<l)l=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}o||(a=""),o=!1;let c;if(this.options.extensions?.inline?.some(d=>(c=d.call({lexer:this},e,n))?(e=e.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);let d=n.at(-1);c.type==="text"&&d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(e,r,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(e,r,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),n.push(c);continue}let u=e;if(this.options.extensions?.startInline){let d=1/0,x=e.slice(1),T;this.options.extensions.startInline.forEach(L=>{T=L.call({lexer:this},x),typeof T=="number"&&T>=0&&(d=Math.min(d,T))}),d<1/0&&d>=0&&(u=e.substring(0,d+1))}if(c=this.tokenizer.inlineText(u)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(a=c.raw.slice(-1)),o=!0;let d=n.at(-1);d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):n.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},ls=class{constructor(t){fe(this,"options");fe(this,"parser");this.options=t||wn}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(ze.notSpaceStart)?.[0],s=t.replace(ze.endingNewline,"")+`
`;return r?'<pre><code class="language-'+$t(r)+'">'+(n?s:$t(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:$t(s,!0))+`</code></pre>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${$t(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let r=this.parser.parseInline(n),s=yl(t);if(s===null)return r;t=s;let i='<a href="'+t+'"';return e&&(i+=' title="'+$t(e)+'"'),i+=">"+r+"</a>",i}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let s=yl(t);if(s===null)return $t(n);t=s;let i=`<img src="${t}" alt="${$t(n)}"`;return e&&(i+=` title="${$t(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:$t(t.text)}},Ri=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},kt=class Wi{constructor(e){fe(this,"options");fe(this,"renderer");fe(this,"textRenderer");this.options=e||wn,this.options.renderer=this.options.renderer||new ls,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ri}static parse(e,n){return new Wi(n).parse(e)}static parseInline(e,n){return new Wi(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let s=e[r];if(this.options.extensions?.renderers?.[s.type]){let o=s,a=this.options.extensions.renderers[o.type].call({parser:this},o);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=a||"";continue}}let i=s;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let s=0;s<e.length;s++){let i=e[s];if(this.options.extensions?.renderers?.[i.type]){let a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){r+=a||"";continue}}let o=i;switch(o.type){case"escape":{r+=n.text(o);break}case"html":{r+=n.html(o);break}case"link":{r+=n.link(o);break}case"image":{r+=n.image(o);break}case"checkbox":{r+=n.checkbox(o);break}case"strong":{r+=n.strong(o);break}case"em":{r+=n.em(o);break}case"codespan":{r+=n.codespan(o);break}case"br":{r+=n.br(o);break}case"del":{r+=n.del(o);break}case"text":{r+=n.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},ur=(hs=class{constructor(t){fe(this,"options");fe(this,"block");this.options=t||wn}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?_t.lex:_t.lexInline}provideParser(t=this.block){return t?kt.parse:kt.parseInline}},fe(hs,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),fe(hs,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),hs),sp=class{constructor(...t){fe(this,"defaults",wi());fe(this,"options",this.setOptions);fe(this,"parse",this.parseMarkdown(!0));fe(this,"parseInline",this.parseMarkdown(!1));fe(this,"Parser",kt);fe(this,"Renderer",ls);fe(this,"TextRenderer",Ri);fe(this,"Lexer",_t);fe(this,"Tokenizer",as);fe(this,"Hooks",ur);this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{let s=r;for(let i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of s.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{let s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{let s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{let o=s[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let i=e.renderers[s.name];i?e.renderers[s.name]=function(...o){let a=s.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){let s=this.defaults.renderer||new ls(this.defaults);for(let i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,a=n.renderer[o],l=s[o];s[o]=(...c)=>{let u=a.apply(s,c);return u===!1&&(u=l.apply(s,c)),u||""}}r.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new as(this.defaults);for(let i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,a=n.tokenizer[o],l=s[o];s[o]=(...c)=>{let u=a.apply(s,c);return u===!1&&(u=l.apply(s,c)),u}}r.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new ur;for(let i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,a=n.hooks[o],l=s[o];ur.passThroughHooks.has(i)?s[o]=c=>{if(this.defaults.async&&ur.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await a.call(s,c);return l.call(s,d)})();let u=a.call(s,c);return l.call(s,u)}:s[o]=(...c)=>{if(this.defaults.async)return(async()=>{let d=await a.apply(s,c);return d===!1&&(d=await l.apply(s,c)),d})();let u=a.apply(s,c);return u===!1&&(u=l.apply(s,c)),u}}r.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),s&&(a=a.concat(s.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return _t.lex(t,e??this.defaults)}parser(t,e){return kt.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},s={...this.defaults,...r},i=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=t),s.async)return(async()=>{let o=s.hooks?await s.hooks.preprocess(e):e,a=await(s.hooks?await s.hooks.provideLexer(t):t?_t.lex:_t.lexInline)(o,s),l=s.hooks?await s.hooks.processAllTokens(a):a;s.walkTokens&&await Promise.all(this.walkTokens(l,s.walkTokens));let c=await(s.hooks?await s.hooks.provideParser(t):t?kt.parse:kt.parseInline)(l,s);return s.hooks?await s.hooks.postprocess(c):c})().catch(i);try{s.hooks&&(e=s.hooks.preprocess(e));let o=(s.hooks?s.hooks.provideLexer(t):t?_t.lex:_t.lexInline)(e,s);s.hooks&&(o=s.hooks.processAllTokens(o)),s.walkTokens&&this.walkTokens(o,s.walkTokens);let a=(s.hooks?s.hooks.provideParser(t):t?kt.parse:kt.parseInline)(o,s);return s.hooks&&(a=s.hooks.postprocess(a)),a}catch(o){return i(o)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+$t(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},vn=new sp;function oe(t,e){return vn.parse(t,e)}oe.options=oe.setOptions=function(t){return vn.setOptions(t),oe.defaults=vn.defaults,il(oe.defaults),oe},oe.getDefaults=wi,oe.defaults=wn,oe.use=function(...t){return vn.use(...t),oe.defaults=vn.defaults,il(oe.defaults),oe},oe.walkTokens=function(t,e){return vn.walkTokens(t,e)},oe.parseInline=vn.parseInline,oe.Parser=kt,oe.parser=kt.parse,oe.Renderer=ls,oe.TextRenderer=Ri,oe.Lexer=_t,oe.lexer=_t.lex,oe.Tokenizer=as,oe.Hooks=ur,oe.parse=oe,oe.options,oe.setOptions,oe.use,oe.walkTokens,oe.parseInline,kt.parse,_t.lex;/*! @license DOMPurify 3.4.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.0/LICENSE */const{entries:_l,setPrototypeOf:kl,isFrozen:ip,getPrototypeOf:op,getOwnPropertyDescriptor:ap}=Object;let{freeze:je,seal:pt,create:fr}=Object,{apply:Ci,construct:Oi}=typeof Reflect<"u"&&Reflect;je||(je=function(e){return e}),pt||(pt=function(e){return e}),Ci||(Ci=function(e,n){for(var r=arguments.length,s=new Array(r>2?r-2:0),i=2;i<r;i++)s[i-2]=arguments[i];return e.apply(n,s)}),Oi||(Oi=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return new e(...r)});const hr=Ve(Array.prototype.forEach),lp=Ve(Array.prototype.lastIndexOf),Tl=Ve(Array.prototype.pop),pr=Ve(Array.prototype.push),cp=Ve(Array.prototype.splice),cs=Ve(String.prototype.toLowerCase),Ii=Ve(String.prototype.toString),Li=Ve(String.prototype.match),Dn=Ve(String.prototype.replace),up=Ve(String.prototype.indexOf),fp=Ve(String.prototype.trim),Tt=Ve(Object.prototype.hasOwnProperty),qe=Ve(RegExp.prototype.test),dr=hp(TypeError);function Ve(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return Ci(t,e,r)}}function hp(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return Oi(t,n)}}function K(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:cs;kl&&kl(t,null);let r=e.length;for(;r--;){let s=e[r];if(typeof s=="string"){const i=n(s);i!==s&&(ip(e)||(e[r]=i),s=i)}t[s]=!0}return t}function pp(t){for(let e=0;e<t.length;e++)Tt(t,e)||(t[e]=null);return t}function Ut(t){const e=fr(null);for(const[n,r]of _l(t))Tt(t,n)&&(Array.isArray(r)?e[n]=pp(r):r&&typeof r=="object"&&r.constructor===Object?e[n]=Ut(r):e[n]=r);return e}function gr(t,e){for(;t!==null;){const r=ap(t,e);if(r){if(r.get)return Ve(r.get);if(typeof r.value=="function")return Ve(r.value)}t=op(t)}function n(){return null}return n}const Sl=je(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Pi=je(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Ni=je(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),dp=je(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Mi=je(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),gp=je(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),El=je(["#text"]),Al=je(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Di=je(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Rl=je(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),us=je(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),mp=pt(/\{\{[\w\W]*|[\w\W]*\}\}/gm),bp=pt(/<%[\w\W]*|[\w\W]*%>/gm),yp=pt(/\$\{[\w\W]*/gm),wp=pt(/^data-[\-\w.\u00B7-\uFFFF]+$/),xp=pt(/^aria-[\-\w]+$/),Cl=pt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),vp=pt(/^(?:\w+script|data):/i),_p=pt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ol=pt(/^html$/i),kp=pt(/^[a-z][.\w]*(-[.\w]+)+$/i);var Il=Object.freeze({__proto__:null,ARIA_ATTR:xp,ATTR_WHITESPACE:_p,CUSTOM_ELEMENT:kp,DATA_ATTR:wp,DOCTYPE_NAME:Ol,ERB_EXPR:bp,IS_ALLOWED_URI:Cl,IS_SCRIPT_OR_DATA:vp,MUSTACHE_EXPR:mp,TMPLIT_EXPR:yp});const mr={element:1,text:3,progressingInstruction:7,comment:8,document:9},Tp=function(){return typeof window>"u"?null:window},Sp=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null;const s="data-tt-policy-suffix";n&&n.hasAttribute(s)&&(r=n.getAttribute(s));const i="dompurify"+(r?"#"+r:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Ll=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Pl(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Tp();const e=F=>Pl(F);if(e.version="3.4.0",e.removed=[],!t||!t.document||t.document.nodeType!==mr.document||!t.Element)return e.isSupported=!1,e;let{document:n}=t;const r=n,s=r.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:a,Element:l,NodeFilter:c,NamedNodeMap:u=t.NamedNodeMap||t.MozNamedAttrMap,HTMLFormElement:d,DOMParser:x,trustedTypes:T}=t,L=l.prototype,M=gr(L,"cloneNode"),ue=gr(L,"remove"),ee=gr(L,"nextSibling"),j=gr(L,"childNodes"),Q=gr(L,"parentNode");if(typeof o=="function"){const F=n.createElement("template");F.content&&F.content.ownerDocument&&(n=F.content.ownerDocument)}let O,re="";const{implementation:Te,createNodeIterator:We,createDocumentFragment:it,getElementsByTagName:ot}=n,{importNode:Ke}=r;let be=Ll();e.isSupported=typeof _l=="function"&&typeof Q=="function"&&Te&&Te.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:dt,ERB_EXPR:gt,TMPLIT_EXPR:St,DATA_ATTR:Et,ARIA_ATTR:xe,IS_SCRIPT_OR_DATA:ae,ATTR_WHITESPACE:G,CUSTOM_ELEMENT:Ae}=Il;let{IS_ALLOWED_URI:Jt}=Il,le=null;const Ge=K({},[...Sl,...Pi,...Ni,...Mi,...El]);let de=null;const _n=K({},[...Al,...Di,...Rl,...us]);let ge=Object.seal(fr(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),at=null,Pe=null;const Ne=Object.seal(fr(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let Qt=!0,Ye=!0,ln=!1,f=!0,p=!1,g=!0,w=!1,b=!1,y=!1,R=!1,E=!1,_=!1,v=!0,z=!1;const C="user-content-";let N=!0,B=!1,q={},V=null;const se=K({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let me=null;const ve=K({},["audio","video","img","source","image","track"]);let Be=null;const Xe=K({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),mt="http://www.w3.org/1998/Math/MathML",en="http://www.w3.org/2000/svg",pe="http://www.w3.org/1999/xhtml";let Re=pe,tn=!1,Ht=null;const $i=K({},[mt,en,pe],Ii);let Bn=K({},["mi","mo","mn","ms","mtext"]),Fn=K({},["annotation-xml"]);const Ui=K({},["title","style","font","a","script"]);let kn=null;const $n=["application/xhtml+xml","text/html"],ps="text/html";let Se=null,cn=null;const Hi=n.createElement("form"),ds=function(h){return h instanceof RegExp||h instanceof Function},m=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(cn&&cn===h)){if((!h||typeof h!="object")&&(h={}),h=Ut(h),kn=$n.indexOf(h.PARSER_MEDIA_TYPE)===-1?ps:h.PARSER_MEDIA_TYPE,Se=kn==="application/xhtml+xml"?Ii:cs,le=Tt(h,"ALLOWED_TAGS")?K({},h.ALLOWED_TAGS,Se):Ge,de=Tt(h,"ALLOWED_ATTR")?K({},h.ALLOWED_ATTR,Se):_n,Ht=Tt(h,"ALLOWED_NAMESPACES")?K({},h.ALLOWED_NAMESPACES,Ii):$i,Be=Tt(h,"ADD_URI_SAFE_ATTR")?K(Ut(Xe),h.ADD_URI_SAFE_ATTR,Se):Xe,me=Tt(h,"ADD_DATA_URI_TAGS")?K(Ut(ve),h.ADD_DATA_URI_TAGS,Se):ve,V=Tt(h,"FORBID_CONTENTS")?K({},h.FORBID_CONTENTS,Se):se,at=Tt(h,"FORBID_TAGS")?K({},h.FORBID_TAGS,Se):Ut({}),Pe=Tt(h,"FORBID_ATTR")?K({},h.FORBID_ATTR,Se):Ut({}),q=Tt(h,"USE_PROFILES")?h.USE_PROFILES:!1,Qt=h.ALLOW_ARIA_ATTR!==!1,Ye=h.ALLOW_DATA_ATTR!==!1,ln=h.ALLOW_UNKNOWN_PROTOCOLS||!1,f=h.ALLOW_SELF_CLOSE_IN_ATTR!==!1,p=h.SAFE_FOR_TEMPLATES||!1,g=h.SAFE_FOR_XML!==!1,w=h.WHOLE_DOCUMENT||!1,R=h.RETURN_DOM||!1,E=h.RETURN_DOM_FRAGMENT||!1,_=h.RETURN_TRUSTED_TYPE||!1,y=h.FORCE_BODY||!1,v=h.SANITIZE_DOM!==!1,z=h.SANITIZE_NAMED_PROPS||!1,N=h.KEEP_CONTENT!==!1,B=h.IN_PLACE||!1,Jt=h.ALLOWED_URI_REGEXP||Cl,Re=h.NAMESPACE||pe,Bn=h.MATHML_TEXT_INTEGRATION_POINTS||Bn,Fn=h.HTML_INTEGRATION_POINTS||Fn,ge=h.CUSTOM_ELEMENT_HANDLING||fr(null),h.CUSTOM_ELEMENT_HANDLING&&ds(h.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ge.tagNameCheck=h.CUSTOM_ELEMENT_HANDLING.tagNameCheck),h.CUSTOM_ELEMENT_HANDLING&&ds(h.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ge.attributeNameCheck=h.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),h.CUSTOM_ELEMENT_HANDLING&&typeof h.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(ge.allowCustomizedBuiltInElements=h.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),p&&(Ye=!1),E&&(R=!0),q&&(le=K({},El),de=fr(null),q.html===!0&&(K(le,Sl),K(de,Al)),q.svg===!0&&(K(le,Pi),K(de,Di),K(de,us)),q.svgFilters===!0&&(K(le,Ni),K(de,Di),K(de,us)),q.mathMl===!0&&(K(le,Mi),K(de,Rl),K(de,us))),Ne.tagCheck=null,Ne.attributeCheck=null,h.ADD_TAGS&&(typeof h.ADD_TAGS=="function"?Ne.tagCheck=h.ADD_TAGS:(le===Ge&&(le=Ut(le)),K(le,h.ADD_TAGS,Se))),h.ADD_ATTR&&(typeof h.ADD_ATTR=="function"?Ne.attributeCheck=h.ADD_ATTR:(de===_n&&(de=Ut(de)),K(de,h.ADD_ATTR,Se))),h.ADD_URI_SAFE_ATTR&&K(Be,h.ADD_URI_SAFE_ATTR,Se),h.FORBID_CONTENTS&&(V===se&&(V=Ut(V)),K(V,h.FORBID_CONTENTS,Se)),h.ADD_FORBID_CONTENTS&&(V===se&&(V=Ut(V)),K(V,h.ADD_FORBID_CONTENTS,Se)),N&&(le["#text"]=!0),w&&K(le,["html","head","body"]),le.table&&(K(le,["tbody"]),delete at.tbody),h.TRUSTED_TYPES_POLICY){if(typeof h.TRUSTED_TYPES_POLICY.createHTML!="function")throw dr('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof h.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw dr('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');O=h.TRUSTED_TYPES_POLICY,re=O.createHTML("")}else O===void 0&&(O=Sp(T,s)),O!==null&&typeof re=="string"&&(re=O.createHTML(""));je&&je(h),cn=h}},A=K({},[...Pi,...Ni,...dp]),S=K({},[...Mi,...gp]),_e=function(h){let k=Q(h);(!k||!k.tagName)&&(k={namespaceURI:Re,tagName:"template"});const P=cs(h.tagName),ye=cs(k.tagName);return Ht[h.namespaceURI]?h.namespaceURI===en?k.namespaceURI===pe?P==="svg":k.namespaceURI===mt?P==="svg"&&(ye==="annotation-xml"||Bn[ye]):!!A[P]:h.namespaceURI===mt?k.namespaceURI===pe?P==="math":k.namespaceURI===en?P==="math"&&Fn[ye]:!!S[P]:h.namespaceURI===pe?k.namespaceURI===en&&!Fn[ye]||k.namespaceURI===mt&&!Bn[ye]?!1:!S[P]&&(Ui[P]||!A[P]):!!(kn==="application/xhtml+xml"&&Ht[h.namespaceURI]):!1},X=function(h){pr(e.removed,{element:h});try{Q(h).removeChild(h)}catch{ue(h)}},I=function(h,k){try{pr(e.removed,{attribute:k.getAttributeNode(h),from:k})}catch{pr(e.removed,{attribute:null,from:k})}if(k.removeAttribute(h),h==="is")if(R||E)try{X(k)}catch{}else try{k.setAttribute(h,"")}catch{}},jt=function(h){let k=null,P=null;if(y)h="<remove></remove>"+h;else{const Ce=Li(h,/^[\r\n\t ]+/);P=Ce&&Ce[0]}kn==="application/xhtml+xml"&&Re===pe&&(h='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+h+"</body></html>");const ye=O?O.createHTML(h):h;if(Re===pe)try{k=new x().parseFromString(ye,kn)}catch{}if(!k||!k.documentElement){k=Te.createDocument(Re,"template",null);try{k.documentElement.innerHTML=tn?re:ye}catch{}}const Fe=k.body||k.documentElement;return h&&P&&Fe.insertBefore(n.createTextNode(P),Fe.childNodes[0]||null),Re===pe?ot.call(k,w?"html":"body")[0]:w?k.documentElement:Fe},lt=function(h){return We.call(h.ownerDocument||h,h,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},un=function(h){return h instanceof d&&(typeof h.nodeName!="string"||typeof h.textContent!="string"||typeof h.removeChild!="function"||!(h.attributes instanceof u)||typeof h.removeAttribute!="function"||typeof h.setAttribute!="function"||typeof h.namespaceURI!="string"||typeof h.insertBefore!="function"||typeof h.hasChildNodes!="function")},nn=function(h){return typeof a=="function"&&h instanceof a};function et(F,h,k){hr(F,P=>{P.call(e,h,k,cn)})}const ji=function(h){let k=null;if(et(be.beforeSanitizeElements,h,null),un(h))return X(h),!0;const P=Se(h.nodeName);if(et(be.uponSanitizeElement,h,{tagName:P,allowedTags:le}),g&&h.hasChildNodes()&&!nn(h.firstElementChild)&&qe(/<[/\w!]/g,h.innerHTML)&&qe(/<[/\w!]/g,h.textContent)||g&&h.namespaceURI===pe&&P==="style"&&nn(h.firstElementChild)||h.nodeType===mr.progressingInstruction||g&&h.nodeType===mr.comment&&qe(/<[/\w]/g,h.data))return X(h),!0;if(at[P]||!(Ne.tagCheck instanceof Function&&Ne.tagCheck(P))&&!le[P]){if(!at[P]&&gs(P)&&(ge.tagNameCheck instanceof RegExp&&qe(ge.tagNameCheck,P)||ge.tagNameCheck instanceof Function&&ge.tagNameCheck(P)))return!1;if(N&&!V[P]){const ye=Q(h)||h.parentNode,Fe=j(h)||h.childNodes;if(Fe&&ye){const Ce=Fe.length;for(let tt=Ce-1;tt>=0;--tt){const ct=M(Fe[tt],!0);ct.__removalCount=(h.__removalCount||0)+1,ye.insertBefore(ct,ee(h))}}}return X(h),!0}return h instanceof l&&!_e(h)||(P==="noscript"||P==="noembed"||P==="noframes")&&qe(/<\/no(script|embed|frames)/i,h.innerHTML)?(X(h),!0):(p&&h.nodeType===mr.text&&(k=h.textContent,hr([dt,gt,St],ye=>{k=Dn(k,ye," ")}),h.textContent!==k&&(pr(e.removed,{element:h.cloneNode()}),h.textContent=k)),et(be.afterSanitizeElements,h,null),!1)},yr=function(h,k,P){if(Pe[k]||v&&(k==="id"||k==="name")&&(P in n||P in Hi))return!1;if(!(Ye&&!Pe[k]&&qe(Et,k))){if(!(Qt&&qe(xe,k))){if(!(Ne.attributeCheck instanceof Function&&Ne.attributeCheck(k,h))){if(!de[k]||Pe[k]){if(!(gs(h)&&(ge.tagNameCheck instanceof RegExp&&qe(ge.tagNameCheck,h)||ge.tagNameCheck instanceof Function&&ge.tagNameCheck(h))&&(ge.attributeNameCheck instanceof RegExp&&qe(ge.attributeNameCheck,k)||ge.attributeNameCheck instanceof Function&&ge.attributeNameCheck(k,h))||k==="is"&&ge.allowCustomizedBuiltInElements&&(ge.tagNameCheck instanceof RegExp&&qe(ge.tagNameCheck,P)||ge.tagNameCheck instanceof Function&&ge.tagNameCheck(P))))return!1}else if(!Be[k]){if(!qe(Jt,Dn(P,G,""))){if(!((k==="src"||k==="xlink:href"||k==="href")&&h!=="script"&&up(P,"data:")===0&&me[h])){if(!(ln&&!qe(ae,Dn(P,G,"")))){if(P)return!1}}}}}}}return!0},gs=function(h){return h!=="annotation-xml"&&Li(h,Ae)},Hl=function(h){et(be.beforeSanitizeAttributes,h,null);const{attributes:k}=h;if(!k||un(h))return;const P={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:de,forceKeepAttr:void 0};let ye=k.length;for(;ye--;){const Fe=k[ye],{name:Ce,namespaceURI:tt,value:ct}=Fe,fn=Se(Ce),qi=ct;let Me=Ce==="value"?qi:fp(qi);if(P.attrName=fn,P.attrValue=Me,P.keepAttr=!0,P.forceKeepAttr=void 0,et(be.uponSanitizeAttribute,h,P),Me=P.attrValue,z&&(fn==="id"||fn==="name")&&(I(Ce,h),Me=C+Me),g&&qe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,Me)){I(Ce,h);continue}if(fn==="attributename"&&Li(Me,"href")){I(Ce,h);continue}if(P.forceKeepAttr)continue;if(!P.keepAttr){I(Ce,h);continue}if(!f&&qe(/\/>/i,Me)){I(Ce,h);continue}p&&hr([dt,gt,St],Vl=>{Me=Dn(Me,Vl," ")});const ql=Se(h.nodeName);if(!yr(ql,fn,Me)){I(Ce,h);continue}if(O&&typeof T=="object"&&typeof T.getAttributeType=="function"&&!tt)switch(T.getAttributeType(ql,fn)){case"TrustedHTML":{Me=O.createHTML(Me);break}case"TrustedScriptURL":{Me=O.createScriptURL(Me);break}}if(Me!==qi)try{tt?h.setAttributeNS(tt,Ce,Me):h.setAttribute(Ce,Me),un(h)?X(h):Tl(e.removed)}catch{I(Ce,h)}}et(be.afterSanitizeAttributes,h,null)},jl=function(h){let k=null;const P=lt(h);for(et(be.beforeSanitizeShadowDOM,h,null);k=P.nextNode();)et(be.uponSanitizeShadowNode,k,null),ji(k),Hl(k),k.content instanceof i&&jl(k.content);et(be.afterSanitizeShadowDOM,h,null)};return e.sanitize=function(F){let h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},k=null,P=null,ye=null,Fe=null;if(tn=!F,tn&&(F="<!-->"),typeof F!="string"&&!nn(F))if(typeof F.toString=="function"){if(F=F.toString(),typeof F!="string")throw dr("dirty is not a string, aborting")}else throw dr("toString is not a function");if(!e.isSupported)return F;if(b||m(h),e.removed=[],typeof F=="string"&&(B=!1),B){if(F.nodeName){const ct=Se(F.nodeName);if(!le[ct]||at[ct])throw dr("root node is forbidden and cannot be sanitized in-place")}}else if(F instanceof a)k=jt("<!---->"),P=k.ownerDocument.importNode(F,!0),P.nodeType===mr.element&&P.nodeName==="BODY"||P.nodeName==="HTML"?k=P:k.appendChild(P);else{if(!R&&!p&&!w&&F.indexOf("<")===-1)return O&&_?O.createHTML(F):F;if(k=jt(F),!k)return R?null:_?re:""}k&&y&&X(k.firstChild);const Ce=lt(B?F:k);for(;ye=Ce.nextNode();)ji(ye),Hl(ye),ye.content instanceof i&&jl(ye.content);if(B)return F;if(R){if(p){k.normalize();let ct=k.innerHTML;hr([dt,gt,St],fn=>{ct=Dn(ct,fn," ")}),k.innerHTML=ct}if(E)for(Fe=it.call(k.ownerDocument);k.firstChild;)Fe.appendChild(k.firstChild);else Fe=k;return(de.shadowroot||de.shadowrootmode)&&(Fe=Ke.call(r,Fe,!0)),Fe}let tt=w?k.outerHTML:k.innerHTML;return w&&le["!doctype"]&&k.ownerDocument&&k.ownerDocument.doctype&&k.ownerDocument.doctype.name&&qe(Ol,k.ownerDocument.doctype.name)&&(tt="<!DOCTYPE "+k.ownerDocument.doctype.name+`>
`+tt),p&&hr([dt,gt,St],ct=>{tt=Dn(tt,ct," ")}),O&&_?O.createHTML(tt):tt},e.setConfig=function(){let F=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};m(F),b=!0},e.clearConfig=function(){cn=null,b=!1},e.isValidAttribute=function(F,h,k){cn||m({});const P=Se(F),ye=Se(h);return yr(P,ye,k)},e.addHook=function(F,h){typeof h=="function"&&pr(be[F],h)},e.removeHook=function(F,h){if(h!==void 0){const k=lp(be[F],h);return k===-1?void 0:cp(be[F],k,1)[0]}return Tl(be[F])},e.removeHooks=function(F){be[F]=[]},e.removeAllHooks=function(){be=Ll()},e}var Ep=Pl();oe.setOptions({breaks:!0,gfm:!0});function fs(t){if(!t)return"";const e=oe.parse(t,{async:!1});return Ep.sanitize(e,{ALLOWED_TAGS:["p","br","strong","b","em","i","code","pre","ul","ol","li","blockquote","a","h1","h2","h3","h4","h5","h6","hr","table","thead","tbody","tr","th","td","del","sup","sub","span"],ALLOWED_ATTR:["href","target","rel","class"]})}const zi="omnichat_accessToken",Bi="omnichat_refreshToken",Fi="omnichat_siteToken";let br=null,Ap="",Rp=null;function Nl(){return localStorage.getItem(zi)}function Ml(){return localStorage.getItem(Fi)}function Dl(){return localStorage.getItem(Bi)}async function Cp(){return br||(br=(async()=>{try{const t=Dl();if(!t)return!1;const e=await fetch(`${Ap}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:t})});if(!e.ok)return localStorage.removeItem(zi),localStorage.removeItem(Bi),localStorage.removeItem(Fi),Rp?.(),!1;const n=await e.json();return localStorage.setItem(zi,n.accessToken),localStorage.setItem(Bi,n.refreshToken),localStorage.setItem(Fi,n.siteToken),!0}catch{return!1}finally{br=null}})(),br)}async function Op(t,e={}){const n=Nl(),r=Ml(),s={...e.headers||{}};n&&(s.Authorization=`Bearer ${n}`),r&&(s["x-external-site-token"]=r);const i=e.body!=null;i&&!(e.body instanceof FormData)&&!s["Content-Type"]&&(s["Content-Type"]="application/json");let o=await fetch(t,{...e,headers:s});if(o.status===401&&Dl()&&await Cp()){const l={...e.headers||{}},c=Nl(),u=Ml();c&&(l.Authorization=`Bearer ${c}`),u&&(l["x-external-site-token"]=u),i&&!(e.body instanceof FormData)&&!l["Content-Type"]&&(l["Content-Type"]="application/json"),o=await fetch(t,{...e,headers:l})}return o}const Ip="omnichat_translations",Lp=1,zn="translations",zl=[{value:"en",label:"English"},{value:"zh-Hans",label:"简体中文"},{value:"zh-Hant",label:"繁體中文"},{value:"ja",label:"日本語"},{value:"ko",label:"한국어"},{value:"fr",label:"Français"},{value:"de",label:"Deutsch"},{value:"it",label:"Italiano"},{value:"es",label:"Español"},{value:"pt",label:"Português"},{value:"nl",label:"Nederlands"},{value:"pl",label:"Polski"},{value:"tr",label:"Türkçe"},{value:"ar",label:"العربية"},{value:"ru",label:"Русский"},{value:"th",label:"ไทย"},{value:"vi",label:"Tiếng Việt"},{value:"id",label:"Bahasa Indonesia"},{value:"ms",label:"Bahasa Melayu"},{value:"hi",label:"हिन्दी"}];function Pp(t){const e=localStorage.getItem(t);if(e)return e;const n=navigator.language||navigator.userLanguage||"",r=n.split("-")[0].toLowerCase();if(r==="zh")return n.toLowerCase().includes("hant")||n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans";const s=zl.find(i=>i.value===r);return s?s.value:"en"}function Bl(){return new Promise((t,e)=>{const n=indexedDB.open(Ip,Lp);n.onupgradeneeded=()=>{const r=n.result;r.objectStoreNames.contains(zn)||r.createObjectStore(zn,{keyPath:"id"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}function Fl(t,e){let n=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);n=(n<<5)-n+s,n|=0}return`${n}:${e}`}async function Np(t,e){try{const n=await Bl(),r=Fl(t,e);return new Promise((s,i)=>{const l=n.transaction(zn,"readonly").objectStore(zn).get(r);l.onsuccess=()=>{n.close(),s(l.result?.translatedText||null)},l.onerror=()=>{n.close(),i(l.error)}})}catch{return null}}async function Mp(t,e,n){try{const r=await Bl(),s=Fl(t,e);return new Promise((i,o)=>{const c=r.transaction(zn,"readwrite").objectStore(zn).put({id:s,translatedText:n,createdAt:Date.now()});c.onsuccess=()=>{r.close(),i()},c.onerror=()=>{r.close(),o(c.error)}})}catch{}}async function Dp(t,e,n){const r=await Np(e,n);if(r)return r;const s=await Op(`${t}/ai/translate`,{method:"POST",body:JSON.stringify({text:e,targetLanguage:n})});if(!s.ok){const a=await s.text();throw new Error(a||`HTTP ${s.status}`)}const o=(await s.json()).translatedText;if(!o)throw new Error("Translation returned empty result");return await Mp(e,n,o),o}const zp={key:0,style:{"font-size":"12px",opacity:"0.85","margin-top":"2px"}},Bp={style:{display:"flex","align-items":"center",gap:"8px"}},Fp={key:0,style:{position:"relative"}},$p={key:0,style:{position:"absolute",top:"100%",right:"0","margin-top":"6px",background:"white",border:"1px solid #e5e7eb","border-radius":"8px","box-shadow":"0 4px 16px rgba(0,0,0,0.12)","z-index":"100","min-width":"160px","max-height":"260px","overflow-y":"auto",padding:"4px 0"}},Up=["onClick","onMouseleave"],Hp=["title"],jp={key:0,class:"drag-overlay"},qp={key:1,class:"welcome-screen"},Vp={key:0,style:{background:"rgba(254, 226, 226, 0.8)",border:"1px solid #fca5a5",padding:"16px","border-radius":"12px","margin-bottom":"24px","text-align":"center"}},Wp={style:{color:"#7f1d1d","white-space":"pre-wrap","font-size":"14px",margin:"0"}},Kp={class:"pre-chat-form"},Gp={key:0,style:{"flex-shrink":"0",background:"#fef2f2","border-bottom":"1px solid #fecaca",padding:"8px 12px","text-align":"center"}},Yp={style:{color:"#991b1b",margin:"2px 0 0","font-size":"12px"}},Xp=["innerHTML"],Zp={class:"msg-meta"},Jp={class:"msg-time"},Qp={class:"msg-avatar"},ed=["src"],td={key:1},nd={key:0,class:"ai-label"},rd=["src","onClick"],sd=["innerHTML"],id=["innerHTML"],od={class:"msg-time"},ad=["onClick","disabled","title"],ld={key:1,class:"msg-row ai",style:{"align-self":"flex-start"}},cd={class:"msg-avatar"},ud=["src"],fd={key:1},hd={class:"msg-bubble ai ai-streaming"},pd=["innerHTML"],dd={key:2,class:"typing-hint"},gd={key:3,class:"resolved-banner"},md={key:0,class:"review-section"},bd={class:"star-rating"},yd=["onClick"],wd={key:1,class:"review-thank-you"},xd={key:0,class:"confirm-action-area"},vd={key:1,class:"input-area"},_d={key:0,style:{position:"absolute",top:"-32px",left:"12px",right:"12px",background:"#fef2f2",color:"#dc2626","font-size":"11px",padding:"4px 10px","border-radius":"6px",border:"1px solid #fecaca"}},kd=["disabled"],Td=["placeholder","disabled","onKeydown"],Sd=["disabled"],Ed=["src"],$l=200,Ul=gf(No({__name:"App.ce",props:{serverUrl:{type:String,required:!0},bubbleColor:{type:String,default:"#4F46E5"},welcomeMessage:{type:String,default:"Hello! How can we help you today?"},dataExternalToken:{type:String,default:""}},setup(t){const e=t,n=H(null),r=H(!0),s=H(null),i=H([]),o=H(""),a=H(!1),l=H(""),c=H(!1),u=H(""),d=H(null),x=H(""),T=H(!1),L=H(!1),M=H(!0),ue=H(!0);let ee=null,j=!1;function Q(){if(!d.value)return!0;const m=d.value;return m.scrollHeight-m.scrollTop-m.clientHeight<80}function O(){j||ee||(ee=requestAnimationFrame(()=>{$n(!0),ee=null}))}zr(d,(m,A)=>{A&&A.removeEventListener("scroll",B),m&&m.addEventListener("scroll",B,{passive:!0})});const re=H(""),Te=H(""),We=H("We are currently offline. Please check back later."),it=H(!1),ot=H(localStorage.getItem("omnichat_visitor_muted")==="true"),Ke=H(""),be=H(!0),dt=H("🤖"),gt=H("👨🏻‍💻"),St=H("👤");function Et(m){let A="";if(m==="ai")A=dt.value;else if(m==="agent")A=gt.value;else if(m==="visitor")A=St.value;else return{isImage:!1,value:""};if(A.startsWith("custom:")){const S=A.slice(7);return{isImage:!0,value:S.startsWith("http")?S:e.serverUrl+S}}return A.startsWith("/")||A.startsWith("http")?{isImage:!0,value:A.startsWith("http")?A:e.serverUrl+A}:{isImage:!1,value:A}}const xe=H(Pp("omnichat_visitor_translate_lang")),ae=H(!1),G=H(new Set),Ae=H({});function Jt(m){xe.value=m,localStorage.setItem("omnichat_visitor_translate_lang",m)}async function le(m){if(Ae.value[m.id]){delete Ae.value[m.id];return}if(G.value.has(m.id))return;const A=m.content||"";if(A.trim()){G.value=new Set([...G.value,m.id]);try{const S=await Dp(e.serverUrl,A,xe.value);Ae.value={...Ae.value,[m.id]:S}}catch(S){console.warn("Translation failed:",S.message)}finally{const S=new Set(G.value);S.delete(m.id),G.value=S}}}function Ge(m){ue.value&&(!m.content||m.messageType==="image"||Ae.value[m.id]||G.value.has(m.id)||le(m))}const de=new Audio;function _n(){try{const m=new(window.AudioContext||window.webkitAudioContext),A=m.createOscillator(),S=m.createGain();A.connect(S),S.connect(m.destination),A.type="sine",A.frequency.setValueAtTime(600,m.currentTime),A.frequency.exponentialRampToValueAtTime(100,m.currentTime+.1),S.gain.setValueAtTime(.5,m.currentTime),S.gain.exponentialRampToValueAtTime(.01,m.currentTime+.1),A.start(m.currentTime),A.stop(m.currentTime+.1)}catch(m){console.warn("Synthesized audio failed:",m)}}function ge(){if(!ot.value)if(Ke.value){const m=e.serverUrl.replace(/\/$/,""),A=Ke.value.startsWith("http")?Ke.value:m+Ke.value;de.src!==A&&(de.src=A),de.currentTime=0,de.play().catch(()=>_n())}else _n()}function at(){ot.value=!ot.value,localStorage.setItem("omnichat_visitor_muted",ot.value?"true":"false")}const Pe=Js(()=>re.value||e.bubbleColor),Ne=H(""),Qt=H(""),Ye=H(0),ln=H(""),f=H(!1),p=H(!1),g=H(!1),w=H(!1),b=H(0),y=H(null),R=H(null),E=H(null),_=H(""),v=H(null);async function z(){const m=e.serverUrl.replace(/\/$/,""),A=localStorage.getItem("omnichat_visitor_id");A&&localStorage.removeItem("omnichat_visitor_id");const S=A||`v_${crypto.randomUUID?.()||Math.random().toString(36).slice(2,10)}`,_e=e.dataExternalToken||window.__OMNICHAT_EXTERNAL_TOKEN__;try{const I={visitorId:S};_e&&(I.externalToken=_e);const lt=await(await fetch(`${m}/auth/visitor`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(I),credentials:"include"})).json();lt.visitorId&&(u.value=lt.visitorId)}catch{}const X=ns(e.serverUrl,{auth:{visitorId:S,externalToken:_e||void 0},transports:["websocket","polling"],withCredentials:!0});X.on("connect",()=>{const I=localStorage.getItem("omnichat_conversation_id");I&&(s.value=I,X.emit("join_conversation",{conversationId:I}))}),X.on("upload_token",I=>{R.value=I.token}),X.on("conversation_started",I=>{s.value=I.conversation.id,localStorage.setItem("omnichat_conversation_id",I.conversation.id)}),X.on("conversation_history",I=>{i.value=I.conversation.messages||[],c.value=I.conversation.status==="resolved",I.conversation.rating&&(f.value=!0),Yn(()=>$n())}),X.on("inactivity_warning",I=>{I.conversationId===s.value&&(i.value.push({id:"sys_"+Date.now(),conversationId:I.conversationId,senderType:"system",content:I.message,createdAt:new Date().toISOString()}),C(),Yn(()=>$n()))}),X.on("message_error",I=>{_.value=I.error,setTimeout(()=>_.value="",4e3)}),X.on("new_message",I=>{I.message.conversationId===s.value&&(I.message.senderType==="ai"&&T.value&&(T.value=!1,x.value="",j=!1),i.value.push(I.message),C(),(I.message.senderType==="agent"||I.message.senderType==="ai")&&ge(),Yn(()=>{$n(),r.value&&(I.message.senderType==="agent"||I.message.senderType==="ai")&&n.value?.emit("read_message",{messageId:I.message.id,conversationId:s.value}),(I.message.senderType==="agent"||I.message.senderType==="ai")&&Ge(I.message)}))}),X.on("ai_stream",I=>{I.conversationId===s.value&&(I.isComplete||(T.value=!0,x.value+=I.token,O()))}),X.on("message_read",I=>{const jt=i.value.find(lt=>lt.id===I.messageId);jt&&(jt.readAt=I.readAt)}),X.on("agent_typing",I=>{I.conversationId===s.value&&(a.value=I.isTyping,l.value=I.user)}),X.on("ip_blacklisted",I=>{I.conversationId===s.value&&(v.value={reason:I.reason})}),X.on("conversation_resolved",I=>{I.conversationId===s.value&&(c.value=!0)}),X.on("error",I=>{console.error("Visitor Error:",I.message),I.message==="Conversation not found"&&(localStorage.removeItem("omnichat_conversation_id"),s.value="",c.value=!1,i.value=[]),I.message==="Failed to resolve conversation"&&(c.value=!0)}),X.on("disconnect",()=>{}),n.value=X}function C(){i.value.length>$l&&i.value.splice(0,i.value.length-$l)}function N(m){return m?m.slice(-8).toUpperCase():""}function B(){T.value&&(j=!Q())}function q(m){!s.value||!r.value||(m.preventDefault(),b.value++,w.value=!0)}function V(m){!s.value||!r.value||m.preventDefault()}function se(m){!s.value||!r.value||(m.preventDefault(),b.value--,b.value<=0&&(b.value=0,w.value=!1))}function me(m){m.preventDefault(),b.value=0,w.value=!1,s.value&&m.dataTransfer?.files&&m.dataTransfer.files.length>0&&Re(m.dataTransfer.files[0])}function ve(m){E.value=m}function Be(){E.value=null}function Xe(){Ne.value.trim()||alert("Please provide your name to continue."),n.value?.emit("start_conversation",{visitorId:u.value,visitorName:Ne.value.trim(),visitorEmail:Qt.value.trim(),visitorCurrentUrl:window.location.href,visitorTimezone:Intl.DateTimeFormat().resolvedOptions().timeZone,visitorLanguage:navigator.language,visitorScreenRes:`${window.screen.width}x${window.screen.height}`,visitorReferrer:document.referrer||null,metadata:JSON.stringify({userAgent:navigator.userAgent})})}function mt(){y.value?.click()}function en(m,A=1200,S=.8){return new Promise((_e,X)=>{const I=new FileReader;I.readAsDataURL(m),I.onload=jt=>{const lt=new Image;lt.src=jt.target?.result,lt.onload=()=>{const un=document.createElement("canvas");let nn=lt.width,et=lt.height;nn>A&&(et=Math.round(et*A/nn),nn=A),un.width=nn,un.height=et,un.getContext("2d")?.drawImage(lt,0,0,nn,et),un.toBlob(yr=>{if(yr){const gs=m.name.replace(/\.[^/.]+$/,"")+".webp";_e(new File([yr],gs,{type:"image/webp"}))}else X(new Error("Canvas to Blob failed"))},"image/webp",S)}},I.onerror=jt=>X(jt)})}async function pe(m){const A=m.target;!A.files||A.files.length===0||await Re(A.files[0])}async function Re(m){m.size>5*1024*1024&&alert("File size exceeds 5MB limit."),g.value=!0;try{const S=m.name.toLowerCase(),_e=S.endsWith(".heic")||S.endsWith(".heif")||m.type==="image/heic"||m.type==="image/heif";if(!_e&&m.type.match(/image\/(jpeg|jpg|png|webp)/))m=await en(m,1200,.8);else if(!_e)throw new Error(`Unsupported format: ${m.type}`)}catch(S){console.error("Image processing failed",S),alert(`Failed to process image: ${S.message}.`),g.value=!1,y.value&&(y.value.value="");return}const A=new FormData;A.append("file",m),s.value&&A.append("conversationId",s.value);try{const S={};R.value&&(S.Authorization=R.value);const _e=await fetch(`${e.serverUrl}/upload`,{method:"POST",headers:S,body:A});if(!_e.ok)throw new Error("Upload failed");const X=await _e.json();X.uploadToken&&(R.value=X.uploadToken),n.value?.emit("send_message",{conversationId:s.value,content:"",messageType:"image",attachmentUrl:`${e.serverUrl}${X.url}`,attachmentThumbnailUrl:`${e.serverUrl}${X.thumbnailUrl||X.url}`})}catch(S){console.error("Upload error:",S),alert("Failed to upload file.")}finally{g.value=!1,y.value&&(y.value.value="")}}function tn(){if(!o.value.trim()||!s.value||T.value)return;const m=o.value.trim();if(m.length>100){_.value=`Message too long (${m.length}/100 characters).`,setTimeout(()=>_.value="",4e3);return}_.value="",n.value?.emit("send_message",{conversationId:s.value,content:o.value.trim(),messageType:"text"}),n.value?.emit("typing_stop",{conversationId:s.value}),o.value=""}let Ht=null;function $i(){s.value&&(n.value?.emit("typing_start",{conversationId:s.value}),Ht&&clearTimeout(Ht),Ht=setTimeout(()=>{n.value?.emit("typing_stop",{conversationId:s.value})},2e3))}function Bn(){!s.value||Ye.value===0||(n.value?.emit("submit_review",{conversationId:s.value,rating:Ye.value,review:ln.value.trim()}),f.value=!0)}function Fn(){p.value=!0}function Ui(){if(!s.value){c.value=!0,p.value=!1;return}n.value?.emit("resolve_conversation",{conversationId:s.value}),p.value=!1}function kn(){p.value=!1}function $n(m=!1){d.value&&(m?d.value.scrollTop=d.value.scrollHeight:d.value.scrollTo({top:d.value.scrollHeight,behavior:"smooth"}))}function ps(m){const A=new Date(m),S=A.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`${A.toLocaleDateString([],{month:"short",day:"numeric"})} ${S}`}function Se(){s.value=null,i.value=[],c.value=!1,f.value=!1,Ye.value=0,ln.value="",x.value="",T.value=!1,localStorage.removeItem("omnichat_conversation_id")}const cn=Js(()=>({fontSize:"10px",color:o.value.length>=85?"#dc2626":"#9ca3af",position:"absolute",bottom:"4px",right:"65px",pointerEvents:"none"}));function Hi(m){return xe.value===m.value?{background:"#eef2ff",color:"#4f46e5",fontWeight:600}:{}}$o(()=>{fetch(`${e.serverUrl}/config/active`).then(m=>m.json()).then(m=>{m.bubbleColor&&(re.value=m.bubbleColor),m.welcomeMessage&&(Te.value=m.welcomeMessage),m.offlineMessage&&(We.value=m.offlineMessage),m.isOfflineMode!==void 0&&(it.value=m.isOfflineMode),m.notificationSoundUrl&&(Ke.value=m.notificationSoundUrl),m.aiAvatar&&(dt.value=m.aiAvatar),m.agentAvatar&&(gt.value=m.agentAvatar),m.visitorAvatar&&(St.value=m.visitorAvatar),m.aiEnabled!==void 0&&(L.value=m.aiEnabled),m.translationEnabled!==void 0&&(M.value=m.translationEnabled),m.autoTranslationEnabled!==void 0&&(ue.value=m.autoTranslationEnabled),m.showVisitorWidget!==void 0&&(be.value=m.showVisitorWidget)}).catch(()=>{}),z()}),Fs(()=>{n.value?.disconnect()});function ds(){try{window.opener?window.close():window.parent!==window?window.parent.postMessage({type:"omnichat-close"},"*"):window.history.back()}catch{window.history.back()}}return(m,A)=>(W(),Y(Le,null,[be.value?(W(),Y("div",{key:0,class:"panel-wrapper",style:{left:"0px",top:"0px",width:"100vw",height:"100dvh",borderRadius:"0px",border:"none"},onDragenter:q,onDragover:V,onDragleave:se,onDrop:me},[D("div",{class:"panel-header",style:yt({backgroundColor:Pe.value})},[D("div",null,[D("h3",null,Oe(s.value?"Chat Support":"Chat with us"),1),s.value?(W(),Y("span",zp," Ticket: #"+Oe(N(s.value)),1)):st("",!0)]),D("div",Bp,[M.value?(W(),Y("div",Fp,[D("button",{type:"button",class:"close-btn",onClick:A[0]||(A[0]=S=>ae.value=!ae.value),title:"Translate",style:{"font-size":"16px"}}," 🌐 "),ae.value?(W(),Y("div",$p,[(W(!0),Y(Le,null,$s(gn(zl),S=>(W(),Y("button",{key:S.value,onClick:_e=>{Jt(S.value),ae.value=!1},style:yt([{display:"block",width:"100%","text-align":"left",padding:"6px 14px",border:"none",background:"none",cursor:"pointer","font-size":"13px",color:"#374151"},Hi(S)]),onMouseenter:A[1]||(A[1]=_e=>_e.target.style.background="#f3f4f6"),onMouseleave:_e=>_e.target.style.background=xe.value===S.value?"#eef2ff":"none"},Oe(S.label),45,Up))),128))])):st("",!0)])):st("",!0),D("button",{type:"button",class:"close-btn",onClick:at,title:ot.value?"Unmute":"Mute",style:{"font-size":"16px"}},Oe(ot.value?"🔕":"🔔"),9,Hp),D("button",{type:"button",class:"close-btn",onClick:ds,"aria-label":"Close chat"}," × ")])],4),w.value?(W(),Y("div",jp,[...A[7]||(A[7]=[D("div",{class:"drag-overlay-content"},[D("span",{style:{"font-size":"40px","margin-bottom":"12px",display:"block","text-align":"center"}},"📥"),D("span",null,"Drop file to upload")],-1)])])):st("",!0),s.value?(W(),Y(Le,{key:2},[v.value?(W(),Y("div",Gp,[A[9]||(A[9]=D("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0","font-size":"13px"}}," ⚠ You have been flagged for spam activity ",-1)),D("p",Yp,Oe(v.value.reason),1)])):st("",!0),D("div",{ref_key:"messagesArea",ref:d,class:"messages-area"},[(W(!0),Y(Le,null,$s(i.value,S=>(W(),Y("div",{key:S.id},[S.senderType==="system"?(W(),Y("div",{key:0,class:hn(["msg-bubble",S.senderType])},[D("div",{class:"md-content",innerHTML:gn(fs)(Ae.value[S.id]||S.content||"")},null,8,Xp),D("div",Zp,[D("span",Jp,Oe(ps(S.createdAt)),1)])],2)):(W(),Y("div",{key:1,class:hn(["msg-row",S.senderType])},[D("div",Qp,[Et(S.senderType).isImage?(W(),Y("img",{key:0,src:Et(S.senderType).value,alt:""},null,8,ed)):(W(),Y("span",td,Oe(Et(S.senderType).value),1))]),D("div",{class:hn(["msg-bubble",S.senderType]),style:yt(S.senderType==="visitor"?{backgroundColor:Pe.value,padding:S.messageType==="image"?"4px":""}:{padding:S.messageType==="image"?"4px":""})},[S.senderType==="ai"?(W(),Y("div",nd,"AI Agent")):st("",!0),S.messageType==="image"?(W(),Y(Le,{key:1},[D("img",{src:S.attachmentThumbnailUrl||S.attachmentUrl,alt:"Attachment",style:{"max-width":"100%","max-height":"150px","border-radius":"8px",display:"block",cursor:"pointer","object-fit":"cover"},onClick:_e=>ve(S.attachmentUrl||"")},null,8,rd),S.content?(W(),Y("div",{key:0,class:"md-content",style:{padding:"8px"},innerHTML:gn(fs)(Ae.value[S.id]||S.content)},null,8,sd)):st("",!0)],64)):(W(),Y("div",{key:2,class:"md-content",innerHTML:gn(fs)(Ae.value[S.id]||S.content||"")},null,8,id)),D("div",{class:"msg-meta",style:yt({display:"flex",alignItems:"center",justifyContent:"space-between",padding:S.messageType==="image"?"0 8px 8px 8px":""})},[D("span",od,Oe(ps(S.createdAt)),1),S.content&&S.messageType!=="image"&&M.value?(W(),Y("button",{key:0,onClick:_e=>le(S),disabled:G.value.has(S.id),style:{background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"inherit",padding:"1px 6px","border-radius":"4px","font-size":"10px",cursor:"pointer",opacity:"0.7"},title:Ae.value[S.id]?"Show original":"Translate"},Oe(G.value.has(S.id)?"...":Ae.value[S.id]?"Original":"Translate"),9,ad)):st("",!0)],4)],6)],2))]))),128))],512),T.value&&x.value?(W(),Y("div",ld,[D("div",cd,[Et("ai").isImage?(W(),Y("img",{key:0,src:Et("ai").value,alt:""},null,8,ud)):(W(),Y("span",fd,Oe(Et("ai").value),1))]),D("div",hd,[A[10]||(A[10]=D("div",{class:"ai-label"},"AI Agent",-1)),D("div",{class:"md-content",innerHTML:gn(fs)(x.value)},null,8,pd),A[11]||(A[11]=D("span",{class:"ai-cursor"},"|",-1))])])):st("",!0),a.value?(W(),Y("div",dd,[D("span",null,Oe(l.value)+" is typing",1)])):st("",!0),c.value?(W(),Y("div",gd,[A[13]||(A[13]=qr(" This conversation has been resolved. ",-1)),A[14]||(A[14]=D("br",null,null,-1)),A[15]||(A[15]=qr(" Reference Ticket: ",-1)),D("strong",null,"#"+Oe(N(s.value)),1),f.value?(W(),Y("div",wd,"Thank you for your feedback!")):(W(),Y("div",md,[A[12]||(A[12]=D("p",null,"How was your experience?",-1)),D("div",bd,[(W(),Y(Le,null,$s(5,S=>D("span",{key:S,onClick:_e=>Ye.value=S,class:hn({active:S<=Ye.value})},"★",10,yd)),64))]),Mr(D("textarea",{"onUpdate:modelValue":A[4]||(A[4]=S=>ln.value=S),placeholder:"Any comments? (Optional)",class:"form-input"},null,512),[[Gr,ln.value]]),D("button",{type:"button",class:"submit-review-btn",style:yt({backgroundColor:Pe.value}),onClick:Bn},"Submit Review",4)])),D("button",{type:"button",class:"start-new-chat-btn",onClick:Se},"Start a new chat")])):(W(),Y(Le,{key:4},[p.value?(W(),Y("div",xd,[A[16]||(A[16]=D("span",{class:"confirm-text"},"End this chat?",-1)),D("div",{class:"confirm-buttons"},[D("button",{type:"button",class:"confirm-yes-btn",onClick:Ui},"End"),D("button",{type:"button",class:"confirm-cancel-btn",onClick:kn},"Cancel")])])):(W(),Y("div",vd,[_.value?(W(),Y("div",_d,Oe(_.value),1)):st("",!0),D("button",{type:"button",class:"attachment-btn",style:{background:"transparent",border:"none","font-size":"18px",cursor:"pointer",color:"#64748b",display:"flex","align-items":"center","justify-content":"center"},disabled:g.value,onClick:mt,title:"Attach Image (Max 5MB)"},[...A[17]||(A[17]=[D("span",{style:{transform:"rotate(45deg)"}},"📎",-1)])],8,kd),D("input",{type:"file",ref_key:"fileInput",ref:y,style:{display:"none"},accept:"image/*",onChange:pe},null,544),Mr(D("textarea",{"onUpdate:modelValue":A[5]||(A[5]=S=>o.value=S),class:"msg-input",rows:"1",maxlength:"100",placeholder:g.value?"Uploading...":T.value?"AI is responding...":"Type your message...",disabled:g.value||T.value,onKeydown:[za(si(tn,["exact","prevent"]),["enter"]),za(si(()=>{},["shift","exact"]),["enter"])],onInput:$i},null,40,Td),[[Gr,o.value]]),D("span",{style:yt(cn.value)},Oe(o.value.length)+"/100",5),D("button",{type:"button",class:"send-msg-btn",style:yt({backgroundColor:Pe.value,boxShadow:"0 4px 10px "+Pe.value+"40"}),disabled:!o.value.trim()&&!g.value||T.value,onClick:tn},Oe(g.value||T.value?"...":"Send"),13,Sd),D("button",{type:"button",class:"end-chat-btn",onClick:Fn,title:"End Chat"},"✖")]))],64))],64)):(W(),Y("div",qp,[it.value&&!L.value?(W(),Y("div",Vp,[A[8]||(A[8]=D("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0 0 8px 0","font-size":"15px"}},[D("span",null,"🌙"),qr(" Agents are offline ")],-1)),D("p",Wp,Oe(We.value),1)])):(W(),Y(Le,{key:1},[D("p",null,Oe(Te.value||t.welcomeMessage),1),D("div",Kp,[Mr(D("input",{"onUpdate:modelValue":A[2]||(A[2]=S=>Ne.value=S),type:"text",placeholder:"Your Name",class:"form-input"},null,512),[[Gr,Ne.value]]),Mr(D("input",{"onUpdate:modelValue":A[3]||(A[3]=S=>Qt.value=S),type:"text",inputmode:"email",placeholder:"Your Email (Optional)",class:"form-input"},null,512),[[Gr,Qt.value]])]),D("button",{type:"button",class:"start-chat-btn",style:yt({backgroundColor:Pe.value,boxShadow:"0 4px 14px "+Pe.value+"66"}),onClick:Xe}," Start a conversation ",4)],64))]))],32)):st("",!0),E.value?(W(),Y("div",{key:1,style:{position:"fixed",inset:"0",background:"rgba(0,0,0,0.8)","z-index":"2147483647",display:"flex","align-items":"center","justify-content":"center"},onClick:Be},[A[18]||(A[18]=D("button",{style:{position:"absolute",top:"20px",right:"20px",background:"none",border:"none",color:"white","font-size":"32px",cursor:"pointer"}},"×",-1)),D("img",{src:E.value,style:{"max-width":"90vw","max-height":"90vh","object-fit":"contain","border-radius":"4px"},onClick:A[6]||(A[6]=si(()=>{},["stop"]))},null,8,Ed)])):st("",!0)],64))}}),{styles:[`*, ::before, ::after {
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
`]});return customElements.define("omnichat-chat-page",Ul),qt.OmniChatChatPage=Ul,Object.defineProperty(qt,Symbol.toStringTag,{value:"Module"}),qt}({});
