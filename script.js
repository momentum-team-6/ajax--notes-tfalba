/* globals fetch, moment */
const url = 'http://localhost:3000/notes/'
const noteSave = document.querySelector('.save-note')
const noteList = document.querySelector('#note-list')
const noteHeader = document.querySelector('#note-header')
const noteBody = document.querySelector('#note-body')
const noteUpdate = document.querySelector('.update-note')

function listNotes () {
  let noteArray = []
  fetch(url)
    .then(res => res.json())
    .then(notes => {
      for (let note of notes) {
        noteArray.push(note)
      }
      console.log(noteArray)
      renderNotes(noteArray)
    })
}

listNotes()
/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   Event Listeners                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

noteList.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete')) {
    deleteNote(event.target)
  }
  if (event.target.classList.contains('edit')) {
    editNote(event.target)
  }
  if (event.target.classList.contains('update-me')) {
    const noteId = document.querySelector('button.update-me').dataset.note
    const element = event.target.parentElement.parentElement.parentElement
    updateNote(element)
  }
})

noteSave.addEventListener('click', function (event) {
  createNote()
})

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    JSON Fetches                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

function createNote () {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: noteHeader.value,
      detail: noteBody.value,
      created_at: moment().format('lll')
    })
  })
    .then(res => res.json())
    .then(data => {
      listNotes()
      clearInputs()
    })
}

function deleteNote (eventTarget) {
  const noteId = eventTarget.parentElement.parentElement.id
  console.log(noteId)
  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'DELETE'
  })
    .then(() => {
      listNotes()
    })
}

function editNote (eventTarget) {
  const noteId = eventTarget.parentElement.parentElement.id
  eventTarget.parentElement.parentElement.classList.add('update')
  eventTarget.innerHTML = `<button class='update-me' data-note='${noteId}'>Update</button>`
}

/* --------------------------------------- Embeds json, event listener and DOM manipulation ----------------------------------------------- */

function updateNote (eventTarget) {
  const noteId = eventTarget.id
  const body = eventTarget.querySelector('.note-body')
  const header = eventTarget.querySelector('.note-header')
  // const header = eventTarget.parentElement.querySelector('note-header')

  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: header.value,
      detail: body.value,
      modified_at: moment().format('lll')
    })
  })
    .then(res => res.json())
    .then(data => {
      // eventTarget.classList.remove('update-me')
      // don't need this anymore???

      listNotes()
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                  DOM Manipulation                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

function renderNote (todoObj) {
  const itemEl = document.createElement('div')
  const itemHeader = document.createElement('div')
  const itemDetail = document.createElement('textarea')
  const itemCreated = document.createElement('div')
  const itemModified = document.createElement('div')

  itemEl.classList.add('note-card')
  itemHeader.classList.add('note-header')
  itemDetail.classList.add('note-body')
  itemCreated.classList.add('time-created')
  itemModified.classList.add('time-modified')
  itemEl.id = todoObj.id
  itemHeader.innerHTML = `${todoObj.item}<i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
  itemDetail.innerHTML = todoObj.detail
  itemCreated.innerHTML = `Created: ${todoObj.created_at}`
  if (todoObj.modified_at) {
    itemModified.innerHTML = `Modified: ${todoObj.modified_at}`
  }

  noteList.appendChild(itemEl)
  itemEl.appendChild(itemHeader)
  itemEl.appendChild(itemDetail)
  itemEl.appendChild(itemCreated)
  itemEl.appendChild(itemModified)
}

function renderNotes (array) {
  noteList.innerHTML = ''
  for (let note of array) {
    if (note.item) {
      renderNote(note)
    }
  }
}

function clearInputs () {
  noteBody.value = ''
  noteHeader.value = ''
}
