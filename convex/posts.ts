import { mutation, MutationCtx, query } from "./_generated/server";
import { v } from "convex/values";
import { getAunthenticatedUser } from "./users";
import { Id } from "./_generated/dataModel";

// we have created 2 posts and we use it in the createtsx 
// to get generated files 
// we have to have an aunthenticated user in order to have an any form of file upload

 
export const generateUploadUrl = mutation(async(ctx)=>{
    const identity = await  ctx.auth.getUserIdentity();
    if(!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl()
})


export const createPost =  mutation({
    args:{
        caption: v.optional(v.string()),
        storageId : v.id("_storage"),
    },
    handler : async (ctx,args)=>{
      const currentUser =  await getAunthenticatedUser(ctx)
      const imageUrl = await ctx.storage.getUrl(args.storageId)
            if(!imageUrl) throw new Error("Image File doesnt exist")
            // create Post

      const postId =  await ctx.db.insert("posts" ,{
            userId: currentUser._id,
            imageUrl,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments:0
        })
        // when the user creates a post , we need to be able to create much more posts in order of incrementing
        await ctx.db.patch(currentUser._id,{
            posts :currentUser.posts + 1
        })

       return postId 

    },

})



export const getFeedPost = query({
    handler : async (ctx)=>{
        const currentUser = await getAunthenticatedUser(ctx)

        // get all posts
        // instead of just getting the posts , we are going to get it with some differences 
        // we would like to get the image , current id, caption , if it is liked and bookmarked
        // we have to get the posts in a descending order
        const posts = await ctx.db.query("posts")
        .order("desc")
        .collect()

        if (posts.length === 0) return [];

        // this is out what we are usinfg to validate the likes
        // some mistakes that were  made and the corretions 
        // the first problem is the async , it is an await not async , 
        // we  have to await all the data that we are trying to put on the feed
        // the posts is an object whihccontains several data inside and to assess it we have to use  a map function
        // i made a mistake of trying to directly assses the data directly

        // There are three aspects to the workflow we create the table and then , create the function in terms of 
        // a mutation or a query , then we consume the query in a front end ui

        const postsWithInfo = await Promise.all(
            // posts 
       posts.map(async (post)=>{
       const  postAuthor = ( await ctx.db.get(post.userId))!;


        const like = await ctx.db.query("likes")
           .withIndex("by_user_and_post" ,(q)=> q.eq("userId", currentUser._id).eq("postId", post._id))
           .first()

        const bookmark =  await ctx.db.query("bookmarks")
           .withIndex("by_user_and_post", (q)=> q.eq("userId" , currentUser._id).eq("postId" , post._id))
           .first()

           return {
            ...post,
            author:{
                id: postAuthor?._id,
                username: postAuthor?.username,
                image: postAuthor?.image
            },
            isLiked: !!like,
            isBookMarked: !!bookmark
           }
       })     
        )

        
        return  postsWithInfo
    }
})


export const toggleLike = mutation ({
    args: {postId : v.id("posts")},

    // what we want to do is to be able to get the postid  and toggle a boolean operator that we created called like
    handler : async (ctx , args ) =>{
        // we have to first get an aunthenticated user 
        const currentUser = await getAunthenticatedUser(ctx)

        // we have to check if we have liked the post and then create a function to update it 
        // it might not be straight forward in complexity 

        const existing = await ctx.db
        .query("likes")
        .withIndex("by_user_and_post" , (q)=> q.eq ("userId", currentUser._id).eq("postId", args.postId))
        .first()
  
        // to get the post itself

        // this technique is getting   the post by id
        const post = await ctx.db.get(args.postId)
        if(!post) throw new Error("post not found")

        if(existing){
    //    remove the like
        await ctx.db.delete(existing._id)
        await ctx.db.patch(args.postId, {likes : post.likes -1})
        // this means that the state is currently unliked 
        return false
        }else{
            // add the like
            // await ctx.db.insert(args.postId, {likes : post.likes + 1})
            // instead of this, we have to add a like to the post table

            await ctx.db.insert("likes",{
                // we have to the user and the post 
                userId : currentUser._id,
                postId: args.postId
            })

            await ctx.db.patch(args.postId ,{likes : post.likes + 1})


            // this is in the case that is not my post 
            if(currentUser._id != post.userId){
                await ctx.db.insert("notifications", {
                    receiverId : post.userId,
                    senderId : currentUser._id,
                    type : "like",
                    postId : args.postId
                })
            }

            return true

        }
    }
})


export const deletePost = mutation({
    args:{
      // check what this actually does 
        postId :v.id("posts")
    },
    handler : async ( ctx, args)=>{
      // we have t get the current user 
     // we also have to check for the post 
     //  ensure that the post id matches the user id
        const currentUser = await getAunthenticatedUser(ctx)

        const post = await ctx.db.get(args.postId)
        if(!post) throw new Error("Post not found")

            // check the table to verify 
          if(post.userId !== currentUser._id) throw new Error("user error")

  // delete the post , comment , likes and bookmarks 
  
  const likes = await ctx.db
  .query("likes")
  .withIndex("by_post", (q)=> q.eq("postId", args.postId))
  .collect()

  for (const like of likes){
    // when  you delet ethe id you delet te the like also 
  await ctx.db.delete(like._id)
  }

// this is the comment 
   const comments = await ctx.db
  .query("comments")
  .withIndex("by_post", (q)=> q.eq("postId", args.postId))
  .collect()

  for (const comment of comments){
    // when  you delet ethe id you delet te the like also 
  await ctx.db.delete(comment._id)
  }


//   this is the bookmark
 const bookmarks = await ctx.db
  .query("bookmarks")
  .withIndex("by_post", (q)=> q.eq("postId", args.postId))
  .collect()

  for (const bookmark of bookmarks){
    // when  you delet ethe id you delet te the like also 
  await ctx.db.delete(bookmark._id)
  }


  //   this is the bookmark
 const notifications = await ctx.db
  .query("notifications")
  .withIndex("by_post", (q)=> q.eq("postId", args.postId))
  .collect()

  for (const notification of notifications){
    // when  you delet ethe id you delet te the like also 
  await ctx.db.delete(notification._id)
  }


//   delete the storage file
  await ctx.storage.delete(post.storageId)

//   delete the post itself 
  await ctx.db.delete(args.postId)

//   decremen the amount of post 

await ctx.db.patch(currentUser._id,{
    posts: Math.max (0, (currentUser.posts || 1) - 1)
})


    }
})


export const getPostsByUser = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = args.userId ? await ctx.db.get(args.userId) : await getAunthenticatedUser(ctx);

    if (!user) throw new Error("User not found");

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
      .collect();

    return posts;
  },
});




