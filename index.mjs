import { createApp } from "./server.mjs";
const port=Number(process.env.PORT??3000);
createApp().listen(port,"0.0.0.0",()=>{
  console.log("Opsra listening on port "+port);
});
