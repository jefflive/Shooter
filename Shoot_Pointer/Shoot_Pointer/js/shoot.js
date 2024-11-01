EnemyZumbi = function (index, game, sprite, bullets) {
    var x = game.world.randomX;
    var y = game.world.randomY;
    this.game = game;
    this.health = 3;
    this.sprite = sprite;
    this.bullets = bullets;
    this.fireRate = 150;
    this.nextFire = 0;
    this.alive = true;
    
    //this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.zumbi = game.add.sprite(x, y, 'enemy', 'zumbi');
    //this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    //this.shadow.anchor.set(0.5);
    this.zumbi.anchor.set(0.5);
    //this.turret.anchor.set(0.3, 0.5);

    this.zumbi.name = index.toString();
    game.physics.enable(this.zumbi, Phaser.Physics.ARCADE);
    this.zumbi.body.immovable = false;
    this.zumbi.body.collideWorldBounds = true;
    this.zumbi.body.bounce.setTo(2, 2);

    this.zumbi.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.zumbi.rotation, 100, this.zumbi.body.velocity);
};

EnemyZumbi.prototype.damage = function() {

    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;

        //this.shadow.kill();
        this.zumbi.kill();
        //this.turret.kill();

        return true;
    }

    return false;

}

EnemyZumbi.prototype.update = function() {

    //this.shadow.x = 
    this.zumbi.x;
    //this.shadow.y = 
    this.zumbi.y;
    //this.shadow.rotation = 
    this.zumbi.rotation;

    //this.turret.x = this.tank.x;
    //this.turret.y = this.tank.y;
    //this.turret.rotation = 
    this.zumbi.rotation = this.game.physics.arcade.angleBetween(this.zumbi, this.sprite);

    if (this.game.physics.arcade.distanceBetween(this.zumbi, this.sprite) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.zumbi.x, this.zumbi.y);

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
        game.load.image('zumbi', 'img/zumbi1.png');
        game.load.image('enemy', 'img/zumbi1.png');
        game.load.image('glob', 'img/glob.png');
        game.load.image('player', 'assets/sprites/mussum.png');
        game.load.image('bullet', 'assets/sprites/cacilds.png');
        game.load.spritesheet('kaboom', 'img/explosion.png', 64, 64, 23);
    
}

var mundo;
//var shadow;
var zumbi;
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

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(80, 'bullet', 0, false);
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
    
        sprite = game.add.sprite(400, 300, 'player');
        sprite.anchor.set(0.5, 0.5);

        

        
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

        enemiesTotal = 5;
        enemiesAlive = 5;

        for (var i = 0; i < enemiesTotal; i++)
        {
            enemies.push(new EnemyZumbi(i, game, zumbi, enemyBullets));
        }

        //  A shadow below our tank
        //shadow = game.add.sprite(0, 0, 'tank', 'shadow');
        //shadow.anchor.setTo(0.5, 0.5);
        //tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

         //  Explosion pool NOVOOOO
        explosions = game.add.group();

        for (var i = 0; i < 10; i++)
        {
            var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('kaboom');
        }

        //tank.bringToTop();
        //turret.bringToTop();

        //manten camera no player
        game.camera.follow(sprite);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);


}

    function update() {
        //linha nova
        game.physics.arcade.overlap(enemyBullets, zumbi, bulletHitPlayer, null, this);
        //linha nova
        enemiesAlive = 0;
        //codigo novo
        for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(zumbi, enemies[i].zumbi);
            game.physics.arcade.overlap(bullets, enemies[i].zumbi, bulletHitEnemy, null, this);
            enemies[i].update();
        }
    }

        if (game.physics.arcade.moveToPointer(sprite, 60))
        {
            zumbi.angle -= 4;
        }
        else if (cursors.right.isDown)
        {
            zumbi.angle += 4;
        }
    
        if (game.physics.arcade.moveToPointer(sprite, 60))
        {
            //  The speed we'll travel at
            currentSpeed = 300;
        }
        else
        {
            if (currentSpeed > 0)
            {
                currentSpeed -= 4;
            }
        }

        if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(zumbi.rotation, currentSpeed, zumbi.body.velocity);
    }

        mundo.tilePosition.x = -game.camera.x;
        mundo.tilePosition.y = -game.camera.y;

        //  Position all the parts and align rotations NOVOOOO
        zumbi.x;
        zumbi.y;
    //shadow.rotation = 
        zumbi.rotation;

    //turret.x = 
       // zumbi.x;
    //turret.y = 
        //zumbi.y;

        //zumbi.rotation = game.physics.arcade.angleToPointer(zumbi);

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
function bulletHitPlayer (glob) {

    glob.kill();

}
//função nova
function bulletHitEnemy (zumbi, bullet) {

    bullet.kill();

    var destroyed = enemies[zumbi.name].damage();

    if (destroyed)
    {
        var explosionAnimation = explosions.getFirstExists(false);
        explosionAnimation.reset(zumbi.x, zumbi.y);
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
