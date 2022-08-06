import {useState, useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import DeletePopup from './DeletePopup';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import api from '../utils/Api';
import {CurrentUserContext, DataUserContext} from '../contexts/CurrentUserContext';

export default function App() {

  const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isInfoShow, setInfoShow] = useState(false);
  const [infoState, setInfoState] = useState(null);
  const [selectedCard, handleCardClick] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [dataUser, setDataUser] = useState({});
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
          checkToken();
          setLoggedIn(true);
      }
    })
  }

  function onRegister(email, password) {
    return api.access(email, password, '/signup')
    .then(res => {
      if(res) {
        setInfoState(true);
        history.push('/sign-in');
      }else{
        setInfoState(false);
      }
    })
    .catch((err) => {
      console.error(`Ошибка ${err} при регистрации.`);
    })
    .finally(() => {
      setInfoShow(true);
    })
  }

  function getCards() {
    api.renderAllCards()
      .then(cards => {
        setCards(cards)
      })
      .catch(err => console.error(`Ошибка ${err} при загрузке карточек.`))
    }

  function getInfo() {
    api.getUserInfo()
    .then((dataUser) => {
      setCurrentUser(dataUser)
      })
      .catch(err => console.error(`Ошибка ${err} при получении данных профиля.`));
  }

  function checkToken() {
    api.getCheckToken()
    .then(res => {
      if(res) {
        setDataUser(res.data);
        getCards();
    }
    })
    .catch(err => console.error(`Ошибка ${err} при проверке токена.`))
  }

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
      checkToken();
      getInfo();
      setLoggedIn(true);
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
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => console.error(`Ошибка ${err} при отправке данных профиля.`))
    .finally(() => {setBtnName('Сохранить')});
  }

  function handleUpdateAvatar({avatar}, setBtnName) {
    api.selectionAvatar(avatar)
    .then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    })
    .catch(err => console.error(`Ошибка ${err} при получении аватара.`))
    .finally(() => {setBtnName('Сохранить')});
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);
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
    return api.getAllCards({name: name, link: link})
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch(err => console.error(`Ошибка ${err} при добавлении карточки.`))
    .finally(() => {
      setBtnName('Создать')
    });
  }

  return (
  <CurrentUserContext.Provider value={currentUser}>
    <DataUserContext.Provider value={dataUser}>
      <div className="page">
        <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} setBntName={setBntName} bntName={bntName} />
          <Switch>
            <Route path='/sign-in'>
              <Login onLogin={onLogin} setBntName={setBntName} />
            </Route>
            <Route path='/sign-up'>
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
          </Switch>
            <Footer />

            <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />

            <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />

            <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />

            <DeletePopup onDeleteCard={handleCardDelete} isOpen={isDeletePopupOpen} onClose={closeAllPopups} card={cardItem} />

            <InfoTooltip isOpen={isInfoShow} onClose={closeAllPopups} infoState={infoState} />

            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </div>
    </DataUserContext.Provider>
  </CurrentUserContext.Provider>
  );
}
