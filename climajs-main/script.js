const apiKey = 'fa2d9f3da36ac1a7b56d308c89903fab';

function checkEnter(event) {
    if (event.key === "Enter") {
        getWeather();
    }
}

async function getWeather() {
  
  const resultDiv = document.getElementById('result');
  const input = document.getElementById('samuel');
  let city = input.value;

  if (!city) {
    resultDiv.innerText = 'Por favor ingresa una ciudad.';
    return;
  }

  try {
    resultDiv.innerText = 'Buscando...';

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
    );

    if (!response.ok) throw new Error('Ciudad no encontrada.');

    const data = await response.json();
    const { name, main, weather } = data;

    console.log(data)
    const sunrisetime = data.sys.sunrise
    const sunsettime = data.sys.sunset

    var datesunrise = new Date(sunrisetime * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    var datesunset = new Date(sunsettime * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    resultDiv.innerHTML = `
      <p><strong>Ciudad:</strong> ${name}</p>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="icon">
      <p><strong>Temperatura:</strong> ${main.temp}°C</p>
      <p id="clima"><strong>Clima:</strong> ${weather[0].description}</p>
      <p><strong>Amanece a las:</strong> ${datesunrise} AM</p>
      <p><strong>Anochece a las:</strong> ${datesunset} PM</p>
    `;

    // clima = weather[0].description;
    // if (clima == 'bruma'){
    //   console.log(clima)
    //   document.body.style.backgroundColor = "rgb(68, 68, 156)";
    // }
    // if (clima == "soleado"){
    //   document.getElementById("clima").style.backgroundColor = "#FF0000";
    // }
  } catch (error) {
    console.log(error)
    resultDiv.innerText = error.message;
  }
}

