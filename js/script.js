const btn = document.getElementById("search-btn");
btn.addEventListener("click", showCountries);
document.getElementById("country-container").style.display = "none";

function showCountries(event) {
    event.preventDefault();
    document.getElementById("country-container").style.display = "none";
    document.getElementById("search-text").style.display = "none";
    //tar bort all tidigare info när man söker på något nytt:
    document.getElementById("error-message").innerText = "";
    document.getElementById("country-container").innerText = "";

    const input = document.getElementById("lang-input");
    const searchTerm = input.value.toLowerCase();
    // vill ha users input med stor bokstav:
    const searchText = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    document.getElementById("search-text").innerText =
        "Showing countries where they speak " + searchText;
    input.value = "";

    fetchCountries(searchTerm);
}

function fetchCountries(language) {
    const url = `https://restcountries.com/v3.1/lang/${language}`;

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(handleCountries)
        .catch(handleError);
}

function handleCountries(countryInfo) {
    //gör en tom array för att senare få ut landet med högst population
    let highestPop = [];

    if (countryInfo.status === 404) {
        throw (error =
            "No countries with the given languange was found, check your spelling and try again!");
    } else if (countryInfo.message == "Page Not Found") {
        throw "Something went wrong with your search, please try again!";
    } else {
        document.getElementById("country-container").style.display = "flex";
        document.getElementById("search-text").style.display = "flex";
        countryInfo.forEach((country) => {
            //insåg att det blev error om ett av länderna saknade något av nedan, så det slutade ladda upp alla länder efter det samt kunde ej räkna ut vilken population som var högst.

            if (
                country.flags == undefined ||
                country.name == undefined ||
                country.capital == undefined ||
                country.subregion == undefined ||
                country.population == undefined
            ) {
                return "This search includes a country where one or several of the properties were missing, returning this message to continue presenting the rest of the countries";
            }

            const countryContainer =
                document.getElementById("country-container");

            const countryCard = document.createElement("div");
            countryCard.id = "country-card";
            countryContainer.appendChild(countryCard);

            const flag = document.createElement("img");
            flag.src = country.flags.png;

            const name = document.createElement("h2");
            name.innerText = country.name.official;

            const subregion = document.createElement("h3");
            subregion.innerText = "Subregion: " + country.subregion;

            const capital = document.createElement("p");
            capital.innerText = "Capital: " + country.capital[0];

            const population = document.createElement("p");
            population.innerText = "Population: " + country.population;

            countryCard.append(flag, name, subregion, capital, population);

            //lägger till alla populationer i min tomma array
            highestPop.push(country.population);
        });

        // får ut högsta populationen samt vilket index den ligger på
        const highestNumber = Math.max(...highestPop);
        const highestIndex = highestPop.indexOf(highestNumber);

        //markerar det land med högst population
        document.querySelectorAll("#country-card")[highestIndex].style.border =
            "7px solid #00448B";
    }
}

function handleError(error) {
    const errorP = document.getElementById("error-message");
    errorP.innerText = error;
}
