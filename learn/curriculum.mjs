// Grounded teaching material. Reference links point to OpenServ's official documentation.
// The companion is independently built and is not affiliated with OpenServ.
const modules=[
  {
    id:"ecosystem",number:"01",category:"Explore",minutes:4,
    title:"Find your way around OpenServ",
    summary:"Discover where agents, workflows, connections and SERV fit together.",
    takeaway:"OpenServ provides infrastructure for building and running AI-powered applications, not just a single chatbot or model.",
    detail:"Agents encapsulate AI capabilities. Workflows coordinate steps across agents. Connect links integrations, MCPs and secrets. Developers can use the TypeScript SDK, while SERV Reasoning can support harder model decisions. You do not need all components for every project.",
    challenge:"You want to organize several existing AI agents into a multi-step process without writing code. Where would you begin?",
    choices:[
      {id:"flow",text:"Explore OpenServ Workflows and Agents"},
      {id:"reason",text:"Only change the SERV Reasoning API base URL"},
      {id:"token",text:"Start by launching a token before testing the idea"}
    ],
    answer:"flow",
    explanation:"OpenServ's Workflows and Agents are designed for composing multi-step agent processes, including no-code setups. SERV Reasoning serves a different role: improving model decisions.",
    source:{title:"What is OpenServ? · Official docs",url:"https://docs.openserv.ai/no-code/what-is-openserv"}
  },
  {
    id:"understand",number:"02",category:"Understand",minutes:3,
    title:"What is SERV, really?",
    summary:"Understand where SERV fits before writing code.",
    takeaway:"SERV Reasoning is a reasoning layer for existing models. It is not a replacement for your entire app or a blockchain transaction engine.",
    detail:"You keep your application, prompts and tools. You can route compatible model requests through SERV and decide which tasks merit its reasoning layer.",
    challenge:"You already built a chatbot with an OpenAI-compatible SDK. What's the simplest way to try SERV Reasoning?",
    choices:[
      {id:"rewrite",text:"Rebuild the entire app on a different framework"},
      {id:"endpoint",text:"Use the SERV base URL and your SERV API key with a supported model"},
      {id:"wallet",text:"Deploy an on-chain contract before making an AI request"}
    ],
    answer:"endpoint",
    explanation:"The official quickstart shows an OpenAI-compatible client using the SERV base URL and a SERV API key. No blockchain contract or framework rewrite is required.",
    source:{title:"SERV Reasoning quickstart",url:"https://docs.openserv.ai/serv-reasoning/introduction"}
  },
  {
    id:"decide",number:"03",category:"Practice",minutes:4,
    title:"Know when reasoning helps",
    summary:"Pick the tasks where SERV earns its place.",
    takeaway:"Use SERV for ambiguous decisions and competing constraints. Use ordinary code for deterministic arithmetic and lookups.",
    detail:"Imagine a support system deciding what to do with a refund request. A calculator can check the number of days; a reasoner can weigh conflicting policy exceptions and route the next check. Keep final authority and hard rules in code.",
    challenge:"Which of these tasks is the best fit for SERV Reasoning?",
    choices:[
      {id:"sum",text:"Add three invoice amounts with an exact tax rate"},
      {id:"decision",text:"Decide whether a disputed refund qualifies under several conflicting policy exceptions"},
      {id:"lookup",text:"Fetch an order by its known database ID"}
    ],
    answer:"decision",
    explanation:"SERV is useful for judgment across constraints, policy interpretation, prioritization and tool selection. Exact calculations and database lookups should stay deterministic.",
    source:{title:"Day One with SERV",url:"https://docs.openserv.ai/serv-reasoning/day-one"}
  },
  {
    id:"build",number:"04",category:"Build",minutes:5,
    title:"Build your first valid request",
    summary:"Create a real API request shape you can use in your own project.",
    takeaway:"For Chat Completions, you need an authorized request, supported model, and system/developer instruction. Keep your key on the server.",
    detail:"This exercise constructs the actual JSON payload and curl command for the official SERV Chat Completions endpoint. The preview is NOT executed; the separate live tutor is the only paid SERV call in this learning app.",
    challenge:"Write a system instruction and a useful user question. We'll validate your request before you send it.",
    source:{title:"Chat completions API",url:"https://docs.openserv.ai/serv-reasoning/api/chat-completions"}
  }
];
export const LESSON_IDS=Object.freeze(modules.map(x=>x.id));
export function findLesson(id){return modules.find(x=>x.id===id)??null;}
export function publicLessons(){return modules.map(({answer,explanation,...safe})=>safe);}
function string(v,max){return typeof v==="string"&&v.trim().length>0&&v.length<=max;}
export function checkExercise(id,answer){
 const lesson=findLesson(id);
 if(!lesson)throw new Error("Unknown lesson.");
 if(id==="build"){
   if(!answer||typeof answer!=="object"||Array.isArray(answer))throw new Error("Build request fields are required.");
   const model=answer.model;
   if(!["gpt-5.4-mini","gpt-5.4-nano"].includes(model))throw new Error("Select a supported model.");
   if(!string(answer.system,500)||answer.system.trim().length<20)
     return {passed:false,feedback:"Write a system instruction of at least 20 characters. Describe the assistant's job and its boundaries.",source:lesson.source};
   if(!string(answer.user,500)||answer.user.trim().length<12)
     return {passed:false,feedback:"Write a specific user question or task of at least 12 characters.",source:lesson.source};
   const payload={model,messages:[{role:"system",content:answer.system.trim()},{role:"user",content:answer.user.trim()}]};
   return {passed:true,feedback:"Valid request shape. The system instruction, user task and supported model are present. This is a preview, not an API call.",source:lesson.source,
      request:payload,method:"POST",endpoint:"https://inference-api.openserv.ai/v1/chat/completions",
      curl:"curl https://inference-api.openserv.ai/v1/chat/completions -H \"Authorization: Bearer $SERV_API_KEY\" -H 'Content-Type: application/json' --data-binary @request.json"};
 }
 if(typeof answer!=="string"||answer.length>100)throw new Error("Choose one of the provided answers.");
 const valid=lesson.choices.some(c=>c.id===answer);
 if(!valid)throw new Error("That option is not available.");
 const passed=answer===lesson.answer;
 return {passed,feedback:passed?lesson.explanation:"Not quite. "+lesson.explanation,source:lesson.source,
   correct_choice_id:passed?undefined:lesson.answer};
}
