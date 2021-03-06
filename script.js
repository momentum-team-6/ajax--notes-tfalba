/* globals fetch, moment */
const url = 'http://localhost:3000/notes/'
const noteSave = document.querySelector('.save-note')
const noteList = document.querySelector('#note-list')
const noteHeader = document.querySelector('#note-header')
const noteBody = document.querySelector('#note-body')
const sideBar = document.querySelector('#side-bar')
const noteUpdate = document.querySelector('.update-note')

fetch(url)
  .then(res => res.json())
  .then(notes => {
    for (let i = notes.length - 1; i >= 0; i--) {
      if (notes[i].item !== '') {
        renderNote(notes[i])
      }
    }
  })

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   Event Listeners                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

noteSave.addEventListener('click', function (event) {
  event.preventDefault()
  const noteHeaderValue = noteHeader.value
  const noteBodyValue = noteBody.value
  createNote(noteHeaderValue, noteBodyValue)
})

noteList.addEventListener('click', function (event) {
  // console.log(event.target.parentElement)
  if (event.target.classList.contains('delete')) {
    deleteNote(event.target)
  }
  if (event.target.classList.contains('edit')) {
    editNote(event.target)
    // Need to change editNote to take as argument event.target rather than noteId
    // this function should basically change what is viewed in display to the content of the note.
  }
  if (event.target.classList.contains('updated')) {
    updateNote(event.target)
    // write a function updateNote which will run the PATCH
  }
})

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    JSON Fetches                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

function createNote (noteHeader, noteBody) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: noteHeader,
      detail: noteBody,
      created_at: moment().format('lll')
    })
  })
    .then(res => res.json())
    .then(data => {
      renderNote(data)
      clearInputs()
    })
  // document.location.reload()
}

function deleteNote (eventTarget) {
  console.log(eventTarget.parentElement)
  const noteId = eventTarget.parentElement.id
  // alert('Are you sure you want to delete this message? Skip the "OK" and reload page if not.')
  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      eventTarget.parentElement.remove()
    })
}

function editNote (eventTarget) {
  console.log(eventTarget.parentElement)
  let noteId = eventTarget.parentElement.id

  noteSave.classList.toggle('hideme')
  noteUpdate.classList.toggle('hideme')

  let url = `http://localhost:3000/notes/${noteId}`
  fetch(url)
    .then(res => res.json())
    .then(data => {
      noteHeader.value = data.item
      noteBody.value = data.detail
    })

  // Try skipping the whole bit of editNote and just working through event listener and calling updateNote
  noteUpdate.addEventListener('click', function (event) {
    event.preventDefault()

    let noteHeaderValue = noteHeader.value
    let noteBodyValue = noteBody.value
    updateNote(noteHeaderValue, noteBodyValue, noteId)

    // clearInputs()
  })
}

/* --------------------------------------- Embeds json, event listener and DOM manipulation ----------------------------------------------- */

function updateNote (noteHeaderValue, noteBodyValue, noteId) {
  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: noteHeaderValue,
      detail: noteBodyValue,
      modified_at: moment().format('lll')
    })
  })
    .then(res => res.json())
    .then(data => {
      const note = document.getElementById(data.id)
      note.querySelector('textarea').value = noteBodyValue
//      note.querySelector('note-body').value = data.item
      // renderNote(data)

      // instead of rendering note here, just manipulate DOM
      console.log(data)
      // clearInputs() -- this clears out whatever previously had been set!!!

      noteSave.classList.toggle('hideme')
      noteUpdate.classList.toggle('hideme')
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                  DOM Manipulation                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

function renderNote (todoObj) {
  const itemEl = document.createElement('div')
  const itemDetail = document.createElement('textarea')
  const itemCreated = document.createElement('div')
  const itemModified = document.createElement('div')

  itemEl.classList.add('note-header')
  itemDetail.classList.add('note-body')
  itemCreated.classList.add('time-created')
  itemModified.classList.add('time-modified')
  itemEl.id = todoObj.id
  itemEl.innerHTML = `${todoObj.item}<i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
  itemDetail.innerHTML = todoObj.detail
  itemCreated.innerHTML = `Created: ${todoObj.created_at}`
  if (todoObj.modified_at) {
    itemModified.innerHTML = `Modified: ${todoObj.modified_at}`
  }

  noteList.appendChild(itemEl)
  // noteList.appendChild(itemDetail) -- come back to this and change how managing cards in css
  // noteList.appendChild(itemCreated)
  // noteList.appendChild(itemModified)
  itemEl.appendChild(itemDetail)
  itemEl.appendChild(itemCreated)
  itemEl.appendChild(itemModified)
}

function clearInputs () {
  noteBody.value = ''
  noteHeader.value = ''
}
