import {useState, useEffect} from 'react';
import {Route, Switch, useHistory, Redirect} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import DeletePopup from './DeletePopup';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from '../utils/ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import api from '../utils/Api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function App() {

  const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoShow, setInfoShow] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);
  const [selectedCard, handleCardClick] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [cardItem, setCardItem] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [bntName, setBntName] = useState('Войти');
  const history = useHistory();

  function onLogin(email, password) {
    return api.access(email, password, '/signin')
      .then(res => {
        if(res.token) {
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
      }
    })
  }

  function onRegister(email, password) {
    return api.access(email, password, '/signup').then(res => {
      if(!res.ok) {
        setInfoMessage(false);
      } else {
        setInfoMessage(true);
      }
    })
    .then(() => {
      setInfoShow(true);
      setBntName('Регистрация');
    })
  }

  function getCards() {
    api.renderAllCards()
      .then(cards => {
        setCards(cards.data)
      })
      .catch(err => console.error(`Ошибка ${err} при загрузке карточек.`))
    }

  function auth() {
    api.getUserInfo()
      .then((res) => {
        if(res) {
          setCurrentUser(res.data);
        }
      })
      .catch(err => console.error(`Ошибка ${err} при получении данных профиля.`));
  }

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
      auth();
      getCards();
    }
  }, []);

  useEffect(() => {
    if(loggedIn) {
      history.push('/');
    }
  }, [loggedIn]);


  function closeAllPopups() {
    setAvatarPopupOpen(false);
    setProfilePopupOpen(false);
    setPlacePopupOpen(false);
    setDeletePopupOpen(false);
    setInfoShow(false);
    handleCardClick({});
  }

  function handleEditAvatarClick() {
    setAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setPlacePopupOpen(true);
  }

  function handleDeletePopup(card) {
    setCardItem(card);
    setDeletePopupOpen(true);
  }

  function handleUpdateUser({name, about}, setBtnName) {
    api.sendData(name, about)
    .then((res) => {
      setCurrentUser(res.data);
      closeAllPopups();
    })
    .catch(err => console.error(`Ошибка ${err} при отправке данных профиля.`))
    .finally(() => {setBtnName('Сохранить')});
  }

  function handleUpdateAvatar({avatar}, setBtnName) {
    api.selectionAvatar(avatar)
    .then((res) => {
      setCurrentUser(res.data);
      closeAllPopups();
    })
    .catch(err => console.error(`Ошибка ${err} при получении аватара.`))
    .finally(() => {setBtnName('Сохранить')});
  }

  function handleCardLike(card, isLiked) {
    api.handleLike(card._id, !isLiked)
      .then(сard => {
        setCards((state) => state.map((c) => c._id === card._id ? сard : c));

    })
      .catch(err => console.error(`Ошибка ${err} при обработке лайка.`));
  }

  function handleCardDelete(card, setBtnName) {
    api.reqDelCard(card._id)
    .then(() => {
      setCards(cards.filter((item) => item._id !== card._id));
      closeAllPopups();
  })
    .catch(err => console.error(`Ошибка ${err} при удалении карточки.`))
    .finally(() => {
      setBtnName('Да');
      setCardItem({});
    });
  }

  function handleAddPlaceSubmit({name, link}, setBtnName) {
    api.addCards({name: name, link: link})
    .then((newCard) => {
      setCards([newCard.data, ...cards]);
      closeAllPopups();
    })
    .catch(err => console.error(`Ошибка ${err} при добавлении карточки.`))
    .finally(() => {setBtnName('Создать')});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} setBntName={setBntName} bntName={bntName} />
        <Switch>
          <Route path='/signin'>
            <Login onLogin={onLogin} setBntName={setBntName} />
          </Route>
          <Route path='/signup'>
            <Register onRegister={onRegister} />
          </Route>

          <ProtectedRoute loggedIn={loggedIn} path='/'
            onCardClick={handleCardClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleDeletePopup}
            component={Main} />
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
          <Footer />

          <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />

          <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />

          <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />

          <DeletePopup onDeleteCard={handleCardDelete} isOpen={isDeletePopupOpen} onClose={closeAllPopups} card={cardItem} />

          <InfoTooltip isOpen={isInfoShow} onClose={closeAllPopups} info={infoMessage} />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
  </div>
  </CurrentUserContext.Provider>
  );
}
