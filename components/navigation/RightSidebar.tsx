import Routes from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "How to create a custom hook in react1" },
  { _id: "2", title: "How to create a custom hook in react2" },
  { _id: "3", title: "How to create a custom hook in react3" },
  { _id: "4", title: "How to create a custom hook in react4" },
  { _id: "5", title: "How to create a custom hook in react5" },
  { _id: "6", title: "How to create a custom hook in react6" },
];

const popularTags = [
  { _id: "1", name: "js", questions: 100 },
  { _id: "2", name: "javascript", questions: 101 },
  { _id: "3", name: "react", questions: 102 },
  { _id: "4", name: "typescript", questions: 103 },
  { _id: "5", name: "csharp", questions: 140 },
];

const RightSidebar = () => {
  return (
    <section
      className="custom-scrollbar pt-36 background-light900_dark200 light-border
     sticky right-0 top-0 flex h-screen w-[350px]
      flex-col gap-6 overflow-y-auto border-l p-6
       shadow-light-300 dark:shadow-none max-xl:hidden"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={Routes.QUESTION(_id)}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                alt="Chevron"
                width={20}
                height={20}
                className="invert-colors"
              ></Image>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            ></TagCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
