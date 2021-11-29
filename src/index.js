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
    let quoteCard = document.createElement('li')
    let quoteId = quote.id
    quoteCard.dataset.likes = quote.likes.length
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

    buttonSuccess.addEventListener('click', quoteCard => {
        newLike(quoteCard)
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


function newLike(quoteCard){
    let parentElem = quoteCard.path[0]
    console.log(parentElem.innerHTML)
    let quoteCardId = quoteCard.path[2].id
    let likeCount = quoteCard.path[2].dataset.likes
    likeCount++
    parentElem.innerHTML = `Likes: <span>${likeCount}</span>`
}

loadPage()