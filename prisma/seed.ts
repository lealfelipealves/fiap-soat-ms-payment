import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const data: Prisma.ProductCreateManyInput[] = [
    // Lanches
    {
      name: 'Hambúrguer Clássico',
      description: 'Hambúrguer com queijo, alface e tomate.',
      price: 10.0,
      category: 'Lanche'
    },
    {
      name: 'Cheeseburger',
      description: 'Hambúrguer com queijo cheddar derretido.',
      price: 12.0,
      category: 'Lanche'
    },
    {
      name: 'Hambúrguer Duplo',
      description: 'Dois hambúrgueres com queijo e bacon.',
      price: 15.0,
      category: 'Lanche'
    },
    {
      name: 'Sanduíche Vegano',
      description: 'Sanduíche com hambúrguer vegano e vegetais frescos.',
      price: 13.0,
      category: 'Lanche'
    },
    {
      name: 'Chicken Burger',
      description: 'Hambúrguer de frango com maionese especial.',
      price: 11.0,
      category: 'Lanche'
    },
    {
      name: 'Hot Dog Completo',
      description: 'Cachorro-quente com salsicha, queijo e molho especial.',
      price: 9.0,
      category: 'Lanche'
    },
    {
      name: 'Wrap de Frango',
      description: 'Wrap com frango grelhado e molho de iogurte.',
      price: 10.0,
      category: 'Lanche'
    },

    // Acompanhamentos
    {
      name: 'Batata Frita',
      description: 'Porção de batatas fritas crocantes.',
      price: 5.0,
      category: 'Acompanhamento'
    },
    {
      name: 'Anéis de Cebola',
      description: 'Anéis de cebola empanados e crocantes.',
      price: 6.0,
      category: 'Acompanhamento'
    },
    {
      name: 'Nuggets de Frango',
      description: 'Nuggets de frango com molho barbecue.',
      price: 7.0,
      category: 'Acompanhamento'
    },
    {
      name: 'Salada Simples',
      description: 'Salada com alface, tomate e cenoura.',
      price: 8.0,
      category: 'Acompanhamento'
    },
    {
      name: 'Palitos de Mozzarella',
      description: 'Palitos de queijo mozzarella empanados.',
      price: 7.5,
      category: 'Acompanhamento'
    },
    {
      name: 'Chips de Batata Doce',
      description: 'Chips de batata doce crocantes.',
      price: 8.5,
      category: 'Acompanhamento'
    },
    {
      name: 'Mini Pastéis',
      description: 'Mini pastéis recheados com carne ou queijo.',
      price: 9.5,
      category: 'Acompanhamento'
    },

    // Bebidas
    {
      name: 'Refrigerante',
      description: 'Lata de refrigerante à sua escolha.',
      price: 3.0,
      category: 'Bebida'
    },
    {
      name: 'Suco Natural',
      description: 'Suco de frutas frescas.',
      price: 5.0,
      category: 'Bebida'
    },
    {
      name: 'Água Mineral',
      description: 'Garrafa de água mineral sem gás.',
      price: 2.0,
      category: 'Bebida'
    },
    {
      name: 'Água com Gás',
      description: 'Garrafa de água mineral com gás.',
      price: 2.5,
      category: 'Bebida'
    },
    {
      name: 'Chá Gelado',
      description: 'Chá gelado de limão ou pêssego.',
      price: 4.0,
      category: 'Bebida'
    },
    {
      name: 'Café Expresso',
      description: 'Café expresso quente e aromático.',
      price: 3.5,
      category: 'Bebida'
    },
    {
      name: 'Milkshake',
      description: 'Milkshake de chocolate, baunilha ou morango.',
      price: 8.0,
      category: 'Bebida'
    },

    // Sobremesas
    {
      name: 'Sorvete',
      description: 'Porção de sorvete com calda de chocolate.',
      price: 6.0,
      category: 'Sobremesa'
    },
    {
      name: 'Torta de Maçã',
      description: 'Torta de maçã com massa crocante.',
      price: 7.0,
      category: 'Sobremesa'
    },
    {
      name: 'Brownie',
      description: 'Brownie de chocolate com nozes.',
      price: 7.5,
      category: 'Sobremesa'
    },
    {
      name: 'Petit Gâteau',
      description: 'Petit gâteau com sorvete de baunilha.',
      price: 9.0,
      category: 'Sobremesa'
    },
    {
      name: 'Mousse de Chocolate',
      description: 'Mousse cremosa de chocolate.',
      price: 8.0,
      category: 'Sobremesa'
    },
    {
      name: 'Pudim de Leite',
      description: 'Pudim de leite condensado tradicional.',
      price: 8.5,
      category: 'Sobremesa'
    },
    {
      name: 'Cupcake',
      description: 'Cupcake com cobertura de chantilly.',
      price: 7.0,
      category: 'Sobremesa'
    }
  ]
  const products = await prisma.product.createMany({
    data,
    skipDuplicates: true // Evita duplicatas
  })

  console.log(`${products.count} produtos inseridos.`)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
