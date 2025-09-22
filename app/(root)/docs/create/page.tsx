import DocForm from "@/components/forms/DocForm";

const CreateDocumentPage = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Create a Document</h1>
      <div className="mt-9">
        <DocForm />
      </div>
    </div>
  );
};

export default CreateDocumentPage;
