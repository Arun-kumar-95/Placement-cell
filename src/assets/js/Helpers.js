const errorWRAP = document.querySelector(".error__message");
const host = window.location.host;

// display error popup
const messageHandler = (status, message, path) => {
  errorWRAP.classList.add("alert");

  errorWRAP.children[1].textContent = message;
  if (status === true) {
    errorWRAP.classList.add("success");
    errorWRAP.children[0].classList.add("s-icon");
    setTimeout(function () {
      redirect(path);
    }, 1200);
  } else {
    errorWRAP.classList.add("false");
    errorWRAP.children[0].classList.add("e-icon");
  }

  setTimeout(function () {
    hideMessage(status);
  }, 2500);
};

const hideMessage = (status) => {
  errorWRAP.classList.remove("alert");
  if (status === "success") {
    errorWRAP.classList.remove("success");
    errorWRAP.children[0].classList.remove("s-icon");
  } else {
    errorWRAP.classList.remove("false");
    errorWRAP.children[0].classList.remove("e-icon");
  }
};

const redirect = (path) => {
  window.location.href = `http://${host}/${path}`;
};
