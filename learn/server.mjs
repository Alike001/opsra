import http from "node:http";
import crypto from "node:crypto";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {readFile} from "node:fs/promises";
import {publicLessons,checkExercise,findLesson} from "./curriculum.mjs";
import {answerWithServ} from "./mentor.mjs";
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const files={"/":["index.html","text/html; charset=utf-8"],"/styles.css":["styles.css","text/css; charset=utf-8"],"/app.js":["app.js","text/javascript; charset=utf-8"]};
function json(res,status,payload){res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});res.end(JSON.stringify(payload));}
function tokenEquals(value,expected){
 if(typeof value!=="string"||!expected)return false;
 const a=Buffer.from(value),b=Buffer.from(expected);
 return a.length===b.length&&crypto.timingSafeEqual(a,b);
}
async function readJson(req){
 if(req.headers["content-type"]?.split(";")[0]!=="application/json")throw new Error("Expected application/json.");
 let body="";
 for await(const chunk of req){
  body+=chunk.toString("utf8");
  if(Buffer.byteLength(body)>2400)throw new Error("Request is too large.");
 }
 try{return JSON.parse(body);}catch{throw new Error("Invalid request JSON.");}
}
export function createApp({env=process.env,fetchImpl=fetch}={}){
 const enabled=Boolean(env.SERV_API_KEY&&env.LEARN_ACCESS_TOKEN);
 const recent=new Map();
 let total=0;
 return http.createServer(async(req,res)=>{
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("X-Frame-Options","DENY");
  res.setHeader("Referrer-Policy","no-referrer");
  res.setHeader("Content-Security-Policy","default-src 'none'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'");
  const url=new URL(req.url??"/","http://localhost");
  const pathname=url.pathname;
  if(req.method==="GET"&&pathname==="/healthz")
   return json(res,200,{status:"ok",service:"serv-learning-companion",tutor_enabled:enabled,mode:"independent learning pilot"});
  if(req.method==="GET"&&pathname==="/api/lessons")
   return json(res,200,{lessons:publicLessons(),tutor_enabled:enabled,progress_storage:"on-device only"});
  if(req.method==="POST"&&pathname==="/api/check"){
   try{
    const input=await readJson(req);
    return json(res,200,{lesson_id:input?.lesson_id,...checkExercise(input?.lesson_id,input?.answer)});
   }catch(e){return json(res,400,{error:String(e.message).slice(0,160)});}
  }
  if(req.method==="POST"&&pathname==="/api/mentor"){
   if(!enabled)return json(res,503,{error:"Live SERV tutor is not configured on this server. Free practice still works."});
   if(!tokenEquals(req.headers["x-learn-access-token"],env.LEARN_ACCESS_TOKEN))
     return json(res,401,{error:"A valid instructor access code is required for live tutoring."});
   const remote=req.socket.remoteAddress??"unknown";
   const now=Date.now();
   const last=(recent.get(remote)??[]).filter(t=>now-t<600000);
   if(last.length>=3||total>=35)return json(res,429,{error:"Tutor rate limit reached. Practice lessons remain available."});
   try{
    const input=await readJson(req);
    if(!findLesson(input?.lesson_id))return json(res,400,{error:"Select a valid lesson."});
    if(typeof input?.question!=="string"||input.question.length<8||input.question.length>400)
      return json(res,400,{error:"Enter a question between 8 and 400 characters."});
    last.push(now);recent.set(remote,last);total++;
    const result=await answerWithServ({lessonId:input.lesson_id,question:input.question,
      apiKey:env.SERV_API_KEY,model:env.SERV_MODEL??"gpt-5.4-mini",fetchImpl});
    return json(res,200,{mode:"live-serv-tutor",...result});
   }catch(e){
    return json(res,502,{error:"Tutor failed safely: "+String(e.message).slice(0,150)});
   }
  }
  if(req.method==="GET"&&Object.hasOwn(files,pathname)){
   try{
    const [filename,mime]=files[pathname];
    const bytes=await readFile(path.join(ROOT,"public",filename));
    res.writeHead(200,{"Content-Type":mime,"Cache-Control":"public, max-age=120"});
    return res.end(bytes);
   }catch{return json(res,500,{error:"Learning interface unavailable."});}
  }
  return json(res,404,{error:"Not found."});
 });
}
