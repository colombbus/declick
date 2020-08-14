const description =
  "Montre comment utiliser l'objet GroupeSprites en mode 'pool' (ici 10 éléments d'une durée de vie de 3 secondes) pour gérer des tirs. Flèches droite et gauche pour avancer, haut pour sauter, espace pour tirer."

const resources = {
  fireball: ['image', 'fireball.png'],
  female: ['spritesheet', 'female.png', 'female.json'],
}

const code = `enAvant = true
function supprime(qui, balle) {
	qui.supprimer()
  	balle.supprimer()
}
function tir() {
	x = bob.récupérerX()
	y = bob.récupérerY()
	balle = balles.créerSprite(x+10,y+10)
	if (balle) {
		balle.définirVitesse(500)
		if (enAvant) {
			balle.avancerToujours()
		} else {
			balle.reculerToujours()
		}
	}
}
p = new Plateforme()
p.sélectionnerCouche("stars")
bob = new Promeneur()
bob.définirPosition(80,40)
bob.peutTomber()
bob.définirGravité(500)
bob.définirAmplitudeSaut(400)
bob.ajouterBloc(p)
méchant = new Promeneur('female')
méchant.définirPosition(600,250)
bob.ajouterBloc(méchant)
balles = new GroupeSprites("fireball", 10)
balles.définirDurée(3000)
méchant.siCollisionAvec(balles, supprime)
répéter() {
	if (clavier.nouvelAppui("haut")) {
		bob.sauter()
	}
	if (clavier.nouvelAppui("espace")) {
		tir()
	}
	if (clavier.droite) {
		enAvant = true
		bob.avancerToujours()
	}
	else if (clavier.gauche) {
		enAvant = false
		bob.reculerToujours()
	} else {
		bob.arrêter()
	}
}`

export { description, resources, code }
