import {Component} from "@angular/core";
import {FormsModule} from '@angular/forms';
import {DomSanitizer} from "@angular/platform-browser";

import {IPost} from "./../../interfaces/ipost";
import posts from "./../../data/posts.json";

@Component({
  selector:"app-blog",
  imports:[FormsModule],
  templateUrl:"./blog.html",
  styleUrl:"./blog.css"
})
export class Blog {
  listadoNoticias:IPost[] = [];
  titulo:string;
  texto:string;
  url:string;
  checkImage:string = "";

  constructor(private sanitizer:DomSanitizer) {
    this.listadoNoticias = posts.map(post => ({...post, fecha_publicacion:new Date()}));
    this.titulo = "";
    this.texto = "";
    this.url = "";
  }

  fechaYHoraPublicacionFormatoLocal(fechaYHora:Date):string {
    let dateFormatoLocal = "";
    
    const fechaFormatoLocal = fechaYHora.toLocaleDateString("es-ES");
    const horaFormatoLocal = fechaYHora.toLocaleTimeString("es-ES");

    dateFormatoLocal += fechaFormatoLocal + " a las " + horaFormatoLocal;
    
    return dateFormatoLocal;
  }

  renderizadorNoticias():object {
    let html = "";

    this.listadoNoticias.forEach(post => {
      html += `
        <li class="listado-noticias__li">
          <article class="listado-noticias__article">
            <header class="listado-noticias__header">
              <img src=${post.url} alt=${post.titulo} class="listado-noticias__img">

              <time class="listado-noticias__time">${this.fechaYHoraPublicacionFormatoLocal(post.fecha_publicacion)}</time>

              <h3 class="listado-noticias__h3">${post.titulo}</h3>
            </header>

            <p class="listado-noticias__p">${post.texto}</p>
          </article>
        </li>
      `;
    });

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  nuevaNoticia():void {
    if (this.titulo && this.texto && this.url) {
      this.listadoNoticias.push({titulo:this.titulo, texto:this.texto, url:this.url, fecha_publicacion:new Date()});

      this.titulo = "";
      this.texto = "";
      this.url = "";

      this.renderizadorNoticias();

      this.checkImage = "<img src='/assets/img/check.svg' alt='Imagen de confirmación de check' class='form__img-check' #formImgCheck>";
    } else {
      alert("Por favor, completa todos los campos correctamente 😅");
    }
  }
};