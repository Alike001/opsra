(() => {
 "use strict";
 const $=(id)=>document.getElementById(id);
 let lessons=[],current=null,chosen=null,requestJson="",curl="",tutorEnabled=false;
 const clear=(node)=>{while(node.firstChild)node.removeChild(node.firstChild);};
 const item=(parent,tag,text,cls)=>{
   const node=document.createElement(tag);
   if(cls)node.className=cls;
   node.textContent=String(text??"");
   parent.appendChild(node);return node;
 };
 const storageKey="servsteps-progress-v1";
 let done=new Set();
 try{
   const saved=JSON.parse(localStorage.getItem(storageKey)??"[]");
   if(Array.isArray(saved))done=new Set(saved.filter(x=>typeof x==="string"));
 }catch{done=new Set();}
 async function api(url,options){
   const response=await fetch(url,options);
   let payload;
   try{payload=await response.json();}catch{throw new Error("The server returned an unreadable response.");}
   if(!response.ok)throw new Error(payload.error??"Request unsuccessful.");
   return payload;
 }
 function updateProgress(){
   const count=lessons.filter(x=>done.has(x.id)).length;
   $("progress-count").textContent=count+" of "+lessons.length;
   $("progress-fill").style.width=lessons.length?(count*100/lessons.length)+"%":"0%";
   $("progress-track").setAttribute("aria-valuenow",String(count));
   const host=$("lesson-nav");clear(host);
   for(const lesson of lessons){
     const button=item(host,"button","","nav-lesson"+(current===lesson.id?" active":"")+(done.has(lesson.id)?" complete":""));
     button.type="button";
     item(button,"span",done.has(lesson.id)?"✓":lesson.number,"nav-number");
     const inner=item(button,"span","","nav-copy");
     item(inner,"strong",lesson.category);
     item(inner,"small",lesson.title);
     button.addEventListener("click",()=>openLesson(lesson.id));
   }
 }
 function notify(message,success=false){
   const host=$("feedback");
   host.hidden=!message;
   host.className="feedback "+(success?"success":"error");
   host.textContent=message;
 }
 function resetExercise(){
   chosen=null;notify("");$("next").hidden=true;$("request-preview").hidden=true;
   $("check").disabled=false;$("check").textContent="Check my answer →";
 }
 function showChoices(lesson){
   const host=$("answers");clear(host);
   $("builder").hidden=lesson.id!=="build";
   host.hidden=lesson.id==="build";
   if(lesson.id==="build"){
      $("system").value=$("system").value||"You are a careful technical assistant. Explain decisions and say when information is missing.";
      $("user-task").value=$("user-task").value||"When is SERV Reasoning useful, and when should I use plain code?";
      return;
   }
   for(const option of lesson.choices??[]){
     const btn=item(host,"button",option.text,"choice");
     btn.type="button";btn.setAttribute("aria-pressed","false");
     btn.addEventListener("click",()=>{
       chosen=option.id;
       for(const b of host.children){
         const selected=b===btn;
         b.classList.toggle("picked",selected);
         b.setAttribute("aria-pressed",String(selected));
       }
       notify("");
     });
   }
 }
 function openLesson(id){
   const lesson=lessons.find(l=>l.id===id);
   if(!lesson)return;
   current=id;
   $("intro").hidden=true;$("learning").hidden=false;
   $("current-crumb").textContent="LESSON "+lesson.number;
   $("lesson-meta").textContent="LESSON "+lesson.number+" · "+lesson.category.toUpperCase();
   $("lesson-time").textContent=lesson.minutes+" MIN";
   $("lesson-title").textContent=lesson.title;
   $("lesson-summary").textContent=lesson.summary;
   $("lesson-takeaway").textContent=lesson.takeaway;
   $("lesson-detail").textContent=lesson.detail;
   $("lesson-source").textContent=lesson.source.title+" ↗";
   $("lesson-source").href=lesson.source.url;
   $("challenge").textContent=lesson.challenge;
   $("mentor-topic").textContent=lesson.title;
   $("mentor-response").hidden=true;
   resetExercise();showChoices(lesson);updateProgress();
   window.scrollTo({top:0,behavior:"smooth"});
 }
 function complete(){
   done.add(current);
   try{localStorage.setItem(storageKey,JSON.stringify([...done]));}catch{}
   updateProgress();
   $("next").hidden=false;
   const ix=lessons.findIndex(l=>l.id===current);
   $("next").textContent=ix===lessons.length-1?"Return to overview →":"Continue to next lesson →";
 }
 function showRequest(data){
   requestJson=JSON.stringify(data.request,null,2);
   curl=data.curl;
   $("json-preview").textContent=requestJson;
   $("curl-preview").textContent=curl;
   $("request-preview").hidden=false;
 }
 async function check(){
   if(!current)return;
   const selected=current==="build"
     ?{model:$("model").value,system:$("system").value,user:$("user-task").value}
     :chosen;
   if(!selected)return notify("Choose an answer first.");
   $("check").disabled=true;
   try{
     const data=await api("/api/check",{
       method:"POST",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({lesson_id:current,answer:selected})
     });
     notify((data.passed?"Correct. ":"") +data.feedback,Boolean(data.passed));
     if(data.passed){
       complete();
       if(data.request)showRequest(data);
     }
   }catch(error){notify(error.message);}
   finally{$("check").disabled=false;}
 }
 function next(){
   const index=lessons.findIndex(l=>l.id===current);
   if(index<lessons.length-1)openLesson(lessons[index+1].id);
   else overview();
 }
 function overview(){
   current=null;$("intro").hidden=false;$("learning").hidden=true;
   $("current-crumb").textContent="OVERVIEW";
   $("mentor-topic").textContent="Getting started";
   $("mentor-response").hidden=true;
   updateProgress();window.scrollTo({top:0,behavior:"smooth"});
 }
 async function copy(text,button){
   try{
     await navigator.clipboard.writeText(text);
     const old=button.textContent;button.textContent="Copied ✓";
     setTimeout(()=>button.textContent=old,1600);
   }catch{notify("Couldn't copy automatically. Select the code and copy it manually.");}
 }
 async function askTutor(){
   const question=$("mentor-question").value.trim();
   if(question.length<8)return mentorMessage("Enter a specific question of at least eight characters.",true);
   const code=$("mentor-access").value;
   if(!code)return mentorMessage("Enter the instructor access code for live tutoring.",true);
   const button=$("ask-mentor");
   button.disabled=true;button.textContent="Thinking through your question…";
   mentorMessage("Requesting a real SERV explanation. It may take a moment.");
   try{
     const result=await api("/api/mentor",{
       method:"POST",
       headers:{"Content-Type":"application/json","X-Learn-Access-Token":code},
       body:JSON.stringify({lesson_id:current??lessons[0]?.id,question})
     });
     const host=$("mentor-response");clear(host);
     item(host,"strong","SERV TUTOR · LIVE RESPONSE");
     item(host,"p",result.explanation);
     item(host,"strong","TRY NEXT");
     item(host,"p",result.next_action);
     const link=item(host,"a",result.reference.title+" ↗");
     link.href=result.reference.url;link.target="_blank";link.rel="noopener noreferrer";
     item(host,"small","Model: "+result.model+" · Completion: "+(result.completion_id??"not supplied")+" · Not independently fact-checked");
     host.hidden=false;host.className="mentor-response";
   }catch(error){mentorMessage(error.message,true);}
   finally{button.disabled=false;button.textContent="Ask SERV tutor ↗";}
 }
 function mentorMessage(message,failed=false){
   const host=$("mentor-response");host.hidden=false;host.textContent=message;
   host.className="mentor-response"+(failed?" error":"");
 }
 async function init(){
   $("start-fresh").addEventListener("click",()=>openLesson("ecosystem"));
   $("jump-build").addEventListener("click",()=>openLesson("build"));
   $("check").addEventListener("click",check);
   $("next").addEventListener("click",next);
   $("ask-mentor").addEventListener("click",askTutor);
   $("copy-json").addEventListener("click",()=>copy(requestJson,$("copy-json")));
   $("copy-curl").addEventListener("click",()=>copy(curl,$("copy-curl")));
   try{
     const data=await api("/api/lessons");
     lessons=data.lessons;tutorEnabled=Boolean(data.tutor_enabled);
     updateProgress();
     $("mentor-gate").textContent=tutorEnabled
       ?"Live SERV tutor available with instructor access. Never paste API keys into a lesson."
       :"Guided lessons work now. The live SERV tutor will be enabled when its secure server credentials are configured.";
     $("mentor-access").hidden=!tutorEnabled;
     $("mentor-access-label").hidden=!tutorEnabled;
     $("ask-mentor").disabled=!tutorEnabled;
   }catch(error){
     $("mentor-gate").textContent="Learning content is temporarily unavailable: "+error.message;
     $("start-fresh").disabled=true;$("jump-build").disabled=true;
   }
 }
 init();
})();
