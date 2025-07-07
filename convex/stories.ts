import { mutation, query } from "./_generated/server";
import { getAunthenticatedUser } from "./users";
import { v } from "convex/values";




export const generateUploadUrl = mutation(async(ctx)=>{
    const identity = await  ctx.auth.getUserIdentity();
    if(!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl()
})



// This mutation is used to create a story
export const createStory = mutation( {
    args:{
          storageId: v.id("_storage"),
    }, handler : async (ctx , args)=>{
        // the pseudo code 
        // This is to first the get currentUser
       const currentUser = await getAunthenticatedUser(ctx)
       if (!currentUser) throw new Error("Unauthorized user")

        // then we get the imageUrl from the storageId 

        const imageUrl = await ctx.storage.getUrl(args.storageId)
        if (!imageUrl) throw new Error("Image File doesn't exist");

        // then we create the story 
         const expiresAt = Date.now() + (24 * 60 * 60 * 1000);

        const storyId = await ctx.db.insert("stories",{
            userId : currentUser._id,
            imageUrl,
            storageId: args.storageId,
            expiresAt,
        })

          await ctx.db.patch(currentUser._id,{
            stories :currentUser.posts + 1
        })

        return storyId
    },
} )


// i removed the filter 
export const getUserStory = query( { 
 handler : async (ctx )=>{

      
        const now = Date.now();

      
   
     const stories =  await ctx.db.query("stories")
       
        .filter((q) => q.gt(q.field("expiresAt"), now)) 
        .order("desc") 
        .collect()    
        
        // if there are no stories , send back an empty array
        if(stories.length === 0 ) return []


        const storiesWithInfo = await Promise.all(
            stories.map( async (story)=>{
   const storyAuthor = ( await ctx.db.get(story.userId))!;
  
                 return {
                  ...story,
                   author:{
                id: storyAuthor?._id,
                username: storyAuthor?.username,
                image: storyAuthor?.image
            }
                 }
            })
        )


  
        return storiesWithInfo

    }

} )




export const deleteStory = mutation( {
    args:{
        storyId : v.id("stories")
    }, 
    handler : async (ctx , args)=>{

        const currentUser = await getAunthenticatedUser(ctx)
        if (!currentUser) throw new Error("Unauthorized user");

        const story = await ctx.db.get(args.storyId)
        if (!story) throw new Error("Story not found");
        

        if(story.userId !== currentUser._id){
            throw new Error("You are not authorized to delete this story");
        }
        // console.log(story.userId)
        // delete the story from the storage

        await ctx.storage.delete(story.storageId)

       await ctx.db.delete(args.storyId)

    //     and after decrement the count of stories 
            
    await ctx.db.patch(currentUser._id,{
        stories : Math.max(0, (currentUser.stories || 1) - 1)
    })

    }
} )












