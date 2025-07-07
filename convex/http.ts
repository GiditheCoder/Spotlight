import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import {Webhook}  from "svix";
import { api } from "./_generated/api";



const http = httpRouter();

// what we use webhooks for is to listen for an action -- an automated message is sent
// we need to ensure that the webhook event is coming to Clerk
// if so  we listen to ther "user.created" event 
// then we will save user to the database
 
   http.route({
    path: "/clerk-webhook",
    method: "POST" ,
   handler : httpAction(async (ctx, request) =>{
     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
     if(!webhookSecret){
        throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
     }

    
    // check headers
const svix_id = request.headers.get("svix-id");
const svix_signature = request.headers.get("svix-signature");
const svix_timestamp = request.headers.get("svix-timestamp");




if(!svix_id || !svix_signature || !svix_timestamp){
    return new Response("Error occured-- no svix headers" ,{
        status: 400
    })
}

const payload = await request.json();
const body  = JSON.stringify(payload)

const wb = new Webhook(webhookSecret)

let evt:any ;
// verfiy webhook
try {
    evt = wb.verify(body,{
  "svix-id" : svix_id,
  "svix-timestamp" : svix_timestamp,
  "svix-signature" : svix_signature
    }) as any;
} catch (err) {
 console.error("Error verifying webhook:", err)
 return new Response("Error occured", {status: 400})  
}

// once it passes this verfication  it automatically moves on to the next
// after we vetify the webhook  we move on to get the event type and take the data from it 

const eventType = evt.type

if(eventType === "user.created"){
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0].email_address;
    // this technique is used to get the name
   const name = `${first_name || ""} ${last_name || "" }`.trim();


   try {
     await ctx.runMutation(api.users.createUser,  {
        email,
        fullname: name,
        image: image_url,
        clerkId: id,
        username: email.split("@")[0],
     })
   } catch (error) {
    console.log("Error creating users:", error);
    return new Response("Error creating user", {status:500})
    
   }

}

return new Response("Webhook processed successfullyr", {status:200})

   })

})


export default http;