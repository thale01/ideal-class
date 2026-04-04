const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.VERCEL 
    ? path.join('/tmp', 'mock_data.json')
    : path.join(__dirname, 'mock_data.json');

const loadData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = { subjects: [], admissions: [], students: [], fees: [], toppers: [], updates: [] };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
        return initial;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    get: (key) => loadData()[key],
    save: (key, item) => {
        const data = loadData();
        const newItem = { ...item, _id: Date.now().toString() };
        data[key].push(newItem);
        saveData(data);
        return newItem;
    },
    update: (key, id, updateFn) => {
        const data = loadData();
        const idx = data[key].findIndex(i => i._id === id);
        if (idx !== -1) {
            data[key][idx] = updateFn(data[key][idx]);
            saveData(data);
            return data[key][idx];
        }
    },
    remove: (key, id) => {
        const data = loadData();
        data[key] = data[key].filter(i => i._id !== id);
        saveData(data);
    }
};
