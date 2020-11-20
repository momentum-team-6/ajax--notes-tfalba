/* globals fetch, moment */

const url = 'http://localhost:3000/todos/'
// const url2 = 'http://localhost:3000/notes'

const formTodo = document.querySelector('#todo-form')
const todoList = document.querySelector('#todo-list')
const noteList = document.querySelector('#notes')
const formFilter = document.querySelector('#notes-form')

// fetch(url2)
// .then(res => res.json())
// .then(data => {
//   console.log(data)
// })

// Right now this is running as soon as the page loads, which is ok but not great
// I wil3.+...l want to put this inside a function and/or an event listener when we revise this code tomorrow
fetch(url)
  .then(res => res.json())
  .then(data => {
    for (let todo of data) {
      renderTodoItem(todo)
      // renderNotes(todo)
      // kill the renderNotes here, but add another fetch in the filter function
    }
  })

formTodo.addEventListener('submit', function (event) {
  event.preventDefault()
  const todoText = document.querySelector('#todo-text').value
  const todoDetail = document.querySelector('#todo-detail').value
  createTodo(todoText, todoDetail)
})

// add a second event listener for submit of filter

formFilter.addEventListener('submit', function (event) {
  event.preventDefault()
  const todoText = document.querySelector('#todo-text').value
  const todoDetail = document.querySelector('#todo-detail').value
  filter(todoText, todoDetail)
})

function filter (todoText, todoDetail) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      for (let todo of data) {
        if (todo.item === 'laundry') {
          renderNotes(todo)
        }
      // kill the renderNotes here, but add another fetch in the filter function
      }
    })
}

function createTodo (todoText, todoDetail) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: todoText,
      detail: todoDetail,
      created_at: moment().format()
    })
  })
    .then(res => res.json())
    .then(data => {
      renderTodoItem(data)
      // renderNotes(data)
    })
}

function renderTodoItem (todoObj) {
  const itemEl = document.createElement('li')
  // debugger
  itemEl.innerText = todoObj.item
  todoList.appendChild(itemEl)
}

function renderNotes (todoObj) {
  const noteEl = document.createElement('div')
  // // debugger

  noteEl.classList.add('box-me')
  // noteEl.innerHTML = todoObj.item
  noteEl.innerHTML = todoObj.detail
  noteList.appendChild(noteEl)
  // review how we used classList.add
}
