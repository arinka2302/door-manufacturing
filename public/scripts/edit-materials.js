document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-quantity-materials");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const materialId = button.dataset.materialId;
      const row = button.closest(".admin-table-row-materials");
      const quantityDisplay = row.querySelector(".material-quantity-display");
      const quantityForm = row.querySelector(".update-quantity-form");
      const quantityInput = quantityForm.querySelector(
        ".material-quantity-input"
      );
      const editIcon = button.querySelector("img");

      if (quantityForm.style.display === "none") {
        quantityDisplay.style.display = "none";
        quantityForm.style.display = "block";
        quantityInput.focus();

        editIcon.src = "/images/save.png";
        editIcon.alt = "Сохранить";
      } else {
        if (quantityInput.checkValidity()) {
          quantityForm.submit();
        } else {
          alert("Пожалуйста, введите корректное количество.");
          quantityInput.reportValidity();
        }
      }
    });
  });
});
