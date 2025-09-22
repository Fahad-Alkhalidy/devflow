import DocCard from "@/components/cards/DocCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { DocFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_DOCS } from "@/constants/states";
import { getDocs } from "@/lib/actions/doc.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const DocumentsPage = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getDocs({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { docs, isNext } = data || {};

  return (
    <div>
      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Documentation</h1>
        <Button
          asChild
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
        >
          <Link href={ROUTES.CREATE_DOC}>
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Link>
        </Button>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.DOCS}
          iconPosition="left"
          imgSrc="/icons/search.svg"
          placeholder="Search documentation..."
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={DocFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={docs}
        empty={EMPTY_DOCS}
        render={(docs) => (
          <div className="mt-12 flex flex-col gap-5">
            {docs.map((doc) => (
              <DocCard key={doc._id} doc={doc} />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </div>
  );
};

export default DocumentsPage;
