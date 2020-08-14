const resources = {
  book: ['image', 'book.png'],
  female: ['spritesheet', 'female.png', 'female.json'],
}

const code = `livres = 5
function ramasser(qui, livre) {
	livre.supprimer()
	livres--
	if (livres == 0) {
		qui.arrêter()
	}
}
a = new GroupeSprites('book')
a.définirTaille(30,40)
a.créerSprite(200,40)
a.créerSprite(300,40)
a.créerSprite(400,40)
a.créerSprite(500,40)
a.créerSprite(600,40)
b = new Sprite('female')
b.siRencontre(a, ramasser)
b.avancerToujours()`

export { resources, code }
