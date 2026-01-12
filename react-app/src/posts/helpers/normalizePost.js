export const normalizePostData = (data) => {
  // Extracting the image and _id from user_id
  const { image, _id } = data.user_id;

  // Returning the normalized data
  return {
    ...data, // Spread the rest of the data
    image: image, // Add the image key at the top level
    user_id: _id, // Set user_id to the _id from the nested user_id object
  };
};
