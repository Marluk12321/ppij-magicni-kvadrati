function Title(x, y){
    var width = 420,
        height = 195,
        posX = x - width/2,
        posY = y,
        
        speed = 0.7,
        MoveDestination = {
            X: posX,
            Y: posY
        };
        
        
        
    this.getPosX = function(){ return posX; };
    this.getPosY = function(){ return posY; };
    this.getWidth = function(){ return width; };
    this.getHeight = function(){ return height; };
    this.getSpeed = function(){ return speed; };
    
    
    
    this.move = function(dt){
        if (posX === MoveDestination.X && posY === MoveDestination.Y)
            return true;
        
        var dx, dy;
        dx = dy = speed * dt;
        
        // distance calculation
        if ( Math.abs(MoveDestination.X - posX) < dx )
            dx = Math.abs(MoveDestination.X - posX);
        if ( Math.abs(MoveDestination.Y - posY) < dy )
            dy = Math.abs(MoveDestination.Y - posY);
        
        // direction calculation
        if (MoveDestination.X < posX) dx = -dx;
        if (MoveDestination.Y < posY) dy = -dy;
        
        // move self
        posX += dx;
        posY += dy;
        
        return false;
    };
    
    
    
    this.setMoveDestination = function(x, y){
        MoveDestination.X = x;
        MoveDestination.Y = y;
    };
    
    
    
    this.placeUp = function(){ posY = -3 * height; };    
    
    
    
    this.draw = function(Drawing){
        var temp = [
            Drawing.fillStyle,
            Drawing.strokeStyle,
            Drawing.textAlign,
            Drawing.font,
            Drawing.lineWidth
        ];
        
        
        // background
        Drawing.fillStyle = "#EEEEEE";
        var radius = 20;
        Drawing.beginPath();
        Drawing.moveTo(posX + radius, posY);
        Drawing.lineTo(posX + width -radius, posY);
        Drawing.arcTo(posX + width, posY, posX + width, posY + radius, radius);
        Drawing.lineTo(posX + width, posY + height - radius);
        Drawing.arcTo(posX + width, posY + height, posX + width - radius, posY + height, radius);
        Drawing.lineTo(posX + radius, posY + height);
        Drawing.arcTo(posX, posY + height, posX, posY + height - radius, radius);
        Drawing.lineTo(posX, posY + radius);
        Drawing.arcTo(posX, posY, posX + radius, posY, radius);
        Drawing.closePath();
        Drawing.fill();
        
        // text
        Drawing.font = "70px Century Gothic";
        Drawing.textAlign = "center";
        Drawing.fillStyle = "#FFFFFF";
        Drawing.strokeStyle = "#333333";
        Drawing.lineWidth = 2;
        Drawing.fillText("MAGIČNI", posX + width/2, posY + 85);
        Drawing.strokeText("MAGIČNI", posX + width/2, posY + 85);
        Drawing.fillText("KVADRATI", posX + width/2, posY + 165);
        Drawing.strokeText("KVADRATI", posX + width/2, posY + 165);
        
        
        Drawing.fillStyle = temp[0];
        Drawing.strokeStyle = temp[1];
        Drawing.textAlign = temp[2];
        Drawing.font = temp[3];
        Drawing.lineWidth = temp[4];
    };
}