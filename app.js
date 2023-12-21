// Variables globales
const taskList = document.getElementById('task-list');
const taskNameInput = document.getElementById('taskName');

// Función para agregar una tarea
function addTask() {
    const taskName = taskNameInput.value.trim();

    if (taskName !== '') {
        // Crear elemento de lista
        const listItem = document.createElement('li');
        listItem.className = 'task-item';

        // Contenido de la tarea
        listItem.innerHTML = `
            <span>${taskName}</span>
            <button onclick="editTask(this)">Editar</button>
            <button onclick="deleteTask(this)">Eliminar</button>
        `;

        // Agregar la tarea a la lista
        taskList.appendChild(listItem);

        // Limpiar el campo de entrada
        taskNameInput.value = '';
    } else {
        alert('Por favor, ingrese un nombre de tarea válido.');
    }
}

// Función para editar una tarea
function editTask(button) {
    const listItem = button.parentNode;
    const currentName = listItem.querySelector('span').innerText;
    const newName = prompt('Editar tarea:', currentName);

    if (newName !== null) {
        listItem.querySelector('span').innerText = newName;
    }
}

// Función para eliminar una tarea
function deleteTask(button) {
    const listItem = button.parentNode;
    taskList.removeChild(listItem);
}
