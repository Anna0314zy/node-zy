const p = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('ok')
    }, 1000)
});
const a = async () => {
    try{
        const res = await p();
        console.log(res);
        return res;
    }catch(e) {
        console.log(e, 'cuo l ');
        return Promise.reject(e);
    }
}
const b = async () => {
    try{
      const res = await a();
      console.log(res, 'b--');
    }catch(e) {
        console.log(e, 'b-error ');
    }
}
b();