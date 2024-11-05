import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa/Tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  // URL da API
  private readonly API_URL = "http://localhost:8080/tarefas";


  // @Autowired
  constructor(private http: HttpClient) {}

  /**
   * Obtém a lista de todas as tarefas
   */
  listAll(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.API_URL}/lista`);
  }

  /**
   * Obtém uma tarefa pelo seu ID
   */
  findById(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.API_URL}/buscaPorId/${id}`);
  }

  /**
   * Salva uma nova tarefa
   */
  save(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<Tarefa>(`${this.API_URL}/cadastra`, tarefa, { responseType: 'text' as 'json' });
  }

  /**
   * Atualiza uma tarefa existente
   */
  update(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.API_URL}/atualiza/${tarefa.id}`, tarefa);
  }

  /**
   * Move a tarefa para cima na lista
   */
  moverParaCima(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/subir`, {});
  }

  /**
   * Move a tarefa para baixo na lista
   */
  moverParaBaixo(id: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}/descer`, {});
  }

  /**
   * Busca tarefas pelo nome
   */
  buscarPorNome(nome: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.API_URL}/buscarTarefa/${nome}`);
  }

  /**
   * Deleta uma tarefa pelo seu ID
   */
  delete(id: number): Observable<string> {
    return this.http.delete<string>(`${this.API_URL}/deleta/${id}`, { responseType: 'text' as 'json' });
  }
}
