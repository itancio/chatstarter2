import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "../_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsert = internalMutation({
  args: {
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, { username, image, clerkId }) => {
    // Fetch user by clerkId
    const user = await getUserByClerkId(ctx, clerkId);

    // If user is found, update. Otherwise, create new user
    if (user) {
      await ctx.db.patch(user._id, {
        username: username,
        image: image,
      });
    } else {
      await ctx.db.insert("users", {
        username: username,
        image: image,
        clerkId: clerkId,
      });
    }
  },
});

export const remove = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await getUserByClerkId(ctx, clerkId);

    // If user is found, delete.
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  console.log("User identity:", identity);
  if (!identity) {
    return null;
  }
  return await getUserByClerkId(ctx, identity.subject);
};

// Return a unique clerkID
const getUserByClerkId = async (
  ctx: QueryCtx | MutationCtx,
  clerkId: string
) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
  console.log("ClerkId: ", user?.username);
  return user;
};
