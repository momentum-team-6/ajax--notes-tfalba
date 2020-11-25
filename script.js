/* globals fetch, moment */
const url = 'http://localhost:3000/notes/'
const noteSave = document.querySelector('.save-note')
const noteList = document.querySelector('#note-list')
const noteHeader = document.querySelector('#note-header')
const noteBody = document.querySelector('#note-body')
const noteUpdate = document.querySelector('.update-note')

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
    const element = event.target.parentElement.parentElement
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
  eventTarget.parentElement.parentElement.classList.add('update')
  const noteObj = eventTarget.parentElement.parentElement
  const itemHeader = eventTarget.parentElement
  const itemBody = noteObj.querySelector('.note-body')
  itemBody.classList.add('body-edit')
  itemBody.rows = '8'
  itemBody.cols = '50'
  const itemUpdate = document.createElement('button')
  itemUpdate.classList.add('update-me')
  itemUpdate.innerHTML = 'Update'

  itemHeader.appendChild(itemUpdate)

  itemHeader.classList.add('header-update')
}

/* --------------------------------------- Embeds json, event listener and DOM manipulation ----------------------------------------------- */

function updateNote (eventTarget) {
  const noteId = eventTarget.id
  const body = eventTarget.querySelector('.body-edit')
  const header = eventTarget.querySelector('textarea')

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
  const idValue = parseInt(todoObj.id)

  itemEl.classList.add('note-card')
/ itemHeader.classList.add('header-div')
  itemDetail.classList.add('note-body')
  itemDetail.rows='8'

  itemCreated.classList.add('time-created')
  itemModified.classList.add('time-modified')
  itemEl.id = todoObj.id
  itemHeader.innerHTML = `<textarea class='note-header'>${todoObj.item}</textarea><i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
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

  // if (idValue%24 === 0) {

  if (itemDetail.innerHTML.includes('yellow')) {
    //    itemDetail.classList.add('highlight')
    itemEl.classList.add('highlight')
    console.log(itemDetail.innerText)
    //    itemHeader.classList.add('highlight')
  }
}

function renderNotes (array) {
  noteList.innerHTML = ''

  for (let i = array.length - 1; i >= 0; i--) {
    renderNote(array[i])
  }
}

function listNotes () {
  const noteArray = []
  fetch(url)
    .then(res => res.json())
    .then(notes => {
      for (const note of notes) {
        noteArray.push(note)
      }
      renderNotes(noteArray)
    })
}

function filterWord (word, oldArray) {
  const newArray = oldArray.filter((old) =>
    (old.item.includes(word) || old.detail.includes(word)))
  return newArray
}

function filterNotes (word) {
  const noteArray = []
  fetch(url)
    .then(res => res.json())
    .then(notes => {
      for (const note of notes) {
        noteArray.push(note)
      }
      renderNotes(filterWord(word, noteArray))
    })
}

function clearInputs () {
  noteBody.value = ''
  noteHeader.value = ''
}

listNotes()
// filterNotes('the')
