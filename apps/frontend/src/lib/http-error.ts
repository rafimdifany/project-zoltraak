'use client';

import { isAxiosError } from 'axios';

const DEFAULT_ERROR = 'Something went wrong. Please try again.';

type ErrorBody = {
  message?: string;
};

export const getErrorMessage = (error: unknown, fallback = DEFAULT_ERROR) => {
  if (isAxiosError(error)) {
    const data = error.response?.data as ErrorBody | undefined;
    return data?.message ?? error.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
