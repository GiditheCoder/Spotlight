import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// we create a function otherwise known as a mutation that helps us write a function to make an action the backend
// the handler function takes two paramters one is the ctx and the other is args 
// ctx to authenticate and interact with the database 
// args is to assess the username, fullname, image
// we create a user and also we check if the user 
// after creating a function , we go the webhook and initialise an endpoint url i.e the convex url
// for webhook it has to be .site / an endpoint name
// after this , we would be given a signing secret , whic is to be added to convex dashboard
// create a webhook in other to ensure the requests are made from legit sources

export const createUser = mutation({
     args:{
        username: v.string(),
        fullname: v.string(),
        image : v.string(),
        bio: v.optional(v.string()),
        email: v.string(),
        clerkId : v.string(),
    },

    handler : async (ctx , args)=>{

// this is the prompt to check if there is an existing user
   const existingUser  = await ctx.db.query("users")
   .withIndex("by_clerk_id" , (q)=> q.eq("clerkId", args.clerkId))
   .first()

//    to check for authentication
//    await ctx.auth.getUserIdentity()

   if(existingUser) return

         await ctx.db.insert("users" ,{
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            bio : args.bio,
            image: args.image,
            clerkId: args.clerkId,
            followers:0,
            following:0,
            posts:0,
        })
    } 
});



// we made a reusable component
// check the geUserIdentity
export async function getAunthenticatedUser(ctx: QueryCtx | MutationCtx) {

        const identity = await  ctx.auth.getUserIdentity();
        if(!identity) throw new Error("Unauthorized");

        const currentUser = await ctx.db.query("users")
        .withIndex("by_clerk_id", (q)=> q.eq ("clerkId" , identity.subject))
        .first()

        if(!currentUser) throw new Error("User not found")
            
            return currentUser;
    
}


// add the image change to this also 
export const updateProfile = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAunthenticatedUser(ctx);

    await ctx.db.patch(currentUser._id, {
      username: args.username,
      fullname: args.fullname,
      bio: args.bio,
    });
  },
});



export const getUserByClerkId = query({
    args:{
          clerkId : v.string()
    }, 
    handler : async (ctx, args)=>{
     const user =  await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .unique()

        return user

    },
})




export const getUserProfile  = query({
     args:{  id : v.id("users") },
     handler : async (ctx,args)=>{
           const user = await ctx.db.get(args.id)
        
           if(!user) throw new Error("User not found")
            return user
     }, 
})


export const isFollowing = query({
  args:{ followingId: v.id("users") },
  handler : async (ctx , args)=>{
    const currentUser = await getAunthenticatedUser(ctx)

    const follow = await ctx.db.query("follows")
    .withIndex("by_both", (q)=>q.eq("followerId",currentUser._id).eq("followingId", args.followingId))
    .first()

// the !! is to make it a boolean
    return !!follow

  }
})


export const toggleFollow = mutation({
  args:{
     followingId: v.id("users")
  },
  handler : async (ctx, args)=>{
     
    const currentUser = await getAunthenticatedUser(ctx)
 
     const existing = await ctx.db.query("follows")
    .withIndex("by_both", (q)=>q.eq("followerId",currentUser._id).eq("followingId", args.followingId))
    .first()

    if(existing){
      //  after deleting the id
      await ctx.db.delete(existing._id)
      await updateFollowCounts(ctx,currentUser._id,args.followingId, false)
    }else{

      await ctx.db.insert("follows",{
        followerId : currentUser._id,
        followingId: args.followingId
      })
await updateFollowCounts(ctx,currentUser._id,args.followingId, true)

// create a notification

   await ctx.db.insert("notifications",{
    senderId: currentUser._id,
    receiverId: args.followingId,
     type: "follow",
   })

    }


  }
})


async function updateFollowCounts(
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);

  if (follower && following) {
    await ctx.db.patch(followerId, {
      following: follower.following + (isFollow ? 1 : -1),
    });

    await ctx.db.patch(followingId, {
      followers: following.followers + (isFollow ? 1 : -1),
    });
  }
}

