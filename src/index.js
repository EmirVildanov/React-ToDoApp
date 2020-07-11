import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const TasksContext = React.createContext()

class Task extends React.Component {
    render() {
        return (
            <div>
                <TasksContext.Consumer>
                    {context => (
                        <span
                            className={this.props.checked ? "checked" : ""}
                            onClick={() => context.changeStatus(this.props.text)}
                        >
                            <button className="close"
                                    onClick={(event) => {
                                        context.deleteTask(this.props.text);
                                        event.stopPropagation();
                                    }}
                            >
                                Remove
                            </button>
                            {this.props.text}
                        </span>
                    )}
                </TasksContext.Consumer>
            </div>
        )
    }
}

class TasksProvider extends React.Component {
    state = {
        tasks: [],
    }

    addTaskToArray(text) {
        for (let i = 0; i < this.state.tasks.length; ++i) {
            if (this.state.tasks[i].text === text) {
                alert("Current task is already in the table");
                return this.state.tasks;
            }
        }
        const newArray = this.state.tasks.slice();
        newArray.push(
            {
                text: text,
                checked: false
            });
        return newArray;
    }

    findCurrentTaskIndex(taskText) {
        for (let i = 0; i < this.state.tasks.length; ++i) {
            if (this.state.tasks[i].text === taskText) {
                return i;
            }
        }
    }

    deleteTaskFromArray(text) {
        const newArray = this.state.tasks.slice();
        const indexOfDeletingElement = this.findCurrentTaskIndex(text);
        newArray.splice(indexOfDeletingElement, 1);
        return newArray;
    }

    changeTaskReadyStatus(text) {
        const newArray = this.state.tasks.slice();
        const indexOfDeletingElement = this.findCurrentTaskIndex(text)
        newArray[indexOfDeletingElement].checked = !newArray[indexOfDeletingElement].checked;
        return newArray;
    }

    render() {
        return (
            <TasksContext.Provider value={{
                state: this.state,
                addTask: (task) => this.setState({tasks: this.addTaskToArray(task)}),
                deleteTask: (task) => this.setState({tasks: this.deleteTaskFromArray(task)}),
                changeStatus: (task) => this.setState( {tasks: this.changeTaskReadyStatus(task)}),
            }}>
                {this.props.children}
            </TasksContext.Provider>
        )
    }
}

function TasksBoard() {
    return (
        <React.Fragment>
            <TasksContext.Consumer>
                {context => (
                    context.state.tasks.map(element => <Task key={element.text} checked={element.checked} text={element.text}/>)
                )}
            </TasksContext.Consumer>
        </React.Fragment>
    )
}

class InputPane extends React.Component {
    confirmInput(context) {
        const input = document.getElementById("newTaskInput").value
        if (input !== '') {
            context.addTask(input);
            document.getElementById("newTaskInput").value = "";
        } else {
            alert('Please enter something');
        }
    }

    render() {
        return (
            <div className="header">
                <h2 style={{margin: 5}}>My To Do List</h2>
                <TasksContext.Consumer>
                    {context => (
                        <React.Fragment>
                            <input
                                type="text"
                                id="newTaskInput"
                                placeholder="Enter new task..."
                                onKeyDown={event => {
                                    event.keyCode === 13 && this.confirmInput(context)
                                }}
                            >
                            </input>
                            <span onClick={() => {
                                this.confirmInput(context)
                            }} className="addBtn">
                                Add
                            </span>
                        </React.Fragment>
                    )}
                </TasksContext.Consumer>
            </div>
        )
    }
}

function ToDoApp() {
    return (
        <TasksProvider>
            <div>
                <InputPane/>
                <TasksBoard/>
            </div>
        </TasksProvider>
    );
}

ReactDOM.render(
    <ToDoApp/>,
    document.getElementById('root')
);