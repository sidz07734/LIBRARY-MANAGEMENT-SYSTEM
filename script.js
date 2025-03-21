document.addEventListener("DOMContentLoaded", function () {

    // Add Book
    document.getElementById("book-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const isbn = document.getElementById("book-isbn").value;

        // Send data to backend to add the book
        fetch('/add_book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, isbn })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                displayBooks(); // Reload the book list
                document.getElementById("book-form").reset(); // Clear input fields
            } else {
                alert(data.error); // Show error message if book already exists
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Display Books
    function displayBooks() {
        fetch('/get_books', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const bookList = document.getElementById("book-list");
                bookList.innerHTML = '';
                data.forEach(book => {
                    const li = document.createElement("li");
                    li.textContent = `${book.title} by ${book.author} (ISBN: ${book.isbn})`;
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "Remove";
                    removeBtn.onclick = () => {
                        removeBook(book.id); // Pass the book ID to remove it
                    };
                    li.appendChild(removeBtn);
                    bookList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Remove Book
    function removeBook(bookId) {
        fetch('/remove_book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: bookId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                displayBooks(); // Reload the book list after removal
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Search Books
    document.getElementById("search-btn").addEventListener("click", function() {
        const query = document.getElementById("search-title").value;
        fetch(`/search_books?query=${query}`)
            .then(response => response.json())
            .then(data => {
                const searchResults = document.getElementById("search-results");
                searchResults.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(book => {
                        const li = document.createElement("li");
                        li.textContent = `${book.title} by ${book.author} (ISBN: ${book.isbn})`;
                        searchResults.appendChild(li);
                    });
                } else {
                    const li = document.createElement("li");
                    li.textContent = "No books found matching your search.";
                    searchResults.appendChild(li);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // Add User
    document.getElementById("add-user-btn").addEventListener("click", function () {
        const userId = document.getElementById("user-id").value;
        const userName = document.getElementById("user-name").value;

        fetch('/add_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, name: userName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                displayUsers(); // Reload the user list
                document.getElementById("user-id").value = ''; // Clear user input fields
                document.getElementById("user-name").value = '';
            } else {
                alert(data.error); // Show error message if user already exists
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Display Users
    function displayUsers() {
        fetch('/get_users', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const userList = document.getElementById("user-list");
                userList.innerHTML = '';
                data.forEach(user => {
                    const li = document.createElement("li");
                    li.textContent = `${user.name} (ID: ${user.id})`;
                    userList.appendChild(li);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Borrow Book
    document.getElementById("borrow-btn").addEventListener("click", function () {
        const isbn = document.getElementById("borrow-isbn").value;
        const dueDate = document.getElementById("due-date").value;

        // Ensure the user has entered both ISBN and due date
        if (!isbn || !dueDate) {
            alert("Please provide both ISBN and Due Date.");
            return;
        }

        fetch('/borrow_book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn, due_date: dueDate })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                displayBooks(); // Reload the book list
            } else {
                alert(data.error); // Show error if book not found
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Return Book
    document.getElementById("return-btn").addEventListener("click", function () {
        const isbn = document.getElementById("return-isbn").value;

        fetch('/return_book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Show success message
                displayBooks(); // Reload the book list
            } else {
                alert(data.error); // Show error if book not found
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Show Overdue Books
    document.getElementById("overdue-btn").addEventListener("click", function () {
        fetch('/overdue_books', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const overdueList = document.getElementById("overdue-list");
                overdueList.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(book => {
                        const li = document.createElement("li");
                        li.textContent = `${book.title} by ${book.author} (ISBN: ${book.isbn}) - Due Date: ${book.due_date}`;
                        overdueList.appendChild(li);
                    });
                } else {
                    const li = document.createElement("li");
                    li.textContent = "No overdue books.";
                    overdueList.appendChild(li);
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // Initially load the books and users
    displayBooks();
    displayUsers();
});
