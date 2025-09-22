"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteDoc } from "@/lib/actions/doc.action";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();

  const handleEdit = async () => {
    if (type === "Question") {
      router.push(`/question/${itemId}/edit`);
    } else if (type === "Doc") {
      router.push(`/docs/${itemId}/edit`);
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      // Call API to delete question
      await deleteQuestion({ questionId: itemId });

      toast.success("Question deleted", {
        description: "Your question has been deleted successfully.",
      });
    } else if (type === "Answer") {
      // Call API to delete answer
      await deleteAnswer({ answerId: itemId });

      toast.success("Answer deleted", {
        description: "Your answer has been deleted successfully.",
      });
    } else if (type === "Doc") {
      // Call API to delete document
      await deleteDoc({ docId: itemId });

      toast.success("Document deleted", {
        description: "Your document has been deleted successfully.",
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}
    >
      {(type === "Question" || type === "Doc") && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "Question" ? "question" : type === "Answer" ? "answer" : "document"} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-100 !bg-primary-500 !text-light-800"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
