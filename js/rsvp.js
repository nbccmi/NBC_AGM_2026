import { playAudio } from "./audio.js";

const rsvpForm = document.getElementById("rsvpForm");
const formContent = document.getElementById("formContent");
const success = document.getElementById("success");
const viewGridPass = document.getElementById("viewGridPass");
const backToForm = document.getElementById("backToForm");
const mainMusic = document.getElementById("mainMusic");

const ticketTemplates = {
  NBC: "tickets/nbc-ticket.html",
  SACTWU: "tickets/sactwu-ticket.html",
  ATASA: "tickets/atasa-ticket.html",
  SACMA: "tickets/sacma-ticket.html",
  EPCMA: "tickets/epcma-ticket.html",
  SAAA: "tickets/saaa-ticket.html",
  Other: "tickets/nbc-ticket.html",
};

let isSubmitting = false;
playAudio(mainMusic, 0.2);

function generatePassId() {
  const random = window.crypto?.getRandomValues
    ? window.crypto
        .getRandomValues(new Uint32Array(1))[0]
        .toString(36)
        .toUpperCase()
    : Math.random().toString(36).slice(2).toUpperCase();
  return `NBC-2026-${Date.now().toString(36).toUpperCase()}-${random}`;
}

function getTicketTemplate(organisation) {
  return ticketTemplates[organisation] || ticketTemplates.Other;
}

function setSubmitting(submitButton, submitting) {
  isSubmitting = submitting;
  rsvpForm.setAttribute("aria-busy", String(submitting));
  submitButton.disabled = submitting;
  submitButton.innerHTML = submitting
    ? "SUBMITTING..."
    : "CONFIRM ATTENDANCE <span>→</span>";
}

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (isSubmitting || !rsvpForm.reportValidity()) return;

  const formData = new FormData(rsvpForm);
  const attendance = String(formData.get("attendance") || "").trim();
  const passData = {
    name: String(formData.get("name") || "").trim(),
    organisation: String(formData.get("organisation") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    attendance,
    passId: generatePassId(),
    event: "NBC AGM 2026",
    venue: "The Maslow Hotel, Sandton",
    date: "28 October 2026",
    time: "10:00 - 11:30",
  };

  console.log("RSVP Form Submitted:", passData);

  const submitButton = rsvpForm.querySelector(".submit-button");

  rsvpForm.elements.passId.value = passData.passId;
  setSubmitting(submitButton, true);
  rsvpForm.submit();

  if (attendance === "Attending") {
    sessionStorage.setItem("nbcGridPass", JSON.stringify(passData));
    formContent.style.display = "none";
    success.classList.add("show");
  } else {
    formContent.innerHTML = `<div class="rsvp-response" aria-live="polite"><span class="eyebrow">NBC AGM 2026 // RSVP RECEIVED</span><h1>THANK YOU FOR LETTING US KNOW.</h1><p>Your response has been recorded. We’re sorry you won’t be able to join us on the grid.</p><p>We hope to see you at a future NBC event.</p></div>`;
  }
});

viewGridPass.addEventListener("click", () => {
  try {
    const passData = JSON.parse(
      sessionStorage.getItem("nbcGridPass") || "null",
    );
    if (passData)
      window.location.href = getTicketTemplate(passData.organisation);
  } catch {
    sessionStorage.removeItem("nbcGridPass");
  }
});

backToForm.addEventListener("click", () => {
  success.classList.remove("show");
  formContent.style.display = "block";
  setSubmitting(rsvpForm.querySelector(".submit-button"), false);
});

const invitationOrganisation = new URLSearchParams(window.location.search).get(
  "organisation",
);
if (
  invitationOrganisation &&
  Object.hasOwn(ticketTemplates, invitationOrganisation)
) {
  rsvpForm.elements.organisation.value = invitationOrganisation;
}
