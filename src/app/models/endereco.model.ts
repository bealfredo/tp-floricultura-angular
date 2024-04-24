import { Cidade } from "./cidade.model";

export class Endereco {
    id!: number;
    nome!: string;
    cep!: string;
    codigo!: string;
    rua!: string;
    bairro!: string;
    numeroLote!: string;
    complemento!: string;
    cidade!: Cidade;
}
  