"use server";

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { auth } from "@/auth";
import { Interaction } from "@/database";
import Doc, { IDocDocument } from "@/database/doc.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  CreateDocSchema,
  EditDocSchema,
  GetDocSchema,
  DeleteDocSchema,
  IncrementDocViewsSchema,
  PaginatedSearchParamsSchema,
  GetUserSchema,
} from "@/lib/validations";

import dbConnect from "../mongoose";
import { createInteraction } from "./interaction.action";
import { cache } from "react";

export async function createDoc(
  params: CreateDocParams
): Promise<ActionResponse<Doc>> {
  const validationResult = await action({
    params,
    schema: CreateDocSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, isPublished } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    await dbConnect();

    const doc = await Doc.create({
      title,
      content,
      author: userId,
      isPublished,
    });

    if (!doc) throw new Error("Failed to create the document");

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "post",
        actionId: doc._id.toString(),
        actionTarget: "question", // Using question as target since we don't have doc target yet
        authorId: userId as string,
      });
    });

    return { success: true, data: JSON.parse(JSON.stringify(doc)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function editDoc(
  params: EditDocParams
): Promise<ActionResponse<IDocDocument>> {
  const validationResult = await action({
    params,
    schema: EditDocSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, isPublished, docId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    await dbConnect();

    const doc = await Doc.findById(docId);
    if (!doc) throw new Error("Document not found");

    if (doc.author.toString() !== userId) {
      throw new Error("You are not authorized to edit this document");
    }

    doc.title = title;
    doc.content = content;
    doc.isPublished = isPublished;

    await doc.save();

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "edit",
        actionId: docId,
        actionTarget: "question", // Using question as target since we don't have doc target yet
        authorId: userId as string,
      });
    });

    return { success: true, data: JSON.parse(JSON.stringify(doc)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getDoc = cache(async function getDoc(
  params: GetDocParams
): Promise<ActionResponse<Doc>> {
  const validationResult = await action({
    params,
    schema: GetDocSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { docId } = validationResult.params!;

  try {
    await dbConnect();

    const doc = await Doc.findById(docId).populate("author", "_id name image");

    if (!doc) throw new Error("Document not found");

    return { success: true, data: JSON.parse(JSON.stringify(doc)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

export async function getDocs(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    docs: Doc[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof Doc> = { isPublished: true };
  let sortCriteria = {};

  try {
    await dbConnect();

    // Search
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    // Filters
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { views: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const totalDocs = await Doc.countDocuments(filterQuery);

    const docs = await Doc.find(filterQuery)
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalDocs > skip + docs.length;

    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(docs)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementDocViews(
  params: IncrementDocViewsParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementDocViewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { docId } = validationResult.params!;

  try {
    await dbConnect();

    const doc = await Doc.findById(docId);
    if (!doc) throw new Error("Document not found");

    doc.views += 1;
    await doc.save();

    return {
      success: true,
      data: { views: doc.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserDocs(params: GetUserDocsParams): Promise<
  ActionResponse<{
    docs: Doc[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    await dbConnect();

    const totalDocs = await Doc.countDocuments({ author: userId });

    const docs = await Doc.find({ author: userId })
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalDocs > skip + docs.length;

    return {
      success: true,
      data: {
        docs: JSON.parse(JSON.stringify(docs)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteDoc(
  params: DeleteDocParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteDocSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { docId } = validationResult.params!;
  const { user } = validationResult.session!;

  try {
    await dbConnect();

    const doc = await Doc.findById(docId);
    if (!doc) throw new Error("Document not found");

    if (doc.author.toString() !== user?.id)
      throw new Error("You are not authorized to delete this document");

    await Doc.findByIdAndDelete(docId);

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: docId,
        actionTarget: "question", // Using question as target since we don't have doc target yet
        authorId: user?.id as string,
      });
    });

    revalidatePath(`/docs`);
    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
