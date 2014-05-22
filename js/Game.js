function Game(){

// ********** "GLOBALS" **********

    var canvas,
        Drawing,
        WINDOW_WIDTH,
        WINDOW_HEIGHT,
        middle = {
            X: 0,
            Y: 0
        },
        
        KeyPressed,
        Mouse = {
            X: 0, Y: 0,
            moved: false,
            clicked: false
        },
                
        drawFlag,
        then,
        
        TitleSign,
        Menus = [],
        
        Display,
        Timer,
        QuitButton,
        Board,
        BoardContent,
        Keypad = {
            components: [],
            active: false,
            moving: false
        };
        
        STATE = {
            Current: -1,
            Startup: -1,
            Menu_0: 0,
            Menu_1: 1,
            Menu_2: 2,
            
            M1toM0: 3,
            M1toM2: 4,
            M0toM1_s: 5,
            M0toM1_c: 6,
            M2toM1: 7,
            
            M2toGAME: 8,
            Game: 9,
            GAMEtoM0: 10
        },
                
        GameFlags = {
            task: true,
            started: true,
            timed: true,
            sums: false
        },
        GameFlags_temp = {
            task: true,
            started: false,
            timed: true,
            sums: false,
            box1: null,
            box2: null,
            box3: null,
            box4: null
        },
        GameSettings = {
            square_size: 3,
            time_limit: 20,
            size_picker: null,
            time_picker: null
        };



// ********** SETUP **********

    this.init = function(){
        canvas = document.getElementById("canvas_id");
        WINDOW_WIDTH = canvas.width;
        WINDOW_HEIGHT = canvas.height;
        Drawing = canvas.getContext("2d"),
        drawFlag = false;
        middle = {
            X : WINDOW_WIDTH / 2,
            Y : WINDOW_HEIGHT / 2
        };
        
        setupEvents();
        setupMenuElements();
        setupStartingConditions();
        
        var temp = this;
        setInterval( function(){ return temp.mainLoop(); }, 1);
    };
    
    
    
    var setupEvents = function(){
        // keyboard events
        KeyPressed = -1;
        addEventListener("keydown",
                         function(e){
                             // numbers
                             if (e.keyCode >= 48 && e.keyCode <= 57)
                                 KeyPressed = e.keyCode - 48;
                             // numpad numbers
                             if (e.keyCode >= 96 && e.keyCode <= 105)
                                 KeyPressed = e.keyCode - 96;
                             // delete
                             if (e.keyCode === 46)
                                 KeyPressed = 10;
                         }
                         ,false);
                         
        // mouse events
        canvas.addEventListener("mousemove",
                                function(e){
                                    var can = canvas.getBoundingClientRect();
                                    Mouse.X = e.clientX - can.left;
                                    Mouse.Y = e.clientY - can.top;
                                    Mouse.moved = true;
                                }, false);
                                
        canvas.addEventListener("click",
                                function(e){
                                    Mouse.clicked = true;
                                }, false);
    };
    
    
    
    var setupStartingConditions = function(){
        STATE.Current = STATE.Startup;
        TitleSign.setMoveDestination(middle.X - TitleSign.getWidth()/2, middle.Y - 245);
        Menus[1].setMoveDestination(middle.X - Menus[1].getWidth()/2, middle.Y);
        then = Date.now();
    };
    
    
    
    var setupReturnConditions = function(){
        STATE.Current = STATE.GAMEtoM0;
        TitleSign.setMoveDestination(middle.X - TitleSign.getWidth()/2, middle.Y - 245);
        TitleSign.move(TitleSign.getHeight() / TitleSign.getSpeed());
        Menus[1].setMoveDestination(middle.X - Menus[1].getWidth()/2, middle.Y);
        then = Date.now();
    };
    
    
    
    var setupMenuElements = function(){
        // title
        TitleSign = new Title(middle.X, middle.Y - 245);
        TitleSign.placeUp();
        
        // menu 0
        Menus[0] = new MenuContainer(middle.X, middle.Y, 370, 250);
        
        var btn01 = new Button(25, 190, 150, 40);
        btn01.setText("SPREMI >");
        btn01.setClickAction(
            function(){Menus[STATE.Current].setInactive();
                    STATE.Current = STATE.M0toM1_s;
                    Menus[0].setMoveDestination(-2*Menus[1].getWidth(), middle.Y);
                    Menus[1].setMoveDestination(middle.X - Menus[1].getWidth()/2, middle.Y);}
        );
        Menus[0].addClickable(btn01);
        
        var btn02 = new Button(195, 190, 150, 40);
        btn02.setText("ODUSTANI >");
        btn02.setClickAction(
            function(){Menus[STATE.Current].setInactive();
                    STATE.Current = STATE.M0toM1_c;
                    Menus[0].setMoveDestination(-2*Menus[1].getWidth(), middle.Y);
                    Menus[1].setMoveDestination(middle.X - Menus[1].getWidth()/2, middle.Y);}
        );
        Menus[0].addClickable(btn02);
        
        Menus[0].addNonClickable( new OptionsText(25, 25) );
        
        var chkbox1 = new Checkbox(305, 45);
        chkbox1.setClickAction(
            function(){drawFlag = true;
                    GameFlags.task = chkbox1.getValue();}
        );
        if (chkbox1.getValue() !== GameFlags.task) chkbox1.toggleValue();
        GameFlags_temp.box1 = chkbox1;
        Menus[0].addClickable(chkbox1);
        
        var chkbox2 = new Checkbox(305, 75);
        chkbox2.setClickAction(
            function(){drawFlag = true;
                    GameFlags.started = chkbox2.getValue();}
        );
        if (chkbox2.getValue() !== GameFlags.started) chkbox2.toggleValue();
        GameFlags_temp.box2 = chkbox2;
        Menus[0].addClickable(chkbox2);
        
        var chkbox3 = new Checkbox(305, 105);
        chkbox3.setClickAction(
            function(){drawFlag = true;
                    GameFlags.timed = chkbox3.getValue();}
        );
        if (chkbox3.getValue() !== GameFlags.timed) chkbox3.toggleValue();
        GameFlags_temp.box3 = chkbox3;
        Menus[0].addClickable(chkbox3);
        
        var chkbox4 = new Checkbox(305, 135);
        chkbox4.setClickAction(
            function(){drawFlag = true;
                    GameFlags.sums = chkbox4.getValue();}
        );
        if (chkbox4.getValue() !== GameFlags.sums) chkbox4.toggleValue();
        GameFlags_temp.box4 = chkbox4;
        Menus[0].addClickable(chkbox4);
        
        Menus[0].placeLeft();
        
        
        // menu 1
        Menus[1] = new MenuContainer(middle.X, middle.Y, 250, 200);
        
        var btn11 = new Button(25, 25, 200, 80);
        btn11.setText("IGRAJ >");
        btn11.setClickAction(
            function(){Menus[STATE.Current].setInactive();
                    STATE.Current = STATE.M1toM2;
                    Menus[1].setMoveDestination(-2*Menus[1].getWidth(), middle.Y);
                    Menus[2].setMoveDestination(middle.X - Menus[2].getWidth()/2, middle.Y);}
        );
        Menus[1].addClickable(btn11);
        
        var btn12 = new Button(50, 125, 150, 50);
        btn12.setText("< POSTAVKE");
        btn12.setClickAction(
            function(){Menus[STATE.Current].setInactive();
                    STATE.Current = STATE.M1toM0;
                    Menus[1].setMoveDestination(WINDOW_WIDTH + Menus[1].getWidth(), middle.Y);
                    Menus[0].setMoveDestination(middle.X - Menus[0].getWidth()/2, middle.Y);}
        );
        Menus[1].addClickable(btn12);
        
        Menus[1].placeDown(WINDOW_HEIGHT);
        
        
        // menu 2
        Menus[2] = new MenuContainer(middle.X, middle.Y, 250, 290);
        
        var btn21 = new Button(25, 170, 200, 50);
        btn21.setText("START!");
        btn21.setClickAction(
            function(){Menus[STATE.Current].setInactive();
                    setupGameElements();
                    STATE.Current = STATE.M2toGAME;
                    TitleSign.setMoveDestination(TitleSign.getPosX(), -3 * TitleSign.getHeight());
                    Menus[2].setMoveDestination(Menus[2].getPosX(), WINDOW_HEIGHT + Menus[2].getHeight());}
        );
        Menus[2].addClickable(btn21);
        
        var btn22 = new Button(60, 235, 130, 35);
        btn22.setText("< NATRAG");
        btn22.setClickAction(
            function(){Menus[STATE.Current].setInactive();
                    STATE.Current = STATE.M2toM1;
                    Menus[2].setMoveDestination(WINDOW_WIDTH + Menus[2].getWidth(), middle.Y);
                    Menus[1].setMoveDestination(middle.X - Menus[1].getWidth()/2, middle.Y);}
        );
        Menus[2].addClickable(btn22);
        
        var vpicker1 = new ValuePicker(25, 20);
        GameSettings.size_picker = vpicker1;
        vpicker1.setTitle("Veličina kvadrata:");
        vpicker1.setValue(GameSettings.square_size);
        vpicker1.setMinMaxStep(3, 5, 1);
        vpicker1.setClickAction(
            function(){drawFlag = true;
                    GameSettings.square_size = GameSettings.size_picker.getValue();}
        );
        Menus[2].addClickable(vpicker1);
        
        var vpicker2 = new ValuePicker(25, 95);
        GameSettings.time_picker = vpicker2;
        vpicker2.setTitle("Vrijeme (min):");
        vpicker2.setValue(GameSettings.time_limit);
        vpicker2.setMinMaxStep(10, 90, 10);
        vpicker2.setClickAction(
            function(){drawFlag = true;
                    GameSettings.time_limit = GameSettings.time_picker.getValue();}
        );
        Menus[2].addClickable(vpicker2);
        
        Menus[2].placeRight(WINDOW_WIDTH);
    };
    
    
    
    var setupGameElements = function(){
        // display
        Display = new MenuContainer(middle.X, middle.Y - 240, 430, GameFlags.task ? 100 : 70);
        
        var display = new GameDisplay(15, 15, GameFlags.task);
        display.setTimer(GameSettings.time_limit);
        display.setTask(GameSettings.square_size);
        Timer = display;
        Display.addNonClickable(Timer);
        
        QuitButton = new Button(Display.getWidth() - 130, Display.getHeight()/2 - 20, 110, 40);
        QuitButton.setText("ODUSTANI");
        QuitButton.setClickAction(
            function(){Display.setInactive();
                Board.setInactive();
                setupMenuElements();
                setupReturnConditions();}
        );
        Display.addClickable(QuitButton);
        
        
        // board
        var size = GameSettings.square_size * 35 + 150;
        Board = new MenuContainer(middle.X, middle.Y - 90, size, size);
                
        BoardContent = new GameBoard(25, 25);
        BoardContent.setSize(GameSettings.square_size);
        BoardContent.setTask(display.getTask());
        BoardContent.setStarted(GameFlags.started);
        BoardContent.setSums(GameFlags.sums);
        BoardContent.setSelectAction(
            function(){KeyPressed = -1;
                Keypad.active = true;
                keypadMove();
                drawFlag = true;}
        );
        BoardContent.setDeselectAction(
            function(){KeyPressed = -1;
                Keypad.active = false;
                keypadMove();
                drawFlag = true;}
        );
        Board.addClickable(BoardContent);
        
        
        // keypad
        var keypad_width = 80,
            keypad_height = 300,
            button_size = 50,
            button_padding = 15,
            button_distance = 5;
    
    
        Keypad.components[0] = new MenuContainer(-keypad_width/2, middle.Y  - 90,
            keypad_width, keypad_height);
            
        var key1 = new Button(
            button_padding, button_padding, button_size, button_size);
        key1.setText("1");
        key1.setClickAction( function(){ KeyPressed = 1; BoardContent.setNotDelesectable(); } );
        Keypad.components[0].addClickable(key1);
        
        var key2 = new Button(
            button_padding, button_padding + button_distance + button_size, button_size, button_size);
        key2.setText("2");
        key2.setClickAction( function(){ KeyPressed = 2; BoardContent.setNotDelesectable(); } );
        Keypad.components[0].addClickable(key2);
        
        var key3 = new Button(
            button_padding, button_padding + button_distance * 2 + button_size * 2, button_size, button_size);
        key3.setText("3");
        key3.setClickAction( function(){ KeyPressed = 3; BoardContent.setNotDelesectable(); } );
        Keypad.components[0].addClickable(key3);
        
        var key4 = new Button(
            button_padding, button_padding + button_distance * 3 + button_size * 3, button_size, button_size);
        key4.setText("4");
        key4.setClickAction( function(){ KeyPressed = 4; BoardContent.setNotDelesectable(); } );
        Keypad.components[0].addClickable(key4);
        
        var key5 = new Button(
            button_padding, button_padding + button_distance * 4 + button_size * 4, button_size, button_size);
        key5.setText("5");
        key5.setClickAction( function(){ KeyPressed = 5; BoardContent.setNotDelesectable(); } );
        Keypad.components[0].addClickable(key5);
        
            
        Keypad.components[1] = new MenuContainer(WINDOW_WIDTH + keypad_width/2, middle.Y  - 90,
            keypad_width, keypad_height);
            
        var key6 = new Button(
            button_padding, button_padding, button_size, button_size);
        key6.setText("6");
        key6.setClickAction( function(){ KeyPressed = 6; BoardContent.setNotDelesectable(); } );
        Keypad.components[1].addClickable(key6);
        
        var key7 = new Button(
            button_padding, button_padding + button_distance + button_size, button_size, button_size);
        key7.setText("7");
        key7.setClickAction( function(){ KeyPressed = 7; BoardContent.setNotDelesectable(); } );
        Keypad.components[1].addClickable(key7);
        
        var key8 = new Button(
            button_padding, button_padding + button_distance * 2 + button_size * 2, button_size, button_size);
        key8.setText("8");
        key8.setClickAction( function(){ KeyPressed = 8; BoardContent.setNotDelesectable(); } );
        Keypad.components[1].addClickable(key8);
        
        var key9 = new Button(
            button_padding, button_padding + button_distance * 3 + button_size * 3, button_size, button_size);
        key9.setText("9");
        key9.setClickAction( function(){ KeyPressed = 9; BoardContent.setNotDelesectable(); } );
        Keypad.components[1].addClickable(key9);
        
        var key0 = new Button(
            button_padding, button_padding + button_distance * 4 + button_size * 4, button_size, button_size);
        key0.setText("0");
        key0.setClickAction( function(){ KeyPressed = 0; BoardContent.setNotDelesectable(); } );
        Keypad.components[1].addClickable(key0);
    };
    
    

// ********** MAIN LOOP **********
    
    this.mainLoop = function(){
        processInput();
        updateAll();
        if(drawFlag) drawAll();
    };
    
    
    
// ********** INPUT & UPDATE **********
    
    var processInput = function(){
        if (STATE.Current >= 0 && STATE.Current <= 2) {
            // redraw menu if color changed
            if (Mouse.moved && Menus[STATE.Current].mouseAt(Mouse.X, Mouse.Y))
                drawFlag = true;
            
            // check if menu click triggered
            if (Mouse.clicked) {
                Menus[STATE.Current].clicked(Mouse.X, Mouse.Y);
                
                then = Date.now();
                Mouse.clicked = false;
            }
        }
        
        if (STATE.Current === STATE.Game) {
            // redraw if color changed
            if (Mouse.moved && 
                (Display.mouseAt(Mouse.X, Mouse.Y) ||
                 Board.mouseAt(Mouse.X, Mouse.Y) ||
                 Keypad.components[0].mouseAt(Mouse.X, Mouse.Y) ||
                 Keypad.components[1].mouseAt(Mouse.X, Mouse.Y))
               )
                    drawFlag = true;
                
            // check if click triggered
            if (Mouse.clicked) {
                Display.clicked(Mouse.X, Mouse.Y);
                Keypad.components[0].clicked(Mouse.X, Mouse.Y);
                Keypad.components[1].clicked(Mouse.X, Mouse.Y);
                Board.clicked(Mouse.X, Mouse.Y);
                
                then = Date.now();
                Mouse.clicked = false;
            }
        }
        
        if (Mouse.clicked) Mouse.clicked = false;
    };
    
    
    
    var updateAll = function(){
        // enable drawing during animation
        if (STATE.Current === STATE.Startup ||
            STATE.Current === STATE.M1toM0 || STATE.Current === STATE.M1toM2 ||
            STATE.Current === STATE.M0toM1_s || STATE.Current === STATE.M0toM1_c ||
            STATE.Current === STATE.M2toM1 || STATE.Current === STATE.M2toGAME ||
            STATE.Current === STATE.GAMEtoM0)
                drawFlag = true;
        
        // options menu button support
        if (STATE.Current === STATE.M1toM0) saveGameFlags();
        if (STATE.Current === STATE.M0toM1_c) restoreGameFlags();
        
        // time limit support
        if (STATE.Current === STATE.M1toM2) setTimeLimit();
        
        // game time update and send key pressed
        if (STATE.Current === STATE.Game){
            if (Keypad.moving) drawFlag = true;
            updateGameTime();
            sendKey();
        }
    };
    
    
    
    var saveGameFlags = function(){
        GameFlags_temp.task = GameFlags.task;
        GameFlags_temp.started = GameFlags.started;
        GameFlags_temp.timed = GameFlags.timed;
        GameFlags_temp.sums = GameFlags.sums;
    };
    
    
    
    var restoreGameFlags = function(){
        // restore flags
        GameFlags.task = GameFlags_temp.task;
        GameFlags.started = GameFlags_temp.started;
        GameFlags.timed = GameFlags_temp.timed;
        GameFlags.sums = GameFlags_temp.sums;
        
        // restore checkbox values
        if (GameFlags_temp.box1.getValue() !== GameFlags_temp.task)
            GameFlags_temp.box1.toggleValue();
        if (GameFlags_temp.box2.getValue() !== GameFlags_temp.started)
            GameFlags_temp.box2.toggleValue();
        if (GameFlags_temp.box3.getValue() !== GameFlags_temp.timed)
            GameFlags_temp.box3.toggleValue();
        if (GameFlags_temp.box4.getValue() !== GameFlags_temp.sums)
            GameFlags_temp.box4.toggleValue();
    };
    
    
    
    var setTimeLimit = function(){
        if (!GameFlags.timed) {
            GameSettings.time_limit = 0;
            GameSettings.time_picker.setValue(0);
            GameSettings.time_picker.setMinMaxStep(0, 0, 1);
        }
        else if (GameSettings.time_limit === 0) {
            GameSettings.time_limit = 20;
            GameSettings.time_picker.setValue(GameSettings.time_limit);
            GameSettings.time_picker.setMinMaxStep(10, 90, 10);
        }
    };
    
    
    
    var updateGameTime = function(){
        var timeout = Timer.updateTime();
        if (Timer.timeChanged()) drawFlag = true;
        if (timeout) {
            QuitButton.setText("IZLAZ");
            Timer.stop();
            Board.setInactive();
        }
    };
    
    
    var sendKey = function(){
        var recieved = BoardContent.sendKey(KeyPressed);
        if (recieved){
            drawFlag = true;
            BoardContent.checkDuplicates();
            if (BoardContent.updateSums()){
                Timer.victory();
                QuitButton.setText("IZLAZ");
            }
        }
        KeyPressed = -1;
    };
    
    
    
    var getTimeDiff = function(){
        var now = Date.now(),
            diff = now - then;
        then = now;
        return diff;
    };
    
    
    
    var keypadMove = function(){
        if (Keypad.active) {
            // move into screen
            Keypad.components[0].setMoveDestination(
                0.5*Keypad.components[0].getWidth(), Keypad.components[0].getPosY());
            Keypad.components[1].setMoveDestination(
                WINDOW_WIDTH - 1.5*Keypad.components[1].getWidth(), Keypad.components[1].getPosY());
        }
        else {
            // move out of screen
            Keypad.components[0].setMoveDestination(
                -Keypad.components[0].getWidth(), Keypad.components[0].getPosY());
            Keypad.components[1].setMoveDestination(
                WINDOW_WIDTH, Keypad.components[1].getPosY());
        }
        
        Keypad.moving = true;
    };
    
    
    
// ********** DRAWING **********
    
    var drawAll = function(){
        if (STATE.Current === STATE.Startup) startupAnimation();
        
        if (STATE.Current >= 0 && STATE.Current <= 2)
            Menus[STATE.Current].draw(Drawing);
        
        if (STATE.Current === STATE.M1toM0 || STATE.Current === STATE.M1toM2 ||
            STATE.Current === STATE.M0toM1_s || STATE.Current === STATE.M0toM1_c ||
            STATE.Current === STATE.M2toM1)
            menuTransitionAnimation();
        
        if (STATE.Current === STATE.M2toGAME) menuToGameAnimation();
        if (STATE.Current === STATE.Game) {
            Display.draw(Drawing);
            Board.draw(Drawing);
            keypadDraw();
        }
        if (STATE.Current === STATE.GAMEtoM0) gameToMenuAnimation();
        
        drawFlag = false;
    };
    
    
    
    var startupAnimation = function(){
        var dt = getTimeDiff();
        
        // draw title
        var done1 = TitleSign.move(dt);
        
        if (!done1) {
            Drawing.fillStyle = "white";
            Drawing.fillRect(middle.X - TitleSign.getWidth()/2, 0,
                TitleSign.getWidth(), TitleSign.getPosY() + TitleSign.getHeight());
            TitleSign.draw(Drawing);
        }
        
        // draw menu
        if (done1) {
            var done2 = Menus[1].move(dt);
            
            if (!done2) {
                Drawing.fillStyle = "white";
                Drawing.fillRect(middle.X - Menus[1].getWidth()/2, Menus[1].getPosY(),
                    Menus[1].getWidth(), WINDOW_HEIGHT - Menus[1].getPosY());

                Menus[1].draw(Drawing);
            }
        }
        
        // end
        if (done2) STATE.Current = STATE.Menu_1;
    };
    
    
    
    var menuTransitionAnimation = function(){
        // moving
        var done1, done2, dt = getTimeDiff();
        switch (STATE.Current){
            case STATE.M1toM0:
                done1 = Menus[1].move(dt);
                done2 = Menus[0].move(dt);
                break;
                
            case STATE.M1toM2:
                done1 = Menus[1].move(dt);
                done2 = Menus[2].move(dt);
                break;
                
            case STATE.M0toM1_s:
            case STATE.M0toM1_c:
                done1 = Menus[0].move(dt);
                done2 = Menus[1].move(dt);
                break;
                
            case STATE.M2toM1:
                done1 = Menus[2].move(dt);
                done2 = Menus[1].move(dt);
                break;
        }
        
        // drawing
        if (!done1 || !done2) {
            Drawing.fillStyle = "white";
            Drawing.fillRect(0, middle.Y, WINDOW_WIDTH, middle.Y);
            
            switch (STATE.Current){
                case STATE.M1toM0:
                    Menus[1].draw(Drawing);
                    Menus[0].draw(Drawing);
                    break;

                case STATE.M1toM2:
                    Menus[1].draw(Drawing);
                    Menus[2].draw(Drawing);
                    break;

                case STATE.M0toM1_s:
                case STATE.M0toM1_c:
                    Menus[0].draw(Drawing);
                    Menus[1].draw(Drawing);
                    break;

                case STATE.M2toM1:
                    Menus[2].draw(Drawing);
                    Menus[1].draw(Drawing);
                    break;
            }
        }
        // end
        else
            switch (STATE.Current){
                case STATE.M1toM0:
                    STATE.Current = STATE.Menu_0;
                    break;

                case STATE.M1toM2:
                    STATE.Current = STATE.Menu_2;
                    break;

                case STATE.M0toM1_s:
                case STATE.M0toM1_c:
                    STATE.Current = STATE.Menu_1;
                    break;

                case STATE.M2toM1:
                    STATE.Current = STATE.Menu_1;
                    break;
            }
    };
    
    
    
    var menuToGameAnimation = function(){
        var dt = getTimeDiff();
        
        // clear
        Drawing.fillStyle = "white";
        Drawing.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        
        // draw game elements
        Display.draw(Drawing);
        Board.draw(Drawing);
        
        // draw title
        var done1 = TitleSign.move(dt);
        
        if (!done1) {
            Drawing.fillStyle = "white";
            Drawing.fillRect(0, 0,
                WINDOW_WIDTH, TitleSign.getPosY() + TitleSign.getHeight() + 50);
            TitleSign.draw(Drawing);
        }
        
        // draw menu
        var done2 = Menus[2].move(dt);

        if (!done2) {
            Drawing.fillStyle = "white";
            Drawing.fillRect(0, Menus[2].getPosY() - 25,
                WINDOW_WIDTH, WINDOW_HEIGHT - Menus[2].getPosY() + 25);

            Menus[2].draw(Drawing);
        }
        
        // end
        if (done1 && done2) STATE.Current = STATE.Game;
    };
    
    
    
    var gameToMenuAnimation = function(){
        var dt = getTimeDiff();
        
        var done1 = TitleSign.move(dt);
        var done2 = Menus[1].move(dt);
        
        if (!done1 || !done2) {
        // draw game elements
        Display.draw(Drawing);
        Board.draw(Drawing);
            
        // draw title        
            Drawing.fillStyle = "white";
            Drawing.fillRect(0, 0,
                WINDOW_WIDTH, TitleSign.getPosY() + TitleSign.getHeight() + 50);
            TitleSign.draw(Drawing);
        
        // draw menu
            Drawing.fillStyle = "white";
            Drawing.fillRect(0, Menus[1].getPosY() - 25,
                WINDOW_WIDTH, WINDOW_HEIGHT - Menus[1].getPosY() + 25);

            Menus[1].draw(Drawing);
        }
        
        // end
        if (done1 && done2) STATE.Current = STATE.Menu_1;
    };
    
    
    
    var keypadDraw = function() {
        // move
        if (Keypad.moving){
            var dt = getTimeDiff();

            var done1 = Keypad.components[0].move(dt);
            var done2 = Keypad.components[1].move(dt);
            
            Drawing.fillStyle = "white";
            Drawing.fillRect(
                0, Keypad.components[0].getPosY(),
                1.5*Keypad.components[0].getWidth(), Keypad.components[0].getHeight());
            Drawing.fillRect(
                WINDOW_WIDTH - 1.5*Keypad.components[0].getWidth(), Keypad.components[0].getPosY(),
                1.5*Keypad.components[0].getWidth(), Keypad.components[0].getHeight());

            if (done1 && done2) Keypad.moving = false;
        }
        
        // draw
        Keypad.components[0].draw(Drawing);
        Keypad.components[1].draw(Drawing);
    };
}