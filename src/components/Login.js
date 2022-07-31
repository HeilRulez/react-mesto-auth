import { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom';

export default function Login({onLogin, setBntName}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  useEffect(() => {
    setBntName('Регистрация');
  });

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function resetForm() {
    setEmail('');
    setPassword('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if(!email || !password) {
      return
    }
    onLogin(email, password)
    .then(() => {
      history.push('/');
      resetForm();
    })
    .catch(err => console.error(`Ошибка ${err} при попытке авторизации.`));
  }

    return (
      <div className="access-form">
        <h2 className="access-form__title">Вход</h2>
        <form className='form' onSubmit={handleSubmit} name='sign-in' noValidate>
          <input className="form__access-input"
            onChange={handleChangeEmail}
            value={email}
            id="emailInput" type="email" name="email"
            placeholder="Email" required />

          <span className="form__text-error" id="emailInput-error"></span>

          <input className="form__access-input"
            onChange={handleChangePassword}
            value={password}
            id="password" type="password" name="password" minLength="2"
            maxLength="20" placeholder="Пароль" required />

          <span className="form__text-error" id="password-error"></span>

          <button className="form__access-btn-submit" type="submit">Войти</button>
        </form>
      </div>
    )
}

