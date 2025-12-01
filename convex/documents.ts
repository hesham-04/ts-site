import {v} from "convex/values";
import {mutation, query} from "./_generated/server";
import {Doc, Id} from "./_generated/dataModel";


export const getArchivedDocuments = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
        return await ctx.db
          .query("documents")
          .withIndex("byUser", q =>
            q.eq("userId", userId)
          ).filter(q => q.eq(q.field("isArchived"), true))
          .order("desc")
          .collect();
    }
});


export const restoreArchivedDocument = mutation( {
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
            throw new Error("Not authorized to restore this document");
        }

        const restoreChildDocuments = async (documentId: Id<'documents'>) => {
            const childDocuments = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", q => q
                    .eq("userId", userId)
                    .eq("parentDocumentId", documentId))
                .collect();

            for (const childDocument of childDocuments) {
                await ctx.db.patch(childDocument._id, {
                    isArchived: false
                });
                // this is to check if the child document has its own children, which also need to be restored
                await restoreChildDocuments(childDocument._id);
            }
        }

        const options: Partial<Doc<"documents">> = {
            // options is a object that holds the fields we want to update, like an array of patches we ca use .append on
            // This is the default behavior, we unarchive the document
            isArchived: false
        }

        if (document.parentDocumentId) {
            const parentDocument = await ctx.db.get(document.parentDocumentId);
            if (parentDocument?.isArchived){
                // If the parent document is archived, we remove the parentDocumentId to avoid dangling references;
                // The now unarchived document becomes a top-level document, so it will appear in the sidebar
                options.parentDocumentId = undefined;
            }
        }

        // We apply the patch to unarchive the document
        const updatedDocument = await ctx.db.patch(args.documentId, options);

        // We recursively unarchive all child documents
        await restoreChildDocuments(args.documentId);

        return updatedDocument;
    }
});


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

        const updatedDocument = await ctx.db.patch(args.documentId, {
            isArchived: true
        });

        await archiveChildDocuments(args.documentId);

        return updatedDocument;

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


export const deleteDocument = mutation({
    args: {documentId: v.id('documents')}, handler:async (ctx, args) => {
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
            throw new Error("Not authorized to delete this document");
        }

        const deleteChildDocuments = async (documentId: Id<'documents'>) => {
            const childDocuments = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", q => q
                    .eq("userId", userId)
                    .eq("parentDocumentId", documentId))
                .collect();

            for (const childDocument of childDocuments) {
                await ctx.db.delete(childDocument._id);
                // this is to check if the child document has its own children, which also need to be deleted
                await deleteChildDocuments(childDocument._id);
            }
        }

        await deleteChildDocuments(args.documentId);

        await ctx.db.delete(args.documentId);
    }
});


