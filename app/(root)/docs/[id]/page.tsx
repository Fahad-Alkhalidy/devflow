import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React from "react";

import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getDoc, incrementDocViews } from "@/lib/actions/doc.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { Preview } from "@/components/editor/preview";
import { Metadata } from "next";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteDoc } from "@/lib/actions/doc.action";
import { revalidatePath } from "next/cache";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data: doc } = await getDoc({ docId: id });
  if (!success || !doc) {
    return {
      title: "Document not found",
      description: "The document you are looking for does not exist.",
    };
  }
  return {
    title: doc.title,
    description: doc.content.slice(0, 100),
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.content.slice(0, 100),
    },
  };
}

const DocumentDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { success, data: doc } = await getDoc({ docId: id });
  const session = await auth();

  after(async () => {
    await incrementDocViews({ docId: id });
  });

  if (!success || !doc) return redirect("/404");

  const { author, createdAt, views, content, title, isPublished, images } = doc;

  // Check if user is the author
  const isAuthor = session?.user?.id === author._id;

  const handleDelete = async () => {
    "use server";
    await deleteDoc({ docId: id });
    revalidatePath("/docs");
    redirect("/docs");
  };

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          {isAuthor && (
            <div className="flex items-center justify-end gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/docs/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <form action={handleDelete}>
                <Button variant="destructive" size="sm" type="submit">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </form>
            </div>
          )}
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>

        {!isPublished && (
          <div className="mt-2 rounded-md bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-sm text-yellow-800">
              This document is not published and is only visible to you.
            </p>
          </div>
        )}
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` created ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      {/* Display Images */}
      {images && images.length > 0 && (
        <div className="mb-8">
          <h3 className="h3-bold text-dark200_light900 mb-4">Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((imageUrl: string, index: number) => (
              <div key={index} className="relative group">
                <div className="aspect-video relative overflow-hidden rounded-lg border">
                  <img
                    src={imageUrl}
                    alt={`Document image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Preview content={content} />
    </>
  );
};

export default DocumentDetails;
