from datetime import datetime
from flask import Flask, jsonify, request, render_template, send_from_directory

app = Flask(__name__)

# Mock data
books = []
users = []
borrowed_books = []
book_id_counter = 1  # To generate unique book IDs

# Route to serve the frontend
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# Route to add a book
@app.route('/add_book', methods=['POST'])
def add_book():
    global book_id_counter
    data = request.json
    title = data.get('title')
    author = data.get('author')
    isbn = data.get('isbn')

    # Generate a unique ID for each book
    book_id = book_id_counter
    book_id_counter += 1

    books.append({"id": book_id, "title": title, "author": author, "isbn": isbn})
    return jsonify({"message": "Book added successfully!", "books": books})

# Route to get all books
@app.route('/get_books', methods=['GET'])
def get_books():
    return jsonify(books)

# Route to remove a book
@app.route('/remove_book', methods=['POST'])
def remove_book():
    data = request.json
    book_id = data.get('id')

    # Remove book by ID
    global books
    books = [book for book in books if book['id'] != book_id]
    return jsonify({"message": "Book removed successfully!", "books": books})

# Route to search books
@app.route('/search_books', methods=['GET'])
def search_books():
    query = request.args.get('query', '').lower()
    results = [book for book in books if query in book['title'].lower() or query in book['author'].lower() or query in book['isbn']]
    return jsonify(results)

# Route to add a user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    user_id = data.get('id')
    name = data.get('name')

    users.append({"id": user_id, "name": name})
    return jsonify({"message": "User added successfully!", "users": users})

# Route to borrow a book
@app.route('/borrow_book', methods=['POST'])
def borrow_book():
    data = request.json
    isbn = data.get('isbn')
    due_date_str = data.get('due_date')

    # Convert the due date string to a date object
    due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()

    for book in books:
        if book['isbn'] == isbn:
            # Add the due date to the borrowed book record
            borrowed_books.append({**book, 'due_date': due_date})
            return jsonify({"message": "Book borrowed successfully!", "borrowed_books": borrowed_books})

    return jsonify({"error": "Book not found!"}), 404
# Route to return a book
@app.route('/return_book', methods=['POST'])
def return_book():
    data = request.json
    isbn = data.get('isbn')

    global borrowed_books
    borrowed_books = [book for book in borrowed_books if book['isbn'] != isbn]
    return jsonify({"message": "Book returned successfully!", "borrowed_books": borrowed_books})

# Route to show overdue books (mock)
@app.route('/overdue_books', methods=['GET'])
def overdue_books():
    # Get today's date
    today = datetime.today().date()

    # Find books that are overdue
    overdue = [book for book in borrowed_books if book['due_date'] < today]

    return jsonify(overdue)

if __name__ == '__main__':
    app.run(debug=True)
