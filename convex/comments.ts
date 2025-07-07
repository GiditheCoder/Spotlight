import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getAunthenticatedUser } from "./users";



export  const addComment =  mutation( {
    //  userId: v.id("users"),
    //     postId: v.id("posts"),
    //     content: v.string(),
    // the reason we didnt pass the userId was bcause we alaready turnd that to an exported function
 args: {
          content: v.string(),
         postId: v.id("posts"),
      },

      handler : async (ctx, args) =>{
        // get cuurent user and the pst
        const currentUser = await getAunthenticatedUser(ctx)

        //   this is to get the post id
        // the way to get poss also
        const post = await ctx.db.get(args.postId)
        if(!post) throw new ConvexError("Post not Found")

            // this is to create the comment
      const commentId =  await ctx.db.insert("comments",{
              userId: currentUser._id,
              postId: args.postId,
              content: args.content,
        })

        // this is to increment the comment
       // Increment the count by 1 
      //  this is the seconf flow
        await ctx.db.patch(args.postId , {comments : post.comments + 1})

        // this is for the notifications
        if(post.userId  !== currentUser._id){
        await ctx.db.insert("notifications",{
         receiverId: post.userId,
          senderId: currentUser._id,
          type : "comment",
         postId : args.postId,
          commentId,
        })
      }
   return commentId

    }
})


export const getComment = query({
    args: {
        postId: v.id("posts"),
    },

    handler : async (ctx, args)=>{
        // gett the cureent user
      const currentUser = await getAunthenticatedUser(ctx)


      const comments =  await ctx.db.query("comments")
      .withIndex("by_post", q =>q.eq("postId", args.postId))
      .collect()

      // we use to get the image and organise the return data
    const commentsWithInfo = await Promise.all( 
        comments.map( async (comment)=>{
          // we need the comment and Id
           const user = await ctx.db.get(comment.userId)
          return {
            ...comment,
            user:{
                fullname : user!.fullname,
                image : user!.image
            }
           }
        } )
      )

      return commentsWithInfo
    }

    
})
