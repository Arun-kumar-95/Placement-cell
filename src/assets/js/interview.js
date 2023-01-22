const checkBox = document.querySelectorAll(".input-checkbox");
checkBox.forEach((checkBoxItem) => {
  checkBoxItem.addEventListener("change", () => {
    const checkBoxId = checkBoxItem.getAttribute("id");
    let parentContainer =
      checkBoxItem.parentElement.parentElement.parentElement;
    let studentContainer = parentContainer.querySelector(".student__details");
    const dataId = studentContainer.getAttribute("data-id");

    if (checkBoxItem.checked) {
      if (dataId == checkBoxId) {
        studentContainer.style.display = "block";
      }
    } else {
      studentContainer.style.display = "none";
    }
  });
});

// DELETE INTERVIEW

const deleteBtns = document.querySelectorAll(".btn-delete");

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    let id = btn.getAttribute("id");
    let Payload = { id };
    const fetchResp = await fetch(`/dashboard/interviews/${id}`, {
      method: "POST",
      body: JSON.stringify(Payload),
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    // converting into json
    const response = await fetchResp.json();
    const { success, message } = response;
    let path = "dashboard/interviews";
    messageHandler(success, message, path);
  });
});
