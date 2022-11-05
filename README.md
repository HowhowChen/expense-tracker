# expense-tracker

## 畫面預覽

![image](https://user-images.githubusercontent.com/106914854/200115432-26df0a93-73a2-43fb-bb6c-f16e5082e899.png)

![image](https://user-images.githubusercontent.com/106914854/200115503-79a6e4ed-67d7-4ea2-b27c-a7df39c7deda.png)

![image](https://user-images.githubusercontent.com/106914854/200115481-b9c0b8ec-3b2c-4695-a5cc-6bbbed031cc6.png)

![image](https://user-images.githubusercontent.com/106914854/200115362-fb7c2b96-046a-4e94-92d9-5ae81c526fdb.png)

![image](https://user-images.githubusercontent.com/106914854/200115398-4224edf0-4da7-415b-b6a8-9dd5be4ecb8a.png)

## 特色
- 除了可以自己建立帳號外，另外提供Facebook, Google等第三方認證登入
- 提供找回密碼功能，該功能將寄出重設密碼驗證信到您的Email
- 提供記帳服務，登入自己帳號後，可以對自己的record進行增、刪、改、查等功能
- 可按照類別顯示該類別的records
- 提供排序日期、金額等功能

## 啟動專案

1. Clone 此專案至本機電腦，打開 terminal 至欲存放專案之資料夾，輸入下列代碼 
```
git clone https://github.com/HowhowChen/expense-tracker.git
```
2. 進入專案資料夾，請在終端機輸入：
```
cd expense-tracker
```
3. 安裝 npm 套件，請在終端機輸入：
```
npm install
```
4. 安裝nodemon
```
npm i nodemon
```

5. 建立檔案.env，將環境變數寫入其中(相關變數請參考.env.example)

6. 使用種子資料，請在終端機輸入：

```
npm run seed
```

7. 執行專案，請在終端機輸入：
```
npm run dev
```

8. 輸入下列代碼於**網址列**即可使用
```
localhost:3000
```

9. 若欲暫停使用：

```
ctrl + c

```

## 使用技術
- node @ 14.16.0
- express @ 4.17.1
- mongoose @ 5.9.7
- express-handlebars @ 4.0.2
- 詳情請參閱package.json


## 開發者
Howhow Chen
