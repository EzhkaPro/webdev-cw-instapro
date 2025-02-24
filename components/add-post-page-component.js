import { renderHeaderComponent } from "./header-component.js";
//import { renderUserPosts } from "./posts-page-component.js";
import { onDeleteClick } from "../index.js"
import {sanitizeHtml} from "../helpers.js"
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">
        </div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" id ="description" rows="4"></textarea>
        </label>
        <button class="button" id="add-button">Добавить</button>
        </div>    
    </div>
  `;

    appEl.innerHTML = appHtml;

    
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

     
    document.getElementById("add-button").addEventListener("click", () => {
      if (imageUrl) {
        onAddPostClick({
          description: sanitizeHtml(document.getElementById("description").value),
           imageUrl: imageUrl,
        });

      } else {
        alert("Сначала выберите фото и опишите его ");
      }
    });
  };

  render();
};