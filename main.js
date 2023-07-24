const nameTask = document.querySelector("#nameTask");
const form = document.querySelector("#form");
const tempo = document.getElementById("temporizador");
const msg_tempo = document.getElementById("msg-tempo");
const alertDiv = document.getElementById("alert");

//nos ayudara si hay una actividad en progreso
let timer=null;
let time = 0;

//me señala el tiempo de descanso
let timerBreack = null;
//me dira la tarea que se esta ejecutando
let current = null;




//guardar todas las tareas que se agreguen
const tasks = []

const agregarTask = async (e) => {
    try{
        e.preventDefault();
        if(nameTask.value != ''){
            createTask(nameTask.value)
            nameTask.value = "";
            renderizarTask();
        }

    }catch(error){
        console.log(error);
    }
}


function createTask(nameTask){
    //Creamos un objeto que tendra campos como id, title, isCompleted
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),  // id dinamico,
        title: nameTask,
        isCompleted: false
    }

    //agregamos el objeto newTask al array tasks
    tasks.unshift(newTask);
}

function renderizarTask(){
    //imprimimos la vista con cada tarea existente
    const html = tasks.map(task => {
    return `
        <div class="col">
            <div class="card border-secondary p-3 shadow">
                <div class="card-body text-center">
                    <div id="title" class="text-center mt-5">
                        <strong>Task: </strong>${task.title}
                    </div>
                    <div class="mt-5">
                        <div class="d-grid gap-2">
                            ${task.isCompleted ?
                            `
                            <div class="d-grid gap-2">
                                <strong>Tarea completada</strong>
                                <button class="btn btn-success" id="deleteTask" type="submit" data-id="${task.id}">Eliminar tarea</button>
                            </div>

                            `
                            :

                            `
                            <div class="d-grid gap-2">
                                <button class="btn btn-dark"  id="start-task" data-id="${task.id}">Empezar tarea</button>
                                <button class="btn btn-success" type="submit" id="deleteTask" data-id="${task.id}">Eliminar tarea</button>
                            </div>
                            `
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    });


    const div_tasks = document.querySelector("#tasks");
    div_tasks.innerHTML = html.join('');

    //Eventos de todos los botones de deleteTask
    const deleteTask = document.querySelectorAll("#deleteTask");
    deleteTask.forEach(button=>{
        button.addEventListener("click",e => {
            e.preventDefault();

            const id = button.getAttribute("data-id");
            eliminarTask(id);

        })
    })

    //Eventos de todos los botones de iniciar una tarea
    const startButtonTask = document.querySelectorAll("#start-task");
    startButtonTask.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault();
            if(!timer){
                const id = button.getAttribute("data-id");

                startConteo(id);
                button.textContent = "In progress ...";
            }
        })
    });



}

//Eliminar una tarea
function eliminarTask(id){
    const taskIndex = tasks.findIndex(task => task.id === id);
    if(time != 0 ){
        alert("No se puede eliminar una actividad en progreso...");
    }else{
        const taskIndex = tasks.findIndex(task => task.id === id);
        tasks.splice(taskIndex, 1);
        console.log("tasks: ", tasks )
        renderizarTask();
    }
}


//Comenzar conteo de una tarea
function startConteo(id){
    //time contendra los segundos de 25 minutos
    time = 25 * 60;
    current = id;

    renderTimer();
    const taskIndex = tasks.findIndex(task => task.id === id);
    alertDiv.classList.add("alert-success");
    msg_tempo.textContent = "Enfocate con "+ tasks[taskIndex].title;


    timer = setInterval (()=>{
        time --;
        renderTimer();
        if(time === 0){
            clearInterval(timer);
            markCompleted(id);
            timer=null;
            renderizarTask();
            startBreak();
        }
    },1000);
}


//Renderizamos el temporizador
function renderTimer(){
    //convertimos los segundos totales de 25 minutos a minutos otra vez
    const minutes = parseInt(time/60);
    //los segundos
    const seconds = parseInt(time%60);
    tempo.textContent = `${minutes < 10 ? "0" : ""}${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
}


//Marcamos si la tarea se completo
function markCompleted(id){
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].isCompleted = true;
}

//Iniciamos el tiempo de descanso
function startBreak(){
    //el tiempo de descanso sera de 3 minutos
    time = 3 * 60;
    renderTimer();
    alertDiv.classList.add("alert-warning");
    msg_tempo.textContent = "Tiempo de descanso";

    timerBreack = setInterval(()=> {
        time --;
        renderTimer();
        if(time===0){
            clearInterval(timerBreack);
            current = null;
            timerBreack=null;
            tempo.textContent = "";
            msg_tempo.textContent = ""
            alertDiv.classList.remove("alert-warning");
            alertDiv.classList.remove("alert-success");
            renderizarTask();
        }
    }, 1000);
}



form.addEventListener("click",agregarTask);