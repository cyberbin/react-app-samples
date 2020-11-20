import React, { Component } from "react"

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tasklist: []
    }
  }


  render() {
    return (
      <div><div>
        <div className="jumbotron jumbotron-fluid py-2">
          <div className="container">
            <h1 className="display-2">Todos App</h1>
          </div>
        </div>
        <form className="mb-3" onSubmit={this.submitter}>
          <div className="input-group">
            <input type="text" name="todoTask" className="form-control" placeholder="Please enter your task" autoComplete="off"></input>
            <div className="input-group-append">
              <button type="submit" className="btn btn-outline-success">Add</button>
            </div>
          </div>
        </form>
        <ul className="list-group">
          {
            this.state.tasklist.map((item, index) => {
              return <li className="list-group-item" key={index}> {item}<button className="btn btn-outline-danger float-right" onClick={(event) => { this.deleteTask(event, index) }}>Delete</button></li>

            })
          }
        </ul>
      </div></div>
    )
  }

  submitter = (event) => {
    var todoTask = event.target.elements.todoTask.value;
    console.log(todoTask)
    if (todoTask.length > 0) {
      this.setState({
        tasklist: [...this.state.tasklist, todoTask]
      })
      event.target.reset();
    }
    event.preventDefault()
  }

  deleteTask = (event, index) => {
    var taskArray = [...this.state.tasklist];
    taskArray.splice(index, 1)
    this.setState({ tasklist: taskArray })
  }

}


export default App

