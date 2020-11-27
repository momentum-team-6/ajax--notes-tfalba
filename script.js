/* globals fetch, moment */
const url = 'http://localhost:3000/notes/'
const noteSave = document.querySelector('.save-note')
const noteList = document.querySelector('#note-list')
const noteHeader = document.querySelector('#note-header')
const noteBody = document.querySelector('#note-body')
const sideBar = document.querySelector('#side-bar')
const keyword = ''
/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   Event Listeners                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

noteList.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete')) {
    deleteNote(event.target)
  }
  if (event.target.classList.contains('edit')) {
    console.log('I clicked edit')
    editNote(event.target)
  }
  if (event.target.classList.contains('update-me')) {
    const element = event.target.parentElement.parentElement
    updateNote(element)
  }
})
/* ---------------- set up event listener that identifies filter submit and runs filternotes function --------------- */

sideBar.addEventListener('click', function (event) {
  if (event.target.classList.contains('submit-filter')) {
    const filterField = event.target.parentElement
    const keyword = filterField.firstElementChild.value
    filterNotes(keyword)
  }
  if (event.target.classList.contains('submit-highlight')) {
    console.log('I clicked highlight submit')
    const highlightField = event.target.parentElement
    const keyword = highlightField.firstElementChild.value
    listNotes(keyword)
  }
  if (event.target.classList.contains('clear-filter')) {
    const keyword = ''
    const filterField = event.target.parentElement
    filterField.firstElementChild.value = ''
    listNotes(keyword)
  }
  if (event.target.classList.contains('clear-highlight')) {
    const keyword = ''
    const highlightField = event.target.parentElement
    highlightField.firstElementChild.value = ''
    listNotes(keyword)
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
      listNotes(keyword)
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
      listNotes(keyword)
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
      listNotes(keyword)
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                  DOM Manipulation                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

function renderNote (todoObj, keyword) {
  const itemEl = document.createElement('div')
  const itemHeader = document.createElement('div')
  const itemDetail = document.createElement('textarea')
  const itemCreated = document.createElement('div')
  const itemModified = document.createElement('div')
  // save the following in case use later
  const idValue = parseInt(todoObj.id)

  itemEl.classList.add('note-card')
  itemHeader.classList.add('header-div')
  itemDetail.classList.add('note-body')
  itemDetail.rows = '8'

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

  if (keyword !== '') {
    if (itemDetail.innerHTML.includes(keyword)) {
      itemEl.classList.add('highlight')
      console.log(itemDetail.innerText)
    }
  }

  if (itemDetail.innerHTML.includes('green') || itemDetail.innerHTML.includes('Green')) {
    itemEl.classList.add('green-highlight')
  }
  if (itemDetail.innerHTML.includes('pink') || itemDetail.innerHTML.includes('Pink')) {
    itemEl.classList.add('pink-highlight')
  }
}

function renderNotes (array, keyword) {
  noteList.innerHTML = ''
  for (let i = array.length - 1; i >= 0; i--) {
    renderNote(array[i], keyword)
  }
}

// function highlightNotes (keyword) {
//   noteList.innerHTML = ''
//   for (let i = array.length - 1; i >= 0; i--) {
//     highlightNote(array[i])
//   }
// }

function listNotes (keyword) {
  const noteArray = []
  fetch(url)
    .then(res => res.json())
    .then(notes => {
      for (const note of notes) {
        noteArray.push(note)
      }
      renderNotes(noteArray, keyword)
    })
}

function filterWord (word, oldArray) {
  const newArray = oldArray.filter((old) =>
    (old.item.includes(word) || old.detail.includes(word)))
  return newArray
}

function filterNotes (word, keyword) {
  const noteArray = []
  fetch(url)
    .then(res => res.json())
    .then(notes => {
      for (const note of notes) {
        noteArray.push(note)
      }
      renderNotes(filterWord(word, noteArray), keyword)
    })
}

function clearInputs () {
  noteBody.value = ''
  noteHeader.value = ''
}

listNotes(keyword)
// filterNotes('the')
