// ELEMENTOS DEL DOM
const addButton = document.querySelector('.btn-add');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');
const taskForm = document.getElementById('taskForm');
const taskList = document.querySelector('.task-list');

let editingTaskIndex = null; // si es null, estamos creando; si no, estamos editando

// CARGAR TAREAS DESDE LOCALSTORAGE AL INICIAR
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// ABRIR MODAL PARA AÑADIR
addButton.addEventListener('click', () => {
  modal.classList.remove('hidden');
  editingTaskIndex = null;
  taskForm.reset();
});

// CERRAR MODAL
closeModalBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  taskForm.reset();
  editingTaskIndex = null;
});

// CREAR O EDITAR TAREA
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const category = document.getElementById('taskCategory').value;
  const description = document.getElementById('taskDescription').value;

  const newTask = { title, category, description };

  if (editingTaskIndex !== null) {
    // Editando una tarea existente
    tasks[editingTaskIndex] = newTask;
  } else {
    // Nueva tarea
    tasks.push(newTask);
  }

  // Guardar y cerrar
  saveTasks();
  renderTasks();
  taskForm.reset();
  modal.classList.add('hidden');
  editingTaskIndex = null;
});

// GUARDAR EN LOCALSTORAGE
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// MOSTRAR TAREAS EN PANTALLA
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    taskCard.innerHTML = `
      <span class="task-icon">${task.category}</span>
      <div class="task-details">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-index="${index}">Edit ✏️</button>
        <button class="delete-btn" data-index="${index}">Delete 🗑️</button>
      </div>
    `;

    taskList.appendChild(taskCard);
  });

  // Asignar eventos a los botones de editar y eliminar
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', handleEdit);
  });
}

// ELIMINAR TAREA
function handleDelete(e) {
  const index = e.target.dataset.index;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// EDITAR TAREA
function handleEdit(e) {
  const index = e.target.dataset.index;
  const task = tasks[index];

  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskCategory').value = task.category;
  document.getElementById('taskDescription').value = task.description;

  modal.classList.remove('hidden');
  editingTaskIndex = index;
}
