import { getTags } from "@/lib/actions/tag.action";
import React from "react";

const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    filter: "",
    query: "",
  });
  const { tags } = data || {};
  console.log("Tags:", tags);
  return <div></div>;
};

export default Tags;
