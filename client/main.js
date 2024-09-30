import { createApp } from 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js';

const app = createApp({
    data() {
        return {
            tasks: [],
            accessToken: ''
        };
    },
    methods: {
        async register() {
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            const response = await fetch('https://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            alert(result.message);
        },
        async login() {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const response = await fetch('https://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.accessToken) {
                this.accessToken = result.accessToken;
                alert('Login successful!');
                await this.fetchTasks();
            } else {
                alert(`Login failed: ${result.message}`);
            }
        },
        async fetchTasks() {
            const response = await fetch('https://localhost:3000/tasks', {
                headers: { Authorization: `Bearer ${this.accessToken}` }
            });
            this.tasks = await response.json();
        },
        async addTask() {
            const taskTitle = document.getElementById('newTaskTitle').value;
            const taskDescription = document.getElementById('newTaskDescription').value;

            await fetch('https://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.accessToken}`
                },
                body: JSON.stringify({ title: taskTitle, description: taskDescription })
            });

            await this.fetchTasks();
            document.getElementById('newTaskTitle').value = '';
            document.getElementById('newTaskDescription').value = '';
        },
        async deleteTask(id) {
            await fetch(`https://localhost:3000/tasks/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${this.accessToken}` }
            });
            await this.fetchTasks();
        }
    }
});

app.mount('#app');

document.getElementById('registerBtn').onclick = () => app._instance.proxy.register();
document.getElementById('loginBtn').onclick = () => app._instance.proxy.login();
document.getElementById('addTaskBtn').onclick = () => app._instance.proxy.addTask();
