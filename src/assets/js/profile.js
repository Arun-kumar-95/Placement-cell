// GLOBALS
const url = window.location.href;
const uid = url.split("=")[1].split("&")[0];
const name = url.split("=")[2].split("?")[0];

const confirmBtnYes = document.querySelector(".btn-apply-yes");
const confirmBtnCancel = document.querySelector(".btn-cancel");
const confirmationPannel = document.querySelector(
  ".apply__pannel__confirmation"
);

const applyBtns = document.querySelectorAll(".apply__for__interview");

// apply for the interview
Array.from(applyBtns).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    let companyId = btn.getAttribute("data-id");
    confirmationPannel.style.visibility = "visible";

    confirmBtnYes.addEventListener("click", async (e) => {
      e.preventDefault();

      // making the request
      const data = {
        isApplied: true,
        uid,
        companyId,
      };

      const Payload = JSON.stringify(data);
      const fetchResp = await fetch(
        `/dashboard/profile/uid=${uid}&name=${name}`,
        {
          method: "POST",
          body: Payload,
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );

      // converting into json
      const response = await fetchResp.json();
      confirmationPannel.style.visibility = "hidden";
      const { success, message } = response;
      let path = `dashboard/profile/uid=${uid}&name=${name}`;
      messageHandler(success, message, path);
    });
  });
});

// control action cancel button
confirmBtnCancel.addEventListener("click", () => {
  confirmationPannel.style.visibility = "hidden";
});

// CREATE REPORT
const reportBtnCancel = document.querySelector(".btnCancelReport");
const reportBtnApply = document.querySelector(".btnReport");
const reportPannel = document.querySelector(".create__report__student__form");
const createReport = document.querySelectorAll("button.btn-result");

Array.from(createReport).forEach((report) => {
  report.addEventListener("click", (e) => {
    e.preventDefault();

    let companyId = report.getAttribute("data-id");
    reportPannel.style.visibility = "visible";
    reportBtnApply.addEventListener("click", async (e) => {
      e.preventDefault();

      selectElement = document.querySelector("#result");
      output = selectElement.value;

      if (output == "") {
        document.querySelector(".warning").style.opacity = "1";
        document.querySelector(".warning").innerText = "*Please select a value";
        return;
      }

      document.querySelector(".warning").style.opacity = "0";
      document.querySelector(".warning").innerText = "";

      // making the request
      const data = {
        isReport: true,
        uid,
        companyId,
        status: output,
      };

      const Payload = JSON.stringify(data);
      const fetchResp = await fetch(
        `/dashboard/profile/uid=${uid}&name=${name}`,
        {
          method: "POST",
          body: Payload,
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );

      // converting into json
      const response = await fetchResp.json();
      reportPannel.style.visibility = "hidden";
      const { success, message } = response;
      let path = `dashboard/profile/uid=${uid}&name=${name}`;
      messageHandler(success, message, path);
    });
  });
});

// control action cancel button
reportBtnCancel.addEventListener("click", () => {
  reportPannel.style.visibility = "hidden";
  selectElement = document.querySelector("#result").value = "";
});
