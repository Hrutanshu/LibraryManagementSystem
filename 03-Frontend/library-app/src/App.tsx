import React from 'react';
import './App.css';
import { Navbar } from './layout/NavbarAndFooter/Navbar';
import { Footer } from './layout/NavbarAndFooter/Footer';
import { HomePage } from './layout/HomePage/HomePage';
import { SearchBooksPage } from './layout/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory} from 'react-router';
import { BookCheckoutPage } from './layout/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './auth/LoginWidget';
import { ReviewListPage } from './layout/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layout/ShelfPage/ShelfPage';
import { MessagePage } from './layout/MessagePage/MessagePage';
import { ManageLibraryPage } from './layout/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layout/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig)

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();
  const restoreOriginalUri = async (_OktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin))
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <Navbar></Navbar>
      <div className='flex-grow-1'>
        <Switch>
          <Route path={"/"} exact>
            <Redirect to={"/home"}></Redirect>
          </Route>
          <Route path={"/home"} exact>
            <HomePage></HomePage>
          </Route>
          <Route path={"/search"} exact>
            <SearchBooksPage></SearchBooksPage>
          </Route>
          <Route path={"/reviewList/:bookId"} exact>
            <ReviewListPage></ReviewListPage>
          </Route>
          <Route path={"/checkout/:bookid"} exact>
            <BookCheckoutPage></BookCheckoutPage>
          </Route>
          <Route path={"/login"} render={() => <LoginWidget config={oktaConfig} />} />
          <Route path={"/login/callback"} component={LoginCallback} />
          <SecureRoute path={"/shelf"}><ShelfPage></ShelfPage></SecureRoute>
          <SecureRoute path={"/messages"}><MessagePage></MessagePage></SecureRoute>
          <SecureRoute path={"/admin"}><ManageLibraryPage></ManageLibraryPage></SecureRoute>
          <SecureRoute path={"/fees"}><PaymentPage></PaymentPage></SecureRoute>
        </Switch>
      </div>
      <Footer></Footer>
      </Security>
    </div>
  );
}

export default App;
