/* globals fetch, moment */

const url = 'http://localhost:3000/notes/'

const noteSave = document.querySelector('#save-note')
const noteList = document.querySelector('#note-list')
const sideBar = document.querySelector('#side-bar')

fetch(url)
  .then(res => res.json())
  .then(notes => {
    // for (let note of notes) {
    //   if (note.item !== '') {
    //     renderNote(note)
    //   }
    // }
    for (let i = notes.length - 1; i >= 0; i--) {
      if (notes[i].item !== '') {
        renderNote(notes[i])
      }
    }
  })

noteSave.addEventListener('click', function (event) {
  event.preventDefault()
  const noteHeader = document.querySelector('#note-header').value
  const noteBody = document.querySelector('#note-body').value
  createNote(noteHeader, noteBody)
})

function createNote (noteHeader, noteBody) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: noteHeader,
      detail: noteBody,
      created_at: moment().format()
    })
  })
    .then(res => res.json())
    .then(data => {
      renderNote(data)
    })
  document.location.reload()
}

function renderNote (todoObj) {
  const itemEl = document.createElement('div')
  const itemDetail = document.createElement('div')
  itemEl.classList.add('note-header')
  itemDetail.classList.add('note-body')

  itemEl.id = todoObj.id
  itemEl.innerHTML = `${todoObj.item}<i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
  itemDetail.innerHTML = `${todoObj.detail}<br><br><br>${todoObj.created_at}`
  noteList.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
}

function deleteNote (eventTarget) {
  console.log(eventTarget.parentElement)
  const noteId = eventTarget.parentElement.id
  // debugger
  alert ('Are you sure you want to delete this message? Skip the "OK" and reload page if not.')
  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'DELETE'
  })
    .then(function(res) {
      return res.json()
    })
    .then(function(data) {
      console.log(data)
    })
  document.location.reload()
}

noteList.addEventListener('click', function (event) {
  // console.log(event.target.parentElement)
  if (event.target.classList.contains('delete')) {
    deleteNote(event.target)
  }
})

noteList.addEventListener('click', function (event) {
  if (event.target.classList.contains('edit')) {
    editNote(event.target)
  }
})

function renderEdit (todoObj) {
  const itemEl = document.createElement('div')
  const itemDetail = document.createElement('div')
  itemEl.classList.add('note-header')
  itemDetail.classList.add('note-body')

  itemEl.id = todoObj.id
  itemEl.innerHTML = todoObj.item
  itemDetail.innerHTML = `${todoObj.detail}<br><br><br>Created at: ${todoObj.created_at}`
  sideBar.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
}

function editNote (eventTarget) {
  console.log(eventTarget)
  console.log(eventTarget.parentElement)
  const noteId = eventTarget.parentElement.id
  console.log(noteId)

fetch(`http://localhost:3000/notes/${noteId}`)
.then(res => res.json())
.then(data => {
  renderEdit(data)
})

  // renderEdit (eventTarget.parentElement)
  // debugger


  // fetch(`http://localhost:3000/notes/${noteId}`, {
  //   method: 'DELETE'
  // })
  //   .then(function(res) {
  //     return res.json()
  //   })
  //   .then(function(data) {
  //     console.log(data)
  //   })
  // document.location.reload()
}