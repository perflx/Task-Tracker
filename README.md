# Task Tracker CLI
Backend-project for https://roadmap.sh/projects/task-tracker, written in JavaScript/Node. It allows users to easily create, list, update, and delete tasks.

## Prerequisites
Node.js must be installed on your device!

## Installation
Clone the repository:
```
git clone https://github.com/yourusername/Task-Tracker.git
```

## Run the program
```
cd Task-Tracker
node index
```

## Usage
Each task contains `description`, `id` and `status`. You can:
- ### Add a Task
```javascript
add <Task_name>
a <Task_name>
```
Adds a new task with the status *todo*, unique *id* and *description* you give.

**Example**
```
add Cook a breakfast
a Read Stolyarov
```
- ### List tasks
```javascript
list
list <status>
```
Shows all tasks or tasks filtered by status (`todo`, `in-progress`, `done`).
**Example**
```
list
>Cook a breakfast (ID:0):todo
>Read Stolyarov (ID:1):done

list done
>Read Stolyarov (ID:1):done
```

- ### Delete the Task
```javascript
delete <id>
del <id>
d <id>
```
Deletes a task with `id`

**Example**
```
del 1
>Success! read Stolyarov (ID:1)  was removed!
```
- ### Mark task in progress
```javascript
mark-in-progress <task ID>
mip <task ID>
```
Changes task status from todo to in-progress.

**Example**
```
mip 0
>Success! Status of "Cook a breakfast" (ID:0) is "in-progress"
```

- ### Mark task done
```javascript
mark-done <task ID>
md <task ID>
```
Marks a task as completed (done)

**Example**
```
md 0
>Success! Status of "Cook a breakfast" (ID:0) is "done"
```

- ### Update task description
```javascript
update <task ID> <new description>
upd <task ID> <new description>
```
Changes the description of a task.

**Example**
```
upd 3 Finish reading book
>Description of ID:3 was updated!
```

- ### Exit the CLI
```
exit  
```


Notes:
- Task IDs are generated automatically.

- Tasks are saved in tasks.json after every modification.

### Colors in the console help distinguish task status:

- green → success messages

- red → errors

- yellow → task IDs

- cyan → task descriptions

- purple / magenta → tasks in progress






