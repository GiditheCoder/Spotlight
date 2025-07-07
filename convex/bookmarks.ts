
import { View, Text } from 'react-native'
import React from 'react'
import { mutation, query } from './_generated/server'
import { getAunthenticatedUser } from './users'
import { v } from 'convex/values'

export const toggleBookmark = mutation({
    args:{
     postId: v.id("posts"), 
    },
    handler : async ( ctx, args)=>{

    // we have to get the currenUser first 
    const currentUser = await getAunthenticatedUser(ctx)


    // we have to check wheher it is existing 
    // we checked bookmarkd by using the exsting state and it was a query based on the id

   const existing = await ctx.db.query("bookmarks")
    .withIndex("by_user_and_post", (q)=> q.eq("userId", currentUser._id).eq("postId", args.postId))
    .first()


    if(existing){
  await ctx.db.delete(existing._id)
  return false
    }else{
    await ctx.db.insert("bookmarks",{
        userId: currentUser._id,
      postId: args.postId,
    })

    return true
    }

  
    }

})

export const getBookMarkedPosts = query({
      handler : async (ctx )=>{

        const currentUser = await getAunthenticatedUser(ctx)
   
        // why do we have this in this manner 
        // we need to use the query 
         const bookmarks = await ctx.db.query("bookmarks")
         .withIndex("by_user", (q)=> q.eq ("userId", currentUser._id))
         .order("desc")
         .collect()


         const bookmarksWithInfo = await Promise.all(
          bookmarks.map( async (bookmark)=>{
          const post = await ctx.db.get(bookmark.postId)
          return post
          })
         )

         return bookmarksWithInfo

      }

})

