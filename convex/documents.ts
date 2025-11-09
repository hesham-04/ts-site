import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {Id} from "./_generated/dataModel";

export const archiveDocument = mutation({
    args: {
        documentId: v.id('documents')
    }, handler : async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;
        const document = await ctx.db.get(args.documentId);

        if (!document) {
            throw new Error("Document not found");
        }

        if (document.userId !== userId) {
            throw new Error("Not authorized to archive this document");
        }

        const archiveChildDocuments = async (documentId: Id<'documents'>) => {
            const childDocuments = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", q => q
                    .eq("userId", userId)
                    .eq("parentDocumentId", documentId))
                .collect();

            for (const childDocument of childDocuments) {
                await ctx.db.patch(childDocument._id, {
                    isArchived: true
                });
                // this is to check if the child document has its own children, which also need to be archived [deleted]
                await archiveChildDocuments(childDocument._id);
            }
        }

        const documents =  await ctx.db.patch(args.documentId, {
            isArchived: true
        });

        await archiveChildDocuments(args.documentId);

        return documents;

    }
});


export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id('documents')),
    },
    handler: async(ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        return await ctx.db
          .query("documents")
          .withIndex("by_user_parent", q =>
            q.eq("userId", userId)
             .eq("parentDocumentId", args.parentDocument)
          )
          .filter(q => q.eq(q.field("isArchived"), false))
          .order("desc")
          .collect();


    }

})


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
