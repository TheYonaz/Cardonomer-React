import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const parseErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data ||
      error.response?.data?.message ||
      error.message ||
      "Request failed"
    );
  }
  return "Unexpected error while contacting chat service";
};

export const fetchConversationsToken = async ({
  authToken,
  identity,
  friendlyName,
}) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/conversations/token`,
      { identity, friendlyName },
      {
        headers: {
          "x-auth-token": authToken,
        },
      }
    );

    return data;
  } catch (error) {
    return Promise.reject(parseErrorMessage(error));
  }
};




