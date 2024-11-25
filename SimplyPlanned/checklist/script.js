const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; 


function renderTasks() {
	taskList.innerHTML = ''; 
	tasks.forEach((task, index) => {
		const li = document.createElement('li');
		li.innerHTML = `
			<div class="group">
				<input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''} />
				<label for="task-${index}">${task.name} (${task.date})</label>
				<button onclick="removeTask(${index})">Remove</button>
			</div>
		`;

		const checkbox = li.querySelector(`#task-${index}`);
		checkbox.addEventListener('change', () => {
			tasks[index].completed = checkbox.checked; 
			localStorage.setItem('tasks', JSON.stringify(tasks)); 
		});

		taskList.appendChild(li);
	});
}

// Add task
taskForm.addEventListener('submit', (event) => {
	event.preventDefault(); 

	const taskName = document.getElementById('Tasks').value.trim();
	const taskDate = document.getElementById('Rdate').value;

	if (taskName && taskDate) {
		tasks.push({ name: taskName, date: taskDate, completed: false });
		localStorage.setItem('tasks', JSON.stringify(tasks)); 
		renderTasks();
		taskForm.reset(); 
	} else {
		alert('Please enter both task name and date.');
	}
});


window.removeTask = function (index) {
	tasks.splice(index, 1); 
	localStorage.setItem('tasks', JSON.stringify(tasks)); 
	renderTasks(); 
};

renderTasks();
