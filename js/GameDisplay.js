function GameDisplay(x, y, task_flag){
    var width = 265,
        height = task_flag ? 70 : 40,
        posX = x,
        posY = y,
        
        victory_flag = false,
        
        Task = {
            flag: task_flag,
            value: 0
        },
        
        TimeData = {
            current: 0,
            then: Date.now(),
            now: 0,
            limit: 0,
            sec: 0,
            text: "",
            stopped: false
        };
        
        
        
    this.setTask = function(task_size){
        if (!Task.flag) return;
        
        var step = task_size;
        switch (task_size) {
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
        
        Task.value = min + step * Math.floor(Math.random() * 10);
    };
        
        
        
    this.getTask = function(){ return Task.value; };
    
    
    
    this.setTimer = function(t){
        if (t === 0) TimeData.text = "PROTEKLO VRIJEME:  ";
        else {
            TimeData.text = "PREOSTALO VREMENA:  ";
            TimeData.limit = t * 60 * 1000;
        }
    };
    
    
    
    this. updateTime = function(){
        if (TimeData.limit !== 0 && TimeData.stopped) return false;
        
        TimeData.now = Date.now();
        TimeData.current += TimeData.now - TimeData.then;
        TimeData.then = TimeData.now;
        
        // return true if time ran out
        if (TimeData.limit !== 0 && TimeData.current >= TimeData.limit) return true;
        else return false;
    };
    
    
    
    this.timeChanged = function(){
        if (TimeData.limit !== 0 && TimeData.stopped) return false;
        
        // returns true if a second passed
        if (TimeData.current - TimeData.sec >= 1000) {
            TimeData.sec += 1000;
            return true;
        }
        else return false;
    };
    
    
    
    this.stop = function(){
        if (TimeData.limit !== 0) TimeData.stopped = true;
    };
    
    
    
    this.victory = function(){ victory_flag = true; };
    
    
    
    this.move = function(dx, dy){
        posX += dx;
        posY += dy;
    };
    
    
    
    this.draw = function(Drawing){
        var temp = [
            Drawing.fillStyle,
            Drawing.textAlign,
            Drawing.font
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
        
        // time text
        var time = TimeData.limit===0 ? TimeData.current : TimeData.limit - TimeData.current,
            minutes = Math.floor( (time/1000) / 60 ),
            seconds = TimeData.limit===0 ? Math.floor( (time/1000) ) % 60 :
                                           Math.ceil( (time/1000) ) % 60;
        if (minutes < 0) minutes = 0;
        if (seconds < 0) seconds = 0;
        
        Drawing.font = "16px Century Gothic";
        Drawing.textAlign = "left";
        
        // victory
        if (victory_flag) {
            Drawing.fillStyle = "black";
            Drawing.fillText("POSTIGNUTA MAGIJA!", posX + 15, posY + 25);
        }
        // countdown
        else if (TimeData.limit !== 0) {
            if (minutes < 5 && minutes > 0) Drawing.fillStyle = "orange";
            else if (minutes < 1) Drawing.fillStyle = "red";
            else Drawing.fillStyle = "black";
            
            if (minutes > 0 || seconds > 0)
                Drawing.fillText(TimeData.text + 
                ( minutes<10 ? "0"+minutes : minutes ) + ":" + ( seconds<10 ? "0"+seconds : seconds ),
                posX + 15, posY + 25);
            else Drawing.fillText("VRIJEME ISTEKLO!", posX + 15, posY + 25);
        }
        // time elapsed
        else {
            Drawing.fillStyle = "black";
            Drawing.fillText(TimeData.text + 
                ( minutes<10 ? "0"+minutes : minutes ) + ":" + ( seconds<10 ? "0"+seconds : seconds ),
                posX + 15, posY + 25);
        }
            
        // task text
        if (Task.flag) {
            Drawing.fillStyle = "black";
            Drawing.fillText("TRAŽENI ZBROJ:  " + Task.value, posX + 15, posY + 55);
        }
                
        
        Drawing.fillStyle = temp[0];
        Drawing.textAlign = temp[1];
        Drawing.font = temp[2];
    };
}