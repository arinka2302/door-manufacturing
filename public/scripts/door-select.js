document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("door");
    const doorMaterial = document.getElementById("door-material");
    const doorSize = document.getElementById("door-size");
    const doorPrice = document.getElementById("door-price");
    const doorColor = document.getElementById("door-color");
    const doorQuantity = document.getElementById("door-quantity");
    const doorGuarantee = document.getElementById("door-guarantee");
    const doorImg = document.getElementById("door-img");

    const select2 = document.getElementById("material");
    const width = document.getElementById("width");
    const height = document.getElementById("height");
    const thickness = document.getElementById("thickness");
    const doorCustomQuantity = document.getElementById("door-custom-quantity");
    const doorCustomPrice = document.getElementById("door-custom-price");

    const selectQuantity = document.getElementById("quantity");

    let selectedOption2 = null;

    select.addEventListener("change", function () {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value) {
            doorImg.src = `/images/door${selectedOption.value}.png`;
        } else {
            doorImg.src = "";
        }

        doorMaterial.textContent = selectedOption.getAttribute("data-material") || "-";
        const widthValue = selectedOption.getAttribute("data-width") || "-";
        const heightValue = selectedOption.getAttribute("data-height") || "-";
        const thicknessValue = selectedOption.getAttribute("data-thickness") || "-";
        doorSize.textContent = `${widthValue}x${heightValue}x${thicknessValue} мм`;

        doorPrice.textContent = (selectedOption.getAttribute("data-price") || "-") + "₽";
        doorColor.textContent = selectedOption.getAttribute("data-color") || "-";

        const quantity = selectedOption.getAttribute("data-quantity") || "-";
        selectQuantity.setAttribute("max", quantity);
        doorQuantity.textContent = quantity;

        doorGuarantee.textContent = (selectedOption.getAttribute("data-guarantee") || "-") + " лет";
    });

    select2.addEventListener("change", function () {
        selectedOption2 = select2.options[select2.selectedIndex];
        calculatePrice();
    });

    function calculatePrice() {
        const widthValue = parseFloat(width.value) / 1000 || 0;
        const heightValue = parseFloat(height.value) / 1000 || 0;
        const thicknessValue = parseFloat(thickness.value) / 1000 || 0;
        const quantityValue = parseFloat(doorCustomQuantity.value) || 1;

        if (!selectedOption2) {
            doorCustomPrice.value = '0';
            return;
        }

        const unitValue = parseFloat(selectedOption2.getAttribute("data-unit_price")) || 0;

        if (!widthValue || !heightValue || !thicknessValue || !unitValue || !quantityValue) {
            doorCustomPrice.value = '0';
            return;
        }

        const volume = widthValue * heightValue * thicknessValue;
        const totalPrice = volume * unitValue * quantityValue;

        doorCustomPrice.value = totalPrice.toFixed(2);
    }

    width.addEventListener("input", calculatePrice)
    height.addEventListener("input", calculatePrice)
    thickness.addEventListener("input", calculatePrice)
    doorCustomQuantity.addEventListener("input", calculatePrice)
});
