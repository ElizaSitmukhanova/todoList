const form = document.querySelector('#form'),
    input = document.querySelector('#taskInput'),
    tasksList = document.querySelector('#tasksList'),
    emptyList = document.querySelector('#emptyList'),
    lastBtn = document.querySelector('#last'),
    firstBtn = document.querySelector('#first'),
    oddBtn = document.querySelector('#odd'),
    honestBtn = document.querySelector('#honest');
    
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function(task) {
    const cssClassComplete = task.complete ? "task-title task-title--complete" : "task-title"; 
    const cssClassHonest = task.honest ? "list-group-item d-flex justify-content-between task-item highlight-honest" : 'list-group-item d-flex justify-content-between task-item';
    const cssClassOdd = task.odd ? "list-group-item d-flex justify-content-between task-item highlight-odd" : 'list-group-item d-flex justify-content-between task-item';

    const taskHtml = `
        <li id = "${task.id}" class="${cssClassHonest} ${cssClassOdd}">
					<span class="${cssClassComplete}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="complete" class="btn-action">
							Complete
						</button>
						<button type="button" data-action="delete" class="btn-action">
							Delete
						</button>
					</div>
				</li>
        `
    tasksList.insertAdjacentHTML('beforeend', taskHtml);
})

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', completeTask);
lastBtn.addEventListener('click', deleteLastTask);
firstBtn.addEventListener('click', deleteFirstTask);
oddBtn.addEventListener('click', checkOdd);
honestBtn.addEventListener('click', checkHonest);

function checkOdd(e) {
    e.preventDefault(e);
    if (e.target.dataset.action !== 'oddtask') return;
    const taskItems = document.querySelectorAll('.task-item');
    for (let i = 0; i < taskItems.length; i++) {
        if (i % 2 !== 0) {
            taskItems[i].classList.toggle('highlight-odd');
            tasks[i].odd = !tasks[i].odd;
        }
    }
    saveToLocalStorage();
    console.log(tasks);
}

function checkHonest (e) {
    if (e.target.dataset.action !== 'honesttask') return;
    const taskItems = document.querySelectorAll('.task-item');
    for (let i = 0; i < taskItems.length; i++) {
      if (i % 2 === 0) {
        taskItems[i].classList.toggle('highlight-honest');
        tasks[i].honest = !tasks[i].honest;
      }
    };
    saveToLocalStorage();
}

function deleteLastTask(e) {
    if (e.target.dataset.action !== 'deletedlast') return;
    let lastTask = document.querySelector('.list-group-item:last-child');
    const id = Number(lastTask.id);

    tasks = tasks.filter(function (task) {
        if (task.id === id) {
            return false
        } else {
            return true
        }
    });

    lastTask.remove(); 
    checkEmptyList();
    saveToLocalStorage();
}
  
function deleteFirstTask(e) {
    if (e.target.dataset.action !== 'deletedfirst') return;
    let firstTask = document.querySelector('.list-group-item:first-child');
    const id = Number(firstTask.id);

    tasks = tasks.filter(function (task) {
        if (task.id === id) {
            return false
        } else {
            return true
        }
    })

    firstTask.remove(); 
    checkEmptyList();
    saveToLocalStorage();
}

function addTask(e) {
    e.preventDefault();
    const textInput = input.value;

    const newTask = {
        id: Date.now(),
        text:  textInput,
        complete: false,
        honest: false,
        odd: false,
    }

    tasks.push(newTask);
    console.log(tasks);
 
    const cssClass = newTask.complete ? "task-title task-title--complete" : "task-title"; 
     
    const taskHtml = `
        <li id = "${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${newTask.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="complete" class="btn-action">
							Complete
						</button>
						<button type="button" data-action="delete" class="btn-action">
							Delete
						</button>
					</div>
				</li>
        `
    tasksList.insertAdjacentHTML('beforeend', taskHtml);

    input.value = '';
    input.focus();
    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return;
        const parentNode = e.target.closest('.list-group-item');
        const id = Number(parentNode.id);

    tasks = tasks.filter(function (task) {
        if (task.id === id) {
            return false
        } else {
            return true
        }
    })

    console.log(tasks);
    parentNode.remove();  
    checkEmptyList();
    saveToLocalStorage();
}

function completeTask(e) {
    e.preventDefault();
    if (e.target.dataset.action !== 'complete') return;
    console.log('complete')
    const parentNode = e.target.closest('.list-group-item');
    const id = Number(parentNode.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    const removedTask = tasks.splice(taskIndex, 1)[0];
    tasks.push(removedTask);

    const task = tasks.find(function (task) {
        if (task.id === id) {
            return true
        }
    })
    task.complete = !task.complete;

    saveToLocalStorage();
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--complete');

}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
    };

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
};

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}