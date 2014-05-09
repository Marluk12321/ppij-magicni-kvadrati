function Checkbox(x, y){
    var posX = x,
        posY = y,
        width = 20,
        height = 20,
        
        Value = false,
        color = {
            normal: "#0066FF",
            mouseover: "#FF3300"
        },
                
        mouseoverFlag = false;
        
    
    
    this.getValue = function(){ return Value; };
    
    this.toggleValue = function(){ Value = !Value; };
    
    
    
    this.mouseAt = function(mouseX, mouseY){
        var state_changed = false;
        
        if (mouseX > posX && mouseX < posX+width &&
            mouseY > posY && mouseY < posY+height) {
                if (!mouseoverFlag) state_changed = true;
                mouseoverFlag = true;
            }
        else {
            if (mouseoverFlag) state_changed = true;
            mouseoverFlag = false;
        }
        
        // true if color changed
        return state_changed;
    };
    
    
    
    this.clicked = function(mouseX, mouseY) {
        if (mouseX > posX && mouseX < posX+width &&
            mouseY > posY && mouseY < posY+height) {
                Value = ! Value;
                clickAction();
        }
    };
    
    
    
    var clickAction = function(){};
    
    this.setClickAction = function(func){ clickAction = func; };
    
    
    
    this.setInactive = function(){ mouseoverFlag = false; };
    
    
    
    this.move = function(dx, dy){
        posX += dx;
        posY += dy;
    };
    
    
    
    this.draw = function(Drawing){
        var temp = [
            Drawing.fillStyle,
            Drawing.strokeStyle,
            Drawing.lineWidth
        ];
        
        
        // background
        Drawing.fillStyle = "white";
        var radius = 3;
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
        
        // cross
        Drawing.lineWidth = 3;
        if (Value) {
            Drawing.strokeStyle = "black";
            Drawing.beginPath();
            Drawing.moveTo(posX + 5, posY + 5);
            Drawing.lineTo(posX + width - 5, posY + height - 5);
            Drawing.moveTo(posX + width - 5, posY + 5);
            Drawing.lineTo(posX + 5, posY + height - 5);
            Drawing.closePath();
            Drawing.stroke();
        }
        
        // edge
        Drawing.strokeStyle = mouseoverFlag ? color.mouseover : color.normal;
        var radius = 3;
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
        Drawing.stroke();
        
        
        Drawing.fillStyle = temp[0];
        Drawing.strokeStyle = temp[1];
        Drawing.lineWidth = temp[2];
    };
}