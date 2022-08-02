import {useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function Header ({loggedIn, setLoggedIn, bntName, setBntName}) {

  const currentUser = useContext(CurrentUserContext);
  const history = useHistory();

  useEffect(() => {
    console.log(loggedIn);
  }, [loggedIn])



  function handleOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/signin');
  }

  function handleIn() {
    if(bntName === 'Войти') {
      history.push('/signin');
      setBntName('Регистрация');
    }else if(bntName === 'Регистрация') {
      history.push('/signup');
      setBntName('Войти');
    }
  }

    return (
      <header className="header">
        <div className="header__logo"></div>
        <p className="header__text">{loggedIn ? currentUser.email : ''}</p>
        {loggedIn ?  (<button className="header__btn" onClick={handleOut}>Выйти</button>) : (<button className="header__btn" onClick={handleIn}>{bntName}</button>)}

      </header>
    )
}
