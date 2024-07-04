import {ANDROID_DATABASE_PATH, IOS_LIBRARY_PATH, open} from '@op-engineering/op-sqlite';
import {Platform} from "react-native";


const db = open({name:'data', location: Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH,});

 db.execute( 'DROP TABLE IF EXISTS Benchmark');
 db.execute( 'CREATE TABLE IF NOT EXISTS Benchmark(value VARCHAR(30))');
 db.execute( 'INSERT INTO Benchmark (value) VALUES (:value)', [
     'hello',
 ]);

export function getFromSQLite(){

    try {
        let { rows } = db.execute('SELECT * FROM `Benchmark`');
        if (rows == null || rows.length < 1) {
            throw new Error(`Failed to get Values!`);
        }

        const row = rows.item(0);
        return row.value;
    } catch (e: any) {
        console.error('Something went wrong executing SQL commands:', e.message);
    }

}
