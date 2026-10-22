const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDescription = document.getElementById('task-description');
const taskList = document.getElementById('task-list');
// local Storage
function saveTask() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach((taskItem) => {
        const name = taskItem.querySelector('[data-field="name"]').textContent;
        const desc = taskItem.querySelector('[data-field="description"]').textContent;
        const completed = taskItem.querySelector(".task-checkbox").checked;

        tasks.push({
            name: name,
            description: desc,
            completed: completed
        });
    });
    localStorage.setItem("mytasks", JSON.stringify(tasks));
}
function loadTask() {
    const tasks = JSON.parse(localStorage.getItem("mytasks")) || [];
    tasks.forEach((task) => {
        createTask(task.name, task.description, task.completed);
    });
}
function editTask(taskItem) {
    const dialog = document.querySelector("#edit-dialog");
    const form = document.querySelector("#edit-form");
    const name = dialog.querySelector("#edit-name");
    const description = dialog.querySelector("#edit-description");

    const taskName = taskItem.querySelector('[data-field="name"]');
    const taskDesc = taskItem.querySelector('[data-field="description"]');

    name.value = taskName.textContent;
    description.value = taskDesc.textContent;

    dialog.showModal();

    form.onsubmit = (e) => {
        e.preventDefault();
        const newName = name.value.trim();
        const newDesc = description.value.trim();

        if (!newName) {
            name.focus();
            return;
        }

        taskName.textContent = newName;
        taskDesc.textContent = newDesc;

        saveTask();
        dialog.close();
    };

    dialog.querySelector("#cancel-btn").onclick = () => {
        dialog.close();
    };
}
function createField(field, value, tag) {
    const el = document.createElement(tag);
    if(field === "status") {
        el.classList.add("task-pending");
    }
    else {
        el.classList.add(`task-${field}`);
    }
    el.dataset.field = field;
    if(tag === 'input') {
        el.value = value;
        el.type = 'text';
    }
    else {
        el.textContent = value;
    }
    return el;
}

function createTask(name, description, completed=false) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');

    const actions = document.createElement('div');
    actions.classList.add('task-actions');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox')
    checkbox.checked = completed;

    const status = createField('status', completed ? 'completed' : 'pending', 'span');
    if(completed) {
        status.classList.remove('task-pending');
        status.classList.add('task-completed');
    }
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i data-lucide="pencil"></i>';
    editButton.dataset.action = 'edit';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i data-lucide="trash-2"></i>';
    deleteButton.dataset.action = 'delete';

    taskItem.append(checkbox, createField('name', name, 'span'), createField('description', description, 'span'), status, actions);
    actions.append(editButton, deleteButton);
    taskList.appendChild(taskItem);
    lucide.createIcons();
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = taskInput.value.trim();
    const description = taskDescription.value.trim();
    if(name == "") {
        return;
    }
    createTask(name, description);
    saveTask();
    taskForm.reset();
    taskInput.focus();
});

taskList.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if(!button) return;
    const taskItem = button.closest('.task-item');
    if(button.dataset.action === 'edit') {
        editTask(taskItem);
    }
    else if(button.dataset.action === 'delete') {
        taskItem.remove();
        saveTask();
    }
});
taskList.addEventListener("change", (e) => {
    if(!e.target.matches('.task-checkbox')) {
        return;
    }
    const status = e.target.closest('.task-item').querySelector('[data-field="status"]');
    status.classList.toggle("task-completed", e.target.checked);
    status.classList.toggle("task-pending", !e.target.checked);
    status.textContent = e.target.checked ? 'Completed' : 'Pending';
    saveTask();
});
loadTask();