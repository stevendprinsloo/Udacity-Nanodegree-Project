export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

// export const apiUrl = process.env.VUE_APP_API_URL;
export const apiUrl = "http://127.0.0.1:5000";

export const loginUrl =
  "https://dev-ciko6qxd.us.auth0.com/authorize?audience=casting_agency&response_type=token&client_id=NHLb3O0L2oJgq1uBsdZAbDgPZjsRem67&redirect_uri=https://127.0.0.1:8085/login-results";

export const genders = [
  {
    text: "Select Gender",
  },
  {
    text: "Male",
    value: "male",
  },
  {
    text: "Female",
    value: "female",
  },
  {
    text: "Other",
    value: "other",
  },
];
