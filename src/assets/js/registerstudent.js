const form = document.querySelector(".register__student");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  // converting form data into object
  const res = Object.fromEntries(formData);
  //   converting it into json
  const Payload = JSON.stringify(res);

  const fetchResp = await fetch("/dashboard/registerstudent", {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // converting into json
  const response = await fetchResp.json();
  const { success, message } = response;
  let path = "dashboard/registerstudent";
  messageHandler(success, message, path);
});
