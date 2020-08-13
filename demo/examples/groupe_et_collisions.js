const resources = {
  note: ['image', 'banknote.png'],
}

const code = `billets = 5
function ramasser(qui, billet) {
	billet.supprimer()
	billets--
	if (billets == 0) {
		qui.arrêter()
	}
}
a = new GroupeSprites('note')
a.créerSprite(200,10)
a.créerSprite(300,10)
a.créerSprite(400,10)
a.créerSprite(500,10)
a.créerSprite(600,10)
b = new Sprite()
b.siRencontre(a, ramasser)
b.avancerToujours()`

export { resources, code }
