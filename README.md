# Caida
Venezuelan card game <br><br>

## Usage
To deploy it you will need to create a DB with the [squema.sql](https://github.com/giovam19/CaidaWeb/blob/main/db/squema.sql) file and fill the [config.js](https://github.com/giovam19/CaidaWeb/blob/main/config.js) with the access info for your DB.<br>
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
* For **Debug** can run the folowing command: ```npm run serve``` where you can make changes and see it refreshing **F5**<br>
* For **Start** can run the folowing command: ```npm run start```
