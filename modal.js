// modal.js
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openForm");
  const modal = document.getElementById("formModal");
  const closeBtn = document.getElementById("closeModal");

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hide");
    modal.classList.add("show");
  });

  const closeModal = () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
    setTimeout(() => {
      modal.classList.remove("hide");
      modal.style.display = "none";
    }, 500);
  };

  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  const observer = new MutationObserver(() => {
    if (modal.classList.contains("show")) {
      modal.style.display = "block";
    }
  });
  observer.observe(modal, { attributes: true });
});
