const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

newQuoteForm.addEventListener('submit', quote => {
    quote.preventDefault()
    console.log(quote)
    let newQuote = quote.target[0].value
    let newAuthor = quote.target[1].value
    let newQuoteInfo = {
    "quote": `${newQuote}`,
    "author": `${newAuthor}`
    }
    addNewQuote(newQuoteInfo)
})


function loadPage(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => {
        console.log(quotes)
        quotes.forEach(quote => {
            renderQuotes(quote)
        })
    })
}



function renderQuotes(quote){
    console.log(quote.likes.length)
    let quoteCard = document.createElement('li')
    let quoteId = quote.id
    quoteCard.setAttribute('id',quoteId)
    quoteCard.setAttribute('class','quote-card')
    let blockQuote = document.createElement('blockquote')
    quoteCard.appendChild(blockQuote)
    let quoteText = document.createElement('p')
    quoteText.setAttribute('class','mb-0')
    quoteText.innerHTML = quote.quote
    let blockQuoteFooter = document.createElement('footer')
    blockQuoteFooter.setAttribute('class','blockquote-footer')
    blockQuoteFooter.innerHTML = quote.author
    let brk = document.createElement('br')
    let buttonSuccess = document.createElement('button')
    buttonSuccess.setAttribute('class', 'btn-success')
    let likes = quote.likes.length
    buttonSuccess.innerHTML = `Likes: <span>${likes}</span>`

 
    buttonSuccess.addEventListener('click', e =>{
        pathId = e.path[2].id
        let bodyForPost = {
            "quoteId": pathId,
            "createdAt": 1558524358
        }
        fetch('http://localhost:3000/likes',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(bodyForPost)
            
        })
        .then(resp => resp.json())
        .then(r => console.log(r))
    })

    let buttonDanger = document.createElement('button')
    buttonDanger.setAttribute('class','btn-danger')
    buttonDanger.innerHTML = "Delete"

    


    let elementArray = [quoteText, blockQuoteFooter, brk, buttonSuccess, buttonDanger]
    elementArray.forEach(elem => {
        blockQuote.appendChild(elem)
    })

    buttonDanger.addEventListener('click', quoteCard => {
        
        removeQuoteCard(quoteCard)
    })
    quoteList.appendChild(quoteCard)
}

function addNewQuote(newQuoteInfo){
    fetch('http://localhost:3000/quotes',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'accept':'application/json'
        },
        body: JSON.stringify(newQuoteInfo)
    })
    .then(resp => resp.json())
    .then(newInfo => {
        console.log(newInfo)
        renderQuotes(newQuoteInfo)
    })

}

function removeQuoteCard(quoteCard){
    let parentElem = quoteCard.path[2]
    parentElem.remove()
    let quoteCardId = quoteCard.path[2].id
    console.log(quoteCard)
    console.log(quoteCardId)
    fetch(`http://localhost:3000/quotes/${quoteCardId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'accept':'application/json'
        }
    })
    .then(resp => resp.json())
    .then(data => console.log(data))


    
}

loadPage()