import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import Metric from "../Metric";
import EditDeleteAction from "../user/EditDeleteAction";

interface Props {
  doc: Doc;
  showActionBtns?: boolean;
}

const DocCard = ({
  doc: { _id, title, content, author, createdAt, views },
  showActionBtns = false,
}: Props) => {
  // Truncate content for preview
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + "..." 
    : content;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={ROUTES.DOC(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {showActionBtns && <EditDeleteAction type="Doc" itemId={_id} />}
      </div>

      <div className="mt-3.5">
        <p className="text-dark400_light700 text-sm line-clamp-3">
          {truncatedContent}
        </p>
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• created ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
          titleStyles="max-sm:hidden"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default DocCard;
