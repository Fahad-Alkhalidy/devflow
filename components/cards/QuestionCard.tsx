import Routes from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "../Metric";

interface Props {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views },
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={Routes.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            compact
          ></TagCard>
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`. asked ${getTimeStamp(createdAt)}`}
          href={Routes.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        ></Metric>
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icon/like.svg"
            alt="like"
            value={upvotes}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          ></Metric>
          <Metric
            imgUrl="/icon/message.svg"
            alt="answers"
            value={answers}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          ></Metric>
          <Metric
            imgUrl="/icon/eye.svg"
            alt="views"
            value={views}
            title="Views"
            textStyles="small-medium text-dark400_light800"
          ></Metric>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
