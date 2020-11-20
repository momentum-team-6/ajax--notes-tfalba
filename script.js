/* globals fetch, moment */

const url = 'http://localhost:3000/todos/'

const formTodo = document.querySelector('#todo-form')
const todoList = document.querySelector('#todo-list')

fetch(url)
  .then(res => res.json())
  .then(data => {
    for (let todo of data) {
      renderTodoItem(todo)
    }
  })

formTodo.addEventListener('submit', function (event) {
  event.preventDefault()
  const todoText = document.querySelector('#todo-text').value
  const todoDetail = document.querySelector('#todo-detail').value
  createTodo(todoText, todoDetail)
})

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
    })
}

function renderTodoItem (todoObj) {
  const itemEl = document.createElement('li')
  const itemDetail = document.createElement('div')
  itemEl.innerText = todoObj.item
  itemDetail.innerText = todoObj.detail
  // use innerHTML if want to use a template literal
  todoList.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
}

