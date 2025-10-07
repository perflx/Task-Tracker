import * as fs from 'node:fs/promises';
import readline from 'node:readline';
import {stdin as input, stdout as output, exit} from 'node:process';


const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  purple: "\x1b[35m",
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  brightMagenta: "\x1b[95m",
  brightGreen: "\x1b[92m",
  brightRed: "\x1b[91m",

};

const rl = readline.createInterface({input: process.stdin,
    output: process.stdout,
    prompt: `${colors.purple}task-cli ${colors.reset}`});    



class Task{
    constructor(description){
        this.id = getid();
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

function list(status){
    let result = '';
    if (!status){
        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].status == 'done'){
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.brightGreen}done${colors.reset}\n`;
            }else if (tasks[i].status == 'todo'){
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.brightRed}todo${colors.reset}\n`;
            }else if (tasks[i].status == 'in-progress'){
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.brightMagenta}in-progress${colors.reset}\n`;
            }else{
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.red}Unknown${colors.reset}\n`;
            }
            
        }
    }else if (status == 'done'){
        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].status == status){
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.brightGreen}done${colors.reset}\n`;
            }
        }
    }else if (status == 'in-progress'){
        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].status == status){
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.brightMagenta}in-progress${colors.reset}\n`;
            }
        }
    }else if (status == 'todo'){
        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].status == status){
                result = result + `${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${tasks[i].id})${colors.reset}:${colors.brightRed}todo${colors.reset}\n`;
            }
        }
    }
    if (result.length < 10){
        return `${colors.red}No tasks with this status!${colors.reset}`;
    }
    return result.slice(0, result.length-2);
}

let tasks = await loadTasks();

function getid(){
    if (tasks.length < 1){
        return 0;
    }else{
    return tasks[tasks.length-1].id + 1;
    }
}

rl.prompt();

rl.on('line', (line)=>{
    let task, id, valid, status;
    const input = line.trim().split(' ');
    const command = input[0];
    const args = input.slice(1);

    switch(command){
        case 'wtf':
            console.log(`Tasks: ${JSON.stringify(tasks)}`);
            break;
        case 'exit':
        case 'e':
            console.log(`${colors.cyan}See you!${colors.reset}`);
            exit(0);

        case 'add':
        case 'a':
            if (args.length < 1){
                console.log(`${colors.red}You should give a name to your task!${colors.reset}`);
                break;
            };
            const name = args.join(' ')
            task = new Task(name);
            tasks.push(task);
            saveTasks();
            console.log(`${colors.green}Task added successfully ${colors.yellow}(ID: ${task.id})${colors.reset}`);
            break;

        case 'mark-in-progress':
        case 'mip':
            if (!args[0]){
                console.log(`${colors.red}Fail! You should provide ID of the task${colors.reset}`);
                break;
            }else if(args[0] >= getid()){
                console.log(`${colors.red}No task with ${colors.yellow}ID:${args[0]}${colors.reset}`);
                break;
            }
            task = tasks[args[0]];
            if (task.status == 'todo'){
                task.status = 'in-progress';
                task.startedAt = new Date().toLocaleString('ru-RU');
                console.log(`${colors.green}Success! Status of ${colors.cyan}"${task.description}" ${colors.yellow}(ID:${task.id}) ${colors.green}is ${colors.blue}"${task.status}"${colors.reset}`);
                saveTasks();
            }
            else{
                console.log(`${colors.red}Fail! Status of ${colors.cyan}"${task.description}" ${colors.yellow}(ID:${task.id}) ${colors.red}is ${colors.blue}"${task.status}"${colors.reset}"`);
            }
            break;


        case 'mark-done':
        case 'md':
            if (!args[0]){
                console.log(`${colors.red}Fail! You should provide ID of the task${colors.reset}`);
                break;
            }else if(args[0] >= getid()){
                console.log(`${colors.red}No task with ${colors.yellow}ID:${args[0]}${colors.reset}`);
                break;
            }
            task = tasks[args[0]]
            if (task.status != 'done'){
                task.status = 'done';
                task.completedAt = new Date().toLocaleString('ru-RU');
                task.startedAt = 'done, without starting';
                saveTasks();
                console.log(`${colors.green}Success! Status of ${colors.cyan}"${task.description}" ${colors.yellow}(ID:${task.id}) ${colors.green}is ${colors.blue}"${task.status}"${colors.reset}`);
            }else{
                console.log(`${colors.red}Fail! Status of ${colors.cyan}"${task.description}" ${colors.yellow}(ID:${task.id}) ${colors.red}is ${colors.blue}"${task.status}"${colors.reset}`); 
            }
            break;
        
        case 'delete':
        case 'del':
        case 'd':
            if (!args[0]){
                console.log(`${colors.red}Fail! You should provide ID of the task${colors.reset}`);
                break;
            }else if(args[0] >= getid()){
                console.log(`${colors.red}No task with ${colors.yellow}ID:${args[0]}${colors.reset}`);
                break;
            }
            id = args[0];
            valid = false;
            for (let i = 0; i < tasks.length; i++){
                if (tasks[i].id == id){
                    valid = true;
                    console.log(`${colors.green}Success! ${colors.cyan}${tasks[i].description} ${colors.yellow}(ID:${id}) ${colors.green} was removed!${colors.reset}`);
                    tasks.splice(i, 1);
                    saveTasks();
                }
            }
            if (!valid){
                console.log(`${colors.red}No tasks with ${colors.yellow}ID:${id}${colors.reset}`);
            }
            break;
        
        case 'update':
        case 'upd':
            if (!args[0]){
                console.log(`${colors.red}Fail! You should provide ID of the task${colors.reset}`);
                break;
            }else if(args[0] >= getid()){
                console.log(`${colors.red}No task with ${colors.yellow}ID:${args[0]}${colors.reset}`);
                break;
            }
            valid = false;
            id = args[0];
            task = args.slice(1,args.length).join(' ');
            for (let i=0; i < tasks.length; i++){
                if (tasks[i].id == id){
                    tasks[id].description = task;
                    console.log(`${colors.green}Description of ${colors.yellow}ID:${id}${colors.green} was updated!${colors.reset}`);
                    saveTasks();
                    valid = true;
                }
            }
            if (!valid){
                console.log(`${colors.red}No tasks with ${colors.yellow}ID:${id}`);
            }
            break;
            
        case 'list':
            if (!args[0]){
                console.log(list(0))
                break;
            }
            status = args[0];
            if (status){
                console.log(list(status))
            }
            break;
        
        default:
            console.log(`${colors.red}Unknown command: ${command}${colors.reset}`);
            break;
    }
});




