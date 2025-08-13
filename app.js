document.addEventListener('DOMContentLoaded', function() {
            const taskForm = document.getElementById('taskForm');
            const taskInput = document.getElementById('taskInput');
            const taskList = document.getElementById('taskList');
            const emptyState = document.getElementById('emptyState');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const totalCount = document.getElementById('totalCount');
            const pendingCount = document.getElementById('pendingCount');
            const completedCount = document.getElementById('completedCount');
            
            let currentFilter = 'all';
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            function init() {
                renderTasks();
                updateStats();
                updateEmptyState();
            }
            
            taskForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const text = taskInput.value.trim();
                if (text) {
                    const newTask = {
                        id: Date.now(),
                        text,
                        completed: false
                    };
                    
                    tasks.push(newTask);
                    saveTasks();
                    taskInput.value = '';
                    renderTasks();
                    updateStats();
                    updateEmptyState();
                }
            });
            
            function renderTasks() {
                taskList.innerHTML = '';
                
                let filteredTasks = tasks;
                if (currentFilter === 'pending') {
                    filteredTasks = tasks.filter(task => !task.completed);
                } else if (currentFilter === 'completed') {
                    filteredTasks = tasks.filter(task => task.completed);
                }
                
                if (filteredTasks.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                    
                    filteredTasks.forEach(task => {
                        const taskItem = document.createElement('li');
                        taskItem.className = 'task-item';
                        taskItem.dataset.id = task.id;
                        
                        taskItem.innerHTML = `
                            <input 
                                type="checkbox" 
                                class="task-checkbox" 
                                ${task.completed ? 'checked' : ''}
                            >
                            <span class="task-text ${task.completed ? 'completed' : ''}">
                                ${task.text}
                            </span>
                            <button class="delete-btn">×</button>
                        `;
                        
                        taskList.appendChild(taskItem);
                        
                        const checkbox = taskItem.querySelector('.task-checkbox');
                        const deleteBtn = taskItem.querySelector('.delete-btn');
                        
                        checkbox.addEventListener('change', function() {
                            toggleTaskCompletion(task.id);
                        });
                        
                        deleteBtn.addEventListener('click', function() {
                            deleteTask(task.id);
                        });
                    });
                }
            }
            
            function toggleTaskCompletion(id) {
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
                updateStats();
            }
            
            function deleteTask(id) {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
                updateStats();
                updateEmptyState();
            }
            
            function updateStats() {
                const total = tasks.length;
                const completed = tasks.filter(task => task.completed).length;
                const pending = total - completed;
                
                totalCount.textContent = total;
                pendingCount.textContent = pending;
                completedCount.textContent = completed;
            }
            
            function updateEmptyState() {
                if (tasks.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
            }
            
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    renderTasks();
                });
            });
            
            init();
        });