const form = document.querySelector("form.card");

const button = document.querySelector("button.delete");

document.addEventListener("DOMContentLoaded", () => {
  form.setAttribute("enctype", "multipart/form-data");
});

button.addEventListener("click", (_) => {
  form.removeAttribute("enctype");

  const value = form.action.replace("?_method=PUT", "?_method=DELETE");

  form.action = value;
  form.submit();
});
