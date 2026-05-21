var OmniChatChatPage=function(Ut){"use strict";var sd=Object.defineProperty;var id=(Ut,bt,X)=>bt in Ut?sd(Ut,bt,{enumerable:!0,configurable:!0,writable:!0,value:X}):Ut[bt]=X;var ue=(Ut,bt,X)=>id(Ut,typeof bt!="symbol"?bt+"":bt,X);/**
* @vue/shared v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/var us;function bt(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const X={},wn=[],Et=()=>{},$i=()=>!1,yr=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),wr=t=>t.startsWith("onUpdate:"),we=Object.assign,fs=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Fl=Object.prototype.hasOwnProperty,ee=(t,e)=>Fl.call(t,e),F=Array.isArray,xn=t=>Fn(t)==="[object Map]",Ui=t=>Fn(t)==="[object Set]",Hi=t=>Fn(t)==="[object Date]",$=t=>typeof t=="function",be=t=>typeof t=="string",At=t=>typeof t=="symbol",oe=t=>t!==null&&typeof t=="object",ji=t=>(oe(t)||$(t))&&$(t.then)&&$(t.catch),qi=Object.prototype.toString,Fn=t=>qi.call(t),$l=t=>Fn(t).slice(8,-1),xr=t=>Fn(t)==="[object Object]",hs=t=>be(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,$n=bt(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),_r=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},Ul=/-\w/g,Ke=_r(t=>t.replace(Ul,e=>e.slice(1).toUpperCase())),Hl=/\B([A-Z])/g,ot=_r(t=>t.replace(Hl,"-$1").toLowerCase()),Vi=_r(t=>t.charAt(0).toUpperCase()+t.slice(1)),ps=_r(t=>t?`on${Vi(t)}`:""),Rt=(t,e)=>!Object.is(t,e),vr=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},Wi=(t,e,n,r=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:r,value:n})},ds=t=>{const e=parseFloat(t);return isNaN(e)?t:e},Ki=t=>{const e=be(t)?Number(t):NaN;return isNaN(e)?t:e};let Gi;const kr=()=>Gi||(Gi=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function yt(t){if(F(t)){const e={};for(let n=0;n<t.length;n++){const r=t[n],s=be(r)?Wl(r):yt(r);if(s)for(const i in s)e[i]=s[i]}return e}else if(be(t)||oe(t))return t}const jl=/;(?![^(]*\))/g,ql=/:([^]+)/,Vl=/\/\*[^]*?\*\//g;function Wl(t){const e={};return t.replace(Vl,"").split(jl).forEach(n=>{if(n){const r=n.split(ql);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}function Un(t){let e="";if(be(t))e=t;else if(F(t))for(let n=0;n<t.length;n++){const r=Un(t[n]);r&&(e+=r+" ")}else if(oe(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const Kl=bt("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function Yi(t){return!!t||t===""}function Gl(t,e){if(t.length!==e.length)return!1;let n=!0;for(let r=0;n&&r<t.length;r++)n=gs(t[r],e[r]);return n}function gs(t,e){if(t===e)return!0;let n=Hi(t),r=Hi(e);if(n||r)return n&&r?t.getTime()===e.getTime():!1;if(n=At(t),r=At(e),n||r)return t===e;if(n=F(t),r=F(e),n||r)return n&&r?Gl(t,e):!1;if(n=oe(t),r=oe(e),n||r){if(!n||!r)return!1;const s=Object.keys(t).length,i=Object.keys(e).length;if(s!==i)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!gs(t[o],e[o]))return!1}}return String(t)===String(e)}const Xi=t=>!!(t&&t.__v_isRef===!0),Ge=t=>be(t)?t:t==null?"":F(t)||oe(t)&&(t.toString===qi||!$(t.toString))?Xi(t)?Ge(t.value):JSON.stringify(t,Zi,2):String(t),Zi=(t,e)=>Xi(e)?Zi(t,e.value):xn(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[r,s],i)=>(n[ms(r,i)+" =>"]=s,n),{})}:Ui(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>ms(n))}:At(e)?ms(e):oe(e)&&!F(e)&&!xr(e)?String(e):e,ms=(t,e="")=>{var n;return At(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ye;class Yl{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=Ye,!e&&Ye&&(this.index=(Ye.scopes||(Ye.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=Ye;try{return Ye=this,e()}finally{Ye=n}}}on(){++this._on===1&&(this.prevScope=Ye,Ye=this)}off(){this._on>0&&--this._on===0&&(Ye=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function Xl(){return Ye}let fe;const bs=new WeakSet;class Ji{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Ye&&Ye.active&&Ye.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,bs.has(this)&&(bs.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||eo(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,io(this),to(this);const e=fe,n=wt;fe=this,wt=!0;try{return this.fn()}finally{no(this),fe=e,wt=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)_s(e);this.deps=this.depsTail=void 0,io(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?bs.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){xs(this)&&this.run()}get dirty(){return xs(this)}}let Qi=0,Hn,jn;function eo(t,e=!1){if(t.flags|=8,e){t.next=jn,jn=t;return}t.next=Hn,Hn=t}function ys(){Qi++}function ws(){if(--Qi>0)return;if(jn){let e=jn;for(jn=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;Hn;){let e=Hn;for(Hn=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(r){t||(t=r)}e=n}}if(t)throw t}function to(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function no(t){let e,n=t.depsTail,r=n;for(;r;){const s=r.prevDep;r.version===-1?(r===n&&(n=s),_s(r),Zl(r)):e=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}t.deps=e,t.depsTail=n}function xs(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(ro(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function ro(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===qn)||(t.globalVersion=qn,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!xs(t))))return;t.flags|=2;const e=t.dep,n=fe,r=wt;fe=t,wt=!0;try{to(t);const s=t.fn(t._value);(e.version===0||Rt(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{fe=n,wt=r,no(t),t.flags&=-3}}function _s(t,e=!1){const{dep:n,prevSub:r,nextSub:s}=t;if(r&&(r.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=r,t.nextSub=void 0),n.subs===t&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)_s(i,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function Zl(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let wt=!0;const so=[];function Ct(){so.push(wt),wt=!1}function Ot(){const t=so.pop();wt=t===void 0?!0:t}function io(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=fe;fe=void 0;try{e()}finally{fe=n}}}let qn=0;class Jl{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class vs{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!fe||!wt||fe===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==fe)n=this.activeLink=new Jl(fe,this),fe.deps?(n.prevDep=fe.depsTail,fe.depsTail.nextDep=n,fe.depsTail=n):fe.deps=fe.depsTail=n,oo(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=fe.depsTail,n.nextDep=void 0,fe.depsTail.nextDep=n,fe.depsTail=n,fe.deps===n&&(fe.deps=r)}return n}trigger(e){this.version++,qn++,this.notify(e)}notify(e){ys();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{ws()}}}function oo(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let r=e.deps;r;r=r.nextDep)oo(r)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const ks=new WeakMap,cn=Symbol(""),Ts=Symbol(""),Vn=Symbol("");function Me(t,e,n){if(wt&&fe){let r=ks.get(t);r||ks.set(t,r=new Map);let s=r.get(n);s||(r.set(n,s=new vs),s.map=r,s.key=n),s.track()}}function Ht(t,e,n,r,s,i){const o=ks.get(t);if(!o){qn++;return}const a=l=>{l&&l.trigger()};if(ys(),e==="clear")o.forEach(a);else{const l=F(t),c=l&&hs(n);if(l&&n==="length"){const f=Number(r);o.forEach((d,w)=>{(w==="length"||w===Vn||!At(w)&&w>=f)&&a(d)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(Vn)),e){case"add":l?c&&a(o.get("length")):(a(o.get(cn)),xn(t)&&a(o.get(Ts)));break;case"delete":l||(a(o.get(cn)),xn(t)&&a(o.get(Ts)));break;case"set":xn(t)&&a(o.get(cn));break}}ws()}function _n(t){const e=Z(t);return e===t?e:(Me(e,"iterate",Vn),ft(t)?e:e.map(xt))}function Tr(t){return Me(t=Z(t),"iterate",Vn),t}function It(t,e){return qt(t)?vn(un(t)?xt(e):e):xt(e)}const Ql={__proto__:null,[Symbol.iterator](){return Ss(this,Symbol.iterator,t=>It(this,t))},concat(...t){return _n(this).concat(...t.map(e=>F(e)?_n(e):e))},entries(){return Ss(this,"entries",t=>(t[1]=It(this,t[1]),t))},every(t,e){return jt(this,"every",t,e,void 0,arguments)},filter(t,e){return jt(this,"filter",t,e,n=>n.map(r=>It(this,r)),arguments)},find(t,e){return jt(this,"find",t,e,n=>It(this,n),arguments)},findIndex(t,e){return jt(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return jt(this,"findLast",t,e,n=>It(this,n),arguments)},findLastIndex(t,e){return jt(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return jt(this,"forEach",t,e,void 0,arguments)},includes(...t){return Es(this,"includes",t)},indexOf(...t){return Es(this,"indexOf",t)},join(t){return _n(this).join(t)},lastIndexOf(...t){return Es(this,"lastIndexOf",t)},map(t,e){return jt(this,"map",t,e,void 0,arguments)},pop(){return Wn(this,"pop")},push(...t){return Wn(this,"push",t)},reduce(t,...e){return ao(this,"reduce",t,e)},reduceRight(t,...e){return ao(this,"reduceRight",t,e)},shift(){return Wn(this,"shift")},some(t,e){return jt(this,"some",t,e,void 0,arguments)},splice(...t){return Wn(this,"splice",t)},toReversed(){return _n(this).toReversed()},toSorted(t){return _n(this).toSorted(t)},toSpliced(...t){return _n(this).toSpliced(...t)},unshift(...t){return Wn(this,"unshift",t)},values(){return Ss(this,"values",t=>It(this,t))}};function Ss(t,e,n){const r=Tr(t),s=r[e]();return r!==t&&!ft(t)&&(s._next=s.next,s.next=()=>{const i=s._next();return i.done||(i.value=n(i.value)),i}),s}const ec=Array.prototype;function jt(t,e,n,r,s,i){const o=Tr(t),a=o!==t&&!ft(t),l=o[e];if(l!==ec[e]){const d=l.apply(t,i);return a?xt(d):d}let c=n;o!==t&&(a?c=function(d,w){return n.call(this,It(t,d),w,t)}:n.length>2&&(c=function(d,w){return n.call(this,d,w,t)}));const f=l.call(o,c,r);return a&&s?s(f):f}function ao(t,e,n,r){const s=Tr(t),i=s!==t&&!ft(t);let o=n,a=!1;s!==t&&(i?(a=r.length===0,o=function(c,f,d){return a&&(a=!1,c=It(t,c)),n.call(this,c,It(t,f),d,t)}):n.length>3&&(o=function(c,f,d){return n.call(this,c,f,d,t)}));const l=s[e](o,...r);return a?It(t,l):l}function Es(t,e,n){const r=Z(t);Me(r,"iterate",Vn);const s=r[e](...n);return(s===-1||s===!1)&&Os(n[0])?(n[0]=Z(n[0]),r[e](...n)):s}function Wn(t,e,n=[]){Ct(),ys();const r=Z(t)[e].apply(t,n);return ws(),Ot(),r}const tc=bt("__proto__,__v_isRef,__isVue"),lo=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(At));function nc(t){At(t)||(t=String(t));const e=Z(this);return Me(e,"has",t),e.hasOwnProperty(t)}class co{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,r){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(s?i?mo:go:i?po:ho).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(r)?e:void 0;const o=F(e);if(!s){let l;if(o&&(l=Ql[n]))return l;if(n==="hasOwnProperty")return nc}const a=Reflect.get(e,n,Re(e)?e:r);if((At(n)?lo.has(n):tc(n))||(s||Me(e,"get",n),i))return a;if(Re(a)){const l=o&&hs(n)?a:a.value;return s&&oe(l)?Cs(l):l}return oe(a)?s?Cs(a):Rs(a):a}}class uo extends co{constructor(e=!1){super(!1,e)}set(e,n,r,s){let i=e[n];const o=F(e)&&hs(n);if(!this._isShallow){const c=qt(i);if(!ft(r)&&!qt(r)&&(i=Z(i),r=Z(r)),!o&&Re(i)&&!Re(r))return c||(i.value=r),!0}const a=o?Number(n)<e.length:ee(e,n),l=Reflect.set(e,n,r,Re(e)?e:s);return e===Z(s)&&(a?Rt(r,i)&&Ht(e,"set",n,r):Ht(e,"add",n,r)),l}deleteProperty(e,n){const r=ee(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&r&&Ht(e,"delete",n,void 0),s}has(e,n){const r=Reflect.has(e,n);return(!At(n)||!lo.has(n))&&Me(e,"has",n),r}ownKeys(e){return Me(e,"iterate",F(e)?"length":cn),Reflect.ownKeys(e)}}class fo extends co{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const rc=new uo,sc=new fo,ic=new uo(!0),oc=new fo(!0),As=t=>t,Sr=t=>Reflect.getPrototypeOf(t);function ac(t,e,n){return function(...r){const s=this.__v_raw,i=Z(s),o=xn(i),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=s[t](...r),f=n?As:e?vn:xt;return!e&&Me(i,"iterate",l?Ts:cn),we(Object.create(c),{next(){const{value:d,done:w}=c.next();return w?{value:d,done:w}:{value:a?[f(d[0]),f(d[1])]:f(d),done:w}}})}}function Er(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function lc(t,e){const n={get(s){const i=this.__v_raw,o=Z(i),a=Z(s);t||(Rt(s,a)&&Me(o,"get",s),Me(o,"get",a));const{has:l}=Sr(o),c=e?As:t?vn:xt;if(l.call(o,s))return c(i.get(s));if(l.call(o,a))return c(i.get(a));i!==o&&i.get(s)},get size(){const s=this.__v_raw;return!t&&Me(Z(s),"iterate",cn),s.size},has(s){const i=this.__v_raw,o=Z(i),a=Z(s);return t||(Rt(s,a)&&Me(o,"has",s),Me(o,"has",a)),s===a?i.has(s):i.has(s)||i.has(a)},forEach(s,i){const o=this,a=o.__v_raw,l=Z(a),c=e?As:t?vn:xt;return!t&&Me(l,"iterate",cn),a.forEach((f,d)=>s.call(i,c(f),c(d),o))}};return we(n,t?{add:Er("add"),set:Er("set"),delete:Er("delete"),clear:Er("clear")}:{add(s){const i=Z(this),o=Sr(i),a=Z(s),l=!e&&!ft(s)&&!qt(s)?a:s;return o.has.call(i,l)||Rt(s,l)&&o.has.call(i,s)||Rt(a,l)&&o.has.call(i,a)||(i.add(l),Ht(i,"add",l,l)),this},set(s,i){!e&&!ft(i)&&!qt(i)&&(i=Z(i));const o=Z(this),{has:a,get:l}=Sr(o);let c=a.call(o,s);c||(s=Z(s),c=a.call(o,s));const f=l.call(o,s);return o.set(s,i),c?Rt(i,f)&&Ht(o,"set",s,i):Ht(o,"add",s,i),this},delete(s){const i=Z(this),{has:o,get:a}=Sr(i);let l=o.call(i,s);l||(s=Z(s),l=o.call(i,s)),a&&a.call(i,s);const c=i.delete(s);return l&&Ht(i,"delete",s,void 0),c},clear(){const s=Z(this),i=s.size!==0,o=s.clear();return i&&Ht(s,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=ac(s,t,e)}),n}function Ar(t,e){const n=lc(t,e);return(r,s,i)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?r:Reflect.get(ee(n,s)&&s in r?n:r,s,i)}const cc={get:Ar(!1,!1)},uc={get:Ar(!1,!0)},fc={get:Ar(!0,!1)},hc={get:Ar(!0,!0)},ho=new WeakMap,po=new WeakMap,go=new WeakMap,mo=new WeakMap;function pc(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function dc(t){return t.__v_skip||!Object.isExtensible(t)?0:pc($l(t))}function Rs(t){return qt(t)?t:Rr(t,!1,rc,cc,ho)}function gc(t){return Rr(t,!1,ic,uc,po)}function Cs(t){return Rr(t,!0,sc,fc,go)}function ad(t){return Rr(t,!0,oc,hc,mo)}function Rr(t,e,n,r,s){if(!oe(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const i=dc(t);if(i===0)return t;const o=s.get(t);if(o)return o;const a=new Proxy(t,i===2?r:n);return s.set(t,a),a}function un(t){return qt(t)?un(t.__v_raw):!!(t&&t.__v_isReactive)}function qt(t){return!!(t&&t.__v_isReadonly)}function ft(t){return!!(t&&t.__v_isShallow)}function Os(t){return t?!!t.__v_raw:!1}function Z(t){const e=t&&t.__v_raw;return e?Z(e):t}function mc(t){return!ee(t,"__v_skip")&&Object.isExtensible(t)&&Wi(t,"__v_skip",!0),t}const xt=t=>oe(t)?Rs(t):t,vn=t=>oe(t)?Cs(t):t;function Re(t){return t?t.__v_isRef===!0:!1}function q(t){return bc(t,!1)}function bc(t,e){return Re(t)?t:new yc(t,e)}class yc{constructor(e,n){this.dep=new vs,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:Z(e),this._value=n?e:xt(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,r=this.__v_isShallow||ft(e)||qt(e);e=r?e:Z(e),Rt(e,n)&&(this._rawValue=e,this._value=r?e:xt(e),this.dep.trigger())}}function kn(t){return Re(t)?t.value:t}const wc={get:(t,e,n)=>e==="__v_raw"?t:kn(Reflect.get(t,e,n)),set:(t,e,n,r)=>{const s=t[e];return Re(s)&&!Re(n)?(s.value=n,!0):Reflect.set(t,e,n,r)}};function bo(t){return un(t)?t:new Proxy(t,wc)}class xc{constructor(e,n,r){this.fn=e,this.setter=n,this._value=void 0,this.dep=new vs(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=qn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&fe!==this)return eo(this,!0),!0}get value(){const e=this.dep.track();return ro(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function _c(t,e,n=!1){let r,s;return $(t)?r=t:(r=t.get,s=t.set),new xc(r,s,n)}const Cr={},Or=new WeakMap;let fn;function vc(t,e=!1,n=fn){if(n){let r=Or.get(n);r||Or.set(n,r=[]),r.push(t)}}function kc(t,e,n=X){const{immediate:r,deep:s,once:i,scheduler:o,augmentJob:a,call:l}=n,c=O=>s?O:ft(O)||s===!1||s===0?Vt(O,1):Vt(O);let f,d,w,S,I=!1,P=!1;if(Re(t)?(d=()=>t.value,I=ft(t)):un(t)?(d=()=>c(t),I=!0):F(t)?(P=!0,I=t.some(O=>un(O)||ft(O)),d=()=>t.map(O=>{if(Re(O))return O.value;if(un(O))return c(O);if($(O))return l?l(O,2):O()})):$(t)?e?d=l?()=>l(t,2):t:d=()=>{if(w){Ct();try{w()}finally{Ot()}}const O=fn;fn=f;try{return l?l(t,3,[S]):t(S)}finally{fn=O}}:d=Et,e&&s){const O=d,J=s===!0?1/0:s;d=()=>Vt(O(),J)}const ae=Xl(),Y=()=>{f.stop(),ae&&ae.active&&fs(ae.effects,f)};if(i&&e){const O=e;e=(...J)=>{O(...J),Y()}}let U=P?new Array(t.length).fill(Cr):Cr;const G=O=>{if(!(!(f.flags&1)||!f.dirty&&!O))if(e){const J=f.run();if(s||I||(P?J.some((xe,Ve)=>Rt(xe,U[Ve])):Rt(J,U))){w&&w();const xe=fn;fn=f;try{const Ve=[J,U===Cr?void 0:P&&U[0]===Cr?[]:U,S];U=J,l?l(e,3,Ve):e(...Ve)}finally{fn=xe}}}else f.run()};return a&&a(G),f=new Ji(d),f.scheduler=o?()=>o(G,!1):G,S=O=>vc(O,!1,f),w=f.onStop=()=>{const O=Or.get(f);if(O){if(l)l(O,4);else for(const J of O)J();Or.delete(f)}},e?r?G(!0):U=f.run():o?o(G.bind(null,!0),!0):f.run(),Y.pause=f.pause.bind(f),Y.resume=f.resume.bind(f),Y.stop=Y,Y}function Vt(t,e=1/0,n){if(e<=0||!oe(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,Re(t))Vt(t.value,e,n);else if(F(t))for(let r=0;r<t.length;r++)Vt(t[r],e,n);else if(Ui(t)||xn(t))t.forEach(r=>{Vt(r,e,n)});else if(xr(t)){for(const r in t)Vt(t[r],e,n);for(const r of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,r)&&Vt(t[r],e,n)}return t}/**
* @vue/runtime-core v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const Kn=[];let Is=!1;function ld(t,...e){if(Is)return;Is=!0,Ct();const n=Kn.length?Kn[Kn.length-1].component:null,r=n&&n.appContext.config.warnHandler,s=Tc();if(r)Tn(r,n,11,[t+e.map(i=>{var o,a;return(a=(o=i.toString)==null?void 0:o.call(i))!=null?a:JSON.stringify(i)}).join(""),n&&n.proxy,s.map(({vnode:i})=>`at <${pa(n,i.type)}>`).join(`
`),s]);else{const i=[`[Vue warn]: ${t}`,...e];s.length&&i.push(`
`,...Sc(s)),console.warn(...i)}Ot(),Is=!1}function Tc(){let t=Kn[Kn.length-1];if(!t)return[];const e=[];for(;t;){const n=e[0];n&&n.vnode===t?n.recurseCount++:e.push({vnode:t,recurseCount:0});const r=t.component&&t.component.parent;t=r&&r.vnode}return e}function Sc(t){const e=[];return t.forEach((n,r)=>{e.push(...r===0?[]:[`
`],...Ec(n))}),e}function Ec({vnode:t,recurseCount:e}){const n=e>0?`... (${e} recursive calls)`:"",r=t.component?t.component.parent==null:!1,s=` at <${pa(t.component,t.type,r)}`,i=">"+n;return t.props?[s,...Ac(t.props),i]:[s+i]}function Ac(t){const e=[],n=Object.keys(t);return n.slice(0,3).forEach(r=>{e.push(...yo(r,t[r]))}),n.length>3&&e.push(" ..."),e}function yo(t,e,n){return be(e)?(e=JSON.stringify(e),n?e:[`${t}=${e}`]):typeof e=="number"||typeof e=="boolean"||e==null?n?e:[`${t}=${e}`]:Re(e)?(e=yo(t,Z(e.value),!0),n?e:[`${t}=Ref<`,e,">"]):$(e)?[`${t}=fn${e.name?`<${e.name}>`:""}`]:(e=Z(e),n?e:[`${t}=`,e])}function Tn(t,e,n,r){try{return r?t(...r):t()}catch(s){Ir(s,e,n)}}function Lt(t,e,n,r){if($(t)){const s=Tn(t,e,n,r);return s&&ji(s)&&s.catch(i=>{Ir(i,e,n)}),s}if(F(t)){const s=[];for(let i=0;i<t.length;i++)s.push(Lt(t[i],e,n,r));return s}}function Ir(t,e,n,r=!0){const s=e?e.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||X;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const f=a.ec;if(f){for(let d=0;d<f.length;d++)if(f[d](t,l,c)===!1)return}a=a.parent}if(i){Ct(),Tn(i,null,10,[t,l,c]),Ot();return}}Rc(t,n,s,r,o)}function Rc(t,e,n,r=!0,s=!1){if(s)throw t;console.error(t)}const Fe=[];let Pt=-1;const Sn=[];let Qt=null,En=0;const wo=Promise.resolve();let Lr=null;function Gn(t){const e=Lr||wo;return t?e.then(this?t.bind(this):t):e}function Cc(t){let e=Pt+1,n=Fe.length;for(;e<n;){const r=e+n>>>1,s=Fe[r],i=Yn(s);i<t||i===t&&s.flags&2?e=r+1:n=r}return e}function Ls(t){if(!(t.flags&1)){const e=Yn(t),n=Fe[Fe.length-1];!n||!(t.flags&2)&&e>=Yn(n)?Fe.push(t):Fe.splice(Cc(e),0,t),t.flags|=1,xo()}}function xo(){Lr||(Lr=wo.then(ko))}function Oc(t){F(t)?Sn.push(...t):Qt&&t.id===-1?Qt.splice(En+1,0,t):t.flags&1||(Sn.push(t),t.flags|=1),xo()}function _o(t,e,n=Pt+1){for(;n<Fe.length;n++){const r=Fe[n];if(r&&r.flags&2){if(t&&r.id!==t.uid)continue;Fe.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function vo(t){if(Sn.length){const e=[...new Set(Sn)].sort((n,r)=>Yn(n)-Yn(r));if(Sn.length=0,Qt){Qt.push(...e);return}for(Qt=e,En=0;En<Qt.length;En++){const n=Qt[En];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}Qt=null,En=0}}const Yn=t=>t.id==null?t.flags&2?-1:1/0:t.id;function ko(t){try{for(Pt=0;Pt<Fe.length;Pt++){const e=Fe[Pt];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Tn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Pt<Fe.length;Pt++){const e=Fe[Pt];e&&(e.flags&=-2)}Pt=-1,Fe.length=0,vo(),Lr=null,(Fe.length||Sn.length)&&ko()}}let ht=null,To=null;function Pr(t){const e=ht;return ht=t,To=t&&t.type.__scopeId||null,e}function Ic(t,e=ht,n){if(!e||t._n)return t;const r=(...s)=>{r._d&&ia(-1);const i=Pr(e);let o;try{o=t(...s)}finally{Pr(i),r._d&&ia(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function Mr(t,e){if(ht===null)return t;const n=Vr(ht),r=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[i,o,a,l=X]=e[s];i&&($(i)&&(i={mounted:i,updated:i}),i.deep&&Vt(o),r.push({dir:i,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function hn(t,e,n,r){const s=t.dirs,i=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];i&&(a.oldValue=i[o].value);let l=a.dir[r];l&&(Ct(),Lt(l,n,8,[t.el,a,t,e]),Ot())}}function Lc(t,e){if(Ue){let n=Ue.provides;const r=Ue.parent&&Ue.parent.provides;r===n&&(n=Ue.provides=Object.create(r)),n[t]=e}}function Nr(t,e,n=!1){const r=Iu();if(r||An){let s=An?An._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&$(e)?e.call(r&&r.proxy):e}}const Pc=Symbol.for("v-scx"),Mc=()=>Nr(Pc);function Dr(t,e,n){return So(t,e,n)}function So(t,e,n=X){const{immediate:r,deep:s,flush:i,once:o}=n,a=we({},n),l=e&&r||!e&&i!=="post";let c;if(sr){if(i==="sync"){const S=Mc();c=S.__watcherHandles||(S.__watcherHandles=[])}else if(!l){const S=()=>{};return S.stop=Et,S.resume=Et,S.pause=Et,S}}const f=Ue;a.call=(S,I,P)=>Lt(S,f,I,P);let d=!1;i==="post"?a.scheduler=S=>{Xe(S,f&&f.suspense)}:i!=="sync"&&(d=!0,a.scheduler=(S,I)=>{I?S():Ls(S)}),a.augmentJob=S=>{e&&(S.flags|=4),d&&(S.flags|=2,f&&(S.id=f.uid,S.i=f))};const w=kc(t,e,a);return sr&&(c?c.push(w):l&&w()),w}function Nc(t,e,n){const r=this.proxy,s=be(t)?t.includes(".")?Eo(r,t):()=>r[t]:t.bind(r,r);let i;$(e)?i=e:(i=e.handler,n=e);const o=rr(this),a=So(s,i.bind(r),n);return o(),a}function Eo(t,e){const n=e.split(".");return()=>{let r=t;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}const Dc=Symbol("_vte"),zc=t=>t.__isTeleport,Bc=Symbol("_leaveCb");function Ps(t,e){t.shapeFlag&6&&t.component?(t.transition=e,Ps(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function Ao(t,e){return $(t)?we({name:t.name},e,{setup:t}):t}function Ro(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function Co(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const zr=new WeakMap;function Xn(t,e,n,r,s=!1){if(F(t)){t.forEach((P,ae)=>Xn(P,e&&(F(e)?e[ae]:e),n,r,s));return}if(Zn(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Xn(t,e,n,r.component.subTree);return}const i=r.shapeFlag&4?Vr(r.component):r.el,o=s?null:i,{i:a,r:l}=t,c=e&&e.r,f=a.refs===X?a.refs={}:a.refs,d=a.setupState,w=Z(d),S=d===X?$i:P=>Co(f,P)?!1:ee(w,P),I=(P,ae)=>!(ae&&Co(f,ae));if(c!=null&&c!==l){if(Oo(e),be(c))f[c]=null,S(c)&&(d[c]=null);else if(Re(c)){const P=e;I(c,P.k)&&(c.value=null),P.k&&(f[P.k]=null)}}if($(l))Tn(l,a,12,[o,f]);else{const P=be(l),ae=Re(l);if(P||ae){const Y=()=>{if(t.f){const U=P?S(l)?d[l]:f[l]:I()||!t.k?l.value:f[t.k];if(s)F(U)&&fs(U,i);else if(F(U))U.includes(i)||U.push(i);else if(P)f[l]=[i],S(l)&&(d[l]=f[l]);else{const G=[i];I(l,t.k)&&(l.value=G),t.k&&(f[t.k]=G)}}else P?(f[l]=o,S(l)&&(d[l]=o)):ae&&(I(l,t.k)&&(l.value=o),t.k&&(f[t.k]=o))};if(o){const U=()=>{Y(),zr.delete(t)};U.id=-1,zr.set(t,U),Xe(U,n)}else Oo(t),Y()}}}function Oo(t){const e=zr.get(t);e&&(e.flags|=8,zr.delete(t))}kr().requestIdleCallback,kr().cancelIdleCallback;const Zn=t=>!!t.type.__asyncLoader,Io=t=>t.type.__isKeepAlive;function Fc(t,e){Lo(t,"a",e)}function $c(t,e){Lo(t,"da",e)}function Lo(t,e,n=Ue){const r=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(Br(e,r,n),n){let s=n.parent;for(;s&&s.parent;)Io(s.parent.vnode)&&Uc(r,e,n,s),s=s.parent}}function Uc(t,e,n,r){const s=Br(e,t,r,!0);Ms(()=>{fs(r[e],s)},n)}function Br(t,e,n=Ue,r=!1){if(n){const s=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{Ct();const a=rr(n),l=Lt(e,n,t,o);return a(),Ot(),l});return r?s.unshift(i):s.push(i),i}}const Wt=t=>(e,n=Ue)=>{(!sr||t==="sp")&&Br(t,(...r)=>e(...r),n)},Hc=Wt("bm"),Po=Wt("m"),jc=Wt("bu"),qc=Wt("u"),Vc=Wt("bum"),Ms=Wt("um"),Wc=Wt("sp"),Kc=Wt("rtg"),Gc=Wt("rtc");function Yc(t,e=Ue){Br("ec",t,e)}const Xc=Symbol.for("v-ndc");function Ns(t,e,n,r){let s;const i=n,o=F(t);if(o||be(t)){const a=o&&un(t);let l=!1,c=!1;a&&(l=!ft(t),c=qt(t),t=Tr(t)),s=new Array(t.length);for(let f=0,d=t.length;f<d;f++)s[f]=e(l?c?vn(xt(t[f])):xt(t[f]):t[f],f,void 0,i)}else if(typeof t=="number"){s=new Array(t);for(let a=0;a<t;a++)s[a]=e(a+1,a,void 0,i)}else if(oe(t))if(t[Symbol.iterator])s=Array.from(t,(a,l)=>e(a,l,void 0,i));else{const a=Object.keys(t);s=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const f=a[l];s[l]=e(t[f],f,l,i)}}else s=[];return s}const Ds=t=>t?ua(t)?Vr(t):Ds(t.parent):null,Jn=we(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>Ds(t.parent),$root:t=>Ds(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>zo(t),$forceUpdate:t=>t.f||(t.f=()=>{Ls(t.update)}),$nextTick:t=>t.n||(t.n=Gn.bind(t.proxy)),$watch:t=>Nc.bind(t)}),zs=(t,e)=>t!==X&&!t.__isScriptSetup&&ee(t,e),Zc={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:i,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const w=o[e];if(w!==void 0)switch(w){case 1:return r[e];case 2:return s[e];case 4:return n[e];case 3:return i[e]}else{if(zs(r,e))return o[e]=1,r[e];if(s!==X&&ee(s,e))return o[e]=2,s[e];if(ee(i,e))return o[e]=3,i[e];if(n!==X&&ee(n,e))return o[e]=4,n[e];Bs&&(o[e]=0)}}const c=Jn[e];let f,d;if(c)return e==="$attrs"&&Me(t.attrs,"get",""),c(t);if((f=a.__cssModules)&&(f=f[e]))return f;if(n!==X&&ee(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,ee(d,e))return d[e]},set({_:t},e,n){const{data:r,setupState:s,ctx:i}=t;return zs(s,e)?(s[e]=n,!0):r!==X&&ee(r,e)?(r[e]=n,!0):ee(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:r,appContext:s,props:i,type:o}},a){let l;return!!(n[a]||t!==X&&a[0]!=="$"&&ee(t,a)||zs(e,a)||ee(i,a)||ee(r,a)||ee(Jn,a)||ee(s.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:ee(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Mo(t){return F(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Bs=!0;function Jc(t){const e=zo(t),n=t.proxy,r=t.ctx;Bs=!1,e.beforeCreate&&No(e.beforeCreate,t,"bc");const{data:s,computed:i,methods:o,watch:a,provide:l,inject:c,created:f,beforeMount:d,mounted:w,beforeUpdate:S,updated:I,activated:P,deactivated:ae,beforeDestroy:Y,beforeUnmount:U,destroyed:G,unmounted:O,render:J,renderTracked:xe,renderTriggered:Ve,errorCaptured:lt,serverPrefetch:ct,expose:We,inheritAttrs:ge,components:Ze,directives:Je,filters:Oe}=e;if(c&&Qc(c,r,null),o)for(const le in o){const ne=o[le];$(ne)&&(r[le]=ne.bind(n))}if(s){const le=s.call(n,n);oe(le)&&(t.data=Rs(le))}if(Bs=!0,i)for(const le in i){const ne=i[le],et=$(ne)?ne.bind(n,n):$(ne.get)?ne.get.bind(n,n):Et,Yt=!$(ne)&&$(ne.set)?ne.set.bind(n):Et,ce=Ks({get:et,set:Yt});Object.defineProperty(r,le,{enumerable:!0,configurable:!0,get:()=>ce.value,set:_e=>ce.value=_e})}if(a)for(const le in a)Do(a[le],r,n,le);if(l){const le=$(l)?l.call(n):l;Reflect.ownKeys(le).forEach(ne=>{Lc(ne,le[ne])})}f&&No(f,t,"c");function Se(le,ne){F(ne)?ne.forEach(et=>le(et.bind(n))):ne&&le(ne.bind(n))}if(Se(Hc,d),Se(Po,w),Se(jc,S),Se(qc,I),Se(Fc,P),Se($c,ae),Se(Yc,lt),Se(Gc,xe),Se(Kc,Ve),Se(Vc,U),Se(Ms,O),Se(Wc,ct),F(We))if(We.length){const le=t.exposed||(t.exposed={});We.forEach(ne=>{Object.defineProperty(le,ne,{get:()=>n[ne],set:et=>n[ne]=et,enumerable:!0})})}else t.exposed||(t.exposed={});J&&t.render===Et&&(t.render=J),ge!=null&&(t.inheritAttrs=ge),Ze&&(t.components=Ze),Je&&(t.directives=Je),ct&&Ro(t)}function Qc(t,e,n=Et){F(t)&&(t=Fs(t));for(const r in t){const s=t[r];let i;oe(s)?"default"in s?i=Nr(s.from||r,s.default,!0):i=Nr(s.from||r):i=Nr(s),Re(i)?Object.defineProperty(e,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[r]=i}}function No(t,e,n){Lt(F(t)?t.map(r=>r.bind(e.proxy)):t.bind(e.proxy),e,n)}function Do(t,e,n,r){let s=r.includes(".")?Eo(n,r):()=>n[r];if(be(t)){const i=e[t];$(i)&&Dr(s,i)}else if($(t))Dr(s,t.bind(n));else if(oe(t))if(F(t))t.forEach(i=>Do(i,e,n,r));else{const i=$(t.handler)?t.handler.bind(n):e[t.handler];$(i)&&Dr(s,i,t)}}function zo(t){const e=t.type,{mixins:n,extends:r}=e,{mixins:s,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,a=i.get(e);let l;return a?l=a:!s.length&&!n&&!r?l=e:(l={},s.length&&s.forEach(c=>Fr(l,c,o,!0)),Fr(l,e,o)),oe(e)&&i.set(e,l),l}function Fr(t,e,n,r=!1){const{mixins:s,extends:i}=e;i&&Fr(t,i,n,!0),s&&s.forEach(o=>Fr(t,o,n,!0));for(const o in e)if(!(r&&o==="expose")){const a=eu[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const eu={data:Bo,props:Fo,emits:Fo,methods:Qn,computed:Qn,beforeCreate:$e,created:$e,beforeMount:$e,mounted:$e,beforeUpdate:$e,updated:$e,beforeDestroy:$e,beforeUnmount:$e,destroyed:$e,unmounted:$e,activated:$e,deactivated:$e,errorCaptured:$e,serverPrefetch:$e,components:Qn,directives:Qn,watch:nu,provide:Bo,inject:tu};function Bo(t,e){return e?t?function(){return we($(t)?t.call(this,this):t,$(e)?e.call(this,this):e)}:e:t}function tu(t,e){return Qn(Fs(t),Fs(e))}function Fs(t){if(F(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function $e(t,e){return t?[...new Set([].concat(t,e))]:e}function Qn(t,e){return t?we(Object.create(null),t,e):e}function Fo(t,e){return t?F(t)&&F(e)?[...new Set([...t,...e])]:we(Object.create(null),Mo(t),Mo(e??{})):e}function nu(t,e){if(!t)return e;if(!e)return t;const n=we(Object.create(null),t);for(const r in e)n[r]=$e(t[r],e[r]);return n}function $o(){return{app:null,config:{isNativeTag:$i,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let ru=0;function su(t,e){return function(r,s=null){$(r)||(r=we({},r)),s!=null&&!oe(s)&&(s=null);const i=$o(),o=new WeakSet,a=[];let l=!1;const c=i.app={_uid:ru++,_component:r,_props:s,_container:null,_context:i,_instance:null,version:$u,get config(){return i.config},set config(f){},use(f,...d){return o.has(f)||(f&&$(f.install)?(o.add(f),f.install(c,...d)):$(f)&&(o.add(f),f(c,...d))),c},mixin(f){return i.mixins.includes(f)||i.mixins.push(f),c},component(f,d){return d?(i.components[f]=d,c):i.components[f]},directive(f,d){return d?(i.directives[f]=d,c):i.directives[f]},mount(f,d,w){if(!l){const S=c._ceVNode||Mt(r,s);return S.appContext=i,w===!0?w="svg":w===!1&&(w=void 0),t(S,f,w),l=!0,c._container=f,f.__vue_app__=c,Vr(S.component)}},onUnmount(f){a.push(f)},unmount(){l&&(Lt(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(f,d){return i.provides[f]=d,c},runWithContext(f){const d=An;An=c;try{return f()}finally{An=d}}};return c}}let An=null;const iu=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${Ke(e)}Modifiers`]||t[`${ot(e)}Modifiers`];function ou(t,e,...n){if(t.isUnmounted)return;const r=t.vnode.props||X;let s=n;const i=e.startsWith("update:"),o=i&&iu(r,e.slice(7));o&&(o.trim&&(s=n.map(f=>be(f)?f.trim():f)),o.number&&(s=n.map(ds)));let a,l=r[a=ps(e)]||r[a=ps(Ke(e))];!l&&i&&(l=r[a=ps(ot(e))]),l&&Lt(l,t,6,s);const c=r[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,Lt(c,t,6,s)}}const au=new WeakMap;function Uo(t,e,n=!1){const r=n?au:e.emitsCache,s=r.get(t);if(s!==void 0)return s;const i=t.emits;let o={},a=!1;if(!$(t)){const l=c=>{const f=Uo(c,e,!0);f&&(a=!0,we(o,f))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!i&&!a?(oe(t)&&r.set(t,null),null):(F(i)?i.forEach(l=>o[l]=null):we(o,i),oe(t)&&r.set(t,o),o)}function $r(t,e){return!t||!yr(e)?!1:(e=e.slice(2).replace(/Once$/,""),ee(t,e[0].toLowerCase()+e.slice(1))||ee(t,ot(e))||ee(t,e))}function cd(){}function Ho(t){const{type:e,vnode:n,proxy:r,withProxy:s,propsOptions:[i],slots:o,attrs:a,emit:l,render:c,renderCache:f,props:d,data:w,setupState:S,ctx:I,inheritAttrs:P}=t,ae=Pr(t);let Y,U;try{if(n.shapeFlag&4){const O=s||r,J=O;Y=Nt(c.call(J,O,f,d,S,w,I)),U=a}else{const O=e;Y=Nt(O.length>1?O(d,{attrs:a,slots:o,emit:l}):O(d,null)),U=e.props?a:lu(a)}}catch(O){er.length=0,Ir(O,t,1),Y=Mt(en)}let G=Y;if(U&&P!==!1){const O=Object.keys(U),{shapeFlag:J}=G;O.length&&J&7&&(i&&O.some(wr)&&(U=cu(U,i)),G=Rn(G,U,!1,!0))}return n.dirs&&(G=Rn(G,null,!1,!0),G.dirs=G.dirs?G.dirs.concat(n.dirs):n.dirs),n.transition&&Ps(G,n.transition),Y=G,Pr(ae),Y}const lu=t=>{let e;for(const n in t)(n==="class"||n==="style"||yr(n))&&((e||(e={}))[n]=t[n]);return e},cu=(t,e)=>{const n={};for(const r in t)(!wr(r)||!(r.slice(9)in e))&&(n[r]=t[r]);return n};function uu(t,e,n){const{props:r,children:s,component:i}=t,{props:o,children:a,patchFlag:l}=e,c=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return r?jo(r,o,c):!!o;if(l&8){const f=e.dynamicProps;for(let d=0;d<f.length;d++){const w=f[d];if(qo(o,r,w)&&!$r(c,w))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===o?!1:r?o?jo(r,o,c):!0:!!o;return!1}function jo(t,e,n){const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!0;for(let s=0;s<r.length;s++){const i=r[s];if(qo(e,t,i)&&!$r(n,i))return!0}return!1}function qo(t,e,n){const r=t[n],s=e[n];return n==="style"&&oe(r)&&oe(s)?!gs(r,s):r!==s}function fu({vnode:t,parent:e,suspense:n},r){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=r,t=s),s===t)(t=e.vnode).el=r,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=r)}const Vo={},Wo=()=>Object.create(Vo),Ko=t=>Object.getPrototypeOf(t)===Vo;function hu(t,e,n,r=!1){const s={},i=Wo();t.propsDefaults=Object.create(null),Go(t,e,s,i);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=r?s:gc(s):t.type.props?t.props=s:t.props=i,t.attrs=i}function pu(t,e,n,r){const{props:s,attrs:i,vnode:{patchFlag:o}}=t,a=Z(s),[l]=t.propsOptions;let c=!1;if((r||o>0)&&!(o&16)){if(o&8){const f=t.vnode.dynamicProps;for(let d=0;d<f.length;d++){let w=f[d];if($r(t.emitsOptions,w))continue;const S=e[w];if(l)if(ee(i,w))S!==i[w]&&(i[w]=S,c=!0);else{const I=Ke(w);s[I]=$s(l,a,I,S,t,!1)}else S!==i[w]&&(i[w]=S,c=!0)}}}else{Go(t,e,s,i)&&(c=!0);let f;for(const d in a)(!e||!ee(e,d)&&((f=ot(d))===d||!ee(e,f)))&&(l?n&&(n[d]!==void 0||n[f]!==void 0)&&(s[d]=$s(l,a,d,void 0,t,!0)):delete s[d]);if(i!==a)for(const d in i)(!e||!ee(e,d))&&(delete i[d],c=!0)}c&&Ht(t.attrs,"set","")}function Go(t,e,n,r){const[s,i]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if($n(l))continue;const c=e[l];let f;s&&ee(s,f=Ke(l))?!i||!i.includes(f)?n[f]=c:(a||(a={}))[f]=c:$r(t.emitsOptions,l)||(!(l in r)||c!==r[l])&&(r[l]=c,o=!0)}if(i){const l=Z(n),c=a||X;for(let f=0;f<i.length;f++){const d=i[f];n[d]=$s(s,l,d,c[d],t,!ee(c,d))}}return o}function $s(t,e,n,r,s,i){const o=t[n];if(o!=null){const a=ee(o,"default");if(a&&r===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&$(l)){const{propsDefaults:c}=s;if(n in c)r=c[n];else{const f=rr(s);r=c[n]=l.call(null,e),f()}}else r=l;s.ce&&s.ce._setProp(n,r)}o[0]&&(i&&!a?r=!1:o[1]&&(r===""||r===ot(n))&&(r=!0))}return r}const du=new WeakMap;function Yo(t,e,n=!1){const r=n?du:e.propsCache,s=r.get(t);if(s)return s;const i=t.props,o={},a=[];let l=!1;if(!$(t)){const f=d=>{l=!0;const[w,S]=Yo(d,e,!0);we(o,w),S&&a.push(...S)};!n&&e.mixins.length&&e.mixins.forEach(f),t.extends&&f(t.extends),t.mixins&&t.mixins.forEach(f)}if(!i&&!l)return oe(t)&&r.set(t,wn),wn;if(F(i))for(let f=0;f<i.length;f++){const d=Ke(i[f]);Xo(d)&&(o[d]=X)}else if(i)for(const f in i){const d=Ke(f);if(Xo(d)){const w=i[f],S=o[d]=F(w)||$(w)?{type:w}:we({},w),I=S.type;let P=!1,ae=!0;if(F(I))for(let Y=0;Y<I.length;++Y){const U=I[Y],G=$(U)&&U.name;if(G==="Boolean"){P=!0;break}else G==="String"&&(ae=!1)}else P=$(I)&&I.name==="Boolean";S[0]=P,S[1]=ae,(P||ee(S,"default"))&&a.push(d)}}const c=[o,a];return oe(t)&&r.set(t,c),c}function Xo(t){return t[0]!=="$"&&!$n(t)}const Us=t=>t==="_"||t==="_ctx"||t==="$stable",Hs=t=>F(t)?t.map(Nt):[Nt(t)],gu=(t,e,n)=>{if(e._n)return e;const r=Ic((...s)=>Hs(e(...s)),n);return r._c=!1,r},Zo=(t,e,n)=>{const r=t._ctx;for(const s in t){if(Us(s))continue;const i=t[s];if($(i))e[s]=gu(s,i,r);else if(i!=null){const o=Hs(i);e[s]=()=>o}}},Jo=(t,e)=>{const n=Hs(e);t.slots.default=()=>n},Qo=(t,e,n)=>{for(const r in e)(n||!Us(r))&&(t[r]=e[r])},mu=(t,e,n)=>{const r=t.slots=Wo();if(t.vnode.shapeFlag&32){const s=e._;s?(Qo(r,e,n),n&&Wi(r,"_",s,!0)):Zo(e,r)}else e&&Jo(t,e)},bu=(t,e,n)=>{const{vnode:r,slots:s}=t;let i=!0,o=X;if(r.shapeFlag&32){const a=e._;a?n&&a===1?i=!1:Qo(s,e,n):(i=!e.$stable,Zo(e,s)),o=e}else e&&(Jo(t,e),o={default:1});if(i)for(const a in s)!Us(a)&&o[a]==null&&delete s[a]},Xe=vu;function yu(t){return wu(t)}function wu(t,e){const n=kr();n.__VUE__=!0;const{insert:r,remove:s,patchProp:i,createElement:o,createText:a,createComment:l,setText:c,setElementText:f,parentNode:d,nextSibling:w,setScopeId:S=Et,insertStaticContent:I}=t,P=(u,p,m,y=null,x=null,_=null,A=void 0,E=null,T=!!p.dynamicChildren)=>{if(u===p)return;u&&!nr(u,p)&&(y=tt(u),_e(u,x,_,!0),u=null),p.patchFlag===-2&&(T=!1,p.dynamicChildren=null);const{type:v,ref:N,shapeFlag:C}=p;switch(v){case Ur:ae(u,p,m,y);break;case en:Y(u,p,m,y);break;case qs:u==null&&U(p,m,y,A);break;case Ce:Ze(u,p,m,y,x,_,A,E,T);break;default:C&1?J(u,p,m,y,x,_,A,E,T):C&6?Je(u,p,m,y,x,_,A,E,T):(C&64||C&128)&&v.process(u,p,m,y,x,_,A,E,T,rt)}N!=null&&x?Xn(N,u&&u.ref,_,p||u,!p):N==null&&u&&u.ref!=null&&Xn(u.ref,null,_,u,!0)},ae=(u,p,m,y)=>{if(u==null)r(p.el=a(p.children),m,y);else{const x=p.el=u.el;p.children!==u.children&&c(x,p.children)}},Y=(u,p,m,y)=>{u==null?r(p.el=l(p.children||""),m,y):p.el=u.el},U=(u,p,m,y)=>{[u.el,u.anchor]=I(u.children,p,m,y,u.el,u.anchor)},G=({el:u,anchor:p},m,y)=>{let x;for(;u&&u!==p;)x=w(u),r(u,m,y),u=x;r(p,m,y)},O=({el:u,anchor:p})=>{let m;for(;u&&u!==p;)m=w(u),s(u),u=m;s(p)},J=(u,p,m,y,x,_,A,E,T)=>{if(p.type==="svg"?A="svg":p.type==="math"&&(A="mathml"),u==null)xe(p,m,y,x,_,A,E,T);else{const v=u.el&&u.el._isVueCE?u.el:null;try{v&&v._beginPatch(),ct(u,p,x,_,A,E,T)}finally{v&&v._endPatch()}}},xe=(u,p,m,y,x,_,A,E)=>{let T,v;const{props:N,shapeFlag:C,transition:M,dirs:D}=u;if(T=u.el=o(u.type,_,N&&N.is,N),C&8?f(T,u.children):C&16&&lt(u.children,T,null,y,x,js(u,_),A,E),D&&hn(u,null,y,"created"),Ve(T,u,u.scopeId,A,y),N){for(const j in N)j!=="value"&&!$n(j)&&i(T,j,null,N[j],_,y);"value"in N&&i(T,"value",null,N.value,_),(v=N.onVnodeBeforeMount)&&Dt(v,y,u)}D&&hn(u,null,y,"beforeMount");const H=xu(x,M);H&&M.beforeEnter(T),r(T,p,m),((v=N&&N.onVnodeMounted)||H||D)&&Xe(()=>{try{v&&Dt(v,y,u),H&&M.enter(T),D&&hn(u,null,y,"mounted")}finally{}},x)},Ve=(u,p,m,y,x)=>{if(m&&S(u,m),y)for(let _=0;_<y.length;_++)S(u,y[_]);if(x){let _=x.subTree;if(p===_||sa(_.type)&&(_.ssContent===p||_.ssFallback===p)){const A=x.vnode;Ve(u,A,A.scopeId,A.slotScopeIds,x.parent)}}},lt=(u,p,m,y,x,_,A,E,T=0)=>{for(let v=T;v<u.length;v++){const N=u[v]=E?Kt(u[v]):Nt(u[v]);P(null,N,p,m,y,x,_,A,E)}},ct=(u,p,m,y,x,_,A)=>{const E=p.el=u.el;let{patchFlag:T,dynamicChildren:v,dirs:N}=p;T|=u.patchFlag&16;const C=u.props||X,M=p.props||X;let D;if(m&&pn(m,!1),(D=M.onVnodeBeforeUpdate)&&Dt(D,m,p,u),N&&hn(p,u,m,"beforeUpdate"),m&&pn(m,!0),(C.innerHTML&&M.innerHTML==null||C.textContent&&M.textContent==null)&&f(E,""),v?We(u.dynamicChildren,v,E,m,y,js(p,x),_):A||ne(u,p,E,null,m,y,js(p,x),_,!1),T>0){if(T&16)ge(E,C,M,m,x);else if(T&2&&C.class!==M.class&&i(E,"class",null,M.class,x),T&4&&i(E,"style",C.style,M.style,x),T&8){const H=p.dynamicProps;for(let j=0;j<H.length;j++){const Q=H[j],de=C[Q],ye=M[Q];(ye!==de||Q==="value")&&i(E,Q,de,ye,x,m)}}T&1&&u.children!==p.children&&f(E,p.children)}else!A&&v==null&&ge(E,C,M,m,x);((D=M.onVnodeUpdated)||N)&&Xe(()=>{D&&Dt(D,m,p,u),N&&hn(p,u,m,"updated")},y)},We=(u,p,m,y,x,_,A)=>{for(let E=0;E<p.length;E++){const T=u[E],v=p[E],N=T.el&&(T.type===Ce||!nr(T,v)||T.shapeFlag&198)?d(T.el):m;P(T,v,N,null,y,x,_,A,!0)}},ge=(u,p,m,y,x)=>{if(p!==m){if(p!==X)for(const _ in p)!$n(_)&&!(_ in m)&&i(u,_,p[_],null,x,y);for(const _ in m){if($n(_))continue;const A=m[_],E=p[_];A!==E&&_!=="value"&&i(u,_,E,A,x,y)}"value"in m&&i(u,"value",p.value,m.value,x)}},Ze=(u,p,m,y,x,_,A,E,T)=>{const v=p.el=u?u.el:a(""),N=p.anchor=u?u.anchor:a("");let{patchFlag:C,dynamicChildren:M,slotScopeIds:D}=p;D&&(E=E?E.concat(D):D),u==null?(r(v,m,y),r(N,m,y),lt(p.children||[],m,N,x,_,A,E,T)):C>0&&C&64&&M&&u.dynamicChildren&&u.dynamicChildren.length===M.length?(We(u.dynamicChildren,M,m,x,_,A,E),(p.key!=null||x&&p===x.subTree)&&ea(u,p,!0)):ne(u,p,m,N,x,_,A,E,T)},Je=(u,p,m,y,x,_,A,E,T)=>{p.slotScopeIds=E,u==null?p.shapeFlag&512?x.ctx.activate(p,m,y,A,T):Oe(p,m,y,x,_,A,T):Qe(u,p,T)},Oe=(u,p,m,y,x,_,A)=>{const E=u.component=Ou(u,y,x);if(Io(u)&&(E.ctx.renderer=rt),Lu(E,!1,A),E.asyncDep){if(x&&x.registerDep(E,Se,A),!u.el){const T=E.subTree=Mt(en);Y(null,T,p,m),u.placeholder=T.el}}else Se(E,u,p,m,x,_,A)},Qe=(u,p,m)=>{const y=p.component=u.component;if(uu(u,p,m))if(y.asyncDep&&!y.asyncResolved){le(y,p,m);return}else y.next=p,y.update();else p.el=u.el,y.vnode=p},Se=(u,p,m,y,x,_,A)=>{const E=()=>{if(u.isMounted){let{next:C,bu:M,u:D,parent:H,vnode:j}=u;{const ze=ta(u);if(ze){C&&(C.el=j.el,le(u,C,A)),ze.asyncDep.then(()=>{Xe(()=>{u.isUnmounted||v()},x)});return}}let Q=C,de;pn(u,!1),C?(C.el=j.el,le(u,C,A)):C=j,M&&vr(M),(de=C.props&&C.props.onVnodeBeforeUpdate)&&Dt(de,H,C,j),pn(u,!0);const ye=Ho(u),Ie=u.subTree;u.subTree=ye,P(Ie,ye,d(Ie.el),tt(Ie),u,x,_),C.el=ye.el,Q===null&&fu(u,ye.el),D&&Xe(D,x),(de=C.props&&C.props.onVnodeUpdated)&&Xe(()=>Dt(de,H,C,j),x)}else{let C;const{el:M,props:D}=p,{bm:H,m:j,parent:Q,root:de,type:ye}=u,Ie=Zn(p);pn(u,!1),H&&vr(H),!Ie&&(C=D&&D.onVnodeBeforeMount)&&Dt(C,Q,p),pn(u,!0);{de.ce&&de.ce._hasShadowRoot()&&de.ce._injectChildStyle(ye,u.parent?u.parent.type:void 0);const ze=u.subTree=Ho(u);P(null,ze,m,y,u,x,_),p.el=ze.el}if(j&&Xe(j,x),!Ie&&(C=D&&D.onVnodeMounted)){const ze=p;Xe(()=>Dt(C,Q,ze),x)}(p.shapeFlag&256||Q&&Zn(Q.vnode)&&Q.vnode.shapeFlag&256)&&u.a&&Xe(u.a,x),u.isMounted=!0,p=m=y=null}};u.scope.on();const T=u.effect=new Ji(E);u.scope.off();const v=u.update=T.run.bind(T),N=u.job=T.runIfDirty.bind(T);N.i=u,N.id=u.uid,T.scheduler=()=>Ls(N),pn(u,!0),v()},le=(u,p,m)=>{p.component=u;const y=u.vnode.props;u.vnode=p,u.next=null,pu(u,p.props,y,m),bu(u,p.children,m),Ct(),_o(u),Ot()},ne=(u,p,m,y,x,_,A,E,T=!1)=>{const v=u&&u.children,N=u?u.shapeFlag:0,C=p.children,{patchFlag:M,shapeFlag:D}=p;if(M>0){if(M&128){Yt(v,C,m,y,x,_,A,E,T);return}else if(M&256){et(v,C,m,y,x,_,A,E,T);return}}D&8?(N&16&&De(v,x,_),C!==v&&f(m,C)):N&16?D&16?Yt(v,C,m,y,x,_,A,E,T):De(v,x,_,!0):(N&8&&f(m,""),D&16&&lt(C,m,y,x,_,A,E,T))},et=(u,p,m,y,x,_,A,E,T)=>{u=u||wn,p=p||wn;const v=u.length,N=p.length,C=Math.min(v,N);let M;for(M=0;M<C;M++){const D=p[M]=T?Kt(p[M]):Nt(p[M]);P(u[M],D,m,null,x,_,A,E,T)}v>N?De(u,x,_,!0,!1,C):lt(p,m,y,x,_,A,E,T,C)},Yt=(u,p,m,y,x,_,A,E,T)=>{let v=0;const N=p.length;let C=u.length-1,M=N-1;for(;v<=C&&v<=M;){const D=u[v],H=p[v]=T?Kt(p[v]):Nt(p[v]);if(nr(D,H))P(D,H,m,null,x,_,A,E,T);else break;v++}for(;v<=C&&v<=M;){const D=u[C],H=p[M]=T?Kt(p[M]):Nt(p[M]);if(nr(D,H))P(D,H,m,null,x,_,A,E,T);else break;C--,M--}if(v>C){if(v<=M){const D=M+1,H=D<N?p[D].el:y;for(;v<=M;)P(null,p[v]=T?Kt(p[v]):Nt(p[v]),m,H,x,_,A,E,T),v++}}else if(v>M)for(;v<=C;)_e(u[v],x,_,!0),v++;else{const D=v,H=v,j=new Map;for(v=H;v<=M;v++){const he=p[v]=T?Kt(p[v]):Nt(p[v]);he.key!=null&&j.set(he.key,v)}let Q,de=0;const ye=M-H+1;let Ie=!1,ze=0;const st=new Array(ye);for(v=0;v<ye;v++)st[v]=0;for(v=D;v<=C;v++){const he=u[v];if(de>=ye){_e(he,x,_,!0);continue}let Ee;if(he.key!=null)Ee=j.get(he.key);else for(Q=H;Q<=M;Q++)if(st[Q-H]===0&&nr(he,p[Q])){Ee=Q;break}Ee===void 0?_e(he,x,_,!0):(st[Ee-H]=v+1,Ee>=ze?ze=Ee:Ie=!0,P(he,p[Ee],m,null,x,_,A,E,T),de++)}const Zt=Ie?_u(st):wn;for(Q=Zt.length-1,v=ye-1;v>=0;v--){const he=H+v,Ee=p[he],sn=p[he+1],on=he+1<N?sn.el||ra(sn):y;st[v]===0?P(null,Ee,m,on,x,_,A,E,T):Ie&&(Q<0||v!==Zt[Q]?ce(Ee,m,on,2):Q--)}}},ce=(u,p,m,y,x=null)=>{const{el:_,type:A,transition:E,children:T,shapeFlag:v}=u;if(v&6){ce(u.component.subTree,p,m,y);return}if(v&128){u.suspense.move(p,m,y);return}if(v&64){A.move(u,p,m,rt);return}if(A===Ce){r(_,p,m);for(let C=0;C<T.length;C++)ce(T[C],p,m,y);r(u.anchor,p,m);return}if(A===qs){G(u,p,m);return}if(y!==2&&v&1&&E)if(y===0)E.beforeEnter(_),r(_,p,m),Xe(()=>E.enter(_),x);else{const{leave:C,delayLeave:M,afterLeave:D}=E,H=()=>{u.ctx.isUnmounted?s(_):r(_,p,m)},j=()=>{_._isLeaving&&_[Bc](!0),C(_,()=>{H(),D&&D()})};M?M(_,H,j):j()}else r(_,p,m)},_e=(u,p,m,y=!1,x=!1)=>{const{type:_,props:A,ref:E,children:T,dynamicChildren:v,shapeFlag:N,patchFlag:C,dirs:M,cacheIndex:D,memo:H}=u;if(C===-2&&(x=!1),E!=null&&(Ct(),Xn(E,null,m,u,!0),Ot()),D!=null&&(p.renderCache[D]=void 0),N&256){p.ctx.deactivate(u);return}const j=N&1&&M,Q=!Zn(u);let de;if(Q&&(de=A&&A.onVnodeBeforeUnmount)&&Dt(de,p,u),N&6)ie(u.component,m,y);else{if(N&128){u.suspense.unmount(m,y);return}j&&hn(u,null,p,"beforeUnmount"),N&64?u.type.remove(u,p,m,rt,y):v&&!v.hasOnce&&(_!==Ce||C>0&&C&64)?De(v,p,m,!1,!0):(_===Ce&&C&384||!x&&N&16)&&De(T,p,m),y&&pe(u)}const ye=H!=null&&D==null;(Q&&(de=A&&A.onVnodeUnmounted)||j||ye)&&Xe(()=>{de&&Dt(de,p,u),j&&hn(u,null,p,"unmounted"),ye&&(u.el=null)},m)},pe=u=>{const{type:p,el:m,anchor:y,transition:x}=u;if(p===Ce){rn(m,y);return}if(p===qs){O(u);return}const _=()=>{s(m),x&&!x.persisted&&x.afterLeave&&x.afterLeave()};if(u.shapeFlag&1&&x&&!x.persisted){const{leave:A,delayLeave:E}=x,T=()=>A(m,_);E?E(u.el,_,T):T()}else _()},rn=(u,p)=>{let m;for(;u!==p;)m=w(u),s(u),u=m;s(p)},ie=(u,p,m)=>{const{bum:y,scope:x,job:_,subTree:A,um:E,m:T,a:v}=u;na(T),na(v),y&&vr(y),x.stop(),_&&(_.flags|=8,_e(A,u,p,m)),E&&Xe(E,p),Xe(()=>{u.isUnmounted=!0},p)},De=(u,p,m,y=!1,x=!1,_=0)=>{for(let A=_;A<u.length;A++)_e(u[A],p,m,y,x)},tt=u=>{if(u.shapeFlag&6)return tt(u.component.subTree);if(u.shapeFlag&128)return u.suspense.next();const p=w(u.anchor||u.el),m=p&&p[Dc];return m?w(m):p};let Ae=!1;const nt=(u,p,m)=>{let y;u==null?p._vnode&&(_e(p._vnode,null,null,!0),y=p._vnode.component):P(p._vnode||null,u,p,null,null,null,m),p._vnode=u,Ae||(Ae=!0,_o(y),vo(),Ae=!1)},rt={p:P,um:_e,m:ce,r:pe,mt:Oe,mc:lt,pc:ne,pbc:We,n:tt,o:t};return{render:nt,hydrate:void 0,createApp:su(nt)}}function js({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function pn({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function xu(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function ea(t,e,n=!1){const r=t.children,s=e.children;if(F(r)&&F(s))for(let i=0;i<r.length;i++){const o=r[i];let a=s[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[i]=Kt(s[i]),a.el=o.el),!n&&a.patchFlag!==-2&&ea(o,a)),a.type===Ur&&(a.patchFlag===-1&&(a=s[i]=Kt(a)),a.el=o.el),a.type===en&&!a.el&&(a.el=o.el)}}function _u(t){const e=t.slice(),n=[0];let r,s,i,o,a;const l=t.length;for(r=0;r<l;r++){const c=t[r];if(c!==0){if(s=n[n.length-1],t[s]<c){e[r]=s,n.push(r);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,t[n[a]]<c?i=a+1:o=a;c<t[n[i]]&&(i>0&&(e[r]=n[i-1]),n[i]=r)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function ta(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:ta(e)}function na(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function ra(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?ra(e.subTree):null}const sa=t=>t.__isSuspense;function vu(t,e){e&&e.pendingBranch?F(t)?e.effects.push(...t):e.effects.push(t):Oc(t)}const Ce=Symbol.for("v-fgt"),Ur=Symbol.for("v-txt"),en=Symbol.for("v-cmt"),qs=Symbol.for("v-stc"),er=[];let at=null;function te(t=!1){er.push(at=t?null:[])}function ku(){er.pop(),at=er[er.length-1]||null}let tr=1;function ia(t,e=!1){tr+=t,t<0&&at&&e&&(at.hasOnce=!0)}function oa(t){return t.dynamicChildren=tr>0?at||wn:null,ku(),tr>0&&at&&at.push(t),t}function re(t,e,n,r,s,i){return oa(B(t,e,n,r,s,i,!0))}function Tu(t,e,n,r,s){return oa(Mt(t,e,n,r,s,!0))}function aa(t){return t?t.__v_isVNode===!0:!1}function nr(t,e){return t.type===e.type&&t.key===e.key}const la=({key:t})=>t??null,Hr=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?be(t)||Re(t)||$(t)?{i:ht,r:t,k:e,f:!!n}:t:null);function B(t,e=null,n=null,r=0,s=null,i=t===Ce?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&la(e),ref:e&&Hr(e),scopeId:To,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:ht};return a?(Vs(l,n),i&128&&t.normalize(l)):n&&(l.shapeFlag|=be(n)?8:16),tr>0&&!o&&at&&(l.patchFlag>0||i&6)&&l.patchFlag!==32&&at.push(l),l}const Mt=Su;function Su(t,e=null,n=null,r=0,s=null,i=!1){if((!t||t===Xc)&&(t=en),aa(t)){const a=Rn(t,e,!0);return n&&Vs(a,n),tr>0&&!i&&at&&(a.shapeFlag&6?at[at.indexOf(t)]=a:at.push(a)),a.patchFlag=-2,a}if(Fu(t)&&(t=t.__vccOpts),e){e=Eu(e);let{class:a,style:l}=e;a&&!be(a)&&(e.class=Un(a)),oe(l)&&(Os(l)&&!F(l)&&(l=we({},l)),e.style=yt(l))}const o=be(t)?1:sa(t)?128:zc(t)?64:oe(t)?4:$(t)?2:0;return B(t,e,n,r,s,o,i,!0)}function Eu(t){return t?Os(t)||Ko(t)?we({},t):t:null}function Rn(t,e,n=!1,r=!1){const{props:s,ref:i,patchFlag:o,children:a,transition:l}=t,c=e?Au(s||{},e):s,f={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&la(c),ref:e&&e.ref?n&&i?F(i)?i.concat(Hr(e)):[i,Hr(e)]:Hr(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ce?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Rn(t.ssContent),ssFallback:t.ssFallback&&Rn(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&r&&Ps(f,l.clone(f)),f}function jr(t=" ",e=0){return Mt(Ur,null,t,e)}function pt(t="",e=!1){return e?(te(),Tu(en,null,t)):Mt(en,null,t)}function Nt(t){return t==null||typeof t=="boolean"?Mt(en):F(t)?Mt(Ce,null,t.slice()):aa(t)?Kt(t):Mt(Ur,null,String(t))}function Kt(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Rn(t)}function Vs(t,e){let n=0;const{shapeFlag:r}=t;if(e==null)e=null;else if(F(e))n=16;else if(typeof e=="object")if(r&65){const s=e.default;s&&(s._c&&(s._d=!1),Vs(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!Ko(e)?e._ctx=ht:s===3&&ht&&(ht.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else $(e)?(e={default:e,_ctx:ht},n=32):(e=String(e),r&64?(n=16,e=[jr(e)]):n=8);t.children=e,t.shapeFlag|=n}function Au(...t){const e={};for(let n=0;n<t.length;n++){const r=t[n];for(const s in r)if(s==="class")e.class!==r.class&&(e.class=Un([e.class,r.class]));else if(s==="style")e.style=yt([e.style,r.style]);else if(yr(s)){const i=e[s],o=r[s];o&&i!==o&&!(F(i)&&i.includes(o))?e[s]=i?[].concat(i,o):o:o==null&&i==null&&!wr(s)&&(e[s]=o)}else s!==""&&(e[s]=r[s])}return e}function Dt(t,e,n,r=null){Lt(t,e,7,[n,r])}const Ru=$o();let Cu=0;function Ou(t,e,n){const r=t.type,s=(e?e.appContext:t.appContext)||Ru,i={uid:Cu++,vnode:t,type:r,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Yl(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Yo(r,s),emitsOptions:Uo(r,s),emit:null,emitted:null,propsDefaults:X,inheritAttrs:r.inheritAttrs,ctx:X,data:X,props:X,attrs:X,slots:X,refs:X,setupState:X,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=ou.bind(null,i),t.ce&&t.ce(i),i}let Ue=null;const Iu=()=>Ue||ht;let qr,Ws;{const t=kr(),e=(n,r)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(r),i=>{s.length>1?s.forEach(o=>o(i)):s[0](i)}};qr=e("__VUE_INSTANCE_SETTERS__",n=>Ue=n),Ws=e("__VUE_SSR_SETTERS__",n=>sr=n)}const rr=t=>{const e=Ue;return qr(t),t.scope.on(),()=>{t.scope.off(),qr(e)}},ca=()=>{Ue&&Ue.scope.off(),qr(null)};function ua(t){return t.vnode.shapeFlag&4}let sr=!1;function Lu(t,e=!1,n=!1){e&&Ws(e);const{props:r,children:s}=t.vnode,i=ua(t);hu(t,r,i,e),mu(t,s,n||e);const o=i?Pu(t,e):void 0;return e&&Ws(!1),o}function Pu(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,Zc);const{setup:r}=n;if(r){Ct();const s=t.setupContext=r.length>1?Nu(t):null,i=rr(t),o=Tn(r,t,0,[t.props,s]),a=ji(o);if(Ot(),i(),(a||t.sp)&&!Zn(t)&&Ro(t),a){if(o.then(ca,ca),e)return o.then(l=>{fa(t,l)}).catch(l=>{Ir(l,t,0)});t.asyncDep=o}else fa(t,o)}else ha(t)}function fa(t,e,n){$(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:oe(e)&&(t.setupState=bo(e)),ha(t)}function ha(t,e,n){const r=t.type;t.render||(t.render=r.render||Et);{const s=rr(t);Ct();try{Jc(t)}finally{Ot(),s()}}}const Mu={get(t,e){return Me(t,"get",""),t[e]}};function Nu(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,Mu),slots:t.slots,emit:t.emit,expose:e}}function Vr(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(bo(mc(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in Jn)return Jn[n](t)},has(e,n){return n in e||n in Jn}})):t.proxy}const Du=/(?:^|[-_])\w/g,zu=t=>t.replace(Du,e=>e.toUpperCase()).replace(/[-_]/g,"");function Bu(t,e=!0){return $(t)?t.displayName||t.name:t.name||e&&t.__name}function pa(t,e,n=!1){let r=Bu(e);if(!r&&e.__file){const s=e.__file.match(/([^/\\]+)\.\w+$/);s&&(r=s[1])}if(!r&&t){const s=i=>{for(const o in i)if(i[o]===e)return o};r=s(t.components)||t.parent&&s(t.parent.type.components)||s(t.appContext.components)}return r?zu(r):n?"App":"Anonymous"}function Fu(t){return $(t)&&"__vccOpts"in t}const Ks=(t,e)=>_c(t,e,sr),$u="3.5.32";/**
* @vue/runtime-dom v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Gs;const da=typeof window<"u"&&window.trustedTypes;if(da)try{Gs=da.createPolicy("vue",{createHTML:t=>t})}catch{}const ga=Gs?t=>Gs.createHTML(t):t=>t,Uu="http://www.w3.org/2000/svg",Hu="http://www.w3.org/1998/Math/MathML",Gt=typeof document<"u"?document:null,ma=Gt&&Gt.createElement("template"),ju={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,r)=>{const s=e==="svg"?Gt.createElementNS(Uu,t):e==="mathml"?Gt.createElementNS(Hu,t):n?Gt.createElement(t,{is:n}):Gt.createElement(t);return t==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:t=>Gt.createTextNode(t),createComment:t=>Gt.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Gt.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,r,s,i){const o=n?n.previousSibling:e.lastChild;if(s&&(s===i||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===i||!(s=s.nextSibling)););else{ma.innerHTML=ga(r==="svg"?`<svg>${t}</svg>`:r==="mathml"?`<math>${t}</math>`:t);const a=ma.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},qu=Symbol("_vtc");function Vu(t,e,n){const r=t[qu];r&&(e=(e?[e,...r]:[...r]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const ba=Symbol("_vod"),Wu=Symbol("_vsh"),Ku=Symbol(""),Gu=/(?:^|;)\s*display\s*:/;function Yu(t,e,n){const r=t.style,s=be(n);let i=!1;if(n&&!s){if(e)if(be(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Wr(r,a,"")}else for(const o in e)n[o]==null&&Wr(r,o,"");for(const o in n)o==="display"&&(i=!0),Wr(r,o,n[o])}else if(s){if(e!==n){const o=r[Ku];o&&(n+=";"+o),r.cssText=n,i=Gu.test(n)}}else e&&t.removeAttribute("style");ba in t&&(t[ba]=i?r.display:"",t[Wu]&&(r.display="none"))}const ya=/\s*!important$/;function Wr(t,e,n){if(F(n))n.forEach(r=>Wr(t,e,r));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const r=Xu(t,e);ya.test(n)?t.setProperty(ot(r),n.replace(ya,""),"important"):t[r]=n}}const wa=["Webkit","Moz","ms"],Ys={};function Xu(t,e){const n=Ys[e];if(n)return n;let r=Ke(e);if(r!=="filter"&&r in t)return Ys[e]=r;r=Vi(r);for(let s=0;s<wa.length;s++){const i=wa[s]+r;if(i in t)return Ys[e]=i}return e}const xa="http://www.w3.org/1999/xlink";function _a(t,e,n,r,s,i=Kl(e)){r&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(xa,e.slice(6,e.length)):t.setAttributeNS(xa,e,n):n==null||i&&!Yi(n)?t.removeAttribute(e):t.setAttribute(e,i?"":At(n)?String(n):n)}function va(t,e,n,r,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?ga(n):n);return}const i=t.tagName;if(e==="value"&&i!=="PROGRESS"&&!i.includes("-")){const a=i==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=Yi(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(s||e)}function Cn(t,e,n,r){t.addEventListener(e,n,r)}function Zu(t,e,n,r){t.removeEventListener(e,n,r)}const ka=Symbol("_vei");function Ju(t,e,n,r,s=null){const i=t[ka]||(t[ka]={}),o=i[e];if(r&&o)o.value=r;else{const[a,l]=Qu(e);if(r){const c=i[e]=nf(r,s);Cn(t,a,c,l)}else o&&(Zu(t,a,o,l),i[e]=void 0)}}const Ta=/(?:Once|Passive|Capture)$/;function Qu(t){let e;if(Ta.test(t)){e={};let r;for(;r=t.match(Ta);)t=t.slice(0,t.length-r[0].length),e[r[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):ot(t.slice(2)),e]}let Xs=0;const ef=Promise.resolve(),tf=()=>Xs||(ef.then(()=>Xs=0),Xs=Date.now());function nf(t,e){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;Lt(rf(r,n.value),e,5,[r])};return n.value=t,n.attached=tf(),n}function rf(t,e){if(F(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(r=>s=>!s._stopped&&r&&r(s))}else return e}const Sa=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,sf=(t,e,n,r,s,i)=>{const o=s==="svg";e==="class"?Vu(t,r,o):e==="style"?Yu(t,n,r):yr(e)?wr(e)||Ju(t,e,n,r,i):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):of(t,e,r,o))?(va(t,e,r),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&_a(t,e,r,o,i,e!=="value")):t._isVueCE&&(af(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!be(r)))?va(t,Ke(e),r,i,e):(e==="true-value"?t._trueValue=r:e==="false-value"&&(t._falseValue=r),_a(t,e,r,o))};function of(t,e,n,r){if(r)return!!(e==="innerHTML"||e==="textContent"||e in t&&Sa(e)&&$(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return Sa(e)&&be(n)?!1:e in t}function af(t,e){const n=t._def.props;if(!n)return!1;const r=Ke(e);return Array.isArray(n)?n.some(s=>Ke(s)===r):Object.keys(n).some(s=>Ke(s)===r)}const Ea={};function lf(t,e,n){let r=Ao(t,e);xr(r)&&(r=we({},r,e));class s extends Zs{constructor(o){super(r,o,n)}}return s.def=r,s}const cf=typeof HTMLElement<"u"?HTMLElement:class{};class Zs extends cf{constructor(e,n={},r=Pa){super(),this._def=e,this._props=n,this._createApp=r,this._isVueCE=!0,this._instance=null,this._app=null,this._nonce=this._def.nonce,this._connected=!1,this._resolved=!1,this._patching=!1,this._dirty=!1,this._numberProps=null,this._styleChildren=new WeakSet,this._styleAnchors=new WeakMap,this._ob=null,this.shadowRoot&&r!==Pa?this._root=this.shadowRoot:e.shadowRoot!==!1?(this.attachShadow(we({},e.shadowRootOptions,{mode:"open"})),this._root=this.shadowRoot):this._root=this}connectedCallback(){if(!this.isConnected)return;!this.shadowRoot&&!this._resolved&&this._parseSlots(),this._connected=!0;let e=this;for(;e=e&&(e.assignedSlot||e.parentNode||e.host);)if(e instanceof Zs){this._parent=e;break}this._instance||(this._resolved?this._mount(this._def):e&&e._pendingResolve?this._pendingResolve=e._pendingResolve.then(()=>{this._pendingResolve=void 0,this._resolveDef()}):this._resolveDef())}_setParent(e=this._parent){e&&(this._instance.parent=e._instance,this._inheritParentContext(e))}_inheritParentContext(e=this._parent){e&&this._app&&Object.setPrototypeOf(this._app._context.provides,e._instance.provides)}disconnectedCallback(){this._connected=!1,Gn(()=>{this._connected||(this._ob&&(this._ob.disconnect(),this._ob=null),this._app&&this._app.unmount(),this._instance&&(this._instance.ce=void 0),this._app=this._instance=null,this._teleportTargets&&(this._teleportTargets.clear(),this._teleportTargets=void 0))})}_processMutations(e){for(const n of e)this._setAttr(n.attributeName)}_resolveDef(){if(this._pendingResolve)return;for(let r=0;r<this.attributes.length;r++)this._setAttr(this.attributes[r].name);this._ob=new MutationObserver(this._processMutations.bind(this)),this._ob.observe(this,{attributes:!0});const e=(r,s=!1)=>{this._resolved=!0,this._pendingResolve=void 0;const{props:i,styles:o}=r;let a;if(i&&!F(i))for(const l in i){const c=i[l];(c===Number||c&&c.type===Number)&&(l in this._props&&(this._props[l]=Ki(this._props[l])),(a||(a=Object.create(null)))[Ke(l)]=!0)}this._numberProps=a,this._resolveProps(r),this.shadowRoot&&this._applyStyles(o),this._mount(r)},n=this._def.__asyncLoader;n?this._pendingResolve=n().then(r=>{r.configureApp=this._def.configureApp,e(this._def=r,!0)}):e(this._def)}_mount(e){this._app=this._createApp(e),this._inheritParentContext(),e.configureApp&&e.configureApp(this._app),this._app._ceVNode=this._createVNode(),this._app.mount(this._root);const n=this._instance&&this._instance.exposed;if(n)for(const r in n)ee(this,r)||Object.defineProperty(this,r,{get:()=>kn(n[r])})}_resolveProps(e){const{props:n}=e,r=F(n)?n:Object.keys(n||{});for(const s of Object.keys(this))s[0]!=="_"&&r.includes(s)&&this._setProp(s,this[s]);for(const s of r.map(Ke))Object.defineProperty(this,s,{get(){return this._getProp(s)},set(i){this._setProp(s,i,!0,!this._patching)}})}_setAttr(e){if(e.startsWith("data-v-"))return;const n=this.hasAttribute(e);let r=n?this.getAttribute(e):Ea;const s=Ke(e);n&&this._numberProps&&this._numberProps[s]&&(r=Ki(r)),this._setProp(s,r,!1,!0)}_getProp(e){return this._props[e]}_setProp(e,n,r=!0,s=!1){if(n!==this._props[e]&&(this._dirty=!0,n===Ea?delete this._props[e]:(this._props[e]=n,e==="key"&&this._app&&(this._app._ceVNode.key=n)),s&&this._instance&&this._update(),r)){const i=this._ob;i&&(this._processMutations(i.takeRecords()),i.disconnect()),n===!0?this.setAttribute(ot(e),""):typeof n=="string"||typeof n=="number"?this.setAttribute(ot(e),n+""):n||this.removeAttribute(ot(e)),i&&i.observe(this,{attributes:!0})}}_update(){const e=this._createVNode();this._app&&(e.appContext=this._app._context),gf(e,this._root)}_createVNode(){const e={};this.shadowRoot||(e.onVnodeMounted=e.onVnodeUpdated=this._renderSlots.bind(this));const n=Mt(this._def,we(e,this._props));return this._instance||(n.ce=r=>{this._instance=r,r.ce=this,r.isCE=!0;const s=(i,o)=>{this.dispatchEvent(new CustomEvent(i,xr(o[0])?we({detail:o},o[0]):{detail:o}))};r.emit=(i,...o)=>{s(i,o),ot(i)!==i&&s(ot(i),o)},this._setParent()}),n}_applyStyles(e,n,r){if(!e)return;if(n){if(n===this._def||this._styleChildren.has(n))return;this._styleChildren.add(n)}const s=this._nonce,i=this.shadowRoot,o=r?this._getStyleAnchor(r)||this._getStyleAnchor(this._def):this._getRootStyleInsertionAnchor(i);let a=null;for(let l=e.length-1;l>=0;l--){const c=document.createElement("style");s&&c.setAttribute("nonce",s),c.textContent=e[l],i.insertBefore(c,a||o),a=c,l===0&&(r||this._styleAnchors.set(this._def,c),n&&this._styleAnchors.set(n,c))}}_getStyleAnchor(e){if(!e)return null;const n=this._styleAnchors.get(e);return n&&n.parentNode===this.shadowRoot?n:(n&&this._styleAnchors.delete(e),null)}_getRootStyleInsertionAnchor(e){for(let n=0;n<e.childNodes.length;n++){const r=e.childNodes[n];if(!(r instanceof HTMLStyleElement))return r}return null}_parseSlots(){const e=this._slots={};let n;for(;n=this.firstChild;){const r=n.nodeType===1&&n.getAttribute("slot")||"default";(e[r]||(e[r]=[])).push(n),this.removeChild(n)}}_renderSlots(){const e=this._getSlots(),n=this._instance.type.__scopeId;for(let r=0;r<e.length;r++){const s=e[r],i=s.getAttribute("name")||"default",o=this._slots[i],a=s.parentNode;if(o)for(const l of o){if(n&&l.nodeType===1){const c=n+"-s",f=document.createTreeWalker(l,1);l.setAttribute(c,"");let d;for(;d=f.nextNode();)d.setAttribute(c,"")}a.insertBefore(l,s)}else for(;s.firstChild;)a.insertBefore(s.firstChild,s);a.removeChild(s)}}_getSlots(){const e=[this];this._teleportTargets&&e.push(...this._teleportTargets);const n=new Set;for(const r of e){const s=r.querySelectorAll("slot");for(let i=0;i<s.length;i++)n.add(s[i])}return Array.from(n)}_injectChildStyle(e,n){this._applyStyles(e.styles,e,n)}_beginPatch(){this._patching=!0,this._dirty=!1}_endPatch(){this._patching=!1,this._dirty&&this._instance&&this._update()}_hasShadowRoot(){return this._def.shadowRoot!==!1}_removeChildStyle(e){}}const Aa=t=>{const e=t.props["onUpdate:modelValue"]||!1;return F(e)?n=>vr(e,n):e};function uf(t){t.target.composing=!0}function Ra(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const Js=Symbol("_assign");function Ca(t,e,n){return e&&(t=t.trim()),n&&(t=ds(t)),t}const Kr={created(t,{modifiers:{lazy:e,trim:n,number:r}},s){t[Js]=Aa(s);const i=r||s.props&&s.props.type==="number";Cn(t,e?"change":"input",o=>{o.target.composing||t[Js](Ca(t.value,n,i))}),(n||i)&&Cn(t,"change",()=>{t.value=Ca(t.value,n,i)}),e||(Cn(t,"compositionstart",uf),Cn(t,"compositionend",Ra),Cn(t,"change",Ra))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:r,trim:s,number:i}},o){if(t[Js]=Aa(o),t.composing)return;const a=(i||t.type==="number")&&!/^0\d/.test(t.value)?ds(t.value):t.value,l=e??"";if(a===l)return;const c=t.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===t&&t.type!=="range"&&(r&&e===n||s&&t.value.trim()===l)||(t.value=l)}},ff=["ctrl","shift","alt","meta"],hf={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>ff.some(n=>t[`${n}Key`]&&!e.includes(n))},Qs=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),r=e.join(".");return n[r]||(n[r]=(s,...i)=>{for(let o=0;o<e.length;o++){const a=hf[e[o]];if(a&&a(s,e))return}return t(s,...i)})},pf={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},Oa=(t,e)=>{const n=t._withKeys||(t._withKeys={}),r=e.join(".");return n[r]||(n[r]=s=>{if(!("key"in s))return;const i=ot(s.key);if(e.some(o=>o===i||pf[o]===i))return t(s)})},df=we({patchProp:sf},ju);let Ia;function La(){return Ia||(Ia=yu(df))}const gf=(...t)=>{La().render(...t)},Pa=(...t)=>{const e=La().createApp(...t),{mount:n}=e;return e.mount=r=>{const s=bf(r);if(!s)return;const i=e._component;!$(i)&&!i.render&&!i.template&&(i.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const o=n(s,!1,mf(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e};function mf(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function bf(t){return be(t)?document.querySelector(t):t}const zt=Object.create(null);zt.open="0",zt.close="1",zt.ping="2",zt.pong="3",zt.message="4",zt.upgrade="5",zt.noop="6";const Gr=Object.create(null);Object.keys(zt).forEach(t=>{Gr[zt[t]]=t});const ei={type:"error",data:"parser error"},Ma=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Na=typeof ArrayBuffer=="function",Da=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,ti=({type:t,data:e},n,r)=>Ma&&e instanceof Blob?n?r(e):za(e,r):Na&&(e instanceof ArrayBuffer||Da(e))?n?r(e):za(new Blob([e]),r):r(zt[t]+(e||"")),za=(t,e)=>{const n=new FileReader;return n.onload=function(){const r=n.result.split(",")[1];e("b"+(r||""))},n.readAsDataURL(t)};function Ba(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let ni;function yf(t,e){if(Ma&&t.data instanceof Blob)return t.data.arrayBuffer().then(Ba).then(e);if(Na&&(t.data instanceof ArrayBuffer||Da(t.data)))return e(Ba(t.data));ti(t,!1,n=>{ni||(ni=new TextEncoder),e(ni.encode(n))})}const Fa="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ir=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Fa.length;t++)ir[Fa.charCodeAt(t)]=t;const wf=t=>{let e=t.length*.75,n=t.length,r,s=0,i,o,a,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const c=new ArrayBuffer(e),f=new Uint8Array(c);for(r=0;r<n;r+=4)i=ir[t.charCodeAt(r)],o=ir[t.charCodeAt(r+1)],a=ir[t.charCodeAt(r+2)],l=ir[t.charCodeAt(r+3)],f[s++]=i<<2|o>>4,f[s++]=(o&15)<<4|a>>2,f[s++]=(a&3)<<6|l&63;return c},xf=typeof ArrayBuffer=="function",ri=(t,e)=>{if(typeof t!="string")return{type:"message",data:$a(t,e)};const n=t.charAt(0);return n==="b"?{type:"message",data:_f(t.substring(1),e)}:Gr[n]?t.length>1?{type:Gr[n],data:t.substring(1)}:{type:Gr[n]}:ei},_f=(t,e)=>{if(xf){const n=wf(t);return $a(n,e)}else return{base64:!0,data:t}},$a=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Ua="",vf=(t,e)=>{const n=t.length,r=new Array(n);let s=0;t.forEach((i,o)=>{ti(i,!1,a=>{r[o]=a,++s===n&&e(r.join(Ua))})})},kf=(t,e)=>{const n=t.split(Ua),r=[];for(let s=0;s<n.length;s++){const i=ri(n[s],e);if(r.push(i),i.type==="error")break}return r};function Tf(){return new TransformStream({transform(t,e){yf(t,n=>{const r=n.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const i=new DataView(s.buffer);i.setUint8(0,126),i.setUint16(1,r)}else{s=new Uint8Array(9);const i=new DataView(s.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(r))}t.data&&typeof t.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(n)})}})}let si;function Yr(t){return t.reduce((e,n)=>e+n.length,0)}function Xr(t,e){if(t[0].length===e)return t.shift();const n=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)n[s]=t[0][r++],r===t[0].length&&(t.shift(),r=0);return t.length&&r<t[0].length&&(t[0]=t[0].slice(r)),n}function Sf(t,e){si||(si=new TextDecoder);const n=[];let r=0,s=-1,i=!1;return new TransformStream({transform(o,a){for(n.push(o);;){if(r===0){if(Yr(n)<1)break;const l=Xr(n,1);i=(l[0]&128)===128,s=l[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(Yr(n)<2)break;const l=Xr(n,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if(Yr(n)<8)break;const l=Xr(n,8),c=new DataView(l.buffer,l.byteOffset,l.length),f=c.getUint32(0);if(f>Math.pow(2,21)-1){a.enqueue(ei);break}s=f*Math.pow(2,32)+c.getUint32(4),r=3}else{if(Yr(n)<s)break;const l=Xr(n,s);a.enqueue(ri(i?l:si.decode(l),e)),r=0}if(s===0||s>t){a.enqueue(ei);break}}}})}const Ha=4;function ve(t){if(t)return Ef(t)}function Ef(t){for(var e in ve.prototype)t[e]=ve.prototype[e];return t}ve.prototype.on=ve.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},ve.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},ve.prototype.off=ve.prototype.removeListener=ve.prototype.removeAllListeners=ve.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var r,s=0;s<n.length;s++)if(r=n[s],r===e||r.fn===e){n.splice(s,1);break}return n.length===0&&delete this._callbacks["$"+t],this},ve.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(n){n=n.slice(0);for(var r=0,s=n.length;r<s;++r)n[r].apply(this,e)}return this},ve.prototype.emitReserved=ve.prototype.emit,ve.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},ve.prototype.hasListeners=function(t){return!!this.listeners(t).length};const Zr=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,n)=>n(e,0),dt=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Af="arraybuffer";function ud(){}function ja(t,...e){return e.reduce((n,r)=>(t.hasOwnProperty(r)&&(n[r]=t[r]),n),{})}const Rf=dt.setTimeout,Cf=dt.clearTimeout;function Jr(t,e){e.useNativeTimers?(t.setTimeoutFn=Rf.bind(dt),t.clearTimeoutFn=Cf.bind(dt)):(t.setTimeoutFn=dt.setTimeout.bind(dt),t.clearTimeoutFn=dt.clearTimeout.bind(dt))}const Of=1.33;function If(t){return typeof t=="string"?Lf(t):Math.ceil((t.byteLength||t.size)*Of)}function Lf(t){let e=0,n=0;for(let r=0,s=t.length;r<s;r++)e=t.charCodeAt(r),e<128?n+=1:e<2048?n+=2:e<55296||e>=57344?n+=3:(r++,n+=4);return n}function qa(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Pf(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e}function Mf(t){let e={},n=t.split("&");for(let r=0,s=n.length;r<s;r++){let i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class Nf extends Error{constructor(e,n,r){super(e),this.description=n,this.context=r,this.type="TransportError"}}class ii extends ve{constructor(e){super(),this.writable=!1,Jr(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,n,r){return super.emitReserved("error",new Nf(e,n,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const n=ri(e,this.socket.binaryType);this.onPacket(n)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,n={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(n)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const n=Pf(e);return n.length?"?"+n:""}}class Df extends ii{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const n=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||n()})),this.writable||(r++,this.once("drain",function(){--r||n()}))}else n()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const n=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};kf(e,this.socket.binaryType).forEach(n),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,vf(e,n=>{this.doWrite(n,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",n=this.query||{};return this.opts.timestampRequests!==!1&&(n[this.opts.timestampParam]=qa()),!this.supportsBinary&&!n.sid&&(n.b64=1),this.createUri(e,n)}}let Va=!1;try{Va=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const zf=Va;function Bf(){}class Ff extends Df{constructor(e){if(super(e),typeof location<"u"){const n=location.protocol==="https:";let r=location.port;r||(r=n?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,n){const r=this.request({method:"POST",data:e});r.on("success",n),r.on("error",(s,i)=>{this.onError("xhr post error",s,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(n,r)=>{this.onError("xhr poll error",n,r)}),this.pollXhr=e}}class Bt extends ve{constructor(e,n,r){super(),this.createRequest=e,Jr(this,r),this._opts=r,this._method=r.method||"GET",this._uri=n,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const n=ja(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");n.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(n);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=Bt.requestsCount++,Bt.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Bf,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Bt.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}if(Bt.requestsCount=0,Bt.requests={},typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Wa);else if(typeof addEventListener=="function"){const t="onpagehide"in dt?"pagehide":"unload";addEventListener(t,Wa,!1)}}function Wa(){for(let t in Bt.requests)Bt.requests.hasOwnProperty(t)&&Bt.requests[t].abort()}const $f=function(){const t=Ka({xdomain:!1});return t&&t.responseType!==null}();class Uf extends Ff{constructor(e){super(e);const n=e&&e.forceBase64;this.supportsBinary=$f&&!n}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Bt(Ka,this.uri(),e)}}function Ka(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||zf))return new XMLHttpRequest}catch{}if(!e)try{return new dt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ga=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Hf extends ii{get name(){return"websocket"}doOpen(){const e=this.uri(),n=this.opts.protocols,r=Ga?{}:ja(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,n,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;ti(r,this.supportsBinary,i=>{try{this.doWrite(r,i)}catch{}s&&Zr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",n=this.query||{};return this.opts.timestampRequests&&(n[this.opts.timestampParam]=qa()),this.supportsBinary||(n.b64=1),this.createUri(e,n)}}const oi=dt.WebSocket||dt.MozWebSocket;class jf extends Hf{createSocket(e,n,r){return Ga?new oi(e,n,r):n?new oi(e,n):new oi(e)}doWrite(e,n){this.ws.send(n)}}class qf extends ii{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const n=Sf(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(n).getReader(),s=Tf();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const i=()=>{r.read().then(({done:a,value:l})=>{a||(this.onPacket(l),i())}).catch(a=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;this._writer.write(r).then(()=>{s&&Zr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Vf={websocket:jf,webtransport:qf,polling:Uf},Wf=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Kf=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function ai(t){if(t.length>8e3)throw"URI too long";const e=t,n=t.indexOf("["),r=t.indexOf("]");n!=-1&&r!=-1&&(t=t.substring(0,n)+t.substring(n,r).replace(/:/g,";")+t.substring(r,t.length));let s=Wf.exec(t||""),i={},o=14;for(;o--;)i[Kf[o]]=s[o]||"";return n!=-1&&r!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=Gf(i,i.path),i.queryKey=Yf(i,i.query),i}function Gf(t,e){const n=/\/{2,9}/g,r=e.replace(n,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function Yf(t,e){const n={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,i){s&&(n[s]=i)}),n}const li=typeof addEventListener=="function"&&typeof removeEventListener=="function",Qr=[];li&&addEventListener("offline",()=>{Qr.forEach(t=>t())},!1);class tn extends ve{constructor(e,n){if(super(),this.binaryType=Af,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(n=e,e=null),e){const r=ai(e);n.hostname=r.host,n.secure=r.protocol==="https"||r.protocol==="wss",n.port=r.port,r.query&&(n.query=r.query)}else n.host&&(n.hostname=ai(n.host).host);Jr(this,n),this.secure=n.secure!=null?n.secure:typeof location<"u"&&location.protocol==="https:",n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.hostname=n.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=n.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},n.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},n),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Mf(this.opts.query)),li&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},Qr.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const n=Object.assign({},this.opts.query);n.EIO=Ha,n.transport=e,this.id&&(n.sid=this.id);const r=Object.assign({},this.opts,{query:n,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&tn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const n=this.createTransport(e);n.open(),this.setTransport(n)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",n=>this._onClose("transport close",n))}onOpen(){this.readyState="open",tn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const n=new Error("server error");n.code=e.data,this._onError(n);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let n=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(n+=If(s)),r>0&&n>this._maxPayload)return this.writeBuffer.slice(0,r);n+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Zr(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,n,r){return this._sendPacket("message",e,n,r),this}send(e,n,r){return this._sendPacket("message",e,n,r),this}_sendPacket(e,n,r,s){if(typeof n=="function"&&(s=n,n=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const i={type:e,data:n,options:r};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},n=()=>{this.off("upgrade",n),this.off("upgradeError",n),e()},r=()=>{this.once("upgrade",n),this.once("upgradeError",n)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(tn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,n){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),li&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=Qr.indexOf(this._offlineEventListener);r!==-1&&Qr.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,n),this.writeBuffer=[],this._prevBufferLen=0}}}tn.protocol=Ha;class Xf extends tn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let n=this.createTransport(e),r=!1;tn.priorWebsocketSuccess=!1;const s=()=>{r||(n.send([{type:"ping",data:"probe"}]),n.once("packet",d=>{if(!r)if(d.type==="pong"&&d.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",n),!n)return;tn.priorWebsocketSuccess=n.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(f(),this.setTransport(n),n.send([{type:"upgrade"}]),this.emitReserved("upgrade",n),n=null,this.upgrading=!1,this.flush())})}else{const w=new Error("probe error");w.transport=n.name,this.emitReserved("upgradeError",w)}}))};function i(){r||(r=!0,f(),n.close(),n=null)}const o=d=>{const w=new Error("probe error: "+d);w.transport=n.name,i(),this.emitReserved("upgradeError",w)};function a(){o("transport closed")}function l(){o("socket closed")}function c(d){n&&d.name!==n.name&&i()}const f=()=>{n.removeListener("open",s),n.removeListener("error",o),n.removeListener("close",a),this.off("close",l),this.off("upgrading",c)};n.once("open",s),n.once("error",o),n.once("close",a),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||n.open()},200):n.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const n=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&n.push(e[r]);return n}}let Zf=class extends Xf{constructor(e,n={}){const r=typeof e=="object"?e:n;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(s=>Vf[s]).filter(s=>!!s)),super(e,r)}};function Jf(t,e="",n){let r=t;n=n||typeof location<"u"&&location,t==null&&(t=n.protocol+"//"+n.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=n.protocol+t:t=n.host+t),/^(https?|wss?):\/\//.test(t)||(typeof n<"u"?t=n.protocol+"//"+t:t="https://"+t),r=ai(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const i=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port+e,r.href=r.protocol+"://"+i+(n&&n.port===r.port?"":":"+r.port),r}const Qf=typeof ArrayBuffer=="function",eh=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Ya=Object.prototype.toString,th=typeof Blob=="function"||typeof Blob<"u"&&Ya.call(Blob)==="[object BlobConstructor]",nh=typeof File=="function"||typeof File<"u"&&Ya.call(File)==="[object FileConstructor]";function ci(t){return Qf&&(t instanceof ArrayBuffer||eh(t))||th&&t instanceof Blob||nh&&t instanceof File}function es(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let n=0,r=t.length;n<r;n++)if(es(t[n]))return!0;return!1}if(ci(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return es(t.toJSON(),!0);for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&es(t[n]))return!0;return!1}function rh(t){const e=[],n=t.data,r=t;return r.data=ui(n,e),r.attachments=e.length,{packet:r,buffers:e}}function ui(t,e){if(!t)return t;if(ci(t)){const n={_placeholder:!0,num:e.length};return e.push(t),n}else if(Array.isArray(t)){const n=new Array(t.length);for(let r=0;r<t.length;r++)n[r]=ui(t[r],e);return n}else if(typeof t=="object"&&!(t instanceof Date)){const n={};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=ui(t[r],e));return n}return t}function sh(t,e){return t.data=fi(t.data,e),delete t.attachments,t}function fi(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let n=0;n<t.length;n++)t[n]=fi(t[n],e);else if(typeof t=="object")for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(t[n]=fi(t[n],e));return t}const ih=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var W;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(W||(W={}));class oh{constructor(e){this.replacer=e}encode(e){return(e.type===W.EVENT||e.type===W.ACK)&&es(e)?this.encodeAsBinary({type:e.type===W.EVENT?W.BINARY_EVENT:W.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let n=""+e.type;return(e.type===W.BINARY_EVENT||e.type===W.BINARY_ACK)&&(n+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(n+=e.nsp+","),e.id!=null&&(n+=e.id),e.data!=null&&(n+=JSON.stringify(e.data,this.replacer)),n}encodeAsBinary(e){const n=rh(e),r=this.encodeAsString(n.packet),s=n.buffers;return s.unshift(r),s}}class hi extends ve{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let n;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");n=this.decodeString(e);const r=n.type===W.BINARY_EVENT;r||n.type===W.BINARY_ACK?(n.type=r?W.EVENT:W.ACK,this.reconstructor=new ah(n),n.attachments===0&&super.emitReserved("decoded",n)):super.emitReserved("decoded",n)}else if(ci(e)||e.base64)if(this.reconstructor)n=this.reconstructor.takeBinaryData(e),n&&(this.reconstructor=null,super.emitReserved("decoded",n));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let n=0;const r={type:Number(e.charAt(0))};if(W[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===W.BINARY_EVENT||r.type===W.BINARY_ACK){const i=n+1;for(;e.charAt(++n)!=="-"&&n!=e.length;);const o=e.substring(i,n);if(o!=Number(o)||e.charAt(n)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!lh(a)||a<0)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");r.attachments=a}if(e.charAt(n+1)==="/"){const i=n+1;for(;++n&&!(e.charAt(n)===","||n===e.length););r.nsp=e.substring(i,n)}else r.nsp="/";const s=e.charAt(n+1);if(s!==""&&Number(s)==s){const i=n+1;for(;++n;){const o=e.charAt(n);if(o==null||Number(o)!=o){--n;break}if(n===e.length)break}r.id=Number(e.substring(i,n+1))}if(e.charAt(++n)){const i=this.tryParse(e.substr(n));if(hi.isPayloadValid(r.type,i))r.data=i;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,n){switch(e){case W.CONNECT:return Xa(n);case W.DISCONNECT:return n===void 0;case W.CONNECT_ERROR:return typeof n=="string"||Xa(n);case W.EVENT:case W.BINARY_EVENT:return Array.isArray(n)&&(typeof n[0]=="number"||typeof n[0]=="string"&&ih.indexOf(n[0])===-1);case W.ACK:case W.BINARY_ACK:return Array.isArray(n)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class ah{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const n=sh(this.reconPack,this.buffers);return this.finishedReconstruction(),n}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const lh=Number.isInteger||function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t};function Xa(t){return Object.prototype.toString.call(t)==="[object Object]"}const ch=Object.freeze(Object.defineProperty({__proto__:null,Decoder:hi,Encoder:oh,get PacketType(){return W}},Symbol.toStringTag,{value:"Module"}));function _t(t,e,n){return t.on(e,n),function(){t.off(e,n)}}const uh=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Za extends ve{constructor(e,n,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=n,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[_t(e,"open",this.onopen.bind(this)),_t(e,"packet",this.onpacket.bind(this)),_t(e,"error",this.onerror.bind(this)),_t(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...n){var r,s,i;if(uh.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(n.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(n),this;const o={type:W.EVENT,data:n};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof n[n.length-1]=="function"){const f=this.ids++,d=n.pop();this._registerAckCallback(f,d),o.id=f}const a=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!a||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,n){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=n;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);n.call(this,new Error("operation has timed out"))},s),o=(...a)=>{this.io.clearTimeoutFn(i),n.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...n){return new Promise((r,s)=>{const i=(o,a)=>o?s(o):r(a);i.withError=!0,n.push(i),this.emit(e,...n)})}_addToQueue(e){let n;typeof e[e.length-1]=="function"&&(n=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...i)=>(this._queue[0],s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),n&&n(s)):(this._queue.shift(),n&&n(null,...i)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const n=this._queue[0];n.pending&&!e||(n.pending=!0,n.tryCount++,this.flags=n.flags,this.emit.apply(this,n.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:W.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,n){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,n),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case W.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case W.EVENT:case W.BINARY_EVENT:this.onevent(e);break;case W.ACK:case W.BINARY_ACK:this.onack(e);break;case W.DISCONNECT:this.ondisconnect();break;case W.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const n=e.data||[];e.id!=null&&n.push(this.ack(e.id)),this.connected?this.emitEvent(n):this.receiveBuffer.push(Object.freeze(n))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const n=this._anyListeners.slice();for(const r of n)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const n=this;let r=!1;return function(...s){r||(r=!0,n.packet({type:W.ACK,id:e,data:s}))}}onack(e){const n=this.acks[e.id];typeof n=="function"&&(delete this.acks[e.id],n.withError&&e.data.unshift(null),n.apply(this,e.data))}onconnect(e,n){this.id=e,this.recovered=n&&this._pid===n,this._pid=n,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:W.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const n=this._anyListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const n=this._anyOutgoingListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const n=this._anyOutgoingListeners.slice();for(const r of n)r.apply(this,e.data)}}}function On(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}On.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+n:t-n}return Math.min(t,this.max)|0},On.prototype.reset=function(){this.attempts=0},On.prototype.setMin=function(t){this.ms=t},On.prototype.setMax=function(t){this.max=t},On.prototype.setJitter=function(t){this.jitter=t};class pi extends ve{constructor(e,n){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(n=e,e=void 0),n=n||{},n.path=n.path||"/socket.io",this.opts=n,Jr(this,n),this.reconnection(n.reconnection!==!1),this.reconnectionAttempts(n.reconnectionAttempts||1/0),this.reconnectionDelay(n.reconnectionDelay||1e3),this.reconnectionDelayMax(n.reconnectionDelayMax||5e3),this.randomizationFactor((r=n.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new On({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(n.timeout==null?2e4:n.timeout),this._readyState="closed",this.uri=e;const s=n.parser||ch;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=n.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var n;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(n=this.backoff)===null||n===void 0||n.setMin(e),this)}randomizationFactor(e){var n;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(n=this.backoff)===null||n===void 0||n.setJitter(e),this)}reconnectionDelayMax(e){var n;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(n=this.backoff)===null||n===void 0||n.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Zf(this.uri,this.opts);const n=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=_t(n,"open",function(){r.onopen(),e&&e()}),i=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=_t(n,"error",i);if(this._timeout!==!1){const a=this._timeout,l=this.setTimeoutFn(()=>{s(),i(new Error("timeout")),n.close()},a);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(_t(e,"ping",this.onping.bind(this)),_t(e,"data",this.ondata.bind(this)),_t(e,"error",this.onerror.bind(this)),_t(e,"close",this.onclose.bind(this)),_t(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(n){this.onclose("parse error",n)}}ondecoded(e){Zr(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,n){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new Za(this,e,n),this.nsps[e]=r),r}_destroy(e){const n=Object.keys(this.nsps);for(const r of n)if(this.nsps[r].active)return;this._close()}_packet(e){const n=this.encoder.encode(e);for(let r=0;r<n.length;r++)this.engine.write(n[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,n){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,n),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const n=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},n);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const or={};function ts(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const n=Jf(t,e.path||"/socket.io"),r=n.source,s=n.id,i=n.path,o=or[s]&&i in or[s].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return a?l=new pi(r,e):(or[s]||(or[s]=new pi(r,e)),l=or[s]),n.query&&!e.query&&(e.query=n.queryKey),l.socket(n.path,e)}Object.assign(ts,{Manager:pi,Socket:Za,io:ts,connect:ts});function di(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var dn=di();function Ja(t){dn=t}var gn={exec:()=>null};function K(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(s,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(Ne.caret,"$1"),n=n.replace(s,o),r},getRegex:()=>new RegExp(n,e)};return r}var fh=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),Ne={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},hh=/^(?:[ \t]*(?:\n|$))+/,ph=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,dh=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,ar=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,gh=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,gi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Qa=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,el=K(Qa).replace(/bull/g,gi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),mh=K(Qa).replace(/bull/g,gi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),mi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,bh=/^[^\n]+/,bi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,yh=K(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",bi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),wh=K(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,gi).getRegex(),ns="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",yi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,xh=K("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",yi).replace("tag",ns).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),tl=K(mi).replace("hr",ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ns).getRegex(),_h=K(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",tl).getRegex(),wi={blockquote:_h,code:ph,def:yh,fences:dh,heading:gh,hr:ar,html:xh,lheading:el,list:wh,newline:hh,paragraph:tl,table:gn,text:bh},nl=K("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ns).getRegex(),vh={...wi,lheading:mh,table:nl,paragraph:K(mi).replace("hr",ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",nl).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ns).getRegex()},kh={...wi,html:K(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",yi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:gn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:K(mi).replace("hr",ar).replace("heading",` *#{1,6} *[^
]`).replace("lheading",el).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Th=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Sh=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,rl=/^( {2,}|\\)\n(?!\s*$)/,Eh=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,In=/[\p{P}\p{S}]/u,rs=/[\s\p{P}\p{S}]/u,xi=/[^\s\p{P}\p{S}]/u,Ah=K(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,rs).getRegex(),sl=/(?!~)[\p{P}\p{S}]/u,Rh=/(?!~)[\s\p{P}\p{S}]/u,Ch=/(?:[^\s\p{P}\p{S}]|~)/u,Oh=K(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",fh?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),il=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Ih=K(il,"u").replace(/punct/g,In).getRegex(),Lh=K(il,"u").replace(/punct/g,sl).getRegex(),ol="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ph=K(ol,"gu").replace(/notPunctSpace/g,xi).replace(/punctSpace/g,rs).replace(/punct/g,In).getRegex(),Mh=K(ol,"gu").replace(/notPunctSpace/g,Ch).replace(/punctSpace/g,Rh).replace(/punct/g,sl).getRegex(),Nh=K("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,xi).replace(/punctSpace/g,rs).replace(/punct/g,In).getRegex(),Dh=K(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,In).getRegex(),zh="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Bh=K(zh,"gu").replace(/notPunctSpace/g,xi).replace(/punctSpace/g,rs).replace(/punct/g,In).getRegex(),Fh=K(/\\(punct)/,"gu").replace(/punct/g,In).getRegex(),$h=K(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Uh=K(yi).replace("(?:-->|$)","-->").getRegex(),Hh=K("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Uh).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ss=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,jh=K(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",ss).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),al=K(/^!?\[(label)\]\[(ref)\]/).replace("label",ss).replace("ref",bi).getRegex(),ll=K(/^!?\[(ref)\](?:\[\])?/).replace("ref",bi).getRegex(),qh=K("reflink|nolink(?!\\()","g").replace("reflink",al).replace("nolink",ll).getRegex(),cl=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,_i={_backpedal:gn,anyPunctuation:Fh,autolink:$h,blockSkip:Oh,br:rl,code:Sh,del:gn,delLDelim:gn,delRDelim:gn,emStrongLDelim:Ih,emStrongRDelimAst:Ph,emStrongRDelimUnd:Nh,escape:Th,link:jh,nolink:ll,punctuation:Ah,reflink:al,reflinkSearch:qh,tag:Hh,text:Eh,url:gn},Vh={..._i,link:K(/^!?\[(label)\]\((.*?)\)/).replace("label",ss).getRegex(),reflink:K(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ss).getRegex()},vi={..._i,emStrongRDelimAst:Mh,emStrongLDelim:Lh,delLDelim:Dh,delRDelim:Bh,url:K(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",cl).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:K(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",cl).getRegex()},Wh={...vi,br:K(rl).replace("{2,}","*").getRegex(),text:K(vi.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},is={normal:wi,gfm:vh,pedantic:kh},lr={normal:_i,gfm:vi,breaks:Wh,pedantic:Vh},Kh={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ul=t=>Kh[t];function Ft(t,e){if(e){if(Ne.escapeTest.test(t))return t.replace(Ne.escapeReplace,ul)}else if(Ne.escapeTestNoEncode.test(t))return t.replace(Ne.escapeReplaceNoEncode,ul);return t}function fl(t){try{t=encodeURI(t).replace(Ne.percentDecode,"%")}catch{return null}return t}function hl(t,e){let n=t.replace(Ne.findPipe,(i,o,a)=>{let l=!1,c=o;for(;--c>=0&&a[c]==="\\";)l=!l;return l?"|":" |"}),r=n.split(Ne.splitPipe),s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(Ne.slashPipe,"|");return r}function nn(t,e,n){let r=t.length;if(r===0)return"";let s=0;for(;s<r&&t.charAt(r-s-1)===e;)s++;return t.slice(0,r-s)}function pl(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&Ne.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function Gh(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function Yh(t,e=0){let n=e,r="";for(let s of t)if(s==="	"){let i=4-n%4;r+=" ".repeat(i),n+=i}else r+=s,n++;return r}function dl(t,e,n,r,s){let i=e.href,o=e.title||null,a=t[1].replace(s.other.outputLinkReplace,"$1");r.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,l}function Xh(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let s=r[1];return e.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[a]=o;return a.length>=s.length?i.slice(s.length):i}).join(`
`)}var os=class{constructor(t){ue(this,"options");ue(this,"rules");ue(this,"lexer");this.options=t||dn}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:pl(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=Xh(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=nn(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:nn(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:nn(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=nn(e[0],`
`).split(`
`),r="",s="",i=[];for(;n.length>0;){let o=!1,a=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))a.push(n[l]),o=!0;else if(!o)a.push(n[l]);else break;n=n.slice(l);let c=a.join(`
`),f=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,s=s?`${s}
${f}`:f;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,i,!0),this.lexer.state.top=d,n.length===0)break;let w=i.at(-1);if(w?.type==="code")break;if(w?.type==="blockquote"){let S=w,I=S.raw+`
`+n.join(`
`),P=this.blockquote(I);i[i.length-1]=P,r=r.substring(0,r.length-S.raw.length)+P.raw,s=s.substring(0,s.length-S.text.length)+P.text;break}else if(w?.type==="list"){let S=w,I=S.raw+`
`+n.join(`
`),P=this.list(I);i[i.length-1]=P,r=r.substring(0,r.length-w.raw.length)+P.raw,s=s.substring(0,s.length-S.raw.length)+P.raw,n=I.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;t;){let l=!1,c="",f="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;c=e[0],t=t.substring(c.length);let d=Yh(e[2].split(`
`,1)[0],e[1].length),w=t.split(`
`,1)[0],S=!d.trim(),I=0;if(this.options.pedantic?(I=2,f=d.trimStart()):S?I=e[1].length+1:(I=d.search(this.rules.other.nonSpaceChar),I=I>4?1:I,f=d.slice(I),I+=e[1].length),S&&this.rules.other.blankLine.test(w)&&(c+=w+`
`,t=t.substring(w.length+1),l=!0),!l){let P=this.rules.other.nextBulletRegex(I),ae=this.rules.other.hrRegex(I),Y=this.rules.other.fencesBeginRegex(I),U=this.rules.other.headingBeginRegex(I),G=this.rules.other.htmlBeginRegex(I),O=this.rules.other.blockquoteBeginRegex(I);for(;t;){let J=t.split(`
`,1)[0],xe;if(w=J,this.options.pedantic?(w=w.replace(this.rules.other.listReplaceNesting,"  "),xe=w):xe=w.replace(this.rules.other.tabCharGlobal,"    "),Y.test(w)||U.test(w)||G.test(w)||O.test(w)||P.test(w)||ae.test(w))break;if(xe.search(this.rules.other.nonSpaceChar)>=I||!w.trim())f+=`
`+xe.slice(I);else{if(S||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||Y.test(d)||U.test(d)||ae.test(d))break;f+=`
`+w}S=!w.trim(),c+=J+`
`,t=t.substring(J.length+1),d=xe.slice(I)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0)),s.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(f),loose:!1,text:f,tokens:[]}),s.raw+=c}let a=s.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let l of s.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let f=this.lexer.inlineQueue.length-1;f>=0;f--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)){this.lexer.inlineQueue[f].src=this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask,"");break}}let c=this.rules.other.listTaskCheckbox.exec(l.raw);if(c){let f={type:"checkbox",raw:c[0]+" ",checked:c[0]!=="[ ]"};l.checked=f.checked,s.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=f.raw+l.tokens[0].raw,l.tokens[0].text=f.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(f)):l.tokens.unshift({type:"paragraph",raw:f.raw,text:f.raw,tokens:[f]}):l.tokens.unshift(f)}}if(!s.loose){let c=l.tokens.filter(d=>d.type==="space"),f=c.length>0&&c.some(d=>this.rules.other.anyLine.test(d.raw));s.loose=f}}if(s.loose)for(let l of s.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){let n=pl(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:nn(e[0],`
`),href:r,title:s}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=hl(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:nn(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of s)i.rows.push(hl(o,i.header.length).map((a,l)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:nn(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=nn(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Gh(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],s="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],s=i[3])}else s=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),dl(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[r.toLowerCase()];if(!s){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return dl(n,s,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=0,c=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,e=e.slice(-1*t.length+s);(r=c.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(o=[...i].length,r[3]||r[4]){a+=o;continue}else if((r[5]||r[6])&&s%3&&!((s+o)%3)){l+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a+l);let f=[...r[0]][0].length,d=t.slice(0,s+r.index+f+o);if(Math.min(s,o)%2){let S=d.slice(1,-1);return{type:"em",raw:d,text:S,tokens:this.lexer.inlineTokens(S)}}let w=d.slice(2,-2);return{type:"strong",raw:d,text:w,tokens:this.lexer.inlineTokens(w)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+s);(r=l.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(o=[...i].length,o!==s))continue;if(r[3]||r[4]){a+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a);let c=[...r[0]][0].length,f=t.slice(0,s+r.index+c+o),d=f.slice(s,-s);return{type:"del",raw:f,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},vt=class Bi{constructor(e){ue(this,"tokens");ue(this,"options");ue(this,"state");ue(this,"inlineQueue");ue(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||dn,this.options.tokenizer=this.options.tokenizer||new os,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Ne,block:is.normal,inline:lr.normal};this.options.pedantic?(n.block=is.pedantic,n.inline=lr.pedantic):this.options.gfm&&(n.block=is.gfm,this.options.breaks?n.inline=lr.breaks:n.inline=lr.gfm),this.tokenizer.rules=n}static get rules(){return{block:is,inline:lr}}static lex(e,n){return new Bi(n).lex(e)}static lexInline(e,n){return new Bi(n).inlineTokens(e)}lex(e){e=e.replace(Ne.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(Ne.tabCharGlobal,"    ").replace(Ne.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},e,n))?(e=e.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let a=n.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},n.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),n.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),n.push(i);continue}let o=e;if(this.options.extensions?.startBlock){let a=1/0,l=e.slice(1),c;this.options.extensions.startBlock.forEach(f=>{c=f.call({lexer:this},l),typeof c=="number"&&c>=0&&(a=Math.min(a,c))}),a<1/0&&a>=0&&(o=e.substring(0,a+1))}if(this.state.top&&(i=this.tokenizer.paragraph(o))){let a=n.at(-1);r&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i),r=o.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+i.raw,a.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=e,s=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(r))!==null;)c.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(r))!==null;)r=r.slice(0,s.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(s=this.tokenizer.rules.inline.blockSkip.exec(r))!==null;)i=s[2]?s[2].length:0,r=r.slice(0,s.index+i)+"["+"a".repeat(s[0].length-i-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let o=!1,a="",l=1/0;for(;e;){if(e.length<l)l=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}o||(a=""),o=!1;let c;if(this.options.extensions?.inline?.some(d=>(c=d.call({lexer:this},e,n))?(e=e.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);let d=n.at(-1);c.type==="text"&&d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(e,r,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(e,r,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),n.push(c);continue}let f=e;if(this.options.extensions?.startInline){let d=1/0,w=e.slice(1),S;this.options.extensions.startInline.forEach(I=>{S=I.call({lexer:this},w),typeof S=="number"&&S>=0&&(d=Math.min(d,S))}),d<1/0&&d>=0&&(f=e.substring(0,d+1))}if(c=this.tokenizer.inlineText(f)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(a=c.raw.slice(-1)),o=!0;let d=n.at(-1);d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):n.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},as=class{constructor(t){ue(this,"options");ue(this,"parser");this.options=t||dn}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(Ne.notSpaceStart)?.[0],s=t.replace(Ne.endingNewline,"")+`
`;return r?'<pre><code class="language-'+Ft(r)+'">'+(n?s:Ft(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:Ft(s,!0))+`</code></pre>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Ft(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let r=this.parser.parseInline(n),s=fl(t);if(s===null)return r;t=s;let i='<a href="'+t+'"';return e&&(i+=' title="'+Ft(e)+'"'),i+=">"+r+"</a>",i}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let s=fl(t);if(s===null)return Ft(n);t=s;let i=`<img src="${t}" alt="${Ft(n)}"`;return e&&(i+=` title="${Ft(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Ft(t.text)}},ki=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},kt=class Fi{constructor(e){ue(this,"options");ue(this,"renderer");ue(this,"textRenderer");this.options=e||dn,this.options.renderer=this.options.renderer||new as,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ki}static parse(e,n){return new Fi(n).parse(e)}static parseInline(e,n){return new Fi(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let s=e[r];if(this.options.extensions?.renderers?.[s.type]){let o=s,a=this.options.extensions.renderers[o.type].call({parser:this},o);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=a||"";continue}}let i=s;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let s=0;s<e.length;s++){let i=e[s];if(this.options.extensions?.renderers?.[i.type]){let a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){r+=a||"";continue}}let o=i;switch(o.type){case"escape":{r+=n.text(o);break}case"html":{r+=n.html(o);break}case"link":{r+=n.link(o);break}case"image":{r+=n.image(o);break}case"checkbox":{r+=n.checkbox(o);break}case"strong":{r+=n.strong(o);break}case"em":{r+=n.em(o);break}case"codespan":{r+=n.codespan(o);break}case"br":{r+=n.br(o);break}case"del":{r+=n.del(o);break}case"text":{r+=n.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},cr=(us=class{constructor(t){ue(this,"options");ue(this,"block");this.options=t||dn}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?vt.lex:vt.lexInline}provideParser(t=this.block){return t?kt.parse:kt.parseInline}},ue(us,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),ue(us,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),us),Zh=class{constructor(...t){ue(this,"defaults",di());ue(this,"options",this.setOptions);ue(this,"parse",this.parseMarkdown(!0));ue(this,"parseInline",this.parseMarkdown(!1));ue(this,"Parser",kt);ue(this,"Renderer",as);ue(this,"TextRenderer",ki);ue(this,"Lexer",vt);ue(this,"Tokenizer",os);ue(this,"Hooks",cr);this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{let s=r;for(let i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of s.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{let s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{let s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{let o=s[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let i=e.renderers[s.name];i?e.renderers[s.name]=function(...o){let a=s.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){let s=this.defaults.renderer||new as(this.defaults);for(let i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,a=n.renderer[o],l=s[o];s[o]=(...c)=>{let f=a.apply(s,c);return f===!1&&(f=l.apply(s,c)),f||""}}r.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new os(this.defaults);for(let i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,a=n.tokenizer[o],l=s[o];s[o]=(...c)=>{let f=a.apply(s,c);return f===!1&&(f=l.apply(s,c)),f}}r.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new cr;for(let i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,a=n.hooks[o],l=s[o];cr.passThroughHooks.has(i)?s[o]=c=>{if(this.defaults.async&&cr.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await a.call(s,c);return l.call(s,d)})();let f=a.call(s,c);return l.call(s,f)}:s[o]=(...c)=>{if(this.defaults.async)return(async()=>{let d=await a.apply(s,c);return d===!1&&(d=await l.apply(s,c)),d})();let f=a.apply(s,c);return f===!1&&(f=l.apply(s,c)),f}}r.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),s&&(a=a.concat(s.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return vt.lex(t,e??this.defaults)}parser(t,e){return kt.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},s={...this.defaults,...r},i=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=t),s.async)return(async()=>{let o=s.hooks?await s.hooks.preprocess(e):e,a=await(s.hooks?await s.hooks.provideLexer(t):t?vt.lex:vt.lexInline)(o,s),l=s.hooks?await s.hooks.processAllTokens(a):a;s.walkTokens&&await Promise.all(this.walkTokens(l,s.walkTokens));let c=await(s.hooks?await s.hooks.provideParser(t):t?kt.parse:kt.parseInline)(l,s);return s.hooks?await s.hooks.postprocess(c):c})().catch(i);try{s.hooks&&(e=s.hooks.preprocess(e));let o=(s.hooks?s.hooks.provideLexer(t):t?vt.lex:vt.lexInline)(e,s);s.hooks&&(o=s.hooks.processAllTokens(o)),s.walkTokens&&this.walkTokens(o,s.walkTokens);let a=(s.hooks?s.hooks.provideParser(t):t?kt.parse:kt.parseInline)(o,s);return s.hooks&&(a=s.hooks.postprocess(a)),a}catch(o){return i(o)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+Ft(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},mn=new Zh;function se(t,e){return mn.parse(t,e)}se.options=se.setOptions=function(t){return mn.setOptions(t),se.defaults=mn.defaults,Ja(se.defaults),se},se.getDefaults=di,se.defaults=dn,se.use=function(...t){return mn.use(...t),se.defaults=mn.defaults,Ja(se.defaults),se},se.walkTokens=function(t,e){return mn.walkTokens(t,e)},se.parseInline=mn.parseInline,se.Parser=kt,se.parser=kt.parse,se.Renderer=as,se.TextRenderer=ki,se.Lexer=vt,se.lexer=vt.lex,se.Tokenizer=os,se.Hooks=cr,se.parse=se,se.options,se.setOptions,se.use,se.walkTokens,se.parseInline,kt.parse,vt.lex;/*! @license DOMPurify 3.4.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.0/LICENSE */const{entries:gl,setPrototypeOf:ml,isFrozen:Jh,getPrototypeOf:Qh,getOwnPropertyDescriptor:ep}=Object;let{freeze:He,seal:gt,create:ur}=Object,{apply:Ti,construct:Si}=typeof Reflect<"u"&&Reflect;He||(He=function(e){return e}),gt||(gt=function(e){return e}),Ti||(Ti=function(e,n){for(var r=arguments.length,s=new Array(r>2?r-2:0),i=2;i<r;i++)s[i-2]=arguments[i];return e.apply(n,s)}),Si||(Si=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return new e(...r)});const fr=qe(Array.prototype.forEach),tp=qe(Array.prototype.lastIndexOf),bl=qe(Array.prototype.pop),hr=qe(Array.prototype.push),np=qe(Array.prototype.splice),ls=qe(String.prototype.toLowerCase),Ei=qe(String.prototype.toString),Ai=qe(String.prototype.match),Ln=qe(String.prototype.replace),rp=qe(String.prototype.indexOf),sp=qe(String.prototype.trim),Tt=qe(Object.prototype.hasOwnProperty),je=qe(RegExp.prototype.test),pr=ip(TypeError);function qe(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return Ti(t,e,r)}}function ip(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return Si(t,n)}}function V(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:ls;ml&&ml(t,null);let r=e.length;for(;r--;){let s=e[r];if(typeof s=="string"){const i=n(s);i!==s&&(Jh(e)||(e[r]=i),s=i)}t[s]=!0}return t}function op(t){for(let e=0;e<t.length;e++)Tt(t,e)||(t[e]=null);return t}function $t(t){const e=ur(null);for(const[n,r]of gl(t))Tt(t,n)&&(Array.isArray(r)?e[n]=op(r):r&&typeof r=="object"&&r.constructor===Object?e[n]=$t(r):e[n]=r);return e}function dr(t,e){for(;t!==null;){const r=ep(t,e);if(r){if(r.get)return qe(r.get);if(typeof r.value=="function")return qe(r.value)}t=Qh(t)}function n(){return null}return n}const yl=He(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ri=He(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Ci=He(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ap=He(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Oi=He(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),lp=He(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),wl=He(["#text"]),xl=He(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Ii=He(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),_l=He(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),cs=He(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),cp=gt(/\{\{[\w\W]*|[\w\W]*\}\}/gm),up=gt(/<%[\w\W]*|[\w\W]*%>/gm),fp=gt(/\$\{[\w\W]*/gm),hp=gt(/^data-[\-\w.\u00B7-\uFFFF]+$/),pp=gt(/^aria-[\-\w]+$/),vl=gt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),dp=gt(/^(?:\w+script|data):/i),gp=gt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),kl=gt(/^html$/i),mp=gt(/^[a-z][.\w]*(-[.\w]+)+$/i);var Tl=Object.freeze({__proto__:null,ARIA_ATTR:pp,ATTR_WHITESPACE:gp,CUSTOM_ELEMENT:mp,DATA_ATTR:hp,DOCTYPE_NAME:kl,ERB_EXPR:up,IS_ALLOWED_URI:vl,IS_SCRIPT_OR_DATA:dp,MUSTACHE_EXPR:cp,TMPLIT_EXPR:fp});const gr={element:1,text:3,progressingInstruction:7,comment:8,document:9},bp=function(){return typeof window>"u"?null:window},yp=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null;const s="data-tt-policy-suffix";n&&n.hasAttribute(s)&&(r=n.getAttribute(s));const i="dompurify"+(r?"#"+r:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Sl=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function El(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:bp();const e=z=>El(z);if(e.version="3.4.0",e.removed=[],!t||!t.document||t.document.nodeType!==gr.document||!t.Element)return e.isSupported=!1,e;let{document:n}=t;const r=n,s=r.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:a,Element:l,NodeFilter:c,NamedNodeMap:f=t.NamedNodeMap||t.MozNamedAttrMap,HTMLFormElement:d,DOMParser:w,trustedTypes:S}=t,I=l.prototype,P=dr(I,"cloneNode"),ae=dr(I,"remove"),Y=dr(I,"nextSibling"),U=dr(I,"childNodes"),G=dr(I,"parentNode");if(typeof o=="function"){const z=n.createElement("template");z.content&&z.content.ownerDocument&&(n=z.content.ownerDocument)}let O,J="";const{implementation:xe,createNodeIterator:Ve,createDocumentFragment:lt,getElementsByTagName:ct}=n,{importNode:We}=r;let ge=Sl();e.isSupported=typeof gl=="function"&&typeof G=="function"&&xe&&xe.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:Ze,ERB_EXPR:Je,TMPLIT_EXPR:Oe,DATA_ATTR:Qe,ARIA_ATTR:Se,IS_SCRIPT_OR_DATA:le,ATTR_WHITESPACE:ne,CUSTOM_ELEMENT:et}=Tl;let{IS_ALLOWED_URI:Yt}=Tl,ce=null;const _e=V({},[...yl,...Ri,...Ci,...Oi,...wl]);let pe=null;const rn=V({},[...xl,...Ii,..._l,...cs]);let ie=Object.seal(ur(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),De=null,tt=null;const Ae=Object.seal(ur(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let nt=!0,rt=!0,Xt=!1,u=!0,p=!1,m=!0,y=!1,x=!1,_=!1,A=!1,E=!1,T=!1,v=!0,N=!1;const C="user-content-";let M=!0,D=!1,H={},j=null;const Q=V({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let de=null;const ye=V({},["audio","video","img","source","image","track"]);let Ie=null;const ze=V({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),st="http://www.w3.org/1998/Math/MathML",Zt="http://www.w3.org/2000/svg",he="http://www.w3.org/1999/xhtml";let Ee=he,sn=!1,on=null;const Mn=V({},[st,Zt,he],Ei);let Nn=V({},["mi","mo","mn","ms","mtext"]),Dn=V({},["annotation-xml"]);const Pi=V({},["title","style","font","a","script"]);let bn=null;const Mi=["application/xhtml+xml","text/html"],b="text/html";let g=null,R=null;const ke=n.createElement("form"),St=function(h){return h instanceof RegExp||h instanceof Function},yn=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(R&&R===h)){if((!h||typeof h!="object")&&(h={}),h=$t(h),bn=Mi.indexOf(h.PARSER_MEDIA_TYPE)===-1?b:h.PARSER_MEDIA_TYPE,g=bn==="application/xhtml+xml"?Ei:ls,ce=Tt(h,"ALLOWED_TAGS")?V({},h.ALLOWED_TAGS,g):_e,pe=Tt(h,"ALLOWED_ATTR")?V({},h.ALLOWED_ATTR,g):rn,on=Tt(h,"ALLOWED_NAMESPACES")?V({},h.ALLOWED_NAMESPACES,Ei):Mn,Ie=Tt(h,"ADD_URI_SAFE_ATTR")?V($t(ze),h.ADD_URI_SAFE_ATTR,g):ze,de=Tt(h,"ADD_DATA_URI_TAGS")?V($t(ye),h.ADD_DATA_URI_TAGS,g):ye,j=Tt(h,"FORBID_CONTENTS")?V({},h.FORBID_CONTENTS,g):Q,De=Tt(h,"FORBID_TAGS")?V({},h.FORBID_TAGS,g):$t({}),tt=Tt(h,"FORBID_ATTR")?V({},h.FORBID_ATTR,g):$t({}),H=Tt(h,"USE_PROFILES")?h.USE_PROFILES:!1,nt=h.ALLOW_ARIA_ATTR!==!1,rt=h.ALLOW_DATA_ATTR!==!1,Xt=h.ALLOW_UNKNOWN_PROTOCOLS||!1,u=h.ALLOW_SELF_CLOSE_IN_ATTR!==!1,p=h.SAFE_FOR_TEMPLATES||!1,m=h.SAFE_FOR_XML!==!1,y=h.WHOLE_DOCUMENT||!1,A=h.RETURN_DOM||!1,E=h.RETURN_DOM_FRAGMENT||!1,T=h.RETURN_TRUSTED_TYPE||!1,_=h.FORCE_BODY||!1,v=h.SANITIZE_DOM!==!1,N=h.SANITIZE_NAMED_PROPS||!1,M=h.KEEP_CONTENT!==!1,D=h.IN_PLACE||!1,Yt=h.ALLOWED_URI_REGEXP||vl,Ee=h.NAMESPACE||he,Nn=h.MATHML_TEXT_INTEGRATION_POINTS||Nn,Dn=h.HTML_INTEGRATION_POINTS||Dn,ie=h.CUSTOM_ELEMENT_HANDLING||ur(null),h.CUSTOM_ELEMENT_HANDLING&&St(h.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ie.tagNameCheck=h.CUSTOM_ELEMENT_HANDLING.tagNameCheck),h.CUSTOM_ELEMENT_HANDLING&&St(h.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ie.attributeNameCheck=h.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),h.CUSTOM_ELEMENT_HANDLING&&typeof h.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(ie.allowCustomizedBuiltInElements=h.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),p&&(rt=!1),E&&(A=!0),H&&(ce=V({},wl),pe=ur(null),H.html===!0&&(V(ce,yl),V(pe,xl)),H.svg===!0&&(V(ce,Ri),V(pe,Ii),V(pe,cs)),H.svgFilters===!0&&(V(ce,Ci),V(pe,Ii),V(pe,cs)),H.mathMl===!0&&(V(ce,Oi),V(pe,_l),V(pe,cs))),Ae.tagCheck=null,Ae.attributeCheck=null,h.ADD_TAGS&&(typeof h.ADD_TAGS=="function"?Ae.tagCheck=h.ADD_TAGS:(ce===_e&&(ce=$t(ce)),V(ce,h.ADD_TAGS,g))),h.ADD_ATTR&&(typeof h.ADD_ATTR=="function"?Ae.attributeCheck=h.ADD_ATTR:(pe===rn&&(pe=$t(pe)),V(pe,h.ADD_ATTR,g))),h.ADD_URI_SAFE_ATTR&&V(Ie,h.ADD_URI_SAFE_ATTR,g),h.FORBID_CONTENTS&&(j===Q&&(j=$t(j)),V(j,h.FORBID_CONTENTS,g)),h.ADD_FORBID_CONTENTS&&(j===Q&&(j=$t(j)),V(j,h.ADD_FORBID_CONTENTS,g)),M&&(ce["#text"]=!0),y&&V(ce,["html","head","body"]),ce.table&&(V(ce,["tbody"]),delete De.tbody),h.TRUSTED_TYPES_POLICY){if(typeof h.TRUSTED_TYPES_POLICY.createHTML!="function")throw pr('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof h.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw pr('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');O=h.TRUSTED_TYPES_POLICY,J=O.createHTML("")}else O===void 0&&(O=yp(S,s)),O!==null&&typeof J=="string"&&(J=O.createHTML(""));He&&He(h),R=h}},zn=V({},[...Ri,...Ci,...ap]),an=V({},[...Oi,...lp]),Bn=function(h){let k=G(h);(!k||!k.tagName)&&(k={namespaceURI:Ee,tagName:"template"});const L=ls(h.tagName),me=ls(k.tagName);return on[h.namespaceURI]?h.namespaceURI===Zt?k.namespaceURI===he?L==="svg":k.namespaceURI===st?L==="svg"&&(me==="annotation-xml"||Nn[me]):!!zn[L]:h.namespaceURI===st?k.namespaceURI===he?L==="math":k.namespaceURI===Zt?L==="math"&&Dn[me]:!!an[L]:h.namespaceURI===he?k.namespaceURI===Zt&&!Dn[me]||k.namespaceURI===st&&!Nn[me]?!1:!an[L]&&(Pi[L]||!zn[L]):!!(bn==="application/xhtml+xml"&&on[h.namespaceURI]):!1},Le=function(h){hr(e.removed,{element:h});try{G(h).removeChild(h)}catch{ae(h)}},mt=function(h,k){try{hr(e.removed,{attribute:k.getAttributeNode(h),from:k})}catch{hr(e.removed,{attribute:null,from:k})}if(k.removeAttribute(h),h==="is")if(A||E)try{Le(k)}catch{}else try{k.setAttribute(h,"")}catch{}},Ni=function(h){let k=null,L=null;if(_)h="<remove></remove>"+h;else{const Te=Ai(h,/^[\r\n\t ]+/);L=Te&&Te[0]}bn==="application/xhtml+xml"&&Ee===he&&(h='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+h+"</body></html>");const me=O?O.createHTML(h):h;if(Ee===he)try{k=new w().parseFromString(me,bn)}catch{}if(!k||!k.documentElement){k=xe.createDocument(Ee,"template",null);try{k.documentElement.innerHTML=sn?J:me}catch{}}const Be=k.body||k.documentElement;return h&&L&&Be.insertBefore(n.createTextNode(L),Be.childNodes[0]||null),Ee===he?ct.call(k,y?"html":"body")[0]:y?k.documentElement:Be},mr=function(h){return Ve.call(h.ownerDocument||h,h,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},br=function(h){return h instanceof d&&(typeof h.nodeName!="string"||typeof h.textContent!="string"||typeof h.removeChild!="function"||!(h.attributes instanceof f)||typeof h.removeAttribute!="function"||typeof h.setAttribute!="function"||typeof h.namespaceURI!="string"||typeof h.insertBefore!="function"||typeof h.hasChildNodes!="function")},Di=function(h){return typeof a=="function"&&h instanceof a};function Jt(z,h,k){fr(z,L=>{L.call(e,h,k,R)})}const Ll=function(h){let k=null;if(Jt(ge.beforeSanitizeElements,h,null),br(h))return Le(h),!0;const L=g(h.nodeName);if(Jt(ge.uponSanitizeElement,h,{tagName:L,allowedTags:ce}),m&&h.hasChildNodes()&&!Di(h.firstElementChild)&&je(/<[/\w!]/g,h.innerHTML)&&je(/<[/\w!]/g,h.textContent)||m&&h.namespaceURI===he&&L==="style"&&Di(h.firstElementChild)||h.nodeType===gr.progressingInstruction||m&&h.nodeType===gr.comment&&je(/<[/\w]/g,h.data))return Le(h),!0;if(De[L]||!(Ae.tagCheck instanceof Function&&Ae.tagCheck(L))&&!ce[L]){if(!De[L]&&Ml(L)&&(ie.tagNameCheck instanceof RegExp&&je(ie.tagNameCheck,L)||ie.tagNameCheck instanceof Function&&ie.tagNameCheck(L)))return!1;if(M&&!j[L]){const me=G(h)||h.parentNode,Be=U(h)||h.childNodes;if(Be&&me){const Te=Be.length;for(let it=Te-1;it>=0;--it){const ut=P(Be[it],!0);ut.__removalCount=(h.__removalCount||0)+1,me.insertBefore(ut,Y(h))}}}return Le(h),!0}return h instanceof l&&!Bn(h)||(L==="noscript"||L==="noembed"||L==="noframes")&&je(/<\/no(script|embed|frames)/i,h.innerHTML)?(Le(h),!0):(p&&h.nodeType===gr.text&&(k=h.textContent,fr([Ze,Je,Oe],me=>{k=Ln(k,me," ")}),h.textContent!==k&&(hr(e.removed,{element:h.cloneNode()}),h.textContent=k)),Jt(ge.afterSanitizeElements,h,null),!1)},Pl=function(h,k,L){if(tt[k]||v&&(k==="id"||k==="name")&&(L in n||L in ke))return!1;if(!(rt&&!tt[k]&&je(Qe,k))){if(!(nt&&je(Se,k))){if(!(Ae.attributeCheck instanceof Function&&Ae.attributeCheck(k,h))){if(!pe[k]||tt[k]){if(!(Ml(h)&&(ie.tagNameCheck instanceof RegExp&&je(ie.tagNameCheck,h)||ie.tagNameCheck instanceof Function&&ie.tagNameCheck(h))&&(ie.attributeNameCheck instanceof RegExp&&je(ie.attributeNameCheck,k)||ie.attributeNameCheck instanceof Function&&ie.attributeNameCheck(k,h))||k==="is"&&ie.allowCustomizedBuiltInElements&&(ie.tagNameCheck instanceof RegExp&&je(ie.tagNameCheck,L)||ie.tagNameCheck instanceof Function&&ie.tagNameCheck(L))))return!1}else if(!Ie[k]){if(!je(Yt,Ln(L,ne,""))){if(!((k==="src"||k==="xlink:href"||k==="href")&&h!=="script"&&rp(L,"data:")===0&&de[h])){if(!(Xt&&!je(le,Ln(L,ne,"")))){if(L)return!1}}}}}}}return!0},Ml=function(h){return h!=="annotation-xml"&&Ai(h,et)},Nl=function(h){Jt(ge.beforeSanitizeAttributes,h,null);const{attributes:k}=h;if(!k||br(h))return;const L={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:pe,forceKeepAttr:void 0};let me=k.length;for(;me--;){const Be=k[me],{name:Te,namespaceURI:it,value:ut}=Be,ln=g(Te),zi=ut;let Pe=Te==="value"?zi:sp(zi);if(L.attrName=ln,L.attrValue=Pe,L.keepAttr=!0,L.forceKeepAttr=void 0,Jt(ge.uponSanitizeAttribute,h,L),Pe=L.attrValue,N&&(ln==="id"||ln==="name")&&(mt(Te,h),Pe=C+Pe),m&&je(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,Pe)){mt(Te,h);continue}if(ln==="attributename"&&Ai(Pe,"href")){mt(Te,h);continue}if(L.forceKeepAttr)continue;if(!L.keepAttr){mt(Te,h);continue}if(!u&&je(/\/>/i,Pe)){mt(Te,h);continue}p&&fr([Ze,Je,Oe],Bl=>{Pe=Ln(Pe,Bl," ")});const zl=g(h.nodeName);if(!Pl(zl,ln,Pe)){mt(Te,h);continue}if(O&&typeof S=="object"&&typeof S.getAttributeType=="function"&&!it)switch(S.getAttributeType(zl,ln)){case"TrustedHTML":{Pe=O.createHTML(Pe);break}case"TrustedScriptURL":{Pe=O.createScriptURL(Pe);break}}if(Pe!==zi)try{it?h.setAttributeNS(it,Te,Pe):h.setAttribute(Te,Pe),br(h)?Le(h):bl(e.removed)}catch{mt(Te,h)}}Jt(ge.afterSanitizeAttributes,h,null)},Dl=function(h){let k=null;const L=mr(h);for(Jt(ge.beforeSanitizeShadowDOM,h,null);k=L.nextNode();)Jt(ge.uponSanitizeShadowNode,k,null),Ll(k),Nl(k),k.content instanceof i&&Dl(k.content);Jt(ge.afterSanitizeShadowDOM,h,null)};return e.sanitize=function(z){let h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},k=null,L=null,me=null,Be=null;if(sn=!z,sn&&(z="<!-->"),typeof z!="string"&&!Di(z))if(typeof z.toString=="function"){if(z=z.toString(),typeof z!="string")throw pr("dirty is not a string, aborting")}else throw pr("toString is not a function");if(!e.isSupported)return z;if(x||yn(h),e.removed=[],typeof z=="string"&&(D=!1),D){if(z.nodeName){const ut=g(z.nodeName);if(!ce[ut]||De[ut])throw pr("root node is forbidden and cannot be sanitized in-place")}}else if(z instanceof a)k=Ni("<!---->"),L=k.ownerDocument.importNode(z,!0),L.nodeType===gr.element&&L.nodeName==="BODY"||L.nodeName==="HTML"?k=L:k.appendChild(L);else{if(!A&&!p&&!y&&z.indexOf("<")===-1)return O&&T?O.createHTML(z):z;if(k=Ni(z),!k)return A?null:T?J:""}k&&_&&Le(k.firstChild);const Te=mr(D?z:k);for(;me=Te.nextNode();)Ll(me),Nl(me),me.content instanceof i&&Dl(me.content);if(D)return z;if(A){if(p){k.normalize();let ut=k.innerHTML;fr([Ze,Je,Oe],ln=>{ut=Ln(ut,ln," ")}),k.innerHTML=ut}if(E)for(Be=lt.call(k.ownerDocument);k.firstChild;)Be.appendChild(k.firstChild);else Be=k;return(pe.shadowroot||pe.shadowrootmode)&&(Be=We.call(r,Be,!0)),Be}let it=y?k.outerHTML:k.innerHTML;return y&&ce["!doctype"]&&k.ownerDocument&&k.ownerDocument.doctype&&k.ownerDocument.doctype.name&&je(kl,k.ownerDocument.doctype.name)&&(it="<!DOCTYPE "+k.ownerDocument.doctype.name+`>
`+it),p&&fr([Ze,Je,Oe],ut=>{it=Ln(it,ut," ")}),O&&T?O.createHTML(it):it},e.setConfig=function(){let z=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};yn(z),x=!0},e.clearConfig=function(){R=null,x=!1},e.isValidAttribute=function(z,h,k){R||yn({});const L=g(z),me=g(h);return Pl(L,me,k)},e.addHook=function(z,h){typeof h=="function"&&hr(ge[z],h)},e.removeHook=function(z,h){if(h!==void 0){const k=tp(ge[z],h);return k===-1?void 0:np(ge[z],k,1)[0]}return bl(ge[z])},e.removeHooks=function(z){ge[z]=[]},e.removeAllHooks=function(){ge=Sl()},e}var wp=El();se.setOptions({breaks:!0,gfm:!0});function Li(t){if(!t)return"";const e=se.parse(t,{async:!1});return wp.sanitize(e,{ALLOWED_TAGS:["p","br","strong","b","em","i","code","pre","ul","ol","li","blockquote","a","h1","h2","h3","h4","h5","h6","hr","table","thead","tbody","tr","th","td","del","sup","sub","span"],ALLOWED_ATTR:["href","target","rel","class"]})}const xp="omnichat_translations",_p=1,Pn="translations",Al=[{value:"en",label:"English"},{value:"zh-Hans",label:"简体中文"},{value:"zh-Hant",label:"繁體中文"},{value:"ja",label:"日本語"},{value:"ko",label:"한국어"},{value:"fr",label:"Français"},{value:"de",label:"Deutsch"},{value:"it",label:"Italiano"},{value:"es",label:"Español"},{value:"pt",label:"Português"},{value:"nl",label:"Nederlands"},{value:"pl",label:"Polski"},{value:"tr",label:"Türkçe"},{value:"ar",label:"العربية"},{value:"ru",label:"Русский"},{value:"th",label:"ไทย"},{value:"vi",label:"Tiếng Việt"},{value:"id",label:"Bahasa Indonesia"},{value:"ms",label:"Bahasa Melayu"},{value:"hi",label:"हिन्दी"}];function vp(t){const e=localStorage.getItem(t);if(e)return e;const n=navigator.language||navigator.userLanguage||"",r=n.split("-")[0].toLowerCase();if(r==="zh")return n.toLowerCase().includes("hant")||n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans";const s=Al.find(i=>i.value===r);return s?s.value:"en"}function Rl(){return new Promise((t,e)=>{const n=indexedDB.open(xp,_p);n.onupgradeneeded=()=>{const r=n.result;r.objectStoreNames.contains(Pn)||r.createObjectStore(Pn,{keyPath:"id"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}function Cl(t,e){let n=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);n=(n<<5)-n+s,n|=0}return`${n}:${e}`}async function kp(t,e){try{const n=await Rl(),r=Cl(t,e);return new Promise((s,i)=>{const l=n.transaction(Pn,"readonly").objectStore(Pn).get(r);l.onsuccess=()=>{n.close(),s(l.result?.translatedText||null)},l.onerror=()=>{n.close(),i(l.error)}})}catch{return null}}async function Tp(t,e,n){try{const r=await Rl(),s=Cl(t,e);return new Promise((i,o)=>{const c=r.transaction(Pn,"readwrite").objectStore(Pn).put({id:s,translatedText:n,createdAt:Date.now()});c.onsuccess=()=>{r.close(),i()},c.onerror=()=>{r.close(),o(c.error)}})}catch{}}async function Sp(t,e,n,r){const s=await kp(e,n);if(s)return s;const i={"Content-Type":"application/json"},o=await fetch(`${t}/ai/translate`,{method:"POST",headers:i,body:JSON.stringify({text:e,targetLanguage:n})});if(!o.ok){const c=await o.text();throw new Error(c||`HTTP ${o.status}`)}const l=(await o.json()).translatedText;if(!l)throw new Error("Translation returned empty result");return await Tp(e,n,l),l}const Ep={key:0,style:{"font-size":"12px",opacity:"0.85","margin-top":"2px"}},Ap={style:{display:"flex","align-items":"center",gap:"8px"}},Rp={key:0,style:{position:"relative"}},Cp={key:0,style:{position:"absolute",top:"100%",right:"0","margin-top":"6px",background:"white",border:"1px solid #e5e7eb","border-radius":"8px","box-shadow":"0 4px 16px rgba(0,0,0,0.12)","z-index":"100","min-width":"160px","max-height":"260px","overflow-y":"auto",padding:"4px 0"}},Op=["onClick","onMouseleave"],Ip=["title"],Lp={key:0,class:"drag-overlay"},Pp={key:1,class:"welcome-screen"},Mp={key:0,style:{background:"rgba(254, 226, 226, 0.8)",border:"1px solid #fca5a5",padding:"16px","border-radius":"12px","margin-bottom":"24px","text-align":"center"}},Np={style:{color:"#7f1d1d","white-space":"pre-wrap","font-size":"14px",margin:"0"}},Dp={class:"pre-chat-form"},zp={key:0,class:"ai-label"},Bp=["src","onClick"],Fp=["innerHTML"],$p=["innerHTML"],Up={class:"msg-time"},Hp=["onClick","disabled","title"],jp={key:0,class:"msg-bubble ai ai-streaming",style:{"align-self":"flex-start"}},qp=["innerHTML"],Vp={key:1,class:"typing-hint"},Wp={key:2,class:"resolved-banner"},Kp={key:0,class:"review-section"},Gp={class:"star-rating"},Yp=["onClick"],Xp={key:1,class:"review-thank-you"},Zp={key:0,class:"confirm-action-area"},Jp={key:1,class:"input-area"},Qp={key:0,style:{position:"absolute",top:"-32px",left:"12px",right:"12px",background:"#fef2f2",color:"#dc2626","font-size":"11px",padding:"4px 10px","border-radius":"6px",border:"1px solid #fecaca"}},ed=["disabled"],td=["placeholder","disabled","onKeydown"],nd=["disabled"],rd=["src"],Ol=200,Il=lf(Ao({__name:"App.ce",props:{serverUrl:{type:String,required:!0},bubbleColor:{type:String,default:"#4F46E5"},welcomeMessage:{type:String,default:"Hello! How can we help you today?"}},setup(t){const e=t,n=q(null),r=q(!0),s=q(null),i=q([]),o=q(""),a=q(!1),l=q(""),c=q(!1),f=q(""),d=q(null),w=q(""),S=q(!1),I=q(!1),P=q(!0),ae=q(!0);let Y=null,U=!1;function G(){if(!d.value)return!0;const b=d.value;return b.scrollHeight-b.scrollTop-b.clientHeight<80}function O(){U||Y||(Y=requestAnimationFrame(()=>{Mn(!0),Y=null}))}Dr(d,(b,g)=>{g&&g.removeEventListener("scroll",T),b&&b.addEventListener("scroll",T,{passive:!0})});const J=q(""),xe=q(""),Ve=q("We are currently offline. Please check back later."),lt=q(!1),ct=q(localStorage.getItem("omnichat_visitor_muted")==="true"),We=q(""),ge=q(!0),Ze=q(vp("omnichat_visitor_translate_lang")),Je=q(!1),Oe=q(new Set),Qe=q({});function Se(b){Ze.value=b,localStorage.setItem("omnichat_visitor_translate_lang",b)}async function le(b){if(Qe.value[b.id]){delete Qe.value[b.id];return}if(Oe.value.has(b.id))return;const g=b.content||"";if(g.trim()){Oe.value=new Set([...Oe.value,b.id]);try{const R=await Sp(e.serverUrl,g,Ze.value);Qe.value={...Qe.value,[b.id]:R}}catch(R){console.warn("Translation failed:",R.message)}finally{const R=new Set(Oe.value);R.delete(b.id),Oe.value=R}}}function ne(b){ae.value&&(!b.content||b.messageType==="image"||Qe.value[b.id]||Oe.value.has(b.id)||le(b))}const et=new Audio;function Yt(){if(!ct.value)if(We.value){const b=We.value.startsWith("http")?We.value:e.serverUrl+We.value;et.src!==b&&(et.src=b),et.currentTime=0,et.play().catch(g=>console.warn("Audio autoplay blocked:",g))}else try{const b=new(window.AudioContext||window.webkitAudioContext),g=b.createOscillator(),R=b.createGain();g.connect(R),R.connect(b.destination),g.type="sine",g.frequency.setValueAtTime(600,b.currentTime),g.frequency.exponentialRampToValueAtTime(100,b.currentTime+.1),R.gain.setValueAtTime(.5,b.currentTime),R.gain.exponentialRampToValueAtTime(.01,b.currentTime+.1),g.start(b.currentTime),g.stop(b.currentTime+.1)}catch(b){console.warn("Synthesized audio failed:",b)}}function ce(){ct.value=!ct.value,localStorage.setItem("omnichat_visitor_muted",ct.value?"true":"false")}const _e=Ks(()=>J.value||e.bubbleColor),pe=q(""),rn=q(""),ie=q(0),De=q(""),tt=q(!1),Ae=q(!1),nt=q(!1),rt=q(!1),Xt=q(0),u=q(null),p=q(null),m=q(null),y=q("");function x(){const b="omnichat_visitor_id";let g=localStorage.getItem(b);return g||(g=window.crypto&&crypto.randomUUID?"v_"+crypto.randomUUID():"v_"+Math.random().toString(36).slice(2,12)+Date.now().toString(36),localStorage.setItem(b,g)),g}function _(){f.value=x();const b=ts(e.serverUrl,{auth:{visitorId:f.value},transports:["websocket","polling"]});b.on("connect",()=>{const g=localStorage.getItem("omnichat_conversation_id");g&&(s.value=g,b.emit("join_conversation",{conversationId:g}))}),b.on("upload_token",g=>{p.value=g.token}),b.on("conversation_started",g=>{s.value=g.conversation.id,localStorage.setItem("omnichat_conversation_id",g.conversation.id)}),b.on("conversation_history",g=>{i.value=g.conversation.messages||[],c.value=g.conversation.status==="resolved",g.conversation.rating&&(tt.value=!0),Gn(()=>Mn())}),b.on("inactivity_warning",g=>{g.conversationId===s.value&&(i.value.push({id:"sys_"+Date.now(),conversationId:g.conversationId,senderType:"system",content:g.message,createdAt:new Date().toISOString()}),A(),Gn(()=>Mn()))}),b.on("message_error",g=>{y.value=g.error,setTimeout(()=>y.value="",4e3)}),b.on("new_message",g=>{g.message.conversationId===s.value&&(g.message.senderType==="ai"&&S.value&&(S.value=!1,w.value="",U=!1),i.value.push(g.message),A(),(g.message.senderType==="agent"||g.message.senderType==="ai")&&Yt(),Gn(()=>{Mn(),r.value&&(g.message.senderType==="agent"||g.message.senderType==="ai")&&n.value?.emit("read_message",{messageId:g.message.id,conversationId:s.value}),(g.message.senderType==="agent"||g.message.senderType==="ai")&&ne(g.message)}))}),b.on("ai_stream",g=>{g.conversationId===s.value&&(g.isComplete||(S.value=!0,w.value+=g.token,O()))}),b.on("message_read",g=>{const R=i.value.find(ke=>ke.id===g.messageId);R&&(R.readAt=g.readAt)}),b.on("agent_typing",g=>{g.conversationId===s.value&&(a.value=g.isTyping,l.value=g.user)}),b.on("conversation_resolved",g=>{g.conversationId===s.value&&(c.value=!0)}),b.on("error",g=>{console.error("Visitor Error:",g.message),g.message==="Failed to resolve conversation"&&(c.value=!0)}),b.on("disconnect",()=>{}),n.value=b}function A(){i.value.length>Ol&&i.value.splice(0,i.value.length-Ol)}function E(b){return b?b.slice(-8).toUpperCase():""}function T(){S.value&&(U=!G())}function v(b){!s.value||!r.value||(b.preventDefault(),Xt.value++,rt.value=!0)}function N(b){!s.value||!r.value||b.preventDefault()}function C(b){!s.value||!r.value||(b.preventDefault(),Xt.value--,Xt.value<=0&&(Xt.value=0,rt.value=!1))}function M(b){b.preventDefault(),Xt.value=0,rt.value=!1,s.value&&b.dataTransfer?.files&&b.dataTransfer.files.length>0&&Ie(b.dataTransfer.files[0])}function D(b){m.value=b}function H(){m.value=null}function j(){pe.value.trim()||alert("Please provide your name to continue."),n.value?.emit("start_conversation",{visitorId:f.value,visitorName:pe.value.trim(),visitorEmail:rn.value.trim(),visitorCurrentUrl:window.location.href,visitorTimezone:Intl.DateTimeFormat().resolvedOptions().timeZone,visitorLanguage:navigator.language,visitorScreenRes:`${window.screen.width}x${window.screen.height}`,visitorReferrer:document.referrer||null,metadata:JSON.stringify({userAgent:navigator.userAgent})})}function Q(){u.value?.click()}function de(b,g=1200,R=.8){return new Promise((ke,St)=>{const yn=new FileReader;yn.readAsDataURL(b),yn.onload=zn=>{const an=new Image;an.src=zn.target?.result,an.onload=()=>{const Bn=document.createElement("canvas");let Le=an.width,mt=an.height;Le>g&&(mt=Math.round(mt*g/Le),Le=g),Bn.width=Le,Bn.height=mt,Bn.getContext("2d")?.drawImage(an,0,0,Le,mt),Bn.toBlob(mr=>{if(mr){const br=b.name.replace(/\.[^/.]+$/,"")+".webp";ke(new File([mr],br,{type:"image/webp"}))}else St(new Error("Canvas to Blob failed"))},"image/webp",R)}},yn.onerror=zn=>St(zn)})}async function ye(b){const g=b.target;!g.files||g.files.length===0||await Ie(g.files[0])}async function Ie(b){b.size>5*1024*1024&&alert("File size exceeds 5MB limit."),nt.value=!0;try{const R=b.name.toLowerCase(),ke=R.endsWith(".heic")||R.endsWith(".heif")||b.type==="image/heic"||b.type==="image/heif";if(!ke&&b.type.match(/image\/(jpeg|jpg|png|webp)/))b=await de(b,1200,.8);else if(!ke)throw new Error(`Unsupported format: ${b.type}`)}catch(R){console.error("Image processing failed",R),alert(`Failed to process image: ${R.message}.`),nt.value=!1,u.value&&(u.value.value="");return}const g=new FormData;g.append("file",b),s.value&&g.append("conversationId",s.value);try{const R={};p.value&&(R.Authorization=p.value);const ke=await fetch(`${e.serverUrl}/upload`,{method:"POST",headers:R,body:g});if(!ke.ok)throw new Error("Upload failed");const St=await ke.json();St.uploadToken&&(p.value=St.uploadToken),n.value?.emit("send_message",{conversationId:s.value,content:"",messageType:"image",attachmentUrl:`${e.serverUrl}${St.url}`,attachmentThumbnailUrl:`${e.serverUrl}${St.thumbnailUrl||St.url}`})}catch(R){console.error("Upload error:",R),alert("Failed to upload file.")}finally{nt.value=!1,u.value&&(u.value.value="")}}function ze(){if(!o.value.trim()||!s.value)return;const b=o.value.trim();if(b.length>100){y.value=`Message too long (${b.length}/100 characters).`,setTimeout(()=>y.value="",4e3);return}y.value="",n.value?.emit("send_message",{conversationId:s.value,content:o.value.trim(),messageType:"text"}),n.value?.emit("typing_stop",{conversationId:s.value}),o.value=""}let st=null;function Zt(){s.value&&(n.value?.emit("typing_start",{conversationId:s.value}),st&&clearTimeout(st),st=setTimeout(()=>{n.value?.emit("typing_stop",{conversationId:s.value})},2e3))}function he(){!s.value||ie.value===0||(n.value?.emit("submit_review",{conversationId:s.value,rating:ie.value,review:De.value.trim()}),tt.value=!0)}function Ee(){Ae.value=!0}function sn(){if(!s.value){c.value=!0,Ae.value=!1;return}n.value?.emit("resolve_conversation",{conversationId:s.value}),Ae.value=!1}function on(){Ae.value=!1}function Mn(b=!1){d.value&&(b?d.value.scrollTop=d.value.scrollHeight:d.value.scrollTo({top:d.value.scrollHeight,behavior:"smooth"}))}function Nn(b){const g=new Date(b),R=g.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`${g.toLocaleDateString([],{month:"short",day:"numeric"})} ${R}`}function Dn(){s.value=null,i.value=[],c.value=!1,tt.value=!1,ie.value=0,De.value="",w.value="",S.value=!1,localStorage.removeItem("omnichat_conversation_id")}const Pi=Ks(()=>({fontSize:"10px",color:o.value.length>=85?"#dc2626":"#9ca3af",position:"absolute",bottom:"4px",right:"65px",pointerEvents:"none"}));function bn(b){return Ze.value===b.value?{background:"#eef2ff",color:"#4f46e5",fontWeight:600}:{}}Po(()=>{fetch(`${e.serverUrl}/config/active`).then(b=>b.json()).then(b=>{b.bubbleColor&&(J.value=b.bubbleColor),b.welcomeMessage&&(xe.value=b.welcomeMessage),b.offlineMessage&&(Ve.value=b.offlineMessage),b.isOfflineMode!==void 0&&(lt.value=b.isOfflineMode),b.notificationSoundUrl&&(We.value=b.notificationSoundUrl),b.aiEnabled!==void 0&&(I.value=b.aiEnabled),b.translationEnabled!==void 0&&(P.value=b.translationEnabled),b.autoTranslationEnabled!==void 0&&(ae.value=b.autoTranslationEnabled),b.showVisitorWidget!==void 0&&(ge.value=b.showVisitorWidget)}).catch(()=>{}),_()}),Ms(()=>{n.value?.disconnect()});function Mi(){try{window.opener?window.close():window.parent!==window?window.parent.postMessage({type:"omnichat-close"},"*"):window.history.back()}catch{window.history.back()}}return(b,g)=>(te(),re(Ce,null,[ge.value?(te(),re("div",{key:0,class:"panel-wrapper",style:{left:"0px",top:"0px",width:"100vw",height:"100dvh",borderRadius:"0px",border:"none"},onDragenter:v,onDragover:N,onDragleave:C,onDrop:M},[B("div",{class:"panel-header",style:yt({backgroundColor:_e.value})},[B("div",null,[B("h3",null,Ge(s.value?"Chat Support":"Chat with us"),1),s.value?(te(),re("span",Ep," Ticket: #"+Ge(E(s.value)),1)):pt("",!0)]),B("div",Ap,[P.value?(te(),re("div",Rp,[B("button",{type:"button",class:"close-btn",onClick:g[0]||(g[0]=R=>Je.value=!Je.value),title:"Translate",style:{"font-size":"16px"}}," 🌐 "),Je.value?(te(),re("div",Cp,[(te(!0),re(Ce,null,Ns(kn(Al),R=>(te(),re("button",{key:R.value,onClick:ke=>{Se(R.value),Je.value=!1},style:yt([{display:"block",width:"100%","text-align":"left",padding:"6px 14px",border:"none",background:"none",cursor:"pointer","font-size":"13px",color:"#374151"},bn(R)]),onMouseenter:g[1]||(g[1]=ke=>ke.target.style.background="#f3f4f6"),onMouseleave:ke=>ke.target.style.background=Ze.value===R.value?"#eef2ff":"none"},Ge(R.label),45,Op))),128))])):pt("",!0)])):pt("",!0),B("button",{type:"button",class:"close-btn",onClick:ce,title:ct.value?"Unmute":"Mute",style:{"font-size":"16px"}},Ge(ct.value?"🔕":"🔔"),9,Ip),B("button",{type:"button",class:"close-btn",onClick:Mi,"aria-label":"Close chat"}," × ")])],4),rt.value?(te(),re("div",Lp,[...g[7]||(g[7]=[B("div",{class:"drag-overlay-content"},[B("span",{style:{"font-size":"40px","margin-bottom":"12px",display:"block","text-align":"center"}},"📥"),B("span",null,"Drop file to upload")],-1)])])):pt("",!0),s.value?(te(),re(Ce,{key:2},[B("div",{ref_key:"messagesArea",ref:d,class:"messages-area"},[(te(!0),re(Ce,null,Ns(i.value,R=>(te(),re("div",{key:R.id,class:Un(["msg-bubble",R.senderType]),style:yt(R.senderType==="visitor"?{backgroundColor:_e.value,padding:R.messageType==="image"?"4px":""}:{padding:R.messageType==="image"?"4px":""})},[R.senderType==="ai"?(te(),re("div",zp,"AI Agent")):pt("",!0),R.messageType==="image"?(te(),re(Ce,{key:1},[B("img",{src:R.attachmentThumbnailUrl||R.attachmentUrl,alt:"Attachment",style:{"max-width":"100%","max-height":"150px","border-radius":"8px",display:"block",cursor:"pointer","object-fit":"cover"},onClick:ke=>D(R.attachmentUrl||"")},null,8,Bp),R.content?(te(),re("div",{key:0,class:"md-content",style:{padding:"8px"},innerHTML:kn(Li)(Qe.value[R.id]||R.content)},null,8,Fp)):pt("",!0)],64)):(te(),re("div",{key:2,class:"md-content",innerHTML:kn(Li)(Qe.value[R.id]||R.content||"")},null,8,$p)),B("div",{class:"msg-meta",style:yt({display:"flex",alignItems:"center",justifyContent:"space-between",padding:R.messageType==="image"?"0 8px 8px 8px":""})},[B("span",Up,Ge(Nn(R.createdAt)),1),R.content&&R.messageType!=="image"&&P.value?(te(),re("button",{key:0,onClick:ke=>le(R),disabled:Oe.value.has(R.id),style:{background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"inherit",padding:"1px 6px","border-radius":"4px","font-size":"10px",cursor:"pointer",opacity:"0.7"},title:Qe.value[R.id]?"Show original":"Translate"},Ge(Oe.value.has(R.id)?"...":Qe.value[R.id]?"Original":"Translate"),9,Hp)):pt("",!0)],4)],6))),128))],512),S.value&&w.value?(te(),re("div",jp,[g[9]||(g[9]=B("div",{class:"ai-label"},"AI Agent",-1)),B("div",{class:"md-content",innerHTML:kn(Li)(w.value)},null,8,qp),g[10]||(g[10]=B("span",{class:"ai-cursor"},"|",-1))])):pt("",!0),a.value?(te(),re("div",Vp,[B("span",null,Ge(l.value)+" is typing",1)])):pt("",!0),c.value?(te(),re("div",Wp,[g[12]||(g[12]=jr(" This conversation has been resolved. ",-1)),g[13]||(g[13]=B("br",null,null,-1)),g[14]||(g[14]=jr(" Reference Ticket: ",-1)),B("strong",null,"#"+Ge(E(s.value)),1),tt.value?(te(),re("div",Xp,"Thank you for your feedback!")):(te(),re("div",Kp,[g[11]||(g[11]=B("p",null,"How was your experience?",-1)),B("div",Gp,[(te(),re(Ce,null,Ns(5,R=>B("span",{key:R,onClick:ke=>ie.value=R,class:Un({active:R<=ie.value})},"★",10,Yp)),64))]),Mr(B("textarea",{"onUpdate:modelValue":g[4]||(g[4]=R=>De.value=R),placeholder:"Any comments? (Optional)",class:"form-input"},null,512),[[Kr,De.value]]),B("button",{type:"button",class:"submit-review-btn",style:yt({backgroundColor:_e.value}),onClick:he},"Submit Review",4)])),B("button",{type:"button",class:"start-new-chat-btn",onClick:Dn},"Start a new chat")])):(te(),re(Ce,{key:3},[Ae.value?(te(),re("div",Zp,[g[15]||(g[15]=B("span",{class:"confirm-text"},"End this chat?",-1)),B("div",{class:"confirm-buttons"},[B("button",{type:"button",class:"confirm-yes-btn",onClick:sn},"End"),B("button",{type:"button",class:"confirm-cancel-btn",onClick:on},"Cancel")])])):(te(),re("div",Jp,[y.value?(te(),re("div",Qp,Ge(y.value),1)):pt("",!0),B("button",{type:"button",class:"attachment-btn",style:{background:"transparent",border:"none","font-size":"18px",cursor:"pointer",color:"#64748b",display:"flex","align-items":"center","justify-content":"center"},disabled:nt.value,onClick:Q,title:"Attach Image (Max 5MB)"},[...g[16]||(g[16]=[B("span",{style:{transform:"rotate(45deg)"}},"📎",-1)])],8,ed),B("input",{type:"file",ref_key:"fileInput",ref:u,style:{display:"none"},accept:"image/*",onChange:ye},null,544),Mr(B("textarea",{"onUpdate:modelValue":g[5]||(g[5]=R=>o.value=R),class:"msg-input",rows:"1",maxlength:"100",placeholder:nt.value?"Uploading...":"Type your message...",disabled:nt.value,onKeydown:[Oa(Qs(ze,["exact","prevent"]),["enter"]),Oa(Qs(()=>{},["shift","exact"]),["enter"])],onInput:Zt},null,40,td),[[Kr,o.value]]),B("span",{style:yt(Pi.value)},Ge(o.value.length)+"/100",5),B("button",{type:"button",class:"send-msg-btn",style:yt({backgroundColor:_e.value,boxShadow:"0 4px 10px "+_e.value+"40"}),disabled:!o.value.trim()&&!nt.value,onClick:ze},Ge(nt.value?"...":"Send"),13,nd),B("button",{type:"button",class:"end-chat-btn",onClick:Ee,title:"End Chat"},"✖")]))],64))],64)):(te(),re("div",Pp,[lt.value&&!I.value?(te(),re("div",Mp,[g[8]||(g[8]=B("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0 0 8px 0","font-size":"15px"}},[B("span",null,"🌙"),jr(" Agents are offline ")],-1)),B("p",Np,Ge(Ve.value),1)])):(te(),re(Ce,{key:1},[B("p",null,Ge(xe.value||t.welcomeMessage),1),B("div",Dp,[Mr(B("input",{"onUpdate:modelValue":g[2]||(g[2]=R=>pe.value=R),type:"text",placeholder:"Your Name",class:"form-input"},null,512),[[Kr,pe.value]]),Mr(B("input",{"onUpdate:modelValue":g[3]||(g[3]=R=>rn.value=R),type:"text",inputmode:"email",placeholder:"Your Email (Optional)",class:"form-input"},null,512),[[Kr,rn.value]])]),B("button",{type:"button",class:"start-chat-btn",style:yt({backgroundColor:_e.value,boxShadow:"0 4px 14px "+_e.value+"66"}),onClick:j}," Start a conversation ",4)],64))]))],32)):pt("",!0),m.value?(te(),re("div",{key:1,style:{position:"fixed",inset:"0",background:"rgba(0,0,0,0.8)","z-index":"2147483647",display:"flex","align-items":"center","justify-content":"center"},onClick:H},[g[17]||(g[17]=B("button",{style:{position:"absolute",top:"20px",right:"20px",background:"none",border:"none",color:"white","font-size":"32px",cursor:"pointer"}},"×",-1)),B("img",{src:m.value,style:{"max-width":"90vw","max-height":"90vh","object-fit":"contain","border-radius":"4px"},onClick:g[6]||(g[6]=Qs(()=>{},["stop"]))},null,8,rd)])):pt("",!0)],64))}}),{styles:[`*, ::before, ::after {
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
.visible {
  visibility: visible;
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
.w-10 {
  width: 2.5rem;
}
.w-11 {
  width: 2.75rem;
}
.w-2 {
  width: 0.5rem;
}
.w-32 {
  width: 8rem;
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
.overflow-x-auto {
  overflow-x: auto;
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
.bg-gray-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
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
.text-green-400 {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity, 1));
}
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}
.text-green-700 {
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
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
.after\\:left-\\[2px\\]::after {
  content: var(--tw-content);
  left: 2px;
}
.after\\:top-\\[2px\\]::after {
  content: var(--tw-content);
  top: 2px;
}
.after\\:h-5::after {
  content: var(--tw-content);
  height: 1.25rem;
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
.peer:checked ~ .peer-checked\\:after\\:translate-x-full::after {
  content: var(--tw-content);
  --tw-translate-x: 100%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
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
`]});return customElements.define("omnichat-chat-page",Il),Ut.OmniChatChatPage=Il,Object.defineProperty(Ut,Symbol.toStringTag,{value:"Module"}),Ut}({});
