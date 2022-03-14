const convert2tablebysplit = (lines: string[]) => {
    let count = 9999; // 最小列数

    lines.forEach(line => {
        count = Math.min(count, line.split(/[\s|]+/).length);
    })
    
    let headers: string[] = [];
    
    let first_line = lines[0].split(/[\s|]+/);

    for (let i = 0; i < first_line.length; i++) {
        if (i < count) {
            headers.push(first_line[i]);
        } else {
            headers[headers.length - 1] = `${headers[headers.length - 1]} ${first_line[i]}`;
        }
    }

    let column_width: Int16Array = new Int16Array(count);

    lines.forEach(line => {
        let sline = line.split(/[\s|]+/);
        let last_width = 0;
        for (let i = 0; i < sline.length; i++) {
            if (i < count-1) {
                column_width[i] = Math.max(column_width[i], sline[i].length);
            } else {
                last_width += sline[i].length + 1;
            }
        }
        column_width[count - 1] = Math.max(column_width[count - 1], last_width);
    })

    lines.splice(0, 1);

    let res = [];

    let tp = '';
    for(let i = 0; i < count; i++) {
        tp += '|';
        console.log(column_width[i], headers[i].length);
        tp += ' '.repeat((column_width[i] - headers[i].length) / 2);
        tp += headers[i];
        tp += ' '.repeat(Math.ceil((column_width[i] - headers[i].length) / 2));
    }
    res.push(tp + '|');

    tp = '';
    for (let i = 0; i < count; i++) {
        tp += '|';
        tp += '-'.repeat(column_width[i]);
    }
    res.push(tp + '|')

    lines.forEach(line => {
        let sline = line.split(/[\s|]+/);
        let last = '';
        tp = '';
        for (let i = 0; i < sline.length; i++) {
            if (i < count-1) {
                tp += '|';
                tp += ' '.repeat((column_width[i] - sline[i].length) / 2);
                tp += sline[i];
                tp += ' '.repeat(Math.ceil((column_width[i] - sline[i].length) / 2));
            } else {
                last += ' ' + sline[i]
            }
        }
        last = last.slice(1);
        tp += '|';
        tp += ' '.repeat((column_width[count - 1] - last.length) / 2);
        tp += last;
        tp += ' '.repeat(Math.ceil((column_width[count - 1] - last.length) / 2));
        res.push(tp + '|');
    })

    return res;
}

const convert2tablebyalign = (lines: string[]) => {
    let max_width = 0;

    lines.forEach(line => {
        max_width = Math.max(max_width, line.length);
    });

    let table = new Array<string[]>(lines.length);
    for (let i = 0; i < lines.length; i++) {
        table[i] = [''];
    }

    let flag: boolean = true, prev_flag: boolean;
    for (let j = 0; j < max_width; j++) {
        prev_flag = flag;
        flag = true;
        for (let i = 0; i < lines.length; i++) {
            if(j < lines[i].length) {
                if (!/[\s|]/.test(lines[i][j])) {
                    flag = false;
                    break;
                }
            } else if (i == 0) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            console.log(table);
            for (let i = 0; i < lines.length; i++) {
                if (j < lines[i].length) {
                    table[i][table[i].length - 1] += lines[i][j];
                }
            }
        } else {
            if (!prev_flag) {
                for (let i = 0; i < lines.length; i++) {
                    table[i].push('');
                }
            }
        }
    }

    let count = table[0].length;
    let column_width: Int16Array = new Int16Array(count);

    table.forEach(line => {
        for (let i = 0; i < line.length; i++) {
            column_width[i] = Math.max(column_width[i], line[i].length);
        }
    })

    lines.splice(0, 1);

    let res = [];
    
    let tp = '';
    for(let i = 0; i < count; i++) {
        tp += '|';
        tp += ' '.repeat((column_width[i] - table[0][i].length) / 2);
        tp += table[0][i];
        tp += ' '.repeat(Math.ceil((column_width[i] - table[0][i].length) / 2));
    }
    res.push(tp + '|');

    tp = '';
    for (let i = 0; i < count; i++) {
        tp += '|';
        tp += '-'.repeat(column_width[i]);
    }
    res.push(tp + '|');

    table.splice(0, 1);

    table.forEach(line => {
        tp = '';
        for (let i = 0; i < line.length; i++) {
            tp += '|';
            tp += ' '.repeat((column_width[i] - line[i].length) / 2);
            tp += line[i];
            tp += ' '.repeat(Math.ceil((column_width[i] - line[i].length) / 2));
        }
        res.push(tp + '|');
    })

    return res;
}

export const convert2table = (data: string, mode: string) => {
    let lines = data.split(/\r\n|\n|\r/);
    let spaces = new Array<string>(lines.length);
    for (let i = 0; i < lines.length; i++) {
        let j;
        spaces[i] = '';
        for (j = 0; j < lines[i].length; j++) {
            if (/\s/.test(lines[i][j])) {
                spaces[i] += lines[i][j];
            } else {
                break
            }
        }
        lines[i] = lines[i].trim();
    }

    let res = '', table;

    if (mode === 'split') {
        table = convert2tablebysplit(lines);
    } else if (mode === 'align') {
        table = convert2tablebyalign(lines);
    } else {
        throw Error('no mode');
    }
    res += spaces[0] + table[0] + '\r\n';
    res += spaces[1] + table[1] + '\r\n';
    for (let i = 2; i < table.length; i++) {
        res += spaces[i-1] + table[i] + '\r\n';
    }
    return res;
}