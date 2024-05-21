Array.from(document.querySelectorAll('.mt-3')).forEach(entry => entry.addEventListener('click', addToList))
Array.from(document.querySelectorAll('.close')).forEach(entry => entry.addEventListener('click', deleteField))

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
        console.log(data)
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
    console.log(fieldName)
    try {
        const response = await fetch('/deleteField', {
            method: 'DELETE',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'fieldToDelete': fieldName
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
        
    } catch(err) {
        console.log(err)
    }
}