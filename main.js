// Función para cargar los tipos de comprobante, simulando una base de datos. No pude linkear a la base real.
async function cargarTiposComprobante() {
    const response = await fetch('tiposcomprobante.json');
    const tiposComprobante = await response.json();

    const select = document.getElementById('tipoComprobante');
    tiposComprobante.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.tcom_Codigo;
        option.textContent = tipo.tcom_Descripcion;
        select.appendChild(option);
    });
}

// Función para buscar y mostrar los comprobantes según lo seleccionado. No pude linkear a la base real.
async function buscarComprobantes() {
    const tipoSeleccionado = document.getElementById('tipoComprobante').value;

    const response = await fetch('comprobantes.json');
    const comprobantes = await response.json();

    const resultadosDiv = document.getElementById('resultados');
    const tabla = document.createElement('table');  // Crear una nueva tabla
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Máscara</th>
                <th>Código</th>
                <th>Importe Total</th>
            </tr>
        </thead>
        <tbody>
            
        </tbody>
    `;

    const tbody = tabla.querySelector('tbody');
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

    // Limpiar resultados anteriores y agregar la nueva tabla
    resultadosDiv.innerHTML = '';
    resultadosDiv.appendChild(tabla);
}

//Año del footer llamado dinamicamente desde js
document.addEventListener("DOMContentLoaded", function() {
    const yearElement = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
});

// Cargo los tipos de comprobante con cada rendereizacion de la app
cargarTiposComprobante();
