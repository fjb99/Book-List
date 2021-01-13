//Book Class: represent a book
class Book {
    constructor(title, author, isbn){
        this.title = title; 
        this.author = author; 
        this.isbn = isbn; 
    }
}


//UI Class: handle UI Tasks
class UI {
    static displayBook() {
        //merr nga local storage
        const books = Store.getBooks(); 

        //loop throw each el and added to UI
        books.forEach((book) => UI.addBookToList(book)); 
    }

    static addBookToList(book) {
        //get from dom the id 
        const list = document.querySelector('#book-list'); 

        //creat an element
        const row = document.createElement('tr'); 

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `; 

        //appent row to the list as a child
        list.appendChild(row); 
    }

    //delete button: -> row(parant of a parent element)
    static deleteBook(el){
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove(); 
        }
    }

    //Alert
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`; 
        div.appendChild(document.createTextNode(message)); 

        const container = document.querySelector('.container'); 
        const form = document.querySelector('#book-form'); 
        container.insertBefore(div, form); 

        //vanish in 3 seconds
        setTimeout(() => {
            document.querySelector('.alert').remove(); 
        }, 3000);
    }

    //clear fields
    static clearFields() {
        document.querySelector('#title').value =''; 
        document.querySelector('#author').value =''; 
        document.querySelector('#isbn').value =''; 
    }
}

//Store classes: handles strage
class Store {
    //get 
    static getBooks(){
        let books; 
        if(localStorage.getItem('books') === null) {
            books = []; 
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books; 
    }

    static addBook(book) { // i bejm e statike per ta pasur me te lehte per ti thirrur
        const books = Store.getBooks(); 
        books.push(book); 
        localStorage.setItem('books', JSON.stringify(books)); 
    }

    static removeBook(isbn) {
        const books = Store.getBooks(); 

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1); 
            }
        }); 

        localStorage.setItem('books', JSON.stringify(books)); 
    }
}
 

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBook);

//Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actuall submit
    e.preventDefault(); 

    //Get form value
    const title = document.querySelector('#title').value; 
    const author = document.querySelector('#author').value; 
    const isbn = document.querySelector('#isbn').value; 

    //validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //Instatiate book 
        const book = new Book(title, author, isbn); 
        //console.log(book);
        
        //Add Book to UI
        UI.addBookToList(book); 

        //Add book to store
        Store.addBook(book); 

        //show success alert
        UI.showAlert('book removed', 'success'); 

        //Clear fields+
        UI.clearFields(); 
    } 
}); 

//Event: remove a book 
document.querySelector('#book-list').addEventListener('click', (e) => {
    //console.log(e.target); 
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

    //show success alert
    UI.showAlert('book removed', 'success'); 
    
}); 
