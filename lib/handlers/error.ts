import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { ZodError } from "zod";
import logger from "../logger";

export type ResourceType = "api" | "server";

const formatResoponse = (
  responseType: ResourceType,
  message: string,
  statusCode: number,
  errors?: Record<string, string[]>
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };
  return responseType === "api"
    ? NextResponse.json(responseContent, { status: statusCode })
    : { status: statusCode, ...responseContent };
};

const handleError = (error: unknown, responseType: ResourceType = "server") => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );
    const { statusCode, message, errors } = error;
    return formatResoponse(responseType, message, statusCode, errors);
  }
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Validation Error: ${validationError.message}`
    );
    return formatResoponse(
      responseType,
      validationError.message,
      validationError.statusCode,
      validationError.errors
    );
  }
  if (error instanceof Error) {
    logger.error(error.message);
    return formatResoponse(
      responseType,
      error.message || "Internal Server Error",
      500
    );
  }
  logger.error({ err: error }, "Unexpected error:");
  return formatResoponse(responseType, "Unexpected Error Occured", 500);
};

export default handleError;
