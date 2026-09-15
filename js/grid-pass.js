const ticketPaths = {
  NBC: "nbc-ticket.html", SACTWU: "sactwu-ticket.html", ATASA: "atasa-ticket.html",
  SACMA: "sacma-ticket.html", EPCMA: "epcma-ticket.html", SAAA: "saaa-ticket.html",
  Other: "nbc-ticket.html",
};

function getStoredPass() {
  try {
    const pass = JSON.parse(sessionStorage.getItem("nbcGridPass") || "null");
    return pass && typeof pass === "object" ? pass : null;
  } catch {
    sessionStorage.removeItem("nbcGridPass");
    return null;
  }
}

const passData = getStoredPass();
const isGenericPassPage = Boolean(document.getElementById("ticketContent"));

if (!passData) {
  const fallbackOrganisation = Object.entries(ticketPaths).find(([, path]) =>
    document.body.className.includes(`ticket-page-${path.replace("-ticket.html", "")}`),
  )?.[0];
  const rsvpUrl = new URL(isGenericPassPage ? "rsvp.html" : "../rsvp.html", window.location.href);
  if (fallbackOrganisation) rsvpUrl.searchParams.set("organisation", fallbackOrganisation);
  window.location.replace(rsvpUrl.href);
} else if (isGenericPassPage) {
  const organisation = ticketPaths[passData.organisation] ? passData.organisation : "Other";
  window.location.replace(`tickets/${ticketPaths[organisation]}`);
} else {
  const attendeeName = document.getElementById("attendeeName");
  const organisation = document.getElementById("organisation");
  const attendance = document.getElementById("attendance");
  const passId = document.getElementById("passId");
  const qrCode = document.getElementById("qrCode");

  if (attendeeName) attendeeName.textContent = passData.name || "GUEST";
  if (organisation) organisation.textContent = passData.organisation || "NBC";
  if (attendance) attendance.textContent = passData.attendance || "ATTENDING";
  if (passId) passId.textContent = passData.passId || "NBC-2026-0000";

  if (qrCode && typeof QRCode !== "undefined") {
    qrCode.innerHTML = "";
    new QRCode(qrCode, {
      text: JSON.stringify({ event: passData.event || "NBC AGM 2026", name: passData.name || "", organisation: passData.organisation || "", attendance: passData.attendance || "", passId: passData.passId || "" }),
      width: 100, height: 100, colorDark: "#000000", colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  }
}
