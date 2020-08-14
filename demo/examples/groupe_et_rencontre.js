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
a.créerSprite(200,10)
a.créerSprite(300,10)
a.créerSprite(400,10)
a.créerSprite(500,10)
a.créerSprite(600,10)
b = new Sprite('female')
b.siRencontre(a, ramasser)
b.avancerToujours()`

export { resources, code }
