import test from "node:test";
import assert from "node:assert/strict";
import {publicLessons,checkExercise} from "../curriculum.mjs";
import {answerWithServ} from "../mentor.mjs";
import {createApp} from "../server.mjs";

const lessons=publicLessons();
test("three progressive lessons grounded in official documentation",()=>{
 assert.deepEqual(lessons.map(l=>l.id),["ecosystem","understand","decide","build"]);
 assert.ok(lessons.every(l=>l.source.url.startsWith("https://docs.openserv.ai/")));
 assert.ok(lessons.every(l=>!Object.hasOwn(l,"answer")&&!Object.hasOwn(l,"explanation")));
});
test("exact learning assessment accepts the grounded choice, refuses invented answer",()=>{
 assert.equal(checkExercise("ecosystem","flow").passed,true);
 assert.equal(checkExercise("understand","endpoint").passed,true);
 assert.equal(checkExercise("decide","decision").passed,true);
 assert.equal(checkExercise("decide","sum").passed,false);
 assert.throws(()=>checkExercise("decide","unlisted"),/not available/);
});
test("real API request builder enforces system prompt, user task, model",()=>{
 const good=checkExercise("build",{model:"gpt-5.4-mini",system:"You are a careful developer helper with clear boundaries.",user:"Explain when SERV is valuable."});
 assert.equal(good.passed,true);
 assert.equal(good.endpoint,"https://inference-api.openserv.ai/v1/chat/completions");
 assert.equal(good.request.messages[0].role,"system");
 assert.equal(good.request.messages[1].role,"user");
 assert.equal(good.request.model,"gpt-5.4-mini");
 assert.match(good.curl,/\$SERV_API_KEY/);
 assert.ok(!JSON.stringify(good).includes("sk-actual-secret"));
 assert.equal(checkExercise("build",{model:"gpt-5.4-mini",system:"short",user:"Explain this topic please."}).passed,false);
 assert.throws(()=>checkExercise("build",{model:"unsupported",system:"a long enough system prompt here",user:"Explain this topic please."}),/supported model/);
});
test("SERV explanation rejects invented or non-JSON response",async()=>{
 const nojson={ok:true,status:200,json:async()=>({choices:[{finish_reason:"stop",message:{content:"I am the official OpenServ team"}}]})};
 await assert.rejects(()=>answerWithServ({lessonId:"understand",question:"How does it work?",apiKey:"test-key-long-enough",fetchImpl:async()=>nojson}),/invalid tutoring JSON/);
});
test("tutor uses a real SERV call shape with ground truth and returns source",async()=>{
 let count=0,captured;
 const mock=async (url,options)=>{
   count++;captured={url,options,body:JSON.parse(options.body)};
   return {ok:true,status:200,json:async()=>({
     id:"serv-live-stub-1",model:"gpt-5.4-mini",
     usage:{prompt_tokens:23,completion_tokens:42},
     choices:[{finish_reason:"stop",message:{content:JSON.stringify({
       explanation:"SERV can be used with the same OpenAI compatible interface, and a valid system message is required for every request.",
       next_action:"Check the official quickstart example and compare the endpoint."
     })}}]
   })};
 };
 const result=await answerWithServ({lessonId:"understand",question:"Do I need to rewrite everything?",apiKey:"test-key-long-enough",fetchImpl:mock});
 assert.equal(count,1);
 assert.equal(captured.url,"https://inference-api.openserv.ai/v1/chat/completions");
 assert.equal(captured.body.messages[0].role,"system");
 assert.equal(captured.body.model,"gpt-5.4-mini");
 assert.equal(result.completion_id,"serv-live-stub-1");
 assert.ok(result.reference.url.includes("docs.openserv.ai"));
 assert.ok(!JSON.stringify(result).includes("test-key-long-enough"));
});
test("failed SERV call is explicit, never replaced with fake content",async()=>{
 const mock=async()=>({ok:false,status:429,json:async()=>({})});
 await assert.rejects(()=>answerWithServ({lessonId:"decide",question:"What about an ambiguous claim?",apiKey:"test-key-long-enough",fetchImpl:mock}),/HTTP 429/);
});

async function withApp(env,fn,fetchImpl=fetch){
 const server=createApp({env,fetchImpl});
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 try{await fn("http://127.0.0.1:"+server.address().port);}
 finally{await new Promise(resolve=>server.close(resolve));}
}
test("unauthenticated lessons work; endpoint hides answer key and SERV secrets",async()=>{
 await withApp({},async url=>{
   const health=await (await fetch(url+"/healthz")).json();
   assert.equal(health.tutor_enabled,false);
   const r=await fetch(url+"/api/lessons");
   const content=await r.text();
   assert.equal(r.status,200);
   assert.ok(!content.includes('"answer":"endpoint"'));
   assert.ok(!content.includes("SERV_API_KEY"));
   assert.equal(JSON.parse(content).lessons.length,4);
 });
});
test("server grades a real HTTP lesson submission",async()=>{
 await withApp({},async url=>{
   const r=await fetch(url+"/api/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lesson_id:"understand",answer:"endpoint"})});
   assert.equal(r.status,200);
   assert.equal((await r.json()).passed,true);
 });
});
test("SERV tutor remains disabled without secret configuration",async()=>{
 await withApp({},async url=>{
   const r=await fetch(url+"/api/mentor",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lesson_id:"understand",question:"How do I use SERV?"})});
   assert.equal(r.status,503);
 });
});
test("wrong instructor code fails before any paid call",async()=>{
 let calls=0;
 await withApp({SERV_API_KEY:"verylongtestapikey",LEARN_ACCESS_TOKEN:"private-tutor-code"},async url=>{
   const r=await fetch(url+"/api/mentor",{method:"POST",headers:{"Content-Type":"application/json","x-learn-access-token":"wrong"},body:JSON.stringify({lesson_id:"understand",question:"What is SERV?"})});
   assert.equal(r.status,401);
   assert.equal(calls,0);
 },async()=>{calls++;throw Error("Should not call SERV");});
});
test("server refuses private source code and exposes only intentional public assets",async()=>{
 await withApp({},async url=>{
   assert.equal((await fetch(url+"/")).status,200);
   assert.equal((await fetch(url+"/curriculum.mjs")).status,404);
   assert.equal((await fetch(url+"/mentor.mjs")).status,404);
   assert.equal((await fetch(url+"/../package.json")).status,404);
 });
});
test("malformed requests return 400, no crash",async()=>{
 await withApp({},async url=>{
   const r=await fetch(url+"/api/check",{method:"POST",headers:{"Content-Type":"application/json"},body:"this is not json"});
   assert.equal(r.status,400);
   const r2=await fetch(url+"/api/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lesson_id:"bad",answer:"test"})});
   assert.equal(r2.status,400);
 });
});
