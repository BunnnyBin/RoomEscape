//프로토타입 대신에 member 사용
Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//----------------------------------------Game Definition--------------------------------
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}

Game.handItem = function(){
	return game.getHandItem()
}

//---------------------------------------Room Definition--------------------------------------
//room 생성
function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)  //room1, room2, room3
}

//불 밝기
Room.member('setRoomLight', function(intensity){  
	this.id.setRoomLight(intensity)
})


//-------------------------------------Object Definition-------------------------------------
//object 생성
function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image
	
	if (room !== undefined){
		this.id = room.id.createObject(name, image)  //object
	}
}

//status - 열림, 닫힘, 잠김
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }  


//setSprite - 이미지 변화
Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})

//resize - 크기
Object.member('resize', function(width){
	this.id.setWidth(width)
})

//setDescription -메세지
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})
//getX
Object.member('getX', function(){
	return this.id.getX()
})
//getY
Object.member('getY', function(){
	return this.id.getY()
})
//locate - 배치
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})

//moving - 이동
Object.member('moving', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

//show - 상태 변화
Object.member('show', function(){
	this.id.show()
})
//hide
Object.member('hide', function(){
	this.id.hide()
})
//open
Object.member('open', function(){
	this.id.open()
})
//close
Object.member('close', function(){
	this.id.close()
})
//lock
Object.member('lock', function(){
	this.id.lock()
})
//unlock
Object.member('unlock', function(){
	this.id.unlock()
})
//isOpened - 상태 출력
Object.member('isOpened', function(){
	return this.id.isOpened()
})
//isClosed
Object.member('isClosed', function(){
	return this.id.isClosed()
})
//isLocked
Object.member('isLocked', function(){
	return this.id.isLocked()
})
//pick - 줍기
Object.member('pick', function(){
	this.id.pick()
})
//isPicked - 주운 상태
Object.member('isPicked', function(){
	return this.id.isPicked()
})


//----------------------------------------Door Definition------------------------------------
//door 생성
function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)  

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}

Door.prototype = new Object()   // inherited from Object (Door << Object)


//door의 onClick - 클릭 누르면
Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
	else if(this.id.isLocked()){
		printMessage("잠김")
	}
})

//onOpen  - 열면
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})

//onClose - 닫으면
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})

//----------------------------------------Keypad Definition-------------------------------------------
//Keypad 생성
function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}

Keypad.prototype = new Object()   // inherited from Object

//keypad의 onClick - 클릭하면
Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})

//--------------------------------------DoorLock Definition------------------------------------------
//DoorLock - 키패드의 기능 구현(callback)
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}

DoorLock.prototype = new Keypad()   // inherited from Keypad

//-------------------------------------- Item Definition ---------------------------------------------
//Item 생성 - Object 상속받음
function Item(room, name, image){
	Object.call(this, room, name, image)
}

Item.prototype = new Object()   // inherited from Object

//item의 onClick - 줍기
Item.member('onClick', function(){
	this.id.pick()
})

//isHanded - item 사용하기
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})

//-------------------------------------Arrow-----------------------------------------
function Arrow(room, name, image, direction){
	Object.call(this, room, name, image)

	// Arrow properties
	this.direction = direction //1: 왼쪽, 2: 위쪽, 3: 오른쪽
	this.resize(40)
	if(direction == 1){
		this.locate(40,350)
	}
	else if(direction == 2){
		this.locate(600,40)
	}
	else if(direction == 3){
		this.locate(1230,350)
	}
	else if(direction == 4){
		this.locate(600,680)
	}
}

Arrow.prototype = new Object()   // inherited from Object

//arrow의 onClick - 클릭하면
Arrow.member('onClick', function(){})	

//-----------------------------------Button----------------------------------------------
function Button(room, name, image1, image2, image3, image4, answer){
	Object.call(this, room, name, image1)

	// Button properties
	this.image1 = image1
	this.image2 = image2
	this.image3 = image3
	this.image4 = image4
	this.count = 0
	this.answer = answer
	this.clear = 0  //정답 맞추면 1, 못 맞추면 0
}
Button.prototype = new Object()   // inherited from Object


//클릭할 때마다 이미지 변화
Button.member('onClick', function(){
	if(this.count <= 3){
		this.count += 1
	}
	else if(this.count == 4){
		this.count = 0   //리셋
	}
	
	if(this.count == 0){
		this.setSprite(this.image1)
	}
	else if(this.count == 1){
		this.setSprite(this.image2)
	}
	else if(this.count == 2){
		this.setSprite(this.image3)
	}
	else if(this.count == 3){
		this.setSprite(this.image4)
	}

	//특정 클릭 수 -> 버튼 한 개 성공
	if(this.count == this.answer){
		this.clear = 1
	} 
	else if(this.count != this.answer) {
		this.clear = 0
	}                                             

})



//-----------------------------------PowerButton------------------------------
function PowerButton(room, name, image1, image2, answer){
	Object.call(this, room, name, image1)

	// PowerButton properties
	this.image1 = image1
	this.image2 = image2

	this.count = 0
	this.answer = answer
	this.clear = 0
}
PowerButton.prototype = new Object()   // inherited from Object

//클릭할 때마다 이미지 변화
PowerButton.member('onClick', function(){
	if(this.count <= 5){
		this.count += 1
	}
	else if(this.count == 6){
		this.count = 0
	}
	
	if(this.count == 0 || this.count == 2 || this.count == 4){
		this.setSprite(this.image1)
	}
	else if(this.count == 1 || this.count == 3 || this.count == 5){
		this.setSprite(this.image2)
	}
	
	//특정 클릭 수 -> 천장 무너짐
	if(this.count == this.answer){
		this.clear = 1
	} 
	else if(this.count != this.answer){
		 this.clear = 0
	}                                        
})
























//---------------------------------------Play-----------------------------------------------
room1 = new Room('room1', '배경_1_1.jpg')
room2 = new Room('room2', '배경_1_2.jpg')
room3 = new Room('room3', '배경_1_3.jpg')
room4 = new Room('room4', '배경_1_4.jpg')  //천장
room5 = new Room('room5', '배경_1_5.jpg')
room6 = new Room('room6', '흰배경1.jpg')





//////////////////////////////////////////////room1

room1.door1 = new Door(room1, 'door1', '문3-좌-닫힘.png', '문3-좌-열림.png', room6)
room1.door1.resize(136)
room1.door1.locate(100, 430)
room1.door1.lock()
 
room1.keypad1 = new DoorLock(room1, 'keypad1', '키패드-좌.png', '2791', room1.door1, "열렸다!")
room1.keypad1.resize(50)
room1.keypad1.locate(70, 170)

//락커의 내부
lockerin = new Room('lockerin', '흰배경1.jpg') 
lockerin.key = new Item(lockerin, 'key', '키2.png')                      //************************5. 열쇠
lockerin.key.resize(300)
lockerin.key.locate(600, 350)

lockerin.arrow = new Arrow(lockerin, 'arrow', '화살표4.jpg', 4)

lockerin.arrow.onClick = function(){
	Game.move(room1)
}

room1.locker1 = new Door(room1, 'locker1', '사물함1.png', '사물함-열림2.png', lockerin)
room1.locker1.resize(100)
room1.locker1.locate(900,200)
room1.locker1.lock()

//버튼
room1.button1 = new Button(room1, 'button1', '트럼프1.png', '트럼프2.png', '트럼프3.png', '트럼프4.png', 3)
room1.button1.resize(90)
room1.button1.locate(800, 350)
room1.button2 = new Button(room1, 'button2', '트럼프2.png', '트럼프3.png', '트럼프1.png', '트럼프4.png', 2)
room1.button2.resize(90)
room1.button2.locate(900, 350)
room1.button3 = new Button(room1, 'button3', '트럼프3.png', '트럼프4.png', '트럼프1.png', '트럼프2.png', 3)
room1.button3.resize(90)
room1.button3.locate(1000, 350)

//완성 버튼
room1.clearbutton = new Object(room1, 'clearbutton', '버튼2.png')
room1.clearbutton.resize(50)
room1.clearbutton.locate(790,250)

room1.clearbutton.onClick = function(){
	if(room1.button1.clear == 1 && room1.button2.clear == 1 && room1.button3.clear == 1){
		printMessage("덜컥")
		room1.locker1.unlock()
	}//세 개의 버튼 클리어 -> 문 열림
	else {
		printMessage("땡~~~")
	}
}

room1.desk1 = new Object(room1, 'desk1', '테이블3-3.png')
room1.desk1.resize(400)
room1.desk1.locate(400,500)

//실험도구
room1.ex1 = new Object(room1, 'ex1', '현미경.jpg')
room1.ex1.resize(80)
room1.ex1.locate(270, 370)

//컴퓨터
room1.computer = new Object(room1, 'computer', '컴퓨터1.png')
room1.computer.resize(200)
room1.computer.locate(400,380)
room1.computer.onClick = function(){
	if(whitein.usb.isHanded()){                                                 //********************usb 사용하기!!!!!!!!!!
		printMessage("이상한 동영상이 재생된다")
		showVideoPlayer("number4.mp4")
	}
	else{
		printMessage("컴퓨터가 죽었나??")
	}
}
//스탠드
room1.stand = new Object(room1, 'stand', '스탠드.png')
room1.stand.resize(100)
room1.stand.locate(650, 400)

//의자
room1.chair = new Object(room1, 'chair', '의자1-6.png')
room1.chair.resize(180)
room1.chair.locate(550, 550)

//로봇
room1.robot = new Object(room1, 'robot', '로봇1.png')
room1.robot.resize(150)
room1.robot.locate(1000, 500)

room1.robot.onClick = function(){
	printMessage("자리에 가만히 계세요. 실험체님.")
}

//벽지
room1.pic = new Object(room1, 'pic', '실험실이름.png')
room1.pic.resize(300)
room1.pic.locate(370, 200)

//책들
room1.book1 = new Object(room1, 'book1', '책1-1.png')
room1.book1.resize(100)
room1.book1.locate(700, 630)

room1.book2 = new Object(room1, 'book2', '책1-2.png')
room1.book2.resize(100)
room1.book2.locate(750, 630)

room1.book3 = new Object(room1, 'book3', '책1-2.png')
room1.book3.resize(100)
room1.book3.locate(730, 590)

room1.book4 = new Object(room1, 'book4', '책1-1.png')
room1.book4.resize(100)
room1.book4.locate(800, 620)

room1.book4.onClick = function(){
	printMessage("나에 대한 기록들이다....")
}




/////////////////////////////////////////room5

//벽지
room5.pic = new Object(room5, 'pic', '로봇사진1.jpg')
room5.pic.resize(200)
room5.pic.locate(580, 300)

room5.pic.onClick = function(){
	printMessage("지켜보고 있습니다. 실험체님.")
}

//carpet
room5.carpet = new Object(room5, 'carpet', '카펫-3.png')
room5.food1 = new Item(room5, 'food1', '강아지밥.png')

room5.carpet.resize(600)
room5.carpet.locate(500, 620)

//실험도구
room5.ex1 = new Object(room5, 'ex1', '실험도구3.jpg')
room5.ex1.resize(250)
room5.ex1.locate(200, 500)
room5.ex2 = new Object(room5, 'ex2', '실험도구1.jpg')
room5.ex2.resize(250)
room5.ex2.locate(500, 500)

room5.ex1.onClick = function(){
	printMessage("보글보글")
}

//강아지밥
room5.food1.resize(100)
room5.food1.locate(500, 620)                                                 //**********************2. 강아지 밥

room5.food1.hide()

room5.carpet.move = true
room5.carpet.onDrag = function(direction){
	if(direction == "Down" && room5.carpet.move){ 
		room5.food1.show()
		room5.carpet.moving(0, 40)
		room5.carpet.move = false // 이후에는 더 이상 움직이지 않도록 합니다.
	}
}

//locker1
bluein = new Room('bluein', '파란배경1.jpg')

room5.locker1 = new Door(room5, 'locker1', '사물함1.jpg', '사물함-열림.jpg', bluein)
room5.locker2 = new Object(room5, 'locker2', '사물함2.jpg')
room5.lighter = new Item(room5, 'lighter', '손전등.jpg')                       //****************************6. 손전등

room5.locker1.resize(105)
room5.locker1.locate(1100, 350)
room5.locker2.resize(100)
room5.locker2.locate(900, 350)
room5.lighter.resize(100)
room5.lighter.locate(900,350)

room5.lighter.onClick = function(){
	room5.lighter.pick()
	Item.prototype.type6 = 1
}  

room5.lighter.hide()

bluein.arrow = new Arrow(bluein, 'arrow', '화살표4.jpg', 4)
bluein.arrow.onClick = function(){
	Game.move(room5)
}

bluein.trump1 = new Object(bluein, 'trump1', '클럽.png')
bluein.trump2 = new Object(bluein, 'trump2', '다이아몬드.png')
bluein.trump3 = new Object(bluein, 'trump3', '스페이드2.png')
bluein.trump4 = new Object(bluein, 'trump4', '하트.png')
bluein.trump1.resize(200)
bluein.trump1.locate(300, 400)
bluein.trump2.resize(200)
bluein.trump2.locate(500, 400)
bluein.trump3.resize(200)
bluein.trump3.locate(700, 400)
bluein.trump4.resize(200)
bluein.trump4.locate(900, 400)

bluein.trump1.onClick = function(){
	printMessage("2")
}
bluein.trump3.onClick = function(){
	printMessage("1")
}
bluein.trump4.onClick = function(){
	printMessage("3")
}

//locker2
room5.locker2.onClick = function(){
	if(room5.locker2.isOpened()) {       // Opened 상태인 경우
		room5.locker2.close()    // close
	} 
	else if(room5.locker2.isClosed()) {  // Closed 상태인 경우
		room5.locker2.open()    // open
	}
}

room5.locker2.onOpen = function() {
	room5.locker2.setSprite("사물함-열림.jpg") // 열린 그림으로 변경
	room5.lighter.show()
}

room5.locker2.onClose = function() {
	room5.locker2.setSprite("사물함2.jpg") // 닫힌 그림으로 변경
	room5.lighter.hide()
}

//달력
room5.date = new Object(room5, 'date', '달력.jpg')
room5.date.resize(200)
room5.date.locate(300, 250)







/////////////////////////////////////////////room6

room6.door1 = new Door(room6, 'door1', '문-우-닫힘.png', '문-우-열림.png', room1)
room6.door1.resize(136)
room6.door1.locate(1220, 400)


//식물
room6.plant = new Object(room6, 'plant', '식물1.png')
room6.plant.resize(200)
room6.plant.locate(100, 400)

room6.cowfood = new Item(room6, 'cowfood', '건초.jpg')
room6.cowfood.resize(100)
room6.cowfood.locate(200, 550)
room6.cowfood.hide()

room6.plant.onClick = function(){
	printMessage("뭔가 나왔다.")
	room6.cowfood.show()
}

//소
room6.cow = new Object(room6, 'cow', '소.png')
room6.cow.resize(550)
room6.cow.locate(900, 400)

room6.cow.onClick = function(){
	if(room6.cowfood.isHanded()){
		showVideoPlayer("개밥줘.mp4")
	}
	else {
		printMessage("너도 배고프구나?")
	}
}

//강아지
room6.dog = new Object(room6, 'dog', '강아지.jpg')
room6.dog.resize(300)
room6.dog.locate(400, 550)

//힌트종이
room6.hint1 = new Object(room6, 'hint1', '세모힌트.png')
room6.hint1.resize(100)
room6.hint1.locate(650, 600)
room6.hint1.hide()

room6.hint1.onClick = function(){
	showImageViewer("세모힌트.png","");
}

room6.dog.onClick = function(){  
	if(room5.food1.isHanded()){                                //***********************개밥 사용하기
		printMessage("개 입속에서 종이가 나왔다")  
		room6.hint1.show()
	}
	else{
		printMessage("배고프니???")
	}
}







////////////////////////////////////////////////////////////////room7
room7 = new Room('room7', '파란배경2.jpg')

room7.door = new Door(room7, 'door', '문-좌-닫힘.png', '문-좌-열림.png', room2)
room7.door.resize(200)
room7.door.locate(100, 300)

room7.button = new PowerButton(room7, 'button', '버튼.jpg', '버튼3.png', 4)
room7.button.resize(200)
room7.button.locate(650, 600)

//완성 버튼
room7.clearbutton = new Object(room7, 'clearbutton', '버튼2.png')
room7.clearbutton.resize(50)
room7.clearbutton.locate(800,600)

room7.clearbutton.onClick = function(){
	if(room7.button.clear == 1){
		printMessage("쾅쾅쾅쾅!!!!!!!!!!!!!!(폭발음)")
	}
	else {
		printMessage("땡~~~ (완성버튼인듯 싶다)")
		room7.button.count = 0  //버튼 리셋
	}
}

room7.robot =  new Object(room7, 'robot', '로봇사진2.jpg')
room7.robot.resize(300)
room7.robot.locate(500,300)

room7.robot.onClick = function(){
	printMessage("여기까지 오다니 제법이군. 인간.")
}







//////////////////////////////////////////////////room2

//락커  -  USB
whitein = new Room('whitein', '흰배경1.jpg')
whitein.arrow = new Arrow(whitein, 'arrow', '화살표4.jpg', 4)
whitein.arrow.onClick = function(){
	Game.move(room2)
}

whitein.usb = new Item(whitein, 'usb', 'usb.png')                       //*********************3. usb
whitein.usb.resize(200)
whitein.usb.locate(750, 450)

whitein.hint = new Object(whitein, 'hint', '문자힌트.png')
whitein.hint.resize(300)
whitein.hint.locate(300,450)

room2.locker1 = new Door(room2, 'locker1', '찬장-왼쪽-닫힘.png', '찬장-왼쪽-열림.png', whitein)
room2.locker1.resize(200)
room2.locker1.locate(200, 600)
room2.locker1.lock()

//버튼
room2.button1 = new Button(room2, 'button1', '세모1.png', '세모2.png', '세모3.png', '세모4.png', 3)
room2.button1.resize(100)
room2.button1.locate(250, 250)
room2.button2 = new Button(room2, 'button2', '세모2.png', '세모3.png', '세모4.png', '세모1.png', 1)
room2.button2.resize(100)
room2.button2.locate(420, 250)
room2.button3 = new Button(room2, 'button3', '세모3.png', '세모4.png', '세모1.png', '세모2.png', 3)
room2.button3.resize(100)
room2.button3.locate(600, 250)

room2.button1.hide()
room2.button2.hide()
room2.button3.hide()

//완성 버튼
room2.clearbutton = new Object(room2, 'clearbutton', '버튼2.png')
room2.clearbutton.resize(50)
room2.clearbutton.locate(420,350)

room2.clearbutton.hide()

room2.clearbutton.onClick = function(){
	if(room2.button1.clear == 1 && room2.button2.clear == 1 && room2.button3.clear == 1){
		printMessage("덜컥")
		room2.locker1.unlock()
	}//세 개의 버튼 클리어 -> 문 열림
	else {
		printMessage("땡~~~")
	}
}

//서랍
room2.drawer = new Object(room2, 'drawer', '서랍1.jpg')
room2.drawer.resize(200)
room2.drawer.locate(800, 400)

//실험도구
room2.ex1 = new Object(room2, 'ex1', '실험도구1.jpg')
room2.ex1.resize(100)
room2.ex1.locate(800, 300)

room2.ex2 = new Object(room2, 'ex2', '현미경3.jpg')
room2.ex2.resize(100)
room2.ex2.locate(800, 150)

//인체해부도
room2.pic = new Object(room2, 'pic', '인체해부도3.jpg')
room2.pic.resize(450)
room2.pic.locate(400, 300)

room2.pic.move = true
room2.pic.onDrag = function(direction){
	if(direction == "Up" && room2.pic.move){ 
		room2.button1.show()
		room2.button2.show()
		room2.button3.show()
		room2.clearbutton.show()
		printMessage("밀렸다!")
		room2.pic.moving(0, -1000)
		room2.pic.move = false // 이후에는 더 이상 움직이지 않도록 합니다.
	}
}

//문
room2.door = new Door(room2, 'door', '흰문-닫힘.jpg', '흰문-열림.jpg', room7)
room2.door.resize(250)
room2.door.locate(1100, 300)
room2.door.lock()

//문자 키패드
room2.wordkeypad = new Keypad(room2, 'wordkeypad', 'cryptex.png', 'FBGIA', function(){
	room2.door.unlock()
	printMessage('문이 열린다')
})
room2.wordkeypad.resize(100)
room2.wordkeypad.locate(1000, 600)

room2.wordkeypad.onClick = function(){
	showKeypad('alphabet', this.password, this.callback)
}

//박스 + 드라이버
room2.box = new Object(room2, 'box', '상자4-1-닫힘.png')
room2.box.resize(300)
room2.box.locate(650, 600)

room2.driver = new Item(room2, 'driver', '드라이버.png')                        //************************1. 드라이버
room2.driver.resize(100) 
room2.driver.locate(650, 600)
                            

room2.driver.hide()

room2.box.onClick = function(){
	if(room2.box.isOpened()) {       // Opened 상태인 경우
		room2.box.close()    // close
	} 
	else if(room2.box.isClosed()) {  // Closed 상태인 경우
		room2.box.open()    // open
	}
}

room2.box.onOpen = function() {
	room2.box.setSprite("상자4-1-열림.png") // 열린 그림으로 변경
	room2.driver.show()
}
room2.box.onClose = function() {
	room2.box.setSprite("상자4-1-닫힘.png") // 닫힌 그림으로 변경
	room2.driver.hide()
}





/////////////////////////////////////////////////////////room8
room8 = new Room('room8', '배경-6.png')

room8.door = new Door(room8, 'door', '문2-좌-닫힘.png', '문2-좌-열림.png', room3)
room8.door.resize(150)
room8.door.locate(100,350)

//시계
room8.clock = new Object(room8, 'clock', '시계.jpg')
room8.clock.resize(200)
room8.clock.locate(1150, 200)

//화이트 보드
room8.board = new Object(room8, 'board', '화이트보드-왼쪽.png')
room8.board.resize(200)
room8.board.locate(380, 300)

//진짜 보드
room8.board2 = new Object(room8, 'board2', '초록색칠판-왼쪽.png')
room8.board2.resize(200)
room8.board2.locate(380, 300)
room8.board2.hide()

room8.board.move = true
room8.board.onDrag = function(direction){
	if(direction == "Up" && room8.board.move){ 
		room8.board.moving(0, -100)
		room8.board2.show()
		room8.board.move = false // 이후에는 더 이상 움직이지 않도록 합니다.
		printMessage("무엇인가 적혀있다")
	}
}

room8.board2.onClick = function(){
	showImageViewer("시계힌트2.png", ""); // 이미지 출력
}


//락커 내부
locker = new Room('locker', '배경_1_4.jpg')
locker.arrow = new Arrow(locker, 'arrow', '화살표4.jpg', 4)
locker.arrow.onClick = function(){
	Game.move(room8)
}

room8.locker = new Door(room8, 'locker', '캐비닛2-3-닫힘.png', '캐비닛2-3-열림.png', locker)
room8.locker.resize(200)
room8.locker.locate(600, 350)
room8.locker.lock()

room8.locker.onOpen = function(){
	room8.locker.setSprite(room8.locker.openedImage)
	printMessage("마지막 힌트인듯 싶다!!!!!!!!")
}

//마지막 힌트 종이
locker.finalhint = new Object(locker, 'finalhint', '힌트1.jpg')                          //*****************************4. 마지막힌트
locker.finalhint.resize(300)
locker.finalhint.locate(600,400)

locker.finalhint.onClick = function(){
	showImageViewer("종이.png", "finalhint.txt"); // 이미지와 텍스트 파일 출력
	printMessage("'생'은 생일 +  '사'는.....")
}

//키패드
room8.keypad = new Keypad(room8, 'keypad', '숫자키-우.png', '4485',  function(){
	room8.locker.unlock()
	printMessage("딸칵")
})
room8.keypad.resize(100)
room8.keypad.locate(900, 250)







//////////////////////////////////////////////////////////room3

//문과 엘리베이터
room3.door1 = new Door(room3, 'door1', '흰문-닫힘.jpg', '흰문-열림.jpg', room8)
room3.door1.resize(200)
room3.door1.locate(450, 310)
room3.door1.lock()

room3.doorin = new Object(room3, 'doorin', '열쇠구멍.png')
room3.doorin.resize(50)
room3.doorin.locate(450, 50)

room3.doorin.onClick = function(){
	if(lockerin.key.isHanded()){                                                  //**************************주운 열쇠 사용하기
		room3.door1.unlock()
		printMessage("열렸다!!")
	}

}


room3.elevator = new Door(room3, 'elevator', '엘리베이터-닫힘.png', '엘리베이터-열림.png', undefined)
room3.elevator.resize(250)
room3.elevator.locate(800, 340)
room3.elevator.lock()

room3.elevbuttton = new Object(room3, 'elevbuttton', '엘리베이터-버튼.png')
room3.elevbuttton.resize(30)
room3.elevbuttton.locate(630,380)

room3.elevbuttton.onClick = function(){
	if(Item.prototype.type4 == 1){
		printMessage("엘리베이터가 작동한다!")
		room3.elevator.unlock()
		Item.prototype.alreadypick = 0
	}
	else {
		printMessage("작동을 못하고 있다...")
	}
}

//엘리베이터 키패드
room3.keypad = new DoorLock(room3, 'keypad', '키패드-우.png', '0732', room3.elevator, '드디어 탈출이다!!!!!')
room3.keypad.resize(50)
room3.keypad.locate(990, 400)	

//가짜 키패드
room3.poorkey = new Object(room3, 'poorkey', '숫자키-좌.png')
room3.poorkey.resize(90)
room3.poorkey.locate(180, 420)

room3.hint1 = new Object(room3, 'hint1', '힌트2.png')
room3.hint1.resize(50)
room3.hint1.locate(400, 600)
room3.hint1.hide()

room3.hint1.onClick = function(){
	showImageViewer("힌트2.png","");
}


room3.poorkey.onClick = function(){
	if(room2.driver.isHanded()){                                //*************************드라이버 사용하기
		printMessage("이상한 종이가 나왔다!")
		room3.hint1.show()
	}
	else {
		printMessage("왜 작동이 안되지????")
	}
}
		
//인체사진
room3.hum = new Object(room3, 'hum', '인체해부도.jpg')
room3.hum.resize(200)
room3.hum.locate(1100, 200)

//대왕로봇
room3.bigrobot = new Object(room3, 'bigrobot', '로봇1.png')
room3.bigrobot.resize(500)
room3.bigrobot.locate(700, 750)

room3.bigrobot.onClick = function(){
	printMessage("어디 가세요? 실험체님.")
}


////////////////////////////////////////room4(천장)

room4.circle = new Object(room4, 'circle', '검은색원.png')
room4.circle.resize(400)
room4.circle.locate(650, 400)

room4.minicircle = new Object(room4, 'minicircle', '검은색원.png')
room4.minicircle.resize(50)
room4.minicircle.locate(650, 400)

room4.hint = new Object(room4, 'hint', '시계힌트.png')
room4.hint.resize(200)
room4.hint.locate(650, 400)

room4.circle.hide()
room4.hint.hide()

room4.minicircle.onClick = function(){
	if(room7.button.clear == 1){
		printMessage("구멍이 커졌다!")
		room4.circle.show()
		room4.minicircle.hide()
	}
	else{
		printMessage("저기로 나갈 수 있지 않을까???")
	}
}

room4.circle.onClick = function(){
	if(room5.lighter.isHanded()){
		room4.hint.show()
	}
	else{
		printMessage("구멍속이 너무 캄캄하다....")
	}
}














/////////////Arrow
room1.arrow1 = new Arrow(room1, 'arrow1', '화살표1.jpg', 1)  
room1.arrow2 = new Arrow(room1, 'arrow2', '화살표2.jpg', 2)  
room1.arrow3 = new Arrow(room1, 'arrow3', '화살표3.jpg', 3)

room1.arrow1.onClick = function(){
	Game.move(room2)
}
room1.arrow2.onClick = function(){
	Game.move(room4)
}
room1.arrow3.onClick = function(){
	Game.move(room5)
}

room2.arrow1 = new Arrow(room2, 'arrow1', '화살표1.jpg', 1)
room2.arrow2 = new Arrow(room2, 'arrow2', '화살표2.jpg', 2) 
room2.arrow3 = new Arrow(room2, 'arrow3', '화살표3.jpg', 3)

room2.arrow1.onClick = function(){
	Game.move(room3)
}
room2.arrow2.onClick = function(){
	Game.move(room4)
}
room2.arrow3.onClick = function(){
	Game.move(room1)
}

room3.arrow1 = new Arrow(room3, 'arrow1', '화살표1.jpg', 1)  
room3.arrow2 = new Arrow(room3, 'arrow2', '화살표2.jpg', 2)  
room3.arrow3 = new Arrow(room3, 'arrow3', '화살표3.jpg', 3)

room3.arrow1.onClick = function(){
	Game.move(room5)
}
room3.arrow2.onClick = function(){
	Game.move(room4)
}
room3.arrow3.onClick = function(){
	Game.move(room2)
}

room4.arrow1 = new Arrow(room4, 'arrow1', '화살표1.jpg', 1)  
room4.arrow2 = new Arrow(room4, 'arrow2', '화살표2.jpg', 2)  
room4.arrow3 = new Arrow(room4, 'arrow3', '화살표3.jpg', 3)

room4.arrow1.onClick = function(){
	Game.move(room2)
}
room4.arrow2.onClick = function(){
	Game.move(room1)
}
room4.arrow3.onClick = function(){
	Game.move(room5)
}

room5.arrow1 = new Arrow(room5, 'arrow1', '화살표1.jpg', 1)
room5.arrow2 = new Arrow(room5, 'arrow2', '화살표2.jpg', 2)  
room5.arrow3 = new Arrow(room5, 'arrow3', '화살표3.jpg', 3)

room5.arrow1.onClick = function(){
	Game.move(room1)
}
room5.arrow2.onClick = function(){
	Game.move(room4)
}
room5.arrow3.onClick = function(){
	Game.move(room3)
}


Game.start(room1, "괴짜 과학자에게 잡혔다....    빨리 이곳을 벗어나야 겠어!!!")