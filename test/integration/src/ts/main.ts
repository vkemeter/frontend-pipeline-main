console.log('yolo')
let x: string | number
if (Math.random() > 0.5) {
    x = 'hallo'
} else {
    x = 12
}

const getData = async () => {
    const response = await fetch('https://github.com/TypeStrong/ts-node/blob/main/tsconfig.json');
    const responseValue = await response.json();
    console.log(responseValue)
}

getData().then(() => {
    console.log("hallo");
}).catch(err => console.error)
