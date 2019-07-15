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

// 获取URL的查询参数
// ? foo = bar & baz=bing => { foo: bar, baz: bing }
// 获取URL的查询参数
location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v)

// 随机更改数组元素顺序，混淆数组
const mix = (arr) => arr.slice().sort(() => Math.random() - 0.5)
/*
let a = (arr) => arr.slice().sort(() => Math.random() - 0.5)
let b = a([1,2,3,4,5])
console.log(b)
*/

// 生成随机十六进制代码 如：'#c618b2'
'#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');