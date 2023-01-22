// const btnVerify = document.querySelector(".btnVerify");

const form = document.querySelector(".verify__otp__form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  // converting form data into object
  const res = Object.fromEntries(formData);
  //   converting it into json
  const Payload = JSON.stringify(res);
  const fetchResp = await fetch("/verify", {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });

  // converting into json
  const response = await fetchResp.json();
  const { success, message } = response;
  let path = "dashboard";
  messageHandler(success, message, path);
});
