import { useCallback, useState, useMemo } from "react";
import Joi from "joi";
import { object, func } from "prop-types";

const useForm = (initialForm, schema, handleSubmit) => {
  const [data, setData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const handleReset = useCallback(() => {
    setData(initialForm);
    setErrors({});
  }, [initialForm]);

  const validateProperty = useCallback(
    ({ name, value }) => {
      if (!schema[name]) {
        console.error(`Invalid schema for property "${name}"`);
        return null;
      }
      const obj = { [name]: value };
      const generateSchema = Joi.object({ [name]: schema[name] });
      const { error } = generateSchema.validate(obj);
      return error ? error.details[0] : null;
    },
    [schema]
  );
  const handleInputChange = useCallback(
    ({ target }) => {
      const { name, value } = target;
      const errorMessage = validateProperty(target);
      if (errorMessage)
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
      else
        setErrors((prev) => {
          let obj = { ...prev };
          delete obj[name];
          return obj;
        });

      setData((prev) => ({ ...prev, [name]: value }));
    },
    [validateProperty]
  );
  const validateForm = useCallback(() => {
    const schemaForValidate = Joi.object(schema);
    const { error } = schemaForValidate.validate(data);
    if (error) return error;
    return null;
  }, [schema, data]);

  const onSubmit = useCallback(() => {
    handleSubmit(data);
  }, [handleSubmit, data]);

  const handlePublish = () => {
    const error = validateForm();
    if (error) setErrors((prev) => ({ ...prev, ...error }));
    else handleSubmit(data);
  };

  const value = useMemo(() => {
    return { data, errors };
  }, [data, errors]);

  return {
    value,
    onSubmit,
    handleInputChange,
    handleReset,
    validateForm,
    setData,
    handlePublish,
  };
};
useForm.propTypes = {
  initialForm: object.isRequired,
  schema: object.isRequired,
  handleSubmit: func.isRequired,
};

export default useForm;
