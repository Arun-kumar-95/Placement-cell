const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const res = {
    isLoggedOut: true,
  };
  const Payload = JSON.stringify(res);
  const fetchResp = await fetch("/dashboard/logout", {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });

  // converting into json
  const response = await fetchResp.json();
  console.log(response);
  const { success, message } = response;
  let path = " ";
  messageHandler(success, message, path);
});
