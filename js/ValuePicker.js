function ValuePicker(x, y){
    var posX = x,
        posY = y,
        width = 200,
        height = 60,
        
        Title = "",
        Value = {
            current: 0,
            min: 0,
            max: 0,
            step: 1
        },
        
        arrow = {
            width: 20,
            height: 20
        },
        arrowLeft = {
            x: 10,
            y: 30,
            color: "#0066FF"
        },
        arrowRight = {
            x: 170,
            y: 30,
            color: "#0066FF"
        },
                
        color = {
            normal: "#0066FF",
            mouseover: "#FF3300",
            inactive: "#888888"
        };


    
    this.setTitle = function(t){ Title = t; };
    
    this.setValue = function(v){
        Value.current = v;
        valueAtLimitCheck();
    };
    
    this.getValue = function(){ return Value.current; };
    
    this.setMinMaxStep = function(min, max, step){
        Value.min = min;
        Value.max = max;
        Value.step = step;
        valueAtLimitCheck();
    };
    
    
    
    var valueIncrease = function(){
        if (Value.current + Value.step <= Value.max) {
            Value.current += Value.step;
            valueAtLimitCheck();
        }
    };
    
    var valueDecrease = function(){
        if (Value.current - Value.step >= Value.min) {
            Value.current -= Value.step;
            valueAtLimitCheck();
        }
    };
    
    
    
    var valueAtLimitCheck = function(){
        if (Value.current < Value.min + Value.step) arrowLeft.color = color.inactive;
        else arrowLeft.color = color.normal;
        if (Value.current > Value.max - Value.step) arrowRight.color = color.inactive;
        else arrowRight.color = color.normal;
    };
    
    
    
    this.mouseAt = function(mouseX, mouseY){
        var state_changed = false;
        
        // left arrow
        if (mouseX > posX+arrowLeft.x && mouseX < posX+arrowLeft.x+arrow.width &&
            mouseY > posY+arrowLeft.y && mouseY < posY+arrowLeft.y+arrow.height) {
                if (arrowLeft.color === color.normal) {
                    state_changed = true;
                    arrowLeft.color = color.mouseover;
                }
            }
        else {
            if (arrowLeft.color === color.mouseover) {
                state_changed = true;
                arrowLeft.color = color.normal;
            }
        }
        
        // right arrow
        if (mouseX > posX+arrowRight.x && mouseX < posX+arrowRight.x+arrow.width &&
            mouseY > posY+arrowRight.y && mouseY < posY+arrowRight.y+arrow.height) {
                if (arrowRight.color === color.normal) {
                    state_changed = true;
                    arrowRight.color = color.mouseover;
                }
            }
        else {
            if (arrowRight.color === color.mouseover) {
                state_changed = true;
                arrowRight.color = color.normal;
            }
        }
        
        // true if color changed
        return state_changed;
    };
    
    
    
    var clickAction = function(){};
    
    this.setClickAction = function(func){ clickAction = func; };
    
    
    
    this.clicked = function(mouseX, mouseY){
        if (mouseX > posX+arrowLeft.x && mouseX < posX+arrowLeft.x+arrow.width &&
            mouseY > posY+arrowLeft.y && mouseY < posY+arrowLeft.y+arrow.height) {
                valueDecrease();
                clickAction();
        }
            
        if (mouseX > posX+arrowRight.x && mouseX < posX+arrowRight.x+arrow.width &&
            mouseY > posY+arrowRight.y && mouseY < posY+arrowRight.y+arrow.height) {
                valueIncrease();
                clickAction();
        }
    };
    
    
    
    this.setInactive = function(){
        arrowLeft.color = color.normal;
        arrowRight.color = color.normal;
        valueAtLimitCheck();
    };
    
    
    
    this.move = function(dx, dy){
        posX += dx;
        posY += dy;
    };
    
    
    
    this.draw = function(Drawing){
        var temp = [
            Drawing.fillStyle,
            Drawing.textAlign,
            Drawing.font,
            Drawing.lineWidth
        ];
        
        
        // background
        Drawing.fillStyle = "#FCFCFC";
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
        
        // title
        Drawing.font = "16px Century Gothic";
        Drawing.textAlign = "center";
        Drawing.fillStyle = "black";
        Drawing.fillText(Title, posX + width/2, posY + 20);
        // value
        if (Value.current === 0) Drawing.fillText("Neograniceno", posX + width/2, posY + 45);
        else Drawing.fillText(Value.current, posX + width/2, posY + 45);
        
        // left arrow
        Drawing.fillStyle = "#EEEEEE";
        Drawing.fillRect(posX + arrowLeft.x, posY + arrowLeft.y, arrow.width, arrow.height);
        Drawing.fillStyle = arrowLeft.color;
        Drawing.beginPath();
        Drawing.moveTo(posX + arrowLeft.x + arrow.width - 3, posY + arrowLeft.y + 3);
        Drawing.lineTo(posX + arrowLeft.x + arrow.width - 3, posY + arrowLeft.y + arrow.height - 3);
        Drawing.lineTo(posX + arrowLeft.x + 3, posY + arrowLeft.y + arrow.height/2);
        Drawing.closePath();
        Drawing.fill();
        
        // right arrow
        Drawing.fillStyle = "#EEEEEE";
        Drawing.fillRect(posX + arrowRight.x, posY + arrowRight.y, arrow.width, arrow.height);
        Drawing.fillStyle = arrowRight.color;
        Drawing.beginPath();
        Drawing.moveTo(posX + arrowRight.x + 3, posY + arrowRight.y + 3);
        Drawing.lineTo(posX + arrowRight.x + 3, posY + arrowRight.y + arrow.height - 3);
        Drawing.lineTo(posX + arrowRight.x + arrow.width - 3, posY + arrowRight.y + arrow.height/2);
        Drawing.closePath();
        Drawing.fill();
        
        
        Drawing.fillStyle = temp[0];
        Drawing.textAlign = temp[1];
        Drawing.font = temp[2];
        Drawing.lineWidth = temp[3];
    };
}