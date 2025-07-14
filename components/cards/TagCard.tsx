import Routes from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleTagRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleTagRemove,
}: Props) => {
  const handleSumbit = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  const iconClass = getDeviconClassName(name);
  const content = (
    <>
      <Badge className="flex flex-row gap-2 subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
      </Badge>
      {remove && (
        <Image
          src="/icons/close.svg"
          width={12}
          height={12}
          alt="close icon"
          className="cursor-pointer object-contain invert-0 dark:invert"
          onClick={handleTagRemove}
        />
      )}
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );
  if (compact) {
    return isButton ? (
      <button onClick={handleSumbit} className="flex justify-between gap-2">
        {content}
      </button>
    ) : (
      <Link href={Routes.TAGS(_id)} className="flex justify-between pag-2">
        {content}
      </Link>
    );
  }
};

export default TagCard;
