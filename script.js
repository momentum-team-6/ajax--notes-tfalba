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
  const tag1 = document.querySelector('#tag1').value
  const tag2 = document.querySelector('#tag2').value
  const tag3 = document.querySelector('#tag3').value
  createNote(noteHeader, noteBody, tag1, tag2, tag3)
})

function createNote (noteHeader, noteBody, tag1, tag2, tag3) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: noteHeader,
      detail: noteBody,
      created_at: moment().format(),
      tag1: tag1,
      tag2: tag2,
      tag3: tag3
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
  
  // const itemTag1 = document.createElement('div')
  // const itemTag2 = document.createElement('div')
  // const itemTag3 = document.createElement('div')
  itemEl.classList.add('note-header')
  itemDetail.classList.add('note-body')
  itemCreated.classList.add('time-created')
  
  // itemTag1.classList.add('tags', 'tag1')
  // itemTag2.classList.add('tags', 'tag2')
  // itemTag3.classList.add('tags', 'tag3')

  itemEl.id = todoObj.id
  itemEl.innerHTML = `${todoObj.item}<i class='fas fa-times delete'></i><i class='fas fa-edit edit'></i>`
  itemDetail.innerHTML = todoObj.detail
  itemCreated.innerHTML = todoObj.created_at

  // itemTag1.innerHTML = todoObj.tag1
  // itemTag2.innerHTML = todoObj.tag2
  // itemTag3.innerHTML = todoObj.tag3
  noteList.appendChild(itemEl)
  itemEl.appendChild(itemDetail)
  if (todoObj.tag1 !== undefined && todoObj.tag1 !== '') {
    const itemTags = document.createElement('div')
    itemTags.classList.add('tags')
    itemTags.innerHTML = `<div class="tag1">${todoObj.tag1}</div><div class="tag2">${todoObj.tag2}</div><div class="tag3">${todoObj.tag3}</div>`
    itemEl.appendChild(itemTags)
  }
  itemEl.appendChild(itemCreated)

  // itemEl.appendChild(itemTag1)
  // itemEl.appendChild(itemTag2)
  // itemEl.appendChild(itemTag3)
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