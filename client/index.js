
function showConnectionError() {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = 'Unable to connect to the server. Please try again later';
    messageBox.style.display = 'block';
}

function hideConnectionError() {
    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'none';
}

async function tryFetch(link) {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error('Server error');
        }
        return await response.json();
    } catch (error) {
        showConnectionError();
        setTimeout(() => retryConnection(link), 3000); 
        throw error;
    }
}

async function retryConnection(link) {
    try {
        const request = await tryFetch(link);
        hideConnectionError(); 
    } catch (error) {
        setTimeout(() => retryConnection(link), 3000);
    }
}

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
                        <button class="activitiesBtn" data-city="${city.name}">Show all activities</button>
                        <div class="activities" id="activities${city.name}"></div>
                    </div>`;
        }
        document.getElementById('getResult').innerHTML = html;
        fetchHappened = true;
    } catch (error) {
        showConnectionError();
        setTimeout(() => retryConnection('http://127.0.0.1:8090/cities'), 3000);
    }
}

//display cities
const allButton = document.getElementById('getCities');

allButton.addEventListener('click', function (event) {
    cityFetch();
});

//search cities
const searchButton = document.getElementById('searchCities');
const searchForm = document.getElementById('search');

searchButton.addEventListener('click', async function (event){
    event.preventDefault()
    let input = searchForm.input.value;
    try{
        let response = await fetch('http://127.0.0.1:8090/citysearch?input=' + input);
        let cities = await response.json();
        let html = '<div class="cities">';
        if (cities.message) {
            alert(cities.message);
        } else {
            for (const city of cities) {
                html += `<div class="city">
                            <h2>${city.name}</h2>
                            <img src="${city.picture}" alt="Picture of ${city.name}">
                            <button class="activitiesBtn" data-city="${city.name}">Show all activities</button>
                            <div class="activities" id="activities${city.name}"></div>
                        </div>`;
                document.getElementById('getResult').innerHTML = html;
            }
        }  
    }
    catch(error){
        showConnectionError();
        setTimeout(() => retryConnection('http://127.0.0.1:8090/citysearch?input=' + input), 3000);
    } 
});

//add city
const newCityForm = document.getElementById('newCityForm');
const showButton = document.getElementById('showFormButton');

newCityForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(newCityForm);
    hideConnectionError()
    try {
        let response = await fetch('addcity', {
            method: "POST",
            body: formData,
        });
        if (response.ok && fetchHappened) {
            cityFetch(); 
            alert("Thank you, City added!");
            newCityForm.reset(); 
            newCityForm.style.display = 'none';  
            showButton.textContent = 'Add New City';
        } else if(response.ok) {
            alert("Thank you, City added!");
            newCityForm.reset(); 
            newCityForm.style.display = 'none';  
            showButton.textContent = 'Add New City';
        }
    } catch (error) {
        showConnectionError();
    }
});

//add city form
showButton.addEventListener('click', function() {
    if (newCityForm.style.display == 'none' || newCityForm.style.display == '') {
        newCityForm.style.display = 'block';  
        showButton.textContent = 'Cancel';
        newCityForm.reset();
    } else {
        newCityForm.style.display = 'none';
        showButton.textContent = 'Add New City';
    }
});


//display activities
document.getElementById('getResult').addEventListener('click', async function(event) {
    const activitiesButton = event.target;
    if (activitiesButton.nodeName !== 'BUTTON') {
        return;
    }
    const cityName = activitiesButton.getAttribute('data-city');
    const activitiesDiv = document.getElementById(`activities${cityName}`);
    if (activitiesButton.textContent.includes('Show')) {
        try {
            let response = await fetch('http://127.0.0.1:8090/activities?city=' + cityName);
            let activities = await response.json();
            let activityHtml = '';
            if (activities.length == 0) {
                activityHtml = "Sorry, no activities have been added for this city for now";
            } else {
                for (const activity of activities) {
                    activityHtml += `<p><strong>Activity:</strong> ${activity.name}<br><strong>Type:</strong> ${activity.type}</p>`;
                }
                activityHtml += `<button class="filter-kids" data-city="${cityName}">Filter for Kid-Friendly</button>`;
            }
            activitiesDiv.innerHTML = activityHtml;
            activitiesButton.textContent = "Hide activities";
            console.log('City Name:', cityName);
            console.log('Activities Div:', activitiesDiv);
        } catch (error) {
            showConnectionError();
            setTimeout(() => retryConnection('http://127.0.0.1:8090/activities?city=' + cityName), 3000);
        }
    } else if (activitiesButton.textContent.includes('Filter')) {
        filterKidFriendlyActivities(cityName, activitiesDiv);
    }
    else {
        activitiesDiv.innerHTML = '';
        activitiesButton.textContent = "Show all activities";
    }
});

async function filterKidFriendlyActivities(cityName, activitiesDiv) {
    try {
        let response = await fetch('http://127.0.0.1:8090/activities?city=' + cityName);
        let activities = await response.json();
        let kidsHtml = '';
        for (const activity of activities) {
            if (activity.kids.toLowerCase() === 'yes') {
                kidsHtml += `<p><strong>Activity:</strong> ${activity.name}</p>`;
            }
        }
        if (!kidsHtml) kidsHtml = "No kid-friendly activities have been added for this city";
        activitiesDiv.innerHTML = kidsHtml;
    } catch (error) {
        showConnectionError();
        setTimeout(() => retryConnection('http://127.0.0.1:8090/activities?city=' + cityName), 3000);
    }
}

//add activity
const newActivityForm = document.getElementById("newActivityForm");
const showActivityFormButton = document.getElementById("showActivityFormButton");

newActivityForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    hideConnectionError();
    const formData = new FormData(newActivityForm);
    try {
        let response = await fetch('addactivity', {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            alert("Thank you, Activity added!");
            newActivityForm.reset(); 
            newActivityForm.style.display = 'none';  
            showActivityFormButton.textContent = 'Add New Activity';
        }
    } catch (error) {
        showConnectionError();
    }
});

async function formCityDropdown() {
    try {
        const response = await fetch('http://127.0.0.1:8090/cities');
        const cities = await response.json();
        const select = document.getElementById('citySelect');
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.name;
            option.textContent = city.name;
            select.appendChild(option);
        });
    } catch (error) {
        alert(error);
    }
}
formCityDropdown();

//show activity form
showActivityFormButton.addEventListener('click', function() {
    const form = document.getElementById('newActivityForm');
    if (form.style.display == 'none' || form.style.display == '') {
        form.style.display = 'block'; 
        this.textContent = 'Cancel';
    } else {
        form.style.display = 'none';
        this.textContent = 'Add New Activity';
    }
});