document.getElementById("openInTab").addEventListener("click", function () {
  chrome.tabs.create({
    url: chrome.runtime.getURL("pedalsup.html"),
  });
});

document
  .getElementById("copyAccountId")
  .addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(this.textContent);

      this.classList.add("copy-success");
      const originalText = this.textContent;
      this.textContent = "Copied to clipboard!";

      setTimeout(() => {
        this.textContent = originalText;
        this.classList.remove("copy-success");
      }, 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

// Get all dropdown buttons
const dropbtns = document.querySelectorAll(".dropbtn");

// Function to close all dropdowns
// Function to close all dropdowns
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown-content");
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("show");
  });

  // Reset all caret icons to default
  document.querySelectorAll(".fa-caret-up").forEach((icon) => {
    icon.classList.remove("fa-caret-up");
    icon.classList.add("fa-caret-down");
  });

  // Reset X icon back to bars
  document.querySelectorAll(".fa-xmark").forEach((icon) => {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  });
}

// Add click event to each dropdown button
dropbtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // Only proceed if the click was directly on the dropbtn or its caret icon
    if (
      !e.target.classList.contains("dropbtn") &&
      !e.target.classList.contains("fa-caret-down") &&
      !e.target.classList.contains("fa-caret-up")
    ) {
      return;
    }

    e.stopPropagation();

    const dropdownContent =
      this.parentElement.querySelector(".dropdown-content");
    const icon = this.querySelector(".fa-caret-down, .fa-caret-up");

    closeAllDropdowns();

    if (dropdownContent) {
      dropdownContent.classList.toggle("show");

      if (icon) {
        if (dropdownContent.classList.contains("show")) {
          icon.classList.remove("fa-caret-down");
          icon.classList.add("fa-caret-up");
        } else {
          icon.classList.remove("fa-caret-up");
          icon.classList.add("fa-caret-down");
        }
      }
    }
  });
});

// For the settings icon (bars)
const settingsBtn = document.querySelector(".settings");
settingsBtn.addEventListener("click", function (e) {
  // Only proceed if click was on the settings button or its icon
  if (
    !e.target.classList.contains("settings") &&
    !e.target.classList.contains("fa-bars") &&
    !e.target.classList.contains("fa-xmark")
  ) {
    return;
  }

  e.stopPropagation();

  const dropdownContent = this.parentElement.querySelector(".dropdown-content");
  const icon = this.querySelector("i");

  closeAllDropdowns();

  if (dropdownContent) {
    dropdownContent.classList.toggle("show");

    if (dropdownContent.classList.contains("show")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }
});

// Close dropdowns when clicking elsewhere on the page
document.addEventListener("click", function () {
  closeAllDropdowns();
});

document.addEventListener("DOMContentLoaded", function () {
  const currencyItems = document.querySelectorAll(".currencyItem");

  currencyItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const wrapper = this.closest(".currency-item-wrapper");
      const details = wrapper.querySelector(".currency-details");
      const expandIcon = this.querySelector(".expand-icon");

      details.classList.toggle("expanded");
      expandIcon.classList.toggle("expanded");
    });
  });
});

// Copy address functionality
document.querySelectorAll("#copyAddress").forEach((addressElement) => {
  addressElement.addEventListener("click", async function () {
    try {
      const address = this.textContent.split("Address: ")[1].split(" ")[0];
      await navigator.clipboard.writeText(address);

      this.classList.add("copy-success");
      const originalText = this.innerHTML;
      this.innerHTML = "Copied to clipboard!";

      setTimeout(() => {
        this.innerHTML = originalText;
        this.classList.remove("copy-success");
      }, 1000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });
});

// Add cryptocurrency rates
const cryptoRates = {
  solana: 63.42, // Example rate: 1 SOL = $63.42
  ethereum: 2235.15, // Example rate: 1 ETH = $2,235.15
  sui: 1.42, // Example rate: 1 SUI = $1.42
  polygon: 0.89, // Example rate: 1 MATIC = $0.89
};

// Function to update USD conversion
function updateUSDConversion() {
  const amount = document.getElementById("amount");
  const usdConversion = document.getElementById("usdConversion");
  const selectedCrypto = document.querySelector(
    'input[name="currency"]:checked'
  );

  if (amount && usdConversion && selectedCrypto) {
    const rate = cryptoRates[selectedCrypto.value];
    const usdValue = (parseFloat(amount.value) || 0) * rate;
    usdConversion.textContent = `≈ $${usdValue.toFixed(2)} USD`;
  }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amount");
  const radioInputs = document.querySelectorAll('input[name="currency"]');

  if (amountInput) {
    amountInput.addEventListener("input", updateUSDConversion);
  }

  radioInputs.forEach((radio) => {
    radio.addEventListener("change", updateUSDConversion);
  });
});

// Private key functionality
document.addEventListener("DOMContentLoaded", function () {
  const privateKeyBtn = document.getElementById("privateKeyBtn");
  const privateKeySection = document.getElementById("privateKeySection");
  const submitPasswordBtn = document.getElementById("submitPassword");
  const privateAddress = document.getElementById("privateAddress");

  if (privateKeyBtn) {
    privateKeyBtn.addEventListener("click", function () {
      privateKeySection.style.display = "block";
      privateAddress.style.display = "none";
      document.getElementById("passwordInput").value = "";
    });
  }

  if (submitPasswordBtn) {
    submitPasswordBtn.addEventListener("click", function () {
      const password = document.getElementById("passwordInput").value;
      if (password) {
        privateAddress.style.display = "block";
      }
    });
  }
});
