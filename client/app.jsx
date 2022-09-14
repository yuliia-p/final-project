import React from 'react';
// import Home from './pages/home';
import Navbar from './components/Navbar';
import BookList from './components/books-list';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    };
    this.getList = this.getList.bind(this);
  }

  componentDidMount() {
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${process.env.BOOKS_API_KEY}`;
    const request = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };
    fetch(url, request)
      .then(response => response.json())
      .then(data =>
        this.setState({
          books: data.results.books
        })
      )
      .catch(error => {
        console.error('Error:', error);
      });
  }

  getList(category) {
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
          books: data.results.books,
          isClicked: !this.state.isClicked
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render() {
    return (
      <>
        <Navbar onClick={this.getList}/>
        <div className='container'>
          <BookList books={this.state.books} />
        </div>
        {/* <Home />; */}
      </>
    );
  }

}
