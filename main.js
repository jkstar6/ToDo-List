// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnxJYWHC6IHdlfsPQ741CeHwCTxIAfWpY",
  authDomain: "todolistapp-f6136.firebaseapp.com",
  databaseURL: "https://todolistapp-f6136-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "todolistapp-f6136",
  storageBucket: "todolistapp-f6136.firebasestorage.app",
  messagingSenderId: "257162621559",
  appId: "1:257162621559:web:5fd03a1c84718887aa4c72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// =============================================================

import {getDatabase, set, push, get, update, remove, ref, child}
from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js"

const db = getDatabase()

// popup addBtn
const addBtn = document.getElementById('addBtn')
const popup = document.querySelector('.popup')
const closeBtn = document.querySelector('.close')

const fpopup = () => {
    popup.style.display = 'flex'
}
const fclosePopup = () => {
    popup.style.display = 'none'
    resetForm()
}

addBtn.addEventListener('click', fpopup)
closeBtn.addEventListener('click', fclosePopup)

// dark/light mode
let modeChange = document.getElementById('modeChange')

let body = document.body
let nav = document.querySelector('.nav')
let popupContent = document.querySelector('.popup-content')
let inputJudul = document.getElementById('inputJudul')
let inputDeskripsi = document.getElementById('inputDeskripsi')
let labelTanggal = document.getElementById('labelTanggal')

modeChange.addEventListener('click', function() {
    if (modeChange.dataset.mode === 'light') {
        modeChange.dataset.mode = 'dark'
        modeChange.innerHTML = 'Dark mode <img src="img/icons-dark.png" alt="light-icons" id="imgMode">'
        modeChange.style.background = '#FFFFFF'
        modeChange.style.color = '#18181A'
        modeChange.onmouseover = function() {modeChange.style.background = '#46BAC0'}
        modeChange.onmouseout = function() {modeChange.style.background = '#FFFFFF'}
        body.style.background = '#FFFFFF'
        body.style.color = '#18181A'
        nav.style.background = '#333'
        addBtn.style.color = '#18181A'
        addBtn.onmouseover = function() {addBtn.style.color = '#46BAC0'}
        addBtn.onmouseout = function() {addBtn.style.color = '#18181A'}
        popupContent.style.background = '#FFFFFF'
        inputJudul.style.background = '#FFFFFF'
        inputJudul.style.color = '#18181A'
        inputDeskripsi.style.background = '#FFFFFF'
        inputDeskripsi.style.color = '#18181A'
        labelTanggal.style.color = '#18181A'
    } else {
        modeChange.dataset.mode = 'light'
        modeChange.innerHTML = 'Light mode <img src="img/icons-light.png" alt="light-icons" id="imgMode">'
        modeChange.style.background = '#18181A'
        modeChange.style.color = '#FFFFFF'
        modeChange.onmouseover = function() {modeChange.style.background = '#46BAC0'}
        modeChange.onmouseout = function() {modeChange.style.background = '#18181A'}
        body.style.background = '#18181A'
        body.style.color = '#FFFFFF'
        nav.style.background = '#151516'
        addBtn.style.color = '#FFFFFF'
        addBtn.onmouseover = function() {addBtn.style.color = '#46BAC0'}
        addBtn.onmouseout = function() {addBtn.style.color = '#FFFFFF'}
        popupContent.style.background = '#18181A'
        inputJudul.style.background = '#18181A'
        inputJudul.style.color = '#FFFFFF'
        inputDeskripsi.style.background = '#18181A'
        inputDeskripsi.style.color = '#FFFFFF'
        labelTanggal.style.color = '#FFFFFF'
    }
})



// CRUD
let inputTanggal = document.getElementById('inputTanggal')
let inputPrioritas = document.getElementById('inputPrioritas')
let addTask = document.querySelector('.addTask')
let div_item = document.querySelector('.div_item')
let div_done = document.querySelector('.div_done')
let editID = null
let editPrio = null

function addData() {
    if (inputJudul.value === '' || inputTanggal.value === '') {
        alert('Judul dan Tanggal tidak boleh kosong!')
        return
    }

    if (editID) {
        editData(editID, editPrio)
    } else {
        const newRef = ref(db, 'todo/' + inputPrioritas.value)
        const newChildRef = push(newRef)

        set(newChildRef, {
            Judul: inputJudul.value,
            Deskripsi: inputDeskripsi.value,
            Tanggal: inputTanggal.value,
            Prioritas: inputPrioritas.value
        })
        .then(() => {
            fclosePopup()
            inputJudul.value = ''
            inputDeskripsi.value = ''
            inputTanggal.value = ''
            inputPrioritas.value = '1'
            showData()
        })
        .catch((error) => {
            alert(error.message)
        })   
    }
}

function showData() {
    const dbref = ref(db)
    div_item.innerHTML = ''
    
    for (let prio = 1; prio <= 3; prio++) {
        get(child(dbref, 'todo/' + prio))
        .then((snap) => {
            if (snap.exists()) {
                snap.forEach((child) => {
                    getData(child)
                })
            }
        })
        .catch((error) => {
            console.log(error.message)
        })
    }
}

function getData(catchChild) {
    const key = catchChild.key
    const value = catchChild.val()

    let ul = document.createElement('ul')
    let garis = document.createElement('li')
    let judul = document.createElement('h3')
    let deskripsi = document.createElement('li')
    let tanggal = document.createElement('li')
    let prioritas = document.createElement('p')
    
    judul.innerHTML = value.Judul
    deskripsi.innerHTML = value.Deskripsi
    tanggal.innerHTML = 'untuk tanggal ' + value.Tanggal
    prioritas.innerHTML = 'Priority ' + value.Prioritas
    
    garis.classList.add('line')
    tanggal.classList.add('date')
    
    // checkbox
    let buttonCheck = document.createElement('input')
    buttonCheck.type = 'checkbox'
    buttonCheck.value = 'done'
    buttonCheck.classList = 'checkBtn'
    buttonCheck.addEventListener('change', function () {
        if (buttonCheck.checked) {
            if (confirm('yakin ingin menyelesaikan tugas?')) {
                buttonCheck.disabled = true
                inputJudul.value = value.Judul
                inputDeskripsi.value = value.Deskripsi
                inputTanggal.value = value.Tanggal
                let checkID = key
                let checkPrio = value.Prioritas
                let updatePrio = buttonCheck.value
                checkData(checkID, checkPrio, updatePrio)
            } else {
                buttonCheck.checked = false
            }
        }
    })

    // tombol hapus
    let buttonDel = document.createElement('button')
    let imgDel = document.createElement('img')
    imgDel.src = './img/icons-delete-button.png'
    buttonDel.classList.add('delBtn')
    buttonDel.onclick = function () {
        if(confirm('anda yakin ingin menghapus tugas?')) {
            remove(ref(db, 'todo/' + value.Prioritas + '/' + key))
            .then(() => {
                showData()
            })
            .catch((error) => {
                alert(error.message)
            })
        }
    }
    
    // tombol edit
    let buttonEdit = document.createElement('button')
    let imgEdit = document.createElement('img')
    imgEdit.src = './img/icons-edit.png'
    buttonEdit.classList.add('editBtn')
    buttonEdit.onclick = function() {
        fpopup()
        inputJudul.value = value.Judul
        inputDeskripsi.value = value.Deskripsi
        inputTanggal.value = value.Tanggal
        editID = key
        editPrio = value.Prioritas
        addTask.textContent = 'Update'
    }

    ul.appendChild(buttonCheck)
    ul.appendChild(garis)
    ul.appendChild(prioritas)
    ul.appendChild(buttonDel)
    ul.appendChild(buttonEdit)
    ul.appendChild(judul)
    ul.appendChild(deskripsi)
    ul.appendChild(tanggal)
    buttonDel.appendChild(imgDel)
    buttonEdit.appendChild(imgEdit)
    div_item.appendChild(ul)
}

function checkData(id, prio, up) {
    remove(ref(db, 'todo/' + prio + '/' + id))
    .then(() => {
        const newRef = ref(db, 'done/')
        const newChildRef = push(newRef)

        set(newChildRef, {
            Judul: inputJudul.value,
            Deskripsi: inputDeskripsi.value,
            Tanggal: inputTanggal.value,
            Prioritas: up
        })
        .then(() => {
            resetForm()
            showData()
            showDataDone()
        })
        .catch((error) => {
            console.log(error.message)
        })
    })
}

function showDataDone() {
    const dbref = ref(db)
    div_done.innerHTML = ''
    
    get(child(dbref, 'done'))
    .then((snap) => {
        if (snap.exists()) {
            snap.forEach((child) => {
                getDataDone(child)
            })
        } else {
            console.log('data tidak ditemukan')
        }
    })
    .catch((error) => {
        console.log(error.message)
    })
}

function getDataDone(catchChild) {
    const key = catchChild.key
    const value = catchChild.val()

    let ul = document.createElement('ul')
    let garis = document.createElement('li')
    let judul = document.createElement('h3')
    let deskripsi = document.createElement('li')
    let tanggal = document.createElement('li')
    let prioritas = document.createElement('p')
    
    judul.innerHTML = value.Judul
    deskripsi.innerHTML = value.Deskripsi
    tanggal.innerHTML = 'untuk tanggal ' + value.Tanggal
    prioritas.innerHTML = value.Prioritas
    
    garis.classList.add('line')
    tanggal.classList.add('date')

    // checkbox
    let buttonCheck = document.createElement('input')
    buttonCheck.type = 'checkbox'
    buttonCheck.value = 'done'
    buttonCheck.checked = true
    buttonCheck.disabled = true
    buttonCheck.classList = 'checkBtn'
    buttonCheck.style.borderColor = '#919191'

    // tombol hapus
    let buttonDel = document.createElement('button')
    let imgDel = document.createElement('img')
    imgDel.src = './img/icons-delete-button.png'
    buttonDel.classList.add('delBtn')
    buttonDel.onclick = function () {
        if(confirm('yakin ingin menghapus tugas selesai?')) {
            remove(ref(db, 'done/' + key))
            .then(() => {
                showData()
                showDataDone()
            })
            .catch((error) => {
                alert(error.message)
            })
        }
    }

    ul.appendChild(buttonCheck)
    ul.appendChild(garis)
    ul.appendChild(prioritas)
    ul.appendChild(buttonDel)
    ul.appendChild(judul)
    ul.appendChild(deskripsi)
    ul.appendChild(tanggal)
    buttonDel.appendChild(imgDel)
    div_done.appendChild(ul)
}

function editData(id, prio) {
    if (inputJudul.value === '' || inputTanggal.value === '') {
        alert('Judul dan Tanggal tidak boleh kosong!')
        return
    }

    let newPrio = inputPrioritas.value

    if (newPrio !== prio) {
        remove(ref(db, 'todo/' + prio + '/' +id))
        .then(() => {
            const newRef = ref(db, 'todo/' + inputPrioritas.value)
            const newChildRef = push(newRef)

            set(newChildRef, {
                Judul: inputJudul.value,
                Deskripsi: inputDeskripsi.value,
                Tanggal: inputTanggal.value,
                Prioritas: inputPrioritas.value
            })
            .then(() => {
                alert('Data berhasil diperbarui')
                fclosePopup()
                resetForm()
                showData()
            })
            .catch((error) => {
                alert(error.message)
            }) 
        })
    } else {
        update(ref(db, 'todo/' + prio + '/' + id), {
            Judul: inputJudul.value,
            Deskripsi: inputDeskripsi.value,
            Tanggal: inputTanggal.value
        })
        .then(() => {
            alert('Data berhasil diperbarui')
            fclosePopup()
            resetForm()
            showData()
        })
        .catch((error) => {
            alert(error.message)
        })
    }
}

function resetForm() {
    inputJudul.value = ''
    inputDeskripsi.value = ''
    inputTanggal.value = ''
    inputPrioritas.value = '1'
    addTask.textContent = 'Add task'
    editID = null
    editPrio = null
}

addTask.addEventListener('click', addData)
window.addEventListener('load', showData)
window.addEventListener('load', showDataDone)