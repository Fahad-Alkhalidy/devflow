interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  createdAt: Date;
  author: Author;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}

interface Tag {
  _id: string;
  name: string;
  questions?: number;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    detail?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface Answer {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  question: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}

interface Collection {
  _id: string;
  author: string | Author;
  question: Question;
}

interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}
interface Badges {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

interface Job {
  id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

interface Country {
  name: {
    common: string;
  };
}

interface GlobalSearchedItem {
  id: string;
  type: "question" | "answer" | "user" | "tag" | "doc";
  title: string;
}

interface Doc {
  _id: string;
  title: string;
  content: string;
  author: Author;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProMembership {
  _id: string;
  user: string | Author;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "incomplete";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  planType: "monthly" | "yearly";
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
