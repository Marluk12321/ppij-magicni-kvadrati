function OptionsText(x, y){
    var posX = x,
        posY = y,
        width = 260,
        height = 145,
        
        text_lines = [
            "ZADAN TRAŽENI ZBROJ:",
            "ZAPOČETO RJEŠENJE:",
            "VREMENSKO OGRANIČENJE:",
            "PRIKAZ POMOĆNIH SUMA:"
        ];

    
    
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
        
        // text
        Drawing.font = "16px Century Gothic";
        Drawing.textAlign = "left";
        Drawing.fillStyle = "black";
        Drawing.fillText(text_lines[0], posX + 15, posY + 35);
        Drawing.fillText(text_lines[1], posX + 15, posY + 65);
        Drawing.fillText(text_lines[2], posX + 15, posY + 95);
        Drawing.fillText(text_lines[3], posX + 15, posY + 125);        
        
        
        Drawing.fillStyle = temp[0];
        Drawing.textAlign = temp[1];
        Drawing.font = temp[2];
        Drawing.lineWidth = temp[3];
    };
}