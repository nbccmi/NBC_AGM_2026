import { playAudio } from "./audio.js";

const mainMusic = document.getElementById("mainMusic");

window.addEventListener("load", () => {
  const site = document.querySelector(".site");

  site.classList.add("is-live");

  playAudio(mainMusic, 0.2, 7);
});
