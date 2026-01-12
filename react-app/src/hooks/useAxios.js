import axios from "axios";
import { useSnack } from "../providers/SnackBarProvider";

import { useEffect } from "react";
import { useUser } from "../users/providers/UserProvider.jsx";

const useAxios = () => {
  const snack = useSnack();
  const { token } = useUser();

  useEffect(() => {
    axios.defaults.headers.common["x-auth-token"] = token;

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const expectedError =
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500;
        if (expectedError) {
          const errorMessage =
            error.response?.data?.message || error.message || "An error occurred";
          snack("error", errorMessage);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, snack]);
};

export default useAxios;
