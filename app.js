document.addEventListener('DOMContentLoaded', function () {
    loadTasks();

    // Agregar evento al botón para agregar tarea
    document.getElementById('addTaskButton').addEventListener('click', showAddTaskForm);
});

function loadTasks() {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';

            tasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${task.nombre}</span>
                    <button onclick="deleteTask(${task.id})">Eliminar</button>
                    <button onclick="showEditTaskForm(${task.id}, '${task.nombre}', '${task.estado}')">Editar</button>
                `;
                taskList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar tareas:', error));
}

function addTask() {
    showAddTaskForm();

}

function submitNewTask() {
    const newTaskName = document.getElementById('newTaskName').value.trim();
    if (newTaskName !== '') {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: newTaskName, estado: 'pendiente' }),
        })
        .then(response => response.json())
        .then(newTask => {
            console.log('Tarea agregada:', newTask);
            loadTasks();
            hideAddTaskForm();
        })
        .catch(error => console.error('Error al agregar tarea:', error));
    }
}

function showAddTaskForm() {

    document.getElementById('addTaskForm').style.display = 'block';

}

function hideAddTaskForm() {
    document.getElementById('addTaskForm').style.display = 'none';
}

function editTask(taskId) {
    const taskName = document.getElementById('editTaskName').value.trim();
    const taskState = document.getElementById('editTaskState').value.trim();

    if (taskName !== '') {
        fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: taskName, estado: taskState }),
        })
        .then(response => response.json())
        .then(updatedTask => {
            console.log('Tarea actualizada:', updatedTask);
            loadTasks();
            hideEditTaskForm(); // Ocultar el formulario después de actualizar la tarea
        })
        .catch(error => console.error('Error al actualizar tarea:', error));
    }
}

function deleteTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(deletedTask => {
        console.log('Tarea eliminada:', deletedTask);
        loadTasks();
    })
    .catch(error => console.error('Error al eliminar tarea:', error));
}

function showAddTaskForm() {
    document.getElementById('addTaskForm').style.display = 'block';
}

function hideAddTaskForm() {
    document.getElementById('addTaskForm').style.display = 'none';
}

function showEditTaskForm(taskId, taskName, taskState) {
    document.getElementById('editTaskForm').style.display = 'block';

    // Prellenar el formulario de edición con los datos de la tarea
    document.getElementById('editTaskId').value = taskId;
    document.getElementById('editTaskName').value = taskName;
    document.getElementById('editTaskState').value = taskState;
}

function hideEditTaskForm() {
    document.getElementById('editTaskForm').style.display = 'none';
}
