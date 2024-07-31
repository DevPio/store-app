const cpfCnpj = document.querySelector("input[name=cpf_cnpj]");
const email = document.querySelector("input[type=email]");
const cep = document.querySelector("input[name=cep]");
const buttonSubmit = document.querySelector(".button.update");
const formUser = document.querySelector("form");

const TOTAL_DIGITS_CPF = 11;

// buttonSubmit.disabled = true;

const fields = {
  email: true,
  cpf_cnpj: true,
  cep: true,
};

const createSpan = (text) => {
  const span = document.createElement("span");
  span.classList.add("inputError");
  span.textContent = text;

  return span;
};

const isValid = () => {
  const keys = Object.keys(fields);

  for (const key of keys) {
    if (fields[key]) return false;
  }

  return true;
};

const disabledButton = () => {
  // if (isValid()) {
  //   return (buttonSubmit.disabled = false);
  // }
  // return (buttonSubmit.disabled = true);
};

formUser.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isValid()) {
    return formUser.submit();
  }

  return disabledButton();
});
const events = ["keypress", "keyup"];

events.forEach((event) => {
  if (cpfCnpj) {
    cpfCnpj.addEventListener(event, (_) => {
      let cleanValue = cpfCnpj.value.replace(/\D/g, "");

      if (cleanValue.length > 14) {
        const items = cleanValue
          .split("")
          .filter((_, index) => index <= 13)
          .join("");
        cleanValue = items;
        cleanValue = cleanValue.replace(/(\d{2})(\d)/, "$1.$2");

        cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1.$2");

        cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1/$2");

        cleanValue = cleanValue.replace(/(\d{4})(\d)/, "$1-$2");

        cpfCnpj.value = cleanValue;
        return;
      }
      if (cleanValue.length <= TOTAL_DIGITS_CPF) {
        cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1.$2");

        cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1.$2");
        cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1-$2");

        cpfCnpj.value = cleanValue;
        return;
      }

      cleanValue = cleanValue.replace(/(\d{2})(\d)/, "$1.$2");

      cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1.$2");

      cleanValue = cleanValue.replace(/(\d{3})(\d)/, "$1/$2");

      cleanValue = cleanValue.replace(/(\d{4})(\d)/, "$1-$2");

      cpfCnpj.value = cleanValue;
    });
  }

  if (cep) {
    cep.addEventListener(event, (_) => {
      let cleanValue = cep.value.replace(/[-]/g, "");

      if (cleanValue.length > 8) {
        const items = cleanValue
          .split("")
          .filter((_, index) => index <= 7)
          .join("");

        cleanValue = items;
        cleanValue = cleanValue.replace(/(\d{4})(\d)/, "$1-$2");

        cep.value = cleanValue;
        return;
      }
      if (cleanValue.length > 4) {
        cleanValue = cleanValue.replace(/(\d{4})(\d)/, "$1-$2");

        cep.value = cleanValue;
      }
    });
  }
});

["DOMContentLoaded", "change", "focusout"].forEach((event) => {
  if (cep) {
    cep.addEventListener(event, (_) => {
      let cleanValue = cep.value.replace(/[-]/g, "");
      const spanError = cep.parentElement.querySelector(".inputError");
      if (spanError) {
        cep.parentElement.removeChild(spanError);
      }
      if (cleanValue.length === 0) {
        fields.cep = true;
        disabledButton();
        return cep.insertAdjacentElement(
          "afterend",
          createSpan("Campo Obrigatório")
        );
      }

      if (cleanValue.length < 8) {
        fields.cep = true;
        disabledButton();
        return cep.insertAdjacentElement(
          "afterend",
          createSpan("CEP inválido")
        );
      }

      fields.cep = false;
      disabledButton();
      return cep.parentElement.removeChild(spanError);
    });
  }
  if (cpfCnpj) {
    cpfCnpj.addEventListener(event, (_) => {
      let cleanValue = cpfCnpj.value.replace(/[./-]/g, "");

      const spanError = cpfCnpj.parentElement.querySelector(".inputError");
      if (spanError) {
        cpfCnpj.parentElement.removeChild(spanError);
      }

      if (cleanValue.length === 0) {
        fields.cpf_cnpj = true;
        disabledButton();
        return cpfCnpj.insertAdjacentElement(
          "afterend",
          createSpan("Campo obrigatório")
        );
      }
      if (cleanValue.length < 11) {
        fields.cpf_cnpj = true;
        disabledButton();
        return cpfCnpj.insertAdjacentElement(
          "afterend",
          createSpan("CPF inválido")
        );
      }

      if (cleanValue.length > 11 && cleanValue.length < 14) {
        fields.cpf_cnpj = true;
        disabledButton();
        return cpfCnpj.insertAdjacentElement(
          "afterend",
          createSpan("CNPJ inválido")
        );
      }

      const firstCondition = cleanValue.length >= 11 || cleanValue.length >= 14;
      if (firstCondition) {
        fields.cpf_cnpj = false;
        disabledButton();
        return cpfCnpj.parentElement.removeChild(spanError);
      }
    });
  }

  if (email) {
    email.addEventListener(event, (_) => {
      const regexEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      const spanError = email.parentElement.querySelector(".inputError");
      if (spanError) {
        email.parentElement.removeChild(spanError);
      }
      if (!email.value.match(regexEmail)) {
        fields.email = true;
        disabledButton();
        return email.insertAdjacentElement(
          "afterend",
          createSpan("Email inválido")
        );
      }

      if (email.value.match(regexEmail)) {
        fields.email = false;
        disabledButton();
        return email.parentElement.removeChild(spanError);
      }
    });
  }
});
