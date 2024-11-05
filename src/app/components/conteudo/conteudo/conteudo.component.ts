import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Tarefa } from '../../../models/tarefa/Tarefa';
import { TarefaService } from '../../../service/tarefa.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'; 
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';



@Component({
  selector: 'app-conteudo',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule,MdbFormsModule],
  templateUrl: './conteudo.component.html',
  styleUrls: ['./conteudo.component.scss']
})
export class ConteudoComponent implements OnInit {
  
  listaDeTarefas: Tarefa[] = [];
  tarefasEdit: Tarefa = new Tarefa(0, "", 0, new Date(), 0);
  service = inject(TarefaService);

  // Variável para controlar a visibilidade do modal
  ModalEstaAberto: boolean = false;

  nomeBusca: any;
  avisoVisivel: boolean = false;
  valorAcimaMilVisivel: boolean = false;


  
  
  abrirModal() { 
    this.tarefasEdit = new Tarefa(0, "", 0, new Date(), 0);
    this.ModalEstaAberto = true; // A
  }
  fecharModal() {
    this.ModalEstaAberto = false; 
  }

  constructor() {
    registerLocaleData(localePt);
  }

  ngOnInit() {
    this.listAll();
    this.mostrarMostrador(); 
    this.verificarValorAcimaMil(); 
  }


  listAll() { 
    this.service.listAll().subscribe({
      next: lista => {
        if (lista.length === 0) {
          Swal.fire({
            title: "Sistema está off-line",
            text: "Nenhum dado disponível.",
            icon: 'warning',
            confirmButtonText: 'Ok'
          });
        } else {
          this.listaDeTarefas = lista.sort((a, b) => a.ordemApresentacao - b.ordemApresentacao);
        }
      },
      error: err => { 
        Swal.fire({ 
          title: "Sistema está off-line",
          text: "Por favor, tente novamente mais tarde.",
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }


  deleteById(tarefa: Tarefa) {
    Swal.fire({
      title: 'Tem certeza que deseja deletar essa tarefa?',
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(tarefa.id).subscribe({
          next: message => { 
            Swal.fire({   
              title: 'Tarefa deletada com sucesso!', 
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            this.listAll();
          },
          error: err => { 
            Swal.fire({   
              title: "Ocorreu um erro ao deletar a tarefa.", 
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          },
        });
      }
    });

    
  }


  moverParaCima(tarefa: Tarefa): void {
    this.service.moverParaCima(tarefa.id).subscribe(() => {
      this.listAll();
    });
  }

  moverParaBaixo(tarefa: Tarefa): void {
    this.service.moverParaBaixo(tarefa.id).subscribe(() => {
      this.listAll();
    });
  }


  buscarPorNome() {
    const nomeTarefa = this.nomeBusca ? this.nomeBusca.trim() : null; 

    if (nomeTarefa) { 
        this.service.buscarPorNome(encodeURIComponent(nomeTarefa)).subscribe({
            next: (tarefas) => {
                if (tarefas.length > 0) {
                    this.listaDeTarefas = tarefas; 
                } else {
                    Swal.fire({
                        title: 'Nenhuma tarefa encontrada!',
                        text: `Nenhuma tarefa corresponde ao nome "${nomeTarefa}".`,
                        icon: 'info',
                        confirmButtonText: 'Ok'
                    });
                }
            },
            error: (err) => {
                Swal.fire({
                    title: 'Erro ao buscar tarefa!',
                    text: 'Ocorreu um erro ao realizar a busca.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        });
    } else {

        this.listAll();
    }
}



  salvarTarefa() {
    if (this.tarefasEdit.nomeTarefa && this.tarefasEdit.custo >= 0) {
      if (this.tarefasEdit.id === 0) {

        this.service.save(this.tarefasEdit).subscribe({
          next: (response: Tarefa) => {
            this.listaDeTarefas.push(response); 
            Swal.fire('Sucesso!', 'Tarefa adicionada com sucesso.', 'success');
            this.fecharModal();
            this.listAll();
          },
          error: err => {
            console.log(err); 
            const errorMessage = err.error?.message || 'Ocorreu um erro ao salvar a tarefa.';
            Swal.fire('Erro!', errorMessage, 'error');
          }
        });
      } else {

        // Se a ID for diferente de 0, estamos editando uma tarefa existente
        this.service.update(this.tarefasEdit).subscribe({
          next: (response: Tarefa) => {

            //Atualiza a lista local de tarefas com a tarefa editada
            const index = this.listaDeTarefas.findIndex(t => t.id === response.id);

            if (index !== -1) {
              this.listaDeTarefas[index] = response; //Substitui tarefa editada na lista
            }
            Swal.fire('Sucesso!', 'Tarefa atualizada com sucesso.', 'success');
            this.fecharModal();
            this.listAll();
          },
          error: err => {
            console.log(err);
            const errorMessage = err.error?.message || 'Ocorreu um erro ao atualizar a tarefa.';
            Swal.fire('Erro!', errorMessage, 'error');
          }
        });
      }
    } else {
      Swal.fire('Erro!', 'Preencha todos os campos corretamente.', 'error');
    }
  }


  editTarefa(tarefa: Tarefa) {
    this.tarefasEdit = { ...tarefa }; //Clona a tarefa selecionada para editar
    this.ModalEstaAberto = true; //Abre o modal
  }


  vencimentoProximo(dataLimite: Date): boolean {
    const today = new Date();
    const limite = new Date(dataLimite);
    const diffTime = limite.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    return diffDays >= 0 && diffDays < 5; 
  }

  mostrarMostrador() {
    this.avisoVisivel = true; // Torna o aviso visível
    setTimeout(() => {
      this.avisoVisivel = false; // Esconde o aviso após alguns segundos
    }, 6000);
    
  }
  verificarValorAcimaMil() {
    this.valorAcimaMilVisivel = this.listaDeTarefas.some(tarefa => tarefa.custo >= 1000);
  }
  
}