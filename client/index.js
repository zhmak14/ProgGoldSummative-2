let fetchHappened = false;

async function cityFetch() {
    try {
        let response = await fetch('http://127.0.0.1:8090/cities');
        let cities = await response.json();  
        let html = '<div class="cities">';
        for (const city of cities) {
             html += `<div class="city">
                        <h2>${city.name}</h2>
                        <p><strong>Country:</strong> ${city.country}<br>
                           <strong>Continent:</strong> ${city.continent}</p>
                        <img src="${city.picture}" alt="Picture of ${city.name}">
                        <p>activities...<br>
                     </div>`;
        }
        document.getElementById('getResult').innerHTML = html;
        fetchHappened = true;
    } catch (error) {
        alert(error);
        fetchHappened = false;
    }
}

//display
const allButton = document.getElementById('getCities');

allButton.addEventListener('click', function (event) {
    cityFetch();
});

//search
const searchButton = document.getElementById('searchCities');
const searchForm = document.getElementById('search');

searchButton.addEventListener('click', async function (event){
    event.preventDefault()
    let input = searchForm.input.value;
    try{
        let response = await fetch('http://127.0.0.1:8090/citysearch?input=' + input);
        let cities = await response.json();
        let html = '<div class="cities">';
        if(cities.message){
            alert(cities.message);
        }else{
            for (const city of cities) {
                html += `<div class="city">
                            <h2>${city.name}</h2>
                            <p><strong>Country:</strong> ${city.country}<br>
                                <strong>Continent:</strong> ${city.continent}</p>
                            <img src="${city.picture}" alt="Picture of ${city.name}">
                            <p>activities...<br>
                        </div>`;
                document.getElementById('getResult').innerHTML = html;
            }
        }
        
    }
    catch(error){
        alert(error)
    } 
});

//add
const newCityForm = document.getElementById('newCityForm');
const showButton = document.getElementById('showFormButton');

newCityForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(newCityForm);
    try {
        let response = await fetch('addcity', {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            cityFetch(); 
            alert("Thank you, City added!");
            newCityForm.reset(); 
            newCityForm.style.display = 'none';  
            showButton.textContent = 'Add New City';
        }
    } catch (error) {
        alert(error);
    }
});


showButton.addEventListener('click', function() {
    if (newCityForm.style.display === 'none' || newCityForm.style.display === '') {
        newCityForm.style.display = 'block';  
        showButton.textContent = 'Cancel';
        newCityForm.reset();
    } else {
        newCityForm.style.display = 'none';
        showButton.textContent = 'Add New City';
    }
});

