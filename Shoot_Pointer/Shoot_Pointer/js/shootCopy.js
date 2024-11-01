EnemyTank = function (index, game, sprite, bullets) {
    var x = game.world.randomX;
    var y = game.world.randomY;
    this.game = game;
    this.health = 3;
    this.sprite = sprite;
    this.bullets = bullets;
    this.fireRate = 150;
    this.nextFire = 0;
    this.alive = true;
    
    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
};

EnemyTank.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();

        return true;
    }

    return false;

}

EnemyTank.prototype.update = function() {

    this.shadow.x = 
    this.tank.x;
    this.shadow.y = 
    this.tank.y;
    this.shadow.rotation = 
    this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = 
    this.game.physics.arcade.angleBetween(this.tank, this.sprite);

    if (this.game.physics.arcade.distanceBetween(this.tank, this.sprite) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.tank.x, this.tank.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.sprite, 500);
        }
    }

};

    var game = new Phaser.Game(800,600,Phaser.AUTO,null,{ preload: preload, create: create, update: update, render: render });
    var sprite;
    var bullets;
    

    var fireRate = 150;
    var nextFire = 0;


    function preload() {

        game.load.image('mapa', 'img/bg1.png');
        game.load.image('tank', 'img/tanks.png', 'img/tanks.json');
        game.load.image('enemy', 'img/enemy-tanks.png', 'img/tanks.json');
        game.load.image('glob', 'img/glob.png');
        game.load.image('player', 'assets/sprites/mussum.png');
        game.load.image('bullet', 'assets/sprites/cacilds.png');
        game.load.spritesheet('kaboom', 'img/explosion.png', 64, 64, 23);
    
}

var mundo;
var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;


    function create() {

        game.world.setBounds(-1000, -1000, 2000, 2000);  
        mundo = game.add.tileSprite(0, 0, 800, 600, 'mapa');
        mundo.fixedToCamera = true;
        
        //game.add.sprite(0, 0, 'mapa');
        //game.add.sprite(0, 0, 'player');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //game.stage.backgroundColor = '#313131';

        /*
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
    
        sprite = game.add.sprite(400, 300, 'player');
        sprite.anchor.set(0.5, 0.5);
        */

        //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

        

        
        game.physics.enable(sprite, Phaser.Physics.ARCADE);

        sprite.body.maxAngular = 500;
        sprite.body.angularDrag = 50;

        sprite.body.allowRotation = false;

        //  The enemies bullet group NOVOOOOO 
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(100, 'glob');
    
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 0.5);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  Create some baddies to waste :) NOVOOOO
        enemies = [];

        enemiesTotal = 20;
        enemiesAlive = 20;

        for (var i = 0; i < enemiesTotal; i++)
        {
            enemies.push(new EnemyTank(i, game, tank, enemyBullets));
        }

        //  A shadow below our tank
        shadow = game.add.sprite(0, 0, 'tank', 'shadow');
        shadow.anchor.setTo(0.5, 0.5);
        tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

         //  Explosion pool NOVOOOO
        explosions = game.add.group();

        for (var i = 0; i < 10; i++)
        {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }

        tank.bringToTop();
        turret.bringToTop();

        //manten camera no player
        game.camera.follow(sprite);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);


}

    function update() {
        //linha nova
        game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
        //linha nova
        enemiesAlive = 0;
        //codigo novo
        for (var i = 0; i < enemies.length; i++)
        {
            if (enemies[i].alive)
            {
                enemiesAlive++;
                game.physics.arcade.collide(sprite, enemies[i].sprite);
                game.physics.arcade.overlap(bullets, enemies[i].sprite, bulletHitEnemy, null, this);
                enemies[i].update();
            }
        }

        mundo.tilePosition.x = -game.camera.x;
        mundo.tilePosition.y = -game.camera.y;

        //  Position all the parts and align rotations NOVOOOO
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    //if (game.input.activePointer.isDown)
    //{
        //  Boom!
      //  fire();
    //}

        sprite.body.angularAcceleration = 0;

                
        sprite.rotation = game.physics.arcade.angleToPointer(sprite);
        sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 850);

        if (game.input.activePointer.isDown)
        {
            fire();
        }

}
//função nova
function bulletHitPlayer (sprite, glob) {

    glob.kill();

}
//função nova
function bulletHitEnemy (tank, bullet) {

    bullet.kill();

    var destroyed = enemies[tank.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(tank.x, tank.y);
        explosionAnimation.play('kaboom', 30, false, true);
    }

}

    function fire() {

        if (game.time.now > nextFire && bullets.countDead() > 0)
        {
            nextFire = game.time.now + fireRate;

            var bullet = bullets.getFirstDead();

            bullet.reset(sprite.x - 8, sprite.y - 8);

            game.physics.arcade.moveToPointer(bullet, 500);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}

    function render() {

        game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 8, 10);
        //game.debug.spriteInfo(sprite, 12, 500);

}
//}());
