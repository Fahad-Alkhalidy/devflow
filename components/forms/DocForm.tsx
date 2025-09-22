"use client";
import { CreateDocSchema, EditDocSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { z } from "zod";
import { createDoc, editDoc } from "@/lib/actions/doc.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Routes from "@/constants/routes";
import { ReloadIcon } from "@radix-ui/react-icons";

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

interface Params {
  doc?: Doc;
  isEdit?: boolean;
}

const DocForm = ({ doc, isEdit = false }: Params) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<MDXEditorMethods>(null);

  const handleCreateDoc = async (data: z.infer<typeof CreateDocSchema>) => {
    startTransition(async () => {
      if (isEdit && doc) {
        const result = await editDoc({
          docId: doc._id,
          ...data,
        });
        if (result.success) {
          toast.success("Document Updated Successfully!", {
            description: "You have updated the document.",
            style: {
              backgroundColor: "#d4edda",
              color: "#155724",
              border: "1px solid #c3e6cb",
            },
          });
          if (result.data) router.push(Routes.DOC(result.data._id as string));
        } else {
          console.log(result);
          toast.error("Failed To Update The Document!", {
            description: "Document failed to be updated.",
            style: {
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
            },
          });
        }
        return;
      }

      const result = await createDoc(data);
      if (result?.success) {
        toast.success("Created Document Successfully!", {
          description: "You have created a new document.",
          style: {
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "1px solid #c3e6cb",
          },
        });
        if (result.data) router.push(Routes.DOC(result.data?._id));
      } else {
        toast.error("Failed To Create A Document!", {
          description: "Document failed to be created.",
          style: {
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
          },
        });
      }
    });
  };

  const form = useForm<z.infer<typeof CreateDocSchema>>({
    resolver: zodResolver(CreateDocSchema as any),
    defaultValues: {
      title: doc?.title || "",
      content: doc?.content || "",
      isPublished: doc?.isPublished ?? true,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateDoc)}
      >
        <FormField
          control={form.control}
          name={"title"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Document title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 
                  light-border-2 text-dark300_light700 no-focus min-h-[56px]
                  border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Choose a clear and descriptive title for your document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"content"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Document content <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  ref={editorRef}
                  value={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Write detailed content for your document. Use markdown
                formatting for better presentation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"isPublished"}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Publication status
              </FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm text-dark400_light800"
                  >
                    Publish this document
                  </label>
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Unpublished documents are only visible to you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            disabled={isPending}
            type="submit"
            className="primary-gradient !text-light-900 w-fit"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <p>{isEdit ? "Update Document" : "Create Document"}</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocForm;
