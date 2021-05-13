import { required, email, max, confirmed } from "vee-validate/dist/rules";
import { extend } from "vee-validate";
import i18n from "./i18n";

extend("required", {
  ...required,
  message: () => {
    return i18n.t('fieldError.required')
  }
  // message: i18n.locale
});

extend("max", {
  ...max,
  message: () => {
    return i18n.t('fieldError.max')
  }
});

extend("email", {
  ...email,
  message: () => {
    return i18n.t('fieldError.email')
  }
});

extend("confirmed", {
  ...confirmed,
  message: () => {
    return i18n.t('fieldError.confirmed')
  }
});