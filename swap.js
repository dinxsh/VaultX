document.addEventListener("DOMContentLoaded", function () {
  const inputAmount = document.querySelector(".amount-input input");
  const outputAmount = document.querySelector(".amount-output");
  const fromCurrency = document.querySelector(".swap-box:first-child select");
  const toCurrency = document.querySelector(".swap-box:last-child select");
  const cryptoValues = document.querySelectorAll(
    ".crypto-value .current-value"
  );

  // Exchange rates relative to USD
  const exchangeRates = {
    currency1: {
      name: "USD",
      rate: 1.0,
    },
    currency2: {
      name: "ETH",
      rate: 0.00039, // ~$2500 per ETH
    },
    currency3: {
      name: "SOL",
      rate: 0.0091, // ~$110 per SOL
    },
    currency4: {
      name: "SUI",
      rate: 0.71, // ~$1.40 per SUI
    },
    currency5: {
      name: "POL",
      rate: 1.25, // ~$0.80 per POL
    },
  };

  // Function to update currency names in dropdowns
  function updateCurrencyLabels() {
    const options = document.querySelectorAll("select option");
    options.forEach((option) => {
      const currency = exchangeRates[option.value];
      option.textContent = currency.name;
    });
  }

  // Function to convert between currencies
  function convert(amount, fromCurrency, toCurrency) {
    // First convert to USD
    const usdAmount = amount / exchangeRates[fromCurrency].rate;
    // Then convert from USD to target currency
    return usdAmount * exchangeRates[toCurrency].rate;
  }

  // Function to update all currency values based on input
  function updateAllValues(inputValue, fromCurrencyKey) {
    const rates = Object.entries(exchangeRates);
    rates.forEach(([key, currency], index) => {
      if (cryptoValues[index]) {
        const convertedValue = convert(inputValue, fromCurrencyKey, key);
        cryptoValues[index].textContent = `$${convertedValue.toFixed(2)}`;
      }
    });
  }

  // Function to update the swap output amount
  function updateOutput() {
    const inputValue = parseFloat(inputAmount.value) || 0;
    const convertedValue = convert(
      inputValue,
      fromCurrency.value,
      toCurrency.value
    );
    outputAmount.textContent = convertedValue.toFixed(6);

    // Update all currency values
    updateAllValues(inputValue, fromCurrency.value);
  }

  // Listen for input changes
  inputAmount.addEventListener("input", updateOutput);

  // Listen for currency selection changes
  fromCurrency.addEventListener("change", updateOutput);
  toCurrency.addEventListener("change", updateOutput);

  // Initialize
  updateCurrencyLabels();
  updateOutput();
});
