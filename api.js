const personalKey = "EzhkaPro";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function uploadPost ({token}, description, imageUrl) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: token,
    },
  })
  .then((response) => {
    if (response.status === 400) {
      throw new Error("В теле запроса не передан description или imageUrl");
    }
    return response.json();
  });
};
export function addDisLike ({ token }, {id}, islike) {
  return fetch(`${postsHost}/${id}/${islike}`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error("Нет авторизации");
    })
};
export function deletePost({ token }, {id}) {
  return fetch(`${postsHost}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
        return response.json();
      })
    .then((data) => {
      console.log(data);
      return data;
    });
};