const domainErrorCodePrefix = "#JR-";

export type DomainError = {
  status: number;
  name: DomainErrorName;
  code: `${typeof domainErrorCodePrefix}${string}`;
  message: string;
};

export type DomainErrorFactory = () => DomainError;

export type DomainErrorName =
  | "userNotFound"
  | "authTokenNotVerified"
  | "missingAuthToken"
  | "emailNotVerified"
  | "missingRefreshToken";

const domainErrors: { [p in DomainErrorName]: DomainErrorFactory } = {
  missingRefreshToken: () => {
    return {
      status: 401,
      name: "missingRefreshToken",
      code: "#JR-0401-0000",
      message: "Missing a token for refresh auth token.",
    };
  },
  missingAuthToken: () => {
    return {
      status: 401,
      name: "missingAuthToken",
      code: "#JR-0401-0001",
      message: "Missing a token for user authentication.",
    };
  },
  authTokenNotVerified: () => {
    return {
      status: 401,
      name: "authTokenNotVerified",
      code: "#JR-0401-0002",
      message: "Failed to verify a token for user authentication.",
    };
  },
  emailNotVerified: () => {
    return {
      status: 401,
      name: "emailNotVerified",
      code: "#JR-0401-0003",
      message: "Failed to verify a token for user authentication.",
    };
  },
  userNotFound: () => {
    return {
      status: 404,
      name: "userNotFound",
      code: "#JR-0404-0000",
      message: "User not found.",
    };
  },
} as const;

export const genError = (name: DomainErrorName) => domainErrors[name]();

export const isDomainError = (value: unknown): value is DomainError => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const domainError = value as Record<keyof DomainError, unknown>;
  if (
    typeof domainError.code !== "string" ||
    !domainError.code.startsWith(domainErrorCodePrefix)
  ) {
    return false;
  }
  return true;
};
