function Button(x, y, w, h){
    var posX = x,
        posY = y,
        width = w,
        height = h,
        
        text = "",
        color = {
            normal: "#0066FF",
            mouseover: "#FF3300"
        },
        
        mouseoverFlag = false;


    
    this.setText = function(t){ text = t; };
    
    
    
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
            mouseY > posY && mouseY < posY+height)
                clickAction();
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
            Drawing.textAlign,
            Drawing.font
        ];
        
        // background
        Drawing.fillStyle = mouseoverFlag ? color.mouseover : color.normal;
        var radius = 5;
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
        Drawing.fillStyle = "white";
        Drawing.strokeStyle = "black";
        Drawing.textAlign = "center";
        Drawing.font = "16px Arial";
        Drawing.fillText(text, posX + width/2, posY + height/2 + 7);
        
        
        Drawing.fillStyle = temp[0];
        Drawing.strokeStyle = temp[1];
        Drawing.textAlign = temp[2];
        Drawing.font = temp[3];
    };
}