import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

const AskQuestion = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Public Question</h1>
      <div className="mt-9">
        <QuestionForm></QuestionForm>
      </div>
    </div>
  );
};

export default AskQuestion;
