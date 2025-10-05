import * as fs from 'node:fs/promises';
import readline from 'node:readline';
import {stdin as input, stdout as output, exit} from 'node:process';


const rl = readline.createInterface({input: process.stdin,
    output: process.stdout,
    prompt: 'task-cli '});    



class Task{
    constructor(description){
        this.id = tasks.length;
        this.description = description;
        this.status = "todo";
        this.createdAt = new Date().toLocaleString('ru-RU');
        this.startedAt = "Not started";
        this.completedAt = "Not completed";
    }
}


async function saveTasks(){
    await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
}

async function loadTasks(){
    try{
        const data = await fs.readFile('tasks.json', 'utf-8');
        if (data.length < 10){
            return []
        }
        return JSON.parse(data);
    }
    catch(error){   
        if (error.code === 'ENOENT'){
            const initialData = '[]';
            fs.writeFile('tasks.json', initialData);
            return new Array();
        }
        else{
            throw error;
        }
    }
}

let tasks = await loadTasks();

// loadTasks();
async function read(){
    let data = await fs.readFile('tasks.json', 'utf-8');
    console.log(`Data: ${data}`);
}
// read();



rl.prompt();

rl.on('line', (line)=>{
    let task;
    const input = line.trim().split(' ');
    const command = input[0];
    const args = input.slice(1);

    switch(command){
        case 'exit':
        case 'e':
            console.log('See you!');
            exit(0);

        case 'newtask':
        case 'l':
            if (args.length < 1){
                console.log('You should give a name to your task!');
                break;
            };
            const name = args.join(' ')
            task = new Task(name);
            tasks.push(task);
            saveTasks();
            break;

        case 'list':
        case 'l':
            console.log(`Tasks: ${tasks}`);
            break;

        case 'start':
        case 's':
            task = tasks[args[0]];
            if (task.status == 'todo'){
                task.status = 'in-progress';
                task.startedAt = new Date().toLocaleString('ru-RU');
                console.log(`Success! Status of ${task.id}:${task.description} is "${task.status}"`);
                saveTasks();
            }
            else{
                console.log(`Fail! Status of ${task.id}:${task.description} is "${task.status}"`);
            }
            break;

        case 'complete':
        case 'c':
            task = tasks[args[0]]
            if (task.status != 'done'){
                task.status = 'done';
                task.completedAt = new Date().toLocaleString('ru-RU');
                task.startedAt = 'done, without starting';
                saveTasks();
                console.log(`Success! Status of ${task.id}:${task.description} is "${task.status}"`);
            }else{
                console.log("The task is already done!"); 
            }
            break;
            
            
        default:
            console.log(`Unknown command: ${command}`);
            break;
    }
});




