import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Get all users with detailed information
 */
export const adminGetUsersDetailed = async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/users/admin/users/detailed`);
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Suspend a user account
 */
export const adminSuspendUser = async (userId, reason) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/users/admin/users/${userId}/suspend`,
      { reason }
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Activate a suspended user account
 */
export const adminActivateUser = async (userId) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/users/admin/users/${userId}/activate`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Delete a user account
 */
export const adminDeleteUser = async (userId) => {
  try {
    const { data } = await axios.delete(
      `${apiUrl}/users/admin/users/${userId}`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Clear user's card-related data (cart + decks)
 */
export const adminClearUserCards = async (userId) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/users/admin/users/${userId}/clear-cards`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Manually verify a user's email
 */
export const adminVerifyUserEmail = async (userId) => {
  try {
    const { data } = await axios.put(
      `${apiUrl}/users/admin/users/${userId}/verify-email`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Unverify a user's email
 */
export const adminUnverifyUserEmail = async (userId) => {
  try {
    const { data} = await axios.put(
      `${apiUrl}/users/admin/users/${userId}/unverify-email`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Admin reset user password (sends reset email)
 */
export const adminResetUserPassword = async (userId) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/users/admin/users/${userId}/reset-password`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Admin resend verification email
 */
export const adminResendVerification = async (userId) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/users/admin/users/${userId}/resend-verification`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Send custom email to users
 */
export const adminSendCustomEmail = async (emailData) => {
  try {
    const { data } = await axios.post(
      `${apiUrl}/users/admin/emails/send-custom`,
      emailData
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

/**
 * Get email logs with filters
 */
export const adminGetEmailLogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const { data } = await axios.get(
      `${apiUrl}/users/admin/emails/logs${params ? `?${params}` : ""}`
    );
    return Promise.resolve(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      return Promise.reject(errorMessage);
    }
    return Promise.reject("An unexpected error occurred!");
  }
};

