# Caida
Venezuelan game card <br><br>

## Usage
To deploy it you will need to create a DB with the [squema.sql](https://github.com/giovam19/CaidaWeb/blob/main/public/styles.css) file and fill the [config.js](https://github.com/giovam19/CaidaWeb/blob/main/config.js) with the access info of your DB.<br>
For example:<br><br>
```
const config = {
    db: {
        host: 'localhost',
        port: '3306',
        user: 'userDB',
        password: 'passDB',
        database: 'nameDB'
    },
};
```
### Execute
* For **Debug** can run the folowing command: ```npm run serve``` where you can make changes and see it in real time pressing **F5**<br>
* For **Start** can run the folowing command: ```npm run start```
