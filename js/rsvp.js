import { playAudio } from "./audio.js";

const rsvpForm = document.getElementById("rsvpForm");
const formContent = document.getElementById("formContent");
const success = document.getElementById("success");
const viewGridPass = document.getElementById("viewGridPass");
const backToForm = document.getElementById("backToForm");
const mainMusic = document.getElementById("mainMusic");

const googleAppsScriptUrl =
  "https://script.google.com/macros/s/AKfycbxSzAa_A04Y7Z8EhIh193o9ugz45U7YXQOyL50H3m84m_L89fHaDXV8i3Qn0xAtU9Anwg/exec";

playAudio(mainMusic, 0.2);

// Organisation → Ticket Page
const ticketTemplates = {
  NBC: "/pages/tickets/nbc-ticket.html",
  SACTWU: "/pages/tickets/sactwu-ticket.html",
  ATASA: "/pages/tickets/atasa-ticket.html",
  SACMA: "/pages/tickets/sacma-ticket.html",
  EPCMA: "/pages/tickets/epcma-ticket.html",
  SAAA: "/pages/tickets/saaa-ticket.html",
  Other: "/pages/tickets/nbc-ticket.html",
};

function generatePassId() {
  const year = "2026";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);

  return `NBC-${year}-${timestamp}-${random}`;
}

function getTicketTemplate(organisation) {
  return ticketTemplates[organisation] || ticketTemplates.Other;
}

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);

  const organisation = String(formData.get("organisation") || "").trim();

  const attendance = String(formData.get("attendance") || "").trim();

  const passData = {
    name: String(formData.get("name") || "").trim(),
    organisation,
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    attendance,

    passId: generatePassId(),

    event: "NBC AGM 2026",
    venue: "The Maslow Hotel, Sandton",
    date: "28 October 2026",
    time: "10:00 - 11:30",
  };

  const submitButton = rsvpForm.querySelector(".submit-button");

  submitButton.disabled = true;
  submitButton.innerHTML = "SUBMITTING...";

  try {
    await fetch(googleAppsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(passData),
    });

    /*
     * ATTENDING
     * Save the response and show the Grid Pass confirmation.
     */
    if (attendance === "Attending") {
      sessionStorage.setItem("nbcGridPass", JSON.stringify(passData));

      formContent.style.display = "none";
      success.classList.add("show");

      return;
    }

    /*
     * UNABLE TO ATTEND
     * Do not create/save a Grid Pass.
     * Show a simple confirmation instead.
     */
    if (attendance === "Unable to attend") {
      formContent.innerHTML = `
        <div class="rsvp-response">
          <span class="eyebrow">NBC AGM 2026 // RSVP RECEIVED</span>

          <h1>THANK YOU FOR LETTING US KNOW.</h1>

          <p>
            Your response has been recorded.
            We’re sorry you won’t be able to join us on the grid.
          </p>

          <p>
            We hope to see you at a future NBC event.
          </p>
        </div>
      `;

      return;
    }
  } catch (error) {
    console.error("RSVP submission error:", error);

    alert(
      "We could not submit your RSVP. Please check your connection and try again.",
    );

    submitButton.disabled = false;
    submitButton.innerHTML = "CONFIRM ATTENDANCE <span>→</span>";
  }
});

// Open the correct ticket page.
viewGridPass.addEventListener("click", () => {
  const storedPass = sessionStorage.getItem("nbcGridPass");

  if (!storedPass) {
    return;
  }

  const passData = JSON.parse(storedPass);

  const ticketPage = getTicketTemplate(passData.organisation);

  window.location.href = ticketPage;
});

// Allow the user to edit their response.
backToForm.addEventListener("click", () => {
  success.classList.remove("show");
  formContent.style.display = "block";
});
