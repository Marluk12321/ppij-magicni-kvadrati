function MenuContainer(x, y, w, h){
    var width = w,
        height = h,
        posX = x - width/2,
        posY = y,
        
        speed = 0.8,
        MoveDestination = {
            X: posX,
            Y: posY
        },
        
        Clickables = [],
        nonClickables = [];



    this.getPosX = function(){ return posX; };
    this.getPosY = function(){ return posY; };
    this.getWidth = function(){ return width; };
    this.getHeight = function(){ return height; };
    
    
    
    this.addClickable = function(element){
        element.move(posX, posY);
        Clickables.push(element);
    };
    
    
    
    this.addNonClickable = function(element){
        element.move(posX, posY);
        nonClickables.push(element);
    };
    
    
    
    this.mouseAt = function(mouseX, mouseY){
        var state_changed = false;
        
        for (var i in Clickables) 
            if (Clickables[i].mouseAt(mouseX, mouseY))
                state_changed = true;
        
        // true if any element changed color
        return state_changed;
    };
    
    
    
    this.setInactive = function(){
        for (var i in Clickables) Clickables[i].setInactive();
    };

    
    
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
        
        // move inner elements
        for (var i in Clickables) Clickables[i].move(dx, dy);
        for (var i in nonClickables) nonClickables[i].move(dx, dy);
        
        return false;
    };
    
    
    
    this.setMoveDestination = function(x, y){
        MoveDestination.X = x;
        MoveDestination.Y = y;
    };
    
    
    
    this.placeLeft = function(){
        for (var i in Clickables) Clickables[i].move(-posX -2 * width, 0);
        for (var i in nonClickables) nonClickables[i].move(-posX -2 * width, 0);
        posX = -2 * width;
    };
    
    this.placeRight = function(window_w){
        for (var i in Clickables) Clickables[i].move(window_w - posX + width, 0);
        for (var i in nonClickables) nonClickables[i].move(window_w - posX + width, 0);
        posX = window_w + width;
    };
    
    this.placeDown = function(window_h){
        for (var i in Clickables) Clickables[i].move(0, window_h - posY + height);
        for (var i in nonClickables) nonClickables[i].move(0, window_h - posY + height);
        posY = window_h + height;
    };
    
    
    
    this.clicked = function(mouseX, mouseY){
        for (var i in Clickables)
            Clickables[i].clicked(mouseX, mouseY);
    };
    
    
    
    this.draw = function(Drawing){
        var temp = [
            Drawing.fillStyle
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
        
        // inner elements
        for (var i in Clickables) Clickables[i].draw(Drawing);
        for (var i in nonClickables) nonClickables[i].draw(Drawing);
        
        
        Drawing.fillStyle = temp[0];
    };
}