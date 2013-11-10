"use strict";

module.exports = parse;

var meta = /\bmeta\((?:[^")]*|".*")+\)/g;

function parse (js) {
    var data = js.match(meta) || [];
    return data.map(deserialize);
}

function deserialize (data) {
    try {
        return JSON.parse(data.slice(5, -1));
    } catch (error) {
        throw new Error("Parse failed. Ensure meta data is valid JSON."); 
    }
}