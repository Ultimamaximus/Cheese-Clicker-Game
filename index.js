const cheese = document.querySelector("#cheese");
const autoClick = document.querySelector("#auto-click");
const autoClickTextPrice = document.querySelector("#auto-click .price span");
const upgradeClick = document.querySelector("#upgrade-click");
const upgradeClickTextPrice = document.querySelector("#upgrade-click .price span");

// Cache the DOM selections
const title = document.querySelector("title");
const score = document.querySelector("#score span");

const updateScore = cheeses => {
  // Check if the score has changed
  if (score.innerText !== cheeses) {
    // Update the displayed score with the value of 'cheeses'
    score.innerText = cheeses;

    // Update the title of the webpage to include the current score
    title.innerHTML = `${cheeses} cheeses - Cheese Clicker`;
  }

  // Store the 'cheeses' value in the browser's localStorage
  localStorage.setItem("cheeses", cheeses);
};



const updatePowerupsStorage = powerup => {
    // Retrieve the existing powerups from localStorage or initialize an empty array
    const powerups = JSON.parse(localStorage.getItem("powerups") || "[]");
  
    // Add the new powerup to the powerups array
    powerups.push(powerup);
  
    // Store the updated powerups array in localStorage
    localStorage.setItem("powerups", JSON.stringify(powerups));
  };
  


const getStorage = () => {
    // Retrieve the 'cheeses' value from localStorage, or set it to 0 if it doesn't exist
    const cheeses = localStorage.getItem("cheeses") || 0;

    // Retrieve the 'powerups' array from localStorage, or set it to an empty array if it doesn't exist
    const powerups = JSON.parse(localStorage.getItem("powerups")) || [];

    // Create an object called 'storage' to store the retrieved values
    const storage = {
        "cheeses": cheeses,
        "powerups": powerups
    };

    // Return the 'storage' object containing the retrieved values
    return storage;
}


const cheeseClicked = cheeses => {
    // Retrieve the stored values from localStorage
    const storage = getStorage();

    // Select the element that displays the score
    const score = document.querySelector("#score span");

    // Determine the initial score value
    const scoreValue = cheeses ? cheeses : parseInt(score.innerText);

    let newScore;

    // Check if the "upgrade-click" powerup is included in the stored powerups
    if (storage.powerups.includes("upgrade-click")) {
        // Count the number of "upgrade-click" powerups
        const multiplier = storage.powerups.filter(powerup => powerup === "upgrade-click").length;

        // Calculate the new score based on the multiplier
        if (multiplier === 1) {
            newScore = scoreValue + 2;
        } else {
            newScore = scoreValue + (2 ** multiplier);
        }
    } else {
        // If the "upgrade-click" powerup is not included, increment the score by 1
        newScore = scoreValue + 1;
    }

    // Update the score on the webpage
    updateScore(newScore);
}


const createParticle = (x, y) => {
    // Select the container for cheese clicks
    const cheeseClicks = document.querySelector(".cheese-clicks");

    // Create a new image element for the particle
    const particle = document.createElement("img");

    // Set the source and class attributes of the particle image
    particle.setAttribute("src", "img/cheese.png");
    particle.setAttribute("class", "cheese-particle");

    // Set the position of the particle using the provided x and y coordinates
    particle.style.left = x + "px";
    particle.style.top = y + "px";

    // Append the particle element to the container for cheese clicks
    cheeseClicks.appendChild(particle);

    // After 3 seconds, remove the particle element from the container
    setTimeout(() => {
        cheeseClicks.removeChild(particle);
    }, 3000);
}


// Add a click event listener to the 'cheese' element
cheese.addEventListener("click", (e) => {
    // When the cheese is clicked, create a particle at the click position
    createParticle(e.clientX, e.clientY);
    
    // Call the 'cheeseClicked' function to handle the click event
    cheeseClicked();
});


const autoClickCheese = () => {
    // Set up an interval function to execute every 1000 milliseconds (1 second)
    setInterval(() => {
        // Select the element that displays the score
        const score = document.querySelector("#score span");

        // Get the current score value and convert it to an integer
        const scoreValue = parseInt(score.innerText);

        // Calculate the new score by incrementing the current score by 1
        newScore = scoreValue + 1;

        // Update the score on the webpage
        updateScore(newScore);
    }, 1000); // Interval set to 1000 milliseconds (1 second)
}


// Add a click event listener to the 'autoClick' element
autoClick.addEventListener("click", () => {
    // Get the price attribute value from the 'autoClick' element
    const price = autoClick.getAttribute("data-price");

    // Select the element that displays the score
    const score = document.querySelector("#score span");

    // Get the current score value and convert it to an integer
    const scoreValue = parseInt(score.innerText);

    // Check if the current score is greater than or equal to the price of the powerup
    if (scoreValue >= price) {
        // Update the powerups storage with the "auto-click" powerup
        updatePowerupsStorage("auto-click");

        // Retrieve the updated storage values
        const storage = getStorage();

        // Count the number of "auto-click" powerups in the storage
        const quantAutoClicks = storage.powerups.filter(powerup => powerup === "auto-click").length;

        // Calculate the new score by deducting the price from the current score
        const newScore = scoreValue - price;

        // Update the score on the webpage
        updateScore(newScore);

        // Adjust the price of the powerup and update its displayed value
        if (quantAutoClicks === 1) {
            autoClick.setAttribute("data-price", 100 * 2);
            autoClickTextPrice.innerHTML = 100 * 2;
        } else {
            autoClick.setAttribute("data-price", 100 * (quantAutoClicks + 1));
            autoClickTextPrice.innerHTML = 100 * (quantAutoClicks + 1);
        }

        // Remove the "disable" class from the ".auto-clicks" element
        document.querySelector(".auto-clicks").classList.remove("disable");

        // Add an image element to the ".auto-clicks .cursors" element
        document.querySelector(".auto-clicks .cursors").innerHTML += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">';

        // Start the auto clicking functionality
        autoClickCheese();
    } else {
        // Add the "invalid" class to the 'autoClick' element temporarily
        autoClick.classList.add("invalid");

        // Remove the "invalid" class from the 'autoClick' element after 300 milliseconds (0.3 seconds)
        setTimeout(() => {
            autoClick.classList.remove("invalid");
        }, 300);
    }
});


// Add a click event listener to the 'upgradeClick' element
upgradeClick.addEventListener("click", () => {
    // Get the price attribute value from the 'upgradeClick' element
    const price = upgradeClick.getAttribute("data-price");

    // Select the element that displays the score
    const score = document.querySelector("#score span");

    // Get the current score value and convert it to an integer
    const scoreValue = parseInt(score.innerText);

    // Check if the current score is greater than or equal to the price of the powerup
    if (scoreValue >= price) {
        // Update the powerups storage with the "upgrade-click" powerup
        updatePowerupsStorage("upgrade-click");

        // Retrieve the updated storage values
        const storage = getStorage();

        // Count the number of "upgrade-click" powerups in the storage
        const multiplier = storage.powerups.filter(powerup => powerup === "upgrade-click").length;

        // Calculate the new score by deducting the price from the current score
        const newScore = scoreValue - price;

        // Update the score on the webpage
        updateScore(newScore);

        // Adjust the price of the powerup and update its displayed value
        if (multiplier === 1) {
            upgradeClick.setAttribute("data-price", 100 * 2);
            upgradeClickTextPrice.innerHTML = 100 * 2;
        } else {
            upgradeClick.setAttribute("data-price", 100 * (2 ** multiplier));
            upgradeClickTextPrice.innerHTML = 100 * (2 ** multiplier);
        }
    } else {
        // Add the "invalid" class to the 'upgradeClick' element temporarily
        upgradeClick.classList.add("invalid");

        // Remove the "invalid" class from the 'upgradeClick' element after 300 milliseconds (0.3 seconds)
        setTimeout(() => {
            upgradeClick.classList.remove("invalid");
        }, 300);
    }
});


// Retrieve saved data from the storage and update the score
const getSavedData = () => {
    // Retrieve the stored values from localStorage
    const storage = getStorage();

    // Retrieve the counter value from localStorage
    const counter = parseInt(storage.cheeses);

    // Update the score on the webpage with the retrieved counter value
    updateScore(counter);

    // Check if the "upgrade-click" powerup is present in the storage
    if (storage.powerups.includes("upgrade-click")) {
        // Count the number of "upgrade-click" powerups in the storage
        const multiplier = storage.powerups.filter(powerup => powerup === "upgrade-click").length;

        // Adjust the price of the "upgrade-click" powerup and update its displayed value
        if (multiplier === 1) {
            upgradeClick.setAttribute("data-price", 100 * 2);
            upgradeClickTextPrice.innerHTML = 100 * 2;
        } else {
            upgradeClick.setAttribute("data-price", 100 * (2 ** multiplier));
            upgradeClickTextPrice.innerHTML = 100 * (2 ** multiplier);
        }
    }

    // Check if the "auto-click" powerup is present in the storage
    if (storage.powerups.includes("auto-click")) {
        // Count the number of "auto-click" powerups in the storage
        const quantAutoClicks = storage.powerups.filter(powerup => powerup === "auto-click").length;

        // Remove the "disable" class from the ".auto-clicks" element
        document.querySelector(".auto-clicks").classList.remove("disable");

        // Adjust the price of the "auto-click" powerup and update its displayed value
        if (quantAutoClicks === 1) {
            autoClick.setAttribute("data-price", 100 * 2);
            autoClickTextPrice.innerHTML = 100 * 2;
        } else {
            autoClick.setAttribute("data-price", 100 * (quantAutoClicks + 1));
            autoClickTextPrice.innerHTML = 100 * (quantAutoClicks + 1);
        }

        // Start the auto clicking functionality for each "auto-click" powerup
        for (i = 1; i <= quantAutoClicks; i++) {
            autoClickCheese();

            document.querySelector(".auto-clicks").classList.remove("disable");
            document.querySelector(".auto-clicks .cursors").innerHTML += '<img src="img/cursor.png" alt="cursor" id="cursor" class="cursor auto">';
        }
    }
};


document.addEventListener("DOMContentLoaded", getSavedData);
