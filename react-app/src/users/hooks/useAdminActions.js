import { useState, useCallback } from "react";
import { useSnack } from "../../providers/SnackBarProvider";
import {
  adminGetUsersDetailed,
  adminSuspendUser,
  adminActivateUser,
  adminDeleteUser,
  adminVerifyUserEmail,
  adminUnverifyUserEmail,
  adminResetUserPassword,
  adminResendVerification,
  adminSendCustomEmail,
  adminGetEmailLogs,
} from "../service/adminApi";

const useAdminActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const snack = useSnack();

  const handleGetUsersDetailed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const users = await adminGetUsersDetailed();
      return users;
    } catch (err) {
      const errorMessage = typeof err === "string" ? err : "Error fetching users";
      setError(errorMessage);
      snack("error", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [snack]);

  const handleSuspendUser = useCallback(
    async (userId, reason) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminSuspendUser(userId, reason);
        snack("success", "User suspended successfully");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error suspending user";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleActivateUser = useCallback(
    async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminActivateUser(userId);
        snack("success", "User activated successfully");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error activating user";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleDeleteUser = useCallback(
    async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminDeleteUser(userId);
        snack("success", "User deleted successfully");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error deleting user";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleVerifyEmail = useCallback(
    async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminVerifyUserEmail(userId);
        snack("success", "Email verified successfully");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error verifying email";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleUnverifyEmail = useCallback(
    async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminUnverifyUserEmail(userId);
        snack("success", "Email unverified successfully");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error unverifying email";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleResetPassword = useCallback(
    async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminResetUserPassword(userId);
        snack("success", "Password reset email sent");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error sending reset email";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleResendVerification = useCallback(
    async (userId) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminResendVerification(userId);
        snack("success", "Verification email sent");
        return result;
      } catch (err) {
        const errorMessage =
          typeof err === "string" ? err : "Error sending verification email";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleSendCustomEmail = useCallback(
    async (emailData) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await adminSendCustomEmail(emailData);
        snack("success", result.message || "Emails sent successfully");
        return result;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error sending emails";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  const handleGetEmailLogs = useCallback(
    async (filters) => {
      try {
        setIsLoading(true);
        setError(null);
        const logs = await adminGetEmailLogs(filters);
        return logs;
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : "Error fetching email logs";
        setError(errorMessage);
        snack("error", errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [snack]
  );

  return {
    isLoading,
    error,
    handleGetUsersDetailed,
    handleSuspendUser,
    handleActivateUser,
    handleDeleteUser,
    handleVerifyEmail,
    handleUnverifyEmail,
    handleResetPassword,
    handleResendVerification,
    handleSendCustomEmail,
    handleGetEmailLogs,
  };
};

export default useAdminActions;

