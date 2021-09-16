"use strict";(self.webpackChunknew_tremor_website=self.webpackChunknew_tremor_website||[]).push([[4461],{3905:function(e,t,r){r.d(t,{Zo:function(){return d},kt:function(){return b}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},d=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},l=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,d=a(e,["components","mdxType","originalType","parentName"]),l=u(r),b=o,m=l["".concat(s,".").concat(b)]||l[b]||p[b]||i;return r?n.createElement(m,c(c({ref:t},d),{},{components:r})):n.createElement(m,c({ref:t},d))}));function b(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,c=new Array(i);c[0]=l;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,c[1]=a;for(var u=2;u<i;u++)c[u]=r[u];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}l.displayName="MDXCreateElement"},25292:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return a},metadata:function(){return s},toc:function(){return u},default:function(){return p}});var n=r(87462),o=r(63366),i=(r(67294),r(3905)),c=["components"],a={},s={unversionedId:"tremor-script/stdlib/std/base64",id:"tremor-script/stdlib/std/base64",isDocsHomePage:!1,title:"base64",description:"The base64 module contains functions to work with base64 encoding and decoding",source:"@site/docs/tremor-script/stdlib/std/base64.md",sourceDirName:"tremor-script/stdlib/std",slug:"/tremor-script/stdlib/std/base64",permalink:"/tremor-new-website/docs/tremor-script/stdlib/std/base64",editUrl:"https://github.com/tremor-rs/tremor-new-website/tree/main/docs/tremor-script/stdlib/std/base64.md",version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"array",permalink:"/tremor-new-website/docs/tremor-script/stdlib/std/array"},next:{title:"binary",permalink:"/tremor-new-website/docs/tremor-script/stdlib/std/binary"}},u=[{value:"Functions",id:"functions",children:[{value:"encode(input)",id:"encodeinput",children:[]},{value:"decode(input)",id:"decodeinput",children:[]}]}],d={toc:u};function p(e){var t=e.components,r=(0,o.Z)(e,c);return(0,i.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The base64 module contains functions to work with base64 encoding and decoding"),(0,i.kt)("h2",{id:"functions"},"Functions"),(0,i.kt)("h3",{id:"encodeinput"},"encode(input)"),(0,i.kt)("p",null,"Encodes a ",(0,i.kt)("inlineCode",{parentName:"p"},"binary")," as a base64 encoded string"),(0,i.kt)("p",null,"Returns a ",(0,i.kt)("inlineCode",{parentName:"p"},"string")),(0,i.kt)("h3",{id:"decodeinput"},"decode(input)"),(0,i.kt)("p",null,"Decodes a base64 ebcided ",(0,i.kt)("inlineCode",{parentName:"p"},"string")," into it's bytes"),(0,i.kt)("p",null,"Returns a ",(0,i.kt)("inlineCode",{parentName:"p"},"binary")))}p.isMDXComponent=!0}}]);