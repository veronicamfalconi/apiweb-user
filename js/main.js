//Evento que llama a la funcion cargarListado apenas termina de cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
    cargarListado();
    const userForm = document.getElementById('userForm'); // Selecciona el formulario
    const paisInput = document.getElementById('pais'); // Selecciona el input del país
    const paisList = document.getElementById('paisList'); // Selecciona el datalist de países
    //const bttnForm = document.getElementById('agregar'); //seleccione el boton submit agregar del html
    const usuarioTabla = document.getElementById('userTable'); //Selecciona el tbody de la tabla
    const dataPaisUsuario = document.getElementById('dataPaisUsuario'); //selecciona el tfoot con más información del país
    let paises = []; // Array para almacenar los datos de los países
    class Usuarios {
        constructor(nombre, apellido, usuario, pais) {
            this.nombre = nombre;
            this.apellido = apellido;
            this.usuario = usuario;
            this.pais = pais;
        }
    }
    
    let usuariosRegistrados = [];
    const inputs = document.querySelectorAll('#userForm input');

    //Obtengo los datos de la API
    function cargarListado() {
        fetch('https://restcountries.com/v3.1/all?fields=name,capital,continents,languages,area,flags,population,independent,translations') // Consulta la API
            .then(response => response.json()) // Convierte la respuesta a JSON
            .then(data => {
                paises = data; // Guarda los datos en el array de países
                paises.forEach(pais => { // Recorre los países
                    const opcion = document.createElement('option'); // Crea una opción para el datalist
                    opcion.value = pais.translations.spa.common; // Establece el valor de la opción
                    paisList.appendChild(opcion); // Agrega la opción al datalist
                });
            })
            .catch(error => console.error('La respuesta no fue exitosa: ', error));
    }

    inputs.forEach(input => {
        input.addEventListener('keyup', () => {
            console.log('Tecla levantada');
        });
    });

    //Evento de enviar los datos del formulario cuando se registre el submit
    userForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Detiene la acción por defecto del envío del formulario
        const nombreIngresado = document.getElementById('nombre').value.toUpperCase(); //Toma el input del nombre del usuario
        const apellidoIngresado = document.getElementById('apellido').value.toUpperCase();//Toma el input del apellido
        const usuarioIngresado = document.getElementById('usuario').value; //Toma el input del usuario
        const paisIngresado = paisInput.value.toUpperCase(); //Toma el pais ingresado
        //veririco si el usuario ya fue ingresado o no, .some devuelve un true si coinciden los datos
        const usuarioExiste = usuariosRegistrados.some(u => u.usuario === usuarioIngresado);

        if (usuarioExiste) {
            alert('El usuario ya está registrado. Por favor, elige otro nombre de usuario.');
            console.log('Usuario existente');
        } else {
            // Agregar el nuevo usuario al array de usuarios registrados
            usuariosRegistrados.push({
                usuario: usuarioIngresado
            })

            
                   

        //Guarda en pais el primer país ingresado que coincida con la lista de paises de la API (translations.spa.common)
        const pais = paises.find(
            (busca) => busca.translations.spa.common.trim().toLowerCase() === paisIngresado.trim().toLowerCase()
        );
   
    

        if (pais) {
            const NuevoUsuario = new Usuarios(nombreIngresado, apellidoIngresado, usuarioIngresado, paisIngresado)
            let dataUsuario = document.createElement('tr'); //Si lo encuentra crea la fila donde irán los datos del user
            dataUsuario.innerHTML = dataHTML(NuevoUsuario.nombre, NuevoUsuario.apellido, NuevoUsuario.usuario, pais); //Contiene los datos que van en la tabla
            usuarioTabla.appendChild(dataUsuario); //La fila se crea en el tbody de la tabla

            let detallePais = document.createElement('div'); //Creo el div donde se guardará el detalle del país
            detallePais.innerHTML = '' //Seteo para que este vacío
            dataPaisUsuario.appendChild(detallePais); //El div creado para el detalle del país se guardará en el div del HTML
            
            //Evento que maneja la creación del detalle del país cuando se hace click en "Mostrar información"
            dataUsuario.querySelector('.infoPais').addEventListener('click', () =>{
                detallePais.classList.add('detallePais'); //Creo la class para el div del detalle
                //Contenido que está incluido en el detalle
                detallePais.innerHTML= infoPaisHTML(pais.translations.spa.common, pais.capital, pais.continents, pais.flags.svg, pais.flags.alt, pais.population, pais.area);
            });
           
            //Evento que elimina el usuario junto con la información
            dataUsuario.querySelector('.deleteButton').addEventListener('click', () => {
                dataUsuario.remove();
                detallePais.remove();
                usuariosRegistrados = usuariosRegistrados.filter(u => u.usuario !== usuarioIngresado) //elimina el usuario del array por si queremos ingresarlo nuevamente
            });

        } else {
            alert("País no encontrado. Por favor, seleccione un país válido de la lista.");
        }
    }

    }); 

    function dataHTML(nombre, apellido, usuario, pais) {
        return `<td>${nombre}</td>
                <td>${apellido}</td>
                <td>${usuario}</td>
                <td><img src="${pais.flags.svg}" alt="Bandera de ${pais.translations.spa.common}" width="30"></td>
                <td>
                    <button class="deleteButton">Eliminar</button>
                    <button class="infoPais">Más Información</button>
                </td>`;
    }

    function infoPaisHTML(nombre, capital, continents, flag, flagAlt, population, area) {
        return `<div class="flagData"><img src="${flag}" alt="${flagAlt}"></div>
                <div class="datos">
                    <h2 class="nombrePais">${nombre}</h2>
                    <h3 class="capitalPais">Capital: ${capital}</h3>
                    <p>Continente: ${continents}</p>
                    <p>Población: ${population}</p>
                    <p>Área: ${area} km²</p>
                </div>`;
    }
  
    

    
});


/*
document.addEventListener('DOMContentLoaded', function () {
    cargarListado();
    const userForm = document.getElementById('userForm'); // Selecciona el formulario
    const paisInput = document.getElementById('pais'); // Selecciona el input del país
    const paisList = document.getElementById('paisList'); // Selecciona el datalist de países
    const usuarioTabla = document.getElementById('userTable'); //Selecciona el tbody de la tabla
    const dataPaisUsuario = document.getElementById('dataPaisUsuario'); //selecciona el div con más información del país
    let paises = []; // Array para almacenar los datos de los países

    //Obtengo los datos de la API
    function cargarListado() {
        fetch('https://restcountries.com/v3.1/all?fields=name,capital,continents,languages,area,flags,population,independent,translations') // Consulta la API
            .then(response => response.json()) // Convierte la respuesta a JSON
            .then(data => {
                paises = data; // Guarda los datos en el array de países
                paises.forEach(pais => { // Recorre los países
                    const opcion = document.createElement('option'); // Crea una opción para el datalist
                    opcion.value = pais.translations.spa.common; // Establece el valor de la opción
                    paisList.appendChild(opcion); // Agrega la opción al datalist
                });
            })
            .catch(error => console.error('La respuesta no fue exitosa: ', error));
    }

    //Enviar los datos del formulario
    userForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Detiene la acción por defecto del envío del formulario
        const nombreIngresado = document.getElementById('nombre').value.toUpperCase();
        const apellidoIngresado = document.getElementById('apellido').value.toUpperCase();
        const paisIngresado = paisInput.value.toUpperCase();

        const pais = paises.find(
            (busca) => busca.translations.spa.common.trim().toLowerCase() === paisIngresado.trim().toLowerCase()
        );

        if (pais) {
            let dataUsuario = document.createElement('tr');
            dataUsuario.innerHTML = dataHTML(nombreIngresado, apellidoIngresado, pais);
            usuarioTabla.appendChild(dataUsuario);

            let detallePais = document.createElement('tr');
            detallePais.classList.add('detallePais'); // Añade una clase para la fila de detalles
            dataPaisUsuario.appendChild(detallePais);

            dataUsuario.querySelector('.infoPais').addEventListener('click', () => {
                detallePais.innerHTML = infoPaisHTML(pais.translations.spa.common, pais.capital, pais.continents, pais.flags.svg, pais.flags.alt, pais.population, pais.area);
            });

            dataUsuario.querySelector('.deleteButton').addEventListener('click', () => {
                dataUsuario.remove();
                detallePais.remove();
            });

        } else {
            alert("País no encontrado. Por favor, seleccione un país válido de la lista.");
        }
    });

    function dataHTML(nombre, apellido, pais) {
        return `<td>${nombre}</td>
                <td>${apellido}</td>
                <td><img src="${pais.flags.svg}" alt="Bandera de ${pais.translations.spa.common}" width="30"></td>
                <td>
                    <button class="deleteButton">Eliminar</button>
                    <button class="infoPais">Más Información</button>
                </td>`;
    }

    function infoPaisHTML(nombre, capital, continents, flag, flagAlt, population, area) {
        return `<div class="flagData"><img src="${flag}" alt="${flagAlt}"></div>
                <div class="datos">
                    <h2 class="nombrePais">${nombre}</h2>
                    <h3 class="capitalPais">Capital: ${capital}</h3>
                    <p>Continente: ${continents}</p>
                    <p>Población: ${population}</p>
                    <p>Área: ${area} km²</p>
                </div>`;
    }
});
*/