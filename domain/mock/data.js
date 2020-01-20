const {} = require('mongodb');

const data = [
  {
    company: '5e25cd5bfc13ae5941000000',
    title: 'Complain made in Guarulhos Intl. Airport',
    description:
      'curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel',
    location: { type: 'Point', coordinates: [-46.473043, -23.4305731] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    company: '5e25cd5bfc13ae5941000002',
    title: 'Complain made in Portuguesa/Tiete Metro St.',
    description:
      'curabitur at ipsum ac tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero',
    location: { type: 'Point', coordinates: [-46.6252047, -23.5161069] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    company: '5e25cd5bfc13ae5941000006',
    title: 'Complain made in Paraiso Metro St.',
    description:
      'dui maecenas tristique est et tempus semper est quam pharetra magna ac consequat metus',
    location: { type: 'Point', coordinates: [-46.6408822, -23.576521] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    company: '5e25cd5bfc13ae594100000a',
    title: 'Complain made in Santa Cruz Metro St.',
    description:
      'ornare imperdiet sapien urna pretium nisl ut volutpat sapien arcu sed augue aliquam',
    location: { type: 'Point', coordinates: [-46.6368882, -23.5990255] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    company: '5e25cd5bfc13ae594100000a',
    title: 'Complain made in Praça da Árvore Metro St.',
    description:
      'ornare imperdiet sapien urna pretium nisl ut volutpat sapien arcu sed augue aliquam',
    location: { type: 'Point', coordinates: [-46.637934, -23.6105101] },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = data;
