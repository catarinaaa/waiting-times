// DOM elements
const submit = document.querySelector('#request');
const form = document.querySelector('#request');
const info = document.querySelector('#info');
const loading = document.querySelector('#loading');
const jumbotron = document.querySelector('#jumbotron');
const line = document.querySelector('#line');
const stations = document.querySelector('#station');
const destinations = document.querySelector('#destination');

// Variables
const host = 'http://localhost:3000';
const listStations = new Map();
listStations.set('Amarela', ['Odivelas', 'Senhor Roubado', 'Ameixoeira', 'Lumiar', 'Quinta das Conchas', 'Campo Grande', 'Cidade Universitária', 'Entrecampos', 'Campo Pequeno','Saldanha', 'Picoas', 'Marquês de Pombal', 'Rato']);
listStations.set('Azul', ['Reboleira', 'Amadora Este', 'Alfornelos', 'Pontinha', 'Carnide', 'Colégio Militar', 'Alto dos Moinhos', 'Laranjeiras', 'Jardim Zoológico', 'Praça de Espanha', 'São Sebastião', 'Parque', 'Marquês de Pombal', 'Avenida', 'Restauradores', 'Baixa-Chiado', 'Terreiro do Paço', 'Santa Apolónia']);
listStations.set('Vermelha', ['Aeroporto', 'Encarnação', 'Moscavide', 'Oriente', 'Cabo Ruivo', 'Olivais', 'Chelas', 'Bela Vista', 'Olaias', 'Alameda', 'Saldanha', 'São Sebastião']);
listStations.set('Verde', ['Telheiras', 'Campo Grande', 'Alvalade', 'Roma', 'Areeiro', 'Alameda', 'Arroios', 'Anjos', 'Intendente', 'Martim Moniz', 'Rossio', 'Baixa-Chiado', 'Cais do Sodré']);
const listDestination = new Map();
listDestination.set('Amarela', ['Odivelas', 'Rato']);
listDestination.set('Azul', ['Reboleira', 'Santa Apolónia']);
listDestination.set('Vermelha', ['Aeroporto', 'São Sebastião']);
listDestination.set('Verde', ['Telheiras', 'Cais do Sodré']);

// Event listeners
submit.addEventListener('submit', processRequest);
line.addEventListener('change', updateStations);

//Functions
function connectClient() {
    fetch(host); 
}

function processRequest(e) {
        jumbotron.style.display = 'block';
loading.style.display = "block";
    info.style.display = "none";
    var formData = new FormData(form);
    e.preventDefault();
    const options = {
        method: 'GET'
    }
    fetch(`${host}/metro?line=${formData.get('line')}&station=${formData.get('station')}&destination=${formData.get('destination')}`, options)
    .then(data => {return data.json()})
    .then(data=>{
        console.log(data);
        let time = parseInt(data.tempoChegada1);
        info.innerText = Math.floor(time/60) + ":" + ((time % 60) < 10 ? "0" + time % 60 : time % 60);
        loading.style.display = "none";
        info.style.display = "block";
    });
    
}

function updateStations(e) {
    stations.innerHTML = '';
    for(const el of listStations.get(this.value)) {
        var opt = document.createElement('option');
        opt.value = el;
        opt.innerHTML = el;
        stations.appendChild(opt);
    }
    destinations.innerHTML = '';
    for(const el of listDestination.get(this.value)) {
        var opt = document.createElement('option');
        opt.value = el;
        opt.innerHTML = el;
        destinations.appendChild(opt);
    }
}
