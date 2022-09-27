import React from 'react';
import BookList from '../components/books-list';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
  }

  componentDidMount() {
    this.loadBooks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.category !== prevProps.category) {
      this.loadBooks();
    }
  }

  loadBooks() {
    const category = this.props.category || 'combined-print-and-e-book-fiction';
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/${category}.json?api-key=${process.env.BOOKS_API_KEY}`;
    const request = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };
    fetch(url, request)
      .then(response => response.json())
      .then(data => {
        this.setState({
          books: data.results.books
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render() {
    const { books } = this.state;
    return (
      <BookList books={books} />
    );
  }
}
