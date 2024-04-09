const allButton = document.getElementById("getCities")

allButton.addEventListener('click', function (event) {
    fetch('http://127.0.0.1:8090/cities')
        .then(response => response.text())
        .then(body => document.getElementById('result').innerHTML=body)
        .catch( (error) => alert(error))
});
