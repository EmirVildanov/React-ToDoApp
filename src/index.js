import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state.text = props.text;
    }

    state = {
        checked: false,
        text: '',
    }

    changeReadyStatus() {
        if (!this.state.checked) {
            this.state.checked = !this.state.checked
            return "checked"
        }
        this.state.checked = !this.state.checked
        return ""
    }

    render() {
        return (
            <div>
                <span
                    className={this.state.checked ? "checked" : ""}
                    onClick={() => this.setState({checked: !this.state.checked})}>
                    <TasksContext.Consumer>
                        {context => (
                            <button className="close" onClick={() => context.deleteTask(this.state.text)}>Remove</button>
                        )}
                    </TasksContext.Consumer>
                    {this.state.text}
                </span>
            </div>
        )
    }
}

const TasksContext = React.createContext()

class TasksProvider extends React.Component {
    state = {
        tasks: Array(),
    }

    addTaskToArray(text) {
        const newArray = this.state.tasks.slice()
        newArray.push(<Task text={text} />)
        return newArray
    }

    deleteTaskFromArray(task) {
        const newArray = this.state.tasks.slice()
        const indexOfDeletingElement = this.state.tasks.indexOf(task)
        newArray.splice(indexOfDeletingElement, 1)
        return newArray
    }

    render() {
        return (
            <TasksContext.Provider value={{
                state: this.state,
                addTask: (task) => this.setState({tasks: this.addTaskToArray(task)}),
                deleteTask: (task) => this.setState({tasks: this.deleteTaskFromArray(task)})
            }}>
                {this.props.children}
            </TasksContext.Provider>
        )
    }
}

class TasksBoard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <TasksContext.Consumer>
                    {context => (
                        context.state.tasks
                    )}
                </TasksContext.Consumer>
            </React.Fragment>
        )
    }
}

class InputPane extends React.Component {
    render() {
        return (
            <TasksContext.Consumer>
                {context => (
                    <div className="header">
                        <h2 style={ { margin: 5 } }>My To Do List</h2>
                        <input
                            type="text"
                            id="newTaskInput"
                            placeholder="Title..."
                            onKeyDown={event => {
                                if (event.keyCode === 13) {
                                    context.addTask(document.getElementById("newTaskInput").value);
                                    document.getElementById("newTaskInput").value = "";
                                }
                            }}
                        >
                        </input>
                        <span
                            onClick={() => {
                                context.addTask(document.getElementById("newTaskInput").value);
                                document.getElementById("newTaskInput").value = "";}
                            }
                            className="addBtn">Add
                        </span>
                    </div>
                )}
            </TasksContext.Consumer>
        )
    }
}

class ToDoApp extends React.Component {
    render() {
        return (
            <TasksProvider>
                <div>
                    <InputPane />
                    <TasksBoard />
                </div>
            </TasksProvider>
        );
    }
}

ReactDOM.render(
    <ToDoApp/>,
    document.getElementById('root')
);