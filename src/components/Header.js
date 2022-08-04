import {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {useMediaQuery} from 'react-responsive'
import {DataUserContext} from '../contexts/CurrentUserContext';

export default function Header ({loggedIn, setLoggedIn, bntName, setBntName}) {

  const dataUser = useContext(DataUserContext);
  const history = useHistory();
  const mediaQuery = useMediaQuery({ minWidth: 540 }); // Для реализации 'бургер'-меню. Но это не точно

  function onSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  function handleIn() {
    if(bntName === 'Войти') {
      history.push('/sign-in');
      setBntName('Регистрация');
    }else if(bntName === 'Регистрация') {
      history.push('/sign-up');
      setBntName('Войти');
    }
  }

    return (
      <header className="header">
        <div className="header__logo"></div>
        {mediaQuery && <p className="header__text">{loggedIn ? dataUser.email : ''}</p>}
        {loggedIn ? (<button className="header__btn" onClick={onSignOut}>Выйти</button>) : (<button className="header__btn" onClick={handleIn}>{bntName}</button>)}
      </header>
    )
}
