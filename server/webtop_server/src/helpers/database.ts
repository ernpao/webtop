require('dotenv').config()
import moment from "moment";
import { promisify } from "util";
const mysql = require('mysql');

export function storeWsData(
    sender?: string,
    type?: string,
    category?: string,
    topic?: string,
    body?: string,
    created?: Date,
) {
    const timestamp = (created ? created : new Date());
    const _created = `'${moment(timestamp).utc().format('YYYY-MM-DD HH:mm:ss.SSS')}'`;
    const _sender = sender ? `'${sender}'` : null;
    const _type = type ? `'${type}'` : null;
    const _category = category ? `'${category}'` : null;
    const _topic = topic ? `'${topic}'` : null;
    const _body = body ? `'${body}'` : null;
    const queryStr = `INSERT INTO ws_data (sender, type, category, topic, body, created) VALUES (${_sender}, ${_type}, ${_category}, ${_topic}, ${_body}, ${_created})`;
    query(queryStr, (err: any, results: any, fields: any) => {
        if (err) {
            console.log(err)
        }
    });
}

export async function getWsDataSenders() {
    var results: any[] = [];
    var rows: any[] = await promiseQuery("SELECT DISTINCT(sender) FROM ws_data");
    rows.map(function (row) {
        results.push(row.sender);
    })
    return results;
}

export async function getWsDataDataSets(sender: string) {
    var results: any[] = [];
    var rows: any[] = await promiseQuery(`SELECT body FROM ws_data WHERE sender="${sender}"`);
    rows.map(function (row) {
        console.log(row.body)
        const bodyJson = JSON.parse(row.body)
        const dataSetId = bodyJson.dataSet.id;
        if (!results.includes(dataSetId)) {
            results.push(dataSetId);
        }
    })
    return results;
}

export async function getWsDataDataSetData(sender: string, dataSetId: string) {
    var results: any[] = [];
    var rows: any[] = await promiseQuery(`SELECT body, created FROM ws_data WHERE sender="${sender}" AND body LIKE "%${dataSetId}%" ORDER BY created ASC`);
    rows.map(function (row) {
        const bodyJson = JSON.parse(row.body)
        const created = row.created
        const accelData = bodyJson.accelerometer;
        const gyroData = bodyJson.gyroscope;
        results.push({
            timestamp: created,
            accelerometer: {
                x: accelData.x,
                y: accelData.y,
                z: accelData.z
            },
            gyroscope: {
                x: gyroData.x,
                y: gyroData.y,
                z: gyroData.z
            }
        });
    })
    return results;
}


async function promiseQuery(queryString: string): Promise<any> {
    const promisifyQuery = promisify(query)
    const results = await promisifyQuery(queryString);
    return results;
}

function query(queryString: string, callback?: Function) {

    var _connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    });

    _connection.connect((err: any) => {
        // console.log("Connecting to the database...");
        if (err) {
            console.log(`\n${new Date()}\nAn error occured while attempting to connect to the database: ${err}\n`)
            if (callback) {
                callback(err, null, null)
            }
        } else {
            // console.log(`\n${new Date()}\nSuccessfully connected to the database.\nRunning query: ${queryString}\n`)
            _connection.query(queryString, (err: any, results: any, fields: any) => {
                if (callback) {
                    callback(err, results, fields)
                }
                _connection.end();
            })
        }
    })

}
