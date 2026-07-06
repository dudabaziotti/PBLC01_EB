import { prisma } from '../lib/prisma.js';
import argon2 from 'argon2';

async function main() {
  console.log('Iniciando o seed...');

  const senhaHash = await argon2.hash('senha123');

  const taco = await prisma.fonteReferencia.create({
    data: { linkFonte: 'https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf', nomeFonte: 'TACO', anoPublicacao: '2011' },
  });

  const farinha = await prisma.ingrediente.create({
    data: { nome: 'Farinha de trigo', unidade: 'g', fonte: 'TACO', fonteReferenciaId: taco.id },
  });
  const acucar = await prisma.ingrediente.create({
    data: { nome: 'Açúcar refinado', unidade: 'g', fonte: 'TACO', fonteReferenciaId: taco.id },
  });
  const manteiga = await prisma.ingrediente.create({
    data: { nome: 'Manteiga', unidade: 'g', fonte: 'TACO', fonteReferenciaId: taco.id },
  });
  const ovo = await prisma.ingrediente.create({
    data: { nome: 'Ovo de galinha', unidade: 'unidade', fonte: 'TACO', fonteReferenciaId: taco.id },
  });
  const leite = await prisma.ingrediente.create({
    data: { nome: 'Leite integral', unidade: 'ml', fonte: 'TACO', fonteReferenciaId: taco.id },
  });

  const xicara = await prisma.medidaCaseira.create({
    data: { descricao: 'xícara de chá', gramagemEquivalente: 120, valor: 1, ingredienteId: farinha.idIngrediente },
  });
  const colherSopa = await prisma.medidaCaseira.create({
    data: { descricao: 'colher de sopa', gramagemEquivalente: 15, valor: 1, ingredienteId: acucar.idIngrediente },
  });
  const colherCha = await prisma.medidaCaseira.create({
    data: { descricao: 'colher de chá', gramagemEquivalente: 5, valor: 1, ingredienteId: manteiga.idIngrediente },
  });

  await prisma.microNutriente.createMany({
    data: [
      { nome: 'Cálcio',     valor: 18,  unidade: 'mg',  ingredienteId: farinha.idIngrediente  },
      { nome: 'Ferro',      valor: 1.4, unidade: 'mg',  ingredienteId: farinha.idIngrediente  },
      { nome: 'Sódio',      valor: 1,   unidade: 'mg',  ingredienteId: acucar.idIngrediente   },
      { nome: 'Potássio',   valor: 2,   unidade: 'mg',  ingredienteId: acucar.idIngrediente   },
      { nome: 'Vitamina A', valor: 754, unidade: 'mcg', ingredienteId: manteiga.idIngrediente },
      { nome: 'Cálcio',     valor: 7,   unidade: 'mg',  ingredienteId: manteiga.idIngrediente },
      { nome: 'Vitamina D', valor: 2.0, unidade: 'mcg', ingredienteId: ovo.idIngrediente      },
      { nome: 'Ferro',      valor: 1.8, unidade: 'mg',  ingredienteId: ovo.idIngrediente      },
      { nome: 'Cálcio',     valor: 123, unidade: 'mg',  ingredienteId: leite.idIngrediente    },
      { nome: 'Vitamina B2',valor: 0.2, unidade: 'mg',  ingredienteId: leite.idIngrediente    },
    ],
  });

  const admin = await prisma.usuario.create({
    data: { nome: 'Admin Sistema', email: 'admin@nutri.com', senha: senhaHash, tipo: 'ADMINISTRADOR', nivelPrivilegio: 'TOTAL' },
  });
  const produtor = await prisma.usuario.create({
    data: { nome: 'Padaria Ouro', email: 'contato@padariaouro.com', senha: senhaHash, tipo: 'PRODUTOR', cnpj: '12.345.678/0001-99', nomeEmpresa: 'Padaria Ouro Ltda', telefoneContato: '(35) 99999-0001' },
  });
  const usuario = await prisma.usuario.create({
    data: { nome: 'Duda Nutricionista', email: 'duda@nutri.com', senha: senhaHash, tipo: 'USUARIO' },
  });

  const receitaBolo = await prisma.receita.create({
    data: { modoPreparo: 'Misture os ingredientes secos. Adicione ovos e manteiga. Leve ao forno a 180°C por 35 minutos.', tempoPreparo: 50, rendimentoPorcoes: 10 },
  });
  const receitaBiscoito = await prisma.receita.create({
    data: { modoPreparo: 'Misture farinha, açúcar e manteiga até obter uma massa homogênea. Modele e asse a 160°C por 20 minutos.', tempoPreparo: 35, rendimentoPorcoes: 20 },
  });

  const fichaBolo = await prisma.fichaTecnica.create({
    data: {
      idFicha: 'FICHA-001',
      nomeReceita: 'Bolo de baunilha',
      autor: produtor.nome,
      pesoTotal: 800,
      tamanhoPorcao: 80,
      formatos: ['PDF', 'CSV'],
      receitaId: receitaBolo.idReceita,
      usuarioId: produtor.idUsuario,
    },
  });
  const fichaBiscoito = await prisma.fichaTecnica.create({
    data: {
      idFicha: 'FICHA-002',
      nomeReceita: 'Biscoito amanteigado',
      autor: usuario.nome,
      pesoTotal: 400,
      tamanhoPorcao: 20,
      formatos: ['PDF'],
      receitaId: receitaBiscoito.idReceita,
      usuarioId: usuario.idUsuario,
    },
  });

  await prisma.fichaTecnicaIngrediente.createMany({
    data: [
      { fichaId: fichaBolo.idFicha,     ingredienteId: farinha.idIngrediente  },
      { fichaId: fichaBolo.idFicha,     ingredienteId: acucar.idIngrediente   },
      { fichaId: fichaBolo.idFicha,     ingredienteId: manteiga.idIngrediente },
      { fichaId: fichaBolo.idFicha,     ingredienteId: ovo.idIngrediente      },
      { fichaId: fichaBolo.idFicha,     ingredienteId: leite.idIngrediente    },
      { fichaId: fichaBiscoito.idFicha, ingredienteId: farinha.idIngrediente  },
      { fichaId: fichaBiscoito.idFicha, ingredienteId: acucar.idIngrediente   },
      { fichaId: fichaBiscoito.idFicha, ingredienteId: manteiga.idIngrediente },
    ],
  });

  const medidaPorcaoBolo = await prisma.medidaCaseira.create({
    data: { descricao: 'fatia média', gramagemEquivalente: 80, valor: 1 },
  });
  const medidaPorcaoBiscoito = await prisma.medidaCaseira.create({
    data: { descricao: 'unidade', gramagemEquivalente: 20, valor: 1 },
  });

  const tabelaBolo = await prisma.tabelaNutricional.create({
    data: {
      dados: 'Calorias: 280kcal | Carboidratos: 42g | Proteínas: 5g | Gorduras: 10g',
      formato: 'ANVISA',
      medidaCaseiraId: medidaPorcaoBolo.id,
      fichaTecnicaId: fichaBolo.idFicha,
    },
  });
  const tabelaBiscoito = await prisma.tabelaNutricional.create({
    data: {
      dados: 'Calorias: 95kcal | Carboidratos: 12g | Proteínas: 1g | Gorduras: 5g',
      formato: 'ANVISA',
      medidaCaseiraId: medidaPorcaoBiscoito.id,
      fichaTecnicaId: fichaBiscoito.idFicha,
    },
  });

  await prisma.microNutriente.createMany({
    data: [
      { nome: 'Sódio',  valor: 180, unidade: 'mg', tabelaId: tabelaBolo.idTabela     },
      { nome: 'Cálcio', valor: 60,  unidade: 'mg', tabelaId: tabelaBolo.idTabela     },
      { nome: 'Ferro',  valor: 1.2, unidade: 'mg', tabelaId: tabelaBolo.idTabela     },
      { nome: 'Sódio',  valor: 55,  unidade: 'mg', tabelaId: tabelaBiscoito.idTabela },
      { nome: 'Cálcio', valor: 10,  unidade: 'mg', tabelaId: tabelaBiscoito.idTabela },
    ],
  });

  await prisma.tabelaNutricionalIngrediente.createMany({
    data: [
      { tabelaId: tabelaBolo.idTabela,     ingredienteId: farinha.idIngrediente  },
      { tabelaId: tabelaBolo.idTabela,     ingredienteId: acucar.idIngrediente   },
      { tabelaId: tabelaBolo.idTabela,     ingredienteId: manteiga.idIngrediente },
      { tabelaId: tabelaBiscoito.idTabela, ingredienteId: farinha.idIngrediente  },
      { tabelaId: tabelaBiscoito.idTabela, ingredienteId: acucar.idIngrediente   },
    ],
  });

  await prisma.rotulo.createMany({
    data: [
      {
        listaAlergenos: 'Contém GLÚTEN (trigo), LEITE e OVOS.',
        instrucoesConservacao: 'Conservar em local fresco e seco. Após aberto, consumir em até 3 dias.',
        validadeDias: 7,
        fichaTecnicaId: fichaBolo.idFicha,
      },
      {
        listaAlergenos: 'Contém GLÚTEN (trigo) e LEITE.',
        instrucoesConservacao: 'Conservar em recipiente fechado, ao abrigo da umidade.',
        validadeDias: 30,
        fichaTecnicaId: fichaBiscoito.idFicha,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
    console.log('Seed concluído!');
  });