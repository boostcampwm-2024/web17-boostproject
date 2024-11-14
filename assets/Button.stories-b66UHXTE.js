import{j as R}from"./jsx-runtime-CkxqCPlQ.js";import{c as q}from"./cn-nCncktCR.js";import"./index-DJO9vBfz.js";function A(r){var e,t,o="";if(typeof r=="string"||typeof r=="number")o+=r;else if(typeof r=="object")if(Array.isArray(r))for(e=0;e<r.length;e++)r[e]&&(t=A(r[e]))&&(o&&(o+=" "),o+=t);else for(e in r)r[e]&&(o&&(o+=" "),o+=e);return o}function H(){for(var r,e,t=0,o="";t<arguments.length;)(r=arguments[t++])&&(e=A(r))&&(o&&(o+=" "),o+=e);return o}const h=r=>typeof r=="boolean"?"".concat(r):r===0?"0":r,C=H,I=(r,e)=>t=>{var o;if((e==null?void 0:e.variants)==null)return C(r,t==null?void 0:t.class,t==null?void 0:t.className);const{variants:i,defaultVariants:a}=e,T=Object.keys(i).map(n=>{const s=t==null?void 0:t[n],u=a==null?void 0:a[n];if(s===null)return null;const l=h(s)||h(u);return i[n][l]}),y=t&&Object.entries(t).reduce((n,s)=>{let[u,l]=s;return l===void 0||(n[u]=l),n},{}),_=e==null||(o=e.compoundVariants)===null||o===void 0?void 0:o.reduce((n,s)=>{let{class:u,className:l,...E}=s;return Object.entries(E).every(G=>{let[v,f]=G;return Array.isArray(f)?f.includes({...a,...y}[v]):{...a,...y}[v]===f})?[...n,u,l]:n},[]);return C(r,T,_,t==null?void 0:t.class,t==null?void 0:t.className)},K=I("display-bold12 border rounded shadow-black",{variants:{backgroundColor:{default:"bg-white",gray:"bg-gray",orange:"bg-orange"},textColor:{default:"text-orange",white:"text-white"},size:{default:"w-24",sm:"w-14"}},defaultVariants:{backgroundColor:"default",textColor:"default",size:"default"}}),P=({backgroundColor:r,textColor:e,size:t,children:o,className:i,...a})=>R.jsx("button",{className:q(K({backgroundColor:r,textColor:e,size:t}),i),...a,children:o});P.__docgenInfo={description:"",methods:[],displayName:"Button",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["ButtonHTMLAttributes","VariantProps"]};const W={title:"Example/Button",component:P,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{backgroundColor:{control:"select",options:["default","gray","orange"]},textColor:{control:"select",options:["default","white"]},size:{control:"select",options:["default","sm"]}},args:{children:"Button"}},c={args:{children:"Button"}},d={args:{backgroundColor:"orange",textColor:"white",children:"Button"}},m={args:{backgroundColor:"gray",textColor:"white",children:"Button"}},g={args:{backgroundColor:"orange",textColor:"white",children:"Button",size:"sm"}};var b,B,p;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...(p=(B=c.parameters)==null?void 0:B.docs)==null?void 0:p.source}}};var x,k,w;d.parameters={...d.parameters,docs:{...(x=d.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    backgroundColor: 'orange',
    textColor: 'white',
    children: 'Button'
  }
}`,...(w=(k=d.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var N,V,j;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    backgroundColor: 'gray',
    textColor: 'white',
    children: 'Button'
  }
}`,...(j=(V=m.parameters)==null?void 0:V.docs)==null?void 0:j.source}}};var O,S,z;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    backgroundColor: 'orange',
    textColor: 'white',
    children: 'Button',
    size: 'sm'
  }
}`,...(z=(S=g.parameters)==null?void 0:S.docs)==null?void 0:z.source}}};const D=["Primary","OrangeButton","GrayButton","SmallButton"];export{m as GrayButton,d as OrangeButton,c as Primary,g as SmallButton,D as __namedExportsOrder,W as default};
