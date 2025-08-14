class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }

  getInitialUser() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }

  async deleteCard(cardId) {
    if (!cardId) {
      return Promise.reject(new Error("cardId inválido"));
    }

    const token = localStorage.getItem("jwt");
    const url = `${this._baseUrl}/cards/${cardId}`;
    const options = {
      method: "DELETE",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await fetch(url, options);
      let data;

      if (res.status !== 204) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          data = await res.text();
        }
      }

      if (res.ok) {
        return data ?? { success: true }; // 👈 devolvemos algo incluso si no hay body
      }

      const error = new Error(`HTTP ${res.status}`);
      error.status = res.status;
      error.body = data;
      return Promise.reject(error);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  createCard(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(card),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }

  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }

  removeLikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }

  editProfileImage({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ avatar }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }

  editProfileCredentials({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ name, about }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(`Error: ${res.status}`);
    });
  }
}

export const api = new Api({
  baseUrl: "https://api.hectorvmbootcamp.chickenkiller.com",
  // baseUrl: "http://localhost:3001",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    // "f1b02352-6399-4c87-80fa-4dabfd185e85",
    "Content-Type": "application/json",
  },
});
