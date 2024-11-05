import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/layout/footer/footer.component";
import { NavbarComponent } from "./components/layout/navbar/navbar.component";
import { ConteudoComponent } from "./components/conteudo/conteudo/conteudo.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent, ConteudoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ListaDeTarefas';
}
