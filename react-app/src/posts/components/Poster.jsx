import { Button, TextField } from "@mui/material";
import Joi from "joi";
import React from "react";
import useForm from "../../forms/hooks/useForm";
import useHandleUsers from "../../users/hooks/useHandleUsers";
import { useUser } from "../../users/providers/UserProvider";

const initialForm = { postContent: "" };

const schema = {
  postContent: Joi.string().min(1).required(),
};

const Poster = () => {
  const { user } = useUser();
  const { handlePublish } = useHandleUsers();
  const { value, ...rest } = useForm(initialForm, schema, handlePublish);
  const { handleInputChange } = rest;
  return (
    <div>
      <TextField
        name="postContent"
        value={value.postContent}
        onChange={handleInputChange}
        label="Write a new post"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        error={value.errors}
        helperText={value.errors && value.errors.message}
      />
      <Button
        onClick={() => handlePublish(value.data)}
        variant="contained"
        color="primary"
      >
        Publish
      </Button>
    </div>
  );
};

export default Poster;
