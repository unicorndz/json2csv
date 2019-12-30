'use strict';

const fs = require('fs');
const path = require('path');

let workspace  = '';
let inputFolder  = workspace + '/input';
let outputFolder = workspace + '/output';
let archivingFolder = workspace + '/archive';

// process args
process.argv.forEach(function (arg, index, array) {
    if (array.length<3) {
        console.error('Please provide an existing workspace folder');
        process.exit();
    } else {
        if (index==2 && !arg.includes('workspace')) {
            console.log('please provide workspace folder under the following form : \n node app.js workspace=\'YOUR_WOKSPACE_FOLDER\'');
            process.exit();
        } 
        
        if (index==2 && arg.includes('workspace')) {
            workspace = arg.split('=')[1];
            inputFolder  = workspace + '/input';
            outputFolder = workspace + '/output';
            archivingFolder = workspace + '/archive';
            
            // create folders if doesn't exist
            if (!fs.existsSync(workspace)) {
                fs.mkdirSync(workspace)
                console.log('workspace created')
            }
            
            if (!fs.existsSync(inputFolder)) {
                fs.mkdirSync(inputFolder)
                console.log('inputFolder created')
            }

            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder)
                console.log('outputFolder created')
            }


            if (!fs.existsSync(archivingFolder)) {
                fs.mkdirSync(archivingFolder)
                console.log('archivingFolder created')
            }
        }

    }

  });

// read input folder
fs.readdirSync(inputFolder).forEach(jsonFile => {
    if (fs.lstatSync(path.join(inputFolder, jsonFile)).isFile()) {
        console.log('processing ' + jsonFile + ' ...');

        let rawdata = fs.readFileSync(`${inputFolder}/${jsonFile}`);
        let obj = JSON.parse(rawdata);
        var result = '';
        
        result += obj.source.street;
        result += ';';
        
        result += obj.taskId;
        result += ';';
        
        result += obj.type;
        result += ';';
        
        result += obj.driver;
        result += ';';
        
        result += obj.status;
        result += ';';
        
        if (obj.source.location.geometry.length > 0) {
            result += obj.source.location.geometry[0];
            result += ';';
            result += obj.source.location.geometry[1];
        }
        
        let csvFilename = jsonFile.substr(0,jsonFile.length-5) + ".csv";
        fs.writeFileSync(`${outputFolder}/${csvFilename}`, result);

        // archive file
        fs.rename(`${inputFolder}/${jsonFile}`, `${archivingFolder}/${csvFilename}`, function (err) {
            if (err) {
                console.error(err);
                process.exit();
            }
            console.log('Successfully archived json file!')
          })
    }

  });

// parse files
// if file , process

