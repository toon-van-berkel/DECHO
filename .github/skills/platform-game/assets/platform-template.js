import { Actor, Vector, CollisionType } from "excalibur"
import { Resources } from './resources.js'

export class Platform extends Actor {
    constructor(x, y, width, height) {
        super({
            width: width,
            height: height,
            collisionType: CollisionType.Fixed
        })
        this.pos = new Vector(x, y)
    }

    onInitialize(engine) {
        this.graphics.use(Resources.Platform.toSprite())
    }
}
