/* Utility functions for happy Statebussing */
function localSave(obj) {
    if (!obj.key) {
        console.log("Tried to save obj without key: " + obj);
    }
    localStorage.setItem(obj.key, JSON.stringify(obj));
}
function localGet(key) {
    var obj = localStorage[key];
    if (obj) {
        x = JSON.parse(obj);
        return x ? x : {};
    } else {
        return {};
    }
}
