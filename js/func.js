// 首字母大写
const capsFirst = str => {
    let arr = str.split('');
    arr[0] = arr[0].toUpperCase();
    return arr.join('');
};
// 下划线命名转驼峰
const changeFieldName = (data) => {
    for (let i in data) {
        let newField = i.split('_');
        let str = '';
        for (let i in newField) {
            if (i > 0) {
                str += capsFirst(newField[i]);
            } else {
                str += newField[i];
            }
        }
        data[str] = data[i];
    }
    return data;
};
