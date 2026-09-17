import{a as d,r as l,j as e}from"./index-B4srXIXm.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=d("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);function m({prompt:o,placeholder:a}){const[t,i]=l.useState(""),[r,s]=l.useState(!1),n=()=>{t.trim()&&s(!0)};return e.jsxs("div",{className:"bg-violet-50 border border-violet-200 rounded-2xl p-5 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2 text-violet-700 font-semibold",children:[e.jsx(x,{className:"w-5 h-5"}),e.jsx("span",{children:"Your Reflection"})]}),e.jsx("p",{className:"text-sm text-violet-800",children:o}),r?e.jsxs("div",{className:"bg-violet-100 rounded-xl p-3 text-sm text-violet-800 italic",children:['"',t,'"',e.jsx("button",{onClick:()=>s(!1),className:"ml-2 text-xs text-violet-500 underline",children:"Edit"})]}):e.jsxs(e.Fragment,{children:[e.jsx("textarea",{rows:3,value:t,onChange:c=>i(c.target.value),placeholder:a??"Write your thoughts here…",className:`w-full px-4 py-3 rounded-xl border border-violet-200 text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none placeholder:text-violet-300`}),e.jsx("button",{onClick:n,disabled:!t.trim(),className:`px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold
                       hover:bg-violet-700 disabled:opacity-40 transition-colors`,children:"Save reflection"})]})]})}export{m as R};
