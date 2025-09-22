const Routes = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  JOBS: "/jobs",
  TAGS: "/tags",
  DOCS: "/docs",
  CREATE_DOC: "/docs/create",
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/question/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  DOC: (id: string) => `/docs/${id}`,
  EDIT_DOC: (id: string) => `/docs/${id}/edit`,
  SIGN_IN_WITH_OAUTH: "signin-with-oauth",
};

export default Routes;
