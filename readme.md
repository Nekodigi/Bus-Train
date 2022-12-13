# Bus-Train
Bus-Trainは、Bus itとJRの時刻表を利用した、バスの遅延をリアルタイム反映することができる乗り換えアプリです。

- [動作デモ](#動作デモ)

# 動作デモ
[動作デモ](https://bushub-d4562.web.app/)
# 機能
バス路線の一部は、Yahoo乗り換えでは遅延が表示されず、Google Mapではそもそもバス停自体が登録されていません。そこでBus itを利用し、遅延をリアルタイムに反映した経路表示を実現しています。
- 拠点からのバス・徒歩での移動経路表示
- 経路保存機能
- 遅延リアルタイム反映機能
- バス・電車の時刻表自動更新
# 設定
このバスアプリは"特定"の拠点からの移動手段表示に特化しているため、使用場面に合わせてFirestoreの値を設定する必要があります。
## Firestoreデータ構造
使用するバス路線、電車に応じて以下の値を入力する必要があります。
```javascript
/path/[priority]{
	type:string:const //walk or bus

	destRef:string:const //firebase dest doc ref

	stop{//bus or train or waypoint format
		id:string:const
		name:string:const  //JP
		refURL:string:const:opt //official site url > fill detail URL
		scheduledDate:const 
		distM:number:const
		date:date:var    //sheduledDate,delay  Date include delay!
		min:number:var   //date   for bus
		danger:number:var //min,distM
	}
	
	from:map{//min danger removed for walk
		stop
	}

	mid:map{//not for walk
		stop
	}

	to:map{
		stop
	}
	
	hash:string:var //identifier md5(from.id+from.scheduledDate)
	delay:number:const
	priority:number:const
	danger:number:var  //timeBetween<distM => 2, timeBetween<(distM*2+5) => 1//+5 for bus, timeBetween>=distM*2 => 0
	lastUpdate:date:var
	//delay>10 => 2 delay>5 => 1 delay<=5 => 0
	//Math.max(danger,...)
}
<priority>
1. toDate less 10min diff is not counted
2. priority
3. danger
```
```javascript
/bus/[stopName]{
	id:string //stopName
	name:string  //JP
	distMBase:number //minimal time to go
}
```
```javascript
/bus/[stopName]/dest/[destName]{
	id:string //destName
	name:string  //JP
	from:string  //usually start id
	to:string    //dest id
	station:string //station id
	distMStation:number //minimal time to go to station
}
```
```javascript
/train/[stopName]{
	name:string //JP
	JRName:string//JR search name
	JRfrom:string//current system can only contain 1 dir
	JRto:string  //,,388(6:stop id)02200(2:dir)(4:end, 1:start)00
	id:string
	departures:[date,...]
	priority:number  //0 = highest
	distMBase:number //minimal time to go from base
	dir1:string //
	refURL:string 

//potential use
	dir2:string//
}
```
```
/.env.local/
NEXT_PUBLIC_API_URL
```