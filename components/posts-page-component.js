/**
  * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
  * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
  */
import { ru } from 'date-fns/locale';
import { formatDistance } from "date-fns";
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, onClickLike, user } from "../index.js";
import { deletePost } from "../api.js"

export function renderPostsPageComponent({ appEl }) {
  console.log("Актуальный список постов:", posts);

  const postsHtml = posts.map((post) => getPost(post)).join("");
  //шапка
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                ${postsHtml}
                 </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  initLikeButtons();
  initDoubleClick(".post");
  initDoubleClick(".user-post");
}

function getPost(post) {
  return `
  <li class="post">
  <div class="post-header" data-user-id=${post.user.id}>
      <img src=${post.user.imageUrl} class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
  </div>

  <div class="post-image-container">
    <img class="post-image" src=${post.imageUrl}>
  </div>
  <div class="post-likes">
  <button data-post-id="${post.id}" class="like-button ${post.isLiked ? 'active-like' : 'inactive-like'}">
    ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
    </button>
  <p class="post-likes-text">
  ${(post.likes.at(-1)) ? `Нравится: <strong>${post.likes.at(-1).name}</strong>` : ""}${(post.likes.length - 1 > 0) ? ` 
  и <strong>еще ${post.likes.length - 1}</strong>` : ""} 
  </p>
</div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  ${formatDistance(new Date(post.createdAt), new Date, { locale: ru })}
  </p>
</li>
  `
};

export function renderUserPosts({ appEl }) {
  const postsHtml = posts.map((post) => getUserPost(post)).join("");
  let postsAuthor = posts[0] ? posts[0].user : user;
  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>

    <div class="posts-user-header">
      <div class="posts-user-header__user-block">
      <img src=${postsAuthor.imageUrl} class="posts-user-header__user-image">
      <p class="posts-user-header__user-name" id="shareLink">${postsAuthor.name}</p>
      </div>
    </div>
    ${posts[0] ?
      `    
        <ul class="posts">
         ${postsHtml}
        </ul>   
      ` :
      '<h3 class="form-title">Добавьте сюда фотографии, чтобы заполнить профиль</h3>'}
  </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  initLikeButtons();
  initDoubleClick(".post");
  initDoubleClick(".user-post");
};

function getUserPost(post) {
  return `
  <li class="post">
    <div class="post-image-container">
       <img class="post-image" src=${post.imageUrl}>
    </div>
  <div class="post-likes">
  <button data-post-id="${post.id}" class="like-button ${post.isLiked ? 'active-like' : 'inactive-like'}">
    ${post.isLiked ? '<img src="./assets/images/like-active.svg">' : '<img src="./assets/images/like-not-active.svg">'}
    </button>
  <p class="post-likes-text">
  ${(post.likes.at(-1)) ? `Нравится: <strong>${post.likes.at(-1).name}</strong>` : ""}${(post.likes.length - 1 > 0) ? ` 
  и <strong>еще ${post.likes.length - 1}</strong>` : ""} 
  </p>
</div>
  <p class="post-text">
    <span class="user-name">${post.user.name}</span>
    ${post.description}
  </p>
  <p class="post-date">
  ${formatDistance(new Date(post.createdAt), new Date, { locale: ru })}
  </p>
  ${user ? `${post.user.login === user.login ? `<button data-id="${post.id}" class="delete-button">Удалить пост</button>` : ""}` : ""}
</li>
  `
};


function initLikeButtons() {
  for (let dislikeEl of document.querySelectorAll('.active-like'))
    dislikeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      dislikeEl.classList.add('-loading-like');
      onClickLike({ id: dislikeEl.dataset.postId }, "dislike");
    })
  for (let likeEl of document.querySelectorAll('.inactive-like'))
    likeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      likeEl.classList.add('-loading-like');
      onClickLike({ id: likeEl.dataset.postId }, "like");
    })
};

function initDoubleClick(postSelector) {
  const posts = document.querySelectorAll(postSelector);
  for (let post of posts) {
    let lastClickTime = new Date().getTime();
    post.addEventListener("click", () => {
      const currentTime = new Date().getTime();
      if ((currentTime - lastClickTime) < 500) {
        const likeIcon = post.querySelector(".like-button");
        if (likeIcon.classList.contains("inactive-like")) {
          likeIcon.classList.remove("inactive-like");
          likeIcon.classList.add("active-like");
          likeIcon.classList.add('-loading-like');
          onClickLike({ id: likeIcon.dataset.postId }, "like");
        } else {
          likeIcon.classList.remove("active-like");
          likeIcon.classList.add("inactive-like");
          likeIcon.classList.add('-loading-like');
          onClickLike({ id: likeIcon.dataset.postId }, "dislike");
        }
      }
      lastClickTime = currentTime;
    })

  }
}

const deleteElement = document.querySelectorAll(".delete-button");
for (const delEl of deleteElement) {
  delEl.addEventListener("click", (event) => {
    event.stopPropagation();
    deletePost({ token: getToken(), id: delEl.dataset.postId })
  });   
}
