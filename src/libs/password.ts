export enum PassValidationType {
  "LOWER_CASE" = "[a-z]",
  "UPPER_CASE" = "[A-Z]",
  "NUMERIC" = "[0-9]",
  "SPECIAL_CHARACTER" = "[@$!%*?&]"
}

export const commonRegexPass = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";

export const getValidationMessage = (password: string) => {
  const validationKeys = Object.values(PassValidationType);
  const validationType = validationKeys.find(regex => new RegExp(regex).test(password)) as PassValidationType;
  return matchPassValidation(validationType) ?? "";
}

const matchPassValidation = (type: PassValidationType): string => {
  const regex = new RegExp(type);
  const validationMessages = {
    "[a-z]": "Password must contain at least one lowercase letter.",
    "[A-Z]": "Password must contain at least one uppercase letter.",
    "[0-9]": "Password must contain at least one number.",
    "[@$!%*?&]": "Password must contain at least one special character (@, $, !, %, *, ?, &)."
  };
  return !regex.test(type) ? validationMessages[type] : "";
}


