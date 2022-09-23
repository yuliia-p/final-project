import React from 'react';
import Navbar from './components/navbar';
import BookList from './components/books-list';
import parseRoute from './lib/parse-route';
import MoreDetails from '../client/pages/more-details';
import SignUpModal from './components/sign-up-modal';
import SignInModal from './components/sign-in-modal';
import jwtDecode from 'jwt-decode';
import AppContext from './lib/app-context';
import MyBooks from './pages/my-books';
import MoreDetailsMybooks from './components/more-details-my-books';
import Search from './components/search';
import NotFound from './pages/not-found';
import DeleteModal from './components/delete-modal';
import ProfileMenu from './components/profile-menu';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      route: parseRoute(window.location.hash),
      showModal: null,
      user: null,
      deleteModal: false
    };
    this.getList = this.getList.bind(this);
    this.showhModal = this.showhModal.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.deteleModal = this.deteleModal.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${process.env.BOOKS_API_KEY}`;
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
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user });
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
    window.location.hash = '?category=' + category;
  }

  showhModal() {
    const { showModal, user } = this.state;
    this.setState({ showModal: 'signIn' });
    if (showModal === 'signIn') {
      this.setState({ showModal: 'signUp' });
    }
    if (user) {
      this.setState({ showModal: 'profile-menu' });
    }
  }

  hideModal() {
    this.setState({ showModal: null });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({
      user
    });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({
      user: null,
      showModal: null
    });
  }

  deteleModal() {
    this.setState({ deleteModal: !this.state.deleteModal });
  }

  renderPage() {
    const { route, books } = this.state;
    if (route.path === '') {
      return (
        <div className='container'>
          <BookList books={books} />
        </div>
      );
    }
    if (route.path === 'category') {
    //   const category = route.params.get('category');
    //   console.log('category', category);
      return (
        <div className='container'>
          <BookList books={books} />
        </div>
      );
    }
    if (route.path === 'details') {
      const isbn = route.params.get('isbn');
      const imgageUrl = route.params.get('imageurl');
      const numberWeeks = route.params.get('n');
      const buyLink = route.params.get('buy');
      return <MoreDetails isbn={isbn} url={imgageUrl} number={numberWeeks} buyLink={buyLink}/>;
    }
    if (this.state.user && route.path === 'my-books') {
      return <MyBooks />;
    }
    if (route.path === 'my-book-details') {
      const bookId = route.params.get('bookId');
      return <MoreDetailsMybooks bookId={bookId} onClick={this.deteleModal}/>;
    }
    if (route.path === 'search') {
      const searchValue = route.params.get('txt');
      return <Search value={searchValue}/>;
    }
    if (route.path === 'search-details') {
      const isbn = route.params.get('isbn');
      const buyLink = route.params.get('buy-link');
      return <MoreDetails isbn={isbn} buyLink={buyLink}/>;
    }
    if (route.path === 'not-found') {
      return <NotFound />;
    }
  }

  render() {
    const { showhModal, hideModal, handleSignIn, deteleModal, handleSignOut, getList } = this;
    const { user, route } = this.state;
    const contextValue = { user, route, showhModal };
    return (
      <AppContext.Provider value={contextValue}>
          <Navbar onClick={getList} onAuthClick={showhModal} />
          {this.renderPage()}
          {this.state.showModal === 'signUp' && <SignUpModal onComplete={hideModal} onSignIn={showhModal}/>}
          {this.state.showModal === 'signIn' && <SignInModal onSignIn={handleSignIn} onComplete={hideModal} onSignUp={showhModal}/>}
          {this.state.showModal === 'profile-menu' && <ProfileMenu onClick={handleSignOut} onComplete={hideModal}/>}
          {this.state.deleteModal === true && <DeleteModal onClick={deteleModal}/> }
      </AppContext.Provider>
    );
  }
}
