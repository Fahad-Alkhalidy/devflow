import { redirect } from "next/navigation";
import { getDoc } from "@/lib/actions/doc.action";
import { auth } from "@/auth";
import DocForm from "@/components/forms/DocForm";

const EditDocumentPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const session = await auth();
  
  const { success, data: doc } = await getDoc({ docId: id });

  if (!success || !doc) {
    redirect("/404");
  }

  // Check if user is the author
  if (session?.user?.id !== doc.author._id) {
    redirect("/403");
  }

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Document</h1>
      <div className="mt-9">
        <DocForm doc={doc} isEdit={true} />
      </div>
    </div>
  );
};

export default EditDocumentPage;
