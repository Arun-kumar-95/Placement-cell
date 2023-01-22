const notifyBtn = document.querySelector("button.notify-button");
const closeIcon = document.querySelector("button.close__notify");
const notifySlider = document.querySelector("div.notify-slider");

const btnNotification = document.querySelectorAll(".btn-notify");
const notificationMsg = document.querySelector(".warning__text");

let latestInterviews;
let expiredInterviews;

notifyBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = {
    isNotify: true,
  };
  const Payload = JSON.stringify(data);
  // display notification pannel
  const fetchResp = await fetch("/dashboard", {
    method: "POST",
    body: Payload,
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
  });

  // converting into json
  const response = await fetchResp.json();
  latestInterviews = response.data[0];
  expiredInterviews = response.data[1];

  displayNotifications(latestInterviews, "all");
});

const displayNotifications = (interviews, dataId) => {
  if (interviews.length > 0) {
    const ul = document.querySelector("ul.lists");
    ul.setAttribute("data-id", dataId);
    ul.innerHTML = "";
    ul.innerHTML = `
  <li>
  <div class="notify">
      <span>Sno</span>
      <div class="company">
          <h2>Company</h2>
      </div>
      <div class="role">
          <h2>Role</h2>
      </div>
  </div>
</li>
  `;

    // for interviews

    interviews.forEach((item, index) => {
      let li = document.createElement("li");
      li.innerHTML += `
    <div class="notify">
        <span>${index + 1}</span>
        <div class="company">
            <h2>${item.company}</h2>
        </div>
        <div class="role">
            <h2>${item.role}</h2>
        </div>
    </div>
        `;
      ul.appendChild(li);
    });
    notificationMsg.style.display = "none";
    notificationMsg.innerText = "";
  } else {
    notificationMsg.style.display = "block";
    notificationMsg.innerText = "*No interview found";
  }
};

Array.from(btnNotification).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // remove the dedault behaviour
    e.preventDefault();

    // tract the current active btn
    var current = document.getElementsByClassName("active");
    current[0].classList.remove("active");
    // add the active class to btn
    btn.classList.add("active");

    // get the data-id of the current btn when clicked
    let dataId = btn.getAttribute("data-id");
    // get all the list based on data id
    if (dataId == "all") {
      displayNotifications(latestInterviews, dataId);
    } else {
      if (expiredInterviews.length > 0) {
        displayNotifications(expiredInterviews, dataId);
      } else {
        const ul = document.querySelector("ul.lists");
        ul.innerHTML = "";
        notificationMsg.style.display = "block";
        notificationMsg.innerText = "*No Expired interviews found";
      }
    }
  });
});

// DISPLAY NOTIFY LIST SIDE BAR
notifyBtn.addEventListener("click", () => {
  let state = notifySlider.getAttribute("aria-hidden");
  state === "true"
    ? notifySlider.setAttribute("aria-hidden", "false")
    : notifySlider.setAttribute("aria-hidden", "true");

  document.querySelector(".notification__pannel").style.visibility = "visible";
});

// CLOSE THE NOTIFY LIST SIDE BAR

closeIcon.addEventListener("click", () => {
  let state = notifySlider.getAttribute("aria-hidden");
  state === "true"
    ? notifySlider.setAttribute("aria-hidden", "false")
    : notifySlider.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    document.querySelector(".notification__pannel").style.visibility = "hidden";
  }, 300);
});
