import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import  { createStructuredSelector } from 'reselect';

import './App.css';


import Header from './components/header/header.component';
import HomePage from './pages/homepage/homepage.component';
import CheckoutPage from './pages/checkout/checkout.component';
import SignInAndSignUpPage from './pages/sing-in-and-sign-up/sing-in-and-sign-up.component';
import ShopPage from './pages/shop/shop.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';

class App extends React.Component{
/*  constructor() {
    super();

    this.state = {
      currentUser: null
    }
  }*/

  unsubscribedFromAuth = null;

  componentDidMount() {

    const { setCurrentUser } = this.props;

    this.unsubscribedFromAuth = auth.onAuthStateChanged(async userAuth => {
      //createUserProfileDocument(user);
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({ 
              id: snapShot.id,
              ...snapShot.data()
          });
        });
      }


      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount() {
    this.unsubscribedFromAuth();
  }

  render(){
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route path='/shop' component={ShopPage}/>
          <Route exact path='/checkout' component={CheckoutPage}/>
          <Route 
            exact 
            path='/signin' 
            render={() => 
            this.props.currentUser ? (
            <Redirect to='/' />
            ) : (
            <SignInAndSignUpPage/>
            )
          }
         />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(App);
