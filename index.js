/* 
   ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    *** NOTE: ***
    The 'unusual data' is placed in its own txt file within the project so that it can be tested anonymously without login.
    This is assuming that building a frontend to collect user login credentials is outside of the intended scope for this challenge, so it is built minimally to satisfy the problem only.
   --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
*/

const fs = require('fs');
const path = require('path');

const src = 'unusual-data.txt'; // data source file containing the unusual data


// PART I --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 

// Read lines from a text file and return them as an array
function readLinesFromTxtFile(filename) {

    try {
        const filePath = path.join(__dirname, filename);
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');
        
        //console.log(`Found ${lines.length} lines in data`);
        //console.log(lines);

        return lines;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

// Checks for unsafe data within the reports 
function checkData() {

    try {
        const data = readLinesFromTxtFile(src); 
        const safeReports = [];
        
        for (const report of data) {    // for each report in the file
            const levels = report.split(' ').map(Number);

            if (levels.length <= 1) {
                safeReports.push(report);
                continue;
            }

            let isIncreasing = null;
            let isSafe = true;

            for (let i = 0; i < levels.length - 1; i++) {   // for each level in the report
                const diff = levels[i + 1] - levels[i];
                
                // Determine initial trend (skip zeros)
                if (isIncreasing === null && diff !== 0) {
                    isIncreasing = diff > 0;
                }

                // Check safety conditions
                if (diff === 0) {
                    isSafe = false; // Flat lines are unsafe
                    break;
                } else if (isIncreasing !== null) {
                    const validStep = Math.abs(diff) >= 1 && Math.abs(diff) <= 3;
                    const validTrend = (isIncreasing && diff > 0) || (!isIncreasing && diff < 0);
                    
                    if (!validStep || !validTrend) {
                        isSafe = false;
                        break;
                    }
                }
            }

            if (isSafe) {
                safeReports.push(report);
            }
        }

        console.log(safeReports.length > 0
            ? `Found ${safeReports.length} safe reports`
            : 'No safe reports found!');
        //console.log(safeReports.join('\n'))   // Uncomment to see all safe reports

        return safeReports;
    } catch (error) {
        console.error('Error analyzing data:', error);
        return [];
    }
}


// PART II --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 

function findSafeReportsWithDampener() {

    try {
        const data = readLinesFromTxtFile(src);
        const safeReports = [];
        
        for (const report of data) {
            const levels = report.split(' ').map(Number);
            
            // Check if already safe without removing any levels
            if (isSequenceSafe(levels)) {
                safeReports.push(report);
                continue;
            }
            
            // Try removing each level once to see if it becomes safe
            let canBeMadeSafe = false;

            for (let i = 0; i < levels.length; i++) {
                const testSequence = [...levels.slice(0, i), ...levels.slice(i + 1)];
                if (isSequenceSafe(testSequence)) {
                    canBeMadeSafe = true;
                    break;
                }
            }
            
            if (canBeMadeSafe) {
                safeReports.push(report);
            }
        }

        console.log(safeReports.length > 0
            ? `Found ${safeReports.length} safe reports with Problem Dampener`
            : 'No safe reports found!');
        //console.log(safeReports.join('\n'))   // Uncomment to see all safe reports

        return safeReports;
    } catch (error) {
        console.error('Error analyzing data:', error);
        return [];
    }
}

// Helper function to check if a sequence is safe
function isSequenceSafe(levels) {

    if (levels.length <= 1) return true;
    
    let isIncreasing = null;
    
    for (let i = 0; i < levels.length - 1; i++) {
        const diff = levels[i + 1] - levels[i];
        
        // Determine initial trend
        if (isIncreasing === null && diff !== 0) {
            isIncreasing = diff > 0;
        }
        
        // Check safety conditions
        if (diff === 0) {
            return false; // Flat lines are unsafe
        } else if (isIncreasing !== null) {
            const validStep = Math.abs(diff) >= 1 && Math.abs(diff) <= 3;
            const validTrend = (isIncreasing && diff > 0) || (!isIncreasing && diff < 0);
            
            if (!validStep || !validTrend) {
                return false;
            }
        }
    }
    
    return true;
}


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- 
// MAIN EXECUTION

// Part I (https://adventofcode.com/2024/day/2)
checkData();

// Part II (https://adventofcode.com/2024/day/2#part2)
findSafeReportsWithDampener() 
