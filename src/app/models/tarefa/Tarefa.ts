

export class Tarefa {
    id!: number;               
    nomeTarefa!: string;      
    custo!: number;           
    dataLimite!: Date;        
    ordemApresentacao!: number; 

    constructor(id: number, nomeTarefa: string, custo: number, dataLimite: Date, ordemApresentacao: number) {
        this.id = id;
        this.nomeTarefa = nomeTarefa;
        this.custo = custo;
        this.dataLimite = dataLimite;
        this.ordemApresentacao = ordemApresentacao;
    }
}