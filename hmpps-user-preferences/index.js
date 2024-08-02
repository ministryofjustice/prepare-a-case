const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./preferences.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the preferences database.');
});

app.use(express.json());

app.get('/users/:userId/preferences/:preferenceName', (req, res) => {
    const { userId, preferenceName } = req.params;
    db.all('SELECT * FROM preference WHERE hmpps_user_id = ? and name = ?', [userId, preferenceName], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal server error');
        } else if (!rows) {
            res.status(404).send('Preference not found');
        } else {
            res.send({ items: rows.map(row => row.value) });
        }
    });
});

app.put('/users/:userId/preferences/:preferenceName', (req, res) => {
    const { userId, preferenceName } = req.params;
    const { items } = req.body;
    if (!items) {
        res.status(400).send('Items are required');
    } else {

        const deleteSql = 'DELETE FROM preference WHERE hmpps_user_id = ? and name = ?'

        db.run(deleteSql, [userId, preferenceName], function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal server error');
            } else {
                let putSql = 'INSERT INTO preference (hmpps_user_id, name, value) VALUES '
                for (let i = 0; i < items.length; i++) {
                    putSql += `('${userId}', '${preferenceName}', '${items[i]}')${i !== items.length - 1 ? ',' : ''}`
                }
                db.run(putSql, function (err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send('Internal server error');
                    } else {
                        res.status(200).send('Preferences updated')
                    }
                })
            }
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});