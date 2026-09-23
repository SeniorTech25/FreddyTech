const form = document.querySelector("#briefForm");
const brief = document.querySelector("#brief");
const copyButton = document.querySelector("#copyBrief");
const note = document.querySelector("#formNote");

const emailAddress = "hello@freddytech.ca";

function buildEmailBody() {
  const message = brief.value.trim();
  return `Hey Freddy,%0D%0A%0D%0AI'm trying to do this:%0D%0A%0D%0A${encodeURIComponent(
    message || "[Write a few lines about the thing you want to build, fix, improve, or understand.]",
  )}%0D%0A%0D%0AThanks.`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const subject = encodeURIComponent("FreddyTech inquiry: here's what I'm trying to do");
  window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${buildEmailBody()}`;
  note.textContent = "Your email app should open with the message prepared.";
});

copyButton.addEventListener("click", async () => {
  const text = brief.value.trim();

  if (!text) {
    note.textContent = "Write a few lines first, then I can copy them for you.";
    brief.focus();
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    note.textContent = "Copied. You can paste that into any message to Freddy.";
  } catch {
    note.textContent = "Select the text and copy it manually from the box.";
  }
});
