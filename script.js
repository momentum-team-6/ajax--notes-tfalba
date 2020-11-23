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
  const itemCreated = document.createElement('div')
  
  itemEl.classList.add('note-header')
  itemDetail.classList.add('note-body')
  itemCreated.classList.add('time-created')
  itemEl.id = todoObj.id
  itemEl.innerHTML = `${todoObj.item}<i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
  itemDetail.innerHTML = todoObj.detail
  itemCreated.innerHTML = todoObj.created_at

  noteList.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
  itemEl.appendChild(itemCreated)
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

// noteSave.addEventListener('click', function (event) {
//   event.preventDefault()
//   const noteHeader = document.querySelector('#note-header').value
//   const noteBody = document.querySelector('#note-body').value
//   createNote(noteHeader, noteBody)
// })

noteList.addEventListener('click', function (event) {
  if (event.target.classList.contains('edit')) {
    console.log(event.target)
    console.log(event.target.parentElement)
    const noteId = event.target.parentElement.id
    const noteHeader = document.querySelector('#note-header').value
    const noteBody = document.querySelector('#note-body').value
    editNote(noteHeader, noteBody, noteId)
  }
})

function renderEdit (todoObj) {
  const itemEl = document.createElement('div')
  const itemDetail = document.createElement('div')
  const itemModified = document.createElement('div')
  itemEl.classList.add('note-header')
  itemDetail.classList.add('note-body')
  itemModified.classList.add('time-modified')
  // itemEl.id = todoObj.id
  itemEl.innerHTML = `${todoObj.item}<i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
  itemDetail.innerHTML = todoObj.detail
  itemModified.innerHTML = todoObj.modified_at

  noteList.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
  itemEl.appendChild(itemModified)
  debugger
}

function editNote (noteHeader, noteBody, noteId) {

  console.log(noteId)

// const url = 'http://localhost:3000/notes/49'

  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: noteHeader,
      detail: noteBody,
      modified_at: moment().format()
    })
  })
  .then(res => res.json())
  .then(data => {

    
    renderEdit(data)
    console.log(data)
  })
}