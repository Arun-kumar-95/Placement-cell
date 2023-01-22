const form = document.querySelector(".filter__student");
const searchBtn = document.querySelector("button.search-field-button");
const searchBox = document.getElementById("search-box");
const clearField = document.querySelector("a.clear-form img");
const table = document.querySelector("table.student-search-table");
const tableBody = table.querySelector("tbody");
const tableHead = table.querySelector("thead");
const textwarn = document.querySelector("div.text-warning");

const filterStudent = async () => {
  const formData = new FormData(form);
  // converting form data into object
  const res = Object.fromEntries(formData);
  //   converting it into json
  const Payload = JSON.stringify(res);

  const fetchResp = await fetch("/dashboard/allstudents", {
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

  handleInput();
  tableBody.innerHTML = "";
  textwarn.innerHTML = "";

  table.style.visibility = "visible";

  if (response.data.length > 0) {
    response.data.forEach((item, index) => {
      // table.classList.add("display");
      table.style.visibility = "visible";

      textwarn.innerHTML = "";
      displayResult(item, index);
    });
  } else {
    textwarn.innerHTML = `<p>*There is no student matching the search term</p>`;
    table.style.visibility = "hidden";
  }
};
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  filterStudent();
});

// DISPLAY RESULT HANDLER
const displayResult = (item, index) => {
  const { DSA, WEB_DEV, REACT } = item.score[0];

  tableBody.innerHTML += `
              <tr>
                      <td>
                      <p>
                      ${index + 1}
                      </p>
                      </td>
                      <td style="text-transform:capitalize"><p>${
                        item.name
                      }</p></td>
                      <td><p>${item.batch}</p></td>
                      <td><p>${item.phone}</p></td>
                      <td><p>${item.email}</p></td>
                      <td><p>${item.status}</p></td>
                      <td style="text-transform:capitalize"><p>${
                        item.college
                      }</p></td>
                 
                       <td>
                          <li>DSA - ${DSA}</li>
                          <li>WEB DEV - ${WEB_DEV}</li>
                          <li>REACT - ${REACT}</li>
                       </td>

                       <td>
                       <form method="GET"
                           action="/dashboard/profile/uid=${item._id}&name=${
    item.name
  }">
                           <button class="btn check__activity"
                               id="<%= item._id %>">
                               <svg id="icon-activities" viewBox="0 0 256 256"
                                   width="20" height="20">
                                   <path
                                       d="M128 10.3A117.7 117.7 0 1 0 245.7 128 117.7 117.7 0 0 0 128 10.3zm0 210.2a92.5 92.5 0 1 1 92.5-92.5 92.5 92.5 0 0 1-92.5 92.5z">
                                   </path>
                                   <path
                                       d="M178.3 75a79.6 79.6 0 0 0-11.2 1.2q-7 1.2-10 3.7t-7 6q-4 4.2-13 17.3a290.3 290.3 0 0 0-16.3 26.3Q113 143 108 154a39.5 39.5 0 0 0-10-10q-5.4-4-10-4t-10 4q-5.7 4-5.7 9.5 0 3.7 5 9A135.2 135.2 0 0 1 90 179a69.5 69.5 0 0 0 5.3 7.7 9.6 9.6 0 0 0 2.7 1.6q1.7.8 8 .8 7.7 0 10.3-1a12 12 0 0 0 3.7-3q1.2-2 5.5-12.2a281.7 281.7 0 0 1 24.3-46.6q15.3-24 29.5-37a29.6 29.6 0 0 0 4-4.3 6 6 0 0 0 .8-3.3 5.4 5.4 0 0 0-1-4 5.7 5.7 0 0 0-4-1.6z">
                                   </path>
                               </svg>

                           </button>
                       </form>
                   </td>
                      <td>
                      <form method="GET" action="/dashboard/registerstudent/${
                        item._id
                      }">
                      <button class="btn btn-edit" id="${item._id}">
                      <svg fill="currentColor" width="20px" height="20px"
                          viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
                          focusable="false">
                          <g>
                              <path
                                  d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z">
                              </path>
                          </g>
                      </svg>
                  </button>
                  </form>
                      </td>

                      <td>
                      <form action="" class="delete__student__form">
                      <button class="btn btn-delete"
                      id="${item._id}">
                      <svg fill="currentColor" width="20px" height="20px"
                          viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
                          focusable="false">
                          <g>
                              <path
                                  d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
                              </path>
                          </g>
                      </svg>
                  </button>
                  </form>
                  </td>

                      </tr>
                `;
};

const handleInput = () => {
  let input = searchBox.value.trim();
  if (input.length > 0) {
    clearField.classList.add("highlight");
  } else {
    clearField.classList.remove("highlight");
  }
};

searchBox.addEventListener("keyup", () => {
  handleInput();
  filterStudent();
});

clearField.addEventListener("click", () => {
  let input = searchBox.value.trim();

  if (input.length > 0) {
    searchBox.value = "";
    textwarn.innerHTML = "";
    clearField.classList.remove("highlight");
    filterStudent();
  }
});

// for deleting the students

const deleteBtns = document.querySelectorAll(".btn-delete");

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    let id = btn.getAttribute("id");
    let Payload = { id };
    const fetchResp = await fetch(`/dashboard/allstudents/${id}`, {
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
    let path = "dashboard/allstudents";
    messageHandler(success, message, path);
  });
});

// update students
