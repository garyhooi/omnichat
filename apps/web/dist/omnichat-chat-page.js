var OmniChatChatPage=function(qt){"use strict";var bd=Object.defineProperty;var yd=(qt,xt,Z)=>xt in qt?bd(qt,xt,{enumerable:!0,configurable:!0,writable:!0,value:Z}):qt[xt]=Z;var he=(qt,xt,Z)=>yd(qt,typeof xt!="symbol"?xt+"":xt,Z);/**
* @vue/shared v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/var fs;function xt(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const Z={},xn=[],Rt=()=>{},qi=()=>!1,wr=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),xr=t=>t.startsWith("onUpdate:"),_e=Object.assign,hs=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Wl=Object.prototype.hasOwnProperty,ne=(t,e)=>Wl.call(t,e),$=Array.isArray,vn=t=>Fn(t)==="[object Map]",Vi=t=>Fn(t)==="[object Set]",Wi=t=>Fn(t)==="[object Date]",U=t=>typeof t=="function",we=t=>typeof t=="string",Ct=t=>typeof t=="symbol",ae=t=>t!==null&&typeof t=="object",Ki=t=>(ae(t)||U(t))&&U(t.then)&&U(t.catch),Gi=Object.prototype.toString,Fn=t=>Gi.call(t),Kl=t=>Fn(t).slice(8,-1),vr=t=>Fn(t)==="[object Object]",ps=t=>we(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,$n=xt(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),_r=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},Gl=/-\w/g,Xe=_r(t=>t.replace(Gl,e=>e.slice(1).toUpperCase())),Yl=/\B([A-Z])/g,lt=_r(t=>t.replace(Yl,"-$1").toLowerCase()),Yi=_r(t=>t.charAt(0).toUpperCase()+t.slice(1)),ds=_r(t=>t?`on${Yi(t)}`:""),Ot=(t,e)=>!Object.is(t,e),kr=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},Xi=(t,e,n,r=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:r,value:n})},gs=t=>{const e=parseFloat(t);return isNaN(e)?t:e},Zi=t=>{const e=we(t)?Number(t):NaN;return isNaN(e)?t:e};let Ji;const Tr=()=>Ji||(Ji=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function vt(t){if($(t)){const e={};for(let n=0;n<t.length;n++){const r=t[n],s=we(r)?Ql(r):vt(r);if(s)for(const i in s)e[i]=s[i]}return e}else if(we(t)||ae(t))return t}const Xl=/;(?![^(]*\))/g,Zl=/:([^]+)/,Jl=/\/\*[^]*?\*\//g;function Ql(t){const e={};return t.replace(Jl,"").split(Xl).forEach(n=>{if(n){const r=n.split(Zl);r.length>1&&(e[r[0].trim()]=r[1].trim())}}),e}function Un(t){let e="";if(we(t))e=t;else if($(t))for(let n=0;n<t.length;n++){const r=Un(t[n]);r&&(e+=r+" ")}else if(ae(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const ec=xt("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function Qi(t){return!!t||t===""}function tc(t,e){if(t.length!==e.length)return!1;let n=!0;for(let r=0;n&&r<t.length;r++)n=ms(t[r],e[r]);return n}function ms(t,e){if(t===e)return!0;let n=Wi(t),r=Wi(e);if(n||r)return n&&r?t.getTime()===e.getTime():!1;if(n=Ct(t),r=Ct(e),n||r)return t===e;if(n=$(t),r=$(e),n||r)return n&&r?tc(t,e):!1;if(n=ae(t),r=ae(e),n||r){if(!n||!r)return!1;const s=Object.keys(t).length,i=Object.keys(e).length;if(s!==i)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!ms(t[o],e[o]))return!1}}return String(t)===String(e)}const eo=t=>!!(t&&t.__v_isRef===!0),Ue=t=>we(t)?t:t==null?"":$(t)||ae(t)&&(t.toString===Gi||!U(t.toString))?eo(t)?Ue(t.value):JSON.stringify(t,to,2):String(t),to=(t,e)=>eo(e)?to(t,e.value):vn(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[r,s],i)=>(n[bs(r,i)+" =>"]=s,n),{})}:Vi(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>bs(n))}:Ct(e)?bs(e):ae(e)&&!$(e)&&!vr(e)?String(e):e,bs=(t,e="")=>{var n;return Ct(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ze;class nc{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=Ze,!e&&Ze&&(this.index=(Ze.scopes||(Ze.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=Ze;try{return Ze=this,e()}finally{Ze=n}}}on(){++this._on===1&&(this.prevScope=Ze,Ze=this)}off(){this._on>0&&--this._on===0&&(Ze=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,r=this.scopes.length;n<r;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function rc(){return Ze}let pe;const ys=new WeakSet;class no{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Ze&&Ze.active&&Ze.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,ys.has(this)&&(ys.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||so(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,co(this),io(this);const e=pe,n=_t;pe=this,_t=!0;try{return this.fn()}finally{oo(this),pe=e,_t=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)_s(e);this.deps=this.depsTail=void 0,co(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?ys.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){vs(this)&&this.run()}get dirty(){return vs(this)}}let ro=0,Hn,jn;function so(t,e=!1){if(t.flags|=8,e){t.next=jn,jn=t;return}t.next=Hn,Hn=t}function ws(){ro++}function xs(){if(--ro>0)return;if(jn){let e=jn;for(jn=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;Hn;){let e=Hn;for(Hn=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(r){t||(t=r)}e=n}}if(t)throw t}function io(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function oo(t){let e,n=t.depsTail,r=n;for(;r;){const s=r.prevDep;r.version===-1?(r===n&&(n=s),_s(r),sc(r)):e=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}t.deps=e,t.depsTail=n}function vs(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(ao(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function ao(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===qn)||(t.globalVersion=qn,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!vs(t))))return;t.flags|=2;const e=t.dep,n=pe,r=_t;pe=t,_t=!0;try{io(t);const s=t.fn(t._value);(e.version===0||Ot(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{pe=n,_t=r,oo(t),t.flags&=-3}}function _s(t,e=!1){const{dep:n,prevSub:r,nextSub:s}=t;if(r&&(r.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=r,t.nextSub=void 0),n.subs===t&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)_s(i,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function sc(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let _t=!0;const lo=[];function It(){lo.push(_t),_t=!1}function Lt(){const t=lo.pop();_t=t===void 0?!0:t}function co(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=pe;pe=void 0;try{e()}finally{pe=n}}}let qn=0;class ic{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class ks{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!pe||!_t||pe===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==pe)n=this.activeLink=new ic(pe,this),pe.deps?(n.prevDep=pe.depsTail,pe.depsTail.nextDep=n,pe.depsTail=n):pe.deps=pe.depsTail=n,uo(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=pe.depsTail,n.nextDep=void 0,pe.depsTail.nextDep=n,pe.depsTail=n,pe.deps===n&&(pe.deps=r)}return n}trigger(e){this.version++,qn++,this.notify(e)}notify(e){ws();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{xs()}}}function uo(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let r=e.deps;r;r=r.nextDep)uo(r)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const Ts=new WeakMap,fn=Symbol(""),Ss=Symbol(""),Vn=Symbol("");function De(t,e,n){if(_t&&pe){let r=Ts.get(t);r||Ts.set(t,r=new Map);let s=r.get(n);s||(r.set(n,s=new ks),s.map=r,s.key=n),s.track()}}function Vt(t,e,n,r,s,i){const o=Ts.get(t);if(!o){qn++;return}const a=l=>{l&&l.trigger()};if(ws(),e==="clear")o.forEach(a);else{const l=$(t),c=l&&ps(n);if(l&&n==="length"){const f=Number(r);o.forEach((d,y)=>{(y==="length"||y===Vn||!Ct(y)&&y>=f)&&a(d)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(Vn)),e){case"add":l?c&&a(o.get("length")):(a(o.get(fn)),vn(t)&&a(o.get(Ss)));break;case"delete":l||(a(o.get(fn)),vn(t)&&a(o.get(Ss)));break;case"set":vn(t)&&a(o.get(fn));break}}xs()}function _n(t){const e=J(t);return e===t?e:(De(e,"iterate",Vn),gt(t)?e:e.map(kt))}function Sr(t){return De(t=J(t),"iterate",Vn),t}function Pt(t,e){return Kt(t)?kn(hn(t)?kt(e):e):kt(e)}const oc={__proto__:null,[Symbol.iterator](){return Es(this,Symbol.iterator,t=>Pt(this,t))},concat(...t){return _n(this).concat(...t.map(e=>$(e)?_n(e):e))},entries(){return Es(this,"entries",t=>(t[1]=Pt(this,t[1]),t))},every(t,e){return Wt(this,"every",t,e,void 0,arguments)},filter(t,e){return Wt(this,"filter",t,e,n=>n.map(r=>Pt(this,r)),arguments)},find(t,e){return Wt(this,"find",t,e,n=>Pt(this,n),arguments)},findIndex(t,e){return Wt(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Wt(this,"findLast",t,e,n=>Pt(this,n),arguments)},findLastIndex(t,e){return Wt(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Wt(this,"forEach",t,e,void 0,arguments)},includes(...t){return As(this,"includes",t)},indexOf(...t){return As(this,"indexOf",t)},join(t){return _n(this).join(t)},lastIndexOf(...t){return As(this,"lastIndexOf",t)},map(t,e){return Wt(this,"map",t,e,void 0,arguments)},pop(){return Wn(this,"pop")},push(...t){return Wn(this,"push",t)},reduce(t,...e){return fo(this,"reduce",t,e)},reduceRight(t,...e){return fo(this,"reduceRight",t,e)},shift(){return Wn(this,"shift")},some(t,e){return Wt(this,"some",t,e,void 0,arguments)},splice(...t){return Wn(this,"splice",t)},toReversed(){return _n(this).toReversed()},toSorted(t){return _n(this).toSorted(t)},toSpliced(...t){return _n(this).toSpliced(...t)},unshift(...t){return Wn(this,"unshift",t)},values(){return Es(this,"values",t=>Pt(this,t))}};function Es(t,e,n){const r=Sr(t),s=r[e]();return r!==t&&!gt(t)&&(s._next=s.next,s.next=()=>{const i=s._next();return i.done||(i.value=n(i.value)),i}),s}const ac=Array.prototype;function Wt(t,e,n,r,s,i){const o=Sr(t),a=o!==t&&!gt(t),l=o[e];if(l!==ac[e]){const d=l.apply(t,i);return a?kt(d):d}let c=n;o!==t&&(a?c=function(d,y){return n.call(this,Pt(t,d),y,t)}:n.length>2&&(c=function(d,y){return n.call(this,d,y,t)}));const f=l.call(o,c,r);return a&&s?s(f):f}function fo(t,e,n,r){const s=Sr(t),i=s!==t&&!gt(t);let o=n,a=!1;s!==t&&(i?(a=r.length===0,o=function(c,f,d){return a&&(a=!1,c=Pt(t,c)),n.call(this,c,Pt(t,f),d,t)}):n.length>3&&(o=function(c,f,d){return n.call(this,c,f,d,t)}));const l=s[e](o,...r);return a?Pt(t,l):l}function As(t,e,n){const r=J(t);De(r,"iterate",Vn);const s=r[e](...n);return(s===-1||s===!1)&&Is(n[0])?(n[0]=J(n[0]),r[e](...n)):s}function Wn(t,e,n=[]){It(),ws();const r=J(t)[e].apply(t,n);return xs(),Lt(),r}const lc=xt("__proto__,__v_isRef,__isVue"),ho=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(Ct));function cc(t){Ct(t)||(t=String(t));const e=J(this);return De(e,"has",t),e.hasOwnProperty(t)}class po{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,r){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(s?i?xo:wo:i?yo:bo).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(r)?e:void 0;const o=$(e);if(!s){let l;if(o&&(l=oc[n]))return l;if(n==="hasOwnProperty")return cc}const a=Reflect.get(e,n,Oe(e)?e:r);if((Ct(n)?ho.has(n):lc(n))||(s||De(e,"get",n),i))return a;if(Oe(a)){const l=o&&ps(n)?a:a.value;return s&&ae(l)?Os(l):l}return ae(a)?s?Os(a):Cs(a):a}}class go extends po{constructor(e=!1){super(!1,e)}set(e,n,r,s){let i=e[n];const o=$(e)&&ps(n);if(!this._isShallow){const c=Kt(i);if(!gt(r)&&!Kt(r)&&(i=J(i),r=J(r)),!o&&Oe(i)&&!Oe(r))return c||(i.value=r),!0}const a=o?Number(n)<e.length:ne(e,n),l=Reflect.set(e,n,r,Oe(e)?e:s);return e===J(s)&&(a?Ot(r,i)&&Vt(e,"set",n,r):Vt(e,"add",n,r)),l}deleteProperty(e,n){const r=ne(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&r&&Vt(e,"delete",n,void 0),s}has(e,n){const r=Reflect.has(e,n);return(!Ct(n)||!ho.has(n))&&De(e,"has",n),r}ownKeys(e){return De(e,"iterate",$(e)?"length":fn),Reflect.ownKeys(e)}}class mo extends po{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const uc=new go,fc=new mo,hc=new go(!0),pc=new mo(!0),Rs=t=>t,Er=t=>Reflect.getPrototypeOf(t);function dc(t,e,n){return function(...r){const s=this.__v_raw,i=J(s),o=vn(i),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=s[t](...r),f=n?Rs:e?kn:kt;return!e&&De(i,"iterate",l?Ss:fn),_e(Object.create(c),{next(){const{value:d,done:y}=c.next();return y?{value:d,done:y}:{value:a?[f(d[0]),f(d[1])]:f(d),done:y}}})}}function Ar(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function gc(t,e){const n={get(s){const i=this.__v_raw,o=J(i),a=J(s);t||(Ot(s,a)&&De(o,"get",s),De(o,"get",a));const{has:l}=Er(o),c=e?Rs:t?kn:kt;if(l.call(o,s))return c(i.get(s));if(l.call(o,a))return c(i.get(a));i!==o&&i.get(s)},get size(){const s=this.__v_raw;return!t&&De(J(s),"iterate",fn),s.size},has(s){const i=this.__v_raw,o=J(i),a=J(s);return t||(Ot(s,a)&&De(o,"has",s),De(o,"has",a)),s===a?i.has(s):i.has(s)||i.has(a)},forEach(s,i){const o=this,a=o.__v_raw,l=J(a),c=e?Rs:t?kn:kt;return!t&&De(l,"iterate",fn),a.forEach((f,d)=>s.call(i,c(f),c(d),o))}};return _e(n,t?{add:Ar("add"),set:Ar("set"),delete:Ar("delete"),clear:Ar("clear")}:{add(s){const i=J(this),o=Er(i),a=J(s),l=!e&&!gt(s)&&!Kt(s)?a:s;return o.has.call(i,l)||Ot(s,l)&&o.has.call(i,s)||Ot(a,l)&&o.has.call(i,a)||(i.add(l),Vt(i,"add",l,l)),this},set(s,i){!e&&!gt(i)&&!Kt(i)&&(i=J(i));const o=J(this),{has:a,get:l}=Er(o);let c=a.call(o,s);c||(s=J(s),c=a.call(o,s));const f=l.call(o,s);return o.set(s,i),c?Ot(i,f)&&Vt(o,"set",s,i):Vt(o,"add",s,i),this},delete(s){const i=J(this),{has:o,get:a}=Er(i);let l=o.call(i,s);l||(s=J(s),l=o.call(i,s)),a&&a.call(i,s);const c=i.delete(s);return l&&Vt(i,"delete",s,void 0),c},clear(){const s=J(this),i=s.size!==0,o=s.clear();return i&&Vt(s,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=dc(s,t,e)}),n}function Rr(t,e){const n=gc(t,e);return(r,s,i)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?r:Reflect.get(ne(n,s)&&s in r?n:r,s,i)}const mc={get:Rr(!1,!1)},bc={get:Rr(!1,!0)},yc={get:Rr(!0,!1)},wc={get:Rr(!0,!0)},bo=new WeakMap,yo=new WeakMap,wo=new WeakMap,xo=new WeakMap;function xc(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function vc(t){return t.__v_skip||!Object.isExtensible(t)?0:xc(Kl(t))}function Cs(t){return Kt(t)?t:Cr(t,!1,uc,mc,bo)}function _c(t){return Cr(t,!1,hc,bc,yo)}function Os(t){return Cr(t,!0,fc,yc,wo)}function xd(t){return Cr(t,!0,pc,wc,xo)}function Cr(t,e,n,r,s){if(!ae(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const i=vc(t);if(i===0)return t;const o=s.get(t);if(o)return o;const a=new Proxy(t,i===2?r:n);return s.set(t,a),a}function hn(t){return Kt(t)?hn(t.__v_raw):!!(t&&t.__v_isReactive)}function Kt(t){return!!(t&&t.__v_isReadonly)}function gt(t){return!!(t&&t.__v_isShallow)}function Is(t){return t?!!t.__v_raw:!1}function J(t){const e=t&&t.__v_raw;return e?J(e):t}function kc(t){return!ne(t,"__v_skip")&&Object.isExtensible(t)&&Xi(t,"__v_skip",!0),t}const kt=t=>ae(t)?Cs(t):t,kn=t=>ae(t)?Os(t):t;function Oe(t){return t?t.__v_isRef===!0:!1}function q(t){return Tc(t,!1)}function Tc(t,e){return Oe(t)?t:new Sc(t,e)}class Sc{constructor(e,n){this.dep=new ks,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:J(e),this._value=n?e:kt(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,r=this.__v_isShallow||gt(e)||Kt(e);e=r?e:J(e),Ot(e,n)&&(this._rawValue=e,this._value=r?e:kt(e),this.dep.trigger())}}function Tn(t){return Oe(t)?t.value:t}const Ec={get:(t,e,n)=>e==="__v_raw"?t:Tn(Reflect.get(t,e,n)),set:(t,e,n,r)=>{const s=t[e];return Oe(s)&&!Oe(n)?(s.value=n,!0):Reflect.set(t,e,n,r)}};function vo(t){return hn(t)?t:new Proxy(t,Ec)}class Ac{constructor(e,n,r){this.fn=e,this.setter=n,this._value=void 0,this.dep=new ks(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=qn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&pe!==this)return so(this,!0),!0}get value(){const e=this.dep.track();return ao(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function Rc(t,e,n=!1){let r,s;return U(t)?r=t:(r=t.get,s=t.set),new Ac(r,s,n)}const Or={},Ir=new WeakMap;let pn;function Cc(t,e=!1,n=pn){if(n){let r=Ir.get(n);r||Ir.set(n,r=[]),r.push(t)}}function Oc(t,e,n=Z){const{immediate:r,deep:s,once:i,scheduler:o,augmentJob:a,call:l}=n,c=O=>s?O:gt(O)||s===!1||s===0?Gt(O,1):Gt(O);let f,d,y,S,I=!1,N=!1;if(Oe(t)?(d=()=>t.value,I=gt(t)):hn(t)?(d=()=>c(t),I=!0):$(t)?(N=!0,I=t.some(O=>hn(O)||gt(O)),d=()=>t.map(O=>{if(Oe(O))return O.value;if(hn(O))return c(O);if(U(O))return l?l(O,2):O()})):U(t)?e?d=l?()=>l(t,2):t:d=()=>{if(y){It();try{y()}finally{Lt()}}const O=pn;pn=f;try{return l?l(t,3,[S]):t(S)}finally{pn=O}}:d=Rt,e&&s){const O=d,ee=s===!0?1/0:s;d=()=>Gt(O(),ee)}const le=rc(),X=()=>{f.stop(),le&&le.active&&hs(le.effects,f)};if(i&&e){const O=e;e=(...ee)=>{O(...ee),X()}}let H=N?new Array(t.length).fill(Or):Or;const Y=O=>{if(!(!(f.flags&1)||!f.dirty&&!O))if(e){const ee=f.run();if(s||I||(N?ee.some((ke,Ge)=>Ot(ke,H[Ge])):Ot(ee,H))){y&&y();const ke=pn;pn=f;try{const Ge=[ee,H===Or?void 0:N&&H[0]===Or?[]:H,S];H=ee,l?l(e,3,Ge):e(...Ge)}finally{pn=ke}}}else f.run()};return a&&a(Y),f=new no(d),f.scheduler=o?()=>o(Y,!1):Y,S=O=>Cc(O,!1,f),y=f.onStop=()=>{const O=Ir.get(f);if(O){if(l)l(O,4);else for(const ee of O)ee();Ir.delete(f)}},e?r?Y(!0):H=f.run():o?o(Y.bind(null,!0),!0):f.run(),X.pause=f.pause.bind(f),X.resume=f.resume.bind(f),X.stop=X,X}function Gt(t,e=1/0,n){if(e<=0||!ae(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,Oe(t))Gt(t.value,e,n);else if($(t))for(let r=0;r<t.length;r++)Gt(t[r],e,n);else if(Vi(t)||vn(t))t.forEach(r=>{Gt(r,e,n)});else if(vr(t)){for(const r in t)Gt(t[r],e,n);for(const r of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,r)&&Gt(t[r],e,n)}return t}/**
* @vue/runtime-core v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const Kn=[];let Ls=!1;function vd(t,...e){if(Ls)return;Ls=!0,It();const n=Kn.length?Kn[Kn.length-1].component:null,r=n&&n.appContext.config.warnHandler,s=Ic();if(r)Sn(r,n,11,[t+e.map(i=>{var o,a;return(a=(o=i.toString)==null?void 0:o.call(i))!=null?a:JSON.stringify(i)}).join(""),n&&n.proxy,s.map(({vnode:i})=>`at <${ba(n,i.type)}>`).join(`
`),s]);else{const i=[`[Vue warn]: ${t}`,...e];s.length&&i.push(`
`,...Lc(s)),console.warn(...i)}Lt(),Ls=!1}function Ic(){let t=Kn[Kn.length-1];if(!t)return[];const e=[];for(;t;){const n=e[0];n&&n.vnode===t?n.recurseCount++:e.push({vnode:t,recurseCount:0});const r=t.component&&t.component.parent;t=r&&r.vnode}return e}function Lc(t){const e=[];return t.forEach((n,r)=>{e.push(...r===0?[]:[`
`],...Pc(n))}),e}function Pc({vnode:t,recurseCount:e}){const n=e>0?`... (${e} recursive calls)`:"",r=t.component?t.component.parent==null:!1,s=` at <${ba(t.component,t.type,r)}`,i=">"+n;return t.props?[s,...Nc(t.props),i]:[s+i]}function Nc(t){const e=[],n=Object.keys(t);return n.slice(0,3).forEach(r=>{e.push(..._o(r,t[r]))}),n.length>3&&e.push(" ..."),e}function _o(t,e,n){return we(e)?(e=JSON.stringify(e),n?e:[`${t}=${e}`]):typeof e=="number"||typeof e=="boolean"||e==null?n?e:[`${t}=${e}`]:Oe(e)?(e=_o(t,J(e.value),!0),n?e:[`${t}=Ref<`,e,">"]):U(e)?[`${t}=fn${e.name?`<${e.name}>`:""}`]:(e=J(e),n?e:[`${t}=`,e])}function Sn(t,e,n,r){try{return r?t(...r):t()}catch(s){Lr(s,e,n)}}function Nt(t,e,n,r){if(U(t)){const s=Sn(t,e,n,r);return s&&Ki(s)&&s.catch(i=>{Lr(i,e,n)}),s}if($(t)){const s=[];for(let i=0;i<t.length;i++)s.push(Nt(t[i],e,n,r));return s}}function Lr(t,e,n,r=!0){const s=e?e.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||Z;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const f=a.ec;if(f){for(let d=0;d<f.length;d++)if(f[d](t,l,c)===!1)return}a=a.parent}if(i){It(),Sn(i,null,10,[t,l,c]),Lt();return}}Mc(t,n,s,r,o)}function Mc(t,e,n,r=!0,s=!1){if(s)throw t;console.error(t)}const He=[];let Mt=-1;const En=[];let nn=null,An=0;const ko=Promise.resolve();let Pr=null;function Gn(t){const e=Pr||ko;return t?e.then(this?t.bind(this):t):e}function Dc(t){let e=Mt+1,n=He.length;for(;e<n;){const r=e+n>>>1,s=He[r],i=Yn(s);i<t||i===t&&s.flags&2?e=r+1:n=r}return e}function Ps(t){if(!(t.flags&1)){const e=Yn(t),n=He[He.length-1];!n||!(t.flags&2)&&e>=Yn(n)?He.push(t):He.splice(Dc(e),0,t),t.flags|=1,To()}}function To(){Pr||(Pr=ko.then(Ao))}function zc(t){$(t)?En.push(...t):nn&&t.id===-1?nn.splice(An+1,0,t):t.flags&1||(En.push(t),t.flags|=1),To()}function So(t,e,n=Mt+1){for(;n<He.length;n++){const r=He[n];if(r&&r.flags&2){if(t&&r.id!==t.uid)continue;He.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function Eo(t){if(En.length){const e=[...new Set(En)].sort((n,r)=>Yn(n)-Yn(r));if(En.length=0,nn){nn.push(...e);return}for(nn=e,An=0;An<nn.length;An++){const n=nn[An];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}nn=null,An=0}}const Yn=t=>t.id==null?t.flags&2?-1:1/0:t.id;function Ao(t){try{for(Mt=0;Mt<He.length;Mt++){const e=He[Mt];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Sn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Mt<He.length;Mt++){const e=He[Mt];e&&(e.flags&=-2)}Mt=-1,He.length=0,Eo(),Pr=null,(He.length||En.length)&&Ao()}}let mt=null,Ro=null;function Nr(t){const e=mt;return mt=t,Ro=t&&t.type.__scopeId||null,e}function Bc(t,e=mt,n){if(!e||t._n)return t;const r=(...s)=>{r._d&&ca(-1);const i=Nr(e);let o;try{o=t(...s)}finally{Nr(i),r._d&&ca(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function Mr(t,e){if(mt===null)return t;const n=Wr(mt),r=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[i,o,a,l=Z]=e[s];i&&(U(i)&&(i={mounted:i,updated:i}),i.deep&&Gt(o),r.push({dir:i,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function dn(t,e,n,r){const s=t.dirs,i=e&&e.dirs;for(let o=0;o<s.length;o++){const a=s[o];i&&(a.oldValue=i[o].value);let l=a.dir[r];l&&(It(),Nt(l,n,8,[t.el,a,t,e]),Lt())}}function Fc(t,e){if(qe){let n=qe.provides;const r=qe.parent&&qe.parent.provides;r===n&&(n=qe.provides=Object.create(r)),n[t]=e}}function Dr(t,e,n=!1){const r=Bu();if(r||Rn){let s=Rn?Rn._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&U(e)?e.call(r&&r.proxy):e}}const $c=Symbol.for("v-scx"),Uc=()=>Dr($c);function zr(t,e,n){return Co(t,e,n)}function Co(t,e,n=Z){const{immediate:r,deep:s,flush:i,once:o}=n,a=_e({},n),l=e&&r||!e&&i!=="post";let c;if(sr){if(i==="sync"){const S=Uc();c=S.__watcherHandles||(S.__watcherHandles=[])}else if(!l){const S=()=>{};return S.stop=Rt,S.resume=Rt,S.pause=Rt,S}}const f=qe;a.call=(S,I,N)=>Nt(S,f,I,N);let d=!1;i==="post"?a.scheduler=S=>{Je(S,f&&f.suspense)}:i!=="sync"&&(d=!0,a.scheduler=(S,I)=>{I?S():Ps(S)}),a.augmentJob=S=>{e&&(S.flags|=4),d&&(S.flags|=2,f&&(S.id=f.uid,S.i=f))};const y=Oc(t,e,a);return sr&&(c?c.push(y):l&&y()),y}function Hc(t,e,n){const r=this.proxy,s=we(t)?t.includes(".")?Oo(r,t):()=>r[t]:t.bind(r,r);let i;U(e)?i=e:(i=e.handler,n=e);const o=rr(this),a=Co(s,i.bind(r),n);return o(),a}function Oo(t,e){const n=e.split(".");return()=>{let r=t;for(let s=0;s<n.length&&r;s++)r=r[n[s]];return r}}const jc=Symbol("_vte"),qc=t=>t.__isTeleport,Vc=Symbol("_leaveCb");function Ns(t,e){t.shapeFlag&6&&t.component?(t.transition=e,Ns(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function Io(t,e){return U(t)?_e({name:t.name},e,{setup:t}):t}function Lo(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function Po(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const Br=new WeakMap;function Xn(t,e,n,r,s=!1){if($(t)){t.forEach((N,le)=>Xn(N,e&&($(e)?e[le]:e),n,r,s));return}if(Zn(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Xn(t,e,n,r.component.subTree);return}const i=r.shapeFlag&4?Wr(r.component):r.el,o=s?null:i,{i:a,r:l}=t,c=e&&e.r,f=a.refs===Z?a.refs={}:a.refs,d=a.setupState,y=J(d),S=d===Z?qi:N=>Po(f,N)?!1:ne(y,N),I=(N,le)=>!(le&&Po(f,le));if(c!=null&&c!==l){if(No(e),we(c))f[c]=null,S(c)&&(d[c]=null);else if(Oe(c)){const N=e;I(c,N.k)&&(c.value=null),N.k&&(f[N.k]=null)}}if(U(l))Sn(l,a,12,[o,f]);else{const N=we(l),le=Oe(l);if(N||le){const X=()=>{if(t.f){const H=N?S(l)?d[l]:f[l]:I()||!t.k?l.value:f[t.k];if(s)$(H)&&hs(H,i);else if($(H))H.includes(i)||H.push(i);else if(N)f[l]=[i],S(l)&&(d[l]=f[l]);else{const Y=[i];I(l,t.k)&&(l.value=Y),t.k&&(f[t.k]=Y)}}else N?(f[l]=o,S(l)&&(d[l]=o)):le&&(I(l,t.k)&&(l.value=o),t.k&&(f[t.k]=o))};if(o){const H=()=>{X(),Br.delete(t)};H.id=-1,Br.set(t,H),Je(H,n)}else No(t),X()}}}function No(t){const e=Br.get(t);e&&(e.flags|=8,Br.delete(t))}Tr().requestIdleCallback,Tr().cancelIdleCallback;const Zn=t=>!!t.type.__asyncLoader,Mo=t=>t.type.__isKeepAlive;function Wc(t,e){Do(t,"a",e)}function Kc(t,e){Do(t,"da",e)}function Do(t,e,n=qe){const r=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(Fr(e,r,n),n){let s=n.parent;for(;s&&s.parent;)Mo(s.parent.vnode)&&Gc(r,e,n,s),s=s.parent}}function Gc(t,e,n,r){const s=Fr(e,t,r,!0);Ms(()=>{hs(r[e],s)},n)}function Fr(t,e,n=qe,r=!1){if(n){const s=n[t]||(n[t]=[]),i=e.__weh||(e.__weh=(...o)=>{It();const a=rr(n),l=Nt(e,n,t,o);return a(),Lt(),l});return r?s.unshift(i):s.push(i),i}}const Yt=t=>(e,n=qe)=>{(!sr||t==="sp")&&Fr(t,(...r)=>e(...r),n)},Yc=Yt("bm"),zo=Yt("m"),Xc=Yt("bu"),Zc=Yt("u"),Jc=Yt("bum"),Ms=Yt("um"),Qc=Yt("sp"),eu=Yt("rtg"),tu=Yt("rtc");function nu(t,e=qe){Fr("ec",t,e)}const ru=Symbol.for("v-ndc");function Ds(t,e,n,r){let s;const i=n,o=$(t);if(o||we(t)){const a=o&&hn(t);let l=!1,c=!1;a&&(l=!gt(t),c=Kt(t),t=Sr(t)),s=new Array(t.length);for(let f=0,d=t.length;f<d;f++)s[f]=e(l?c?kn(kt(t[f])):kt(t[f]):t[f],f,void 0,i)}else if(typeof t=="number"){s=new Array(t);for(let a=0;a<t;a++)s[a]=e(a+1,a,void 0,i)}else if(ae(t))if(t[Symbol.iterator])s=Array.from(t,(a,l)=>e(a,l,void 0,i));else{const a=Object.keys(t);s=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const f=a[l];s[l]=e(t[f],f,l,i)}}else s=[];return s}const zs=t=>t?da(t)?Wr(t):zs(t.parent):null,Jn=_e(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>zs(t.parent),$root:t=>zs(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>Uo(t),$forceUpdate:t=>t.f||(t.f=()=>{Ps(t.update)}),$nextTick:t=>t.n||(t.n=Gn.bind(t.proxy)),$watch:t=>Hc.bind(t)}),Bs=(t,e)=>t!==Z&&!t.__isScriptSetup&&ne(t,e),su={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:r,data:s,props:i,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const y=o[e];if(y!==void 0)switch(y){case 1:return r[e];case 2:return s[e];case 4:return n[e];case 3:return i[e]}else{if(Bs(r,e))return o[e]=1,r[e];if(s!==Z&&ne(s,e))return o[e]=2,s[e];if(ne(i,e))return o[e]=3,i[e];if(n!==Z&&ne(n,e))return o[e]=4,n[e];Fs&&(o[e]=0)}}const c=Jn[e];let f,d;if(c)return e==="$attrs"&&De(t.attrs,"get",""),c(t);if((f=a.__cssModules)&&(f=f[e]))return f;if(n!==Z&&ne(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,ne(d,e))return d[e]},set({_:t},e,n){const{data:r,setupState:s,ctx:i}=t;return Bs(s,e)?(s[e]=n,!0):r!==Z&&ne(r,e)?(r[e]=n,!0):ne(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(i[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:r,appContext:s,props:i,type:o}},a){let l;return!!(n[a]||t!==Z&&a[0]!=="$"&&ne(t,a)||Bs(e,a)||ne(i,a)||ne(r,a)||ne(Jn,a)||ne(s.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:ne(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function Bo(t){return $(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let Fs=!0;function iu(t){const e=Uo(t),n=t.proxy,r=t.ctx;Fs=!1,e.beforeCreate&&Fo(e.beforeCreate,t,"bc");const{data:s,computed:i,methods:o,watch:a,provide:l,inject:c,created:f,beforeMount:d,mounted:y,beforeUpdate:S,updated:I,activated:N,deactivated:le,beforeDestroy:X,beforeUnmount:H,destroyed:Y,unmounted:O,render:ee,renderTracked:ke,renderTriggered:Ge,errorCaptured:ft,serverPrefetch:ht,expose:Ye,inheritAttrs:be,components:Qe,directives:et,filters:Le}=e;if(c&&ou(c,r,null),o)for(const ce in o){const se=o[ce];U(se)&&(r[ce]=se.bind(n))}if(s){const ce=s.call(n,n);ae(ce)&&(t.data=Cs(ce))}if(Fs=!0,i)for(const ce in i){const se=i[ce],nt=U(se)?se.bind(n,n):U(se.get)?se.get.bind(n,n):Rt,Jt=!U(se)&&U(se.set)?se.set.bind(n):Rt,ue=Gs({get:nt,set:Jt});Object.defineProperty(r,ce,{enumerable:!0,configurable:!0,get:()=>ue.value,set:Te=>ue.value=Te})}if(a)for(const ce in a)$o(a[ce],r,n,ce);if(l){const ce=U(l)?l.call(n):l;Reflect.ownKeys(ce).forEach(se=>{Fc(se,ce[se])})}f&&Fo(f,t,"c");function Ae(ce,se){$(se)?se.forEach(nt=>ce(nt.bind(n))):se&&ce(se.bind(n))}if(Ae(Yc,d),Ae(zo,y),Ae(Xc,S),Ae(Zc,I),Ae(Wc,N),Ae(Kc,le),Ae(nu,ft),Ae(tu,ke),Ae(eu,Ge),Ae(Jc,H),Ae(Ms,O),Ae(Qc,ht),$(Ye))if(Ye.length){const ce=t.exposed||(t.exposed={});Ye.forEach(se=>{Object.defineProperty(ce,se,{get:()=>n[se],set:nt=>n[se]=nt,enumerable:!0})})}else t.exposed||(t.exposed={});ee&&t.render===Rt&&(t.render=ee),be!=null&&(t.inheritAttrs=be),Qe&&(t.components=Qe),et&&(t.directives=et),ht&&Lo(t)}function ou(t,e,n=Rt){$(t)&&(t=$s(t));for(const r in t){const s=t[r];let i;ae(s)?"default"in s?i=Dr(s.from||r,s.default,!0):i=Dr(s.from||r):i=Dr(s),Oe(i)?Object.defineProperty(e,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):e[r]=i}}function Fo(t,e,n){Nt($(t)?t.map(r=>r.bind(e.proxy)):t.bind(e.proxy),e,n)}function $o(t,e,n,r){let s=r.includes(".")?Oo(n,r):()=>n[r];if(we(t)){const i=e[t];U(i)&&zr(s,i)}else if(U(t))zr(s,t.bind(n));else if(ae(t))if($(t))t.forEach(i=>$o(i,e,n,r));else{const i=U(t.handler)?t.handler.bind(n):e[t.handler];U(i)&&zr(s,i,t)}}function Uo(t){const e=t.type,{mixins:n,extends:r}=e,{mixins:s,optionsCache:i,config:{optionMergeStrategies:o}}=t.appContext,a=i.get(e);let l;return a?l=a:!s.length&&!n&&!r?l=e:(l={},s.length&&s.forEach(c=>$r(l,c,o,!0)),$r(l,e,o)),ae(e)&&i.set(e,l),l}function $r(t,e,n,r=!1){const{mixins:s,extends:i}=e;i&&$r(t,i,n,!0),s&&s.forEach(o=>$r(t,o,n,!0));for(const o in e)if(!(r&&o==="expose")){const a=au[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const au={data:Ho,props:jo,emits:jo,methods:Qn,computed:Qn,beforeCreate:je,created:je,beforeMount:je,mounted:je,beforeUpdate:je,updated:je,beforeDestroy:je,beforeUnmount:je,destroyed:je,unmounted:je,activated:je,deactivated:je,errorCaptured:je,serverPrefetch:je,components:Qn,directives:Qn,watch:cu,provide:Ho,inject:lu};function Ho(t,e){return e?t?function(){return _e(U(t)?t.call(this,this):t,U(e)?e.call(this,this):e)}:e:t}function lu(t,e){return Qn($s(t),$s(e))}function $s(t){if($(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function je(t,e){return t?[...new Set([].concat(t,e))]:e}function Qn(t,e){return t?_e(Object.create(null),t,e):e}function jo(t,e){return t?$(t)&&$(e)?[...new Set([...t,...e])]:_e(Object.create(null),Bo(t),Bo(e??{})):e}function cu(t,e){if(!t)return e;if(!e)return t;const n=_e(Object.create(null),t);for(const r in e)n[r]=je(t[r],e[r]);return n}function qo(){return{app:null,config:{isNativeTag:qi,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let uu=0;function fu(t,e){return function(r,s=null){U(r)||(r=_e({},r)),s!=null&&!ae(s)&&(s=null);const i=qo(),o=new WeakSet,a=[];let l=!1;const c=i.app={_uid:uu++,_component:r,_props:s,_container:null,_context:i,_instance:null,version:Ku,get config(){return i.config},set config(f){},use(f,...d){return o.has(f)||(f&&U(f.install)?(o.add(f),f.install(c,...d)):U(f)&&(o.add(f),f(c,...d))),c},mixin(f){return i.mixins.includes(f)||i.mixins.push(f),c},component(f,d){return d?(i.components[f]=d,c):i.components[f]},directive(f,d){return d?(i.directives[f]=d,c):i.directives[f]},mount(f,d,y){if(!l){const S=c._ceVNode||Dt(r,s);return S.appContext=i,y===!0?y="svg":y===!1&&(y=void 0),t(S,f,y),l=!0,c._container=f,f.__vue_app__=c,Wr(S.component)}},onUnmount(f){a.push(f)},unmount(){l&&(Nt(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(f,d){return i.provides[f]=d,c},runWithContext(f){const d=Rn;Rn=c;try{return f()}finally{Rn=d}}};return c}}let Rn=null;const hu=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${Xe(e)}Modifiers`]||t[`${lt(e)}Modifiers`];function pu(t,e,...n){if(t.isUnmounted)return;const r=t.vnode.props||Z;let s=n;const i=e.startsWith("update:"),o=i&&hu(r,e.slice(7));o&&(o.trim&&(s=n.map(f=>we(f)?f.trim():f)),o.number&&(s=n.map(gs)));let a,l=r[a=ds(e)]||r[a=ds(Xe(e))];!l&&i&&(l=r[a=ds(lt(e))]),l&&Nt(l,t,6,s);const c=r[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,Nt(c,t,6,s)}}const du=new WeakMap;function Vo(t,e,n=!1){const r=n?du:e.emitsCache,s=r.get(t);if(s!==void 0)return s;const i=t.emits;let o={},a=!1;if(!U(t)){const l=c=>{const f=Vo(c,e,!0);f&&(a=!0,_e(o,f))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!i&&!a?(ae(t)&&r.set(t,null),null):($(i)?i.forEach(l=>o[l]=null):_e(o,i),ae(t)&&r.set(t,o),o)}function Ur(t,e){return!t||!wr(e)?!1:(e=e.slice(2).replace(/Once$/,""),ne(t,e[0].toLowerCase()+e.slice(1))||ne(t,lt(e))||ne(t,e))}function _d(){}function Wo(t){const{type:e,vnode:n,proxy:r,withProxy:s,propsOptions:[i],slots:o,attrs:a,emit:l,render:c,renderCache:f,props:d,data:y,setupState:S,ctx:I,inheritAttrs:N}=t,le=Nr(t);let X,H;try{if(n.shapeFlag&4){const O=s||r,ee=O;X=zt(c.call(ee,O,f,d,S,y,I)),H=a}else{const O=e;X=zt(O.length>1?O(d,{attrs:a,slots:o,emit:l}):O(d,null)),H=e.props?a:gu(a)}}catch(O){er.length=0,Lr(O,t,1),X=Dt(rn)}let Y=X;if(H&&N!==!1){const O=Object.keys(H),{shapeFlag:ee}=Y;O.length&&ee&7&&(i&&O.some(xr)&&(H=mu(H,i)),Y=Cn(Y,H,!1,!0))}return n.dirs&&(Y=Cn(Y,null,!1,!0),Y.dirs=Y.dirs?Y.dirs.concat(n.dirs):n.dirs),n.transition&&Ns(Y,n.transition),X=Y,Nr(le),X}const gu=t=>{let e;for(const n in t)(n==="class"||n==="style"||wr(n))&&((e||(e={}))[n]=t[n]);return e},mu=(t,e)=>{const n={};for(const r in t)(!xr(r)||!(r.slice(9)in e))&&(n[r]=t[r]);return n};function bu(t,e,n){const{props:r,children:s,component:i}=t,{props:o,children:a,patchFlag:l}=e,c=i.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return r?Ko(r,o,c):!!o;if(l&8){const f=e.dynamicProps;for(let d=0;d<f.length;d++){const y=f[d];if(Go(o,r,y)&&!Ur(c,y))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===o?!1:r?o?Ko(r,o,c):!0:!!o;return!1}function Ko(t,e,n){const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!0;for(let s=0;s<r.length;s++){const i=r[s];if(Go(e,t,i)&&!Ur(n,i))return!0}return!1}function Go(t,e,n){const r=t[n],s=e[n];return n==="style"&&ae(r)&&ae(s)?!ms(r,s):r!==s}function yu({vnode:t,parent:e,suspense:n},r){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=r,t=s),s===t)(t=e.vnode).el=r,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=r)}const Yo={},Xo=()=>Object.create(Yo),Zo=t=>Object.getPrototypeOf(t)===Yo;function wu(t,e,n,r=!1){const s={},i=Xo();t.propsDefaults=Object.create(null),Jo(t,e,s,i);for(const o in t.propsOptions[0])o in s||(s[o]=void 0);n?t.props=r?s:_c(s):t.type.props?t.props=s:t.props=i,t.attrs=i}function xu(t,e,n,r){const{props:s,attrs:i,vnode:{patchFlag:o}}=t,a=J(s),[l]=t.propsOptions;let c=!1;if((r||o>0)&&!(o&16)){if(o&8){const f=t.vnode.dynamicProps;for(let d=0;d<f.length;d++){let y=f[d];if(Ur(t.emitsOptions,y))continue;const S=e[y];if(l)if(ne(i,y))S!==i[y]&&(i[y]=S,c=!0);else{const I=Xe(y);s[I]=Us(l,a,I,S,t,!1)}else S!==i[y]&&(i[y]=S,c=!0)}}}else{Jo(t,e,s,i)&&(c=!0);let f;for(const d in a)(!e||!ne(e,d)&&((f=lt(d))===d||!ne(e,f)))&&(l?n&&(n[d]!==void 0||n[f]!==void 0)&&(s[d]=Us(l,a,d,void 0,t,!0)):delete s[d]);if(i!==a)for(const d in i)(!e||!ne(e,d))&&(delete i[d],c=!0)}c&&Vt(t.attrs,"set","")}function Jo(t,e,n,r){const[s,i]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if($n(l))continue;const c=e[l];let f;s&&ne(s,f=Xe(l))?!i||!i.includes(f)?n[f]=c:(a||(a={}))[f]=c:Ur(t.emitsOptions,l)||(!(l in r)||c!==r[l])&&(r[l]=c,o=!0)}if(i){const l=J(n),c=a||Z;for(let f=0;f<i.length;f++){const d=i[f];n[d]=Us(s,l,d,c[d],t,!ne(c,d))}}return o}function Us(t,e,n,r,s,i){const o=t[n];if(o!=null){const a=ne(o,"default");if(a&&r===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&U(l)){const{propsDefaults:c}=s;if(n in c)r=c[n];else{const f=rr(s);r=c[n]=l.call(null,e),f()}}else r=l;s.ce&&s.ce._setProp(n,r)}o[0]&&(i&&!a?r=!1:o[1]&&(r===""||r===lt(n))&&(r=!0))}return r}const vu=new WeakMap;function Qo(t,e,n=!1){const r=n?vu:e.propsCache,s=r.get(t);if(s)return s;const i=t.props,o={},a=[];let l=!1;if(!U(t)){const f=d=>{l=!0;const[y,S]=Qo(d,e,!0);_e(o,y),S&&a.push(...S)};!n&&e.mixins.length&&e.mixins.forEach(f),t.extends&&f(t.extends),t.mixins&&t.mixins.forEach(f)}if(!i&&!l)return ae(t)&&r.set(t,xn),xn;if($(i))for(let f=0;f<i.length;f++){const d=Xe(i[f]);ea(d)&&(o[d]=Z)}else if(i)for(const f in i){const d=Xe(f);if(ea(d)){const y=i[f],S=o[d]=$(y)||U(y)?{type:y}:_e({},y),I=S.type;let N=!1,le=!0;if($(I))for(let X=0;X<I.length;++X){const H=I[X],Y=U(H)&&H.name;if(Y==="Boolean"){N=!0;break}else Y==="String"&&(le=!1)}else N=U(I)&&I.name==="Boolean";S[0]=N,S[1]=le,(N||ne(S,"default"))&&a.push(d)}}const c=[o,a];return ae(t)&&r.set(t,c),c}function ea(t){return t[0]!=="$"&&!$n(t)}const Hs=t=>t==="_"||t==="_ctx"||t==="$stable",js=t=>$(t)?t.map(zt):[zt(t)],_u=(t,e,n)=>{if(e._n)return e;const r=Bc((...s)=>js(e(...s)),n);return r._c=!1,r},ta=(t,e,n)=>{const r=t._ctx;for(const s in t){if(Hs(s))continue;const i=t[s];if(U(i))e[s]=_u(s,i,r);else if(i!=null){const o=js(i);e[s]=()=>o}}},na=(t,e)=>{const n=js(e);t.slots.default=()=>n},ra=(t,e,n)=>{for(const r in e)(n||!Hs(r))&&(t[r]=e[r])},ku=(t,e,n)=>{const r=t.slots=Xo();if(t.vnode.shapeFlag&32){const s=e._;s?(ra(r,e,n),n&&Xi(r,"_",s,!0)):ta(e,r)}else e&&na(t,e)},Tu=(t,e,n)=>{const{vnode:r,slots:s}=t;let i=!0,o=Z;if(r.shapeFlag&32){const a=e._;a?n&&a===1?i=!1:ra(s,e,n):(i=!e.$stable,ta(e,s)),o=e}else e&&(na(t,e),o={default:1});if(i)for(const a in s)!Hs(a)&&o[a]==null&&delete s[a]},Je=Cu;function Su(t){return Eu(t)}function Eu(t,e){const n=Tr();n.__VUE__=!0;const{insert:r,remove:s,patchProp:i,createElement:o,createText:a,createComment:l,setText:c,setElementText:f,parentNode:d,nextSibling:y,setScopeId:S=Rt,insertStaticContent:I}=t,N=(u,p,g,m=null,b=null,w=null,A=void 0,E=null,T=!!p.dynamicChildren)=>{if(u===p)return;u&&!nr(u,p)&&(m=rt(u),Te(u,b,w,!0),u=null),p.patchFlag===-2&&(T=!1,p.dynamicChildren=null);const{type:v,ref:D,shapeFlag:C}=p;switch(v){case Hr:le(u,p,g,m);break;case rn:X(u,p,g,m);break;case Vs:u==null&&H(p,g,m,A);break;case Ie:Qe(u,p,g,m,b,w,A,E,T);break;default:C&1?ee(u,p,g,m,b,w,A,E,T):C&6?et(u,p,g,m,b,w,A,E,T):(C&64||C&128)&&v.process(u,p,g,m,b,w,A,E,T,it)}D!=null&&b?Xn(D,u&&u.ref,w,p||u,!p):D==null&&u&&u.ref!=null&&Xn(u.ref,null,w,u,!0)},le=(u,p,g,m)=>{if(u==null)r(p.el=a(p.children),g,m);else{const b=p.el=u.el;p.children!==u.children&&c(b,p.children)}},X=(u,p,g,m)=>{u==null?r(p.el=l(p.children||""),g,m):p.el=u.el},H=(u,p,g,m)=>{[u.el,u.anchor]=I(u.children,p,g,m,u.el,u.anchor)},Y=({el:u,anchor:p},g,m)=>{let b;for(;u&&u!==p;)b=y(u),r(u,g,m),u=b;r(p,g,m)},O=({el:u,anchor:p})=>{let g;for(;u&&u!==p;)g=y(u),s(u),u=g;s(p)},ee=(u,p,g,m,b,w,A,E,T)=>{if(p.type==="svg"?A="svg":p.type==="math"&&(A="mathml"),u==null)ke(p,g,m,b,w,A,E,T);else{const v=u.el&&u.el._isVueCE?u.el:null;try{v&&v._beginPatch(),ht(u,p,b,w,A,E,T)}finally{v&&v._endPatch()}}},ke=(u,p,g,m,b,w,A,E)=>{let T,v;const{props:D,shapeFlag:C,transition:M,dirs:z}=u;if(T=u.el=o(u.type,w,D&&D.is,D),C&8?f(T,u.children):C&16&&ft(u.children,T,null,m,b,qs(u,w),A,E),z&&dn(u,null,m,"created"),Ge(T,u,u.scopeId,A,m),D){for(const V in D)V!=="value"&&!$n(V)&&i(T,V,null,D[V],w,m);"value"in D&&i(T,"value",null,D.value,w),(v=D.onVnodeBeforeMount)&&Bt(v,m,u)}z&&dn(u,null,m,"beforeMount");const j=Au(b,M);j&&M.beforeEnter(T),r(T,p,g),((v=D&&D.onVnodeMounted)||j||z)&&Je(()=>{try{v&&Bt(v,m,u),j&&M.enter(T),z&&dn(u,null,m,"mounted")}finally{}},b)},Ge=(u,p,g,m,b)=>{if(g&&S(u,g),m)for(let w=0;w<m.length;w++)S(u,m[w]);if(b){let w=b.subTree;if(p===w||la(w.type)&&(w.ssContent===p||w.ssFallback===p)){const A=b.vnode;Ge(u,A,A.scopeId,A.slotScopeIds,b.parent)}}},ft=(u,p,g,m,b,w,A,E,T=0)=>{for(let v=T;v<u.length;v++){const D=u[v]=E?Xt(u[v]):zt(u[v]);N(null,D,p,g,m,b,w,A,E)}},ht=(u,p,g,m,b,w,A)=>{const E=p.el=u.el;let{patchFlag:T,dynamicChildren:v,dirs:D}=p;T|=u.patchFlag&16;const C=u.props||Z,M=p.props||Z;let z;if(g&&gn(g,!1),(z=M.onVnodeBeforeUpdate)&&Bt(z,g,p,u),D&&dn(p,u,g,"beforeUpdate"),g&&gn(g,!0),(C.innerHTML&&M.innerHTML==null||C.textContent&&M.textContent==null)&&f(E,""),v?Ye(u.dynamicChildren,v,E,g,m,qs(p,b),w):A||se(u,p,E,null,g,m,qs(p,b),w,!1),T>0){if(T&16)be(E,C,M,g,b);else if(T&2&&C.class!==M.class&&i(E,"class",null,M.class,b),T&4&&i(E,"style",C.style,M.style,b),T&8){const j=p.dynamicProps;for(let V=0;V<j.length;V++){const te=j[V],me=C[te],xe=M[te];(xe!==me||te==="value")&&i(E,te,me,xe,b,g)}}T&1&&u.children!==p.children&&f(E,p.children)}else!A&&v==null&&be(E,C,M,g,b);((z=M.onVnodeUpdated)||D)&&Je(()=>{z&&Bt(z,g,p,u),D&&dn(p,u,g,"updated")},m)},Ye=(u,p,g,m,b,w,A)=>{for(let E=0;E<p.length;E++){const T=u[E],v=p[E],D=T.el&&(T.type===Ie||!nr(T,v)||T.shapeFlag&198)?d(T.el):g;N(T,v,D,null,m,b,w,A,!0)}},be=(u,p,g,m,b)=>{if(p!==g){if(p!==Z)for(const w in p)!$n(w)&&!(w in g)&&i(u,w,p[w],null,b,m);for(const w in g){if($n(w))continue;const A=g[w],E=p[w];A!==E&&w!=="value"&&i(u,w,E,A,b,m)}"value"in g&&i(u,"value",p.value,g.value,b)}},Qe=(u,p,g,m,b,w,A,E,T)=>{const v=p.el=u?u.el:a(""),D=p.anchor=u?u.anchor:a("");let{patchFlag:C,dynamicChildren:M,slotScopeIds:z}=p;z&&(E=E?E.concat(z):z),u==null?(r(v,g,m),r(D,g,m),ft(p.children||[],g,D,b,w,A,E,T)):C>0&&C&64&&M&&u.dynamicChildren&&u.dynamicChildren.length===M.length?(Ye(u.dynamicChildren,M,g,b,w,A,E),(p.key!=null||b&&p===b.subTree)&&sa(u,p,!0)):se(u,p,g,D,b,w,A,E,T)},et=(u,p,g,m,b,w,A,E,T)=>{p.slotScopeIds=E,u==null?p.shapeFlag&512?b.ctx.activate(p,g,m,A,T):Le(p,g,m,b,w,A,T):tt(u,p,T)},Le=(u,p,g,m,b,w,A)=>{const E=u.component=zu(u,m,b);if(Mo(u)&&(E.ctx.renderer=it),Fu(E,!1,A),E.asyncDep){if(b&&b.registerDep(E,Ae,A),!u.el){const T=E.subTree=Dt(rn);X(null,T,p,g),u.placeholder=T.el}}else Ae(E,u,p,g,b,w,A)},tt=(u,p,g)=>{const m=p.component=u.component;if(bu(u,p,g))if(m.asyncDep&&!m.asyncResolved){ce(m,p,g);return}else m.next=p,m.update();else p.el=u.el,m.vnode=p},Ae=(u,p,g,m,b,w,A)=>{const E=()=>{if(u.isMounted){let{next:C,bu:M,u:z,parent:j,vnode:V}=u;{const Fe=ia(u);if(Fe){C&&(C.el=V.el,ce(u,C,A)),Fe.asyncDep.then(()=>{Je(()=>{u.isUnmounted||v()},b)});return}}let te=C,me;gn(u,!1),C?(C.el=V.el,ce(u,C,A)):C=V,M&&kr(M),(me=C.props&&C.props.onVnodeBeforeUpdate)&&Bt(me,j,C,V),gn(u,!0);const xe=Wo(u),Pe=u.subTree;u.subTree=xe,N(Pe,xe,d(Pe.el),rt(Pe),u,b,w),C.el=xe.el,te===null&&yu(u,xe.el),z&&Je(z,b),(me=C.props&&C.props.onVnodeUpdated)&&Je(()=>Bt(me,j,C,V),b)}else{let C;const{el:M,props:z}=p,{bm:j,m:V,parent:te,root:me,type:xe}=u,Pe=Zn(p);gn(u,!1),j&&kr(j),!Pe&&(C=z&&z.onVnodeBeforeMount)&&Bt(C,te,p),gn(u,!0);{me.ce&&me.ce._hasShadowRoot()&&me.ce._injectChildStyle(xe,u.parent?u.parent.type:void 0);const Fe=u.subTree=Wo(u);N(null,Fe,g,m,u,b,w),p.el=Fe.el}if(V&&Je(V,b),!Pe&&(C=z&&z.onVnodeMounted)){const Fe=p;Je(()=>Bt(C,te,Fe),b)}(p.shapeFlag&256||te&&Zn(te.vnode)&&te.vnode.shapeFlag&256)&&u.a&&Je(u.a,b),u.isMounted=!0,p=g=m=null}};u.scope.on();const T=u.effect=new no(E);u.scope.off();const v=u.update=T.run.bind(T),D=u.job=T.runIfDirty.bind(T);D.i=u,D.id=u.uid,T.scheduler=()=>Ps(D),gn(u,!0),v()},ce=(u,p,g)=>{p.component=u;const m=u.vnode.props;u.vnode=p,u.next=null,xu(u,p.props,m,g),Tu(u,p.children,g),It(),So(u),Lt()},se=(u,p,g,m,b,w,A,E,T=!1)=>{const v=u&&u.children,D=u?u.shapeFlag:0,C=p.children,{patchFlag:M,shapeFlag:z}=p;if(M>0){if(M&128){Jt(v,C,g,m,b,w,A,E,T);return}else if(M&256){nt(v,C,g,m,b,w,A,E,T);return}}z&8?(D&16&&Be(v,b,w),C!==v&&f(g,C)):D&16?z&16?Jt(v,C,g,m,b,w,A,E,T):Be(v,b,w,!0):(D&8&&f(g,""),z&16&&ft(C,g,m,b,w,A,E,T))},nt=(u,p,g,m,b,w,A,E,T)=>{u=u||xn,p=p||xn;const v=u.length,D=p.length,C=Math.min(v,D);let M;for(M=0;M<C;M++){const z=p[M]=T?Xt(p[M]):zt(p[M]);N(u[M],z,g,null,b,w,A,E,T)}v>D?Be(u,b,w,!0,!1,C):ft(p,g,m,b,w,A,E,T,C)},Jt=(u,p,g,m,b,w,A,E,T)=>{let v=0;const D=p.length;let C=u.length-1,M=D-1;for(;v<=C&&v<=M;){const z=u[v],j=p[v]=T?Xt(p[v]):zt(p[v]);if(nr(z,j))N(z,j,g,null,b,w,A,E,T);else break;v++}for(;v<=C&&v<=M;){const z=u[C],j=p[M]=T?Xt(p[M]):zt(p[M]);if(nr(z,j))N(z,j,g,null,b,w,A,E,T);else break;C--,M--}if(v>C){if(v<=M){const z=M+1,j=z<D?p[z].el:m;for(;v<=M;)N(null,p[v]=T?Xt(p[v]):zt(p[v]),g,j,b,w,A,E,T),v++}}else if(v>M)for(;v<=C;)Te(u[v],b,w,!0),v++;else{const z=v,j=v,V=new Map;for(v=j;v<=M;v++){const de=p[v]=T?Xt(p[v]):zt(p[v]);de.key!=null&&V.set(de.key,v)}let te,me=0;const xe=M-j+1;let Pe=!1,Fe=0;const ot=new Array(xe);for(v=0;v<xe;v++)ot[v]=0;for(v=z;v<=C;v++){const de=u[v];if(me>=xe){Te(de,b,w,!0);continue}let Re;if(de.key!=null)Re=V.get(de.key);else for(te=j;te<=M;te++)if(ot[te-j]===0&&nr(de,p[te])){Re=te;break}Re===void 0?Te(de,b,w,!0):(ot[Re-j]=v+1,Re>=Fe?Fe=Re:Pe=!0,N(de,p[Re],g,null,b,w,A,E,T),me++)}const en=Pe?Ru(ot):xn;for(te=en.length-1,v=xe-1;v>=0;v--){const de=j+v,Re=p[de],ln=p[de+1],cn=de+1<D?ln.el||aa(ln):m;ot[v]===0?N(null,Re,g,cn,b,w,A,E,T):Pe&&(te<0||v!==en[te]?ue(Re,g,cn,2):te--)}}},ue=(u,p,g,m,b=null)=>{const{el:w,type:A,transition:E,children:T,shapeFlag:v}=u;if(v&6){ue(u.component.subTree,p,g,m);return}if(v&128){u.suspense.move(p,g,m);return}if(v&64){A.move(u,p,g,it);return}if(A===Ie){r(w,p,g);for(let C=0;C<T.length;C++)ue(T[C],p,g,m);r(u.anchor,p,g);return}if(A===Vs){Y(u,p,g);return}if(m!==2&&v&1&&E)if(m===0)E.beforeEnter(w),r(w,p,g),Je(()=>E.enter(w),b);else{const{leave:C,delayLeave:M,afterLeave:z}=E,j=()=>{u.ctx.isUnmounted?s(w):r(w,p,g)},V=()=>{w._isLeaving&&w[Vc](!0),C(w,()=>{j(),z&&z()})};M?M(w,j,V):V()}else r(w,p,g)},Te=(u,p,g,m=!1,b=!1)=>{const{type:w,props:A,ref:E,children:T,dynamicChildren:v,shapeFlag:D,patchFlag:C,dirs:M,cacheIndex:z,memo:j}=u;if(C===-2&&(b=!1),E!=null&&(It(),Xn(E,null,g,u,!0),Lt()),z!=null&&(p.renderCache[z]=void 0),D&256){p.ctx.deactivate(u);return}const V=D&1&&M,te=!Zn(u);let me;if(te&&(me=A&&A.onVnodeBeforeUnmount)&&Bt(me,p,u),D&6)oe(u.component,g,m);else{if(D&128){u.suspense.unmount(g,m);return}V&&dn(u,null,p,"beforeUnmount"),D&64?u.type.remove(u,p,g,it,m):v&&!v.hasOnce&&(w!==Ie||C>0&&C&64)?Be(v,p,g,!1,!0):(w===Ie&&C&384||!b&&D&16)&&Be(T,p,g),m&&ge(u)}const xe=j!=null&&z==null;(te&&(me=A&&A.onVnodeUnmounted)||V||xe)&&Je(()=>{me&&Bt(me,p,u),V&&dn(u,null,p,"unmounted"),xe&&(u.el=null)},g)},ge=u=>{const{type:p,el:g,anchor:m,transition:b}=u;if(p===Ie){an(g,m);return}if(p===Vs){O(u);return}const w=()=>{s(g),b&&!b.persisted&&b.afterLeave&&b.afterLeave()};if(u.shapeFlag&1&&b&&!b.persisted){const{leave:A,delayLeave:E}=b,T=()=>A(g,w);E?E(u.el,w,T):T()}else w()},an=(u,p)=>{let g;for(;u!==p;)g=y(u),s(u),u=g;s(p)},oe=(u,p,g)=>{const{bum:m,scope:b,job:w,subTree:A,um:E,m:T,a:v}=u;oa(T),oa(v),m&&kr(m),b.stop(),w&&(w.flags|=8,Te(A,u,p,g)),E&&Je(E,p),Je(()=>{u.isUnmounted=!0},p)},Be=(u,p,g,m=!1,b=!1,w=0)=>{for(let A=w;A<u.length;A++)Te(u[A],p,g,m,b)},rt=u=>{if(u.shapeFlag&6)return rt(u.component.subTree);if(u.shapeFlag&128)return u.suspense.next();const p=y(u.anchor||u.el),g=p&&p[jc];return g?y(g):p};let Ce=!1;const st=(u,p,g)=>{let m;u==null?p._vnode&&(Te(p._vnode,null,null,!0),m=p._vnode.component):N(p._vnode||null,u,p,null,null,null,g),p._vnode=u,Ce||(Ce=!0,So(m),Eo(),Ce=!1)},it={p:N,um:Te,m:ue,r:ge,mt:Le,mc:ft,pc:se,pbc:Ye,n:rt,o:t};return{render:st,hydrate:void 0,createApp:fu(st)}}function qs({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function gn({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function Au(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function sa(t,e,n=!1){const r=t.children,s=e.children;if($(r)&&$(s))for(let i=0;i<r.length;i++){const o=r[i];let a=s[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[i]=Xt(s[i]),a.el=o.el),!n&&a.patchFlag!==-2&&sa(o,a)),a.type===Hr&&(a.patchFlag===-1&&(a=s[i]=Xt(a)),a.el=o.el),a.type===rn&&!a.el&&(a.el=o.el)}}function Ru(t){const e=t.slice(),n=[0];let r,s,i,o,a;const l=t.length;for(r=0;r<l;r++){const c=t[r];if(c!==0){if(s=n[n.length-1],t[s]<c){e[r]=s,n.push(r);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,t[n[a]]<c?i=a+1:o=a;c<t[n[i]]&&(i>0&&(e[r]=n[i-1]),n[i]=r)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=e[o];return n}function ia(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:ia(e)}function oa(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function aa(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?aa(e.subTree):null}const la=t=>t.__isSuspense;function Cu(t,e){e&&e.pendingBranch?$(t)?e.effects.push(...t):e.effects.push(t):zc(t)}const Ie=Symbol.for("v-fgt"),Hr=Symbol.for("v-txt"),rn=Symbol.for("v-cmt"),Vs=Symbol.for("v-stc"),er=[];let ct=null;function Q(t=!1){er.push(ct=t?null:[])}function Ou(){er.pop(),ct=er[er.length-1]||null}let tr=1;function ca(t,e=!1){tr+=t,t<0&&ct&&e&&(ct.hasOnce=!0)}function ua(t){return t.dynamicChildren=tr>0?ct||xn:null,Ou(),tr>0&&ct&&ct.push(t),t}function re(t,e,n,r,s,i){return ua(F(t,e,n,r,s,i,!0))}function Iu(t,e,n,r,s){return ua(Dt(t,e,n,r,s,!0))}function fa(t){return t?t.__v_isVNode===!0:!1}function nr(t,e){return t.type===e.type&&t.key===e.key}const ha=({key:t})=>t??null,jr=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?we(t)||Oe(t)||U(t)?{i:mt,r:t,k:e,f:!!n}:t:null);function F(t,e=null,n=null,r=0,s=null,i=t===Ie?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&ha(e),ref:e&&jr(e),scopeId:Ro,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:mt};return a?(Ws(l,n),i&128&&t.normalize(l)):n&&(l.shapeFlag|=we(n)?8:16),tr>0&&!o&&ct&&(l.patchFlag>0||i&6)&&l.patchFlag!==32&&ct.push(l),l}const Dt=Lu;function Lu(t,e=null,n=null,r=0,s=null,i=!1){if((!t||t===ru)&&(t=rn),fa(t)){const a=Cn(t,e,!0);return n&&Ws(a,n),tr>0&&!i&&ct&&(a.shapeFlag&6?ct[ct.indexOf(t)]=a:ct.push(a)),a.patchFlag=-2,a}if(Wu(t)&&(t=t.__vccOpts),e){e=Pu(e);let{class:a,style:l}=e;a&&!we(a)&&(e.class=Un(a)),ae(l)&&(Is(l)&&!$(l)&&(l=_e({},l)),e.style=vt(l))}const o=we(t)?1:la(t)?128:qc(t)?64:ae(t)?4:U(t)?2:0;return F(t,e,n,r,s,o,i,!0)}function Pu(t){return t?Is(t)||Zo(t)?_e({},t):t:null}function Cn(t,e,n=!1,r=!1){const{props:s,ref:i,patchFlag:o,children:a,transition:l}=t,c=e?Nu(s||{},e):s,f={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&ha(c),ref:e&&e.ref?n&&i?$(i)?i.concat(jr(e)):[i,jr(e)]:jr(e):i,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ie?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Cn(t.ssContent),ssFallback:t.ssFallback&&Cn(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&r&&Ns(f,l.clone(f)),f}function qr(t=" ",e=0){return Dt(Hr,null,t,e)}function ut(t="",e=!1){return e?(Q(),Iu(rn,null,t)):Dt(rn,null,t)}function zt(t){return t==null||typeof t=="boolean"?Dt(rn):$(t)?Dt(Ie,null,t.slice()):fa(t)?Xt(t):Dt(Hr,null,String(t))}function Xt(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Cn(t)}function Ws(t,e){let n=0;const{shapeFlag:r}=t;if(e==null)e=null;else if($(e))n=16;else if(typeof e=="object")if(r&65){const s=e.default;s&&(s._c&&(s._d=!1),Ws(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!Zo(e)?e._ctx=mt:s===3&&mt&&(mt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else U(e)?(e={default:e,_ctx:mt},n=32):(e=String(e),r&64?(n=16,e=[qr(e)]):n=8);t.children=e,t.shapeFlag|=n}function Nu(...t){const e={};for(let n=0;n<t.length;n++){const r=t[n];for(const s in r)if(s==="class")e.class!==r.class&&(e.class=Un([e.class,r.class]));else if(s==="style")e.style=vt([e.style,r.style]);else if(wr(s)){const i=e[s],o=r[s];o&&i!==o&&!($(i)&&i.includes(o))?e[s]=i?[].concat(i,o):o:o==null&&i==null&&!xr(s)&&(e[s]=o)}else s!==""&&(e[s]=r[s])}return e}function Bt(t,e,n,r=null){Nt(t,e,7,[n,r])}const Mu=qo();let Du=0;function zu(t,e,n){const r=t.type,s=(e?e.appContext:t.appContext)||Mu,i={uid:Du++,vnode:t,type:r,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new nc(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Qo(r,s),emitsOptions:Vo(r,s),emit:null,emitted:null,propsDefaults:Z,inheritAttrs:r.inheritAttrs,ctx:Z,data:Z,props:Z,attrs:Z,slots:Z,refs:Z,setupState:Z,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=e?e.root:i,i.emit=pu.bind(null,i),t.ce&&t.ce(i),i}let qe=null;const Bu=()=>qe||mt;let Vr,Ks;{const t=Tr(),e=(n,r)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(r),i=>{s.length>1?s.forEach(o=>o(i)):s[0](i)}};Vr=e("__VUE_INSTANCE_SETTERS__",n=>qe=n),Ks=e("__VUE_SSR_SETTERS__",n=>sr=n)}const rr=t=>{const e=qe;return Vr(t),t.scope.on(),()=>{t.scope.off(),Vr(e)}},pa=()=>{qe&&qe.scope.off(),Vr(null)};function da(t){return t.vnode.shapeFlag&4}let sr=!1;function Fu(t,e=!1,n=!1){e&&Ks(e);const{props:r,children:s}=t.vnode,i=da(t);wu(t,r,i,e),ku(t,s,n||e);const o=i?$u(t,e):void 0;return e&&Ks(!1),o}function $u(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,su);const{setup:r}=n;if(r){It();const s=t.setupContext=r.length>1?Hu(t):null,i=rr(t),o=Sn(r,t,0,[t.props,s]),a=Ki(o);if(Lt(),i(),(a||t.sp)&&!Zn(t)&&Lo(t),a){if(o.then(pa,pa),e)return o.then(l=>{ga(t,l)}).catch(l=>{Lr(l,t,0)});t.asyncDep=o}else ga(t,o)}else ma(t)}function ga(t,e,n){U(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:ae(e)&&(t.setupState=vo(e)),ma(t)}function ma(t,e,n){const r=t.type;t.render||(t.render=r.render||Rt);{const s=rr(t);It();try{iu(t)}finally{Lt(),s()}}}const Uu={get(t,e){return De(t,"get",""),t[e]}};function Hu(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,Uu),slots:t.slots,emit:t.emit,expose:e}}function Wr(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(vo(kc(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in Jn)return Jn[n](t)},has(e,n){return n in e||n in Jn}})):t.proxy}const ju=/(?:^|[-_])\w/g,qu=t=>t.replace(ju,e=>e.toUpperCase()).replace(/[-_]/g,"");function Vu(t,e=!0){return U(t)?t.displayName||t.name:t.name||e&&t.__name}function ba(t,e,n=!1){let r=Vu(e);if(!r&&e.__file){const s=e.__file.match(/([^/\\]+)\.\w+$/);s&&(r=s[1])}if(!r&&t){const s=i=>{for(const o in i)if(i[o]===e)return o};r=s(t.components)||t.parent&&s(t.parent.type.components)||s(t.appContext.components)}return r?qu(r):n?"App":"Anonymous"}function Wu(t){return U(t)&&"__vccOpts"in t}const Gs=(t,e)=>Rc(t,e,sr),Ku="3.5.32";/**
* @vue/runtime-dom v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ys;const ya=typeof window<"u"&&window.trustedTypes;if(ya)try{Ys=ya.createPolicy("vue",{createHTML:t=>t})}catch{}const wa=Ys?t=>Ys.createHTML(t):t=>t,Gu="http://www.w3.org/2000/svg",Yu="http://www.w3.org/1998/Math/MathML",Zt=typeof document<"u"?document:null,xa=Zt&&Zt.createElement("template"),Xu={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,r)=>{const s=e==="svg"?Zt.createElementNS(Gu,t):e==="mathml"?Zt.createElementNS(Yu,t):n?Zt.createElement(t,{is:n}):Zt.createElement(t);return t==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:t=>Zt.createTextNode(t),createComment:t=>Zt.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>Zt.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,r,s,i){const o=n?n.previousSibling:e.lastChild;if(s&&(s===i||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===i||!(s=s.nextSibling)););else{xa.innerHTML=wa(r==="svg"?`<svg>${t}</svg>`:r==="mathml"?`<math>${t}</math>`:t);const a=xa.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},Zu=Symbol("_vtc");function Ju(t,e,n){const r=t[Zu];r&&(e=(e?[e,...r]:[...r]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const va=Symbol("_vod"),Qu=Symbol("_vsh"),ef=Symbol(""),tf=/(?:^|;)\s*display\s*:/;function nf(t,e,n){const r=t.style,s=we(n);let i=!1;if(n&&!s){if(e)if(we(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&Kr(r,a,"")}else for(const o in e)n[o]==null&&Kr(r,o,"");for(const o in n)o==="display"&&(i=!0),Kr(r,o,n[o])}else if(s){if(e!==n){const o=r[ef];o&&(n+=";"+o),r.cssText=n,i=tf.test(n)}}else e&&t.removeAttribute("style");va in t&&(t[va]=i?r.display:"",t[Qu]&&(r.display="none"))}const _a=/\s*!important$/;function Kr(t,e,n){if($(n))n.forEach(r=>Kr(t,e,r));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const r=rf(t,e);_a.test(n)?t.setProperty(lt(r),n.replace(_a,""),"important"):t[r]=n}}const ka=["Webkit","Moz","ms"],Xs={};function rf(t,e){const n=Xs[e];if(n)return n;let r=Xe(e);if(r!=="filter"&&r in t)return Xs[e]=r;r=Yi(r);for(let s=0;s<ka.length;s++){const i=ka[s]+r;if(i in t)return Xs[e]=i}return e}const Ta="http://www.w3.org/1999/xlink";function Sa(t,e,n,r,s,i=ec(e)){r&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Ta,e.slice(6,e.length)):t.setAttributeNS(Ta,e,n):n==null||i&&!Qi(n)?t.removeAttribute(e):t.setAttribute(e,i?"":Ct(n)?String(n):n)}function Ea(t,e,n,r,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?wa(n):n);return}const i=t.tagName;if(e==="value"&&i!=="PROGRESS"&&!i.includes("-")){const a=i==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=Qi(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(s||e)}function On(t,e,n,r){t.addEventListener(e,n,r)}function sf(t,e,n,r){t.removeEventListener(e,n,r)}const Aa=Symbol("_vei");function of(t,e,n,r,s=null){const i=t[Aa]||(t[Aa]={}),o=i[e];if(r&&o)o.value=r;else{const[a,l]=af(e);if(r){const c=i[e]=uf(r,s);On(t,a,c,l)}else o&&(sf(t,a,o,l),i[e]=void 0)}}const Ra=/(?:Once|Passive|Capture)$/;function af(t){let e;if(Ra.test(t)){e={};let r;for(;r=t.match(Ra);)t=t.slice(0,t.length-r[0].length),e[r[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):lt(t.slice(2)),e]}let Zs=0;const lf=Promise.resolve(),cf=()=>Zs||(lf.then(()=>Zs=0),Zs=Date.now());function uf(t,e){const n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;Nt(ff(r,n.value),e,5,[r])};return n.value=t,n.attached=cf(),n}function ff(t,e){if($(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(r=>s=>!s._stopped&&r&&r(s))}else return e}const Ca=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,hf=(t,e,n,r,s,i)=>{const o=s==="svg";e==="class"?Ju(t,r,o):e==="style"?nf(t,n,r):wr(e)?xr(e)||of(t,e,n,r,i):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):pf(t,e,r,o))?(Ea(t,e,r),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&Sa(t,e,r,o,i,e!=="value")):t._isVueCE&&(df(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!we(r)))?Ea(t,Xe(e),r,i,e):(e==="true-value"?t._trueValue=r:e==="false-value"&&(t._falseValue=r),Sa(t,e,r,o))};function pf(t,e,n,r){if(r)return!!(e==="innerHTML"||e==="textContent"||e in t&&Ca(e)&&U(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return Ca(e)&&we(n)?!1:e in t}function df(t,e){const n=t._def.props;if(!n)return!1;const r=Xe(e);return Array.isArray(n)?n.some(s=>Xe(s)===r):Object.keys(n).some(s=>Xe(s)===r)}const Oa={};function gf(t,e,n){let r=Io(t,e);vr(r)&&(r=_e({},r,e));class s extends Js{constructor(o){super(r,o,n)}}return s.def=r,s}const mf=typeof HTMLElement<"u"?HTMLElement:class{};class Js extends mf{constructor(e,n={},r=za){super(),this._def=e,this._props=n,this._createApp=r,this._isVueCE=!0,this._instance=null,this._app=null,this._nonce=this._def.nonce,this._connected=!1,this._resolved=!1,this._patching=!1,this._dirty=!1,this._numberProps=null,this._styleChildren=new WeakSet,this._styleAnchors=new WeakMap,this._ob=null,this.shadowRoot&&r!==za?this._root=this.shadowRoot:e.shadowRoot!==!1?(this.attachShadow(_e({},e.shadowRootOptions,{mode:"open"})),this._root=this.shadowRoot):this._root=this}connectedCallback(){if(!this.isConnected)return;!this.shadowRoot&&!this._resolved&&this._parseSlots(),this._connected=!0;let e=this;for(;e=e&&(e.assignedSlot||e.parentNode||e.host);)if(e instanceof Js){this._parent=e;break}this._instance||(this._resolved?this._mount(this._def):e&&e._pendingResolve?this._pendingResolve=e._pendingResolve.then(()=>{this._pendingResolve=void 0,this._resolveDef()}):this._resolveDef())}_setParent(e=this._parent){e&&(this._instance.parent=e._instance,this._inheritParentContext(e))}_inheritParentContext(e=this._parent){e&&this._app&&Object.setPrototypeOf(this._app._context.provides,e._instance.provides)}disconnectedCallback(){this._connected=!1,Gn(()=>{this._connected||(this._ob&&(this._ob.disconnect(),this._ob=null),this._app&&this._app.unmount(),this._instance&&(this._instance.ce=void 0),this._app=this._instance=null,this._teleportTargets&&(this._teleportTargets.clear(),this._teleportTargets=void 0))})}_processMutations(e){for(const n of e)this._setAttr(n.attributeName)}_resolveDef(){if(this._pendingResolve)return;for(let r=0;r<this.attributes.length;r++)this._setAttr(this.attributes[r].name);this._ob=new MutationObserver(this._processMutations.bind(this)),this._ob.observe(this,{attributes:!0});const e=(r,s=!1)=>{this._resolved=!0,this._pendingResolve=void 0;const{props:i,styles:o}=r;let a;if(i&&!$(i))for(const l in i){const c=i[l];(c===Number||c&&c.type===Number)&&(l in this._props&&(this._props[l]=Zi(this._props[l])),(a||(a=Object.create(null)))[Xe(l)]=!0)}this._numberProps=a,this._resolveProps(r),this.shadowRoot&&this._applyStyles(o),this._mount(r)},n=this._def.__asyncLoader;n?this._pendingResolve=n().then(r=>{r.configureApp=this._def.configureApp,e(this._def=r,!0)}):e(this._def)}_mount(e){this._app=this._createApp(e),this._inheritParentContext(),e.configureApp&&e.configureApp(this._app),this._app._ceVNode=this._createVNode(),this._app.mount(this._root);const n=this._instance&&this._instance.exposed;if(n)for(const r in n)ne(this,r)||Object.defineProperty(this,r,{get:()=>Tn(n[r])})}_resolveProps(e){const{props:n}=e,r=$(n)?n:Object.keys(n||{});for(const s of Object.keys(this))s[0]!=="_"&&r.includes(s)&&this._setProp(s,this[s]);for(const s of r.map(Xe))Object.defineProperty(this,s,{get(){return this._getProp(s)},set(i){this._setProp(s,i,!0,!this._patching)}})}_setAttr(e){if(e.startsWith("data-v-"))return;const n=this.hasAttribute(e);let r=n?this.getAttribute(e):Oa;const s=Xe(e);n&&this._numberProps&&this._numberProps[s]&&(r=Zi(r)),this._setProp(s,r,!1,!0)}_getProp(e){return this._props[e]}_setProp(e,n,r=!0,s=!1){if(n!==this._props[e]&&(this._dirty=!0,n===Oa?delete this._props[e]:(this._props[e]=n,e==="key"&&this._app&&(this._app._ceVNode.key=n)),s&&this._instance&&this._update(),r)){const i=this._ob;i&&(this._processMutations(i.takeRecords()),i.disconnect()),n===!0?this.setAttribute(lt(e),""):typeof n=="string"||typeof n=="number"?this.setAttribute(lt(e),n+""):n||this.removeAttribute(lt(e)),i&&i.observe(this,{attributes:!0})}}_update(){const e=this._createVNode();this._app&&(e.appContext=this._app._context),_f(e,this._root)}_createVNode(){const e={};this.shadowRoot||(e.onVnodeMounted=e.onVnodeUpdated=this._renderSlots.bind(this));const n=Dt(this._def,_e(e,this._props));return this._instance||(n.ce=r=>{this._instance=r,r.ce=this,r.isCE=!0;const s=(i,o)=>{this.dispatchEvent(new CustomEvent(i,vr(o[0])?_e({detail:o},o[0]):{detail:o}))};r.emit=(i,...o)=>{s(i,o),lt(i)!==i&&s(lt(i),o)},this._setParent()}),n}_applyStyles(e,n,r){if(!e)return;if(n){if(n===this._def||this._styleChildren.has(n))return;this._styleChildren.add(n)}const s=this._nonce,i=this.shadowRoot,o=r?this._getStyleAnchor(r)||this._getStyleAnchor(this._def):this._getRootStyleInsertionAnchor(i);let a=null;for(let l=e.length-1;l>=0;l--){const c=document.createElement("style");s&&c.setAttribute("nonce",s),c.textContent=e[l],i.insertBefore(c,a||o),a=c,l===0&&(r||this._styleAnchors.set(this._def,c),n&&this._styleAnchors.set(n,c))}}_getStyleAnchor(e){if(!e)return null;const n=this._styleAnchors.get(e);return n&&n.parentNode===this.shadowRoot?n:(n&&this._styleAnchors.delete(e),null)}_getRootStyleInsertionAnchor(e){for(let n=0;n<e.childNodes.length;n++){const r=e.childNodes[n];if(!(r instanceof HTMLStyleElement))return r}return null}_parseSlots(){const e=this._slots={};let n;for(;n=this.firstChild;){const r=n.nodeType===1&&n.getAttribute("slot")||"default";(e[r]||(e[r]=[])).push(n),this.removeChild(n)}}_renderSlots(){const e=this._getSlots(),n=this._instance.type.__scopeId;for(let r=0;r<e.length;r++){const s=e[r],i=s.getAttribute("name")||"default",o=this._slots[i],a=s.parentNode;if(o)for(const l of o){if(n&&l.nodeType===1){const c=n+"-s",f=document.createTreeWalker(l,1);l.setAttribute(c,"");let d;for(;d=f.nextNode();)d.setAttribute(c,"")}a.insertBefore(l,s)}else for(;s.firstChild;)a.insertBefore(s.firstChild,s);a.removeChild(s)}}_getSlots(){const e=[this];this._teleportTargets&&e.push(...this._teleportTargets);const n=new Set;for(const r of e){const s=r.querySelectorAll("slot");for(let i=0;i<s.length;i++)n.add(s[i])}return Array.from(n)}_injectChildStyle(e,n){this._applyStyles(e.styles,e,n)}_beginPatch(){this._patching=!0,this._dirty=!1}_endPatch(){this._patching=!1,this._dirty&&this._instance&&this._update()}_hasShadowRoot(){return this._def.shadowRoot!==!1}_removeChildStyle(e){}}const Ia=t=>{const e=t.props["onUpdate:modelValue"]||!1;return $(e)?n=>kr(e,n):e};function bf(t){t.target.composing=!0}function La(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const Qs=Symbol("_assign");function Pa(t,e,n){return e&&(t=t.trim()),n&&(t=gs(t)),t}const Gr={created(t,{modifiers:{lazy:e,trim:n,number:r}},s){t[Qs]=Ia(s);const i=r||s.props&&s.props.type==="number";On(t,e?"change":"input",o=>{o.target.composing||t[Qs](Pa(t.value,n,i))}),(n||i)&&On(t,"change",()=>{t.value=Pa(t.value,n,i)}),e||(On(t,"compositionstart",bf),On(t,"compositionend",La),On(t,"change",La))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:r,trim:s,number:i}},o){if(t[Qs]=Ia(o),t.composing)return;const a=(i||t.type==="number")&&!/^0\d/.test(t.value)?gs(t.value):t.value,l=e??"";if(a===l)return;const c=t.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===t&&t.type!=="range"&&(r&&e===n||s&&t.value.trim()===l)||(t.value=l)}},yf=["ctrl","shift","alt","meta"],wf={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>yf.some(n=>t[`${n}Key`]&&!e.includes(n))},ei=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),r=e.join(".");return n[r]||(n[r]=(s,...i)=>{for(let o=0;o<e.length;o++){const a=wf[e[o]];if(a&&a(s,e))return}return t(s,...i)})},xf={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},Na=(t,e)=>{const n=t._withKeys||(t._withKeys={}),r=e.join(".");return n[r]||(n[r]=s=>{if(!("key"in s))return;const i=lt(s.key);if(e.some(o=>o===i||xf[o]===i))return t(s)})},vf=_e({patchProp:hf},Xu);let Ma;function Da(){return Ma||(Ma=Su(vf))}const _f=(...t)=>{Da().render(...t)},za=(...t)=>{const e=Da().createApp(...t),{mount:n}=e;return e.mount=r=>{const s=Tf(r);if(!s)return;const i=e._component;!U(i)&&!i.render&&!i.template&&(i.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const o=n(s,!1,kf(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),o},e};function kf(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function Tf(t){return we(t)?document.querySelector(t):t}const Ft=Object.create(null);Ft.open="0",Ft.close="1",Ft.ping="2",Ft.pong="3",Ft.message="4",Ft.upgrade="5",Ft.noop="6";const Yr=Object.create(null);Object.keys(Ft).forEach(t=>{Yr[Ft[t]]=t});const ti={type:"error",data:"parser error"},Ba=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Fa=typeof ArrayBuffer=="function",$a=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,ni=({type:t,data:e},n,r)=>Ba&&e instanceof Blob?n?r(e):Ua(e,r):Fa&&(e instanceof ArrayBuffer||$a(e))?n?r(e):Ua(new Blob([e]),r):r(Ft[t]+(e||"")),Ua=(t,e)=>{const n=new FileReader;return n.onload=function(){const r=n.result.split(",")[1];e("b"+(r||""))},n.readAsDataURL(t)};function Ha(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let ri;function Sf(t,e){if(Ba&&t.data instanceof Blob)return t.data.arrayBuffer().then(Ha).then(e);if(Fa&&(t.data instanceof ArrayBuffer||$a(t.data)))return e(Ha(t.data));ni(t,!1,n=>{ri||(ri=new TextEncoder),e(ri.encode(n))})}const ja="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ir=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<ja.length;t++)ir[ja.charCodeAt(t)]=t;const Ef=t=>{let e=t.length*.75,n=t.length,r,s=0,i,o,a,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const c=new ArrayBuffer(e),f=new Uint8Array(c);for(r=0;r<n;r+=4)i=ir[t.charCodeAt(r)],o=ir[t.charCodeAt(r+1)],a=ir[t.charCodeAt(r+2)],l=ir[t.charCodeAt(r+3)],f[s++]=i<<2|o>>4,f[s++]=(o&15)<<4|a>>2,f[s++]=(a&3)<<6|l&63;return c},Af=typeof ArrayBuffer=="function",si=(t,e)=>{if(typeof t!="string")return{type:"message",data:qa(t,e)};const n=t.charAt(0);return n==="b"?{type:"message",data:Rf(t.substring(1),e)}:Yr[n]?t.length>1?{type:Yr[n],data:t.substring(1)}:{type:Yr[n]}:ti},Rf=(t,e)=>{if(Af){const n=Ef(t);return qa(n,e)}else return{base64:!0,data:t}},qa=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Va="",Cf=(t,e)=>{const n=t.length,r=new Array(n);let s=0;t.forEach((i,o)=>{ni(i,!1,a=>{r[o]=a,++s===n&&e(r.join(Va))})})},Of=(t,e)=>{const n=t.split(Va),r=[];for(let s=0;s<n.length;s++){const i=si(n[s],e);if(r.push(i),i.type==="error")break}return r};function If(){return new TransformStream({transform(t,e){Sf(t,n=>{const r=n.length;let s;if(r<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,r);else if(r<65536){s=new Uint8Array(3);const i=new DataView(s.buffer);i.setUint8(0,126),i.setUint16(1,r)}else{s=new Uint8Array(9);const i=new DataView(s.buffer);i.setUint8(0,127),i.setBigUint64(1,BigInt(r))}t.data&&typeof t.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(n)})}})}let ii;function Xr(t){return t.reduce((e,n)=>e+n.length,0)}function Zr(t,e){if(t[0].length===e)return t.shift();const n=new Uint8Array(e);let r=0;for(let s=0;s<e;s++)n[s]=t[0][r++],r===t[0].length&&(t.shift(),r=0);return t.length&&r<t[0].length&&(t[0]=t[0].slice(r)),n}function Lf(t,e){ii||(ii=new TextDecoder);const n=[];let r=0,s=-1,i=!1;return new TransformStream({transform(o,a){for(n.push(o);;){if(r===0){if(Xr(n)<1)break;const l=Zr(n,1);i=(l[0]&128)===128,s=l[0]&127,s<126?r=3:s===126?r=1:r=2}else if(r===1){if(Xr(n)<2)break;const l=Zr(n,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),r=3}else if(r===2){if(Xr(n)<8)break;const l=Zr(n,8),c=new DataView(l.buffer,l.byteOffset,l.length),f=c.getUint32(0);if(f>Math.pow(2,21)-1){a.enqueue(ti);break}s=f*Math.pow(2,32)+c.getUint32(4),r=3}else{if(Xr(n)<s)break;const l=Zr(n,s);a.enqueue(si(i?l:ii.decode(l),e)),r=0}if(s===0||s>t){a.enqueue(ti);break}}}})}const Wa=4;function Se(t){if(t)return Pf(t)}function Pf(t){for(var e in Se.prototype)t[e]=Se.prototype[e];return t}Se.prototype.on=Se.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},Se.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},Se.prototype.off=Se.prototype.removeListener=Se.prototype.removeAllListeners=Se.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var r,s=0;s<n.length;s++)if(r=n[s],r===e||r.fn===e){n.splice(s,1);break}return n.length===0&&delete this._callbacks["$"+t],this},Se.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],r=1;r<arguments.length;r++)e[r-1]=arguments[r];if(n){n=n.slice(0);for(var r=0,s=n.length;r<s;++r)n[r].apply(this,e)}return this},Se.prototype.emitReserved=Se.prototype.emit,Se.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},Se.prototype.hasListeners=function(t){return!!this.listeners(t).length};const Jr=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,n)=>n(e,0),bt=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Nf="arraybuffer";function kd(){}function Ka(t,...e){return e.reduce((n,r)=>(t.hasOwnProperty(r)&&(n[r]=t[r]),n),{})}const Mf=bt.setTimeout,Df=bt.clearTimeout;function Qr(t,e){e.useNativeTimers?(t.setTimeoutFn=Mf.bind(bt),t.clearTimeoutFn=Df.bind(bt)):(t.setTimeoutFn=bt.setTimeout.bind(bt),t.clearTimeoutFn=bt.clearTimeout.bind(bt))}const zf=1.33;function Bf(t){return typeof t=="string"?Ff(t):Math.ceil((t.byteLength||t.size)*zf)}function Ff(t){let e=0,n=0;for(let r=0,s=t.length;r<s;r++)e=t.charCodeAt(r),e<128?n+=1:e<2048?n+=2:e<55296||e>=57344?n+=3:(r++,n+=4);return n}function Ga(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function $f(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e}function Uf(t){let e={},n=t.split("&");for(let r=0,s=n.length;r<s;r++){let i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}class Hf extends Error{constructor(e,n,r){super(e),this.description=n,this.context=r,this.type="TransportError"}}class oi extends Se{constructor(e){super(),this.writable=!1,Qr(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,n,r){return super.emitReserved("error",new Hf(e,n,r)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const n=si(e,this.socket.binaryType);this.onPacket(n)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,n={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(n)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const n=$f(e);return n.length?"?"+n:""}}class jf extends oi{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const n=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let r=0;this._polling&&(r++,this.once("pollComplete",function(){--r||n()})),this.writable||(r++,this.once("drain",function(){--r||n()}))}else n()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const n=r=>{if(this.readyState==="opening"&&r.type==="open"&&this.onOpen(),r.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(r)};Of(e,this.socket.binaryType).forEach(n),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Cf(e,n=>{this.doWrite(n,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",n=this.query||{};return this.opts.timestampRequests!==!1&&(n[this.opts.timestampParam]=Ga()),!this.supportsBinary&&!n.sid&&(n.b64=1),this.createUri(e,n)}}let Ya=!1;try{Ya=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const qf=Ya;function Vf(){}class Wf extends jf{constructor(e){if(super(e),typeof location<"u"){const n=location.protocol==="https:";let r=location.port;r||(r=n?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||r!==e.port}}doWrite(e,n){const r=this.request({method:"POST",data:e});r.on("success",n),r.on("error",(s,i)=>{this.onError("xhr post error",s,i)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(n,r)=>{this.onError("xhr poll error",n,r)}),this.pollXhr=e}}class $t extends Se{constructor(e,n,r){super(),this.createRequest=e,Qr(this,r),this._opts=r,this._method=r.method||"GET",this._uri=n,this._data=r.data!==void 0?r.data:null,this._create()}_create(){var e;const n=Ka(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");n.xdomain=!!this._opts.xd;const r=this._xhr=this.createRequest(n);try{r.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){r.setDisableHeaderCheck&&r.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&r.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{r.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(r),"withCredentials"in r&&(r.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(r.timeout=this._opts.requestTimeout),r.onreadystatechange=()=>{var s;r.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(r.getResponseHeader("set-cookie"))),r.readyState===4&&(r.status===200||r.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof r.status=="number"?r.status:0)},0))},r.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=$t.requestsCount++,$t.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Vf,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete $t.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}if($t.requestsCount=0,$t.requests={},typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Xa);else if(typeof addEventListener=="function"){const t="onpagehide"in bt?"pagehide":"unload";addEventListener(t,Xa,!1)}}function Xa(){for(let t in $t.requests)$t.requests.hasOwnProperty(t)&&$t.requests[t].abort()}const Kf=function(){const t=Za({xdomain:!1});return t&&t.responseType!==null}();class Gf extends Wf{constructor(e){super(e);const n=e&&e.forceBase64;this.supportsBinary=Kf&&!n}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new $t(Za,this.uri(),e)}}function Za(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||qf))return new XMLHttpRequest}catch{}if(!e)try{return new bt[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ja=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Yf extends oi{get name(){return"websocket"}doOpen(){const e=this.uri(),n=this.opts.protocols,r=Ja?{}:Ka(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(r.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,n,r)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;ni(r,this.supportsBinary,i=>{try{this.doWrite(r,i)}catch{}s&&Jr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",n=this.query||{};return this.opts.timestampRequests&&(n[this.opts.timestampParam]=Ga()),this.supportsBinary||(n.b64=1),this.createUri(e,n)}}const ai=bt.WebSocket||bt.MozWebSocket;class Xf extends Yf{createSocket(e,n,r){return Ja?new ai(e,n,r):n?new ai(e,n):new ai(e)}doWrite(e,n){this.ws.send(n)}}class Zf extends oi{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const n=Lf(Number.MAX_SAFE_INTEGER,this.socket.binaryType),r=e.readable.pipeThrough(n).getReader(),s=If();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const i=()=>{r.read().then(({done:a,value:l})=>{a||(this.onPacket(l),i())}).catch(a=>{})};i();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const r=e[n],s=n===e.length-1;this._writer.write(r).then(()=>{s&&Jr(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Jf={websocket:Xf,webtransport:Zf,polling:Gf},Qf=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,eh=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function li(t){if(t.length>8e3)throw"URI too long";const e=t,n=t.indexOf("["),r=t.indexOf("]");n!=-1&&r!=-1&&(t=t.substring(0,n)+t.substring(n,r).replace(/:/g,";")+t.substring(r,t.length));let s=Qf.exec(t||""),i={},o=14;for(;o--;)i[eh[o]]=s[o]||"";return n!=-1&&r!=-1&&(i.source=e,i.host=i.host.substring(1,i.host.length-1).replace(/;/g,":"),i.authority=i.authority.replace("[","").replace("]","").replace(/;/g,":"),i.ipv6uri=!0),i.pathNames=th(i,i.path),i.queryKey=nh(i,i.query),i}function th(t,e){const n=/\/{2,9}/g,r=e.replace(n,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&r.splice(0,1),e.slice(-1)=="/"&&r.splice(r.length-1,1),r}function nh(t,e){const n={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(r,s,i){s&&(n[s]=i)}),n}const ci=typeof addEventListener=="function"&&typeof removeEventListener=="function",es=[];ci&&addEventListener("offline",()=>{es.forEach(t=>t())},!1);class sn extends Se{constructor(e,n){if(super(),this.binaryType=Nf,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(n=e,e=null),e){const r=li(e);n.hostname=r.host,n.secure=r.protocol==="https"||r.protocol==="wss",n.port=r.port,r.query&&(n.query=r.query)}else n.host&&(n.hostname=li(n.host).host);Qr(this,n),this.secure=n.secure!=null?n.secure:typeof location<"u"&&location.protocol==="https:",n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.hostname=n.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=n.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},n.transports.forEach(r=>{const s=r.prototype.name;this.transports.push(s),this._transportsByName[s]=r}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},n),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Uf(this.opts.query)),ci&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},es.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const n=Object.assign({},this.opts.query);n.EIO=Wa,n.transport=e,this.id&&(n.sid=this.id);const r=Object.assign({},this.opts,{query:n,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](r)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&sn.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const n=this.createTransport(e);n.open(),this.setTransport(n)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",n=>this._onClose("transport close",n))}onOpen(){this.readyState="open",sn.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const n=new Error("server error");n.code=e.data,this._onError(n);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let n=1;for(let r=0;r<this.writeBuffer.length;r++){const s=this.writeBuffer[r].data;if(s&&(n+=Bf(s)),r>0&&n>this._maxPayload)return this.writeBuffer.slice(0,r);n+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Jr(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,n,r){return this._sendPacket("message",e,n,r),this}send(e,n,r){return this._sendPacket("message",e,n,r),this}_sendPacket(e,n,r,s){if(typeof n=="function"&&(s=n,n=void 0),typeof r=="function"&&(s=r,r=null),this.readyState==="closing"||this.readyState==="closed")return;r=r||{},r.compress=r.compress!==!1;const i={type:e,data:n,options:r};this.emitReserved("packetCreate",i),this.writeBuffer.push(i),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},n=()=>{this.off("upgrade",n),this.off("upgradeError",n),e()},r=()=>{this.once("upgrade",n),this.once("upgradeError",n)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?r():e()}):this.upgrading?r():e()),this}_onError(e){if(sn.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,n){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ci&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const r=es.indexOf(this._offlineEventListener);r!==-1&&es.splice(r,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,n),this.writeBuffer=[],this._prevBufferLen=0}}}sn.protocol=Wa;class rh extends sn{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let n=this.createTransport(e),r=!1;sn.priorWebsocketSuccess=!1;const s=()=>{r||(n.send([{type:"ping",data:"probe"}]),n.once("packet",d=>{if(!r)if(d.type==="pong"&&d.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",n),!n)return;sn.priorWebsocketSuccess=n.name==="websocket",this.transport.pause(()=>{r||this.readyState!=="closed"&&(f(),this.setTransport(n),n.send([{type:"upgrade"}]),this.emitReserved("upgrade",n),n=null,this.upgrading=!1,this.flush())})}else{const y=new Error("probe error");y.transport=n.name,this.emitReserved("upgradeError",y)}}))};function i(){r||(r=!0,f(),n.close(),n=null)}const o=d=>{const y=new Error("probe error: "+d);y.transport=n.name,i(),this.emitReserved("upgradeError",y)};function a(){o("transport closed")}function l(){o("socket closed")}function c(d){n&&d.name!==n.name&&i()}const f=()=>{n.removeListener("open",s),n.removeListener("error",o),n.removeListener("close",a),this.off("close",l),this.off("upgrading",c)};n.once("open",s),n.once("error",o),n.once("close",a),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{r||n.open()},200):n.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const n=[];for(let r=0;r<e.length;r++)~this.transports.indexOf(e[r])&&n.push(e[r]);return n}}let sh=class extends rh{constructor(e,n={}){const r=typeof e=="object"?e:n;(!r.transports||r.transports&&typeof r.transports[0]=="string")&&(r.transports=(r.transports||["polling","websocket","webtransport"]).map(s=>Jf[s]).filter(s=>!!s)),super(e,r)}};function ih(t,e="",n){let r=t;n=n||typeof location<"u"&&location,t==null&&(t=n.protocol+"//"+n.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=n.protocol+t:t=n.host+t),/^(https?|wss?):\/\//.test(t)||(typeof n<"u"?t=n.protocol+"//"+t:t="https://"+t),r=li(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";const i=r.host.indexOf(":")!==-1?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port+e,r.href=r.protocol+"://"+i+(n&&n.port===r.port?"":":"+r.port),r}const oh=typeof ArrayBuffer=="function",ah=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Qa=Object.prototype.toString,lh=typeof Blob=="function"||typeof Blob<"u"&&Qa.call(Blob)==="[object BlobConstructor]",ch=typeof File=="function"||typeof File<"u"&&Qa.call(File)==="[object FileConstructor]";function ui(t){return oh&&(t instanceof ArrayBuffer||ah(t))||lh&&t instanceof Blob||ch&&t instanceof File}function ts(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let n=0,r=t.length;n<r;n++)if(ts(t[n]))return!0;return!1}if(ui(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return ts(t.toJSON(),!0);for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&ts(t[n]))return!0;return!1}function uh(t){const e=[],n=t.data,r=t;return r.data=fi(n,e),r.attachments=e.length,{packet:r,buffers:e}}function fi(t,e){if(!t)return t;if(ui(t)){const n={_placeholder:!0,num:e.length};return e.push(t),n}else if(Array.isArray(t)){const n=new Array(t.length);for(let r=0;r<t.length;r++)n[r]=fi(t[r],e);return n}else if(typeof t=="object"&&!(t instanceof Date)){const n={};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=fi(t[r],e));return n}return t}function fh(t,e){return t.data=hi(t.data,e),delete t.attachments,t}function hi(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let n=0;n<t.length;n++)t[n]=hi(t[n],e);else if(typeof t=="object")for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(t[n]=hi(t[n],e));return t}const hh=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var K;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(K||(K={}));class ph{constructor(e){this.replacer=e}encode(e){return(e.type===K.EVENT||e.type===K.ACK)&&ts(e)?this.encodeAsBinary({type:e.type===K.EVENT?K.BINARY_EVENT:K.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let n=""+e.type;return(e.type===K.BINARY_EVENT||e.type===K.BINARY_ACK)&&(n+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(n+=e.nsp+","),e.id!=null&&(n+=e.id),e.data!=null&&(n+=JSON.stringify(e.data,this.replacer)),n}encodeAsBinary(e){const n=uh(e),r=this.encodeAsString(n.packet),s=n.buffers;return s.unshift(r),s}}class pi extends Se{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let n;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");n=this.decodeString(e);const r=n.type===K.BINARY_EVENT;r||n.type===K.BINARY_ACK?(n.type=r?K.EVENT:K.ACK,this.reconstructor=new dh(n),n.attachments===0&&super.emitReserved("decoded",n)):super.emitReserved("decoded",n)}else if(ui(e)||e.base64)if(this.reconstructor)n=this.reconstructor.takeBinaryData(e),n&&(this.reconstructor=null,super.emitReserved("decoded",n));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let n=0;const r={type:Number(e.charAt(0))};if(K[r.type]===void 0)throw new Error("unknown packet type "+r.type);if(r.type===K.BINARY_EVENT||r.type===K.BINARY_ACK){const i=n+1;for(;e.charAt(++n)!=="-"&&n!=e.length;);const o=e.substring(i,n);if(o!=Number(o)||e.charAt(n)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!gh(a)||a<0)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");r.attachments=a}if(e.charAt(n+1)==="/"){const i=n+1;for(;++n&&!(e.charAt(n)===","||n===e.length););r.nsp=e.substring(i,n)}else r.nsp="/";const s=e.charAt(n+1);if(s!==""&&Number(s)==s){const i=n+1;for(;++n;){const o=e.charAt(n);if(o==null||Number(o)!=o){--n;break}if(n===e.length)break}r.id=Number(e.substring(i,n+1))}if(e.charAt(++n)){const i=this.tryParse(e.substr(n));if(pi.isPayloadValid(r.type,i))r.data=i;else throw new Error("invalid payload")}return r}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,n){switch(e){case K.CONNECT:return el(n);case K.DISCONNECT:return n===void 0;case K.CONNECT_ERROR:return typeof n=="string"||el(n);case K.EVENT:case K.BINARY_EVENT:return Array.isArray(n)&&(typeof n[0]=="number"||typeof n[0]=="string"&&hh.indexOf(n[0])===-1);case K.ACK:case K.BINARY_ACK:return Array.isArray(n)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class dh{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const n=fh(this.reconPack,this.buffers);return this.finishedReconstruction(),n}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const gh=Number.isInteger||function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t};function el(t){return Object.prototype.toString.call(t)==="[object Object]"}const mh=Object.freeze(Object.defineProperty({__proto__:null,Decoder:pi,Encoder:ph,get PacketType(){return K}},Symbol.toStringTag,{value:"Module"}));function Tt(t,e,n){return t.on(e,n),function(){t.off(e,n)}}const bh=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class tl extends Se{constructor(e,n,r){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=n,r&&r.auth&&(this.auth=r.auth),this._opts=Object.assign({},r),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[Tt(e,"open",this.onopen.bind(this)),Tt(e,"packet",this.onpacket.bind(this)),Tt(e,"error",this.onerror.bind(this)),Tt(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...n){var r,s,i;if(bh.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(n.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(n),this;const o={type:K.EVENT,data:n};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof n[n.length-1]=="function"){const f=this.ids++,d=n.pop();this._registerAckCallback(f,d),o.id=f}const a=(s=(r=this.io.engine)===null||r===void 0?void 0:r.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((i=this.io.engine)===null||i===void 0)&&i._hasPingExpired());return this.flags.volatile&&!a||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,n){var r;const s=(r=this.flags.timeout)!==null&&r!==void 0?r:this._opts.ackTimeout;if(s===void 0){this.acks[e]=n;return}const i=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);n.call(this,new Error("operation has timed out"))},s),o=(...a)=>{this.io.clearTimeoutFn(i),n.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...n){return new Promise((r,s)=>{const i=(o,a)=>o?s(o):r(a);i.withError=!0,n.push(i),this.emit(e,...n)})}_addToQueue(e){let n;typeof e[e.length-1]=="function"&&(n=e.pop());const r={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...i)=>(this._queue[0],s!==null?r.tryCount>this._opts.retries&&(this._queue.shift(),n&&n(s)):(this._queue.shift(),n&&n(null,...i)),r.pending=!1,this._drainQueue())),this._queue.push(r),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const n=this._queue[0];n.pending&&!e||(n.pending=!0,n.tryCount++,this.flags=n.flags,this.emit.apply(this,n.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:K.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,n){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,n),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(r=>String(r.id)===e)){const r=this.acks[e];delete this.acks[e],r.withError&&r.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case K.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case K.EVENT:case K.BINARY_EVENT:this.onevent(e);break;case K.ACK:case K.BINARY_ACK:this.onack(e);break;case K.DISCONNECT:this.ondisconnect();break;case K.CONNECT_ERROR:this.destroy();const r=new Error(e.data.message);r.data=e.data.data,this.emitReserved("connect_error",r);break}}onevent(e){const n=e.data||[];e.id!=null&&n.push(this.ack(e.id)),this.connected?this.emitEvent(n):this.receiveBuffer.push(Object.freeze(n))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const n=this._anyListeners.slice();for(const r of n)r.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const n=this;let r=!1;return function(...s){r||(r=!0,n.packet({type:K.ACK,id:e,data:s}))}}onack(e){const n=this.acks[e.id];typeof n=="function"&&(delete this.acks[e.id],n.withError&&e.data.unshift(null),n.apply(this,e.data))}onconnect(e,n){this.id=e,this.recovered=n&&this._pid===n,this._pid=n,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:K.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const n=this._anyListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const n=this._anyOutgoingListeners;for(let r=0;r<n.length;r++)if(e===n[r])return n.splice(r,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const n=this._anyOutgoingListeners.slice();for(const r of n)r.apply(this,e.data)}}}function In(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}In.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+n:t-n}return Math.min(t,this.max)|0},In.prototype.reset=function(){this.attempts=0},In.prototype.setMin=function(t){this.ms=t},In.prototype.setMax=function(t){this.max=t},In.prototype.setJitter=function(t){this.jitter=t};class di extends Se{constructor(e,n){var r;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(n=e,e=void 0),n=n||{},n.path=n.path||"/socket.io",this.opts=n,Qr(this,n),this.reconnection(n.reconnection!==!1),this.reconnectionAttempts(n.reconnectionAttempts||1/0),this.reconnectionDelay(n.reconnectionDelay||1e3),this.reconnectionDelayMax(n.reconnectionDelayMax||5e3),this.randomizationFactor((r=n.randomizationFactor)!==null&&r!==void 0?r:.5),this.backoff=new In({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(n.timeout==null?2e4:n.timeout),this._readyState="closed",this.uri=e;const s=n.parser||mh;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=n.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var n;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(n=this.backoff)===null||n===void 0||n.setMin(e),this)}randomizationFactor(e){var n;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(n=this.backoff)===null||n===void 0||n.setJitter(e),this)}reconnectionDelayMax(e){var n;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(n=this.backoff)===null||n===void 0||n.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new sh(this.uri,this.opts);const n=this.engine,r=this;this._readyState="opening",this.skipReconnect=!1;const s=Tt(n,"open",function(){r.onopen(),e&&e()}),i=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=Tt(n,"error",i);if(this._timeout!==!1){const a=this._timeout,l=this.setTimeoutFn(()=>{s(),i(new Error("timeout")),n.close()},a);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(Tt(e,"ping",this.onping.bind(this)),Tt(e,"data",this.ondata.bind(this)),Tt(e,"error",this.onerror.bind(this)),Tt(e,"close",this.onclose.bind(this)),Tt(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(n){this.onclose("parse error",n)}}ondecoded(e){Jr(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,n){let r=this.nsps[e];return r?this._autoConnect&&!r.active&&r.connect():(r=new tl(this,e,n),this.nsps[e]=r),r}_destroy(e){const n=Object.keys(this.nsps);for(const r of n)if(this.nsps[r].active)return;this._close()}_packet(e){const n=this.encoder.encode(e);for(let r=0;r<n.length;r++)this.engine.write(n[r],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,n){var r;this.cleanup(),(r=this.engine)===null||r===void 0||r.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,n),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const n=this.backoff.duration();this._reconnecting=!0;const r=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},n);this.opts.autoUnref&&r.unref(),this.subs.push(()=>{this.clearTimeoutFn(r)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const or={};function ns(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const n=ih(t,e.path||"/socket.io"),r=n.source,s=n.id,i=n.path,o=or[s]&&i in or[s].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return a?l=new di(r,e):(or[s]||(or[s]=new di(r,e)),l=or[s]),n.query&&!e.query&&(e.query=n.queryKey),l.socket(n.path,e)}Object.assign(ns,{Manager:di,Socket:tl,io:ns,connect:ns});function gi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var mn=gi();function nl(t){mn=t}var bn={exec:()=>null};function G(t,e=""){let n=typeof t=="string"?t:t.source,r={replace:(s,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(ze.caret,"$1"),n=n.replace(s,o),r},getRegex:()=>new RegExp(n,e)};return r}var yh=((t="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+t)}catch{return!1}})(),ze={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},wh=/^(?:[ \t]*(?:\n|$))+/,xh=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,vh=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,ar=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,_h=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,mi=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,rl=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,sl=G(rl).replace(/bull/g,mi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),kh=G(rl).replace(/bull/g,mi).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),bi=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Th=/^[^\n]+/,yi=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Sh=G(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",yi).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Eh=G(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,mi).getRegex(),rs="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",wi=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ah=G("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",wi).replace("tag",rs).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),il=G(bi).replace("hr",ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rs).getRegex(),Rh=G(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",il).getRegex(),xi={blockquote:Rh,code:xh,def:Sh,fences:vh,heading:_h,hr:ar,html:Ah,lheading:sl,list:Eh,newline:wh,paragraph:il,table:bn,text:Th},ol=G("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rs).getRegex(),Ch={...xi,lheading:kh,table:ol,paragraph:G(bi).replace("hr",ar).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ol).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rs).getRegex()},Oh={...xi,html:G(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",wi).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:bn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:G(bi).replace("hr",ar).replace("heading",` *#{1,6} *[^
]`).replace("lheading",sl).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ih=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Lh=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,al=/^( {2,}|\\)\n(?!\s*$)/,Ph=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Ln=/[\p{P}\p{S}]/u,ss=/[\s\p{P}\p{S}]/u,vi=/[^\s\p{P}\p{S}]/u,Nh=G(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,ss).getRegex(),ll=/(?!~)[\p{P}\p{S}]/u,Mh=/(?!~)[\s\p{P}\p{S}]/u,Dh=/(?:[^\s\p{P}\p{S}]|~)/u,zh=G(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",yh?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),cl=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Bh=G(cl,"u").replace(/punct/g,Ln).getRegex(),Fh=G(cl,"u").replace(/punct/g,ll).getRegex(),ul="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",$h=G(ul,"gu").replace(/notPunctSpace/g,vi).replace(/punctSpace/g,ss).replace(/punct/g,Ln).getRegex(),Uh=G(ul,"gu").replace(/notPunctSpace/g,Dh).replace(/punctSpace/g,Mh).replace(/punct/g,ll).getRegex(),Hh=G("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,vi).replace(/punctSpace/g,ss).replace(/punct/g,Ln).getRegex(),jh=G(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Ln).getRegex(),qh="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Vh=G(qh,"gu").replace(/notPunctSpace/g,vi).replace(/punctSpace/g,ss).replace(/punct/g,Ln).getRegex(),Wh=G(/\\(punct)/,"gu").replace(/punct/g,Ln).getRegex(),Kh=G(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Gh=G(wi).replace("(?:-->|$)","-->").getRegex(),Yh=G("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Gh).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),is=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,Xh=G(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",is).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),fl=G(/^!?\[(label)\]\[(ref)\]/).replace("label",is).replace("ref",yi).getRegex(),hl=G(/^!?\[(ref)\](?:\[\])?/).replace("ref",yi).getRegex(),Zh=G("reflink|nolink(?!\\()","g").replace("reflink",fl).replace("nolink",hl).getRegex(),pl=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,_i={_backpedal:bn,anyPunctuation:Wh,autolink:Kh,blockSkip:zh,br:al,code:Lh,del:bn,delLDelim:bn,delRDelim:bn,emStrongLDelim:Bh,emStrongRDelimAst:$h,emStrongRDelimUnd:Hh,escape:Ih,link:Xh,nolink:hl,punctuation:Nh,reflink:fl,reflinkSearch:Zh,tag:Yh,text:Ph,url:bn},Jh={..._i,link:G(/^!?\[(label)\]\((.*?)\)/).replace("label",is).getRegex(),reflink:G(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",is).getRegex()},ki={..._i,emStrongRDelimAst:Uh,emStrongLDelim:Fh,delLDelim:jh,delRDelim:Vh,url:G(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",pl).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:G(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",pl).getRegex()},Qh={...ki,br:G(al).replace("{2,}","*").getRegex(),text:G(ki.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},os={normal:xi,gfm:Ch,pedantic:Oh},lr={normal:_i,gfm:ki,breaks:Qh,pedantic:Jh},ep={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},dl=t=>ep[t];function Ut(t,e){if(e){if(ze.escapeTest.test(t))return t.replace(ze.escapeReplace,dl)}else if(ze.escapeTestNoEncode.test(t))return t.replace(ze.escapeReplaceNoEncode,dl);return t}function gl(t){try{t=encodeURI(t).replace(ze.percentDecode,"%")}catch{return null}return t}function ml(t,e){let n=t.replace(ze.findPipe,(i,o,a)=>{let l=!1,c=o;for(;--c>=0&&a[c]==="\\";)l=!l;return l?"|":" |"}),r=n.split(ze.splitPipe),s=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;s<r.length;s++)r[s]=r[s].trim().replace(ze.slashPipe,"|");return r}function on(t,e,n){let r=t.length;if(r===0)return"";let s=0;for(;s<r&&t.charAt(r-s-1)===e;)s++;return t.slice(0,r-s)}function bl(t){let e=t.split(`
`),n=e.length-1;for(;n>=0&&ze.blankLine.test(e[n]);)n--;return e.length-n<=2?t:e.slice(0,n+1).join(`
`)}function tp(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let r=0;r<t.length;r++)if(t[r]==="\\")r++;else if(t[r]===e[0])n++;else if(t[r]===e[1]&&(n--,n<0))return r;return n>0?-2:-1}function np(t,e=0){let n=e,r="";for(let s of t)if(s==="	"){let i=4-n%4;r+=" ".repeat(i),n+=i}else r+=s,n++;return r}function yl(t,e,n,r,s){let i=e.href,o=e.title||null,a=t[1].replace(s.other.outputLinkReplace,"$1");r.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:o,text:a,tokens:r.inlineTokens(a)};return r.state.inLink=!1,l}function rp(t,e,n){let r=t.match(n.other.indentCodeCompensation);if(r===null)return e;let s=r[1];return e.split(`
`).map(i=>{let o=i.match(n.other.beginningSpace);if(o===null)return i;let[a]=o;return a.length>=s.length?i.slice(s.length):i}).join(`
`)}var as=class{constructor(t){he(this,"options");he(this,"rules");he(this,"lexer");this.options=t||mn}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=this.options.pedantic?e[0]:bl(e[0]),r=n.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:n,codeBlockStyle:"indented",text:r}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],r=rp(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let r=on(n,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(n=r.trim())}return{type:"heading",raw:on(e[0],`
`),depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:on(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=on(e[0],`
`).split(`
`),r="",s="",i=[];for(;n.length>0;){let o=!1,a=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))a.push(n[l]),o=!0;else if(!o)a.push(n[l]);else break;n=n.slice(l);let c=a.join(`
`),f=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${c}`:c,s=s?`${s}
${f}`:f;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,i,!0),this.lexer.state.top=d,n.length===0)break;let y=i.at(-1);if(y?.type==="code")break;if(y?.type==="blockquote"){let S=y,I=S.raw+`
`+n.join(`
`),N=this.blockquote(I);i[i.length-1]=N,r=r.substring(0,r.length-S.raw.length)+N.raw,s=s.substring(0,s.length-S.text.length)+N.text;break}else if(y?.type==="list"){let S=y,I=S.raw+`
`+n.join(`
`),N=this.list(I);i[i.length-1]=N,r=r.substring(0,r.length-y.raw.length)+N.raw,s=s.substring(0,s.length-S.raw.length)+N.raw,n=I.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:s}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),r=n.length>1,s={type:"list",raw:"",ordered:r,start:r?+n.slice(0,-1):"",loose:!1,items:[]};n=r?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=r?n:"[*+-]");let i=this.rules.other.listItemRegex(n),o=!1;for(;t;){let l=!1,c="",f="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;c=e[0],t=t.substring(c.length);let d=np(e[2].split(`
`,1)[0],e[1].length),y=t.split(`
`,1)[0],S=!d.trim(),I=0;if(this.options.pedantic?(I=2,f=d.trimStart()):S?I=e[1].length+1:(I=d.search(this.rules.other.nonSpaceChar),I=I>4?1:I,f=d.slice(I),I+=e[1].length),S&&this.rules.other.blankLine.test(y)&&(c+=y+`
`,t=t.substring(y.length+1),l=!0),!l){let N=this.rules.other.nextBulletRegex(I),le=this.rules.other.hrRegex(I),X=this.rules.other.fencesBeginRegex(I),H=this.rules.other.headingBeginRegex(I),Y=this.rules.other.htmlBeginRegex(I),O=this.rules.other.blockquoteBeginRegex(I);for(;t;){let ee=t.split(`
`,1)[0],ke;if(y=ee,this.options.pedantic?(y=y.replace(this.rules.other.listReplaceNesting,"  "),ke=y):ke=y.replace(this.rules.other.tabCharGlobal,"    "),X.test(y)||H.test(y)||Y.test(y)||O.test(y)||N.test(y)||le.test(y))break;if(ke.search(this.rules.other.nonSpaceChar)>=I||!y.trim())f+=`
`+ke.slice(I);else{if(S||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||X.test(d)||H.test(d)||le.test(d))break;f+=`
`+y}S=!y.trim(),c+=ee+`
`,t=t.substring(ee.length+1),d=ke.slice(I)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(o=!0)),s.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(f),loose:!1,text:f,tokens:[]}),s.raw+=c}let a=s.items.at(-1);if(a)a.raw=a.raw.trimEnd(),a.text=a.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let l of s.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let f=this.lexer.inlineQueue.length-1;f>=0;f--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)){this.lexer.inlineQueue[f].src=this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask,"");break}}let c=this.rules.other.listTaskCheckbox.exec(l.raw);if(c){let f={type:"checkbox",raw:c[0]+" ",checked:c[0]!=="[ ]"};l.checked=f.checked,s.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=f.raw+l.tokens[0].raw,l.tokens[0].text=f.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(f)):l.tokens.unshift({type:"paragraph",raw:f.raw,text:f.raw,tokens:[f]}):l.tokens.unshift(f)}}if(!s.loose){let c=l.tokens.filter(d=>d.type==="space"),f=c.length>0&&c.some(d=>this.rules.other.anyLine.test(d.raw));s.loose=f}}if(s.loose)for(let l of s.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return s}}html(t){let e=this.rules.block.html.exec(t);if(e){let n=bl(e[0]);return{type:"html",block:!0,raw:n,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:n}}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:on(e[0],`
`),href:r,title:s}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=ml(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:on(e[0],`
`),header:[],align:[],rows:[]};if(n.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<n.length;o++)i.header.push({text:n[o],tokens:this.lexer.inline(n[o]),header:!0,align:i.align[o]});for(let o of s)i.rows.push(ml(o,i.header.length).map((a,l)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e){let n=e[1].trim();return{type:"heading",raw:on(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:n,tokens:this.lexer.inline(n)}}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=on(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=tp(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],s="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],s=i[3])}else s=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?r=r.slice(1):r=r.slice(1,-1)),yl(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let r=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=e[r.toLowerCase()];if(!s){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return yl(n,s,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let r=this.rules.inline.emStrongLDelim.exec(t);if(!(!r||!r[1]&&!r[2]&&!r[3]&&!r[4]||r[4]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[3])||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=0,c=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,e=e.slice(-1*t.length+s);(r=c.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(o=[...i].length,r[3]||r[4]){a+=o;continue}else if((r[5]||r[6])&&s%3&&!((s+o)%3)){l+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a+l);let f=[...r[0]][0].length,d=t.slice(0,s+r.index+f+o);if(Math.min(s,o)%2){let S=d.slice(1,-1);return{type:"em",raw:d,text:S,tokens:this.lexer.inlineTokens(S)}}let y=d.slice(2,-2);return{type:"strong",raw:d,text:y,tokens:this.lexer.inlineTokens(y)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return r&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let r=this.rules.inline.delLDelim.exec(t);if(r&&(!r[1]||!n||this.rules.inline.punctuation.exec(n))){let s=[...r[0]].length-1,i,o,a=s,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+s);(r=l.exec(e))!==null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i||(o=[...i].length,o!==s))continue;if(r[3]||r[4]){a+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a);let c=[...r[0]][0].length,f=t.slice(0,s+r.index+c+o),d=f.slice(s,-s);return{type:"del",raw:f,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,r;return e[2]==="@"?(n=e[1],r="mailto:"+n):(n=e[1],r=n),{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,r;if(e[2]==="@")n=e[0],r="mailto:"+n;else{let s;do s=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(s!==e[0]);n=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:n,href:r,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},St=class Hi{constructor(e){he(this,"tokens");he(this,"options");he(this,"state");he(this,"inlineQueue");he(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||mn,this.options.tokenizer=this.options.tokenizer||new as,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:ze,block:os.normal,inline:lr.normal};this.options.pedantic?(n.block=os.pedantic,n.inline=lr.pedantic):this.options.gfm&&(n.block=os.gfm,this.options.breaks?n.inline=lr.breaks:n.inline=lr.gfm),this.tokenizer.rules=n}static get rules(){return{block:os,inline:lr}}static lex(e,n){return new Hi(n).lex(e)}static lexInline(e,n){return new Hi(n).inlineTokens(e)}lex(e){e=e.replace(ze.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let r=this.inlineQueue[n];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],r=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(ze.tabCharGlobal,"    ").replace(ze.spaceLine,""));let s=1/0;for(;e;){if(e.length<s)s=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(a=>(i=a.call({lexer:this},e,n))?(e=e.substring(i.raw.length),n.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let a=n.at(-1);i.raw.length===1&&a!==void 0?a.raw+=`
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
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){this.tokenizer.lexer=this;let r=e,s=null;if(this.tokens.links){let c=Object.keys(this.tokens.links);if(c.length>0)for(;(s=this.tokenizer.rules.inline.reflinkSearch.exec(r))!==null;)c.includes(s[0].slice(s[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,s.index)+"["+"a".repeat(s[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(s=this.tokenizer.rules.inline.anyPunctuation.exec(r))!==null;)r=r.slice(0,s.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(s=this.tokenizer.rules.inline.blockSkip.exec(r))!==null;)i=s[2]?s[2].length:0,r=r.slice(0,s.index+i)+"["+"a".repeat(s[0].length-i-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let o=!1,a="",l=1/0;for(;e;){if(e.length<l)l=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}o||(a=""),o=!1;let c;if(this.options.extensions?.inline?.some(d=>(c=d.call({lexer:this},e,n))?(e=e.substring(c.raw.length),n.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);let d=n.at(-1);c.type==="text"&&d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):n.push(c);continue}if(c=this.tokenizer.emStrong(e,r,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.del(e,r,a)){e=e.substring(c.raw.length),n.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),n.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),n.push(c);continue}let f=e;if(this.options.extensions?.startInline){let d=1/0,y=e.slice(1),S;this.options.extensions.startInline.forEach(I=>{S=I.call({lexer:this},y),typeof S=="number"&&S>=0&&(d=Math.min(d,S))}),d<1/0&&d>=0&&(f=e.substring(0,d+1))}if(c=this.tokenizer.inlineText(f)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(a=c.raw.slice(-1)),o=!0;let d=n.at(-1);d?.type==="text"?(d.raw+=c.raw,d.text+=c.text):n.push(c);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return n}infiniteLoopError(e){let n="Infinite loop on byte: "+e;if(this.options.silent)console.error(n);else throw new Error(n)}},ls=class{constructor(t){he(this,"options");he(this,"parser");this.options=t||mn}space(t){return""}code({text:t,lang:e,escaped:n}){let r=(e||"").match(ze.notSpaceStart)?.[0],s=t.replace(ze.endingNewline,"")+`
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Ut(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let r=this.parser.parseInline(n),s=gl(t);if(s===null)return r;t=s;let i='<a href="'+t+'"';return e&&(i+=' title="'+Ut(e)+'"'),i+=">"+r+"</a>",i}image({href:t,title:e,text:n,tokens:r}){r&&(n=this.parser.parseInline(r,this.parser.textRenderer));let s=gl(t);if(s===null)return Ut(n);t=s;let i=`<img src="${t}" alt="${Ut(n)}"`;return e&&(i+=` title="${Ut(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Ut(t.text)}},Ti=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Et=class ji{constructor(e){he(this,"options");he(this,"renderer");he(this,"textRenderer");this.options=e||mn,this.options.renderer=this.options.renderer||new ls,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ti}static parse(e,n){return new ji(n).parse(e)}static parseInline(e,n){return new ji(n).parseInline(e)}parse(e){this.renderer.parser=this;let n="";for(let r=0;r<e.length;r++){let s=e[r];if(this.options.extensions?.renderers?.[s.type]){let o=s,a=this.options.extensions.renderers[o.type].call({parser:this},o);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){n+=a||"";continue}}let i=s;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return n}parseInline(e,n=this.renderer){this.renderer.parser=this;let r="";for(let s=0;s<e.length;s++){let i=e[s];if(this.options.extensions?.renderers?.[i.type]){let a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){r+=a||"";continue}}let o=i;switch(o.type){case"escape":{r+=n.text(o);break}case"html":{r+=n.html(o);break}case"link":{r+=n.link(o);break}case"image":{r+=n.image(o);break}case"checkbox":{r+=n.checkbox(o);break}case"strong":{r+=n.strong(o);break}case"em":{r+=n.em(o);break}case"codespan":{r+=n.codespan(o);break}case"br":{r+=n.br(o);break}case"del":{r+=n.del(o);break}case"text":{r+=n.text(o);break}default:{let a='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}},cr=(fs=class{constructor(t){he(this,"options");he(this,"block");this.options=t||mn}preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(t=this.block){return t?St.lex:St.lexInline}provideParser(t=this.block){return t?Et.parse:Et.parseInline}},he(fs,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),he(fs,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),fs),sp=class{constructor(...t){he(this,"defaults",gi());he(this,"options",this.setOptions);he(this,"parse",this.parseMarkdown(!0));he(this,"parseInline",this.parseMarkdown(!1));he(this,"Parser",Et);he(this,"Renderer",ls);he(this,"TextRenderer",Ti);he(this,"Lexer",St);he(this,"Tokenizer",as);he(this,"Hooks",cr);this.use(...t)}walkTokens(t,e){let n=[];for(let r of t)switch(n=n.concat(e.call(this,r)),r.type){case"table":{let s=r;for(let i of s.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of s.rows)for(let o of i)n=n.concat(this.walkTokens(o.tokens,e));break}case"list":{let s=r;n=n.concat(this.walkTokens(s.items,e));break}default:{let s=r;this.defaults.extensions?.childTokens?.[s.type]?this.defaults.extensions.childTokens[s.type].forEach(i=>{let o=s[i].flat(1/0);n=n.concat(this.walkTokens(o,e))}):s.tokens&&(n=n.concat(this.walkTokens(s.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let r={...n};if(r.async=this.defaults.async||r.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){let i=e.renderers[s.name];i?e.renderers[s.name]=function(...o){let a=s.renderer.apply(this,o);return a===!1&&(a=i.apply(this,o)),a}:e.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[s.level];i?i.unshift(s.tokenizer):e[s.level]=[s.tokenizer],s.start&&(s.level==="block"?e.startBlock?e.startBlock.push(s.start):e.startBlock=[s.start]:s.level==="inline"&&(e.startInline?e.startInline.push(s.start):e.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(e.childTokens[s.name]=s.childTokens)}),r.extensions=e),n.renderer){let s=this.defaults.renderer||new ls(this.defaults);for(let i in n.renderer){if(!(i in s))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,a=n.renderer[o],l=s[o];s[o]=(...c)=>{let f=a.apply(s,c);return f===!1&&(f=l.apply(s,c)),f||""}}r.renderer=s}if(n.tokenizer){let s=this.defaults.tokenizer||new as(this.defaults);for(let i in n.tokenizer){if(!(i in s))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,a=n.tokenizer[o],l=s[o];s[o]=(...c)=>{let f=a.apply(s,c);return f===!1&&(f=l.apply(s,c)),f}}r.tokenizer=s}if(n.hooks){let s=this.defaults.hooks||new cr;for(let i in n.hooks){if(!(i in s))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,a=n.hooks[o],l=s[o];cr.passThroughHooks.has(i)?s[o]=c=>{if(this.defaults.async&&cr.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await a.call(s,c);return l.call(s,d)})();let f=a.call(s,c);return l.call(s,f)}:s[o]=(...c)=>{if(this.defaults.async)return(async()=>{let d=await a.apply(s,c);return d===!1&&(d=await l.apply(s,c)),d})();let f=a.apply(s,c);return f===!1&&(f=l.apply(s,c)),f}}r.hooks=s}if(n.walkTokens){let s=this.defaults.walkTokens,i=n.walkTokens;r.walkTokens=function(o){let a=[];return a.push(i.call(this,o)),s&&(a=a.concat(s.call(this,o))),a}}this.defaults={...this.defaults,...r}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return St.lex(t,e??this.defaults)}parser(t,e){return Et.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let r={...n},s={...this.defaults,...r},i=this.onError(!!s.silent,!!s.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=t),s.async)return(async()=>{let o=s.hooks?await s.hooks.preprocess(e):e,a=await(s.hooks?await s.hooks.provideLexer(t):t?St.lex:St.lexInline)(o,s),l=s.hooks?await s.hooks.processAllTokens(a):a;s.walkTokens&&await Promise.all(this.walkTokens(l,s.walkTokens));let c=await(s.hooks?await s.hooks.provideParser(t):t?Et.parse:Et.parseInline)(l,s);return s.hooks?await s.hooks.postprocess(c):c})().catch(i);try{s.hooks&&(e=s.hooks.preprocess(e));let o=(s.hooks?s.hooks.provideLexer(t):t?St.lex:St.lexInline)(e,s);s.hooks&&(o=s.hooks.processAllTokens(o)),s.walkTokens&&this.walkTokens(o,s.walkTokens);let a=(s.hooks?s.hooks.provideParser(t):t?Et.parse:Et.parseInline)(o,s);return s.hooks&&(a=s.hooks.postprocess(a)),a}catch(o){return i(o)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let r="<p>An error occurred:</p><pre>"+Ut(n.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(n);throw n}}},yn=new sp;function ie(t,e){return yn.parse(t,e)}ie.options=ie.setOptions=function(t){return yn.setOptions(t),ie.defaults=yn.defaults,nl(ie.defaults),ie},ie.getDefaults=gi,ie.defaults=mn,ie.use=function(...t){return yn.use(...t),ie.defaults=yn.defaults,nl(ie.defaults),ie},ie.walkTokens=function(t,e){return yn.walkTokens(t,e)},ie.parseInline=yn.parseInline,ie.Parser=Et,ie.parser=Et.parse,ie.Renderer=ls,ie.TextRenderer=Ti,ie.Lexer=St,ie.lexer=St.lex,ie.Tokenizer=as,ie.Hooks=cr,ie.parse=ie,ie.options,ie.setOptions,ie.use,ie.walkTokens,ie.parseInline,Et.parse,St.lex;/*! @license DOMPurify 3.4.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.0/LICENSE */const{entries:wl,setPrototypeOf:xl,isFrozen:ip,getPrototypeOf:op,getOwnPropertyDescriptor:ap}=Object;let{freeze:Ve,seal:yt,create:ur}=Object,{apply:Si,construct:Ei}=typeof Reflect<"u"&&Reflect;Ve||(Ve=function(e){return e}),yt||(yt=function(e){return e}),Si||(Si=function(e,n){for(var r=arguments.length,s=new Array(r>2?r-2:0),i=2;i<r;i++)s[i-2]=arguments[i];return e.apply(n,s)}),Ei||(Ei=function(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return new e(...r)});const fr=Ke(Array.prototype.forEach),lp=Ke(Array.prototype.lastIndexOf),vl=Ke(Array.prototype.pop),hr=Ke(Array.prototype.push),cp=Ke(Array.prototype.splice),cs=Ke(String.prototype.toLowerCase),Ai=Ke(String.prototype.toString),Ri=Ke(String.prototype.match),Pn=Ke(String.prototype.replace),up=Ke(String.prototype.indexOf),fp=Ke(String.prototype.trim),At=Ke(Object.prototype.hasOwnProperty),We=Ke(RegExp.prototype.test),pr=hp(TypeError);function Ke(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var n=arguments.length,r=new Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return Si(t,e,r)}}function hp(t){return function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return Ei(t,n)}}function W(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:cs;xl&&xl(t,null);let r=e.length;for(;r--;){let s=e[r];if(typeof s=="string"){const i=n(s);i!==s&&(ip(e)||(e[r]=i),s=i)}t[s]=!0}return t}function pp(t){for(let e=0;e<t.length;e++)At(t,e)||(t[e]=null);return t}function Ht(t){const e=ur(null);for(const[n,r]of wl(t))At(t,n)&&(Array.isArray(r)?e[n]=pp(r):r&&typeof r=="object"&&r.constructor===Object?e[n]=Ht(r):e[n]=r);return e}function dr(t,e){for(;t!==null;){const r=ap(t,e);if(r){if(r.get)return Ke(r.get);if(typeof r.value=="function")return Ke(r.value)}t=op(t)}function n(){return null}return n}const _l=Ve(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Ci=Ve(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Oi=Ve(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),dp=Ve(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ii=Ve(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),gp=Ve(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),kl=Ve(["#text"]),Tl=Ve(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Li=Ve(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Sl=Ve(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),us=Ve(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),mp=yt(/\{\{[\w\W]*|[\w\W]*\}\}/gm),bp=yt(/<%[\w\W]*|[\w\W]*%>/gm),yp=yt(/\$\{[\w\W]*/gm),wp=yt(/^data-[\-\w.\u00B7-\uFFFF]+$/),xp=yt(/^aria-[\-\w]+$/),El=yt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),vp=yt(/^(?:\w+script|data):/i),_p=yt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Al=yt(/^html$/i),kp=yt(/^[a-z][.\w]*(-[.\w]+)+$/i);var Rl=Object.freeze({__proto__:null,ARIA_ATTR:xp,ATTR_WHITESPACE:_p,CUSTOM_ELEMENT:kp,DATA_ATTR:wp,DOCTYPE_NAME:Al,ERB_EXPR:bp,IS_ALLOWED_URI:El,IS_SCRIPT_OR_DATA:vp,MUSTACHE_EXPR:mp,TMPLIT_EXPR:yp});const gr={element:1,text:3,progressingInstruction:7,comment:8,document:9},Tp=function(){return typeof window>"u"?null:window},Sp=function(e,n){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null;const s="data-tt-policy-suffix";n&&n.hasAttribute(s)&&(r=n.getAttribute(s));const i="dompurify"+(r?"#"+r:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Cl=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Ol(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Tp();const e=B=>Ol(B);if(e.version="3.4.0",e.removed=[],!t||!t.document||t.document.nodeType!==gr.document||!t.Element)return e.isSupported=!1,e;let{document:n}=t;const r=n,s=r.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:a,Element:l,NodeFilter:c,NamedNodeMap:f=t.NamedNodeMap||t.MozNamedAttrMap,HTMLFormElement:d,DOMParser:y,trustedTypes:S}=t,I=l.prototype,N=dr(I,"cloneNode"),le=dr(I,"remove"),X=dr(I,"nextSibling"),H=dr(I,"childNodes"),Y=dr(I,"parentNode");if(typeof o=="function"){const B=n.createElement("template");B.content&&B.content.ownerDocument&&(n=B.content.ownerDocument)}let O,ee="";const{implementation:ke,createNodeIterator:Ge,createDocumentFragment:ft,getElementsByTagName:ht}=n,{importNode:Ye}=r;let be=Cl();e.isSupported=typeof wl=="function"&&typeof Y=="function"&&ke&&ke.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:Qe,ERB_EXPR:et,TMPLIT_EXPR:Le,DATA_ATTR:tt,ARIA_ATTR:Ae,IS_SCRIPT_OR_DATA:ce,ATTR_WHITESPACE:se,CUSTOM_ELEMENT:nt}=Rl;let{IS_ALLOWED_URI:Jt}=Rl,ue=null;const Te=W({},[..._l,...Ci,...Oi,...Ii,...kl]);let ge=null;const an=W({},[...Tl,...Li,...Sl,...us]);let oe=Object.seal(ur(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Be=null,rt=null;const Ce=Object.seal(ur(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let st=!0,it=!0,Qt=!1,u=!0,p=!1,g=!0,m=!1,b=!1,w=!1,A=!1,E=!1,T=!1,v=!0,D=!1;const C="user-content-";let M=!0,z=!1,j={},V=null;const te=W({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let me=null;const xe=W({},["audio","video","img","source","image","track"]);let Pe=null;const Fe=W({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ot="http://www.w3.org/1998/Math/MathML",en="http://www.w3.org/2000/svg",de="http://www.w3.org/1999/xhtml";let Re=de,ln=!1,cn=null;const Mn=W({},[ot,en,de],Ai);let Dn=W({},["mi","mo","mn","ms","mtext"]),zn=W({},["annotation-xml"]);const zi=W({},["title","style","font","a","script"]);let wn=null;const Bi=["application/xhtml+xml","text/html"],x="text/html";let k=null,R=null;const ve=n.createElement("form"),fe=function(h){return h instanceof RegExp||h instanceof Function},P=function(){let h=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(R&&R===h)){if((!h||typeof h!="object")&&(h={}),h=Ht(h),wn=Bi.indexOf(h.PARSER_MEDIA_TYPE)===-1?x:h.PARSER_MEDIA_TYPE,k=wn==="application/xhtml+xml"?Ai:cs,ue=At(h,"ALLOWED_TAGS")?W({},h.ALLOWED_TAGS,k):Te,ge=At(h,"ALLOWED_ATTR")?W({},h.ALLOWED_ATTR,k):an,cn=At(h,"ALLOWED_NAMESPACES")?W({},h.ALLOWED_NAMESPACES,Ai):Mn,Pe=At(h,"ADD_URI_SAFE_ATTR")?W(Ht(Fe),h.ADD_URI_SAFE_ATTR,k):Fe,me=At(h,"ADD_DATA_URI_TAGS")?W(Ht(xe),h.ADD_DATA_URI_TAGS,k):xe,V=At(h,"FORBID_CONTENTS")?W({},h.FORBID_CONTENTS,k):te,Be=At(h,"FORBID_TAGS")?W({},h.FORBID_TAGS,k):Ht({}),rt=At(h,"FORBID_ATTR")?W({},h.FORBID_ATTR,k):Ht({}),j=At(h,"USE_PROFILES")?h.USE_PROFILES:!1,st=h.ALLOW_ARIA_ATTR!==!1,it=h.ALLOW_DATA_ATTR!==!1,Qt=h.ALLOW_UNKNOWN_PROTOCOLS||!1,u=h.ALLOW_SELF_CLOSE_IN_ATTR!==!1,p=h.SAFE_FOR_TEMPLATES||!1,g=h.SAFE_FOR_XML!==!1,m=h.WHOLE_DOCUMENT||!1,A=h.RETURN_DOM||!1,E=h.RETURN_DOM_FRAGMENT||!1,T=h.RETURN_TRUSTED_TYPE||!1,w=h.FORCE_BODY||!1,v=h.SANITIZE_DOM!==!1,D=h.SANITIZE_NAMED_PROPS||!1,M=h.KEEP_CONTENT!==!1,z=h.IN_PLACE||!1,Jt=h.ALLOWED_URI_REGEXP||El,Re=h.NAMESPACE||de,Dn=h.MATHML_TEXT_INTEGRATION_POINTS||Dn,zn=h.HTML_INTEGRATION_POINTS||zn,oe=h.CUSTOM_ELEMENT_HANDLING||ur(null),h.CUSTOM_ELEMENT_HANDLING&&fe(h.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(oe.tagNameCheck=h.CUSTOM_ELEMENT_HANDLING.tagNameCheck),h.CUSTOM_ELEMENT_HANDLING&&fe(h.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(oe.attributeNameCheck=h.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),h.CUSTOM_ELEMENT_HANDLING&&typeof h.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(oe.allowCustomizedBuiltInElements=h.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),p&&(it=!1),E&&(A=!0),j&&(ue=W({},kl),ge=ur(null),j.html===!0&&(W(ue,_l),W(ge,Tl)),j.svg===!0&&(W(ue,Ci),W(ge,Li),W(ge,us)),j.svgFilters===!0&&(W(ue,Oi),W(ge,Li),W(ge,us)),j.mathMl===!0&&(W(ue,Ii),W(ge,Sl),W(ge,us))),Ce.tagCheck=null,Ce.attributeCheck=null,h.ADD_TAGS&&(typeof h.ADD_TAGS=="function"?Ce.tagCheck=h.ADD_TAGS:(ue===Te&&(ue=Ht(ue)),W(ue,h.ADD_TAGS,k))),h.ADD_ATTR&&(typeof h.ADD_ATTR=="function"?Ce.attributeCheck=h.ADD_ATTR:(ge===an&&(ge=Ht(ge)),W(ge,h.ADD_ATTR,k))),h.ADD_URI_SAFE_ATTR&&W(Pe,h.ADD_URI_SAFE_ATTR,k),h.FORBID_CONTENTS&&(V===te&&(V=Ht(V)),W(V,h.FORBID_CONTENTS,k)),h.ADD_FORBID_CONTENTS&&(V===te&&(V=Ht(V)),W(V,h.ADD_FORBID_CONTENTS,k)),M&&(ue["#text"]=!0),m&&W(ue,["html","head","body"]),ue.table&&(W(ue,["tbody"]),delete Be.tbody),h.TRUSTED_TYPES_POLICY){if(typeof h.TRUSTED_TYPES_POLICY.createHTML!="function")throw pr('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof h.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw pr('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');O=h.TRUSTED_TYPES_POLICY,ee=O.createHTML("")}else O===void 0&&(O=Sp(S,s)),O!==null&&typeof ee=="string"&&(ee=O.createHTML(""));Ve&&Ve(h),R=h}},jt=W({},[...Ci,...Oi,...dp]),pt=W({},[...Ii,...gp]),Bn=function(h){let _=Y(h);(!_||!_.tagName)&&(_={namespaceURI:Re,tagName:"template"});const L=cs(h.tagName),ye=cs(_.tagName);return cn[h.namespaceURI]?h.namespaceURI===en?_.namespaceURI===de?L==="svg":_.namespaceURI===ot?L==="svg"&&(ye==="annotation-xml"||Dn[ye]):!!jt[L]:h.namespaceURI===ot?_.namespaceURI===de?L==="math":_.namespaceURI===en?L==="math"&&zn[ye]:!!pt[L]:h.namespaceURI===de?_.namespaceURI===en&&!zn[ye]||_.namespaceURI===ot&&!Dn[ye]?!1:!pt[L]&&(zi[L]||!jt[L]):!!(wn==="application/xhtml+xml"&&cn[h.namespaceURI]):!1},Ne=function(h){hr(e.removed,{element:h});try{Y(h).removeChild(h)}catch{le(h)}},wt=function(h,_){try{hr(e.removed,{attribute:_.getAttributeNode(h),from:_})}catch{hr(e.removed,{attribute:null,from:_})}if(_.removeAttribute(h),h==="is")if(A||E)try{Ne(_)}catch{}else try{_.setAttribute(h,"")}catch{}},Fi=function(h){let _=null,L=null;if(w)h="<remove></remove>"+h;else{const Ee=Ri(h,/^[\r\n\t ]+/);L=Ee&&Ee[0]}wn==="application/xhtml+xml"&&Re===de&&(h='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+h+"</body></html>");const ye=O?O.createHTML(h):h;if(Re===de)try{_=new y().parseFromString(ye,wn)}catch{}if(!_||!_.documentElement){_=ke.createDocument(Re,"template",null);try{_.documentElement.innerHTML=ln?ee:ye}catch{}}const $e=_.body||_.documentElement;return h&&L&&$e.insertBefore(n.createTextNode(L),$e.childNodes[0]||null),Re===de?ht.call(_,m?"html":"body")[0]:m?_.documentElement:$e},br=function(h){return Ge.call(h.ownerDocument||h,h,c.SHOW_ELEMENT|c.SHOW_COMMENT|c.SHOW_TEXT|c.SHOW_PROCESSING_INSTRUCTION|c.SHOW_CDATA_SECTION,null)},yr=function(h){return h instanceof d&&(typeof h.nodeName!="string"||typeof h.textContent!="string"||typeof h.removeChild!="function"||!(h.attributes instanceof f)||typeof h.removeAttribute!="function"||typeof h.setAttribute!="function"||typeof h.namespaceURI!="string"||typeof h.insertBefore!="function"||typeof h.hasChildNodes!="function")},$i=function(h){return typeof a=="function"&&h instanceof a};function tn(B,h,_){fr(B,L=>{L.call(e,h,_,R)})}const Fl=function(h){let _=null;if(tn(be.beforeSanitizeElements,h,null),yr(h))return Ne(h),!0;const L=k(h.nodeName);if(tn(be.uponSanitizeElement,h,{tagName:L,allowedTags:ue}),g&&h.hasChildNodes()&&!$i(h.firstElementChild)&&We(/<[/\w!]/g,h.innerHTML)&&We(/<[/\w!]/g,h.textContent)||g&&h.namespaceURI===de&&L==="style"&&$i(h.firstElementChild)||h.nodeType===gr.progressingInstruction||g&&h.nodeType===gr.comment&&We(/<[/\w]/g,h.data))return Ne(h),!0;if(Be[L]||!(Ce.tagCheck instanceof Function&&Ce.tagCheck(L))&&!ue[L]){if(!Be[L]&&Ul(L)&&(oe.tagNameCheck instanceof RegExp&&We(oe.tagNameCheck,L)||oe.tagNameCheck instanceof Function&&oe.tagNameCheck(L)))return!1;if(M&&!V[L]){const ye=Y(h)||h.parentNode,$e=H(h)||h.childNodes;if($e&&ye){const Ee=$e.length;for(let at=Ee-1;at>=0;--at){const dt=N($e[at],!0);dt.__removalCount=(h.__removalCount||0)+1,ye.insertBefore(dt,X(h))}}}return Ne(h),!0}return h instanceof l&&!Bn(h)||(L==="noscript"||L==="noembed"||L==="noframes")&&We(/<\/no(script|embed|frames)/i,h.innerHTML)?(Ne(h),!0):(p&&h.nodeType===gr.text&&(_=h.textContent,fr([Qe,et,Le],ye=>{_=Pn(_,ye," ")}),h.textContent!==_&&(hr(e.removed,{element:h.cloneNode()}),h.textContent=_)),tn(be.afterSanitizeElements,h,null),!1)},$l=function(h,_,L){if(rt[_]||v&&(_==="id"||_==="name")&&(L in n||L in ve))return!1;if(!(it&&!rt[_]&&We(tt,_))){if(!(st&&We(Ae,_))){if(!(Ce.attributeCheck instanceof Function&&Ce.attributeCheck(_,h))){if(!ge[_]||rt[_]){if(!(Ul(h)&&(oe.tagNameCheck instanceof RegExp&&We(oe.tagNameCheck,h)||oe.tagNameCheck instanceof Function&&oe.tagNameCheck(h))&&(oe.attributeNameCheck instanceof RegExp&&We(oe.attributeNameCheck,_)||oe.attributeNameCheck instanceof Function&&oe.attributeNameCheck(_,h))||_==="is"&&oe.allowCustomizedBuiltInElements&&(oe.tagNameCheck instanceof RegExp&&We(oe.tagNameCheck,L)||oe.tagNameCheck instanceof Function&&oe.tagNameCheck(L))))return!1}else if(!Pe[_]){if(!We(Jt,Pn(L,se,""))){if(!((_==="src"||_==="xlink:href"||_==="href")&&h!=="script"&&up(L,"data:")===0&&me[h])){if(!(Qt&&!We(ce,Pn(L,se,"")))){if(L)return!1}}}}}}}return!0},Ul=function(h){return h!=="annotation-xml"&&Ri(h,nt)},Hl=function(h){tn(be.beforeSanitizeAttributes,h,null);const{attributes:_}=h;if(!_||yr(h))return;const L={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:ge,forceKeepAttr:void 0};let ye=_.length;for(;ye--;){const $e=_[ye],{name:Ee,namespaceURI:at,value:dt}=$e,un=k(Ee),Ui=dt;let Me=Ee==="value"?Ui:fp(Ui);if(L.attrName=un,L.attrValue=Me,L.keepAttr=!0,L.forceKeepAttr=void 0,tn(be.uponSanitizeAttribute,h,L),Me=L.attrValue,D&&(un==="id"||un==="name")&&(wt(Ee,h),Me=C+Me),g&&We(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,Me)){wt(Ee,h);continue}if(un==="attributename"&&Ri(Me,"href")){wt(Ee,h);continue}if(L.forceKeepAttr)continue;if(!L.keepAttr){wt(Ee,h);continue}if(!u&&We(/\/>/i,Me)){wt(Ee,h);continue}p&&fr([Qe,et,Le],Vl=>{Me=Pn(Me,Vl," ")});const ql=k(h.nodeName);if(!$l(ql,un,Me)){wt(Ee,h);continue}if(O&&typeof S=="object"&&typeof S.getAttributeType=="function"&&!at)switch(S.getAttributeType(ql,un)){case"TrustedHTML":{Me=O.createHTML(Me);break}case"TrustedScriptURL":{Me=O.createScriptURL(Me);break}}if(Me!==Ui)try{at?h.setAttributeNS(at,Ee,Me):h.setAttribute(Ee,Me),yr(h)?Ne(h):vl(e.removed)}catch{wt(Ee,h)}}tn(be.afterSanitizeAttributes,h,null)},jl=function(h){let _=null;const L=br(h);for(tn(be.beforeSanitizeShadowDOM,h,null);_=L.nextNode();)tn(be.uponSanitizeShadowNode,_,null),Fl(_),Hl(_),_.content instanceof i&&jl(_.content);tn(be.afterSanitizeShadowDOM,h,null)};return e.sanitize=function(B){let h=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},_=null,L=null,ye=null,$e=null;if(ln=!B,ln&&(B="<!-->"),typeof B!="string"&&!$i(B))if(typeof B.toString=="function"){if(B=B.toString(),typeof B!="string")throw pr("dirty is not a string, aborting")}else throw pr("toString is not a function");if(!e.isSupported)return B;if(b||P(h),e.removed=[],typeof B=="string"&&(z=!1),z){if(B.nodeName){const dt=k(B.nodeName);if(!ue[dt]||Be[dt])throw pr("root node is forbidden and cannot be sanitized in-place")}}else if(B instanceof a)_=Fi("<!---->"),L=_.ownerDocument.importNode(B,!0),L.nodeType===gr.element&&L.nodeName==="BODY"||L.nodeName==="HTML"?_=L:_.appendChild(L);else{if(!A&&!p&&!m&&B.indexOf("<")===-1)return O&&T?O.createHTML(B):B;if(_=Fi(B),!_)return A?null:T?ee:""}_&&w&&Ne(_.firstChild);const Ee=br(z?B:_);for(;ye=Ee.nextNode();)Fl(ye),Hl(ye),ye.content instanceof i&&jl(ye.content);if(z)return B;if(A){if(p){_.normalize();let dt=_.innerHTML;fr([Qe,et,Le],un=>{dt=Pn(dt,un," ")}),_.innerHTML=dt}if(E)for($e=ft.call(_.ownerDocument);_.firstChild;)$e.appendChild(_.firstChild);else $e=_;return(ge.shadowroot||ge.shadowrootmode)&&($e=Ye.call(r,$e,!0)),$e}let at=m?_.outerHTML:_.innerHTML;return m&&ue["!doctype"]&&_.ownerDocument&&_.ownerDocument.doctype&&_.ownerDocument.doctype.name&&We(Al,_.ownerDocument.doctype.name)&&(at="<!DOCTYPE "+_.ownerDocument.doctype.name+`>
`+at),p&&fr([Qe,et,Le],dt=>{at=Pn(at,dt," ")}),O&&T?O.createHTML(at):at},e.setConfig=function(){let B=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};P(B),b=!0},e.clearConfig=function(){R=null,b=!1},e.isValidAttribute=function(B,h,_){R||P({});const L=k(B),ye=k(h);return $l(L,ye,_)},e.addHook=function(B,h){typeof h=="function"&&hr(be[B],h)},e.removeHook=function(B,h){if(h!==void 0){const _=lp(be[B],h);return _===-1?void 0:cp(be[B],_,1)[0]}return vl(be[B])},e.removeHooks=function(B){be[B]=[]},e.removeAllHooks=function(){be=Cl()},e}var Ep=Ol();ie.setOptions({breaks:!0,gfm:!0});function Pi(t){if(!t)return"";const e=ie.parse(t,{async:!1});return Ep.sanitize(e,{ALLOWED_TAGS:["p","br","strong","b","em","i","code","pre","ul","ol","li","blockquote","a","h1","h2","h3","h4","h5","h6","hr","table","thead","tbody","tr","th","td","del","sup","sub","span"],ALLOWED_ATTR:["href","target","rel","class"]})}const Ni="omnichat_accessToken",Mi="omnichat_refreshToken",Di="omnichat_siteToken";let mr=null,Ap="",Rp=null;function Il(){return localStorage.getItem(Ni)}function Ll(){return localStorage.getItem(Di)}function Pl(){return localStorage.getItem(Mi)}async function Cp(){return mr||(mr=(async()=>{try{const t=Pl();if(!t)return!1;const e=await fetch(`${Ap}/auth/refresh`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:t})});if(!e.ok)return localStorage.removeItem(Ni),localStorage.removeItem(Mi),localStorage.removeItem(Di),Rp?.(),!1;const n=await e.json();return localStorage.setItem(Ni,n.accessToken),localStorage.setItem(Mi,n.refreshToken),localStorage.setItem(Di,n.siteToken),!0}catch{return!1}finally{mr=null}})(),mr)}async function Op(t,e={}){const n=Il(),r=Ll(),s={...e.headers||{}};n&&(s.Authorization=`Bearer ${n}`),r&&(s["x-external-site-token"]=r);const i=e.body!=null;i&&!(e.body instanceof FormData)&&!s["Content-Type"]&&(s["Content-Type"]="application/json");let o=await fetch(t,{...e,headers:s});if(o.status===401&&Pl()&&await Cp()){const l={...e.headers||{}},c=Il(),f=Ll();c&&(l.Authorization=`Bearer ${c}`),f&&(l["x-external-site-token"]=f),i&&!(e.body instanceof FormData)&&!l["Content-Type"]&&(l["Content-Type"]="application/json"),o=await fetch(t,{...e,headers:l})}return o}const Ip="omnichat_translations",Lp=1,Nn="translations",Nl=[{value:"en",label:"English"},{value:"zh-Hans",label:"简体中文"},{value:"zh-Hant",label:"繁體中文"},{value:"ja",label:"日本語"},{value:"ko",label:"한국어"},{value:"fr",label:"Français"},{value:"de",label:"Deutsch"},{value:"it",label:"Italiano"},{value:"es",label:"Español"},{value:"pt",label:"Português"},{value:"nl",label:"Nederlands"},{value:"pl",label:"Polski"},{value:"tr",label:"Türkçe"},{value:"ar",label:"العربية"},{value:"ru",label:"Русский"},{value:"th",label:"ไทย"},{value:"vi",label:"Tiếng Việt"},{value:"id",label:"Bahasa Indonesia"},{value:"ms",label:"Bahasa Melayu"},{value:"hi",label:"हिन्दी"}];function Pp(t){const e=localStorage.getItem(t);if(e)return e;const n=navigator.language||navigator.userLanguage||"",r=n.split("-")[0].toLowerCase();if(r==="zh")return n.toLowerCase().includes("hant")||n.toLowerCase().includes("tw")||n.toLowerCase().includes("hk")?"zh-Hant":"zh-Hans";const s=Nl.find(i=>i.value===r);return s?s.value:"en"}function Ml(){return new Promise((t,e)=>{const n=indexedDB.open(Ip,Lp);n.onupgradeneeded=()=>{const r=n.result;r.objectStoreNames.contains(Nn)||r.createObjectStore(Nn,{keyPath:"id"})},n.onsuccess=()=>t(n.result),n.onerror=()=>e(n.error)})}function Dl(t,e){let n=0;for(let r=0;r<t.length;r++){const s=t.charCodeAt(r);n=(n<<5)-n+s,n|=0}return`${n}:${e}`}async function Np(t,e){try{const n=await Ml(),r=Dl(t,e);return new Promise((s,i)=>{const l=n.transaction(Nn,"readonly").objectStore(Nn).get(r);l.onsuccess=()=>{n.close(),s(l.result?.translatedText||null)},l.onerror=()=>{n.close(),i(l.error)}})}catch{return null}}async function Mp(t,e,n){try{const r=await Ml(),s=Dl(t,e);return new Promise((i,o)=>{const c=r.transaction(Nn,"readwrite").objectStore(Nn).put({id:s,translatedText:n,createdAt:Date.now()});c.onsuccess=()=>{r.close(),i()},c.onerror=()=>{r.close(),o(c.error)}})}catch{}}async function Dp(t,e,n){const r=await Np(e,n);if(r)return r;const s=await Op(`${t}/ai/translate`,{method:"POST",body:JSON.stringify({text:e,targetLanguage:n})});if(!s.ok){const a=await s.text();throw new Error(a||`HTTP ${s.status}`)}const o=(await s.json()).translatedText;if(!o)throw new Error("Translation returned empty result");return await Mp(e,n,o),o}const zp={key:0,style:{"font-size":"12px",opacity:"0.85","margin-top":"2px"}},Bp={style:{display:"flex","align-items":"center",gap:"8px"}},Fp={key:0,style:{position:"relative"}},$p={key:0,style:{position:"absolute",top:"100%",right:"0","margin-top":"6px",background:"white",border:"1px solid #e5e7eb","border-radius":"8px","box-shadow":"0 4px 16px rgba(0,0,0,0.12)","z-index":"100","min-width":"160px","max-height":"260px","overflow-y":"auto",padding:"4px 0"}},Up=["onClick","onMouseleave"],Hp=["title"],jp={key:0,class:"drag-overlay"},qp={key:1,class:"welcome-screen"},Vp={key:0,style:{background:"rgba(254, 226, 226, 0.8)",border:"1px solid #fca5a5",padding:"16px","border-radius":"12px","margin-bottom":"24px","text-align":"center"}},Wp={style:{color:"#7f1d1d","white-space":"pre-wrap","font-size":"14px",margin:"0"}},Kp={class:"pre-chat-form"},Gp={key:0,style:{"flex-shrink":"0",background:"#fef2f2","border-bottom":"1px solid #fecaca",padding:"8px 12px","text-align":"center"}},Yp={style:{color:"#991b1b",margin:"2px 0 0","font-size":"12px"}},Xp={key:0,class:"ai-label"},Zp=["src","onClick"],Jp=["innerHTML"],Qp=["innerHTML"],ed={class:"msg-time"},td=["onClick","disabled","title"],nd={key:1,class:"msg-bubble ai ai-streaming",style:{"align-self":"flex-start"}},rd=["innerHTML"],sd={key:2,class:"typing-hint"},id={key:3,class:"resolved-banner"},od={key:0,class:"review-section"},ad={class:"star-rating"},ld=["onClick"],cd={key:1,class:"review-thank-you"},ud={key:0,class:"confirm-action-area"},fd={key:1,class:"input-area"},hd={key:0,style:{position:"absolute",top:"-32px",left:"12px",right:"12px",background:"#fef2f2",color:"#dc2626","font-size":"11px",padding:"4px 10px","border-radius":"6px",border:"1px solid #fecaca"}},pd=["disabled"],dd=["placeholder","disabled","onKeydown"],gd=["disabled"],md=["src"],zl=200,Bl=gf(Io({__name:"App.ce",props:{serverUrl:{type:String,required:!0},bubbleColor:{type:String,default:"#4F46E5"},welcomeMessage:{type:String,default:"Hello! How can we help you today?"},dataExternalToken:{type:String,default:""}},setup(t){const e=t,n=q(null),r=q(!0),s=q(null),i=q([]),o=q(""),a=q(!1),l=q(""),c=q(!1),f=q(""),d=q(null),y=q(""),S=q(!1),I=q(!1),N=q(!0),le=q(!0);let X=null,H=!1;function Y(){if(!d.value)return!0;const x=d.value;return x.scrollHeight-x.scrollTop-x.clientHeight<80}function O(){H||X||(X=requestAnimationFrame(()=>{Mn(!0),X=null}))}zr(d,(x,k)=>{k&&k.removeEventListener("scroll",T),x&&x.addEventListener("scroll",T,{passive:!0})});const ee=q(""),ke=q(""),Ge=q("We are currently offline. Please check back later."),ft=q(!1),ht=q(localStorage.getItem("omnichat_visitor_muted")==="true"),Ye=q(""),be=q(!0),Qe=q(Pp("omnichat_visitor_translate_lang")),et=q(!1),Le=q(new Set),tt=q({});function Ae(x){Qe.value=x,localStorage.setItem("omnichat_visitor_translate_lang",x)}async function ce(x){if(tt.value[x.id]){delete tt.value[x.id];return}if(Le.value.has(x.id))return;const k=x.content||"";if(k.trim()){Le.value=new Set([...Le.value,x.id]);try{const R=await Dp(e.serverUrl,k,Qe.value);tt.value={...tt.value,[x.id]:R}}catch(R){console.warn("Translation failed:",R.message)}finally{const R=new Set(Le.value);R.delete(x.id),Le.value=R}}}function se(x){le.value&&(!x.content||x.messageType==="image"||tt.value[x.id]||Le.value.has(x.id)||ce(x))}const nt=new Audio;function Jt(){if(!ht.value)if(Ye.value){const x=Ye.value.startsWith("http")?Ye.value:e.serverUrl+Ye.value;nt.src!==x&&(nt.src=x),nt.currentTime=0,nt.play().catch(k=>console.warn("Audio autoplay blocked:",k))}else try{const x=new(window.AudioContext||window.webkitAudioContext),k=x.createOscillator(),R=x.createGain();k.connect(R),R.connect(x.destination),k.type="sine",k.frequency.setValueAtTime(600,x.currentTime),k.frequency.exponentialRampToValueAtTime(100,x.currentTime+.1),R.gain.setValueAtTime(.5,x.currentTime),R.gain.exponentialRampToValueAtTime(.01,x.currentTime+.1),k.start(x.currentTime),k.stop(x.currentTime+.1)}catch(x){console.warn("Synthesized audio failed:",x)}}function ue(){ht.value=!ht.value,localStorage.setItem("omnichat_visitor_muted",ht.value?"true":"false")}const Te=Gs(()=>ee.value||e.bubbleColor),ge=q(""),an=q(""),oe=q(0),Be=q(""),rt=q(!1),Ce=q(!1),st=q(!1),it=q(!1),Qt=q(0),u=q(null),p=q(null),g=q(null),m=q(""),b=q(null);async function w(){const x=e.serverUrl.replace(/\/$/,""),k=localStorage.getItem("omnichat_visitor_id");k&&localStorage.removeItem("omnichat_visitor_id");const R=k||`v_${crypto.randomUUID?.()||Math.random().toString(36).slice(2,10)}`,ve=e.dataExternalToken||window.__OMNICHAT_EXTERNAL_TOKEN__;try{const P={visitorId:R};ve&&(P.externalToken=ve);const pt=await(await fetch(`${x}/auth/visitor`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(P),credentials:"include"})).json();pt.visitorId&&(f.value=pt.visitorId)}catch{}const fe=ns(e.serverUrl,{auth:{visitorId:R,externalToken:ve||void 0},transports:["websocket","polling"],withCredentials:!0});fe.on("connect",()=>{const P=localStorage.getItem("omnichat_conversation_id");P&&(s.value=P,fe.emit("join_conversation",{conversationId:P}))}),fe.on("upload_token",P=>{p.value=P.token}),fe.on("conversation_started",P=>{s.value=P.conversation.id,localStorage.setItem("omnichat_conversation_id",P.conversation.id)}),fe.on("conversation_history",P=>{i.value=P.conversation.messages||[],c.value=P.conversation.status==="resolved",P.conversation.rating&&(rt.value=!0),Gn(()=>Mn())}),fe.on("inactivity_warning",P=>{P.conversationId===s.value&&(i.value.push({id:"sys_"+Date.now(),conversationId:P.conversationId,senderType:"system",content:P.message,createdAt:new Date().toISOString()}),A(),Gn(()=>Mn()))}),fe.on("message_error",P=>{m.value=P.error,setTimeout(()=>m.value="",4e3)}),fe.on("new_message",P=>{P.message.conversationId===s.value&&(P.message.senderType==="ai"&&S.value&&(S.value=!1,y.value="",H=!1),i.value.push(P.message),A(),(P.message.senderType==="agent"||P.message.senderType==="ai")&&Jt(),Gn(()=>{Mn(),r.value&&(P.message.senderType==="agent"||P.message.senderType==="ai")&&n.value?.emit("read_message",{messageId:P.message.id,conversationId:s.value}),(P.message.senderType==="agent"||P.message.senderType==="ai")&&se(P.message)}))}),fe.on("ai_stream",P=>{P.conversationId===s.value&&(P.isComplete||(S.value=!0,y.value+=P.token,O()))}),fe.on("message_read",P=>{const jt=i.value.find(pt=>pt.id===P.messageId);jt&&(jt.readAt=P.readAt)}),fe.on("agent_typing",P=>{P.conversationId===s.value&&(a.value=P.isTyping,l.value=P.user)}),fe.on("ip_blacklisted",P=>{P.conversationId===s.value&&(b.value={reason:P.reason})}),fe.on("conversation_resolved",P=>{P.conversationId===s.value&&(c.value=!0)}),fe.on("error",P=>{console.error("Visitor Error:",P.message),P.message==="Conversation not found"&&(localStorage.removeItem("omnichat_conversation_id"),s.value="",c.value=!1,i.value=[]),P.message==="Failed to resolve conversation"&&(c.value=!0)}),fe.on("disconnect",()=>{}),n.value=fe}function A(){i.value.length>zl&&i.value.splice(0,i.value.length-zl)}function E(x){return x?x.slice(-8).toUpperCase():""}function T(){S.value&&(H=!Y())}function v(x){!s.value||!r.value||(x.preventDefault(),Qt.value++,it.value=!0)}function D(x){!s.value||!r.value||x.preventDefault()}function C(x){!s.value||!r.value||(x.preventDefault(),Qt.value--,Qt.value<=0&&(Qt.value=0,it.value=!1))}function M(x){x.preventDefault(),Qt.value=0,it.value=!1,s.value&&x.dataTransfer?.files&&x.dataTransfer.files.length>0&&Pe(x.dataTransfer.files[0])}function z(x){g.value=x}function j(){g.value=null}function V(){ge.value.trim()||alert("Please provide your name to continue."),n.value?.emit("start_conversation",{visitorId:f.value,visitorName:ge.value.trim(),visitorEmail:an.value.trim(),visitorCurrentUrl:window.location.href,visitorTimezone:Intl.DateTimeFormat().resolvedOptions().timeZone,visitorLanguage:navigator.language,visitorScreenRes:`${window.screen.width}x${window.screen.height}`,visitorReferrer:document.referrer||null,metadata:JSON.stringify({userAgent:navigator.userAgent})})}function te(){u.value?.click()}function me(x,k=1200,R=.8){return new Promise((ve,fe)=>{const P=new FileReader;P.readAsDataURL(x),P.onload=jt=>{const pt=new Image;pt.src=jt.target?.result,pt.onload=()=>{const Bn=document.createElement("canvas");let Ne=pt.width,wt=pt.height;Ne>k&&(wt=Math.round(wt*k/Ne),Ne=k),Bn.width=Ne,Bn.height=wt,Bn.getContext("2d")?.drawImage(pt,0,0,Ne,wt),Bn.toBlob(br=>{if(br){const yr=x.name.replace(/\.[^/.]+$/,"")+".webp";ve(new File([br],yr,{type:"image/webp"}))}else fe(new Error("Canvas to Blob failed"))},"image/webp",R)}},P.onerror=jt=>fe(jt)})}async function xe(x){const k=x.target;!k.files||k.files.length===0||await Pe(k.files[0])}async function Pe(x){x.size>5*1024*1024&&alert("File size exceeds 5MB limit."),st.value=!0;try{const R=x.name.toLowerCase(),ve=R.endsWith(".heic")||R.endsWith(".heif")||x.type==="image/heic"||x.type==="image/heif";if(!ve&&x.type.match(/image\/(jpeg|jpg|png|webp)/))x=await me(x,1200,.8);else if(!ve)throw new Error(`Unsupported format: ${x.type}`)}catch(R){console.error("Image processing failed",R),alert(`Failed to process image: ${R.message}.`),st.value=!1,u.value&&(u.value.value="");return}const k=new FormData;k.append("file",x),s.value&&k.append("conversationId",s.value);try{const R={};p.value&&(R.Authorization=p.value);const ve=await fetch(`${e.serverUrl}/upload`,{method:"POST",headers:R,body:k});if(!ve.ok)throw new Error("Upload failed");const fe=await ve.json();fe.uploadToken&&(p.value=fe.uploadToken),n.value?.emit("send_message",{conversationId:s.value,content:"",messageType:"image",attachmentUrl:`${e.serverUrl}${fe.url}`,attachmentThumbnailUrl:`${e.serverUrl}${fe.thumbnailUrl||fe.url}`})}catch(R){console.error("Upload error:",R),alert("Failed to upload file.")}finally{st.value=!1,u.value&&(u.value.value="")}}function Fe(){if(!o.value.trim()||!s.value)return;const x=o.value.trim();if(x.length>100){m.value=`Message too long (${x.length}/100 characters).`,setTimeout(()=>m.value="",4e3);return}m.value="",n.value?.emit("send_message",{conversationId:s.value,content:o.value.trim(),messageType:"text"}),n.value?.emit("typing_stop",{conversationId:s.value}),o.value=""}let ot=null;function en(){s.value&&(n.value?.emit("typing_start",{conversationId:s.value}),ot&&clearTimeout(ot),ot=setTimeout(()=>{n.value?.emit("typing_stop",{conversationId:s.value})},2e3))}function de(){!s.value||oe.value===0||(n.value?.emit("submit_review",{conversationId:s.value,rating:oe.value,review:Be.value.trim()}),rt.value=!0)}function Re(){Ce.value=!0}function ln(){if(!s.value){c.value=!0,Ce.value=!1;return}n.value?.emit("resolve_conversation",{conversationId:s.value}),Ce.value=!1}function cn(){Ce.value=!1}function Mn(x=!1){d.value&&(x?d.value.scrollTop=d.value.scrollHeight:d.value.scrollTo({top:d.value.scrollHeight,behavior:"smooth"}))}function Dn(x){const k=new Date(x),R=k.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`${k.toLocaleDateString([],{month:"short",day:"numeric"})} ${R}`}function zn(){s.value=null,i.value=[],c.value=!1,rt.value=!1,oe.value=0,Be.value="",y.value="",S.value=!1,localStorage.removeItem("omnichat_conversation_id")}const zi=Gs(()=>({fontSize:"10px",color:o.value.length>=85?"#dc2626":"#9ca3af",position:"absolute",bottom:"4px",right:"65px",pointerEvents:"none"}));function wn(x){return Qe.value===x.value?{background:"#eef2ff",color:"#4f46e5",fontWeight:600}:{}}zo(()=>{fetch(`${e.serverUrl}/config/active`).then(x=>x.json()).then(x=>{x.bubbleColor&&(ee.value=x.bubbleColor),x.welcomeMessage&&(ke.value=x.welcomeMessage),x.offlineMessage&&(Ge.value=x.offlineMessage),x.isOfflineMode!==void 0&&(ft.value=x.isOfflineMode),x.notificationSoundUrl&&(Ye.value=x.notificationSoundUrl),x.aiEnabled!==void 0&&(I.value=x.aiEnabled),x.translationEnabled!==void 0&&(N.value=x.translationEnabled),x.autoTranslationEnabled!==void 0&&(le.value=x.autoTranslationEnabled),x.showVisitorWidget!==void 0&&(be.value=x.showVisitorWidget)}).catch(()=>{}),w()}),Ms(()=>{n.value?.disconnect()});function Bi(){try{window.opener?window.close():window.parent!==window?window.parent.postMessage({type:"omnichat-close"},"*"):window.history.back()}catch{window.history.back()}}return(x,k)=>(Q(),re(Ie,null,[be.value?(Q(),re("div",{key:0,class:"panel-wrapper",style:{left:"0px",top:"0px",width:"100vw",height:"100dvh",borderRadius:"0px",border:"none"},onDragenter:v,onDragover:D,onDragleave:C,onDrop:M},[F("div",{class:"panel-header",style:vt({backgroundColor:Te.value})},[F("div",null,[F("h3",null,Ue(s.value?"Chat Support":"Chat with us"),1),s.value?(Q(),re("span",zp," Ticket: #"+Ue(E(s.value)),1)):ut("",!0)]),F("div",Bp,[N.value?(Q(),re("div",Fp,[F("button",{type:"button",class:"close-btn",onClick:k[0]||(k[0]=R=>et.value=!et.value),title:"Translate",style:{"font-size":"16px"}}," 🌐 "),et.value?(Q(),re("div",$p,[(Q(!0),re(Ie,null,Ds(Tn(Nl),R=>(Q(),re("button",{key:R.value,onClick:ve=>{Ae(R.value),et.value=!1},style:vt([{display:"block",width:"100%","text-align":"left",padding:"6px 14px",border:"none",background:"none",cursor:"pointer","font-size":"13px",color:"#374151"},wn(R)]),onMouseenter:k[1]||(k[1]=ve=>ve.target.style.background="#f3f4f6"),onMouseleave:ve=>ve.target.style.background=Qe.value===R.value?"#eef2ff":"none"},Ue(R.label),45,Up))),128))])):ut("",!0)])):ut("",!0),F("button",{type:"button",class:"close-btn",onClick:ue,title:ht.value?"Unmute":"Mute",style:{"font-size":"16px"}},Ue(ht.value?"🔕":"🔔"),9,Hp),F("button",{type:"button",class:"close-btn",onClick:Bi,"aria-label":"Close chat"}," × ")])],4),it.value?(Q(),re("div",jp,[...k[7]||(k[7]=[F("div",{class:"drag-overlay-content"},[F("span",{style:{"font-size":"40px","margin-bottom":"12px",display:"block","text-align":"center"}},"📥"),F("span",null,"Drop file to upload")],-1)])])):ut("",!0),s.value?(Q(),re(Ie,{key:2},[b.value?(Q(),re("div",Gp,[k[9]||(k[9]=F("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0","font-size":"13px"}}," ⚠ You have been flagged for spam activity ",-1)),F("p",Yp,Ue(b.value.reason),1)])):ut("",!0),F("div",{ref_key:"messagesArea",ref:d,class:"messages-area"},[(Q(!0),re(Ie,null,Ds(i.value,R=>(Q(),re("div",{key:R.id,class:Un(["msg-bubble",R.senderType]),style:vt(R.senderType==="visitor"?{backgroundColor:Te.value,padding:R.messageType==="image"?"4px":""}:{padding:R.messageType==="image"?"4px":""})},[R.senderType==="ai"?(Q(),re("div",Xp,"AI Agent")):ut("",!0),R.messageType==="image"?(Q(),re(Ie,{key:1},[F("img",{src:R.attachmentThumbnailUrl||R.attachmentUrl,alt:"Attachment",style:{"max-width":"100%","max-height":"150px","border-radius":"8px",display:"block",cursor:"pointer","object-fit":"cover"},onClick:ve=>z(R.attachmentUrl||"")},null,8,Zp),R.content?(Q(),re("div",{key:0,class:"md-content",style:{padding:"8px"},innerHTML:Tn(Pi)(tt.value[R.id]||R.content)},null,8,Jp)):ut("",!0)],64)):(Q(),re("div",{key:2,class:"md-content",innerHTML:Tn(Pi)(tt.value[R.id]||R.content||"")},null,8,Qp)),F("div",{class:"msg-meta",style:vt({display:"flex",alignItems:"center",justifyContent:"space-between",padding:R.messageType==="image"?"0 8px 8px 8px":""})},[F("span",ed,Ue(Dn(R.createdAt)),1),R.content&&R.messageType!=="image"&&N.value?(Q(),re("button",{key:0,onClick:ve=>ce(R),disabled:Le.value.has(R.id),style:{background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"inherit",padding:"1px 6px","border-radius":"4px","font-size":"10px",cursor:"pointer",opacity:"0.7"},title:tt.value[R.id]?"Show original":"Translate"},Ue(Le.value.has(R.id)?"...":tt.value[R.id]?"Original":"Translate"),9,td)):ut("",!0)],4)],6))),128))],512),S.value&&y.value?(Q(),re("div",nd,[k[10]||(k[10]=F("div",{class:"ai-label"},"AI Agent",-1)),F("div",{class:"md-content",innerHTML:Tn(Pi)(y.value)},null,8,rd),k[11]||(k[11]=F("span",{class:"ai-cursor"},"|",-1))])):ut("",!0),a.value?(Q(),re("div",sd,[F("span",null,Ue(l.value)+" is typing",1)])):ut("",!0),c.value?(Q(),re("div",id,[k[13]||(k[13]=qr(" This conversation has been resolved. ",-1)),k[14]||(k[14]=F("br",null,null,-1)),k[15]||(k[15]=qr(" Reference Ticket: ",-1)),F("strong",null,"#"+Ue(E(s.value)),1),rt.value?(Q(),re("div",cd,"Thank you for your feedback!")):(Q(),re("div",od,[k[12]||(k[12]=F("p",null,"How was your experience?",-1)),F("div",ad,[(Q(),re(Ie,null,Ds(5,R=>F("span",{key:R,onClick:ve=>oe.value=R,class:Un({active:R<=oe.value})},"★",10,ld)),64))]),Mr(F("textarea",{"onUpdate:modelValue":k[4]||(k[4]=R=>Be.value=R),placeholder:"Any comments? (Optional)",class:"form-input"},null,512),[[Gr,Be.value]]),F("button",{type:"button",class:"submit-review-btn",style:vt({backgroundColor:Te.value}),onClick:de},"Submit Review",4)])),F("button",{type:"button",class:"start-new-chat-btn",onClick:zn},"Start a new chat")])):(Q(),re(Ie,{key:4},[Ce.value?(Q(),re("div",ud,[k[16]||(k[16]=F("span",{class:"confirm-text"},"End this chat?",-1)),F("div",{class:"confirm-buttons"},[F("button",{type:"button",class:"confirm-yes-btn",onClick:ln},"End"),F("button",{type:"button",class:"confirm-cancel-btn",onClick:cn},"Cancel")])])):(Q(),re("div",fd,[m.value?(Q(),re("div",hd,Ue(m.value),1)):ut("",!0),F("button",{type:"button",class:"attachment-btn",style:{background:"transparent",border:"none","font-size":"18px",cursor:"pointer",color:"#64748b",display:"flex","align-items":"center","justify-content":"center"},disabled:st.value,onClick:te,title:"Attach Image (Max 5MB)"},[...k[17]||(k[17]=[F("span",{style:{transform:"rotate(45deg)"}},"📎",-1)])],8,pd),F("input",{type:"file",ref_key:"fileInput",ref:u,style:{display:"none"},accept:"image/*",onChange:xe},null,544),Mr(F("textarea",{"onUpdate:modelValue":k[5]||(k[5]=R=>o.value=R),class:"msg-input",rows:"1",maxlength:"100",placeholder:st.value?"Uploading...":"Type your message...",disabled:st.value,onKeydown:[Na(ei(Fe,["exact","prevent"]),["enter"]),Na(ei(()=>{},["shift","exact"]),["enter"])],onInput:en},null,40,dd),[[Gr,o.value]]),F("span",{style:vt(zi.value)},Ue(o.value.length)+"/100",5),F("button",{type:"button",class:"send-msg-btn",style:vt({backgroundColor:Te.value,boxShadow:"0 4px 10px "+Te.value+"40"}),disabled:!o.value.trim()&&!st.value,onClick:Fe},Ue(st.value?"...":"Send"),13,gd),F("button",{type:"button",class:"end-chat-btn",onClick:Re,title:"End Chat"},"✖")]))],64))],64)):(Q(),re("div",qp,[ft.value&&!I.value?(Q(),re("div",Vp,[k[8]||(k[8]=F("p",{style:{color:"#b91c1c","font-weight":"600",margin:"0 0 8px 0","font-size":"15px"}},[F("span",null,"🌙"),qr(" Agents are offline ")],-1)),F("p",Wp,Ue(Ge.value),1)])):(Q(),re(Ie,{key:1},[F("p",null,Ue(ke.value||t.welcomeMessage),1),F("div",Kp,[Mr(F("input",{"onUpdate:modelValue":k[2]||(k[2]=R=>ge.value=R),type:"text",placeholder:"Your Name",class:"form-input"},null,512),[[Gr,ge.value]]),Mr(F("input",{"onUpdate:modelValue":k[3]||(k[3]=R=>an.value=R),type:"text",inputmode:"email",placeholder:"Your Email (Optional)",class:"form-input"},null,512),[[Gr,an.value]])]),F("button",{type:"button",class:"start-chat-btn",style:vt({backgroundColor:Te.value,boxShadow:"0 4px 14px "+Te.value+"66"}),onClick:V}," Start a conversation ",4)],64))]))],32)):ut("",!0),g.value?(Q(),re("div",{key:1,style:{position:"fixed",inset:"0",background:"rgba(0,0,0,0.8)","z-index":"2147483647",display:"flex","align-items":"center","justify-content":"center"},onClick:j},[k[18]||(k[18]=F("button",{style:{position:"absolute",top:"20px",right:"20px",background:"none",border:"none",color:"white","font-size":"32px",cursor:"pointer"}},"×",-1)),F("img",{src:g.value,style:{"max-width":"90vw","max-height":"90vh","object-fit":"contain","border-radius":"4px"},onClick:k[6]||(k[6]=ei(()=>{},["stop"]))},null,8,md)])):ut("",!0)],64))}}),{styles:[`*, ::before, ::after {
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
`]});return customElements.define("omnichat-chat-page",Bl),qt.OmniChatChatPage=Bl,Object.defineProperty(qt,Symbol.toStringTag,{value:"Module"}),qt}({});
