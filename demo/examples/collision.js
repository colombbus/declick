const description = 'Montre comment créer une collision entre 2 sprites.'

const resources = {
  banknote: ['image', 'banknote.png'],
  book: ['image', 'book.png'],
}

const code = `billet = new Sprite("banknote")
billet.définirPosition(400,0)
livre = new Sprite("book")
livre.ajouterBloc(billet)
livre.avancerToujours()
`

export { description, resources, code }
