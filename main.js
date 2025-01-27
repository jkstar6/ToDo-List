const db = getDatabase()

console.log(addBtn, popup, closeBtn);

// popup
const addBtn = document.getElementById('addBtn')
const popup = document.querySelector('.popup')
const closeBtn = document.querySelector('.close')

addBtn.addEventListener('click', function() {
    console.log('Add button clicked')
    popup.style.display = 'flex'
})

closeBtn.addEventListener('click', function() {
    console.log('Close button clicked')
    popup.style.display = 'none'
})