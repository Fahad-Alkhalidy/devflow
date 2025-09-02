import mongoose from "mongoose";

import { Interaction, User } from "@/database";
import { IInteractionDocument } from "@/database/interaction.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateInteractionSchema } from "../validations";
import { Action } from "sonner";

export async function createInteraction(
  params: CreateInteractionParams
): Promise<ActionResponse<IInteractionDocument>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    action: actionType,
    actionId,
    actionTarget,
    authorId, // person who owns the content (question/answer)
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session }
    );

    // Update reputation for both the performer and the content author
    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

async function updateReputation(params: UpdateReputationParams) {
  const { interaction, session, performerId, authorId } = params;
  const { action, actionType } = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: authorPoints } },
      { session }
    );

    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: performerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session }
  );
}

/*
async function getRecommendedQuestions(userId: string) {
  // Step 1: Get all interactions related to questions
  const interactions = await Interaction.find({
    user: userId,
    actionType: "question",
    action: { $in: ["post", "upvote", "bookmark", "view"] },
  }).lean();

  // Step 2: Extract all question IDs from those interactions
  const interactedQuestionIds = interactions.map((i) => i.actionId);

  // Step 3: Get all tags from those questions
  const questions = await mongoose
    .model("Question")
    .find(
      {
        _id: { $in: interactedQuestionIds },
      },
      "tags"
    )
    .lean();

  // Step 4: Combine tags and remove duplicates
  const uniqueTags = [...new Set(questions.flatMap((q: any) => q.tags))];

  // Step 5: Search for other questions with those tags, not interacted with or created by user
  const recommendedQuestions = await mongoose
    .model("Question")
    .find({
      tags: { $in: uniqueTags },
      _id: { $nin: interactedQuestionIds },
      author: { $ne: userId },
    })
    .lean();

  return recommendedQuestions;
}

*/
