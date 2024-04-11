const allButton = document.getElementById("getCities");

allButton.addEventListener('click', async function (event) {
    try{
        let response = await fetch('http://127.0.0.1:8090/cities');
        let body = await response.text();
        document.getElementById('result').innerHTML=body;
    }
    catch(error){
        alert(error)
    } 
});

const searchButton = document.getElementById("searchCities");
const searchForm = document.getElementById("search");

searchButton.addEventListener('click', async function (event){
    event.preventDefault()
    let input = searchForm.input.value;
    try{
        let response = await fetch('http://127.0.0.1:8090/citysearch?input=' + input);
        let body = await response.text();
        document.getElementById('search_result').innerHTML=body;
    }
    catch(error){
        alert(error)
    } 
});

const newCityForm = document.getElementById("new_city_form");

newCityForm.addEventListener('submit', async function (event){
    event.preventDefault();  
    const formData = new FormData(newCityForm);
    const formDataJSON = JSON.stringify(Object.fromEntries(formData));
    let response = await fetch('addcity',
        {
            method: "POST",
            body: formDataJSON,
            headers: {
                "Content-Type": "application/json"
            },
        }
    );

});


