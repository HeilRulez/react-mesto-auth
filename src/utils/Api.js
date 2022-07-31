import {configApi} from './constants.js';

class Api {
  constructor({baseUrl, type, cohort}) {
    this._baseUrl = baseUrl;
    this._type = type;
    this._cohort = cohort;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    } else {
      return new Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  access(email, password, url) {
    return fetch(`${this._baseUrl}${url}`, {
        method: 'POST',
        headers: {
          "Content-Type": this._type,
        },
        body: JSON.stringify({
          "password": password,
          "email": email
        })
      })
      .then(res => this._checkResponse(res))
    }

  renderAllCards() {
    return fetch(`${this._baseUrl}/cards`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(res => this._checkResponse(res))
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(res => this._checkResponse(res))
  }

  reqDelCard(idCard) {
    return fetch(`${this._baseUrl}/cards/${idCard}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(res => this._checkResponse(res))
  }

  addCards({name, link
  }) {
    return fetch(`${this._baseUrl}/cards`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': this._type
        },
        body: JSON.stringify({
          name: name,
          link: link
        })
      })
      .then(res => this._checkResponse(res))
  }

  handleLike(id, isLiked) {
    if (!isLiked) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`
          }
        })
        .then(res => this._checkResponse(res))
    } else {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`
          }
        })
        .then(res => this._checkResponse(res))
    }
  }

  sendData(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': this._type
        },
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
      .then(res => this._checkResponse(res))
  }

  selectionAvatar(link) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': this._type
        },
        body: JSON.stringify({
          avatar: link
        })
      })
      .then(res => this._checkResponse(res))
  }

}

export default new Api(configApi);
