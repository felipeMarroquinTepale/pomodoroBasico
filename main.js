
//almacenara todas las tareas que puedo ir ejecutando
const tasks = [];
//contara la cuenta regresiva
let time = 0;

//nos ayudara a ver si hay una actividad en progreso
let timer = null;

//me señala el tiempo de descanso
let timerBreack = null;

//me dira la tarea que se esta ejecutando
let current = null;


const bAdd = document.querySelector('#bAdd')
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector('#time #taskName');


renderTime();
renderTasks();


form.addEventListener('submit', e=>{
    e.preventDefault();
    //Si el input itTask es diferente a vacio me crea una tarea
    if(itTask.value != ''){
        createTask (itTask.value);
        itTask.value = '';
        // Despues de agregar una nueva tarea tengo que renderizar los elementos que existan en el arreglo tasks
        renderTasks();
    }
});

function createTask(value){
    const newTask  = {
        id: (Math.random() * 100).toString(36).slice(3),  // id dinamico
        title:value,
        completed:false
    };
    //agregamos una nueva tarea al arreglo de tasks
    tasks.unshift(newTask);
}

function renderTasks(){
    const html = tasks.map( task => {
        //cada tarea que tenga en mi arreglo tasks
        //devuelve dos capas hijas:
        //1 capa: me dira si la tarea esta completada. Si esta completada me arrojara un mensaje "completado" si no me arrojara un boton "start"

        return `
            <div class=task>
                <div class="completed">${task.completed ? `<span class="done">completado</span>` : `<button class="start-button" data-id="${task.id}">Start</button>` }</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector("#tasks");
    //Me separa cada div con un vacio
    tasksContainer.innerHTML = html.join('');

    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach(button => {
        button.addEventListener("click", e => {
            //si no hay una actividad en progreso
            if(!timer){
                const id = button.getAttribute("data-id");
                startButtonHandler(id);
                button.textContent = "In progress...";
            }
        })
    });
}


//Tenemos que calcular los 25 minutos de la actividad
function startButtonHandler(id){
    //25 minutos y por cada minuto tiene 60 segundos
    time = 25 * 60;
    //id actividad actual
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;

    renderTime()


    timer = setInterval(() => {
        timeHandler(id);
    },1000);

}

function timeHandler(id){
    time --;
    renderTime();

    if(time ===0 ){
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function renderTime(){
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time/60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id){
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].completed = true;
}

function startBreak(){
    time = 3 * 60;
    taskName.textContent = "Break";

    renderTime();

    timerBreack = setInterval(()=> {
        timerBreackHandler();

    }, 1000);
}

function timerBreackHandler(){
    time--;
    renderTime();

    if(time === 0){
        clearInterval(timeHandler);
        current = null;
        timerBreack=null;
        taskName.textContent = "";

        renderTasks();
    }
}