// main.js
let usuarioLogueado = null;

async function login(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('user.json');

        if (response.ok) {
            const users = await response.json();
            const user = users.find(u => u.user_Login === username && u.user_Password === password);

            if (user) {
                usuarioLogueado = user;
                window.location.href = 'index.html';
            } else {
                alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            }
        } else {
            alert('Error al cargar los usuarios. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error en la función login:', error);
        alert('Error en el proceso de inicio de sesión. Por favor, inténtalo de nuevo.');
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    const yearElement = document.getElementById('year');
    const usernameDisplay = document.getElementById('username-display');

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    await cargarTiposComprobante();
    await obtenerUsuarioLogueado();

    if (usuarioLogueado) {
        usernameDisplay.textContent = `${usuarioLogueado.user_Name || 'Usuario'}`;
    }

    const resultadosDiv = document.getElementById('resultados');
    let tabla = resultadosDiv.querySelector('table');

    if (!tabla) {
        tabla = document.createElement('table');
        tabla.className = 'table table-striped';
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Máscara</th>
                    <th>Código</th>
                    <th>Importe Total</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        resultadosDiv.appendChild(tabla);
    }

    const buscarButton = document.getElementById('buscar-button');

    if (buscarButton) {
        buscarButton.addEventListener('click', buscarComprobantes);
    }
});

async function obtenerUsuarioLogueado() {
    try {
        if (usuarioLogueado) {
            return usuarioLogueado;
        }

        const response = await fetch('user.json');

        if (response.ok) {
            const users = await response.json();

            if (users && users.length > 0) {
                usuarioLogueado = users[0];
                return usuarioLogueado;
            } else {
                console.error('No se encontraron usuarios en el archivo JSON.');
                return null;
            }
        } else {
            console.error('Error al obtener el usuario logueado:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error en la función obtenerUsuarioLogueado:', error);
        return null;
    }
}

async function cargarTiposComprobante() {
    try {
        const responseTiposComprobante = await fetch('tiposComprobante.json');
        
        if (responseTiposComprobante.ok) {
            const tiposComprobante = await responseTiposComprobante.json();
            const select = document.getElementById('tipoComprobante');

            if (select) {
                select.innerHTML = '';

                tiposComprobante.forEach(tipo => {
                    const option = document.createElement('option');
                    option.value = tipo.tcom_Codigo;
                    option.textContent = tipo.tcom_Descripcion;
                    select.appendChild(option);
                });
            } else {
                console.error('Elemento con id "tipoComprobante" no encontrado.');
            }
        } else {
            console.error('Error al cargar Tipos Comprobante:', responseTiposComprobante.status, responseTiposComprobante.statusText);
        }
    } catch (error) {
        console.error('Error en la función cargarTiposComprobante:', error);
    }
}

async function buscarComprobantes() {
    try {
        const tipoSeleccionado = document.getElementById('tipoComprobante').value;
        const response = await fetch('comprobantes.json');
        

        if (response.ok) {
            const comprobantes = await response.json();

            const resultadosDiv = document.getElementById('resultados');
            let tabla = resultadosDiv.querySelector('table');

            if (!tabla) {
                tabla = document.createElement('table');
                tabla.className = 'table table-striped';
                tabla.innerHTML = `
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Máscara</th>
                            <th>Código</th>
                            <th>Importe Total</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                resultadosDiv.appendChild(tabla);
            }

            const tbody = tabla.querySelector('tbody');
            tbody.innerHTML = '';

            const comprobantesFiltrados = comprobantes.filter(comprobante => `${comprobante.tcom_Codigo}` === tipoSeleccionado);

            comprobantesFiltrados.forEach(comprobante => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${comprobante.tcom_Descripcion}</td>
                    <td>${comprobante.comp_Mascara}</td>
                    <td>${comprobante.comp_Codigo}</td>
                    <td>${comprobante.comp_ImporteTotal}</td>
                `;
                tbody.appendChild(fila);
            });
        } else {
            console.error('Error al cargar los comprobantes:', response.status, response.statusText);
            alert('Error al cargar los comprobantes. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error en la función buscarComprobantes:', error);
        alert('Error al cargar los comprobantes. Por favor, inténtalo de nuevo.');
    }
}