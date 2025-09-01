import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import Routes from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";
import React from "react";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect("/sign-in");
  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();
  if (question?.author._id.toString() !== session?.user?.id) {
    return redirect(Routes.QUESTION(id));
  }
  return (
    <main>
      <QuestionForm question={question} isEdit></QuestionForm>
    </main>
  );
};

export default EditQuestion;
