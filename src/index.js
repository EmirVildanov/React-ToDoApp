import React, {useContext} from "react";
import ReactDOM from "react-dom";
import "./index.css";

const TasksContext = React.createContext();

class Task extends React.Component {
    render() {
        return (
            <div>
                <TasksContext.Consumer>
                    {context => (
                        <span
                            className={this.props.checked ? "checked" : ""}
                            onClick={() => context.changeStatus(this.props.id)}
                        >
                            <button className="close"
                                    onClick={(event) => {
                                        context.deleteTask(this.props.id);
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
        newTaskId: 0,
    }

    addTaskToArray(text) {
        if (this.state.tasks.some(element => element.text === text)) {
            alert("Current task is already in the table");
            return this.state.tasks;
        }
        const { tasks } = this.state;
        tasks.push(
            {
                id: this.state.newTaskId,
                text: text,
                checked: false,
            }
        )
        this.setState({newTaskId: this.state.newTaskId + 1})
        this.setState({tasks: tasks})
    }

    deleteTaskFromArray(id) {
        const { tasks } = this.state;
        tasks.splice(tasks.findIndex(element => element.id === id), 1)
        this.setState({tasks: tasks})
    }

    changeTaskReadyStatus(id) {
        const { tasks } = this.state;
        const taskIndex = tasks.findIndex(element => element.id === id);
        tasks[taskIndex].checked = !tasks[taskIndex].checked;
        this.setState({tasks: tasks});
    }

    render() {
        return (
            <TasksContext.Provider value={{
                state: this.state,
                addTask: (task) => this.addTaskToArray(task),
                deleteTask: (id) => this.deleteTaskFromArray(id),
                changeStatus: (id) => this.changeTaskReadyStatus(id),
            }}>
                {this.props.children}
            </TasksContext.Provider>
        )
    }
}

function TasksBoard() {
    const context = useContext(TasksContext);
    return (
        <React.Fragment>
            {context.state.tasks.map(element => <Task key={element.id} id={element.id} checked={element.checked} text={element.text}/>)}
        </React.Fragment>
    )
}

class InputPane extends React.Component {
    state = {
        inputValue: "",
    }

    confirmInput(context) {
        if (this.state.inputValue === null) {
            alert("Null input");
        } else if (this.state.inputValue === '') {
            alert("Please enter something");
        } else {
            context.addTask(this.state.inputValue);
            this.setState({inputValue: ""});
        }
    }

    handleKeyDown(event, context) {
        if (event.keyCode === 13) {
            this.confirmInput(context);
        }
    }

    handleChange(event) {
        this.setState({ inputValue: event.target.value });
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
                                value={ this.state.inputValue }
                                onChange={ event=> this.handleChange(event) }
                                onKeyDown={ event => this.handleKeyDown(event, context) }
                            >
                            </input>
                            <span onClick={() => {
                                this.confirmInput(context);
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
