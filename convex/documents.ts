import {v} from "convex/values";
import {mutation} from "./_generated/server";


export const create = mutation({
    args: {
        title: v.string(),
        parentDocumentId: v.optional(v.id('documents')),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;
        return await ctx.db.insert('documents', {
            title: args.title,
            parentDocumentId: args.parentDocumentId,
            isArchived: false,
            isPublished: false,
            userId:userId,
        });
    }
});
