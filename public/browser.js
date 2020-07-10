// function itemTemplate(item){
//   return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
//   <span class="item-text">${item.text}</span>
//   <div>
//     <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1" >Edit</button>
//     <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
//   </div>
// </li>`
// }
// //initial page load render

// let ourHTML = items.map((item) => {
//   return itemTemplate(item)
// }).join('')
document.addEventListener('click', (e) => {
  //Delete Feature
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Delete this? Really?')) {
      axios
        .post('/delete-item', {
          id: e.target.getAttribute('data-id'),
        })
        .then(() => {
          e.target.parentElement.parentElement.remove()
          console.log('item deleted')
        })
        .catch(() => {
          console.log('Please try again later')
        })
    }
  }

  //Update feature
  //e.target = the target of the clicked item---if contains the #id
  if (e.target.classList.contains('edit-me')) {
    let userInput = prompt(
      'Enter ur new text:',
      e.target.parentElement.parentElement.querySelector('.item-text').innerHTML
    )
    //post a = url, post b = data it's going to be sent to the url --will return a promise --for not known time interval is useful --on the fly.

    //then()--it's not going to run until the post is not ready or action is not complete
    if (userInput) {
      axios
        .post('/update-item', {
          text: userInput,
          id: e.target.getAttribute('data-id'),
        })
        .then(() => {
          e.target.parentElement.parentElement.querySelector(
            '.item-text'
          ).innerHTML = userInput
        })
        .catch(() => {
          console.log('Please try again later')
        })
    }
  }
})
