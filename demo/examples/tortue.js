const resources = {
  pen: ['image', 'pen.png'],
}

const code = `t = new Tortue('pen')
t.tracer()
t.définirPositionTraceur(2, 72)
t.définirPosition(1, 0)
t.reculer()
t.descendre()
t.avancer()
t.reculer()
t.descendre()
t.avancer()
t.reculer()
t.descendre()
t.avancer()
t.avancer()
t.avancer()
t.monter()
t.nePasTracer()
t.avancer()
t.avancer()
t.tracer()
t.avancer()
t.descendre()
t.créerTexture('copy')
s = new Sprite('copy')
s.définirPosition(400, 100)
`
export { resources, code }
