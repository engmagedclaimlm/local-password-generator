document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded");
    // capture the input fields, checkboxes and buttons
    // input fields: 
    const lengthInput = document.getElementById("length");
    const countInput = document.getElementById("count");
    const symbolsInput = document.getElementById("symbols");
    // checkboxes: 
    const numbersCheckbox = document.getElementById("numbers");
    const uppercaseLettersCheckbox = document.getElementById("uppercase-letters");
    const lowercaseLettersCheckbox = document.getElementById("lowercase-letters");
    const symbolsCheckbox = document.getElementById("special-characters");
    const noRepeatCheckbox = document.getElementById("no-repeat");
    // buttons: 
    const copyAllPasswordsButton = document.getElementById("copy-all-passwords-button");
    const copyFirstPasswordButton = document.getElementById("copy-first-password-button");
    const copyRandomPasswordButton = document.getElementById("copy-random-password-button");
    const copyLastPasswordButton = document.getElementById("copy-last-password-button");
    const generateButton = document.getElementById("generate-button");
    // global variables: 
    const uppercaseLettersArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLettersArray = "abcdefghijklmnopqrstuvwxyz";
    const upperAndLowercaseLettersArray = uppercaseLettersArray + lowercaseLettersArray;
    const symbolsArray = symbolsInput.value || "!@#$%^&*()_+-=[]{}|;:,.<>?~";

    const lettersMapping = 1;
    const numbersMapping = 2;
    const symbolsMapping = 3;

    // add event listeners
    function addEventListeners() {
        // add event listeners to the input fields, checkboxes and buttons
        lengthInput.addEventListener("input", handleInputChange);
        countInput.addEventListener("input", handleInputChange);
        numbersCheckbox.addEventListener("change", handleInputChange);
        uppercaseLettersCheckbox.addEventListener("change", handleInputChange);
        lowercaseLettersCheckbox.addEventListener("change", handleInputChange);
        symbolsCheckbox.addEventListener("change", handleInputChange);
        noRepeatCheckbox.addEventListener("change", handleInputChange);
        copyAllPasswordsButton.addEventListener("click", handleCopyAllPasswordsButtonClick);
        copyFirstPasswordButton.addEventListener("click", handleCopyFirstPasswordButtonClick);
        copyRandomPasswordButton.addEventListener("click", handleCopyRandomPasswordButtonClick);
        copyLastPasswordButton.addEventListener("click", handleCopyLastPasswordButtonClick);
        symbolsInput.addEventListener("input", handleSymbolsInput);
        symbolsInput.addEventListener("keyup", handleSymbolsInput);
        generateButton.addEventListener("click", handleGenerateButtonClick);
    }

    init();

    function init() {
        // add event listeners
        addEventListeners();
        // populate the passwords table
        generatePasswordsAndPopulateTable();
    }

    // generate passwords
    function handleInputChange(event) {
        // generate passwords
        generatePasswordsAndPopulateTable();
    }

    // generate passwords
    function generatePasswordsAndPopulateTable() {
        // inputs: 
        const length = lengthInput.value;
        const count = countInput.value;
        // checkboxes: 
        const digits = numbersCheckbox.checked;
        const uppercase = uppercaseLettersCheckbox.checked;
        const lowercase = lowercaseLettersCheckbox.checked;
        const symbols = symbolsCheckbox.checked;
        const noRepeat = noRepeatCheckbox.checked;
        // at least one checkbox out of digits, uppercase, lowercase, symbols must be checked
        if (!digits && !uppercase && !lowercase && !symbols) {
            console.log("At least one checkbox out of digits, uppercase, lowercase, symbols must be checked");
            showModal("Error", "At least one checkbox out of digits, uppercase, lowercase, symbols must be checked", "red");
            return;
        }
        console.log("length", length, "count", count, "digits", digits, "uppercase", uppercase, "lowercase", lowercase, "symbols", symbols, "noRepeat", noRepeat);
        // generate passwords
        const passwords = [];
        for (let i = 0; i < count; i++) {
            console.log("i", i, "count", count);
            const password = generatePassword(length, digits, symbols, uppercase, lowercase, noRepeat);
            console.log("password", password);
            if (password) { // Only add non-empty passwords
                passwords.push(password);
            } else {
                return; // Exit if password generation failed
            }
        }
        
        populatePasswordsTable(passwords);
        return passwords;
    }

    // generate password
    function generatePassword(length, digits, symbols, uppercase, lowercase, noRepeat) {
        console.log("generatePassword", "length", length, "digits", digits, "symbols", symbols, "uppercase", uppercase, "lowercase", lowercase, "noRepeat", noRepeat);
        
        // Add safety check for impossible combinations
        if (noRepeat) {
            let availableChars = 0;
            if (digits) availableChars += 10; // 0-9
            if (uppercase) availableChars += 26; // A-Z
            if (lowercase) availableChars += 26; // a-z
            if (symbols) availableChars += symbolsArray.length;
            
            if (length > availableChars) {
                showModal("Error", `Cannot generate password of length ${length} with no repeats - only ${availableChars} unique characters available`, "red");
                return "";
            }
        }

        // Add maximum attempts to prevent infinite loops
        const maxAttempts = length * 100;
        let attempts = 0;
        
        // generate password
        const password = [];
        for (let i = 0; i < length; i++) {
            attempts++;
            if (attempts > maxAttempts) {
                showModal("Error", "Could not generate password with current settings - too many attempts", "red");
                return "";
            }

            const character = generateRandomCharacter(digits, symbols, uppercase, lowercase);
            if (character === "") {
                i--;
            } else {
                if (noRepeat && password.includes(character)) {
                    i--;
                } else {
                    password.push(character);
                }
            }
        }
        return password.join("");
    }

    // copyAllPasswordsButton
    function handleCopyAllPasswordsButtonClick(event) {
        // copy all passwords
        const tableRows = document.getElementById("passwords-table-body").rows;
        const passwords = Array.from(tableRows).map(row => row.cells[0].textContent);
        navigator.clipboard.writeText(passwords.join("\n"));
        console.log("passwords", passwords);
        
        // Find and update the icon
        const iconElement = copyAllPasswordsButton.querySelector('.fas');
        iconElement.classList.remove("fa-copy");
        iconElement.classList.add("fa-check");
        setTimeout(() => {
            iconElement.classList.remove("fa-check");
            iconElement.classList.add("fa-copy");
        }, 2000);
    }

    // copyFirstPasswordButton
    function handleCopyFirstPasswordButtonClick(event) {
        console.log("handleCopyFirstPasswordButtonClick", event);
        // copy the first password
        const firstPassword = document.getElementById("passwords-table-body").rows[0].cells[0].textContent;
        navigator.clipboard.writeText(firstPassword);
        console.log("firstPassword", firstPassword);
        
        // Find and update the icon
        const iconElement = copyFirstPasswordButton.querySelector('.fas');
        iconElement.classList.remove("fa-copy");
        iconElement.classList.add("fa-check");
        setTimeout(() => {
            iconElement.classList.remove("fa-check");
            iconElement.classList.add("fa-copy");
        }, 2000);
    }

    // copyRandomPasswordButton
    function handleCopyRandomPasswordButtonClick(event) {
        console.log("handleCopyRandomPasswordButtonClick", event);
        // table length
        const tableLength = document.getElementById("passwords-table-body").rows.length;
        // random row index
        const randomRowIndex = Math.floor(Math.random() * tableLength);
        // copy the random password
        const randomPassword = document.getElementById("passwords-table-body").rows[randomRowIndex].cells[0].textContent;        
        navigator.clipboard.writeText(randomPassword);
        console.log("randomPassword", randomPassword);
        // Find and update the icon
        const iconElement = copyRandomPasswordButton.querySelector('.fa-random');
        iconElement.classList.remove("fa-random");
        iconElement.classList.add("fa-check");
        setTimeout(() => {
            iconElement.classList.remove("fa-check");
            iconElement.classList.add("fa-random");
        }, 2000);
    }

    // copy last password
    function handleCopyLastPasswordButtonClick(event) {
        // get table length
        const tableLength = document.getElementById("passwords-table-body").rows.length;
        // copy the last password (subtract 1 from length since array is 0-based)
        const lastPassword = document.getElementById("passwords-table-body").rows[tableLength - 1].cells[0].textContent;
        navigator.clipboard.writeText(lastPassword);
        // Find and update the icon
        const iconElement = copyLastPasswordButton.querySelector('.fas');
        iconElement.classList.remove("fa-copy");
        iconElement.classList.add("fa-check");
        setTimeout(() => {
            iconElement.classList.remove("fa-check");
            iconElement.classList.add("fa-copy");
        }, 2000);
    }

    // copy button
    function handleCopyButtonClick(event) {
        // copy the password
        const buttonId = event.target.id || event.target.parentElement.id;
        const passwordCellId = "password-cell-" + buttonId.split("-")[2];
        const password = document.getElementById(passwordCellId).textContent;
        navigator.clipboard.writeText(password);
        // Find the icon element (either the target itself or the child of the button)
        const iconElement = event.target.classList.contains('fas') ? 
            event.target : 
            event.target.querySelector('.fas');
        // change the icon
        iconElement.classList.remove("fa-copy");
        iconElement.classList.add("fa-check");
        // change the icon back after 2 seconds
        setTimeout(() => {
            iconElement.classList.remove("fa-check");
            iconElement.classList.add("fa-copy");
        }, 2000);
    }

    // populate poasswords table: 
    function populatePasswordsTable(passwords) {
        // populate passwords table
        const passwordsTableBody = document.getElementById("passwords-table-body");
        // clear the table
        passwordsTableBody.innerHTML = "";
        // populate the table
        for (let i = 0; i < passwords.length; i++) {
            passwordsTableBody.appendChild(createPasswordRow(passwords[i], i));
        }
    }

    function createPasswordRow(password, index) {
        const passwordRow = document.createElement("tr");
        // cell 1: password
        const passwordCell = document.createElement("td");
        passwordCell.className = "text-center align-middle";
        passwordCell.textContent = password;
        passwordCell.id = "password-cell-" + index;
        passwordRow.appendChild(passwordCell);
        // cell 2: copy button
        const buttonCell = document.createElement("td");
        buttonCell.className = "text-center align-middle";
        // copy button
        const copyButton = document.createElement("button");
        copyButton.className = "row-copy-button hover-button";
        const copyIcon = document.createElement("i");
        copyIcon.className = "fas fa-copy";
        copyButton.id = "copy-button-" + index;
        // add event listener to the copy button
        copyButton.addEventListener("click", handleCopyButtonClick);
        // append copy icon
        copyButton.appendChild(copyIcon);
        // append copy button
        buttonCell.appendChild(copyButton);
        // append button cell
        passwordRow.appendChild(buttonCell);
        return passwordRow;
    }

    function generateRandomCharacter(digits, symbols, uppercase, lowercase) {
        // Create an array of available character types based on checked options
        const availableTypes = [];
        if (digits) availableTypes.push(numbersMapping);
        if (uppercase || lowercase) availableTypes.push(lettersMapping);
        if (symbols) availableTypes.push(symbolsMapping);
        
        // Randomly select from available types
        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        if (randomType === numbersMapping) {
            return generateRandomNumber(0, 9).toString();
        }
        if (randomType === lettersMapping) {
            if (uppercase && lowercase) {
                return generateRandomLetter(upperAndLowercaseLettersArray);
            } else if (uppercase) {
                return generateRandomLetter(uppercaseLettersArray);
            } else if (lowercase) {
                return generateRandomLetter(lowercaseLettersArray);
            }
        }
        if (randomType === symbolsMapping) {
            return generateRandomSymbol(symbolsArray);
        }
        
        return ""; // Fallback, should rarely happen
    }

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateRandomLetter(letters) {
        return letters[Math.floor(Math.random() * letters.length)];
    }

    function generateRandomSymbol(symbols) {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function handleSymbolsInput(event) {
        // get the value of the input
        const symbols = event.target.value;
        // validate the symbols
        const symbolsInputFeedback = document.getElementById("symbols-input-feedback");
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            // check if symbol is a letter or a number
            if(symbol.match(/[a-zA-Z0-9]/)) {
                symbolsInputFeedback.textContent = "Symbols must be a special character";
                // not working: 
                symbolsInputFeedback.classList.add("invalid-feedback");
                symbolsInputFeedback.classList.remove("valid-feedback");
                showModal("Error", "Symbols must be a special character", "red");
                return;
            }
        }
        symbolsInputFeedback.textContent = "";
        symbolsInputFeedback.classList.add("valid-feedback");
        symbolsInputFeedback.classList.remove("invalid-feedback");
    }

    function handleGenerateButtonClick(event) {
        console.log("handleGenerateButtonClick", event);
        // generate passwords
        generatePasswordsAndPopulateTable();
    }

    function showModal(title, message, color) {
        // get modal elements
        const modalEl = document.getElementById("modal");
        const modalTitle = document.getElementById("modal-title");
        const modalMessage = document.getElementById("modal-message");
        // update content
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalMessage.style.color = color;
        // show the modal using Bootstrap's data attribute API
        modalEl.classList.add('show');
        modalEl.style.display = 'block';
        document.body.classList.add('modal-open');
        // create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        // add close functionality
        const closeModal = () => {
            modalEl.classList.remove('show');
            modalEl.style.display = 'none';
            document.body.classList.remove('modal-open');
            backdrop.remove();
        };
        // close on X button click
        modalEl.querySelector('.btn-close, .close').addEventListener('click', closeModal);
        // close on backdrop click
        backdrop.addEventListener('click', closeModal);
        // close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }
});