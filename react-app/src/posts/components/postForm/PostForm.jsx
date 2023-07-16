import React from "react";

import Input from "../../../forms/components/Input";
import Form from "../../../forms/components/Form";

const PostForm = ({ onSubmit, data, onFormChange, onInputChange }) => {
  return (
    <Form
      onSubmit={onSubmit}
      styles={{ maxWidth: "800px" }}
      onFormChange={onFormChange}
      title="Publish Post"
    >
      <Input
        name="content"
        label="What's on your mind?"
        data={data}
        multiline={true}
        onInputChange={onInputChange}
      />
    </Form>
  );
};

export default React.memo(PostForm);
