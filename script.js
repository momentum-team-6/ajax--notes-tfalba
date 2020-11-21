/* globals fetch, moment */

const url = 'http://localhost:3000/todos/'

const noteSave = document.querySelector('#save-note')
const noteList = document.querySelector('#note-list')

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
  itemEl.innerHTML = `${todoObj.item}<i class='fas fa-times'></i><i class='fas fa-edit'></i>`
  itemDetail.innerHTML = `${todoObj.detail}<br><br><br>Created at: ${todoObj.created_at}`
  // use innerHTML if want to use a template literal
  noteList.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
}
