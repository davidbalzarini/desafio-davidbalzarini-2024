class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', espaco: 0, tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', espaco: 0, tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', espaco: 0, tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', espaco: 0, tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana',espaco: 0, tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animaisPermitidos = [
            { nome: 'LEAO', tamanho: 3, bioma: 'savana', carnivoro: true },
            { nome: 'LEOPARDO', tamanho: 2, bioma: 'savana', carnivoro: true },
            { nome: 'CROCODILO', tamanho: 3, bioma: 'rio', carnivoro: true },
            { nome: 'MACACO', tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            { nome: 'GAZELA', tamanho: 2, bioma: 'savana', carnivoro: false },
            { nome: 'HIPOPOTAMO', tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        ];
    }

    busca(animal) {
        return this.animaisPermitidos.find(a => a.nome === animal) || null;
    }

    analisaRecintos(animal, quantidade) {
        let animalSelecionado = this.busca(animal);
        if (quantidade <= 0) {
            return {
                erro: "Quantidade inválida",
                recintosViaveis: null
            };
        }

        if (!animalSelecionado) {
            return {
                erro: "Animal inválido",
                recintosViaveis: null
            };
        }

        const espacoNecessario = animalSelecionado.tamanho * quantidade;
        let recintosDisponiveis = [];

        this.recintos.forEach(recinto => {
            let espacoOcupado = recinto.animais.reduce((acumulado, a) => {
                const animalInfo = this.busca(a.especie);
                return acumulado + (animalInfo.tamanho * a.quantidade);
            }, 0);

            const espacoDisponivel = recinto.tamanho - espacoOcupado;
            recinto.espaco = espacoDisponivel
            if (espacoDisponivel >= espacoNecessario) {
                recintosDisponiveis.push(recinto);
            }
        });

        if (recintosDisponiveis.length === 0) {
            return {
                erro: "Não há recinto viável",
                recintosViaveis: null
            };
        }

        let recintosViaveis = [];

        recintosDisponiveis.forEach(recinto => {
            if (animalSelecionado.carnivoro) {
                const todosIguais = recinto.animais.every(a => a.especie === animalSelecionado.nome);
                if ((todosIguais || recinto.animais.length === 0) && animalSelecionado.bioma === recinto.bioma) {
                    recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.espaco - espacoNecessario} total: ${recinto.tamanho})`);
                }
            } else {
                
                const nenhumCarnivoro = recinto.animais.every(a => {
                    const animalInfo = this.busca(a.especie);
                    return !animalInfo.carnivoro;
                });

                if (nenhumCarnivoro) {
                    for (let j = 0; j < recinto.animais.length; j++) {
                        if (animalSelecionado.nome !== recinto.animais[j].especie) {
                            recinto.espaco--; 
                        }
                    }
                    if (animalSelecionado.nome === 'HIPOPOTAMO' && recinto.bioma.includes('rio')) {
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.espaco - espacoNecessario} total: ${recinto.tamanho})`);
                    } else if (animalSelecionado.nome === 'MACACO' && (recinto.bioma.includes('savana') || recinto.bioma.includes('floresta')) && (recinto.animais.length === 0 || quantidade > 1)) {
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.espaco - espacoNecessario} total: ${recinto.tamanho})`);
                    } else if (animalSelecionado.nome !== 'HIPOPOTAMO' && animalSelecionado.nome !== 'MACACO') {
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.espaco - espacoNecessario} total: ${recinto.tamanho})`);
                    }
                }
            }
        });
        return {
            erro: "",
            recintosViaveis: recintosViaveis
        };

        
    }
}
const zoo = new RecintosZoo();
const resultado = zoo.analisaRecintos('CROCODILO', 1);

console.log(resultado);
export { RecintosZoo as RecintosZoo };
