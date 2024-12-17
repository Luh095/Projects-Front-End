// Seletores
const projectNameInput = document.getElementById('project-name');
const addProjectBtn = document.getElementById('add-project-btn');
const projectsList = document.getElementById('projects-list');

// Array de projetos
let projects = JSON.parse(localStorage.getItem('projects')) || [];

// Salvar projetos no Local Storage
function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Renderizar os projetos na tela
function renderProjects() {
    projectsList.innerHTML = '';
    projects.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');
        projectElement.innerHTML = `
            <h3>${project.name} <button onclick="deleteProject(${index})">Excluir</button></h3>
            <div class="task-input">
                <input type="text" placeholder="Adicionar tarefa" id="task-input-${index}" />
                <button onclick="addTask(${index})">Adicionar</button>
            </div>
            <ul class="task-list">
                ${project.tasks
                    .map(
                        (task, taskIndex) => `
                    <li class="task ${task.completed ? 'completed' : ''}">
                        <span onclick="toggleTask(${index}, ${taskIndex})">${task.name}</span>
                        <button onclick="deleteTask(${index}, ${taskIndex})">Remover</button>
                    </li>
                `
                    )
                    .join('')}
            </ul>
        `;
        projectsList.appendChild(projectElement);
    });
}

// Adicionar novo projeto
addProjectBtn.addEventListener('click', () => {
    const projectName = projectNameInput.value.trim();
    if (projectName) {
        projects.push({ name: projectName, tasks: [] });
        saveProjects();
        renderProjects();
        projectNameInput.value = '';
    }
});

// Adicionar tarefa ao projeto
function addTask(projectIndex) {
    const taskInput = document.getElementById(`task-input-${projectIndex}`);
    const taskName = taskInput.value.trim();
    if (taskName) {
        projects[projectIndex].tasks.push({ name: taskName, completed: false });
        saveProjects();
        renderProjects();
        taskInput.value = '';
    }
}

// Alternar o estado da tarefa (concluído ou não)
function toggleTask(projectIndex, taskIndex) {
    projects[projectIndex].tasks[taskIndex].completed = !projects[projectIndex].tasks[taskIndex].completed;
    saveProjects();
    renderProjects();
}

// Deletar tarefa
function deleteTask(projectIndex, taskIndex) {
    projects[projectIndex].tasks.splice(taskIndex, 1);
    saveProjects();
    renderProjects();
}

// Deletar projeto
function deleteProject(index) {
    projects.splice(index, 1);
    saveProjects();
    renderProjects();
}

// Inicializar
renderProjects();
