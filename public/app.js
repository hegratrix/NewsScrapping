function scrapeArticles() {
    articleArray = []
    $.get('/scrape')
    .then(data => {
        for (let i=0; i<data.length; i++) {
            articleArray.push(data[i])
        }
    showArticles()
    }).catch(e => {
        console.log(e)
    })
}  

function showArticles() {
    document.querySelector('#header').innerHTML= 'Scrapped Articles'
    document.querySelector('#articles').innerHTML = ''
    for (i=0; i < articleArray.length; i++) {
        $('#articles').append (`
            <div class="card">
                <div class="card-image">
                    <img src=${articleArray[i].image}></img>
                    <span class="card-title"> <a href=${articleArray[i].link}>Click to Read</span>
                    <a id="saved${i}" onClick=saveArticle(${i}) class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">Save</i></a>
                </div>
                <div class="card-content">
                    <p>${articleArray[i].title}</p>
                    <p id="subreddit"><a href=https://reddit.com/${articleArray[i].subreddit}>${articleArray[i].subreddit}</a></p>
                </div>
            </div>
        `)
    }
}

function saveArticle(index) {
    savedArticles = []
    let title = articleArray[index].title
    let result = {
        title: articleArray[index].title,
        link: articleArray[index].link,
        image: articleArray[index].image,
        subreddit: articleArray[index].subreddit
    }        
    $.get('/articles', function (article) {
        for (i=0; i < article.length; i++) {
            savedArticles.push(article[i].title)
        }
        if (savedArticles.indexOf(title) !== -1) {
            document.querySelector(`#saved${index}`).innerHTML = "Saved"
        } else {
            $.post('/articles', result)
            .then(function() {
                document.querySelector(`#saved${index}`).innerHTML = "Saved"
            }).catch(e => {
                console.log(e)
            })         
        }
    })
}

function showSavedArticles() {
    document.querySelector('#header').innerHTML= 'Saved Articles'
    document.querySelector('#articles').innerHTML = ''    
    $.get('/articles', function (article) {
        for (i=0; i < article.length; i++) {
            $('#articles').append (`
                <div id=${article[i]._id} class="card">
                    <div class="card-image">
                        <img src=${article[i].image}></img>
                        <span class="card-title"> <a href=${article[i].link}>Click to Read</a></span>
                        <div id="saved-button-div">
                            <a onClick="confirmDelete('${article[i]._id}')" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">Delete</i></a>
                            <a onClick="showNotes(${i})" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">Notes</i></a>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>${article[i].title}</p>
                        <p id="subreddit"><a href=https://reddit.com/${article[i].subreddit}>${article[i].subreddit}</a></p>
                    </div>
                </div>
            `)
        }
    })
}

function showNotes(index) {
    document.querySelector('#header').innerHTML= 'Notes'
    document.querySelector('#articles').innerHTML = ''
    document.querySelector('#articles').style.justifyContent = 'center'
    let id = ''
    $.get('/articles', function (article) {
        id = article[index]._id
        let snippet = article[index].title
        //only want first few words
        snippet = snippet.substring(0, 30)
        //retrims if in the middle of a word
        snippet = snippet.substr(0, Math.min(snippet.length, snippet.lastIndexOf(" ")))
        $('#articles').append (`
            <div class="card">
                <div class="card-image">
                    <h7 id='snippet'>${snippet}</h7>
                    <img src=${article[index].image}></img>
                    <span class="card-title"> <a href=${article[index].link}>Click to Read</span>
                    <div id="saved-button-div">
                        <a onClick="confirmDelete('${article[index]._id}')" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">Delete</i></a>
                        <a onClick="addNote('${article[index]._id}')" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">Add Note</i></a>
                    </div>
                </div>
                <div class="card-content">
                    <p>${article[index].title}</p>
                    <p class="subreddit"><a href=https://reddit.com/${article[index].subreddit}>${article[index].subreddit}</a></p>
                </div>
            </div>
        `)
    }).then(r => {
    $.get(`/notes/${id}`, function (notes) {
        for (let i=0; i<notes.length; i++) {
            $('#articles').append (`
                <div id="${notes[i]._id}" class="notecard card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 id="noteTitle" class="card-title">${notes[i].title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">by ${notes[i].author}</h6>
                        <p class="card-text">${notes[i].body}</p>
                        <button onclick=deleteNote('${notes[i]._id}') class="card-link">Delete Note</button>
                    </div>
                </div>
            `)
        }
    })
})
}

function saveNote(){
    event.preventDefault()
    let id = document.querySelector('.modal').id
    let title = document.querySelector('#snippet').innerHTML
    let result = {
        title: title,
        author: $('#modalAuthor').val().trim(),
        body: $('#modalBody').val().trim(),
        articles_id: id
    }
    $.post(`/notes/${id}`, result)
    .then(r => {
        $('#articles').append (`
            <div id="${result._id}" class="notecard card" style="width: 18rem;">
                <div class="card-body">
                    <h5 id="noteTitle" class="card-title">${result.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">by ${result.author}</h6>
                    <p class="card-text">${result.body}</p>
                    <button onclick=deleteNote('${result._id}') class="card-link">Delete Note</button>
                </div>
            </div>
        `)
        $('#modalAuthor').val('')
        $('#modalBody').val('')
        $('.modal').css('display', 'none')
    }).catch(e => {
        console.log(e)
    })   
}

function addNote(articleId) {
    document.querySelector('.modal').id = articleId
    document.querySelector('.modal').style.display = 'block'
}

function closeModal() {
    $('.modal').css('display', 'none')
}

function confirmDelete(id) {
    document.querySelector('.modal2').id = id
    document.querySelector('.modal2').style.display = 'block'
}

function deleteArticle() {
    let id =document.querySelector('.modal2').id
    fetch(`/articles/${id}`, {
        method: 'DELETE'
    }).then(r => {
        fetch(`/notes/${id}`, {
            method: 'DELETE'
        }).then (r => {
            $(`#${id}`).css('display', 'none')
            $('.modal2').css('display', 'none')  
            $('#articles').empty()
        })
    }).catch(e => {
        console.log(e)
    })
}

function deleteNote(id) {
    fetch(`/notes/${id}`, {
        method: 'DELETE'
    }).then(r => {
        $(`#${id}`).css('display', 'none')
    }).catch(e => {
        console.log(e)
    })
}