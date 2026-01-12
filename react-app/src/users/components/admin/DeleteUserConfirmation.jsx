import React from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import PropTypes from "prop-types";

const DeleteUserConfirmation = ({ open, onClose, onDelete, user, loading }) => {
  if (!user) return null;

  const userName = `${user.name.first} ${user.name.last}`;

  const message = `
You are about to permanently delete ${userName} (${user.email}).

This will delete:
• User account and profile
• All posts (${user.publishedPosts?.length || 0} posts)
• All decks (${user.stats?.decks || user.pokemonDecks?.length || 0} decks)
• All associated data

⚠️ This action CANNOT be undone!

Type "${userName}" to confirm deletion.
  `.trim();

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={onDelete}
      title="Delete User Account"
      message={message}
      confirmText="Delete Permanently"
      cancelText="Cancel"
      confirmationInput={{
        label: "Type user's name to confirm",
        placeholder: userName,
        value: userName,
      }}
      dangerous={true}
      loading={loading}
    />
  );
};

DeleteUserConfirmation.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.shape({
      first: PropTypes.string.isRequired,
      last: PropTypes.string.isRequired,
    }).isRequired,
    email: PropTypes.string.isRequired,
    publishedPosts: PropTypes.array,
    pokemonDecks: PropTypes.array,
    stats: PropTypes.shape({
      decks: PropTypes.number,
    }),
  }),
  loading: PropTypes.bool,
};

export default DeleteUserConfirmation;

