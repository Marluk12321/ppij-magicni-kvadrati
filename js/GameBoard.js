function GameBoard(x, y){
    var width = 200,
        height = 200,
        posX = x,
        posY = y,
        
        Flags = {
            started: false,
            sums: false,
            inactive: false,
            deselectable: true,
            duplicates: false
        },
                
        GameArray = [],
        SumsArray = [],
        
        Task = 0,
        saved_value,
        
        color = {
            correct: "green",
            wrong: "orange",
            
            normal: "#F0F0F0",
            locked: "white",
            in_use: "#FFFF99",
            
            normal_edge: "#0066FF",
            mouse_edge: "#FF3300",
            locked_edge: "black"
        },
                
        BasicSolutions = {
            3: [4, 9, 2,
                3, 5, 7,
                8, 1, 6],
            
            4: [4, 14, 15, 1,
                9, 7, 6, 12,
                5, 11, 10, 8,
                16, 2, 3, 13],
            
            5: [11, 24, 7 ,20, 13,
                4, 12, 25, 8, 16,
                17, 5, 13, 21, 9,
                10, 18, 1, 14, 22,
                23, 6, 19, 2, 15]
        };
 
    

    this.setSize = function(size){
        width = height = size * 35 + 100;
        
        // init game array
        for (var i = 0; i < size; i++){
            var temp_arr = [];
            for (var j = 0; j < size; j++) 
                temp_arr.push({
                    value: "", color: color.normal, edge: color.normal_edge,
                    x: posX + 55 + j*35, y: posY + 55 + i*35, size: 30
                });
            GameArray.push(temp_arr);
        }
        
        // init sums array
        for (var i = 0; i < 2*size+2; i++){
            SumsArray.push({
                value: 0, color: color.locked, edge: color.locked_edge,
                complete: false, size: 30
            });
        }
    };
    
    
    
    this.setStarted = function(started_flag){
        Flags.started = started_flag;
        if (!started_flag) return;
        
        // calculate solution
        var size = GameArray.length;
        
        var diff;
        if (Task !== 0){
            switch (size) {
                case 3:
                    var min = 15;
                    break;
                case 4:
                    var min = 34;
                    break;
                case 5:
                    var min = 65;
                    break;
            }
            
            diff = (Task - min) / size;
        }
        else diff = Math.floor(Math.random() * 10);
        
        // set solution
        for (var i in BasicSolutions[""+size]) BasicSolutions[""+size][i] += diff;
        
        // choose cells
        var cells = [];
        do {
            var c = Math.floor(Math.random() * size*size);
            if (cells.indexOf(c) === -1) cells.push(c);
        } while (cells.length < 4*size - 9) // how many solved cells
        
        // fill cells
        for (var c in cells) {
            var i = Math.floor(cells[c] / size);
            var j = cells[c] % size;
            GameArray[i][j].value = BasicSolutions[""+size][cells[c]];
            GameArray[i][j].color = color.locked;
            GameArray[i][j].edge = color.locked_edge;
        }
        
        this.updateSums();
    };
    
    
    
    this.setSums = function(sums_flag){
        Flags.sums = sums_flag;
    };
    
    
    this.setTask = function(task_value){ Task = task_value; };
    
    
    
    this.setNotDelesectable = function(){ Flags.deselectable = false; };
    
    
    
    this.updateSums = function(){
        // clear
        for (var i in SumsArray){
            SumsArray[i].value = 0;
            SumsArray[i].complete = true;
        }
        
        // rows [0 - size-1]
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++) {
                var val = process(GameArray[i][j].value);
                if (val === 0) SumsArray[i].complete = false;
                SumsArray[i].value += val;
            }
        
        // columns [size - 2*size-1]
        for (var j = 0; j < GameArray[0].length; j++)
            for (var i = 0; i < GameArray.length; i++) {
                var val = process(GameArray[j][i].value);
                if (val === 0) SumsArray[i + GameArray[0].length].complete = false;
                SumsArray[i + GameArray[0].length].value += val;
            }
        
        // diagonal 1 [2*size]
        for (var i = 0; i < GameArray.length; i++) {
            var val = process(GameArray[i][i].value);
            if (val === 0) SumsArray[2*GameArray[0].length].complete = false;
            SumsArray[2*GameArray[0].length].value += val;
        }
        
        // diagonal 2 [2*size+1]
        for (var i = 0; i < GameArray.length; i++) {
            var val = process(GameArray[GameArray.length-1 - i][i].value);
            if (val === 0) SumsArray[2*GameArray[0].length + 1].complete = false;
            SumsArray[2*GameArray[0].length + 1].value += val;
        }
        
        // check for task win
        if (Task !== 0) {
            var failed = false;
            for (var i in SumsArray) {
                if (SumsArray[i].value !== Task){
                    SumsArray[i].color = color.wrong;
                    failed = true;
                }
                else SumsArray[i].color = color.correct;
                if (!SumsArray[i].complete)
                    SumsArray[i].color = color.normal;
                    failed = true;
            }
            if (!failed){
                this.setInactive();
                return !Flags.duplicates; // no win if duplicates
            }
        }
        
        // check for normal win
        for (var i in SumsArray) if (!SumsArray[i].complete) return false;
        var aim = SumsArray[0].value;
        for (var i in SumsArray) if (SumsArray[i].value !== aim) return false;
        
        for (var i in SumsArray) SumsArray[i].color = color.correct;
        this.setInactive();
        return true;
    };
    
    var process = function(val){
        if (val === "") return 0;
        else return val;
    };
    
    
    
    this.checkDuplicates = function(){
        // reset
        Flags.duplicates = false;
        for (var i in GameArray)
            for (var j in GameArray[i])
                if (GameArray[i][j].color !== color.in_use) {
                    if (GameArray[i][j].edge === color.normal_edge)
                        GameArray[i][j].color = color.normal;
                    if (GameArray[i][j].edge === color.locked_edge)
                        GameArray[i][j].color = color.locked;
                }
        
        // search
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++)
                for (var k = 0; k < GameArray.length; k++)
                    for (var l = 0; l < GameArray[k].length; l++)
                        if ( !(i === k && j === l) &&
                            GameArray[i][j].value === GameArray[k][l].value &&
                            GameArray[i][j].value !== "" && GameArray[i][j].value !== 0) {
                                Flags.duplicates = true;
                                if (GameArray[i][j].color !== color.in_use)
                                    GameArray[i][j].color = color.wrong;
                                if (GameArray[k][l].color !== color.in_use)
                                    GameArray[k][l].color = color.wrong;
                        }
    };



    var selectAction = function(){};
    
    this.setSelectAction = function(func){ selectAction = func; };
    
    var deselectAction = function(){};
    
    this.setDeselectAction = function(func){ deselectAction = func; };
    
    
    
    this.mouseAt = function(mouseX, mouseY){
        if (Flags.inactive) return false;
        
        var state_changed = false;
        
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++)
                if (mouseX > GameArray[i][j].x && mouseX < GameArray[i][j].x+GameArray[i][j].size &&
                    mouseY > GameArray[i][j].y && mouseY < GameArray[i][j].y+GameArray[i][j].size ) {
                    if (GameArray[i][j].edge === color.normal_edge) {
                        GameArray[i][j].edge = color.mouse_edge;
                        state_changed = true;
                    }
                }
                else if (GameArray[i][j].edge === color.mouse_edge) {
                    GameArray[i][j].edge = color.normal_edge;
                    state_changed = true;
                }
                        
        
        // true if color changed
        return state_changed;
    };
    
    
    
    this.clicked = function(mouseX, mouseY){
        if (Flags.inactive) return;
        
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++)
                if (mouseX > GameArray[i][j].x && mouseX < GameArray[i][j].x+GameArray[i][j].size &&
                    mouseY > GameArray[i][j].y && mouseY < GameArray[i][j].y+GameArray[i][j].size ) {
                    
                    if (GameArray[i][j].color === color.normal || GameArray[i][j].color === color.wrong) {
                        // deselect other cells
                        for (var k = 0; k < GameArray.length; k++)
                            for (var l = 0; l < GameArray[k].length; l++)
                                if (GameArray[k][l].color === color.in_use) GameArray[k][l].color = color.normal;
                        
                        this.checkDuplicates();
                        
                        // select current cell
                        GameArray[i][j].color = color.in_use;
                        saved_value = GameArray[i][j].value;
                        selectAction();
                    }
                }
                else if (GameArray[i][j].color === color.in_use && Flags.deselectable) {
                    GameArray[i][j].color = color.normal;
                    this.checkDuplicates();
                    deselectAction();
                }
        
        Flags.deselectable = true;
    };
    
    
    
    this.sendKey = function(key){
        if (key === -1) return false;
        
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++)
                if (GameArray[i][j].color === color.in_use) {
                    if (key === 10) GameArray[i][j].value = ""; // del
                    else if (GameArray[i][j].value === saved_value || GameArray[i][j].value >= 10) {
                        GameArray[i][j].value = key;
                        saved_value = "";
                    }
                    else GameArray[i][j].value = 10*GameArray[i][j].value + key;
                    
                    if (GameArray[i][j].value === 0) GameArray[i][j].value = "";
                    return true;
                }
        
        return false;
    };
    
    
    
    this.setInactive = function(){
        Flags.inactive = true;
        
        // set all inactive colors
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++) {
                if (GameArray[i][j].color === color.in_use)
                    GameArray[i][j].color = color.normal;
                if (GameArray[i][j].edge === color.mouse_edge)
                    GameArray[i][j].edge = color.normal_edge;
            }
    };
    
    
    
    this.move = function(dx, dy){
        posX += dx;
        posY += dy;
        
        // move array
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++) {
                GameArray[i][j].x += dx;
                GameArray[i][j].y += dy;
            }
    };
    
    
    
    this.draw = function(Drawing){
        var temp = [
            Drawing.fillStyle,
            Drawing.textAlign,
            Drawing.font,
            Drawing.lineWidth
        ];
        
        
        // background
        Drawing.fillStyle = "#F8F8F8";
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
        
        // main array
        Drawing.lineWidth = 3;
        Drawing.font = "20px Century Gothic";
        Drawing.textAlign = "center";
        for (var i = 0; i < GameArray.length; i++)
            for (var j = 0; j < GameArray[i].length; j++){
                Drawing.fillStyle = GameArray[i][j].color;
                Drawing.strokeStyle = GameArray[i][j].edge;
                Drawing.beginPath();
                Drawing.rect(GameArray[i][j].x, GameArray[i][j].y,
                             GameArray[i][j].size, GameArray[i][j].size);
                Drawing.closePath();
                Drawing.fill();
                Drawing.stroke();
                Drawing.fillStyle = "black";
                Drawing.fillText(GameArray[i][j].value,
                    GameArray[i][j].x + GameArray[i][j].size/2,
                    GameArray[i][j].y + 3*GameArray[i][j].size/4);
            }        
        
        // sums array
        if (Flags.sums) {
            // rows
            for (var i = 0; i < GameArray.length; i++) {
                Drawing.fillStyle = SumsArray[i].color;
                Drawing.strokeStyle = SumsArray[i].edge;
                Drawing.beginPath();
                Drawing.rect(posX + 60 + 35*GameArray.length,
                             posY + 55 + i*35,
                             SumsArray[i].size, SumsArray[i].size);
                Drawing.closePath();
                Drawing.fill();
                Drawing.stroke();
                Drawing.fillStyle = "black";
                Drawing.fillText(SumsArray[i].value,
                    posX + 75 + 35*GameArray.length,
                    posY + 78 + i*35);
            }
            
            // columns
            for (var i = 0; i < GameArray.length; i++) {
                Drawing.fillStyle = SumsArray[i + GameArray.length].color;
                Drawing.strokeStyle = SumsArray[i + GameArray.length].edge;
                Drawing.beginPath();
                Drawing.rect(posX + 55 + i*35,
                             posY + 60 + 35*GameArray.length,
                             SumsArray[i].size, SumsArray[i].size);
                Drawing.closePath();
                Drawing.fill();
                Drawing.stroke();
                Drawing.fillStyle = "black";
                Drawing.fillText(SumsArray[i + GameArray.length].value,
                    posX + 70 + i*35,
                    posY + 83 + 35*GameArray.length);
            }
            
            // diagonal 1
            Drawing.fillStyle = SumsArray[i + GameArray.length].color;
            Drawing.strokeStyle = SumsArray[i + GameArray.length].edge;
            Drawing.beginPath();
            Drawing.rect(posX + 60 + 35*GameArray.length,
                         posY + 60 + 35*GameArray.length,
                         SumsArray[i].size, SumsArray[i].size);
            Drawing.closePath();
            Drawing.fill();
            Drawing.stroke();
            Drawing.fillStyle = "black";
            Drawing.fillText(SumsArray[i + GameArray.length].value,
                posX + 75 + 35*GameArray.length,
                posY + 83 + 35*GameArray.length);
                
            // diagonal 2
            Drawing.fillStyle = SumsArray[i + GameArray.length + 1].color;
            Drawing.strokeStyle = SumsArray[i + GameArray.length + 1].edge;
            Drawing.beginPath();
            Drawing.rect(posX + 15,
                         posY + 60 + 35*GameArray.length,
                         SumsArray[i].size, SumsArray[i].size);
            Drawing.closePath();
            Drawing.fill();
            Drawing.stroke();
            Drawing.fillStyle = "black";
            Drawing.fillText(SumsArray[i + GameArray.length + 1].value,
                posX + 15 + SumsArray[i + GameArray.length + 1].size/2,
                posY + 83 + 35*GameArray.length);
        }
        
        
        Drawing.fillStyle = temp[0];
        Drawing.textAlign = temp[1];
        Drawing.font = temp[2];
        Drawing.lineWidth = temp[3];
    };
};