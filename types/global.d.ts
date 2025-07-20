import { NextResponse } from "next/server";

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  createdAt: Date;
  author: Author;
  upvotes: number;
  answers: number;
  views: number;
}

interface Tag {
  _id: string;
  name: string;
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

type SuccessResponse<T = null> = ActionRespons<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
