// Array.from(document.querySelectorAll('.mt-3')).forEach(entry => entry.addEventListener('click', addToList))
Array.from(document.querySelectorAll('.close')).forEach(entry => entry.addEventListener('click', deleteField))
Array.from(document.querySelectorAll('.session-submit-btn')).forEach(btn => btn.addEventListener('click', saveSession))

const addTechButton = document.getElementById('addTech')
const techInputForm = document.getElementById('techInputForm')
const suggestionsBox = document.getElementById('suggestions')
const techInputField = document.getElementById('techInput')
const editButton = document.getElementById('edit-btn')

let suggestions

addTechButton.addEventListener('click', addTech)
editButton.addEventListener('click', () => {
    Array.from(document.querySelectorAll('.close')).forEach(el => el.classList.toggle('hidden') )
})

async function addToList() {
    const itemText = this.parentNode.childNodes[1].innerText
    
    try {
        const response = await fetch('/addKnowledgeField', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'fieldFromJS': itemText
            })
        })
        const data = await response.json()
        if (data === 'Field already exists!') {
            alert(`You've already added this technology. Please choose another.`)
        } else {
            location.reload()
        }
    } catch(err) {
        console.log(err)
    }
}

async function deleteField() {
    const fieldName = this.parentNode.childNodes[5].innerText
    try {
        const response = await fetch('/deleteField', {
            method: 'DELETE',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'fieldToDelete': fieldName
            })
        })
        const data = await response.json()
        location.reload()
        
    } catch(err) {
        console.log(err)
    }
}

techInput.oninput = async function() {
    const userInput = this.value
    suggestionsBox.innerHTML = ''

    if (userInput.length > 1) {
        suggestionsBox.style.pointerEvents = ''
        const suggestionsFetch = await fetch('/techlist')
        const suggestionsData = await suggestionsFetch.json()
        suggestions = suggestionsData

        suggestionsBox.style.visibility = 'visible'

        for (let i = 0; i < suggestions.length; i++) {
            suggestionsBox.innerHTML += "<li>" + "<span>" + suggestions[i].techName + "</span>" + "</li>";
        }
    } else suggestionsBox.style.visibility = 'hidden'
} 

suggestionsBox.onclick = function(event) {
	const setValue = event.target.innerText
	techInputField.value = setValue
	this.innerHTML = ""
	suggestionsBox.style.visibility = 'hidden'
}

async function addTech(event) {
    event.preventDefault()
    let formData = new FormData(techInputForm)
    const userInput = Object.fromEntries(formData).techInput
    if (!userInput) return

    try {
        const response = await fetch("/addTech", {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'techToAdd': userInput
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}

async function saveSession(event) {
    const selectorId = event.target.id
    const tech = event.target.classList[1]
    const topic = event.target.classList[2].split('-').join(' ')
    const selectElement = document.getElementById(`rating-select${selectorId}`)
    const output = selectElement.options[selectElement.selectedIndex].value
    if (!output) {
        alert('Please choose an option from the list.')
        return
    } 
    
    try {
        const response = await fetch("/saveSession", {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rating': output,
                'tech': tech,
                'topic': topic
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch(err) {
        console.log('Error ' + err)
    }
    
}

